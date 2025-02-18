<?php
// Allow requests from any origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$database = "add_user_form"; // Change to your database name

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

    // 🟢 CREATE Operation (POST)
    case "POST":
        $userName = $data["userName"] ?? '';
        $email = $data["email"] ?? '';
        $phoneNumber = $data["phoneNumber"] ?? '';
        $role = $data["role"] ?? '';
        $status = $data["status"] ?? 'active'; // Default to 'active' if not provided

        if (empty($userName) || empty($email) || empty($phoneNumber) || empty($role) || empty($status)) {
            echo json_encode(["status" => "error", "message" => "All fields are required."]);
            exit;
        }

        $isActive = 1;
        $isDeleted = 0;
        $createdOn = date("Y-m-d H:i:s");

        $stmt = $conn->prepare("INSERT INTO users (userName, email, phoneNumber, role, status, is_active, is_deleted, createdOn, modifiedOn) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssiiss", $userName, $email, $phoneNumber, $role, $status, $isActive, $isDeleted, $createdOn, $createdOn);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "User record added successfully!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
        }
        $stmt->close();
        break;

    // 🔵 READ Operation (GET)
    case "GET":
        $sql = "SELECT * FROM users WHERE is_deleted = 0 AND is_active = 1";
        $result = $conn->query($sql);
        $records = [];
        while ($row = $result->fetch_assoc()) {
            $records[] = $row;
        }
        echo json_encode($records);
        break;

    // 🟡 UPDATE Operation (PUT)
    case "PUT":
        $id = $data["id"] ?? 0;
        $userName = $data["userName"] ?? '';
        $email = $data["email"] ?? '';
        $phoneNumber = $data["phoneNumber"] ?? '';
        $role = $data["role"] ?? '';
        $status = $data["status"] ?? 'active'; // Default to 'active' if not provided
        $isActive = $data["is_active"] ?? 1;
        $modifiedOn = date("Y-m-d H:i:s");

        if (empty($id) || empty($userName) || empty($email) || empty($phoneNumber) || empty($role) || empty($status)) {
            echo json_encode(["status" => "error", "message" => "All fields are required."]);
            exit;
        }

        $stmt = $conn->prepare("UPDATE users 
                                SET userName=?, email=?, phoneNumber=?, role=?, status=?, is_active=?, modifiedOn=? 
                                WHERE id=?");
        $stmt->bind_param("sssssiisi", $userName, $email, $phoneNumber, $role, $status, $isActive, $modifiedOn, $id);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "User record updated successfully!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
        }
        $stmt->close();
        break;

    // 🔴 DELETE Operation (Soft delete)
    case "DELETE":
        $id = $data["id"] ?? 0;

        if (empty($id)) {
            echo json_encode(["status" => "error", "message" => "ID is required for deletion."]);
            exit;
        }

        $stmt = $conn->prepare("UPDATE users SET is_active = 0, is_deleted = 1 WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "User record deleted successfully!"]);
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
