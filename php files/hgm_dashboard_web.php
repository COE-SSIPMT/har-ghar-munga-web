<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
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

    // Get dashboard statistics
    $dashboardData = getDashboardStats($conn);
    
    sendSuccess('Dashboard data retrieved successfully', $dashboardData);

} catch (Exception $e) {
    sendError('Server error: ' . $e->getMessage(), 500);
}

function getDashboardStats($conn) {
    $stats = [];
    
    try {
        // 1. Total Students count from master_student table
        $stmt = $conn->prepare("SELECT COUNT(*) as total_students FROM master_student");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $stats['total_students'] = $result['total_students'];
        
        // 2. Total Aanganwadi count from master_kendra table
        $stmt = $conn->prepare("SELECT COUNT(*) as total_aanganwadi FROM master_kendra");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $stats['total_aanganwadi'] = $result['total_aanganwadi'];
        
        // 3. Photos by Students count from plant_photo_s table
        $stmt = $conn->prepare("SELECT COUNT(*) as photos_by_students FROM plant_photo_s");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $stats['photos_by_students'] = $result['photos_by_students'];
        
        // 4. Photos by Aanganwadi count from plant_photo_k table
        $stmt = $conn->prepare("SELECT COUNT(*) as photos_by_aanganwadi FROM plant_photo_k");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $stats['photos_by_aanganwadi'] = $result['photos_by_aanganwadi'];
        
        // 5. Get pie chart data
        $stats['pie_chart_data'] = [
            ['name' => 'Students', 'value' => (int)$stats['total_students']],
            ['name' => 'Aanganwadi Centers', 'value' => (int)$stats['total_aanganwadi']],
            ['name' => 'Student Photos', 'value' => (int)$stats['photos_by_students']],
            ['name' => 'Aanganwadi Photos', 'value' => (int)$stats['photos_by_aanganwadi']]
        ];
        
        // 6. Get monthly trends data for column chart (last 6 months)
        $monthlyData = getMonthlyTrends($conn);
        $stats['column_chart_data'] = $monthlyData;
        
        // 7. Additional stats for better dashboard insights
        $stats['additional_stats'] = getAdditionalStats($conn);
        
    } catch (Exception $e) {
        throw new Exception('Error fetching dashboard statistics: ' . $e->getMessage());
    }
    
    return $stats;
}

function getMonthlyTrends($conn) {
    $monthlyData = [];
    
    try {
        // Get monthly photo uploads for last 6 months
        $sql = "
            SELECT 
                MONTH(created_at) as month,
                YEAR(created_at) as year,
                COUNT(*) as total_photos
            FROM (
                SELECT created_at FROM plant_photo_s 
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
                UNION ALL
                SELECT created_at FROM plant_photo_k 
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            ) as combined_photos
            GROUP BY YEAR(created_at), MONTH(created_at)
            ORDER BY year, month
        ";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Create array for last 6 months
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $currentMonth = date('n');
        $currentYear = date('Y');
        
        for ($i = 5; $i >= 0; $i--) {
            $targetMonth = $currentMonth - $i;
            $targetYear = $currentYear;
            
            if ($targetMonth <= 0) {
                $targetMonth += 12;
                $targetYear--;
            }
            
            $monthName = $months[$targetMonth - 1];
            $value = 0;
            
            // Find matching data
            foreach ($results as $result) {
                if ($result['month'] == $targetMonth && $result['year'] == $targetYear) {
                    $value = (int)$result['total_photos'];
                    break;
                }
            }
            
            $monthlyData[] = [
                'name' => $monthName,
                'value' => $value
            ];
        }
        
    } catch (Exception $e) {
        // Return default data if error
        $monthlyData = [
            ['name' => 'Jan', 'value' => 0],
            ['name' => 'Feb', 'value' => 0],
            ['name' => 'Mar', 'value' => 0],
            ['name' => 'Apr', 'value' => 0],
            ['name' => 'May', 'value' => 0],
            ['name' => 'Jun', 'value' => 0]
        ];
    }
    
    return $monthlyData;
}

function getAdditionalStats($conn) {
    $additionalStats = [];
    
    try {
        // Get sector-wise student count
        $stmt = $conn->prepare("
            SELECT s.s_name, COUNT(st.s_id) as student_count
            FROM master_sector s
            LEFT JOIN master_student st ON s.s_id = st.ss_id
            GROUP BY s.s_id, s.s_name
            ORDER BY student_count DESC
            LIMIT 5
        ");
        $stmt->execute();
        $additionalStats['top_sectors'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get project-wise statistics
        $stmt = $conn->prepare("
            SELECT p.p_name, 
                   COUNT(DISTINCT k.k_id) as total_kendras,
                   COUNT(DISTINCT st.s_id) as total_students
            FROM master_pariyojna p
            LEFT JOIN master_kendra k ON p.p_id = k.kp_id
            LEFT JOIN master_student st ON p.p_id = st.sp_id
            GROUP BY p.p_id, p.p_name
        ");
        $stmt->execute();
        $additionalStats['project_wise_stats'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get recent activity (last 10 photos)
        $stmt = $conn->prepare("
            SELECT 'student' as type, ps_id as user_id, created_at
            FROM plant_photo_s
            ORDER BY created_at DESC
            LIMIT 5
        ");
        $stmt->execute();
        $studentPhotos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $stmt = $conn->prepare("
            SELECT 'aanganwadi' as type, pk_id as user_id, created_at
            FROM plant_photo_k
            ORDER BY created_at DESC
            LIMIT 5
        ");
        $stmt->execute();
        $kendraPhotos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $recentActivity = array_merge($studentPhotos, $kendraPhotos);
        usort($recentActivity, function($a, $b) {
            return strtotime($b['created_at']) - strtotime($a['created_at']);
        });
        
        $additionalStats['recent_activity'] = array_slice($recentActivity, 0, 10);
        
        // Health status distribution
        $stmt = $conn->prepare("
            SELECT s_healtha_status, COUNT(*) as count
            FROM master_student
            WHERE s_healtha_status IS NOT NULL
            GROUP BY s_healtha_status
        ");
        $stmt->execute();
        $additionalStats['health_status_distribution'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
    } catch (Exception $e) {
        $additionalStats['error'] = 'Could not fetch additional statistics: ' . $e->getMessage();
    }
    
    return $additionalStats;
}
?>
