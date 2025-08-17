<?php
require_once 'hgm_db.php';

// Initialize database connection
$database = new Database();
$conn = $database->getConnection();

try {
    // Check if all required fields are present
    if (!isset($_POST['student_id']) || !isset($_POST['latitude']) || !isset($_POST['longitude']) || !isset($_FILES['photo'])) {
        throw new Exception('All required fields are not present');
    }

    $student_id = $_POST['student_id'];
    $latitude = $_POST['latitude'];
    $longitude = $_POST['longitude'];
    $photo = $_FILES['photo'];

    // Check if the file is an image
    $check = getimagesize($photo["tmp_name"]);
    if ($check === false) {
        throw new Exception('File is not an image');
    }

    // Create uploads directory if it doesn't exist
    $upload_dir = 'uploads/';
    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    // Generate unique filename
    $filename = uniqid() . '_' . basename($photo["name"]);
    $target_file = $upload_dir . $filename;

    // Move uploaded file
    if (!move_uploaded_file($photo["tmp_name"], $target_file)) {
        throw new Exception('Failed to upload file');
    }

    // Get current counter value
    $query = "SELECT counter FROM plant_photo_s WHERE ps_id = :student_id ORDER BY created_at DESC LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(":student_id", $student_id);
    $stmt->execute();
    $current_counter = ($stmt->fetch(PDO::FETCH_ASSOC)['counter'] ?? 0) + 1;

    // Insert photo record into database
    $query = "INSERT INTO plant_photo_s (ps_id, p_photo_url, latitude, longitude, counter) 
              VALUES (:student_id, :photo_url, :latitude, :longitude, :counter)";
    
    $stmt = $conn->prepare($query);
    $stmt->bindParam(":student_id", $student_id);
    $stmt->bindParam(":photo_url", $filename);
    $stmt->bindParam(":latitude", $latitude);
    $stmt->bindParam(":longitude", $longitude);
    $stmt->bindParam(":counter", $current_counter);
    
    if (!$stmt->execute()) {
        // Delete uploaded file if database insert fails
        unlink($target_file);
        throw new Exception('Failed to save photo record in database');
    }

    // Return success response with photo details
    echo json_encode([
        'success' => true,
        'message' => 'Photo uploaded successfully',
        'data' => [
            'photo_url' => $filename,
            'counter' => $current_counter
        ]
    ]);

} catch (Exception $e) {
    error_log("Error in upload_plant_photo.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
