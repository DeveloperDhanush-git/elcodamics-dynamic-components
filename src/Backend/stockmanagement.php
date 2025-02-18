<?php
// Allow requests from any origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$database = "stockmanagement"; // Adjust to your database name

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
        $productName = $data["product_name"] ?? '';
        $adjustmentType = $data["adjustment_type"] ?? '';
        $quantity = $data["quantity"] ?? 0;
        $reason = $data["reason"] ?? '';

        if (empty($productName) || empty($adjustmentType) || empty($quantity)) {
            echo json_encode(["status" => "error", "message" => "Product name, adjustment type, and quantity are required."]);
            exit;
        }

        $isActive = 1;
        $isDeleted = 0;
        $createdOn = date("Y-m-d H:i:s");
        $modifiedOn = $createdOn;

        $stmt = $conn->prepare("INSERT INTO stockadjustment (product_name, adjustment_type, quantity, reason, is_active, is_deleted, created_on, modified_on)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

        $stmt->bind_param("ssississ", $productName, $adjustmentType, $quantity, $reason, $isActive, $isDeleted, $createdOn, $modifiedOn);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Stock adjustment record added successfully!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
        }

        $stmt->close();
        break;

    // :large_blue_circle: READ Operation (GET)
    case "GET":
        $sql = "SELECT * FROM stockadjustment WHERE is_deleted = 0 AND is_active = 1";
        $result = $conn->query($sql);
        $records = [];

        while ($row = $result->fetch_assoc()) {
            $records[] = $row;
        }

        echo json_encode($records);
        break;

    // :large_yellow_circle: UPDATE Operation (PUT)
    case "PUT":
        $id = $data["id"] ?? 0;
        $productName = $data["product_name"] ?? '';
        $adjustmentType = $data["adjustment_type"] ?? '';
        $quantity = $data["quantity"] ?? 0;
        $reason = $data["reason"] ?? '';
        $isActive = $data["is_active"] ?? 1;
        $modifiedOn = date("Y-m-d H:i:s");

        if (empty($id) || empty($productName) || empty($adjustmentType) || empty($quantity)) {
            echo json_encode(["status" => "error", "message" => "ID, product name, adjustment type, and quantity are required."]);
            exit;
        }

        $stmt = $conn->prepare("UPDATE stockadjustment
                                SET product_name=?, adjustment_type=?, quantity=?, reason=?, is_active=?, modified_on=?
                                WHERE id=?");

        $stmt->bind_param("ssissisi", $productName, $adjustmentType, $quantity, $reason, $isActive, $modifiedOn, $id);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Stock adjustment record updated successfully!"]);
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

        $stmt = $conn->prepare("UPDATE stockadjustment SET is_active = 0, is_deleted = 1 WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Stock adjustment record deleted successfully!"]);
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
