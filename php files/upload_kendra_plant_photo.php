<?php
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', 'php_errors.log');

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

require_once 'hgm_db.php';

try {
    error_log("=== Starting plant photo upload process ===");

    // Log request data
    error_log("POST Data: " . print_r($_POST, true));
    error_log("FILES Data: " . print_r($_FILES, true));

    // Check for either file upload or base64 image data
    $imageData = null;
    $imageExtension = 'jpg';

    if (isset($_FILES['photo'])) {
        error_log("Processing uploaded file");
        $imageData = file_get_contents($_FILES['photo']['tmp_name']);
        $imageInfo = pathinfo($_FILES['photo']['name']);
        $imageExtension = strtolower($imageInfo['extension'] ?? 'jpg');
    } elseif (isset($_POST['image_data'])) {
        error_log("Processing base64 image data");
        // Remove data URL prefix if present
        $base64Data = $_POST['image_data'];
        if (strpos($base64Data, 'data:image/') === 0) {
            $base64Data = substr($base64Data, strpos($base64Data, ',') + 1);
        }
        $imageData = base64_decode($base64Data);
        
        // Validate decoded image data
        if (!$imageData) {
            error_log("Error: Invalid base64 image data");
            throw new Exception('अमान्य छवि डेटा');
        }
    } else {
        error_log("Error: No photo data found in request");
        throw new Exception('कोई फोटो नहीं मिली');
    }

    // Get form data
    $kendraId = $_POST['kendra_id'] ?? null;
    $plantNumber = $_POST['plant_id'] ?? null; // Changed to match the parameter name
    $latitude = $_POST['latitude'] ?? null;
    $longitude = $_POST['longitude'] ?? null;

    error_log("Received Data - Kendra ID: $kendraId, Plant Number: $plantNumber, Lat: $latitude, Long: $longitude");

    // Validate required fields
    if (!$kendraId || !$plantNumber) {
        throw new Exception('आवश्यक जानकारी गायब है');
    }

    // Convert to appropriate types
    $kendraId = (int)$kendraId;
    $plantNumber = (int)$plantNumber;
    $latitude = $latitude ? (float)$latitude : null;
    $longitude = $longitude ? (float)$longitude : null;

    // Create uploads directory if it doesn't exist
    $uploadDir = 'uploads/';
    if (!file_exists($uploadDir)) {
        error_log("Creating uploads directory: $uploadDir");
        if (!mkdir($uploadDir, 0777, true)) {
            error_log("Error: Failed to create uploads directory");
            throw new Exception('फोटो अपलोड डायरेक्टरी बनाने में त्रुटि');
        }
    }

    // Save image data to file
    $fileName = uniqid() . '.' . $imageExtension;
    $targetPath = $uploadDir . $fileName;
    
    error_log("Attempting to save file: $targetPath");
    
    if (!file_put_contents($targetPath, $imageData)) {
        error_log("Error: Failed to save image data to file");
        throw new Exception('फोटो सहेजने में त्रुटि हुई');
    }
    error_log("File successfully saved to: $targetPath");

    // Connect to database
    try {
        $db = new Database();
        $conn = $db->getConnection();
        
        if (!$conn) {
            throw new Exception('डेटाबेस से कनेक्ट करने में असमर्थ');
        }
    } catch (Exception $e) {
        error_log("Database connection failed: " . $e->getMessage());
        throw new Exception('डेटाबेस कनेक्शन में त्रुटि');
    }

    // Validate kendra ID exists in master_kendra table
    $validateStmt = $conn->prepare("SELECT k_id FROM master_kendra WHERE k_id = :kendraId LIMIT 1");
    $validateStmt->bindParam(':kendraId', $kendraId, PDO::PARAM_INT);
    
    if (!$validateStmt->execute()) {
        throw new Exception('आंगनवाड़ी ID सत्यापित करने में त्रुटि');
    }

    if ($validateStmt->rowCount() === 0) {
        throw new Exception('अमान्य आंगनवाड़ी ID');
    }

    // Validate plant number is between 1 and 10
    if ($plantNumber < 1 || $plantNumber > 10) {
        throw new Exception('अमान्य पौधा संख्या। कृपया 1 से 10 के बीच का नंबर चुनें।');
    }

    // Start transaction
    $conn->beginTransaction();

    try {
        error_log("Starting database operations with transaction");

        // Insert into plant_photo_k table
        $stmt = $conn->prepare("
            INSERT INTO plant_photo_k (
                pk_id, 
                photo_url, 
                plant_number,
                latitude,
                longitude,
                created_at,
                updated_at
            ) VALUES (:kendraId, :photoUrl, :plantNumber, :latitude, :longitude, NOW(), NOW())
        ");

        $photoUrl = $fileName;  // Store just the filename
        error_log("Generated photo URL: $photoUrl");
        
        $stmt->bindParam(':kendraId', $kendraId, PDO::PARAM_INT);
        $stmt->bindParam(':photoUrl', $photoUrl);
        $stmt->bindParam(':plantNumber', $plantNumber, PDO::PARAM_INT);
        $stmt->bindParam(':latitude', $latitude);
        $stmt->bindParam(':longitude', $longitude);

        error_log("Bound parameters: KendraID=$kendraId, PlantNumber=$plantNumber, Lat=$latitude, Long=$longitude");

        if (!$stmt->execute()) {
            $error = $stmt->errorInfo();
            error_log("Database insert error: " . print_r($error, true));
            throw new Exception('डेटाबेस में फोटो जोड़ने में त्रुटि: ' . $error[2]);
        }
        error_log("Photo record inserted successfully");

        // Update counter in a separate query
        $updateStmt = $conn->prepare("
            UPDATE plant_photo_k 
            SET counter = (
                SELECT photo_count FROM (
                    SELECT COUNT(*) as photo_count
                    FROM plant_photo_k 
                    WHERE pk_id = :kendraId AND plant_number = :plantNumber
                ) AS count_query
            )
            WHERE pk_id = :kendraId AND plant_number = :plantNumber
        ");
        
        error_log("Updating photo counter for Kendra $kendraId, Plant $plantNumber");

        $updateStmt->bindParam(':kendraId', $kendraId, PDO::PARAM_INT);
        $updateStmt->bindParam(':plantNumber', $plantNumber, PDO::PARAM_INT);
        
        if (!$updateStmt->execute()) {
            throw new Exception('फोटो काउंटर अपडेट करने में त्रुटि');
        }

        // Get the current count
        $countStmt = $conn->prepare("
            SELECT COUNT(*) as counter
            FROM plant_photo_k 
            WHERE pk_id = :kendraId AND plant_number = :plantNumber
        ");

        $countStmt->bindParam(':kendraId', $kendraId, PDO::PARAM_INT);
        $countStmt->bindParam(':plantNumber', $plantNumber, PDO::PARAM_INT);
        
        if (!$countStmt->execute()) {
            throw new Exception('फोटो काउंटर प्राप्त करने में त्रुटि');
        }

        $counter = $countStmt->fetch(PDO::FETCH_ASSOC)['counter'];

        // Commit transaction
        $conn->commit();
        error_log("Transaction committed successfully");

        // Return success response
        $response = [
            'success' => true,
            'message' => 'फोटो सफलतापूर्वक अपलोड की गई',
            'data' => [
                'photo_url' => $photoUrl,  // Changed to match the field name used in upload_plant_photo.php
                'plantNumber' => $plantNumber,
                'counter' => $counter
            ]
        ];

        error_log("Sending success response: " . print_r($response, true));

        // Ensure clean output buffer
        if (ob_get_length()) ob_clean();
        
        // Return success response with proper encoding
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        error_log("=== Plant photo upload process completed successfully ===");

    } catch (Exception $e) {
        // Rollback transaction on error
        $conn->rollback();
        error_log("Transaction rolled back due to error: " . $e->getMessage());
        error_log("Stack trace: " . $e->getTraceAsString());
        throw $e;
    }

} catch (Exception $e) {
    error_log("=== Error in plant photo upload process ===");
    error_log("Error message: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    error_log("POST data: " . print_r($_POST, true));
    if (isset($_FILES['photo'])) {
        error_log("File upload data: " . print_r($_FILES['photo'], true));
    }
    
    // Ensure clean output buffer
    if (ob_get_length()) ob_clean();
    
    // Return error response
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);

    error_log("=== Plant photo upload process failed ===");
}
?>
