<?php
session_start();
require 'db.php';

$error = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // In a real application, use password_verify with hashed passwords
    $sql = "SELECT * FROM admin WHERE username = '$username' AND password = '$password'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $_SESSION['admin'] = $username;
        header("Location: entry.php");
        exit();
    } else {
        $error = "Invalid Username or Password";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Parking System</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="auth-container">
        <div class="card">
            <h2>Admin Login</h2>
            <?php if ($error): ?>
                <div class="message error"><?php echo $error; ?></div>
            <?php endif; ?>
            <form method="POST">
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" name="username" placeholder="Enter username" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" name="password" placeholder="Enter password" required>
                </div>
                <button type="submit" class="btn">Login</button>
            </form>
            <div style="text-align: center; margin-top: 1rem; font-size: 0.8rem; color: #6b7280;">
                Default: admin / admin123
            </div>
        </div>
    </div>
</body>
</html>
