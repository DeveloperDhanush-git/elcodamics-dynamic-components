<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "expensesdb";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

// Get the posted data
$data = json_decode(file_get_contents("php://input"), true);

$expenseType = $data['expenseType'];
$amount = $data['amount'];
$date = $data['date'];
$paymentMode = $data['paymentMode'];
$notes = $data['notes'];

// Prepare the SQL statement
$stmt = $conn->prepare("INSERT INTO expense_entries (expense_type, amount, expense_date, payment_mode, notes) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sdsss", $expenseType, $amount, $date, $paymentMode, $notes);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Expense recorded successfully!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to record expense"]);
}

$stmt->close();
$conn->close();
?>
