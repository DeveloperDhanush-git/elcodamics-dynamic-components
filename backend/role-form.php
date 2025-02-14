<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root"; 
$password = "";
$dbname = "role_form"; // Replace with your actual database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

// Get the posted data
$data = json_decode(file_get_contents("php://input"), true);

// Check if data is valid
if (isset($data['roleName'], $data['accessLevel'], $data['modulesAllowed'])) {
    $roleName = $data['roleName'];
    $accessLevel = implode(",", $data['accessLevel']);  // Assuming accessLevel is an array
    $modulesAllowed = implode(",", $data['modulesAllowed']);  // Assuming modulesAllowed is an array

    // Prepare the SQL statement
    $stmt = $conn->prepare("INSERT INTO roles (role_name, access_level, modules_allowed) VALUES (?, ?, ?)");
    if ($stmt === false) {
        die(json_encode(["status" => "error", "message" => "Failed to prepare statement: " . $conn->error]));
    }

    $stmt->bind_param("sss", $roleName, $accessLevel, $modulesAllowed);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Role record inserted successfully!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to insert role record: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Missing required data"]);
}

$conn->close();
?>
