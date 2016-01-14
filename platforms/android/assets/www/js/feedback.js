// small database for handling user feedbacks

var Feedback = function () {
  var db; // holds the database object
  console.log("Loading database...");
  this.db = window.openDatabase("feedbackDB", "1.0", "Feedback DB", 2 * 1024 * 1024);
    this.db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS tblFeedback ("
        + "FeedbackID INTEGER PRIMARY KEY AUTOINCREMENT, "
        + "Name varchar, "
        + "System varchar, "
        + "Comment varchar, "
        + "Sent int)")
    });


};

// inserts a feedback to the database
Feedback.prototype.AddFeedback = function (name, system, comment, onSuccess, onError) {
  if (this.db !== null) {
    console.log("Feedback entry insertion started...");
    // execute insert methods
    this.db.transaction(function (tx) {
      tx.executeSql("INSERT INTO tblFeedback(Name, System, Comment, Sent) values (?, ?, ?, ?)",
        [name, system, comment, 0]);
    }, onError, onSuccess);
  }
  else {
    onError("Database not loaded. Please load the database");
  }
};

// implement the sending and deleting later...
Feedback.prototype.SendFeedback = function (onSuccess, onError) {
  if (this.db !== null) {
    console.log("Feedback sending started...");
    var feedbacks = [];
    var dataB = this.db;
    this.db.transaction(function (tx) {

      tx.executeSql("SELECT * FROM tblFeedback WHERE Sent=0", [], function (tx, results) {
        // assume there is an internet connection
        var len = results.rows.length;
        for (var i = 0; i < len; i++) {
          var row = results.rows.item(i);
          // send the single record to the database server
          var sendData = {
            name: row.Name,
            system: row.System,
            comment: row.Comment
          };
          console.log(sendData);
          feedbacks.push(sendData);
        }
      }, onError);
      console.log(feedbacks);

    }, onError, function () {
      // send the data here you know
      if (feedbacks.length > 0) {
        $.post("http://www.mathcam.esy.es/userFeedback.php", {feedbacks: JSON.stringify(feedbacks)}).done(function (data) {
          console.log(data);
          dataB.transaction(function (tx) {
            tx.executeSql("UPDATE tblFeedback SET Sent=1 WHERE Sent=0");
          }, function (e) {console.log(e);}, function (e) {console.log("Updated datas");});
          console.log("Feedback Sent");
        });
      }
    });
  }
  else {
    onError("Database not loaded. Please load the database.");
  }
};
