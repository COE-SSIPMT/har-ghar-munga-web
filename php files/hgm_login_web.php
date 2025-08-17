<?php
// Enable CORS for frontend
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "hgm_db.php";

// Only allow POST requests for login
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError("Invalid request method. Only POST allowed.", 405);
}

// Get POST data
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Validate input data
if (!$data) {
    sendError("Invalid JSON data");
}

$username = isset($data['username']) ? trim($data['username']) : '';
$password = isset($data['password']) ? trim($data['password']) : '';

// Check if both fields are provided
if (empty($username) || empty($password)) {
    sendError("Username and password are required");
}

// Create database connection
$db = new Database();
$conn = $db->getConnection();

try {
    // Prepare SQL query to check admin credentials from master_admin table
    $stmt = $conn->prepare("SELECT a_id, a_name, username FROM master_admin WHERE username = :username AND password = :password LIMIT 1");
    $stmt->bindParam(':username', $username, PDO::PARAM_STR);
    $stmt->bindParam(':password', $password, PDO::PARAM_STR);
    $stmt->execute();

    if ($stmt->rowCount() === 1) {
        // Login successful
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // You can add session management here if needed
        // session_start();
        // $_SESSION['admin_id'] = $admin['a_id'];
        // $_SESSION['admin_name'] = $admin['a_name'];
        
        sendSuccess("Login successful", [
            "admin_id" => $admin['a_id'],
            "admin_name" => $admin['a_name'],
            "username" => $admin['username'],
            "message" => "Welcome " . $admin['a_name']
        ]);
    } else {
        // Invalid credentials
        sendError("Invalid username or password", 401);
    }
    
} catch (PDOException $e) {
    sendError("Database error: " . $e->getMessage(), 500);
} catch (Exception $e) {
    sendError("Server error: " . $e->getMessage(), 500);
}
?>
