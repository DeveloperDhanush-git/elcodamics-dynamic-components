<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
$servername = "localhost";
$username = "root";
$password = "";
$database = "customer_db";
$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}
$data = json_decode(file_get_contents("php://input"), true);
$method = $_SERVER["REQUEST_METHOD"];
switch ($method) {
    case "POST":
        $customerName = $data["customerName"];
        $contactNumber = $data["contactNumber"];
        $email = $data["email"];
        $address = $data["address"];
        $gstNumber = $data["gstNumber"];
        $businessType = $data["businessType"];
        $status = $data["status"];
        $isActive = 1;
        $isDeleted = 0;
        $createdOn = date("Y-m-d H:i:s");
        $stmt = $conn->prepare("INSERT INTO customers (customerName, contactNumber, email, address, gstNumber, businessType, status, Is_Active, Is_Deleted, CreatedOn)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssssiis", $customerName, $contactNumber, $email, $address, $gstNumber, $businessType, $status, $isActive, $isDeleted, $createdOn);
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Customer added successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
        }
        $stmt->close();
        break;
    case "GET":
        $sql = "SELECT * FROM customers WHERE Is_Deleted = 0 AND Is_Active = 1";
        $result = $conn->query($sql);
        $customers = [];
        while ($row = $result->fetch_assoc()) {
            $customers[] = $row;
        }
        echo json_encode($customers);
        break;
    case "PUT":
        $id = $data["id"];
        $customerName = $data["customerName"];
        $contactNumber = $data["contactNumber"];
        $email = $data["email"];
        $address = $data["address"];
        $gstNumber = $data["gstNumber"];
        $businessType = $data["businessType"];
        $status = $data["status"];
        $modifiedOn = date("Y-m-d H:i:s");
        $stmt = $conn->prepare("SELECT email FROM customers WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->bind_result($existingEmail);
        $stmt->fetch();
        $stmt->close();
        if ($existingEmail !== $email) {
            $stmt = $conn->prepare("SELECT COUNT(*) FROM customers WHERE email = ? AND id != ?");
            $stmt->bind_param("si", $email, $id);
            $stmt->execute();
            $stmt->bind_result($emailCount);
            $stmt->fetch();
            $stmt->close();
            if ($emailCount > 0) {
                echo json_encode(["status" => "error", "message" => "Email already exists"]);
                exit;
            }
        }
        $stmt = $conn->prepare("UPDATE customers SET customerName=?, contactNumber=?, email=?, address=?, gstNumber=?, businessType=?, status=?, ModifiedOn=? WHERE id=?");
        $stmt->bind_param("ssssssssi", $customerName, $contactNumber, $email, $address, $gstNumber, $businessType, $status, $modifiedOn, $id);
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Customer updated successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
        }
        $stmt->close();
        break;
    case "DELETE":
        $id = $data["id"];
        $stmt = $conn->prepare("UPDATE customers SET Is_Active = 0, Is_Deleted = 1 WHERE id=?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Customer deleted successfully"]);
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