<?php
require_once 'hgm_db.php';

// Disable error display in output
ini_set('display_errors', 0);
error_reporting(E_ALL);
ini_set('log_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Content-Type: application/json; charset=UTF-8');

error_log("=== Starting Dashboard Stats Request ===");

// Get kendra_id from query parameter
if (!isset($_GET['kendra_id'])) {
    sendError('Kendra ID is required');
}

try {
    $kendra_id = $_GET['kendra_id'];
    error_log("Processing request for kendra_id: " . $kendra_id);
    
    $database = new Database();
    $db = $database->getConnection();
    error_log("Database connection established");
    
    // Get total students count for this kendra
    $studentQuery = "SELECT COUNT(*) as total_students FROM master_student WHERE sk_id = :kendra_id";
    $studentStmt = $db->prepare($studentQuery);
    $studentStmt->bindParam(':kendra_id', $kendra_id);
    $studentStmt->execute();
    $studentCount = $studentStmt->fetch(PDO::FETCH_ASSOC)['total_students'];
    
    // Get total plants count (10 for anganwadi + 1 per student)
    $totalPlants = 10 + $studentCount;
    
    // Get students' plant photos count
    $studentPhotosQuery = "SELECT COUNT(*) as photo_count 
                          FROM plant_photo_s ps 
                          JOIN master_student ms ON ps.ps_id = ms.s_id 
                          WHERE ms.sk_id = :kendra_id";
    $studentPhotosStmt = $db->prepare($studentPhotosQuery);
    $studentPhotosStmt->bindParam(':kendra_id', $kendra_id);
    $studentPhotosStmt->execute();
    $studentPhotosCount = $studentPhotosStmt->fetch(PDO::FETCH_ASSOC)['photo_count'];
    
    // Get anganwadi plant photos count
    $anganwadiPhotosQuery = "SELECT COUNT(*) as photo_count 
                            FROM plant_photo_k 
                            WHERE pk_id = :kendra_id";
    $anganwadiPhotosStmt = $db->prepare($anganwadiPhotosQuery);
    $anganwadiPhotosStmt->bindParam(':kendra_id', $kendra_id);
    $anganwadiPhotosStmt->execute();
    $anganwadiPhotosCount = $anganwadiPhotosStmt->fetch(PDO::FETCH_ASSOC)['photo_count'];
    
    // Get detailed kendra info with sector and pariyojna from master tables
    $kendraQuery = "SELECT k.k_name, k.k_address, k.login_id,
                           ms.s_name as sector_name,
                           mp.p_name as pariyojna_name
                    FROM master_kendra k
                    LEFT JOIN master_sector ms ON k.ks_id = ms.s_id
                    LEFT JOIN master_pariyojna mp ON k.kp_id = mp.p_id
                    WHERE k.k_id = :kendra_id";
    $kendraStmt = $db->prepare($kendraQuery);
    $kendraStmt->bindParam(':kendra_id', $kendra_id);
    $kendraStmt->execute();
    $kendraInfo = $kendraStmt->fetch(PDO::FETCH_ASSOC);
    
    // Prepare response data
    $response_data = array(
        'stats' => array(
            'totalStudents' => (int)$studentCount,
            'totalPlants' => (int)$totalPlants,
            'photosUploaded' => (int)$studentPhotosCount,
            'plantsWithPhotos' => (int)$anganwadiPhotosCount
        ),
        'kendraInfo' => array(
            'centerName' => $kendraInfo['k_name'],
            'centerAddress' => $kendraInfo['k_address'],
            'sectorName' => $kendraInfo['sector_name'],
            'pariyojnaName' => $kendraInfo['pariyojna_name'],
            'loginId' => $kendraInfo['login_id']
        )
    );
    
    sendSuccess('Dashboard data fetched successfully', $response_data);
    
} catch(PDOException $e) {
    error_log("Database Error in get_dashboard_stats.php: " . $e->getMessage());
    error_log("SQL State: " . $e->getCode());
    error_log("Stack Trace: " . $e->getTraceAsString());
    sendError('Database error occurred', 500);
} catch(Exception $e) {
    error_log("General Error in get_dashboard_stats.php: " . $e->getMessage());
    error_log("Stack Trace: " . $e->getTraceAsString());
    sendError('An error occurred', 500);
}
