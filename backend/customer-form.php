<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root"; 
$password = "";
$dbname = "customer_form";  // Replace with your actual database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

// Get the posted data
$data = json_decode(file_get_contents("php://input"), true);

$customerName = $data['customerName'];
$contactNumber = $data['contactNumber'];
$email = $data['email'];
$address = $data['address'];
$gstNumber = $data['gstNumber'];
$businessType = $data['businessType'];
$status = $data['status'];

// Prepare the SQL statement
$stmt = $conn->prepare("INSERT INTO customers (customer_name, contact_number, email, address, gst_number, business_type, status) 
                        VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssss", $customerName, $contactNumber, $email, $address, $gstNumber, $businessType, $status);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Customer record inserted successfully!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to insert customer record"]);
}

$stmt->close();
$conn->close();
?>
