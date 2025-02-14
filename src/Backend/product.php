<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$servername = "localhost"; // Change to your server details
$username = "root"; // Change to your database username
$password = ""; // Change to your database password
$dbname = "product_form"; // Change to your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

// Get the JSON data from the request body
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    die(json_encode(["success" => false, "message" => "Invalid request data"]));
}

// Extract fields
$productName = $data['productName'];
$category = $data['category'];
$subCategory = $data['subCategory'];
$skuCode = $data['skuCode'];
$unitPrice = $data['unitPrice'];
$stockQuantity = $data['stockQuantity'];
$reorderLevel = $data['reorderLevel'];
$supplierName = $data['supplierName'];

// Prepare and bind SQL statement
$stmt = $conn->prepare("INSERT INTO products (product_name, category, sub_category, sku_code, unit_price, stock_quantity, reorder_level, supplier_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssdiis", $productName, $category, $subCategory, $skuCode, $unitPrice, $stockQuantity, $reorderLevel, $supplierName);

// Execute and return response
if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Product added successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Error: " . $stmt->error]);
}

// Close connection
$stmt->close();
$conn->close();
?>
