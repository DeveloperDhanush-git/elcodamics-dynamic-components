<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root"; 
$password = "";
$dbname = "add_user_form";  // Replace with your actual database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

// Get the posted data
$data = json_decode(file_get_contents("php://input"), true);

$userName = $data['userName'];
$email = $data['email'];
$phoneNumber = $data['phoneNumber'];
$role = $data['role'];
$status = $data['status'];

// Prepare the SQL statement
$stmt = $conn->prepare("INSERT INTO users (user_name, email, phone_number, role, status) 
                        VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $userName, $email, $phoneNumber, $role, $status);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "User record inserted successfully!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to insert user record"]);
}

$stmt->close();
$conn->close();
?>
