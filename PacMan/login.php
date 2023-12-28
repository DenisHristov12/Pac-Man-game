<?php 

$host="localhost";
$user="root";
$password="DenchU_69";
$db="webdesigndb";

$conn = new mysqli($host, $user, $password);
//mysql_select_db($db);

if(isset($_POST['submit'])){
    
    $uname=$_POST['email'];
    $password=$_POST['password'];

    if(empty($uname) || empty($password)){
        echo '<script>alert("Please fill the blanks!")</script>';
        echo "<script>setTimeout(\"location.href = 'login.html';\",100);</script>";
    }else{
        $query="select * from webdesigndb.users where email='".$uname."' AND password='".$password."' limit 1";
                
        $result= mysqli_query($conn, $query);
                
        if($row=mysqli_fetch_assoc($result)){
            echo '<script>alert("You have succesfuly logged in!")</script>';
            echo "<script>setTimeout(\"location.href = 'chooseLevel.html';\",100);</script>";
            exit();
        }
        else{
            echo '<script>alert("Wrong email or password!")</script>';
            echo "<script>setTimeout(\"location.href = 'login.html';\",100);</script>";
            
            exit();
        }
    }
       
}
?>