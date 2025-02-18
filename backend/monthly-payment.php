<?php
// Allow requests from any origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$database = "expenses_entry_form";  // Update this with your actual database name

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check the database connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

$method = $_SERVER["REQUEST_METHOD"];

switch ($method) {

    // 🟢 GET Monthly Expense Reports
    case "GET":
        // Existing code for retrieving monthly expense reports
        $currentMonth = date('Y-m');
        $lastMonth = date('Y-m', strtotime('-1 month'));
        $twoMonthsAgo = date('Y-m', strtotime('-2 months'));

        $monthlyReports = [];

        // Current Month Report
        $sql = "SELECT COUNT(*) AS total_count, SUM(amount) AS total_amount FROM expenses WHERE date LIKE '$currentMonth%' AND is_deleted = 0 AND is_active = 1";
        $result = $conn->query($sql);
        $monthlyReports['current_month'] = $result->fetch_assoc();

        // Last Month Report
        $sql = "SELECT COUNT(*) AS total_count, SUM(amount) AS total_amount FROM expenses WHERE date LIKE '$lastMonth%' AND is_deleted = 0 AND is_active = 1";
        $result = $conn->query($sql);
        $monthlyReports['last_month'] = $result->fetch_assoc();

        // Two Months Ago Report
        $sql = "SELECT COUNT(*) AS total_count, SUM(amount) AS total_amount FROM expenses WHERE date LIKE '$twoMonthsAgo%' AND is_deleted = 0 AND is_active = 1";
        $result = $conn->query($sql);
        $monthlyReports['two_months_ago'] = $result->fetch_assoc();

        echo json_encode($monthlyReports);
        break;

    // 🟢 POST Request to Calculate Total Amount for a Specific Month
    case "POST":
        $data = json_decode(file_get_contents("php://input"), true);
        $month = $data["month"] ?? '';  // Get the month from the request data (e.g., "2024-02")

        if (empty($month)) {
            echo json_encode(["status" => "error", "message" => "Month parameter is required."]);
            exit;
        }

        // Sanitize the month to ensure it's in a valid format (YYYY-MM)
        if (!preg_match("/^\d{4}-\d{2}$/", $month)) {
            echo json_encode(["status" => "error", "message" => "Invalid month format. Use 'YYYY-MM'."]);
            exit;
        }

        // Query to calculate the total amount for the given month
        $sql = "SELECT COUNT(*) AS total_count, SUM(amount) AS total_amount FROM expenses WHERE date LIKE '$month%' AND is_deleted = 0 AND is_active = 1";
        $result = $conn->query($sql);

        if ($result) {
            $monthlyData = $result->fetch_assoc();
            echo json_encode([
                "status" => "success",
                "message" => "Total amount for $month",
                "data" => $monthlyData
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
        }

        break;

    // ❌ Invalid Request Method
    default:
        echo json_encode(["status" => "error", "message" => "Invalid request method"]);
        break;
}

$conn->close();
?>
