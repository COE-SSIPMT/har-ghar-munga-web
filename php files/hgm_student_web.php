<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once 'hgm_db.php';

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    if (!$conn) {
        sendError('Database connection failed');
    }

    $action = $_GET['action'] ?? $_POST['action'] ?? '';
    
    switch ($action) {
        case 'get_students':
            getStudents($conn);
            break;
        case 'get_filters':
            getFilters($conn);
            break;
        case 'get_student_details':
            getStudentDetails($conn);
            break;
        case 'get_student_photos':
            getStudentPhotos($conn);
            break;
        case 'update_student':
            updateStudent($conn);
            break;
        case 'get_stats':
            getStudentStats($conn);
            break;
        default:
            sendError('Invalid action specified');
    }

} catch (Exception $e) {
    sendError('Server error: ' . $e->getMessage(), 500);
}

// Get all students with filters
function getStudents($conn) {
    try {
        $filters = [];
        $params = [];
        $query = "
            SELECT 
                s.s_id,
                s.sp_id,
                s.ss_id,
                s.sk_id,
                s.s_name,
                s.s_mobile,
                s.s_father,
                s.s_mother,
                s.s_height,
                s.s_weight,
                s.s_age,
                s.s_dob,
                s.s_healtha_status,
                s.s_address,
                s.s_cratedAt,
                s.s_updatedAt,
                p.p_name as pariyojna_name,
                sec.s_name as sector_name,
                k.k_name as kendra_name
            FROM master_student s
            LEFT JOIN master_pariyojna p ON s.sp_id = p.p_id
            LEFT JOIN master_sector sec ON s.ss_id = sec.s_id
            LEFT JOIN master_kendra k ON s.sk_id = k.k_id
        ";
        
        // Apply filters
        if (!empty($_GET['sp_id'])) {
            $filters[] = "s.sp_id = :sp_id";
            $params[':sp_id'] = $_GET['sp_id'];
        }
        
        if (!empty($_GET['ss_id'])) {
            $filters[] = "s.ss_id = :ss_id";
            $params[':ss_id'] = $_GET['ss_id'];
        }
        
        if (!empty($_GET['sk_id'])) {
            $filters[] = "s.sk_id = :sk_id";
            $params[':sk_id'] = $_GET['sk_id'];
        }
        
        if (!empty($_GET['s_healtha_status'])) {
            $filters[] = "s.s_healtha_status = :s_healtha_status";
            $params[':s_healtha_status'] = $_GET['s_healtha_status'];
        }
        
        if (!empty($_GET['s_age'])) {
            $filters[] = "s.s_age = :s_age";
            $params[':s_age'] = $_GET['s_age'];
        }
        
        if (!empty($_GET['search'])) {
            $filters[] = "(s.s_name LIKE :search OR s.s_father LIKE :search OR s.s_mother LIKE :search)";
            $params[':search'] = '%' . $_GET['search'] . '%';
        }
        
        if (!empty($filters)) {
            $query .= " WHERE " . implode(" AND ", $filters);
        }
        
        $query .= " ORDER BY s.s_cratedAt DESC";
        
        $stmt = $conn->prepare($query);
        $stmt->execute($params);
        $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        sendSuccess('Students data retrieved successfully', $students);
        
    } catch (Exception $e) {
        sendError('Error fetching students: ' . $e->getMessage());
    }
}

// Get filter options (pariyojna, sector, kendra)
function getFilters($conn) {
    try {
        $filters = [];
        
        // Get Pariyojna options
        $stmt = $conn->prepare("SELECT p_id, p_name FROM master_pariyojna ORDER BY p_name");
        $stmt->execute();
        $filters['pariyojna'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get Sector options
        $stmt = $conn->prepare("
            SELECT s.s_id, s.sp_id, s.s_name, p.p_name 
            FROM master_sector s 
            LEFT JOIN master_pariyojna p ON s.sp_id = p.p_id 
            ORDER BY s.s_name
        ");
        $stmt->execute();
        $filters['sector'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get Kendra options
        $stmt = $conn->prepare("
            SELECT k.k_id, k.ks_id, k.kp_id, k.k_name, s.s_name as sector_name, p.p_name as pariyojna_name
            FROM master_kendra k
            LEFT JOIN master_sector s ON k.ks_id = s.s_id
            LEFT JOIN master_pariyojna p ON k.kp_id = p.p_id
            ORDER BY k.k_name
        ");
        $stmt->execute();
        $filters['kendra'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Health status options
        $filters['health_status'] = [
            ['value' => 'normal', 'label' => 'सामान्य'],
            ['value' => 'healthy', 'label' => 'स्वस्थ'],
            ['value' => 'weak', 'label' => 'कमज़ोर'],
            ['value' => 'sick', 'label' => 'बीमार']
        ];
        
        sendSuccess('Filter options retrieved successfully', $filters);
        
    } catch (Exception $e) {
        sendError('Error fetching filter options: ' . $e->getMessage());
    }
}

// Get detailed student information
function getStudentDetails($conn) {
    try {
        $student_id = $_GET['student_id'] ?? '';
        
        if (empty($student_id)) {
            sendError('Student ID is required');
        }
        
        $stmt = $conn->prepare("
            SELECT 
                s.s_id,
                s.sp_id,
                s.ss_id,
                s.sk_id,
                s.s_name,
                s.s_mobile,
                s.s_father,
                s.s_mother,
                s.s_height,
                s.s_weight,
                s.s_age,
                s.s_dob,
                s.s_healtha_status,
                s.s_address,
                s.s_cratedAt,
                s.s_updatedAt,
                p.p_name as pariyojna_name,
                sec.s_name as sector_name,
                k.k_name as kendra_name,
                k.k_address as kendra_address
            FROM master_student s
            LEFT JOIN master_pariyojna p ON s.sp_id = p.p_id
            LEFT JOIN master_sector sec ON s.ss_id = sec.s_id
            LEFT JOIN master_kendra k ON s.sk_id = k.k_id
            WHERE s.s_id = :student_id
        ");
        
        $stmt->bindParam(':student_id', $student_id);
        $stmt->execute();
        $student = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$student) {
            sendError('Student not found');
        }
        
        sendSuccess('Student details retrieved successfully', $student);
        
    } catch (Exception $e) {
        sendError('Error fetching student details: ' . $e->getMessage());
    }
}

// Get student photos (distribution, certificate, latest upload)
function getStudentPhotos($conn) {
    try {
        $student_id = $_GET['student_id'] ?? '';
        
        if (empty($student_id)) {
            sendError('Student ID is required');
        }
        
        $photos = [];
        
        // Get distribution photo
        $stmt = $conn->prepare("
            SELECT photo_url, created_at 
            FROM child_photo 
            WHERE cs_id = :student_id AND photo_type = 'distribution' 
            ORDER BY created_at DESC 
            LIMIT 1
        ");
        $stmt->bindParam(':student_id', $student_id);
        $stmt->execute();
        $distribution_photo = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($distribution_photo) {
            $distribution_photo['photo_url'] = 'uploads/' . $distribution_photo['photo_url'];
        }
        $photos['distribution'] = $distribution_photo ? $distribution_photo : null;
        
        // Get certificate photo
        $stmt = $conn->prepare("
            SELECT photo_url, created_at 
            FROM child_photo 
            WHERE cs_id = :student_id AND photo_type = 'certificate' 
            ORDER BY created_at DESC 
            LIMIT 1
        ");
        $stmt->bindParam(':student_id', $student_id);
        $stmt->execute();
        $certificate_photo = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($certificate_photo) {
            $certificate_photo['photo_url'] = 'uploads/' . $certificate_photo['photo_url'];
        }
        $photos['certificate'] = $certificate_photo ? $certificate_photo : null;
        
        // Get latest plant photo uploads
        $stmt = $conn->prepare("
            SELECT p_photo_url as photo_url, created_at, latitude, longitude 
            FROM plant_photo_s 
            WHERE ps_id = :student_id 
            ORDER BY created_at DESC 
            LIMIT 5
        ");
        $stmt->bindParam(':student_id', $student_id);
        $stmt->execute();
        $plant_photos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Add uploads path to plant photos
        foreach ($plant_photos as &$photo) {
            if ($photo['photo_url']) {
                $photo['photo_url'] = 'uploads/' . $photo['photo_url'];
            }
        }
        $photos['latest_uploads'] = $plant_photos;
        
        sendSuccess('Student photos retrieved successfully', $photos);
        
    } catch (Exception $e) {
        sendError('Error fetching student photos: ' . $e->getMessage());
    }
}

// Update student information
function updateStudent($conn) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || !isset($input['s_id'])) {
            sendError('Invalid input data or missing student ID');
        }
        
        $student_id = $input['s_id'];
        
        // Build update query dynamically
        $updateFields = [];
        $params = [':s_id' => $student_id];
        
        $allowedFields = ['sp_id', 'ss_id', 'sk_id', 's_name', 's_mobile', 's_father', 's_mother', 
                         's_height', 's_weight', 's_age', 's_dob', 's_healtha_status', 's_address'];
        
        foreach ($allowedFields as $field) {
            if (isset($input[$field])) {
                $updateFields[] = "$field = :$field";
                $params[":$field"] = $input[$field];
            }
        }
        
        if (empty($updateFields)) {
            sendError('No fields to update');
        }
        
        // Add updated timestamp
        $updateFields[] = "s_updatedAt = NOW()";
        
        $query = "UPDATE master_student SET " . implode(", ", $updateFields) . " WHERE s_id = :s_id";
        
        $stmt = $conn->prepare($query);
        $result = $stmt->execute($params);
        
        if ($result) {
            sendSuccess('Student updated successfully');
        } else {
            sendError('Failed to update student');
        }
        
    } catch (Exception $e) {
        sendError('Error updating student: ' . $e->getMessage());
    }
}

// Get student statistics
function getStudentStats($conn) {
    try {
        $stats = [];
        
        // Apply same filters as in get_students for consistency
        $filters = [];
        $params = [];
        
        if (!empty($_GET['sp_id'])) {
            $filters[] = "sp_id = :sp_id";
            $params[':sp_id'] = $_GET['sp_id'];
        }
        
        if (!empty($_GET['ss_id'])) {
            $filters[] = "ss_id = :ss_id";
            $params[':ss_id'] = $_GET['ss_id'];
        }
        
        if (!empty($_GET['sk_id'])) {
            $filters[] = "sk_id = :sk_id";
            $params[':sk_id'] = $_GET['sk_id'];
        }
        
        if (!empty($_GET['s_healtha_status'])) {
            $filters[] = "s_healtha_status = :s_healtha_status";
            $params[':s_healtha_status'] = $_GET['s_healtha_status'];
        }
        
        if (!empty($_GET['s_age'])) {
            $filters[] = "s_age = :s_age";
            $params[':s_age'] = $_GET['s_age'];
        }
        
        if (!empty($_GET['search'])) {
            $filters[] = "(s_name LIKE :search OR s_father LIKE :search OR s_mother LIKE :search)";
            $params[':search'] = '%' . $_GET['search'] . '%';
        }
        
        $whereClause = !empty($filters) ? "WHERE " . implode(" AND ", $filters) : "";
        
        // Total students
        $stmt = $conn->prepare("SELECT COUNT(*) as total FROM master_student $whereClause");
        $stmt->execute($params);
        $stats['total_students'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Healthy students
        $healthyParams = $params;
        $healthyFilters = $filters;
        $healthyFilters[] = "s_healtha_status = :healthy_status";
        $healthyParams[':healthy_status'] = 'healthy';
        $healthyWhere = !empty($healthyFilters) ? "WHERE " . implode(" AND ", $healthyFilters) : "";
        
        $stmt = $conn->prepare("SELECT COUNT(*) as healthy FROM master_student $healthyWhere");
        $stmt->execute($healthyParams);
        $stats['healthy_students'] = $stmt->fetch(PDO::FETCH_ASSOC)['healthy'];
        
        // Weak students
        $weakParams = $params;
        $weakFilters = $filters;
        $weakFilters[] = "s_healtha_status = :weak_status";
        $weakParams[':weak_status'] = 'weak';
        $weakWhere = !empty($weakFilters) ? "WHERE " . implode(" AND ", $weakFilters) : "";
        
        $stmt = $conn->prepare("SELECT COUNT(*) as weak FROM master_student $weakWhere");
        $stmt->execute($weakParams);
        $stats['weak_students'] = $stmt->fetch(PDO::FETCH_ASSOC)['weak'];
        
        // Active records (same as total for now)
        $stats['active_records'] = $stats['total_students'];
        
        sendSuccess('Student statistics retrieved successfully', $stats);
        
    } catch (Exception $e) {
        sendError('Error fetching student statistics: ' . $e->getMessage());
    }
}
?>
