<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "tax-gst-form";  // Replace with your actual database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

// Get the posted data
$data = json_decode(file_get_contents("php://input"), true);

$invoiceNumber = $data['invoiceNumber'];
$gstType = $data['gstType'];
$amount = $data['amount'];
$filingDate = $data['filingDate'];
$status = $data['status'];

// Prepare the SQL statement
$stmt = $conn->prepare("INSERT INTO tax_gst_filing (invoice_number, gst_type, amount, filing_date, status) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("ssdss", $invoiceNumber, $gstType, $amount, $filingDate, $status);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "GST filing record inserted successfully!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to insert GST filing record"]);
}

$stmt->close();
$conn->close();
?>
