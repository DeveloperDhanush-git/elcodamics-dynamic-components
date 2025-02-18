<?php
// Set headers for JSON response and CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle OPTIONS request for CORS preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "userdata";

// Create a new connection to the database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check for connection errors
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed."]);
    exit();
}

// Get data from POST request
$data = json_decode(file_get_contents("php://input"), true);

// Check if required fields are provided
if (!isset($data['username']) || !isset($data['email']) || !isset($data['phone']) || !isset($data['password'])) {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
    exit();
}

// Sanitize user input to prevent SQL injection
$username = $conn->real_escape_string($data['username']);
$email = $conn->real_escape_string($data['email']);
$phone = $conn->real_escape_string($data['phone']);
$password = password_hash($conn->real_escape_string($data['password']), PASSWORD_BCRYPT);  // Hash the password

// Check if the email already exists
$sql = "SELECT * FROM users WHERE email = '$email' AND is_deleted = 0";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Email already exists."]);
    exit();
}

// Insert user data into the database
$sql = "INSERT INTO users (username, email, phoneNumber, password, is_active, is_deleted) 
        VALUES ('$username', '$email', '$phone', '$password', 1, 0)";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success", "message" => "User registered successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
}

// Close the database connection
$conn->close();
?>
