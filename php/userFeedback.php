<?php
  include("connection.php");

  $conn = mysqli_connect($host, $user, $pass, $database);
  if (!$conn) {
    echo "-1";
    exit;
  }

  $feedbacks = json_decode($_POST["feedbacks"], true);
  $feedbacks_len = count($feedbacks);
  echo $feedbacks_len;
  mysqli_autocommit($conn, FALSE);

  mysqli_begin_transaction($conn);

  $stmt = mysqli_stmt_init($conn);
  $sql = "INSERT INTO UserFeedback(dateSubmitted, name, comment) values(?, ?, ?)";

  $date = date("Y-m-d H:i:s");

  if (mysqli_stmt_prepare($stmt, $sql)) {
    for ($i = 0; $i < $feedbacks_len; $i++) {
      $name = htmlspecialchars($feedbacks[$i]["name"]);
      $comment = htmlspecialchars($feedbacks[$i]["comment"]);

      mysqli_stmt_bind_param($stmt, "sss", $date, $name, $comment);
      if (!mysqli_stmt_execute($stmt)) {
        mysqli_rollback($stmt);
        echo mysqli_error($conn);

        exit;
      };
    }

    mysqli_commit($conn);
  }
  else {
    echo mysqli_error($conn);

    exit;
  }

  mysqli_stmt_close($stmt);
  mysqli_close($conn);

  echo "0";

?>
