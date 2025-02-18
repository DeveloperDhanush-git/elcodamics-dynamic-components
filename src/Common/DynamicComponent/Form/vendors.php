<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$database = "vendor_management";

// Database connection
$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);
$method = $_SERVER["REQUEST_METHOD"];

switch ($method) {
    case "POST": // Create Vendor
        $stmt = $conn->prepare("INSERT INTO vendors (vendorName, contactPerson, contactNumber, email, gstNumber, businessType, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssss", $data["vendorName"], $data["contactPerson"], $data["contactNumber"], $data["email"], $data["gstNumber"], $data["businessType"], $data["status"]);
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Vendor added successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error: " . $stmt->error]);
        }
        $stmt->close();
        break;

    case "GET": // Read Vendors
        $result = $conn->query("SELECT * FROM vendors WHERE is_deleted = 0 AND is_active = 1");
        $vendors = [];
        while ($row = $result->fetch_assoc()) {
            $vendors[] = $row;
        }
        echo json_encode(["success" => true, "data" => $vendors]);
        break;

    case "PUT": // Update Vendor
        $stmt = $conn->prepare("UPDATE vendors SET vendorName=?, contactPerson=?, contactNumber=?, email=?, gstNumber=?, businessType=?, status=?, modified_on=NOW() WHERE id=?");
        $stmt->bind_param("sssssssi", $data["vendorName"], $data["contactPerson"], $data["contactNumber"], $data["email"], $data["gstNumber"], $data["businessType"], $data["status"], $data["id"]);
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Vendor updated successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error: " . $stmt->error]);
        }
        $stmt->close();
        break;

    case "DELETE": // Soft Delete Vendor
        $stmt = $conn->prepare("UPDATE vendors SET is_active = 0, is_deleted = 1 WHERE id=?");
        $stmt->bind_param("i", $data["id"]);
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Vendor deleted successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error: " . $stmt->error]);
        }
        $stmt->close();
        break;

    default:
        echo json_encode(["success" => false, "message" => "Invalid request method"]);
        break;
}

$conn->close();
?>
