<?php

$servername = "localhost";
$username = "username"; // Use your actual database username
$password = "";
$dbname = "forms";
$port = "3307"; // Ensure correct port

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Create (Insert new Purchase Order)
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $supplier_name = $data->supplierName;
    $product_name = implode(", ", $data->productName); // Storing multiple products as a comma-separated string
    $quantity = $data->quantity;
    $unit_price = $data->unitPrice;
    $total_amount = $data->totalAmount;
    $order_date = $data->orderDate;
    $expected_delivery_date = $data->expectedDeliveryDate;
    
    // Add created_on field
    $sql = "INSERT INTO purchase_orders (supplier_name, product_name, quantity, unit_price, total_amount, order_date, expected_delivery_date, created_on, is_active, is_deleted)
            VALUES ('$supplier_name', '$product_name', $quantity, $unit_price, $total_amount, '$order_date', '$expected_delivery_date', NOW(), TRUE, FALSE)";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Purchase Order created successfully"]);
    } else {
        echo json_encode(["message" => "Error: " . $conn->error]);
    }
}

// Read (Fetch Purchase Orders)
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $sql = "SELECT * FROM purchase_orders WHERE is_active = TRUE AND is_deleted = FALSE";
    $result = $conn->query($sql);

    $orders = [];
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }
    echo json_encode($orders);
}

// Update (Edit an existing Purchase Order)
if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;
    $supplier_name = $data->supplierName;
    $product_name = implode(", ", $data->productName);
    $quantity = $data->quantity;
    $unit_price = $data->unitPrice;
    $total_amount = $data->totalAmount;
    $order_date = $data->orderDate;
    $expected_delivery_date = $data->expectedDeliveryDate;

    // Update modified_on to track when the record is updated
    $sql = "UPDATE purchase_orders SET supplier_name='$supplier_name', product_name='$product_name', quantity=$quantity, unit_price=$unit_price, 
            total_amount=$total_amount, order_date='$order_date', expected_delivery_date='$expected_delivery_date', modified_on=CURRENT_TIMESTAMP
            WHERE id=$id AND is_deleted = FALSE"; // Ensure we're only updating non-deleted records

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Purchase Order updated successfully"]);
    } else {
        echo json_encode(["message" => "Error: " . $conn->error]);
    }
}

// Delete (Mark as deleted)
if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;

    // Mark as deleted (set is_active = 0 and is_deleted = TRUE)
    $sql = "UPDATE purchase_orders SET is_active = FALSE, is_deleted = TRUE WHERE id=$id";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Purchase Order marked as deleted successfully"]);
    } else {
        echo json_encode(["message" => "Error: " . $conn->error]);
    }
}

$conn->close();
?>
