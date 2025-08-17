<?php
require_once 'hgm_db.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json; charset=UTF-8');

// Enable error logging
ini_set('display_errors', 1);
ini_set('log_errors', 1);
error_log("Starting student registration process");

// Function to handle file upload
function handleFileUpload($file, $type) {
    error_log("Attempting to upload file of type: " . $type);
    error_log("File details: " . print_r($file, true));
    
    $target_dir = "uploads/";
    if (!file_exists($target_dir)) {
        error_log("Creating uploads directory");
        mkdir($target_dir, 0777, true);
    }

    $file_extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $file_name = uniqid() . '_' . $type . '.' . $file_extension;
    $target_file = $target_dir . $file_name;
    error_log("Target file path: " . $target_file);

    if (move_uploaded_file($file['tmp_name'], $target_file)) {
        return $file_name;
    }
    return false;
}

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Invalid request method');
}

try {
    error_log("=== Starting Database Connection ===");
    $database = new Database();
    $db = $database->getConnection();
    error_log("Database connection successful");
    
    // Get POST data
    $data = $_POST;
    error_log("=== Received Form Data ===");
    error_log("POST data: " . print_r($data, true));
    error_log("FILES data: " . print_r($_FILES, true));
    error_log("Request Headers: " . print_r(getallheaders(), true));

    // Validate required fields
    $required_fields = ['name', 'age', 'k_id'];
    foreach ($required_fields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            sendError("Missing required field: $field");
        }
    }

    // Get kendra details to get sector and pariyojna IDs
    error_log("=== Fetching Kendra Details ===");
    error_log("Kendra ID from request: " . $data['k_id']);
    
    $kendraQuery = "SELECT k.k_id, k.ks_id, k.kp_id, s.sp_id 
                    FROM master_kendra k 
                    JOIN master_sector s ON k.ks_id = s.s_id 
                    WHERE k.k_id = :k_id";
    error_log("Executing query: " . $kendraQuery);
    
    $kendraStmt = $db->prepare($kendraQuery);
    $kendraStmt->bindParam(':k_id', $data['k_id']);
    $kendraStmt->execute();
    $kendraInfo = $kendraStmt->fetch(PDO::FETCH_ASSOC);
    error_log("Kendra info retrieved: " . print_r($kendraInfo, true));

    if (!$kendraInfo) {
        sendError('Invalid Kendra ID');
    }

    // Start transaction
    $db->beginTransaction();

    // Insert into master_student table
    $studentQuery = "INSERT INTO master_student (
        sp_id, ss_id, sk_id, s_name, s_mobile, s_father, s_mother,
        s_height, s_weight, s_age, s_dob, s_healtha_status, s_address
    ) VALUES (
        :sp_id, :ss_id, :sk_id, :name, :mobile, :father_name, :mother_name,
        :height, :weight, :age, :dob, :health_status, :address
    )";

    $studentStmt = $db->prepare($studentQuery);

    // Bind student data
    $studentStmt->bindParam(':sp_id', $kendraInfo['sp_id']); // Pariyojna ID from sector
    $studentStmt->bindParam(':ss_id', $kendraInfo['ks_id']); // Sector ID from kendra
    $studentStmt->bindParam(':sk_id', $kendraInfo['k_id']); // Kendra ID
    $studentStmt->bindParam(':name', $data['name']);
    $studentStmt->bindParam(':mobile', $data['mobile']);
    $studentStmt->bindParam(':father_name', $data['fatherName']);
    $studentStmt->bindParam(':mother_name', $data['motherName']);
    $studentStmt->bindParam(':height', $data['height']);
    $studentStmt->bindParam(':weight', $data['weight']);
    $studentStmt->bindParam(':age', $data['age']);
    $studentStmt->bindParam(':dob', $data['dob']);
    $studentStmt->bindParam(':health_status', $data['healthStatus']);
    $studentStmt->bindParam(':address', $data['address']);

    error_log("=== Executing Student Insert ===");
    error_log("Student data to insert: " . print_r([
        'sp_id' => $kendraInfo['sp_id'],
        'ss_id' => $kendraInfo['ks_id'],
        'sk_id' => $kendraInfo['k_id'],
        'name' => $data['name'],
        'mobile' => $data['mobile'],
        'father_name' => $data['fatherName'],
        'mother_name' => $data['motherName'],
        'height' => $data['height'],
        'weight' => $data['weight'],
        'age' => $data['age'],
        'dob' => $data['dob'],
        'health_status' => $data['healthStatus'],
        'address' => $data['address']
    ], true));
    
    $studentStmt->execute();
    $studentId = $db->lastInsertId();
    error_log("Student inserted successfully with ID: " . $studentId);

    // Handle pledge photo upload (certificate)
    if (isset($_FILES['pledgePhoto'])) {
        $pledgePhotoName = handleFileUpload($_FILES['pledgePhoto'], 'certificate');
        if ($pledgePhotoName) {
            $photoQuery = "INSERT INTO child_photo (
                cs_id, ck_id, photo_url, photo_type, latitude, longitude
            ) VALUES (
                :student_id, :kendra_id, :photo_url, 'certificate', :latitude, :longitude
            )";

            $photoStmt = $db->prepare($photoQuery);
            $photoStmt->bindParam(':student_id', $studentId);
            $photoStmt->bindParam(':kendra_id', $kendraInfo['k_id']);
            $photoStmt->bindParam(':photo_url', $pledgePhotoName);
            $latitude = floatval($data['latitude']);
            $longitude = floatval($data['longitude']);
            $photoStmt->bindParam(':latitude', $latitude);
            $photoStmt->bindParam(':longitude', $longitude);
            $photoStmt->execute();
        }
    }

    // Handle plant distribution photo
    if (isset($_FILES['plantPhoto'])) {
        $plantPhotoName = handleFileUpload($_FILES['plantPhoto'], 'distribution');
        if ($plantPhotoName) {
            $photoQuery = "INSERT INTO child_photo (
                cs_id, ck_id, photo_url, photo_type, latitude, longitude
            ) VALUES (
                :student_id, :kendra_id, :photo_url, 'distribution', :latitude, :longitude
            )";

            $photoStmt = $db->prepare($photoQuery);
            $photoStmt->bindParam(':student_id', $studentId);
            $photoStmt->bindParam(':kendra_id', $kendraInfo['k_id']);
            $photoStmt->bindParam(':photo_url', $plantPhotoName);
            $latitude = floatval($data['latitude']);
            $longitude = floatval($data['longitude']);
            $photoStmt->bindParam(':latitude', $latitude);
            $photoStmt->bindParam(':longitude', $longitude);
            $photoStmt->execute();
        }
    }

    // Commit transaction
    $db->commit();

    sendSuccess('Student registered successfully', [
        'studentId' => $studentId,
        'message' => 'छात्र सफलतापूर्वक पंजीकृत हो गया!'
    ]);

} catch(PDOException $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    sendError('Database error: ' . $e->getMessage(), 500);
} catch(Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    sendError('Error: ' . $e->getMessage(), 500);
}
?>
