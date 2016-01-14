var app = {
	numbers: [], // holds ungrouped data
	grouped: {}, // holds group data
	capturing: false,
	feedbackEngine: null,
	imported: false,
    fileNumber: localStorage.getItem("lastFile"),
	initialize: function () {
		this.bindEvents();
	},

	bindEvents: function () {
		document.addEventListener("deviceready", this.onDeviceReady, false);
		document.addEventListener("backbutton", this.onBackButton, false);
		// some constants
		var UNGROUPED_TAB = 0,
			GROUPED_TAB = 1;

		var getNumbers = function (numstr) {
			var numlist = numstr.split(" "),
				num_len = numlist.length;

			for (var i = 0; i < num_len; i++) {
				if (numlist[i].trim() !== "") {
					app.numbers.push(numlist[i].trim());
					var $el = $("<a href='#' class='ui-btn ui-mini numbtn'>" + numlist[i] + "</a>");
					
					//alert($("#numbersList").controlgroup("container").tagName);
					$("#numberslist").controlgroup("container").append($el);
				}
			}

			$("#numberslist").controlgroup("refresh");
			app.capturing = false;
			// show them in a control group

		};

		var transition = function () {
            $("#input").fadeOut("fast", function () {
            	$("#results").fadeIn("fast");
            	$(document).undelegate("ui-content", "scrollstart", false);
            });

        };

        var checkFrequencies = function () {
        	var complete = true;

        	$("input[placeholder='Frequency']").each(function (index) {
        		if ($(this).val().trim() === "") {
        			complete = false;
        			return false;
        		}
        	});

        	return complete;
        };

        var BuildTable = function(items) {
        	var str = "",
        		item_len = items.length;

			for (var i = 0; i < item_len; i++) {
				str += "<tr>";
				str += "<td>" + items[i].range + "</td>";
				str += "<td>" + items[i].frequency + "</td>";
				str += "<td>" + items[i].midpoint + "</td>";
				str += "<td>" + items[i].midxfreq + "</td>";
				str += "<td>" + items[i].lowerClassBoundary + "</td>";
				str += "</tr>";
			}

			return str;
        };

        var ProcessUngroup = function () {
        	var stat_obj = new Statistic.Ungrouped(app.numbers);
			$("#numcount").html(app.numbers.length);
			$("#txtMean").html(stat_obj.Mean());
			$("#txtMedian").html(stat_obj.Median());
			$("#txtMode").html(stat_obj.Mode());
			$("#txtSD").html(stat_obj.StandardDeviation());

			var num_count = app.numbers.length,
				col = 0,
				str = "";

			$("#numbers-list").empty();
			for (var i = 0; i < num_count; i++) {
				switch (col) {
					case 0:
						str += "<div class='ui-block-a numCont'>";
						col++;
						break;
					case 1:
						str += "<div class='ui-block-b numCont'>";
						col++;
						break;
					case 2:
						str += "<div class='ui-block-c numCont'>";
						col++;
						break;
					case 3:
						str += "<div class='ui-block-d numCont'>";
						col = 0;
						break;
				}

				str += app.numbers[i];
				str += "</div>";
			}

			$("#number-list").append(str);

			var group_stat = stat_obj.GroupData(),
				strin = BuildTable(group_stat.items);

			$("tbody.groupRows").html(strin);
			$("#tblGrouped").table("refresh");
			transition();
        };

        var ProcessGroup = function () {
        	var stat_obj = new Statistic.Grouped(app.grouped);
        	app.grouped = stat_obj.GetGroupedData();
			var items = app.grouped.items,
				item_len = items.length,
				str = BuildTable(items);

			$("tbody.groupRows").html(str);
			$("#tblGroupData").table("refresh");
        	$("#txtMean").html(stat_obj.Mean());
        	$("#txtMedian").html(stat_obj.Median());
        	$("#txtMode").html(stat_obj.Mode()[0]);
        	$("#txtSD").html(stat_obj.StandardDeviation());
        	transition();
        };

        $("#closeAction").click(function (e) {
          e.preventDefault();
          $("#actionCenter").panel("close");
        });

		$("#txtNumber").on("input", function () {
			$("#status").html("Changing");
			$("#numberslist").controlgroup("container").empty();
			$("#numberslist").controlgroup("refresh");

			if (!app.capturing) {
				app.numbers.length = 0;
				app.capturing = true;
				setTimeout(function () {
					var txt = $("#txtNumber").val();

					if (txt.trim() !== "") {
						// add the numbers to the number array
						var patt = /^(\d+|\s*)+/g;
						if (!patt.test(txt)) {
							$("#status").html("Please input only numbers");	
						}
						else {
							getNumbers(txt.trim());
							$("#status").html("Here are your numbers");
						}
					}
					else {
						$("#status").html("Seperate your numbers by placing a space between them.");
					}

					app.capturing = false;
				}, 1000);
			}
		});

		$("#cameraPopup").click(function () {
			$("#popupCam").popup("open", {transition: "fade", positionTo: "window"});
			$("#recStat").html("Load an image first");
		});

		// camera launching event
        $("#btnCamera").click(function () {
        	if (app.fileNumber !== null)
        		app.deleteLastImage();
            navigator.camera.getPicture(app.cameraCallback, null, { quality: 50,
                                                              destinationType: Camera.DestinationType.FILE_URI,
                                                            correctOrientation: true,
                                                            saveToPhotoAlbum: true});
            app.imported = true;
        });

        // import event handler
        $("#btnImport").click(function() {
        	if (app.fileNumber !== null) 
        		app.deleteLastImage();
           navigator.camera.getPicture(app.cameraCallback, null, {quality: 50,
                                                                 destinationType: Camera.DestinationType.FILE_URI,
                                                                 sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                                                               correctOrientation: true});
        });

        $("#btnCancelP").click(function () {
        	$("#popupCam").popup("close");
        	$("#recResults").hide();
        });


		$("#btnUse").click(function () {
			var activeTab = $("#tabs").tabs("option", "active");

			if (activeTab === UNGROUPED_TAB) {
				$("#btnShowGroup").hide();
				$("#btnShowNum").show();

				if ($("#status").html() == "Here are your numbers")
					ProcessUngroup();
				else
					alert("Please input only numbers", null, "MathCam", "OK");
			}
			else {
				$("#btnShowGroup").show();
				$("#btnShowNum").hide();
				ProcessGroup();
			}
		});

		$("#btnAnother").click(function () {
			$("#txtNumber").val("");
			app.numbers.length = 0;
			$("#status").html("Seperate your numbers by placing a space between them.");
			$("#numberslist").controlgroup("container").empty();
			$("#numberslist").controlgroup("refresh");

			$("#groupDetails").empty();
			$("#results").fadeOut("fast", function () {
				$("#input").fadeIn("fast");
			});
		});

		$("#btnAddGroup").click(function () {
			$("#txtRange").val("");
			$("#txtFrequency").val("");

			$("#addItemDialog").popup("open", {transition: "fade", positionTo: "window"});
		});

		$("#btnAddItem").click(function () {
			if (checkFrequencies()) {
				var counter = 0, total = 0,
					nums = [];
				
				// populating the group object with its data
				$("table.groupTable > tbody > tr").each(function () {
					var rangeD = $(this).children(0).html(),
						rangeVal = rangeD.split("-"),					
						data = {
							range: rangeD,
							minValue: parseInt(rangeVal[0].trim()),
							maxValue: parseInt(rangeVal[1].trim()),
							frequency: parseInt($(this).children(1).children("input[placeholder='Frequency']").val().trim())
						};

					total = total + data.frequency;
					nums.push(data);
				});

				// group data properties
				app.grouped.items = nums;
				app.grouped.numberCount = total;
				app.grouped.interval = parseInt($("#txtInterval").val().trim());
				
				var info = "<p><b>Total Number of Values:</b> " + app.grouped.numberCount + "</p>";
				$("#groupDetails").html(info);
				$("#addItemDialog").popup("close");
			}
		});

		$("#btnBuildTable").click(function () {
			$("#groupContent").empty();

			if (($("#txtRange").val() !== "" || $("#txtInterval").val() !== "") && $("#txtRange").val().indexOf('-') !== -1) {
				var numbers = $("#txtRange").val().split("-"),
					interval = parseInt($("#txtInterval").val()),
					minVal = parseInt(numbers[0].trim()),
					maxVal = parseInt(numbers[1].trim()),
					str = "", counter = 1;

				console.log(interval + ", " + minVal + "-" + maxVal);
				str += "<tbody>";
				for (var ctr = minVal; ctr <= maxVal; ctr += interval) {
					str += "<tr>";
					str += "<td>" + ctr + "-" + (ctr+(interval-1)) + "</td><td><input type='text' name='item" + counter + "' placeholder='Frequency' /></td>";
					str += "</tr>";
				}
				str += "</tbody>";

				$("div#groupContent").html("<span>Enter their frequencies below.</span><table class='groupTable'><thead><tr><th>Range</th><th>Frequency</th></tr></thead>"
					+ str + "</table>");

				$("div#itemInput").fadeOut("fast", function () {
					$("div#frequencyShow").fadeIn("fast");
					$("#btnGoBack").show();
					$("#addItemDialog").popup("reposition", {positionTo: "window"});	
				});
				
			}

		});

		$(".btncancel").click(function () {
			$("#groupContent").empty();
			$("#addItemDialog").popup("close");
		});

		$("#btnGoBack").click(function () {
			$("#frequencyShow").fadeOut("fast", function() {
				$("#groupCountent").empty();
				$("#btnGoBack").hide();
				$("#txtInterval").val("");
				$("#txtRange").val("");
				$("#itemInput").fadeIn("fast");

				$("#addItemDialog").popup("reposition", {positionTo: "window"});
			});
		});

		$("#addItemDialog").on("popupafterclose", function () {
			$("#txtRange").val("");
			$("#txtInterval").val("");
			$("div#groupContent").html("");
			$("#frequencyShow").hide();
			$("#itemInput").show();
			$("#btnGoBack").hide();
		});

		$("a#reportProb").click(function (e) {
          e.preventDefault();

          $("#userFeedbackDialog").popup("open", {positionTo: "window", transition: "fade"});
          $("#actionCenter").panel("close");
        });

		$("#initForm").submit(function (e) {
          e.preventDefault();
          var fData = {
            "platform": $("#initForm input[name='platform']").val(),
            "version": $("#initForm input[name='version']").val(),
            "rating": $("#initForm input[name='rating']:checked").val(),
            "comment": $("#initForm #comments").val(),
            "sent": false
          };

          // save the data to the localStorage
          localStorage.setItem("userFeedback", JSON.stringify(fData));
          localStorage.setItem("doneFeedback", true);
          app.userFeedback = fData;
          app.doneFeedback = true;

          // attempt to send data to database
          $("#btnSubmit").val("Submitting...");
          $("#btnSubmit").addClass("ui-state-disabled");
          app.sendFeedback();

        });

        $("#fdForm").submit(function (e) {
          e.preventDefault();
          app.feedbackEngine.AddFeedback($("input[name='shortName']").val(), $("input[name='inputMode']").val(), $("#comm").val(), function () {
            alert("Your feedback has been submitted successfully", function () {
             $.mobile.silentScroll(0);
            }, "MathCam", "OK");
            $("#userFeedbackDialog").popup("close", {transition: "fade"});
            app.feedbackEngine.SendFeedback(null, null);
          }, null);
        });

         $("#feedbackDialog").on("popupafterclose", function () {
          app.exitAppl();
        });

        $("input[name='rating']").click(function () {
            $("span#rdesc").html($(this).attr("value"));
        });

        // report problem menu item click
        $("a#reportProb").click(function (e) {
          e.preventDefault();

          $("#userFeedbackDialog").popup("open", {positionTo: "window", transition: "fade"});
          $("#actionCenter").panel("close");
        });

        $("#btnOK").click(function () {
        	if ($("#recResults").val().trim() !== "") {
	        	$("#txtNumber").val($("#recResults").val());
	        	$("#txtNumber").trigger("input");

	        	$("#popupCam").popup("close");
	        	$("#recResults").hide();
        	}
        });
	},

	cameraCallback: function (imgURI) {
		confirm("Crop the image?", function (index) {
            if (index == 1) {
                plugins.crop(function (newPath) {
                    app.imgOperation(newPath);
                }, null, imgURI, {quality: 100});
            }
            else {
                app.imgOperation(imgURI);
            }

            
        }, "MathCam", ["Yes", "No"]);
	},

	imgOperation: function (newPath) {
		window.resolveLocalFileSystemURL(newPath, function resolveURL(fileEntry) {
            var dirPath = cordova.file.externalRootDirectory + "OCRFolder/";
            console.log(fileEntry);

            window.resolveLocalFileSystemURL(dirPath, function saveImage(dir) {
              app.fileNumber = "ocr" + app.generateRandom(100, 999) + ".jpg";
              localStorage.setItem("lastFile", app.fileNumber);
              console.log(dir);

              fileEntry.copyTo(dir, app.fileNumber, app.showImage, app.saveError);
            }, app.saveError);
          }, app.saveError);
	},

	generateRandom: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

	showImage: function (f) {
		var url = cordova.file.externalRootDirectory + "OCRFolder/" + app.fileNumber;
		$("#recStat").val("Recognizing...");
		$("#recResults").fadeIn("fast", function () {
			tesseractOCR.recognizeImage(url, function (msg) {
				console.log(msg);
				var result = msg.replace(/l|L|I/g, "1");
				result = result.replace(/z|Z/g, "2");
				result = result.replace(/h/g, "4");
				result = result.replace(/S|s/g, "5");
				result = result.replace(/G/g, "6");
				result = result.replace(/B/g, "8");
				result = result.replace(/g/g, "9");
				result = result.replace(/O|o/g, "0");
				result = result.replace(/\r|\n/g, " ");

				console.log(result);
				$("#recStat").val("Here are the results...");
				$("#recResults").val(result);
			});
		});
	},

	deleteLastImage: function () {
		var imgPath = cordova.file.externalRootDirectory + "OCRFolder/" + app.fileNumber;
	      window.resolveLocalFileSystemURL(imgPath, function problem(fileEntry) {
	        console.log(fileEntry);
	        fileEntry.remove(null, function () {
	          app.fileNumber = null;
	        });
	      }, app.saveError);
	},

	saveError: function (e) {
        var code = e.code,
            cal = arguments.callee.caller.toString();
            
        // alert("There is a problem saving the image. Please restart MathCam.", null,
        //         "MathCam", "OK");
        app.feedbackEngine.AddFeedback("System", "Statistics", "Error code: " + code + "\nFunction: " + cal, function () {
           alert("There is a problem saving the image. Please restart MathCam.", function () {
               app.feedbackEngine.SendFeedback(null, null);
           }, "MathCam", "OK");
       }, null);

    },

	onDeviceReady: function () {
		$("#numberslist").css("max-height", ($(window).height() * 0.40).toString() + "px");
		$("div#groupContent").css("max-height", ($(window).height() * 0.7).toString() + "px");
		$("div#tableContainer").css("max-height", ($(window).height() * 0.3).toString() + "px");
		$("div#udata").css("max-height", ($(window).height() * 0.2).toString() + "px");
		$("div#tableContainer").css("max-width", "inherit");

		window.alert = navigator.notification.alert;
        window.confirm = navigator.notification.confirm;

        // set important values
        $("input[name='platform']").val(device.platform);
        $("input[name='version']").val(device.version);

        // load tesseract engine
        tesseractOCR.load(null, function (err) {
          alert("There is a problem when initializing the application. Please reinstall MathCam and try again.",
            function () {
              navigator.app.exitApp();
            }, "MathCam", "OK");
        });


        app.feedbackEngine = new Feedback();

        if (navigator.connection.type != Connection.NONE) {
          app.feedbackEngine.SendFeedback(null, null);
        } // send any unsent feedbacks
            
        
        // disable vertical scrolling
        $(document).delegate(".ui-content", "scrollstart", false);
        $(document).delegate("#actionCenter", "scrollstart", false);
        $(document).delegate("#historyPanel", "scrollstart", false);
        
	},

	onBackButton: function () {
		confirm("Are you sure you want to leave?", app.backCallback, "MathCam", ["Yes", "No"]);
	},

	backCallback: function (button) {
		if (button == 1) {
	       if (!app.doneFeedback) {
	          confirm(
	            "We would like to get your feedback about the application.",
	            app.giveFeedback,
	            "MathCam",
	            ["OK", "Cancel"]);
	       }
	       else {
	         app.sendFeedback();
	       }
	    }
	},

	exitAppl: function () {
      navigator.app.exitApp();
    },

    giveFeedback: function (btn) {
      // feedbacking function here
      if (btn == 1) {
        $("#feedbackDialog").popup("open", {positionTo: "window", transition: "fade"});
      }
      else {
        navigator.app.exitApp();
      }
    },

    sendFeedback: function () {
      var dataF = app.userFeedback;

      if (!dataF.sent) {
        if (navigator.connection.type != Connection.NONE) {
          $.post("http://www.mathcam.esy.es/initFeedback.php", dataF).done(function (data) {
            
            dataF.sent = true;
            localStorage.setItem("userFeedback", JSON.stringify(dataF));
            alert("Your feedback will be submitted. Thanks for that!", app.exitAppl, "MathCam", "OK");
          });
        }
        else {
          app.exitAppl();
        }
      }
      else {
        app.exitAppl();
      }
    }
};