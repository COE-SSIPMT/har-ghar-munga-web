<?php
require_once 'hgm_db.php';
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->username) || !isset($data->password)) {
    sendError('Username and password are required');
}

$username = trim($data->username);
$password = trim($data->password);

$database = new Database();
$db = $database->getConnection();

try {
    $query = "SELECT k.k_id, k.k_name, k.k_address, k.login_id, k.password,
                     s.s_name as sector_name, p.p_name as pariyojna_name
              FROM master_kendra k
              LEFT JOIN master_sector s ON k.ks_id = s.s_id
              LEFT JOIN master_pariyojna p ON k.kp_id = p.p_id
              WHERE k.login_id = :username
              LIMIT 1";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(":username", $username);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($password === $row['password']) {
            $response_data = array(
                "k_id" => (int)$row['k_id'],
                "centerName" => $row['k_name'],
                "centerAddress" => $row['k_address'],
                "sectorName" => $row['sector_name'],
                "pariyojnaName" => $row['pariyojna_name'],
                "centerCode" => $row['login_id']
            );
            sendSuccess('Login successful', $response_data);
        } else {
            sendError('गलत उपयोगकर्ता नाम या पासवर्ड');
        }
    } else {
        sendError('गलत उपयोगकर्ता नाम या पासवर्ड');
    }
} catch(PDOException $e) {
    sendError('Login error: ' . $e->getMessage(), 500);
}