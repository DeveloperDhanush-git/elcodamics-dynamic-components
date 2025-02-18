<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "";
$database = "feedback_management"; // Database for feedback

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

if ($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET['month'])) {
    $month = $_GET['month']; 

    $valid_months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    if (in_array($month, $valid_months)) {
        $month_num = date('m', strtotime($month . " 1"));

        $sql = "SELECT COUNT(*) AS totalFeedback FROM feedbacks WHERE MONTH(CreatedOn) = ? AND Is_Deleted = 0 AND Is_Active = 1";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $month_num);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result) {
            $row = $result->fetch_assoc();
            $totalFeedback = $row['totalFeedback'];

            echo "
            <html>
            <head>
                <title>Feedback Count</title>
                <style>
                    table { border-collapse: collapse; width: 50%; margin: 20px auto; font-family: Arial, sans-serif; }
                    th, td { border: 1px solid black; padding: 10px; text-align: center; }
                    th { background-color: #4CAF50; color: white; }
                </style>
            </head>
            <body>
                <h2 style='text-align:center;'>Feedback Count for $month</h2>
                <table>
                    <tr>
                        <th>Month</th>
                        <th>Total Feedback</th>
                    </tr>
                    <tr>
                        <td>$month</td>
                        <td>$totalFeedback</td>
                    </tr>
                </table>
            </body>
            </html>";
        } else {
            echo json_encode(["status" => "error", "message" => "Error executing query: " . $conn->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid month provided."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Month parameter is required."]);
}

$conn->close();
?>
