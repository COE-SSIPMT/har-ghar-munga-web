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

        echo json_encode([
            'success' => true,
            'pariyojnas' => $pariyojnas,
            'sectors' => $sectors
        ]);

    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
}

// Handle stats action
if (isset($_GET['action']) && $_GET['action'] === 'get_stats') {
    try {
        // Filters from query parameters
        $kp_id = isset($_GET['kp_id']) ? $_GET['kp_id'] : '';
        $ks_id = isset($_GET['ks_id']) ? $_GET['ks_id'] : '';
        $search = isset($_GET['search']) ? $_GET['search'] : '';

        // Initialize parameter arrays
        $params = [];

        // Base query for getting aggregated stats
        $sql = "SELECT 
                    COUNT(DISTINCT mk.k_id) as total_kendras,
                    COUNT(DISTINCT CASE WHEN student_counts.active_students > 0 THEN mk.k_id END) as active_kendras,
                    COALESCE(SUM(student_counts.total_students), 0) as total_students,
                    COALESCE(SUM(student_counts.active_students), 0) as active_students
                FROM master_kendra mk
                LEFT JOIN master_pariyojna mp ON mk.kp_id = mp.p_id
                LEFT JOIN master_sector ms ON mk.ks_id = ms.s_id
                LEFT JOIN (
                    SELECT 
                        sk_id,
                        COUNT(*) as total_students,
                        COUNT(*) as active_students
                    FROM master_student 
                    GROUP BY sk_id
                ) student_counts ON mk.k_id = student_counts.sk_id
                WHERE 1=1";

        // Add filters
        if (!empty($kp_id)) {
            $sql .= " AND mk.kp_id = ?";
            $params[] = $kp_id;
        }

        if (!empty($ks_id)) {
            $sql .= " AND mk.ks_id = ?";
            $params[] = $ks_id;
        }

        if (!empty($search)) {
            $sql .= " AND (mk.k_name LIKE ? OR mk.k_address LIKE ? OR mk.login_id LIKE ? OR mp.p_name LIKE ? OR ms.s_name LIKE ?)";
            $searchParam = "%$search%";
            $params = array_merge($params, [$searchParam, $searchParam, $searchParam, $searchParam, $searchParam]);
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $stats = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'data' => [
                'totalKendras' => (int)$stats['total_kendras'],
                'activeKendras' => (int)$stats['active_kendras'], 
                'totalStudents' => (int)$stats['total_students'],
                'activeStudents' => (int)$stats['active_students']
            ]
        ]);

    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
}

switch($method) {
    case 'GET':
        getKendras($pdo);
        break;
    case 'POST':
        addKendra($pdo);
        break;
    case 'PUT':
        updateKendra($pdo);
        break;
    case 'DELETE':
        deleteKendra($pdo);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function getKendras($pdo) {
    try {
        // Filters and pagination from query parameters
        $kp_id = isset($_GET['kp_id']) ? $_GET['kp_id'] : '';
        $ks_id = isset($_GET['ks_id']) ? $_GET['ks_id'] : '';
        $search = isset($_GET['search']) ? $_GET['search'] : '';
        $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
        $limit = isset($_GET['limit']) ? max(1, min(100, intval($_GET['limit']))) : 10;
        $offset = ($page - 1) * $limit;

        // Initialize parameter arrays
        $params = [];
        $countParams = [];

        // Base query for counting total records
        $countSql = "SELECT COUNT(DISTINCT mk.k_id) as total
                     FROM master_kendra mk
                     LEFT JOIN master_pariyojna mp ON mk.kp_id = mp.p_id
                     LEFT JOIN master_sector ms ON mk.ks_id = ms.s_id
                     WHERE 1=1";

        // Base query with JOINs to fetch related data
        $sql = "SELECT 
                    mk.k_id,
                    mk.k_name,
                    mk.k_address,
                    mk.ks_id,
                    mk.kp_id,
                    mk.login_id,
                    mk.password,
                    mk.k_createdAt,
                    mk.k_updatedAt,
                    mp.p_name as pariyojna_name,
                    ms.s_name as sector_name,
                    COALESCE(student_counts.total_students, 0) as total_students,
                    COALESCE(student_counts.active_students, 0) as active_students
                FROM master_kendra mk
                LEFT JOIN master_pariyojna mp ON mk.kp_id = mp.p_id
                LEFT JOIN master_sector ms ON mk.ks_id = ms.s_id
                LEFT JOIN (
                    SELECT 
                        sk_id,
                        COUNT(*) as total_students,
                        COUNT(*) as active_students
                    FROM master_student 
                    GROUP BY sk_id
                ) student_counts ON mk.k_id = student_counts.sk_id
                WHERE 1=1";

        // Add filters to both queries
        if (!empty($kp_id)) {
            $sql .= " AND mk.kp_id = ?";
            $countSql .= " AND mk.kp_id = ?";
            $params[] = $kp_id;
            $countParams[] = $kp_id;
        }

        if (!empty($ks_id)) {
            $sql .= " AND mk.ks_id = ?";
            $countSql .= " AND mk.ks_id = ?";
            $params[] = $ks_id;
            $countParams[] = $ks_id;
        }

        if (!empty($search)) {
            $searchCondition = " AND (mk.k_name LIKE ? OR mk.k_address LIKE ? OR mk.login_id LIKE ? OR mp.p_name LIKE ? OR ms.s_name LIKE ?)";
            $sql .= $searchCondition;
            $countSql .= $searchCondition;
            $searchParam = "%$search%";
            $searchParams = [$searchParam, $searchParam, $searchParam, $searchParam, $searchParam];
            $params = array_merge($params, $searchParams);
            $countParams = array_merge($countParams, $searchParams);
        }

        // Get total count
        $countStmt = $pdo->prepare($countSql);
        $countStmt->execute($countParams);
        $totalRecords = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

        // Add ordering and pagination to main query
        $sql .= " ORDER BY mk.k_createdAt DESC LIMIT " . intval($limit) . " OFFSET " . intval($offset);

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $kendras = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Calculate pagination info
        $totalPages = ceil($totalRecords / $limit);

        echo json_encode([
            'success' => true,
            'data' => $kendras,
            'pagination' => [
                'currentPage' => $page,
                'totalPages' => $totalPages,
                'totalItems' => (int)$totalRecords,
                'itemsPerPage' => $limit,
                'itemsOnCurrentPage' => count($kendras)
            ]
        ]);

    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function addKendra($pdo) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);

        // Check required fields according to schema
        if (!isset($input['k_name']) || !isset($input['ks_id']) || !isset($input['kp_id']) || 
            !isset($input['login_id']) || !isset($input['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Required fields missing: k_name, ks_id, kp_id, login_id, password']);
            return;
        }

        // Insert query according to table schema (k_id is auto-increment, so not included)
        $sql = "INSERT INTO master_kendra (ks_id, kp_id, k_name, k_address, login_id, password) 
                VALUES (?, ?, ?, ?, ?, ?)";

        $stmt = $pdo->prepare($sql);
        $result = $stmt->execute([
            $input['ks_id'],
            $input['kp_id'],
            $input['k_name'],
            $input['k_address'] ?? null,
            $input['login_id'],
            $input['password']
        ]);

        if ($result) {
            $newId = $pdo->lastInsertId();
            
            // Fetch the newly created kendra with joined data
            $fetchSql = "SELECT 
                            mk.*, 
                            mp.p_name as pariyojna_name,
                            ms.s_name as sector_name,
                            0 as total_students,
                            0 as active_students
                        FROM master_kendra mk
                        LEFT JOIN master_pariyojna mp ON mk.kp_id = mp.p_id
                        LEFT JOIN master_sector ms ON mk.ks_id = ms.s_id
                        WHERE mk.k_id = ?";
            
            $fetchStmt = $pdo->prepare($fetchSql);
            $fetchStmt->execute([$newId]);
            $newKendra = $fetchStmt->fetch(PDO::FETCH_ASSOC);

            echo json_encode([
                'success' => true,
                'message' => 'Kendra added successfully',
                'data' => $newKendra
            ]);
        } else {
            throw new Exception('Failed to insert kendra');
        }

    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function updateKendra($pdo) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['k_id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Kendra ID required']);
            return;
        }

        $sql = "UPDATE master_kendra SET 
                k_name = ?, 
                k_address = ?, 
                ks_id = ?, 
                kp_id = ?, 
                login_id = ?, 
                password = ?,
                k_updatedAt = CURRENT_TIMESTAMP
                WHERE k_id = ?";

        $stmt = $pdo->prepare($sql);
        $result = $stmt->execute([
            $input['k_name'],
            $input['k_address'] ?? null,
            $input['ks_id'],
            $input['kp_id'],
            $input['login_id'] ?? null,
            $input['password'] ?? null,
            $input['k_id']
        ]);

        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Kendra updated successfully'
            ]);
        } else {
            throw new Exception('Failed to update kendra');
        }

    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function deleteKendra($pdo) {
    try {
        $k_id = isset($_GET['k_id']) ? $_GET['k_id'] : '';

        if (empty($k_id)) {
            http_response_code(400);
            echo json_encode(['error' => 'Kendra ID required']);
            return;
        }

        // Check if kendra has students
        $checkSql = "SELECT COUNT(*) as student_count FROM master_student WHERE sk_id = ?";
        $checkStmt = $pdo->prepare($checkSql);
        $checkStmt->execute([$k_id]);
        $studentCount = $checkStmt->fetch(PDO::FETCH_ASSOC)['student_count'];

        if ($studentCount > 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Cannot delete kendra with existing students']);
            return;
        }

        $sql = "DELETE FROM master_kendra WHERE k_id = ?";
        $stmt = $pdo->prepare($sql);
        $result = $stmt->execute([$k_id]);

        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Kendra deleted successfully'
            ]);
        } else {
            throw new Exception('Failed to delete kendra');
        }

    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
?>
