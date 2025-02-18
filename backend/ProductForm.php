<?php
// Allow cross-origin requests from localhost:3000 (or wherever your frontend is running)
header("Access-Control-Allow-Origin: http://localhost:3000"); // Replace with your frontend URL if different
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit; // Stop processing further if it's a preflight request
}

// Set your database connection details
$host = 'localhost';
$port = '3307'; // MySQL port
$username = 'root'; // Your MySQL username
$password = ''; // Your MySQL password
$dbname = 'forms'; // Database name

// Create a connection to the MySQL database
$conn = new mysqli($host . ":" . $port, $username, $password, $dbname);

// Check if the connection is successful
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

// Handle incoming requests
$requestMethod = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);

// Function to fetch all active purchase orders
if ($requestMethod == 'GET') {
    $sql = "SELECT * FROM purchase_orders WHERE is_deleted = 0";
    $result = $conn->query($sql);
    $orders = [];
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $orders[] = $row;
        }
    }

    echo json_encode($orders);
}

// Function to create a new purchase order (Preventing duplicate entries)
if ($requestMethod == 'POST') {
    if (isset($data['supplierName'], $data['productName'], $data['quantity'], $data['unitPrice'], $data['orderDate'], $data['expectedDeliveryDate'])) {
        $supplierName = $data['supplierName'];
        $productName = implode(", ", $data['productName']); // Join multiple products as a string
        $quantity = $data['quantity'];
        $unitPrice = $data['unitPrice'];
        $totalAmount = $quantity * $unitPrice;
        $orderDate = $data['orderDate'];
        $expectedDeliveryDate = $data['expectedDeliveryDate'];

        // Check for duplicate entries before inserting
        $checkStmt = $conn->prepare("SELECT id FROM purchase_orders WHERE supplier_name = ? AND product_name = ? AND order_date = ? AND expected_delivery_date = ?");
        $checkStmt->bind_param("ssss", $supplierName, $productName, $orderDate, $expectedDeliveryDate);
        $checkStmt->execute();
        $checkStmt->store_result();

        if ($checkStmt->num_rows == 0) { // No duplicate entry found
            $stmt = $conn->prepare("INSERT INTO purchase_orders (supplier_name, product_name, quantity, unit_price, total_amount, order_date, expected_delivery_date, is_active, is_deleted) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?, 1, 0)");
            $stmt->bind_param("ssiddss", $supplierName, $productName, $quantity, $unitPrice, $totalAmount, $orderDate, $expectedDeliveryDate);

            if ($stmt->execute()) {
                echo json_encode(['status' => 'success', 'message' => 'Purchase order created successfully']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Error creating purchase order']);
            }
            $stmt->close();
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Duplicate purchase order exists']);
        }
        $checkStmt->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    }
}

// Function to update an existing purchase order
if ($requestMethod == 'PUT') {
    if (isset($data['id'], $data['supplierName'], $data['productName'], $data['quantity'], $data['unitPrice'], $data['orderDate'], $data['expectedDeliveryDate'])) {
        $id = $data['id'];
        $supplierName = $data['supplierName'];
        $productName = implode(", ", $data['productName']);
        $quantity = $data['quantity'];
        $unitPrice = $data['unitPrice'];
        $totalAmount = $quantity * $unitPrice;
        $orderDate = $data['orderDate'];
        $expectedDeliveryDate = $data['expectedDeliveryDate'];

        $stmt = $conn->prepare("UPDATE purchase_orders 
                                SET supplier_name = ?, product_name = ?, quantity = ?, unit_price = ?, total_amount = ?, order_date = ?, expected_delivery_date = ?
                                WHERE id = ?");
        $stmt->bind_param("ssiddssi", $supplierName, $productName, $quantity, $unitPrice, $totalAmount, $orderDate, $expectedDeliveryDate, $id);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Purchase order updated successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error updating purchase order']);
        }
        $stmt->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    }
}

// Function to delete a purchase order (Soft delete with proper flag updates)
if ($requestMethod == 'DELETE') {
    if (isset($data['id'])) {
        $id = $data['id'];

        $stmt = $conn->prepare("UPDATE purchase_orders 
                                SET is_active = 0, is_deleted = 1 
                                WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Purchase order deleted successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error deleting purchase order']);
        }
        $stmt->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Missing order ID']);
    }
}

// Function to restore a deleted purchase order
if ($requestMethod == 'PUT' && isset($data['restore'])) {
    if (isset($data['id'])) {
        $id = $data['id'];

        $stmt = $conn->prepare("UPDATE purchase_orders 
                                SET is_active = 1, is_deleted = 0 
                                WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Purchase order restored successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error restoring purchase order']);
        }
        $stmt->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Missing order ID']);
    }
}

// Close the connection
$conn->close();
?>
