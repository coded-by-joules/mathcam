var app = {
	numbers: [], // holds ungrouped data
	grouped: {}, // holds group data
	capturing: false,
	initialize: function () {
		this.bindEvents();
	},

	bindEvents: function () {
		document.addEventListener("deviceready", this.onDeviceReady, false);
		// some constants
		var UNGROUPED_TAB = 0,
			GROUPED_TAB = 1;

		var getNumbers = function (numstr) {
			var numlist = numstr.split(" "),
				num_len = numlist.length;

			for (var i = 0; i < num_len; i++) {
				if (numlist[i].trim !== "") {
					app.numbers.push(numlist[i]);
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

        var ProcessUngroup = function () {
        	var stat_obj = new Statistic.Ungrouped(app.numbers);
			$("#numcount").html(app.numbers.length);
			$("#txtMean").html(stat_obj.Mean());
			$("#txtMedian").html(stat_obj.Median());
			$("#txtMode").html(stat_obj.Mode());
			$("#txtSD").html(stat_obj.StandardDeviation());
			transition();
        };

        var ProcessGroup = function () {
        	var stat_obj = new Statistic.Grouped(app.grouped);
        	$("#txtMean").html(stat_obj.Mean());
        	$("#txtMedian").html(stat_obj.Median());
        	$("#txtMode").html(stat_obj.Mode()[0]);
        	$("#txtSD").html(stat_obj.StandardDeviation());
        	transition();
        };

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
						getNumbers(txt.trim());
						$("#status").html("Here are your numbers");
					}
					else {
						$("#status").html("Seperate your numbers by placing a space between them.");
					}

					app.capturing = false;
				}, 1000);
			}
		});

		$("#btnUse").click(function () {
			var activeTab = $("#tabs").tabs("option", "active");

			if (activeTab === UNGROUPED_TAB) {
				ProcessUngroup();
			}
			else {
				ProcessGroup();
			}
		});

		$("#btnAnother").click(function () {
			$("#txtNumber").val("");
			app.numbers.length = 0;
			$("#status").html("Seperate your numbers by placing a space between them.");
			$("#numberslist").controlgroup("container").empty();
			$("#numberslist").controlgroup("refresh");
			$("#results").fadeOut("fast", function () {
				$("#input").fadeIn("fast");
			});
		});

		$("#btnShowNum").click(function () {
			$("#showNumbersDialog").popup("open", {transition: "fade", positionTo: "window"});
		});

		$("#showNumbersDialog").on("popupbeforeposition", function () {
			var num_count = app.numbers.length,
				col = 0,
				str = "";

			$(this).width($(window).width() * 0.4);

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
			// $("#number-list").table().table("rebuild");
			
		});

		$("#showNumbersDialog").on("popupafterclose", function () {
			$("#number-list").empty();
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
	},

	onDeviceReady: function () {
		$("#numberslist").css("max-height", ($(window).height() * 0.7).toString() + "px");
		$("div#groupContent").css("max-height", ($(window).height() * 0.7).toString() + "px");

	}
};