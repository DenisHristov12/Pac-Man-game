<?php 

$username = "";
$email    = "";
$errors = array(); 

session_start();    

$db = mysqli_connect('localhost', 'root', 'DenchU_69', 'webdesigndb');

if (isset($_POST['register'])) {
  $username = mysqli_real_escape_string($db, $_POST['username']);
  $email = mysqli_real_escape_string($db, $_POST['email']);
  $password_1 = mysqli_real_escape_string($db, $_POST['password']);
  $password_2 = mysqli_real_escape_string($db, $_POST['cpassword']);

  if (empty($username)) { 
    array_push($errors, "Username is required"); 
    echo '<script>alert("Username is required")</script>';
    echo "<script>setTimeout(\"location.href = 'register.html';\",100);</script>";
  }
  if (empty($email)) { 
    array_push($errors, "Email is required"); 
    echo '<script>alert("Email is required")</script>';
    echo "<script>setTimeout(\"location.href = 'register.html';\",100);</script>";
  }
  if (empty($password_1)) { 
    array_push($errors, "Password is required"); 
    echo '<script>alert("Password is required")</script>';
    echo "<script>setTimeout(\"location.href = 'register.html';\",100);</script>";
  }
  if ($password_1 != $password_2) {
	  array_push($errors, "Passwords are not matching");
    echo '<script>alert("Passwords are not matching")</script>';
    echo "<script>setTimeout(\"location.href = 'register.html';\",100);</script>";
  }

  $user_check_query = "SELECT * FROM webdesigndb.users WHERE username='$username' OR email='$email' LIMIT 1";
  $result = mysqli_query($db, $user_check_query);
  $user = mysqli_fetch_assoc($result);
  
  if ($user) {
    if ($user['username'] === $username) {
      array_push($errors, "Username already exists");
      echo '<script>alert("Username already exists")</script>';
      echo "<script>setTimeout(\"location.href = 'register.html';\",100);</script>";
    }

    if ($user['email'] === $email) {
      array_push($errors, "Email already exists");
      echo '<script>alert("Email already exists")</script>';
      echo "<script>setTimeout(\"location.href = 'register.html';\",100);</script>";
    }
  }

  if (count($errors) == 0) {
  	$password = $password_1;

  	$query = "INSERT INTO webdesigndb.users (username, email, password) 
  			  VALUES('$username', '$email', '$password')";
  	mysqli_query($db, $query);
  	$_SESSION['username'] = $username;
  	$_SESSION['success'] = "You have registered succesfully";
    echo '<script>alert("You have registered succesfully")</script>';
    echo "<script>setTimeout(\"location.href = 'login.html';\",100);</script>";
  }
  
}
?>