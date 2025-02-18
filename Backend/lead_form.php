<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root"; 
$password = ""; 
$database = "lead_management";


$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);
$method = $_SERVER["REQUEST_METHOD"];

switch ($method) {
    case "POST": 
        $leadName = $data["leadName"];
        $contactPerson = $data["contactPerson"];
        $phoneNumber = $data["phoneNumber"];
        $email = $data["email"];
        $leadSource = $data["leadSource"];
        $status = $data["status"];
        $notes = $data["notes"];
      
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

    case "GET": 
        $sql = "SELECT * FROM leads WHERE Is_Deleted = 0 AND Is_Active = 1";
        $result = $conn->query($sql);
        
        $leads = [];
        while ($row = $result->fetch_assoc()) {
            $leads[] = $row;
        }
        echo json_encode($leads);
        break;

    case "PUT": 
        $id = $data["id"];
        $leadName = $data["leadName"];
        $contactPerson = $data["contactPerson"];
        $phoneNumber = $data["phoneNumber"];
        $email = $data["email"];
        $leadSource = $data["leadSource"];
        $status = $data["status"];
        $notes = $data["notes"];
        
     
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

    case "DELETE": 
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
