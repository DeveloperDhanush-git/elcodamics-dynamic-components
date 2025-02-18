<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root"; 
$password = ""; 
$database = "feedback_management"; 


$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);
$method = $_SERVER["REQUEST_METHOD"];

switch ($method) {
    case "POST": 
        $customerName = $data["customerName"];
        $issueCategory = $data["issueCategory"];
        $complaintDetails = $data["complaintDetails"];
        $status = $data["status"];
        
    
        $createdOn = date("Y-m-d H:i:s");

        $stmt = $conn->prepare("INSERT INTO feedbacks (customerName, issueCategory, complaintDetails, status, CreatedOn) 
                                VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $customerName, $issueCategory, $complaintDetails, $status, $createdOn);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Feedback added successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
        }
        $stmt->close();
        break;

    case "GET":
        $sql = "SELECT * FROM feedbacks WHERE Is_Deleted = 0 AND Is_Active = 1";
        $result = $conn->query($sql);
        
        $feedbacks = [];
        while ($row = $result->fetch_assoc()) {
            $feedbacks[] = $row;
        }
        echo json_encode($feedbacks);
        break;

    case "PUT": 
        $id = $data["id"];
        $customerName = $data["customerName"];
        $issueCategory = $data["issueCategory"];
        $complaintDetails = $data["complaintDetails"];
        $status = $data["status"];
        
        $modifiedOn = date("Y-m-d H:i:s");

        $stmt = $conn->prepare("UPDATE feedbacks SET customerName=?, issueCategory=?, complaintDetails=?, status=?, ModifiedOn=? WHERE id=?");
        $stmt->bind_param("sssssi", $customerName, $issueCategory, $complaintDetails, $status, $modifiedOn, $id);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Feedback updated successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
        }
        $stmt->close();
        break;

    case "DELETE": 
        $id = $data["id"];
        $stmt = $conn->prepare("UPDATE feedbacks SET Is_Active = 0, Is_Deleted = 1 WHERE id=?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Feedback deleted successfully"]);
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
