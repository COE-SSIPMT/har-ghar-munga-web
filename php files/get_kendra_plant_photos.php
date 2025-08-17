<?php
// Disable error display but log them
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', 'php_errors.log');

require_once 'config.php';

$plants = [];
$existingPlants = [];

// Ensure no output has been sent before
if (headers_sent($filename, $linenum)) {
    error_log("Headers already sent in $filename on line $linenum");
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal Server Error'
    ]);
    exit;
}

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Content-Type: application/json; charset=utf-8');

require_once 'hgm_db.php';

try {
    // Get kendra ID from query params
    $kendraId = $_GET['k_id'] ?? null;

    if (!$kendraId) {
        throw new Exception('आंगनवाड़ी ID आवश्यक है');
    }

    // Connect to database
    $db = new Database();
    $conn = $db->getConnection();
    if (!$conn) {
        throw new Exception('डेटाबेस से कनेक्ट करने में असमर्थ');
    }

    // Validate kendra ID exists
    $validateStmt = $conn->prepare("SELECT k_id FROM master_kendra WHERE k_id = :kendraId LIMIT 1");
    $validateStmt->bindParam(':kendraId', $kendraId, PDO::PARAM_INT);
    $validateStmt->execute();

    if ($validateStmt->rowCount() === 0) {
        throw new Exception('अमान्य आंगनवाड़ी ID');
    }

    // Get all plant photos for this kendra
    $stmt = $conn->prepare("
        SELECT 
            plant_number,
            GROUP_CONCAT(
                JSON_OBJECT(
                    'photoUrl', photo_url,
                    'uploadDate', created_at,
                    'latitude', COALESCE(latitude, 0),
                    'longitude', COALESCE(longitude, 0)
                )
                SEPARATOR ','
            ) as photos,
            MAX(counter) as photo_count,
            MAX(created_at) as last_photo_date,
            DATE_ADD(MAX(created_at), INTERVAL 15 DAY) as next_photo_date
        FROM plant_photo_k
        WHERE pk_id = :kendraId
        GROUP BY plant_number
        ORDER BY plant_number ASC
    ");
    $stmt->bindParam(':kendraId', $kendraId, PDO::PARAM_INT);
    $stmt->execute();

    $plants = [];
    $existingPlants = [];
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Decode photos JSON
        $photosArray = $row['photos'] ? json_decode('[' . $row['photos'] . ']', true) : [];
        $formattedPhotos = [];
        foreach ($photosArray as $photo) {
            // FIX ✅ avoid duplicate URL
            $formattedPhotos[] = Config::getUploadUrl($photo['photoUrl']);
        }

        $plants[] = [
            'id' => (int)$row['plant_number'],
            'name' => 'पौधा ' . $row['plant_number'],
            'plantNumber' => (int)$row['plant_number'],
            'photos' => $formattedPhotos,
            'photoCount' => (int)$row['photo_count'],
            'lastPhotoDate' => $row['last_photo_date'],
            'nextPhotoDate' => $row['next_photo_date']
        ];
        $existingPlants[] = (int)$row['plant_number'];
    }

    // Add missing plants up to 10
    for ($i = 1; $i <= 10; $i++) {
        if (!in_array($i, $existingPlants)) {
            $plants[] = [
                'id' => $i,
                'name' => 'पौधा ' . $i,
                'plantNumber' => $i,
                'photos' => [],
                'photoCount' => 0,
                'lastPhotoDate' => null,
                'nextPhotoDate' => null
            ];
        }
    }

    // Sort plants by number
    usort($plants, fn($a, $b) => $a['plantNumber'] - $b['plantNumber']);

    // Get total photo count
    $countStmt = $conn->prepare("SELECT COUNT(*) as total_photos FROM plant_photo_k WHERE pk_id = :kendraId");
    $countStmt->bindParam(':kendraId', $kendraId, PDO::PARAM_INT);
    $countStmt->execute();
    $totalPhotos = $countStmt->fetch(PDO::FETCH_ASSOC)['total_photos'];

    $response = [
        'success' => true,
        'message' => 'फोटो डेटा सफलतापूर्वक प्राप्त किया गया',
        'data' => [
            'plants' => $plants,
            'totalPhotos' => (int)$totalPhotos
        ]
    ];

    if (ob_get_length()) ob_clean();

    echo json_encode($response, JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    if (ob_get_length()) ob_clean();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>
