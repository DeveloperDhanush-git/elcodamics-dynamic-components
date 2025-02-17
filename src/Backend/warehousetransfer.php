<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = "localhost";
$user = "root";
$password = "";
$dbname = "warehousetransfer_form";
$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    file_put_contents("php_errors.log", "Connection failed: " . $conn->connect_error . "\n", FILE_APPEND);
    die(json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]));
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM warehouse_transfers WHERE is_deleted = 0";
        $result = $conn->query($sql);
        if ($result) {
            $transfers = [];
            while ($row = $result->fetch_assoc()) {
                $transfers[] = $row;
            }
            echo json_encode($transfers);
        } else {
            file_put_contents("php_errors.log", "Error fetching transfers: " . $conn->error . "\n", FILE_APPEND);
            echo json_encode(["success" => false, "message" => "Error fetching transfers: " . $conn->error]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || !isset($data["product_name"], $data["from_warehouse"], $data["to_warehouse"], $data["quantity"], $data["transfer_date"])) {
            echo json_encode(["success" => false, "message" => "Missing required fields for the transfer"]);
            exit;
        }

        $stmt = $conn->prepare("INSERT INTO warehouse_transfers (product_name, from_warehouse, to_warehouse, quantity, transfer_date, is_active, is_deleted, created_on, modified_on) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");

// Correcting the bind_param method: 7 parameters for 7 fields
$stmt->bind_param("sssisis", 
    $data["product_name"], $data["from_warehouse"], $data["to_warehouse"], 
    $data["quantity"], $data["transfer_date"], $data["is_active"], $data["is_deleted"]
);


        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Transfer added successfully"]);
        } else {
            file_put_contents("php_errors.log", "Error adding transfer: " . $stmt->error . "\n", FILE_APPEND);
            echo json_encode(["success" => false, "message" => "Error adding transfer: " . $stmt->error]);
        }
        $stmt->close();
        break;

    case 'PUT': 
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data["id"])) {
            echo json_encode(["success" => false, "message" => "Transfer ID is required for update"]);
            exit;
        }
        
        $stmt = $conn->prepare("UPDATE warehouse_transfers SET product_name=?, from_warehouse=?, to_warehouse=?, quantity=?, transfer_date=?, is_active=?, is_deleted=?, modified_on=NOW() WHERE id=?");
        $stmt->bind_param("sssisis", 
            $data["product_name"], $data["from_warehouse"], $data["to_warehouse"], 
            $data["quantity"], $data["transfer_date"], $data["is_active"], $data["is_deleted"], $data["id"]
        );
        
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Transfer updated successfully"]);
        } else {
            file_put_contents("php_errors.log", "Error updating transfer: " . $stmt->error . "\n", FILE_APPEND);
            echo json_encode(["success" => false, "message" => "Error updating transfer: " . $stmt->error]);
        }
        $stmt->close();
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data["id"])) {
            echo json_encode(["success" => false, "message" => "Transfer ID is required for deletion"]);
            exit;
        }
        
        $stmt = $conn->prepare("UPDATE warehouse_transfers SET is_deleted = 1 WHERE id=?");
        $stmt->bind_param("i", $data["id"]);
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Transfer deleted successfully"]);
        } else {
            file_put_contents("php_errors.log", "Error deleting transfer: " . $stmt->error . "\n", FILE_APPEND);
            echo json_encode(["success" => false, "message" => "Error deleting transfer: " . $stmt->error]);
        }
        $stmt->close();
        break;
}

$conn->close();
?>
