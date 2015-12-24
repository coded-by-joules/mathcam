<?php
  include("connection.php");

  $conn = mysqli_connect($host, $user, $pass, $database);
  if (!$conn) {
    echo "-1";
    exit;
  }

  $feedbacks = json_decode($_POST["feedbacks"], true);
  $feedbacks_len = count($feedbacks);

  mysqli_autocommit($conn, FALSE);

  mysqli_begin_transaction($conn);

  $stmt = mysqli_stmt_init($conn);
  $sql = "INSERT INTO userFeedback(dateSubmitted, name, comment) values(?, ?, ?)";

  $date = date("Y-m-d H:i:s");
  for ($i = 0; $i < $feedbacks_len; $i++) {
    $name = htmlspecialchars($feedbacks[i]["name"]);
    $comment = htmlspecialchars($feedbacks[i]["comment"]);

    mysqli_stmt_bind_param($stmt, "sss", $date, $name, $comment);
    if (!mysqli_stmt_execute($stmt)) {
      mysqli_rollback($stmt);
      echo "1";
      exit;
    };
  }

  mysqli_commit($conn);
  mysqli_stmt_close($stmt);
  mysqli_close($conn);

  echo "0";

?>
