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

// Check if both email and password are provided
if (!isset($data['email']) || !isset($data['password'])) {
    echo json_encode(["status" => "error", "message" => "Email and Password are required."]);
    exit();
}

// Sanitize user input to prevent SQL injection
$email = $conn->real_escape_string($data['email']);
$password = $conn->real_escape_string($data['password']);

// Query to check if the email exists and the user is not deleted
$sql = "SELECT * FROM users WHERE email = '$email' AND is_deleted = 0";

$result = $conn->query($sql);

// Check if email exists and the password is correct
if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    if (password_verify($password, $user['password'])) {
        // If password is correct, generate a token (use JWT for real production)
        $token = base64_encode(random_bytes(32));  // Simple token generation
        echo json_encode(["status" => "success", "message" => "Login successful", "token" => $token]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid Password."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "User not found."]);
}

// Close the database connection
$conn->close();
?>
