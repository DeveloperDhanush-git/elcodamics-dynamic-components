<?php
// Allow cross-origin requests from localhost:3000 (or wherever your frontend is running)
header("Access-Control-Allow-Origin: http://localhost:3000"); // Replace with your frontend URL if different
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit; // Stop processing further if it's a preflight request
}

// Set your database connection details
$host = 'localhost';
$port = '3307'; // MySQL port
$username = 'root'; // Your MySQL username
$password = ''; // Your MySQL password
$dbname = 'forms'; // Database name

// Create a connection to the MySQL database
$conn = new mysqli($host . ":" . $port, $username, $password, $dbname);

// Check if the connection is successful
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

// Handle incoming requests
$requestMethod = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);

// Function to fetch all tool replacements
if ($requestMethod == 'GET') {
    $sql = "SELECT * FROM tool_replacement WHERE Is_Deleted = 0";
    $result = $conn->query($sql);
    $toolReplacements = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $toolReplacements[] = $row;
        }
    }

    echo json_encode($toolReplacements);
}

// Function to create a new tool replacement record
if ($requestMethod == 'POST') {
    if (isset($data['oldToolName'], $data['newToolName'], $data['approvalStatus'], $data['reason'])) {
        $oldToolName = $data['oldToolName'];
        $newToolName = $data['newToolName'];
        $approvalStatus = $data['approvalStatus'];
        $reason = $data['reason'];

        $stmt = $conn->prepare("INSERT INTO tool_replacement (oldToolName, newToolName, approvalStatus, reason) 
                                VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $oldToolName, $newToolName, $approvalStatus, $reason);
        
        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Tool replacement record created successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error creating tool replacement record']);
        }
        $stmt->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    }
}

// Function to update an existing tool replacement record
if ($requestMethod == 'PUT') {
    if (isset($data['id'], $data['oldToolName'], $data['newToolName'], $data['approvalStatus'], $data['reason'])) {
        $id = $data['id'];
        $oldToolName = $data['oldToolName'];
        $newToolName = $data['newToolName'];
        $approvalStatus = $data['approvalStatus'];
        $reason = $data['reason'];

        $stmt = $conn->prepare("UPDATE tool_replacement 
                                SET oldToolName = ?, newToolName = ?, approvalStatus = ?, reason = ?
                                WHERE id = ?");
        $stmt->bind_param("ssssi", $oldToolName, $newToolName, $approvalStatus, $reason, $id);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Tool replacement record updated successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error updating tool replacement record']);
        }
        $stmt->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    }
}

// Function to delete a tool replacement record (mark as deleted)
if ($requestMethod == 'DELETE') {
    if (isset($data['id'])) {
        $id = $data['id'];

        // Prepare the SQL query to mark the record as deleted (Is_Deleted = 1)
        $stmt = $conn->prepare("UPDATE tool_replacement SET Is_Deleted = 1 WHERE id = ? AND Is_Deleted = 0");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                echo json_encode(['status' => 'success', 'message' => 'Tool replacement record deleted successfully']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Record not found or already deleted']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error deleting tool replacement record']);
        }
        $stmt->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Missing record ID']);
    }
}

// Function to activate a tool replacement record (mark as active)
if ($requestMethod == 'PUT' && isset($data['activate'])) {
    if (isset($data['id'])) {
        $id = $data['id'];

        // Prepare the SQL query to mark the record as active (Is_Deleted = 0)
        $stmt = $conn->prepare("UPDATE tool_replacement SET Is_Deleted = 0 WHERE id = ? AND Is_Deleted = 1");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                echo json_encode(['status' => 'success', 'message' => 'Tool replacement record activated successfully']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Record not found or already active']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error activating tool replacement record']);
        }
        $stmt->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Missing record ID']);
    }
}

// Close the connection
$conn->close();
?>
