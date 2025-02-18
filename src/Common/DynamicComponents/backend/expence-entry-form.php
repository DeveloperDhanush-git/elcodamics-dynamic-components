<?php
// Allow requests from any origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$database = "expence_entry_form";

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
        $expenseType = $data["expenseType"] ?? '';
        $amount = $data["amount"] ?? 0;
        $date = $data["date"] ?? '';
        $paymentMode = $data["paymentMode"] ?? '';
        $notes = $data["notes"] ?? '';

        if (empty($expenseType) || empty($amount) || empty($date) || empty($paymentMode)) {
            echo json_encode(["status" => "error", "message" => "All fields are required."]);
            exit;
        }

        $isActive = 1;
        $isDeleted = 0;
        $createdOn = date("Y-m-d H:i:s");

        $stmt = $conn->prepare("INSERT INTO expenses (expenseType, amount, date, paymentMode, notes, is_active, is_deleted, createdOn, modifiedOn) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sdssssiss", $expenseType, $amount, $date, $paymentMode, $notes, $isActive, $isDeleted, $createdOn, $createdOn);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Expense record added successfully!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
        }
        $stmt->close();
        break;

    // 🔵 READ Operation (GET)
    case "GET":
        $sql = "SELECT * FROM expenses WHERE is_deleted = 0 AND is_active = 1";
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
        $expenseType = $data["expenseType"] ?? '';
        $amount = $data["amount"] ?? 0;
        $date = $data["date"] ?? '';
        $paymentMode = $data["paymentMode"] ?? '';
        $notes = $data["notes"] ?? '';
        $isActive = $data["is_active"] ?? 1;
        $modifiedOn = date("Y-m-d H:i:s");

        if (empty($id) || empty($expenseType) || empty($amount) || empty($date) || empty($paymentMode)) {
            echo json_encode(["status" => "error", "message" => "All fields are required."]);
            exit;
        }

        $stmt = $conn->prepare("UPDATE expenses 
                                SET expenseType=?, amount=?, date=?, paymentMode=?, notes=?, is_active=?, modifiedOn=? 
                                WHERE id=?");
        $stmt->bind_param("sdsssssi", $expenseType, $amount, $date, $paymentMode, $notes, $isActive, $modifiedOn, $id);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Expense record updated successfully!"]);
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

        $stmt = $conn->prepare("UPDATE expenses SET is_active = 0, is_deleted = 1 WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Expense record deleted successfully!"]);
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