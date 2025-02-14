<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "warehousetransfer_form";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

// Get the JSON data from the request body
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    die(json_encode(["success" => false, "message" => "Invalid request data"]));
}

// Extract fields
$productName = $data['productName'];
$fromWarehouse = $data['fromWarehouse'];
$toWarehouse = $data['toWarehouse'];
$quantity = $data['quantity'];
$transferDate = $data['transferDate'];

// Validate data (ensure warehouses are not the same)
if ($fromWarehouse === $toWarehouse) {
    die(json_encode(["success" => false, "message" => "From and To warehouses must be different"]));
}

// Prepare and bind SQL statement
$stmt = $conn->prepare("INSERT INTO warehouse_transfers (product_name, from_warehouse, to_warehouse, quantity, transfer_date) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssds", $productName, $fromWarehouse, $toWarehouse, $quantity, $transferDate);

// Execute and return response
if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Warehouse transfer recorded successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Error: " . $stmt->error]);
}

// Close connection
$stmt->close();
$conn->close();
?>
