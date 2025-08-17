<?php
class Database {
    private $host = "localhost";
    private $db_name = "har_ghar_munga";
    private $username = "root";
    private $password = "";     // XAMPP default मे root का कोई password नहीं होता
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            error_log("Attempting database connection to {$this->host}/{$this->db_name}");
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name, 
                $this->username, 
                $this->password,
                array(PDO::ATTR_TIMEOUT => 5) // 5 seconds timeout
            );
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            error_log("Database connection successful");
        } catch(PDOException $exception) {
            error_log("Database Connection Error: " . $exception->getMessage());
            error_log("Connection Details: host={$this->host}, db={$this->db_name}, user={$this->username}");
            sendError('Database connection error', 500);
        }

        return $this->conn;
    }
}

// Response helper functions
function sendResponse($success, $message, $data = null) {
    // Clear any previous output
    if (ob_get_length()) ob_clean();
    
    $response = [
        'success' => $success,
        'message' => $message
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    // Log the response for debugging
    error_log("Sending Response: " . json_encode($response));
    
    echo json_encode($response);
    exit();
}

function sendError($message, $code = 400) {
    http_response_code($code);
    sendResponse(false, $message);
}

function sendSuccess($message, $data = null) {
    sendResponse(true, $message, $data);
}
?>
