<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Database credentials
$host = 'localhost';
$port = 3307;
$username = 'root';
$password = '';
$dbname = 'forms';

// Connect to MySQL
$conn = new mysqli($host, $username, $password, $dbname, $port);
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]));
}

$requestMethod = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);

// Fetch active maintenance requests
if ($requestMethod == 'GET') {
    $sql = "SELECT * FROM machine_maintenance WHERE is_deleted = 0";
    $result = $conn->query($sql);
    $requests = [];

    while ($row = $result->fetch_assoc()) {
        $requests[] = $row;
    }
    
    echo json_encode($requests);
}

// Create a new maintenance request
if ($requestMethod == 'POST') {
    if (!isset($data['machineName'], $data['issueType'], $data['priority'], $data['scheduledDate'], $data['description'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
        exit;
    }

    $machineName = htmlspecialchars($data['machineName']);
    $issueType = htmlspecialchars($data['issueType']);
    $priority = htmlspecialchars($data['priority']);
    $scheduledDate = htmlspecialchars($data['scheduledDate']);
    $description = htmlspecialchars($data['description']);

    $stmt = $conn->prepare("INSERT INTO machine_maintenance 
                            (machine_name, issue_type, priority, scheduled_date, description, is_active, is_deleted, created_on, modified_on) 
                            VALUES (?, ?, ?, ?, ?, 1, 0, NOW(), NOW())");
    $stmt->bind_param("sssss", $machineName, $issueType, $priority, $scheduledDate, $description);
    
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Maintenance request created']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to create request']);
    }
    $stmt->close();
}

// Update an existing maintenance request
if ($requestMethod == 'PUT') {
    if (!isset($data['id'], $data['machineName'], $data['issueType'], $data['priority'], $data['scheduledDate'], $data['description'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
        exit;
    }

    $id = (int)$data['id'];
    $machineName = htmlspecialchars($data['machineName']);
    $issueType = htmlspecialchars($data['issueType']);
    $priority = htmlspecialchars($data['priority']);
    $scheduledDate = htmlspecialchars($data['scheduledDate']);
    $description = htmlspecialchars($data['description']);

    $stmt = $conn->prepare("UPDATE machine_maintenance 
                            SET machine_name = ?, issue_type = ?, priority = ?, scheduled_date = ?, description = ?, modified_on = NOW() 
                            WHERE id = ? AND is_deleted = 0");
    $stmt->bind_param("sssssi", $machineName, $issueType, $priority, $scheduledDate, $description, $id);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Maintenance request updated']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Update failed']);
    }
    $stmt->close();
}

// Soft delete a maintenance request
if ($requestMethod == 'DELETE') {
    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Missing maintenance request ID']);
        exit;
    }

    $id = (int)$data['id'];
    $stmt = $conn->prepare("UPDATE machine_maintenance SET is_deleted = 1, is_active = 0 WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Maintenance request deleted']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Deletion failed']);
    }
    $stmt->close();
}

// Close connection
$conn->close();
?>
