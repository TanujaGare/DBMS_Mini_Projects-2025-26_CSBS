<?php
session_start();
require 'db.php';

if (!isset($_SESSION['admin'])) {
    header("Location: index.php");
    exit();
}

// Fetch all records history
$sql_history = "SELECT r.record_id, v.vehicle_number, v.owner_name, v.vehicle_type, s.slot_number, r.entry_time, r.exit_time, r.total_amount 
               FROM parking_record r
               JOIN vehicle v ON r.vehicle_id = v.vehicle_id
               JOIN parking_slot s ON r.slot_id = s.slot_id
               ORDER BY r.entry_time DESC";
$history = $conn->query($sql_history);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Parking Records</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-brand">ParkZone</div>
        <div class="nav-links">
            <a href="entry.php">Entry</a>
            <a href="exit.php">Exit</a>
            <a href="records.php" class="active">Records</a>
            <a href="index.php">Logout</a>
        </div>
    </nav>

    <div class="container">
        <div class="card card-lg" style="margin: 0 auto; max-width: 1200px;">
            <h2>All Parking Records</h2>
            
            <div style="overflow-x: auto;">
                <table>
                    <thead>
                        <tr>
                            <th>#ID</th>
                            <th>Vehicle No</th>
                            <th>Type</th>
                            <th>Slot</th>
                            <th>Entry Time</th>
                            <th>Exit Time</th>
                            <th>Status</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if ($history->num_rows > 0): ?>
                            <?php while($row = $history->fetch_assoc()): ?>
                                <tr>
                                    <td><?php echo $row['record_id']; ?></td>
                                    <td>
                                        <div><?php echo $row['vehicle_number']; ?></div>
                                        <div style="font-size: 0.8em; color: var(--text-muted);"><?php echo $row['owner_name']; ?></div>
                                    </td>
                                    <td><?php echo $row['vehicle_type']; ?></td>
                                    <td><?php echo $row['slot_number']; ?></td>
                                    <td><?php echo $row['entry_time']; ?></td>
                                    <td><?php echo $row['exit_time'] ? $row['exit_time'] : '-'; ?></td>
                                    <td>
                                        <?php if ($row['exit_time']): ?>
                                            <span class="badge badge-out">Completed</span>
                                        <?php else: ?>
                                            <span class="badge badge-in">Parked</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <?php echo $row['total_amount'] > 0 ? '₹' . $row['total_amount'] : '-'; ?>
                                    </td>
                                </tr>
                            <?php endwhile; ?>
                        <?php else: ?>
                            <tr><td colspan="8" style="text-align:center;">No records found.</td></tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>
</html>
