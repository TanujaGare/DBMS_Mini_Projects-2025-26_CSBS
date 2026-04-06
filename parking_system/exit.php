<?php
session_start();
require 'db.php';

if (!isset($_SESSION['admin'])) {
    header("Location: index.php");
    exit();
}

$message = '';
$msg_type = '';

// Handle Exit Request
if (isset($_POST['exit_vehicle'])) {
    $record_id = $_POST['record_id'];
    
    // Fetch Record Details
    $sql = "SELECT r.record_id, r.vehicle_id, r.slot_id, r.entry_time, v.vehicle_type 
            FROM parking_record r 
            JOIN vehicle v ON r.vehicle_id = v.vehicle_id 
            WHERE r.record_id = $record_id";
    
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $entry_time = new DateTime($row['entry_time']);
        $exit_time_obj = new DateTime(); // Current time
        
        // Calculate exact duration in seconds
        $duration_seconds = $exit_time_obj->getTimestamp() - $entry_time->getTimestamp();
        
        // Calculate Hours (round up to ensure every part of an hour is charged as a full hour)
        $hours = ceil($duration_seconds / 3600);
        if ($hours <= 0) $hours = 1; // Minimum 1 hour charge

        // Charge by vehicle type
        if ($row['vehicle_type'] == 'Bike') {
            $amount = $hours * 50;
        } else if ($row['vehicle_type'] == 'Car') {
            $amount = $hours * 100;
        } else {
            $amount = $hours * 20; // default fallback
        }
        $exit_time_str = $exit_time_obj->format('Y-m-d H:i:s');

        // Start Transaction
        $conn->begin_transaction();
        try {
            // Update Record
            $conn->query("UPDATE parking_record SET exit_time = '$exit_time_str', total_amount = $amount WHERE record_id = $record_id");
            
            // Free Slot
            $conn->query("UPDATE parking_slot SET status = 'Available' WHERE slot_id = " . $row['slot_id']);

            $conn->commit();
            $message = "Vehicle Exited Successfully! Total Fee: ₹$amount ($hours hours)";
            $msg_type = "success";
        } catch (Exception $e) {
            $conn->rollback();
            $message = "Error: " . $e->getMessage();
            $msg_type = "error";
        }
    }
}

// Fetch currently parked vehicles
$sql_active = "SELECT r.record_id, v.vehicle_number, v.owner_name, s.slot_number, r.entry_time 
               FROM parking_record r
               JOIN vehicle v ON r.vehicle_id = v.vehicle_id
               JOIN parking_slot s ON r.slot_id = s.slot_id
               WHERE r.exit_time IS NULL
               ORDER BY r.entry_time DESC";
$active_vehicles = $conn->query($sql_active);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Vehicle Exit</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-brand">ParkZone</div>
        <div class="nav-links">
            <a href="entry.php">Entry</a>
            <a href="exit.php" class="active">Exit</a>
            <a href="records.php">Records</a>
            <a href="index.php">Logout</a>
        </div>
    </nav>

    <div class="container">
        <div class="card card-lg" style="margin: 0 auto; max-width: 1000px;">
            <h2>Manage Exit</h2>
            
            <?php if ($message): ?>
                <div class="message <?php echo $msg_type; ?>"><?php echo $message; ?></div>
            <?php endif; ?>

            <div style="overflow-x: auto;">
                <table>
                    <thead>
                        <tr>
                            <th>Vehicle No</th>
                            <th>Owner</th>
                            <th>Slot</th>
                            <th>Entry Time</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if ($active_vehicles->num_rows > 0): ?>
                            <?php while($row = $active_vehicles->fetch_assoc()): ?>
                                <tr>
                                    <td><?php echo $row['vehicle_number']; ?></td>
                                    <td><?php echo $row['owner_name']; ?></td>
                                    <td><span class="badge badge-car"><?php echo $row['slot_number']; ?></span></td>
                                    <td><?php echo $row['entry_time']; ?></td>
                                    <td>
                                        <form method="POST" onsubmit="return confirm('Process Exit for <?php echo $row['vehicle_number']; ?>?');">
                                            <input type="hidden" name="record_id" value="<?php echo $row['record_id']; ?>">
                                            <button type="submit" name="exit_vehicle" class="btn" style="background-color: var(--danger); padding: 0.5rem 1rem; font-size: 0.9rem;">Exit Vehicle</button>
                                        </form>
                                    </td>
                                </tr>
                            <?php endwhile; ?>
                        <?php else: ?>
                            <tr><td colspan="5" style="text-align:center;">No vehicles currently parked.</td></tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>
</html>
