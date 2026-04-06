<?php
session_start();
require 'db.php';

if (!isset($_SESSION['admin'])) {
    header("Location: index.php");
    exit();
}

$message = '';
$msg_type = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $owner_name = $_POST['owner_name'];
    $vehicle_number = $_POST['vehicle_number'];
    $vehicle_type = $_POST['vehicle_type'];

    // Find available slot
    $sql_slot = "SELECT slot_id, slot_number FROM parking_slot WHERE slot_type = '$vehicle_type' AND status = 'Available' LIMIT 1";
    $result_slot = $conn->query($sql_slot);

    if ($result_slot->num_rows > 0) {
        $slot = $result_slot->fetch_assoc();
        $slot_id = $slot['slot_id'];
        $slot_number = $slot['slot_number'];

        // Start Transaction
        $conn->begin_transaction();

        try {
            // 1. Insert/Check Vehicle
            // Check if vehicle exists to avoid duplicate entry error, or just insert (assuming new visit)
            // For simplicity, we try insert. If duplicate vehicle_number, we get ID.
            
            $check_vehicle = $conn->query("SELECT vehicle_id FROM vehicle WHERE vehicle_number = '$vehicle_number'");
            if ($check_vehicle->num_rows > 0) {
                $v_row = $check_vehicle->fetch_assoc();
                $vehicle_id = $v_row['vehicle_id'];
                // Update owner name and vehicle_type to reflect latest entry details
                $conn->query("UPDATE vehicle SET owner_name = '$owner_name', vehicle_type = '$vehicle_type' WHERE vehicle_id = $vehicle_id");
            } else {
                $conn->query("INSERT INTO vehicle (vehicle_number, vehicle_type, owner_name) VALUES ('$vehicle_number', '$vehicle_type', '$owner_name')");
                $vehicle_id = $conn->insert_id;
            }

            // 2. Mark Slot Occupied
            $conn->query("UPDATE parking_slot SET status = 'Occupied' WHERE slot_id = $slot_id");

            // 3. Create Parking Record
            $conn->query("INSERT INTO parking_record (vehicle_id, slot_id) VALUES ($vehicle_id, $slot_id)");

            $conn->commit();
            $message = "Vehicle Entry Successful! Assigned Slot: <strong>$slot_number</strong>";
            $msg_type = "success";
        } catch (Exception $e) {
            $conn->rollback();
            $message = "Error: " . $e->getMessage();
            $msg_type = "error";
        }
    } else {
        $message = "Sorry, no available slots for $vehicle_type.";
        $msg_type = "error";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Vehicle Entry</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-brand">ParkZone</div>
        <div class="nav-links">
            <a href="entry.php" class="active">Entry</a>
            <a href="exit.php">Exit</a>
            <a href="records.php">Records</a>
            <a href="index.php">Logout</a>
        </div>
    </nav>

    <div class="container">
        <div class="card card-lg" style="margin: 0 auto;">
            <h2>Vehicle Entry</h2>
            
            <?php if ($message): ?>
                <div class="message <?php echo $msg_type; ?>"><?php echo $message; ?></div>
            <?php endif; ?>

            <form method="POST">
                <div class="form-group">
                    <label>Owner Name</label>
                    <input type="text" name="owner_name" placeholder="Enter owner name" required>
                </div>
                <div class="form-group">
                    <label>Vehicle Number</label>
                    <input type="text" name="vehicle_number" placeholder="e.g. MH-12-AB-1234" required>
                </div>
                <div class="form-group">
                    <label>Vehicle Type</label>
                    <select name="vehicle_type" required>
                        <option value="Car">Car</option>
                        <option value="Bike">Bike</option>
                    </select>
                </div>
                <button type="submit" class="btn">Generate Parking Ticket</button>
            </form>
        </div>
    </div>
</body>
</html>
