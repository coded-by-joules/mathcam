<?php

// get connection string file
include("connection.php");

// initialize connection
$conn = mysqli_connect($host, $user, $pass, $database);
if (!$conn) {
  echo "-1"; // can't connect to database
  exit;
}

// get values from form
$platform = htmlspecialchars($_POST["platform"]);
$version = htmlspecialchars($_POST["version"]);
$dateSubmitted = date('Y-m-d H:i:s');
$rating = htmlspecialchars($_POST["rating"]);
$comment = isset($_POST["comment"]) ? htmlspecialchars($_POST["comment"]) : "";

// insert those data to the database
$stmt = mysqli_stmt_init($conn);
if (mysqli_stmt_prepare($stmt, "INSERT INTO InitialFeedback(Platform, Version, DateSubmitted, Rating, Comment) values (?, ?, ?, ?, ?)")) {
  mysqli_stmt_bind_param($stmt, "sssss", $platform, $version, $dateSubmitted, $rating, $comment);

  $success = mysqli_stmt_execute($stmt);
  if ($success) {
    echo "1";
  }
  else {
    echo "2"; // insert problem
  }
}

// close connection
mysqli_stmt_close($stmt);
mysqli_close($conn);

?>
