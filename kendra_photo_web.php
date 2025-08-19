<?php
// Set CORS headers first, before any other output
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight OPTIONS request immediately after headers
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'hgm_db.php';

try {
    $database = new Database();
    $pdo = $database->getConnection();
    
    if (!$pdo) {
        sendError("Database connection failed", 500);
    }

    // Get action parameter
    $action = $_GET['action'] ?? '';
    
    switch($action) {
        case 'get_kendra_photos':
            getKendraPhotos($pdo);
            break;
            
        default:
            sendError("Invalid action parameter");
    }
    
} catch (Exception $e) {
    sendError("Server error: " . $e->getMessage(), 500);
}

function getKendraPhotos($pdo) {
    try {
        // Get kendra ID from request
        $k_id = $_GET['k_id'] ?? '';
        
        if (empty($k_id)) {
            sendError("Kendra ID is required");
        }
        
        // Validate kendra ID is numeric
        if (!is_numeric($k_id)) {
            sendError("Invalid kendra ID format");
        }
        
        // First check if kendra exists
        $checkKendra = "SELECT k_id, k_name FROM master_kendra WHERE k_id = ?";
        $stmt = $pdo->prepare($checkKendra);
        $stmt->execute([$k_id]);
        $kendra = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$kendra) {
            sendError("Kendra not found");
        }
        
        // Fetch latest 10 plant photos for this kendra
        $sql = "SELECT 
                    p.p_id,
                    p.pk_id,
                    p.photo_url,
                    p.plant_number,
                    p.latitude,
                    p.longitude,
                    p.counter,
                    p.created_at,
                    p.updated_at,
                    k.k_name
                FROM plant_photo_k p
                INNER JOIN master_kendra k ON p.pk_id = k.k_id
                WHERE p.pk_id = ?
                ORDER BY p.created_at DESC, p.p_id DESC
                LIMIT 10";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$k_id]);
        $photos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Format the photos data
        $formattedPhotos = [];
        foreach ($photos as $photo) {
            $formattedPhotos[] = [
                'p_id' => $photo['p_id'],
                'pk_id' => $photo['pk_id'],
                'photo_url' => $photo['photo_url'],
                'plant_number' => (int)$photo['plant_number'],
                'latitude' => $photo['latitude'] ? (float)$photo['latitude'] : null,
                'longitude' => $photo['longitude'] ? (float)$photo['longitude'] : null,
                'counter' => (int)$photo['counter'],
                'created_at' => $photo['created_at'],
                'updated_at' => $photo['updated_at'],
                'k_name' => $photo['k_name']
            ];
        }
        
        $response = [
            'kendra' => [
                'k_id' => (int)$kendra['k_id'],
                'k_name' => $kendra['k_name']
            ],
            'photos' => $formattedPhotos,
            'total_photos' => count($formattedPhotos)
        ];
        
        sendSuccess("Plant photos fetched successfully", $response);
        
    } catch (Exception $e) {
        sendError("Error fetching plant photos: " . $e->getMessage(), 500);
    }
}
?>
