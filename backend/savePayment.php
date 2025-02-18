<?php
// Allow cross-origin requests from localhost:3000 (or wherever your frontend is running)
header("Access-Control-Allow-Origin: http://localhost:3000"); // Replace with your frontend URL if different
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json'); // Ensure JSON response

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

// Set database connection details
$host = 'localhost';
$port = 3307; // MySQL port
$username = 'root';
$password = '';
$dbname = 'forms';

// Create a connection to the MySQL database
$conn = new mysqli($host, $username, $password, $dbname, $port);

// Check if the connection is successful
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

// Handle incoming requests
$requestMethod = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);

// Function to fetch all supplier payments
if ($requestMethod == 'GET') {
    $sql = "SELECT * FROM supplier_payments WHERE is_deleted = 0";
    $result = $conn->query($sql);
    $payments = [];

    if ($result) { 
        while ($row = $result->fetch_assoc()) {
            $payments[] = $row;
        }
        echo json_encode(["status" => "success", "data" => $payments]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error fetching data"]);
    }
    exit;
}

// Function to create a new supplier payment
if ($requestMethod == 'POST') {
    if (isset($data['supplierName'], $data['purchaseOrderNumber'], $data['amountPaid'], $data['paymentMode'], $data['paymentDate'])) {
        $supplierName = $data['supplierName'];
        $purchaseOrderNumber = $data['purchaseOrderNumber'];
        $amountPaid = $data['amountPaid'];
        $paymentMode = $data['paymentMode'];
        $paymentDate = $data['paymentDate'];

        $stmt = $conn->prepare("INSERT INTO supplier_payments (supplier_name, purchase_order_number, amount_paid, payment_mode, payment_date) 
                                VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssdss", $supplierName, $purchaseOrderNumber, $amountPaid, $paymentMode, $paymentDate);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Supplier payment created successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error creating supplier payment']);
        }
        $stmt->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    }
    exit;
}

// Function to update an existing supplier payment
if ($requestMethod == 'PUT') {
    if (isset($data['id'], $data['supplierName'], $data['purchaseOrderNumber'], $data['amountPaid'], $data['paymentMode'], $data['paymentDate'])) {
        $id = $data['id'];
        $supplierName = $data['supplierName'];
        $purchaseOrderNumber = $data['purchaseOrderNumber'];
        $amountPaid = $data['amountPaid'];
        $paymentMode = $data['paymentMode'];
        $paymentDate = $data['paymentDate'];

        $stmt = $conn->prepare("UPDATE supplier_payments 
                                SET supplier_name = ?, purchase_order_number = ?, amount_paid = ?, payment_mode = ?, payment_date = ?, modified_on = CURRENT_TIMESTAMP 
                                WHERE id = ?");
        $stmt->bind_param("ssdssi", $supplierName, $purchaseOrderNumber, $amountPaid, $paymentMode, $paymentDate, $id);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Supplier payment updated successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error updating supplier payment']);
        }
        $stmt->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    }
    exit;
}

// Function to delete a supplier payment (soft delete)
if ($requestMethod == 'DELETE') {
    if (isset($data['id'])) {
        $id = $data['id'];

        $stmt = $conn->prepare("UPDATE supplier_payments SET is_deleted = 1 WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Supplier payment deleted successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error deleting supplier payment']);
        }
        $stmt->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Missing payment ID']);
    }
    exit;
}

// Close the connection
$conn->close();
?>
