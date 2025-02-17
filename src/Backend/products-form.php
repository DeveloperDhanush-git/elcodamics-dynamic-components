<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = "localhost";
$user = "root";
$password = "";
$dbname = "form_product";
$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]));
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM products WHERE isDeleted = 0";
        $result = $conn->query($sql);
        $products = [];

        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }
        echo json_encode($products);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $conn->prepare("INSERT INTO products (productName, category, subCategory, skuCode, unitPrice, stockQuantity, reorderLevel, supplierName, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssdiisi", 
            $data["productName"], $data["category"], $data["subCategory"], $data["skuCode"], 
            $data["unitPrice"], $data["stockQuantity"], $data["reorderLevel"], $data["supplierName"], 
            $data["isActive"]
        );

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Product added successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error adding product: " . $stmt->error]);
        }
        $stmt->close();
        break;

        case 'PUT': 
            $data = json_decode(file_get_contents("php://input"), true);
        
            if (!isset($data["id"])) {
                echo json_encode(["success" => false, "message" => "Product ID is required for update"]);
                exit;
            }
        
            $stmt = $conn->prepare("UPDATE products SET productName=?, category=?, subCategory=?, skuCode=?, unitPrice=?, stockQuantity=?, reorderLevel=?, supplierName=?, isActive=?, modified_on=CURRENT_TIMESTAMP WHERE id=?");
            $stmt->bind_param("ssssdiisii", 
                $data["productName"], $data["category"], $data["subCategory"], $data["skuCode"], 
                $data["unitPrice"], $data["stockQuantity"], $data["reorderLevel"], $data["supplierName"], 
                $data["isActive"], $data["id"]
            );
        
            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Product updated successfully"]);
            } else {
                echo json_encode(["success" => false, "message" => "Error updating product: " . $stmt->error]);
            }
            $stmt->close();
            break;
        

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $conn->prepare("UPDATE products SET isDeleted = 1 WHERE id=?");
        $stmt->bind_param("i", $data["id"]);
        echo json_encode(["success" => $stmt->execute(), "message" => "Product deleted successfully"]);
        $stmt->close();
        break;
}

$conn->close();
?>
