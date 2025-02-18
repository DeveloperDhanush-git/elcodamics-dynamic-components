<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root"; 
$password = ""; 
$database = "lead_management"; // Updated database name

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

// Read JSON data from request
$data = json_decode(file_get_contents("php://input"), true);
$method = $_SERVER["REQUEST_METHOD"];

switch ($method) {
    case "POST": // Create a new lead
        $leadName = $data["leadName"];
        $contactPerson = $data["contactPerson"];
        $phoneNumber = $data["phoneNumber"];
        $email = $data["email"];
        $leadSource = $data["leadSource"];
        $status = $data["status"];
        $notes = $data["notes"];
        
        // Set CreatedOn timestamp
        $createdOn = date("Y-m-d H:i:s");

        $stmt = $conn->prepare("INSERT INTO leads (leadName, contactPerson, phoneNumber, email, leadSource, status, notes, CreatedOn) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssssss", $leadName, $contactPerson, $phoneNumber, $email, $leadSource, $status, $notes, $createdOn);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Lead added successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
        }
        $stmt->close();
        break;

        case "GET": // Fetch monthly count of leads
            if (isset($_GET['month'])) {
                $month = $_GET['month']; // Get the month from the URL query string, e.g., ?month=January
        
                // Validate the month input to make sure it's a valid month
                $valid_months = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ];
        
                if (in_array($month, $valid_months)) {
                    // Convert the month to a numeric value (e.g., January -> 01, February -> 02, etc.)
                    $month_num = date('m', strtotime($month . " 1"));
        
                    // Query to get count of leads created in the specified month
                    $sql = "SELECT COUNT(*) AS totalLeads FROM leads WHERE MONTH(CreatedOn) = $month_num AND Is_Deleted = 0 AND Is_Active = 1";
                    $result = $conn->query($sql);
        
                    // Check if query was successful
                    if ($result) {
                        $row = $result->fetch_assoc();
                        $totalLeads = $row['totalLeads'];
        
                        // Display result in table format
                        echo "
                        <html>
                        <head>
                            <title>Leads Count</title>
                            <style>
                                table { border-collapse: collapse; width: 50%; margin: 20px auto; font-family: Arial, sans-serif; }
                                th, td { border: 1px solid black; padding: 10px; text-align: center; }
                                th { background-color: #4CAF50; color: white; }
                            </style>
                        </head>
                        <body>
                            <h2 style='text-align:center;'>Lead Count for $month</h2>
                            <table>
                                <tr>
                                    <th>Month</th>
                                    <th>Total Leads</th>
                                </tr>
                                <tr>
                                    <td>$month</td>
                                    <td>$totalLeads</td>
                                </tr>
                            </table>
                        </body>
                        </html>";
                    } else {
                        echo json_encode(["status" => "error", "message" => "Error executing query: " . $conn->error]);
                    }
                } else {
                    echo json_encode(["status" => "error", "message" => "Invalid month provided. Please provide a valid month (e.g., January, February, etc.)."]);
                }
            } else {
                echo json_encode(["status" => "error", "message" => "Please provide a 'month' parameter in the query string. Example: ?month=January"]);
            }
            break;
        

    case "PUT": // Update lead details
        $id = $data["id"];
        $leadName = $data["leadName"];
        $contactPerson = $data["contactPerson"];
        $phoneNumber = $data["phoneNumber"];
        $email = $data["email"];
        $leadSource = $data["leadSource"];
        $status = $data["status"];
        $notes = $data["notes"];
        
        // Update the ModifiedOn timestamp
        $modifiedOn = date("Y-m-d H:i:s");

        $stmt = $conn->prepare("UPDATE leads SET leadName=?, contactPerson=?, phoneNumber=?, email=?, leadSource=?, status=?, notes=?, ModifiedOn=? WHERE id=?");
        $stmt->bind_param("ssssssssi", $leadName, $contactPerson, $phoneNumber, $email, $leadSource, $status, $notes, $modifiedOn, $id);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Lead updated successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
        }
        $stmt->close();
        break;

    case "DELETE": // Soft delete a lead (set Is_Active to 0 and Is_Deleted to 1)
        $id = $data["id"];
        $stmt = $conn->prepare("UPDATE leads SET Is_Active = 0, Is_Deleted = 1 WHERE id=?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Lead deleted successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
        }
        $stmt->close();
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Invalid request method"]);
        break;
}

$conn->close();
?>
