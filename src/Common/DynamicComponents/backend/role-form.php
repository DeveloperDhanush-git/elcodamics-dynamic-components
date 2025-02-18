<?php
// Allow requests from any origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$database = "role_form"; // Change to your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check the database connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

// Read JSON data from request
$data = json_decode(file_get_contents("php://input"), true);
$method = $_SERVER["REQUEST_METHOD"];

switch ($method) {

    // 🟢 CREATE Operation (POST) for roles
    case "POST":
        $roleName = $data["roleName"] ?? '';
        $accessLevel = $data["accessLevel"] ?? '';
        $modulesAllowed = $data["modulesAllowed"] ?? '';

        // Ensure accessLevel and modulesAllowed are not empty and are strings
        if (empty($roleName) || empty($accessLevel) || empty($modulesAllowed)) {
            echo json_encode(["status" => "error", "message" => "All fields are required."]);
            exit;
        }

        $isActive = 1;
        $isDeleted = 0;
        $createdOn = date("Y-m-d H:i:s");

        // Insert the role into the database
        $stmt = $conn->prepare("INSERT INTO roles (roleName, accessLevel, modulesAllowed, is_active, is_deleted, createdOn, modifiedOn) 
                                VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssiiis", $roleName, $accessLevel, $modulesAllowed, $isActive, $isDeleted, $createdOn, $createdOn);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Role record added successfully!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
        }
        $stmt->close();
        break;

    // 🔵 READ Operation (GET) for roles
    case "GET":
        $sql = "SELECT * FROM roles WHERE is_deleted = 0 AND is_active = 1";
        $result = $conn->query($sql);
        $records = [];
        while ($row = $result->fetch_assoc()) {
            // Ensure accessLevel and modulesAllowed are returned as arrays (for React)
            $row['accessLevel'] = explode(",", $row['accessLevel']);
            $row['modulesAllowed'] = explode(",", $row['modulesAllowed']);
            $records[] = $row;
        }
        echo json_encode($records);
        break;

    // 🟡 UPDATE Operation (PUT) for roles
    case "PUT":
        $id = $data["id"] ?? 0;
        $roleName = $data["roleName"] ?? '';
        $accessLevel = $data["accessLevel"] ?? '';
        $modulesAllowed = $data["modulesAllowed"] ?? '';
        $isActive = $data["is_active"] ?? 1;
        $modifiedOn = date("Y-m-d H:i:s");

        // Ensure all fields are present and not empty
        if (empty($id) || empty($roleName) || empty($accessLevel) || empty($modulesAllowed)) {
            echo json_encode(["status" => "error", "message" => "All fields are required."]);
            exit;
        }

        // Update the role in the database
        $stmt = $conn->prepare("UPDATE roles 
                                SET roleName=?, accessLevel=?, modulesAllowed=?, is_active=?, modifiedOn=? 
                                WHERE id=?");
        $stmt->bind_param("sssisi", $roleName, $accessLevel, $modulesAllowed, $isActive, $modifiedOn, $id);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Role record updated successfully!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
        }
        $stmt->close();
        break;

    // 🔴 DELETE Operation (Soft delete) for roles
    case "DELETE":
        $id = $data["id"] ?? 0;

        // Check if ID is provided
        if (empty($id)) {
            echo json_encode(["status" => "error", "message" => "ID is required for deletion."]);
            exit;
        }

        // Soft delete the role (set is_active = 0, is_deleted = 1)
        $stmt = $conn->prepare("UPDATE roles SET is_active = 0, is_deleted = 1 WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Role record deleted successfully!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
        }
        $stmt->close();
        break;

    // ❌ Invalid Request Method
    default:
        echo json_encode(["status" => "error", "message" => "Invalid request method"]);
        break;
}

$conn->close();
?>

