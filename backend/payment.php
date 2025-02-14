<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "payment_recipt";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

// Get the posted data
$data = json_decode(file_get_contents("php://input"), true);

$customerVendorName = $data['customerVendorName'];
$invoicePurchaseOrderNumber = $data['invoicePurchaseOrderNumber'];
$amount = $data['amount'];
$paymentMode = $data['paymentMode'];
$date = $data['date'];

// Prepare the SQL statement
$stmt = $conn->prepare("INSERT INTO payment_receipts (customer_vendor_name, invoice_purchase_order_number, amount, payment_mode, date) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("ssdss", $customerVendorName, $invoicePurchaseOrderNumber, $amount, $paymentMode, $date);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Payment receipt recorded successfully!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to record payment receipt"]);
}

$stmt->close();
$conn->close();
?>
