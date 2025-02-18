<?php
// Allow requests from any origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$database = "vendor_management"; // Adjust to your database name
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
    // :large_green_circle: CREATE Operation (POST)
    case "POST":
        $vendorName = $data["vendorName"] ?? '';
        $contactPerson = $data["contactPerson"] ?? '';
        $contactNumber = $data["contactNumber"] ?? '';
        $email = $data["email"] ?? '';
        $gstNumber = $data["gstNumber"] ?? '';
        $businessType = $data["businessType"] ?? '';
        $status = $data["status"] ?? '';
        
        if (empty($vendorName) || empty($contactPerson) || empty($contactNumber) || empty($email) || empty($gstNumber) || empty($businessType) || empty($status)) {
            echo json_encode(["status" => "error", "message" => "All fields are required."]);
            exit;
        }

        $isActive = 1;
        $isDeleted = 0;
        $createdOn = date("Y-m-d H:i:s");
        $modifiedOn = $createdOn;

        $stmt = $conn->prepare("INSERT INTO vendors (vendorName, contactPerson, contactNumber, email, gstNumber, businessType, status, is_active, is_deleted, created_on, modified_on) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssssiiss", $vendorName, $contactPerson, $contactNumber, $email, $gstNumber, $businessType, $status, $isActive, $isDeleted, $createdOn, $modifiedOn);
        
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Vendor added successfully!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
        }
        $stmt->close();
        break;

    // :large_blue_circle: READ Operation (GET)
    case "GET":
        $sql = "SELECT * FROM vendors WHERE is_deleted = 0 AND is_active = 1";
        $result = $conn->query($sql);
        $vendors = [];
        while ($row = $result->fetch_assoc()) {
            $vendors[] = $row;
        }
        echo json_encode(["status" => "success", "data" => $vendors]);
        break;

    // :large_yellow_circle: UPDATE Operation (PUT)
    case "PUT":
        $id = $data["id"] ?? 0;
        $vendorName = $data["vendorName"] ?? '';
        $contactPerson = $data["contactPerson"] ?? '';
        $contactNumber = $data["contactNumber"] ?? '';
        $email = $data["email"] ?? '';
        $gstNumber = $data["gstNumber"] ?? '';
        $businessType = $data["businessType"] ?? '';
        $status = $data["status"] ?? '';
        
        if (empty($id) || empty($vendorName) || empty($contactPerson) || empty($contactNumber) || empty($email) || empty($gstNumber) || empty($businessType) || empty($status)) {
            echo json_encode(["status" => "error", "message" => "ID and all fields are required."]);
            exit;
        }

        $modifiedOn = date("Y-m-d H:i:s");
        
        $stmt = $conn->prepare("UPDATE vendors SET vendorName=?, contactPerson=?, contactNumber=?, email=?, gstNumber=?, businessType=?, status=?, modified_on=? WHERE id=?");
        $stmt->bind_param("sssssssisi", $vendorName, $contactPerson, $contactNumber, $email, $gstNumber, $businessType, $status, $modifiedOn, $id);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Vendor updated successfully!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
        }
        $stmt->close();
        break;

    // :red_circle: DELETE Operation (Soft delete)
    case "DELETE":
        $id = $data["id"] ?? 0;
        if (empty($id)) {
            echo json_encode(["status" => "error", "message" => "ID is required for deletion."]);
            exit;
        }

        $stmt = $conn->prepare("UPDATE vendors SET is_active = 0, is_deleted = 1 WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Vendor deleted successfully!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
        }
        $stmt->close();
        break;

    // :x: Invalid Request Method
    default:
        echo json_encode(["status" => "error", "message" => "Invalid request method"]);
        break;
}

$conn->close();
?>
