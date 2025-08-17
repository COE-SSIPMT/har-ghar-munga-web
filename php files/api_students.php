<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Database configuration
$host = 'localhost';
$dbname = 'har_ghar_munga';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

// Handle special actions first
if (isset($_GET['action']) && $_GET['action'] === 'master_data') {
    try {
        // Fetch pariyojnas
        $pariyojnaStmt = $pdo->query("SELECT p_id, p_name FROM master_pariyojna ORDER BY p_name");
        $pariyojnas = $pariyojnaStmt->fetchAll(PDO::FETCH_ASSOC);

        // Fetch sectors
        $sectorStmt = $pdo->query("SELECT s_id, sp_id, s_name FROM master_sector ORDER BY s_name");
        $sectors = $sectorStmt->fetchAll(PDO::FETCH_ASSOC);

        // Fetch kendras
        $kendraStmt = $pdo->query("SELECT k_id, ks_id, kp_id, k_name FROM master_kendra ORDER BY k_name");
        $kendras = $kendraStmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'pariyojnas' => $pariyojnas,
            'sectors' => $sectors,
            'kendras' => $kendras
        ]);

    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
}

switch($method) {
    case 'GET':
        if (isset($_GET['action']) && $_GET['action'] === 'photos') {
            getStudentPhotos($pdo);
        } else {
            getStudents($pdo);
        }
        break;
    case 'PUT':
        updateStudent($pdo);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function getStudents($pdo) {
    try {
        // Filters and pagination from query parameters
        $sp_id = isset($_GET['sp_id']) ? $_GET['sp_id'] : '';
        $ss_id = isset($_GET['ss_id']) ? $_GET['ss_id'] : '';
        $sk_id = isset($_GET['sk_id']) ? $_GET['sk_id'] : '';
        $s_healtha_status = isset($_GET['s_healtha_status']) ? $_GET['s_healtha_status'] : '';
        $s_age = isset($_GET['s_age']) ? $_GET['s_age'] : '';
        $search = isset($_GET['search']) ? $_GET['search'] : '';
        $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
        $limit = isset($_GET['limit']) ? max(1, min(100, intval($_GET['limit']))) : 10;
        $offset = ($page - 1) * $limit;

        // Initialize parameter arrays
        $params = [];
        $countParams = [];

        // Base query for counting total records
        $countSql = "SELECT COUNT(DISTINCT ms.s_id) as total
                     FROM master_student ms
                     LEFT JOIN master_pariyojna mp ON ms.sp_id = mp.p_id
                     LEFT JOIN master_sector mse ON ms.ss_id = mse.s_id
                     LEFT JOIN master_kendra mk ON ms.sk_id = mk.k_id
                     WHERE 1=1";

        // Base query with JOINs to fetch related data
        $sql = "SELECT 
                    ms.s_id,
                    ms.sp_id,
                    ms.ss_id,
                    ms.sk_id,
                    ms.s_name,
                    ms.s_mobile,
                    ms.s_father,
                    ms.s_mother,
                    ms.s_height,
                    ms.s_weight,
                    ms.s_age,
                    ms.s_dob,
                    ms.s_healtha_status,
                    ms.s_address,
                    ms.s_cratedAt,
                    ms.s_updatedAt,
                    mp.p_name as pariyojna_name,
                    mse.s_name as sector_name,
                    mk.k_name as kendra_name
                FROM master_student ms
                LEFT JOIN master_pariyojna mp ON ms.sp_id = mp.p_id
                LEFT JOIN master_sector mse ON ms.ss_id = mse.s_id
                LEFT JOIN master_kendra mk ON ms.sk_id = mk.k_id
                WHERE 1=1";

        // Add filters to both queries
        if (!empty($sp_id)) {
            $sql .= " AND ms.sp_id = ?";
            $countSql .= " AND ms.sp_id = ?";
            $params[] = $sp_id;
            $countParams[] = $sp_id;
        }

        if (!empty($ss_id)) {
            $sql .= " AND ms.ss_id = ?";
            $countSql .= " AND ms.ss_id = ?";
            $params[] = $ss_id;
            $countParams[] = $ss_id;
        }

        if (!empty($sk_id)) {
            $sql .= " AND ms.sk_id = ?";
            $countSql .= " AND ms.sk_id = ?";
            $params[] = $sk_id;
            $countParams[] = $sk_id;
        }

        if (!empty($s_healtha_status)) {
            $sql .= " AND ms.s_healtha_status = ?";
            $countSql .= " AND ms.s_healtha_status = ?";
            $params[] = $s_healtha_status;
            $countParams[] = $s_healtha_status;
        }

        if (!empty($s_age)) {
            $sql .= " AND ms.s_age = ?";
            $countSql .= " AND ms.s_age = ?";
            $params[] = $s_age;
            $countParams[] = $s_age;
        }

        if (!empty($search)) {
            $searchCondition = " AND (ms.s_name LIKE ? OR ms.s_father LIKE ? OR ms.s_mother LIKE ? OR ms.s_address LIKE ? OR mk.k_name LIKE ? OR mp.p_name LIKE ?)";
            $sql .= $searchCondition;
            $countSql .= $searchCondition;
            $searchParam = "%$search%";
            $searchParams = [$searchParam, $searchParam, $searchParam, $searchParam, $searchParam, $searchParam];
            $params = array_merge($params, $searchParams);
            $countParams = array_merge($countParams, $searchParams);
        }

        // Get total count
        $countStmt = $pdo->prepare($countSql);
        $countStmt->execute($countParams);
        $totalRecords = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

        // Add ordering and pagination to main query
        $sql .= " ORDER BY ms.s_cratedAt DESC LIMIT " . intval($limit) . " OFFSET " . intval($offset);

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Convert health status from English to Hindi
        foreach ($students as &$student) {
            $student['s_healtha_status'] = convertHealthStatus($student['s_healtha_status']);
        }

        // Calculate pagination info
        $totalPages = ceil($totalRecords / $limit);

        echo json_encode([
            'success' => true,
            'data' => $students,
            'pagination' => [
                'currentPage' => $page,
                'totalPages' => $totalPages,
                'totalItems' => (int)$totalRecords,
                'itemsPerPage' => $limit,
                'itemsOnCurrentPage' => count($students)
            ]
        ]);

    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function updateStudent($pdo) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['s_id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Student ID required']);
            return;
        }

        // Convert health status from Hindi to English
        $healthStatus = convertHealthStatusToEnglish($input['s_healtha_status']);

        $sql = "UPDATE master_student SET 
                s_name = ?, 
                s_mobile = ?, 
                s_father = ?, 
                s_mother = ?, 
                s_height = ?, 
                s_weight = ?, 
                s_age = ?, 
                s_dob = ?, 
                s_healtha_status = ?, 
                s_address = ?,
                s_updatedAt = CURRENT_TIMESTAMP
                WHERE s_id = ?";

        $stmt = $pdo->prepare($sql);
        $result = $stmt->execute([
            $input['s_name'],
            $input['s_mobile'] ?? null,
            $input['s_father'] ?? null,
            $input['s_mother'] ?? null,
            $input['s_height'] ?? null,
            $input['s_weight'] ?? null,
            $input['s_age'] ?? null,
            $input['s_dob'] ?? null,
            $healthStatus,
            $input['s_address'] ?? null,
            $input['s_id']
        ]);

        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Student updated successfully'
            ]);
        } else {
            throw new Exception('Failed to update student');
        }

    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function getStudentPhotos($pdo) {
    try {
        $s_id = isset($_GET['s_id']) ? $_GET['s_id'] : '';

        if (empty($s_id)) {
            http_response_code(400);
            echo json_encode(['error' => 'Student ID required']);
            return;
        }

        // For now, return sample photo data
        // You can modify this to fetch from actual photo tables when available
        $photos = [
            'distribution_photo' => "https://via.placeholder.com/400x300/22c55e/ffffff?text=Distribution+Photo+{$s_id}",
            'certificate_photo' => "https://via.placeholder.com/400x300/f59e0b/ffffff?text=Certificate+Photo+{$s_id}",
            'plant_photo' => "https://via.placeholder.com/400x300/3b82f6/ffffff?text=Latest+Plant+Photo+{$s_id}"
        ];

        echo json_encode([
            'success' => true,
            'data' => $photos
        ]);

    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error: ' . $e->getMessage()]);
    }
}

// Helper function to convert health status from English to Hindi
function convertHealthStatus($status) {
    $statusMap = [
        'healthy' => 'स्वस्थ',
        'normal' => 'सामान्य',
        'weak' => 'कमज़ोर',
        'unwell' => 'बीमार'
    ];
    
    return isset($statusMap[$status]) ? $statusMap[$status] : $status;
}

// Helper function to convert health status from Hindi to English
function convertHealthStatusToEnglish($status) {
    $statusMap = [
        'स्वस्थ' => 'healthy',
        'सामान्य' => 'normal',
        'कमज़ोर' => 'weak',
        'बीमार' => 'unwell'
    ];
    
    return isset($statusMap[$status]) ? $statusMap[$status] : $status;
}

// Get kendra details by ID (for navigation from AanganwadiStats)
if (isset($_GET['action']) && $_GET['action'] === 'kendra_details') {
    try {
        $k_id = isset($_GET['k_id']) ? $_GET['k_id'] : '';

        if (empty($k_id)) {
            http_response_code(400);
            echo json_encode(['error' => 'Kendra ID required']);
            return;
        }

        $sql = "SELECT 
                    mk.k_id,
                    mk.k_name,
                    mk.ks_id,
                    mk.kp_id,
                    mp.p_name as pariyojna_name,
                    ms.s_name as sector_name
                FROM master_kendra mk
                LEFT JOIN master_pariyojna mp ON mk.kp_id = mp.p_id
                LEFT JOIN master_sector ms ON mk.ks_id = ms.s_id
                WHERE mk.k_id = ?";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([$k_id]);
        $kendra = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($kendra) {
            echo json_encode([
                'success' => true,
                'data' => $kendra
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Kendra not found']);
        }

    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
?>
