<?php
require_once 'hgm_db.php';
require_once 'config.php';

// Initialize database connection
$database = new Database();
$conn = $database->getConnection();

// Function to get student details with all related data
function getStudentDetails($conn, $k_id = null) {
    try {
        $query = "
            SELECT 
                s.*,
                p.p_name as pariyojna_name,
                sec.s_name as sector_name,
                k.k_name as kendra_name,
                k.k_address as kendra_address,
                (
                    SELECT p_photo_url 
                    FROM plant_photo_s 
                    WHERE ps_id = s.s_id 
                    ORDER BY created_at DESC 
                    LIMIT 1
                ) as latest_plant_photo,
                (
                    SELECT photo_url 
                    FROM child_photo 
                    WHERE cs_id = s.s_id 
                    AND photo_type = 'distribution'
                    ORDER BY created_at DESC 
                    LIMIT 1
                ) as distribution_photo,
                (
                    SELECT photo_url 
                    FROM child_photo 
                    WHERE cs_id = s.s_id 
                    AND photo_type = 'certificate'
                    ORDER BY created_at DESC 
                    LIMIT 1
                ) as certificate_photo,
                (
                    SELECT counter 
                    FROM plant_photo_s 
                    WHERE ps_id = s.s_id 
                    ORDER BY created_at DESC 
                    LIMIT 1
                ) as photo_count
            FROM master_student s
            LEFT JOIN master_pariyojna p ON s.sp_id = p.p_id
            LEFT JOIN master_sector sec ON s.ss_id = sec.s_id
            LEFT JOIN master_kendra k ON s.sk_id = k.k_id
        ";

        // Add kendra filter if k_id is provided
        if ($k_id) {
            $query .= " WHERE s.sk_id = :k_id";
        }

        $query .= " ORDER BY s.s_cratedAt DESC";

        $stmt = $conn->prepare($query);
        
        // Bind kendra ID if provided
        if ($k_id) {
            $stmt->bindParam(":k_id", $k_id);
        }

        $stmt->execute();

        $students = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // Format the data to match the Flutter app's expectations
            $student = array(
                'id' => $row['s_id'],
                'name' => $row['s_name'],
                'fatherName' => $row['s_father'],
                'motherName' => $row['s_mother'],
                'mobile' => $row['s_mobile'],
                'age' => $row['s_age'],
                'dob' => $row['s_dob'],
                'height' => $row['s_height'],
                'weight' => $row['s_weight'],
                'healthStatus' => $row['s_healtha_status'],
                'address' => $row['s_address'],
                'pariyojnaName' => $row['pariyojna_name'],
                'sectorName' => $row['sector_name'],
                'kendraName' => $row['kendra_name'],
                'kendraAddress' => $row['kendra_address'],
                'registrationDate' => $row['s_cratedAt'],
                'lastUpdate' => $row['s_updatedAt'],
                'photoCount' => (int)($row['photo_count'] ?? 0),
                'photos' => array(
                    'plantPhoto' => $row['latest_plant_photo'] ? Config::getUploadUrl($row['latest_plant_photo']) : null,
                    'distributionPhoto' => $row['distribution_photo'] ? Config::getUploadUrl($row['distribution_photo']) : null,
                    'certificatePhoto' => $row['certificate_photo'] ? Config::getUploadUrl($row['certificate_photo']) : null
                )
            );

            // Calculate next photo date if photos exist
            if ($row['photo_count'] > 0) {
                // Get the latest photo date
                $latestPhotoQuery = "
                    SELECT created_at 
                    FROM plant_photo_s 
                    WHERE ps_id = :studentId 
                    ORDER BY created_at DESC 
                    LIMIT 1";
                
                $photoStmt = $conn->prepare($latestPhotoQuery);
                $photoStmt->bindParam(":studentId", $row['s_id']);
                $photoStmt->execute();
                
                if ($lastPhoto = $photoStmt->fetch(PDO::FETCH_ASSOC)) {
                    $lastPhotoDate = new DateTime($lastPhoto['created_at']);
                    $nextPhotoDate = $lastPhotoDate->modify('+15 days');
                    $student['lastPhotoUpload'] = $lastPhoto['created_at'];
                    $student['nextPhotoDate'] = $nextPhotoDate->format('Y-m-d H:i:s');
                }
            }

            $students[] = $student;
        }

        return $students;

    } catch (PDOException $e) {
        error_log("Error fetching student details: " . $e->getMessage());
        return false;
    }
}

// Handle the request
try {
    // Get kendra ID from query parameter
    $k_id = isset($_GET['k_id']) ? (int)$_GET['k_id'] : null;
    error_log("Received k_id: " . ($k_id ?? 'null'));
    
    // Get students data
    $students = getStudentDetails($conn, $k_id);
    
    if ($students !== false) {
        sendSuccess("Students data retrieved successfully", $students);
    } else {
        sendError("Failed to retrieve students data");
    }

} catch (Exception $e) {
    error_log("Error in get_students.php: " . $e->getMessage());
    sendError("An unexpected error occurred");
}
?>
