var app = {
    dialog_handler: null,
    // Application Constructor
    initialize: function () {
        "use strict";
        var removeFunc = function (e) {
            e.preventDefault();
        };
        var mainPage = document.getElementById("mainBody");
        mainPage.addEventListener("touchmove", removeFunc, false);
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    // Most functions run in here
    bindEvents: function () {
        "use strict";
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('backbutton', this.onBackButton, false);

        $(document).ready(function () {
            // Fast click!
            $(function() {
                FastClick.attach(document.body);
            });
        });

        // important variables
        var cameraCallback = this.loadImage;
        var convertedHistory = new History();

        // UI imporvements
        $(".convertList").css("max-height", ($(window).height() - 200) + "px");
        $("#useImage").hide();

        // function to be invoked when camera returns an error
        var errorMsg = function (msg) {
          //  alert("Error");
        };

        // detects the number system inputted
        // returns an array of possible number systems
        var detectNumberSystem = function (number) {
            var number_systems = [],
                decimal_regex = /^\d+$/,
                binary_regex = /^[0-1]+$/,
                hex_regex = /^[0-9|A-F]+$/,
                octal_regex = /^[0-7]+$/,
                ip_regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

            if (ip_regex.test(number)) {
                number_systems.push("IP Address");

                return number_systems; // return immediately
            }

            if (decimal_regex.test(number)) {
                number_systems.push("Decimal");
            }

            if (binary_regex.test(number)) {
                number_systems.push("Binary");
            }

            if (hex_regex.test(number)) {
                number_systems.push("Hexadecimal");
            }

            if (octal_regex.test(number)) {
                number_systems.push("Octal");
            }

            return number_systems;
        };

        // clears the input box
        var clearInput = function () {
            $("#txtNumber").val("");
        };

        // adds the number system detected to the combo box
        var updateSystemList = function (num_systems_array) {
            $("#cmbFrom option").remove();
            var system_length = num_systems_array.length;

            for (var i = 0; i < system_length; i += 1) {
                $("#cmbFrom").append("<option value='" + num_systems_array[i] + "'>" + num_systems_array[i] + "</option>");
            }

            $("#cmbFrom").selectmenu("refresh");
        };

        var transition = function () {
            $("#input").addClass("inputHidden");
            $("#input").css("visibility", "hidden");
            $("#results").addClass("showResult");
            $("#results").css("visibility", "visible");
        };

        // IMPORTANT METHOD HERE
        // converts the input number to the different number systems
        var convertOperation = function (number, givenType) {
            var input_number = number;

            if (givenType == "IP Address")
                $("#viewMe").hide();
            else
                $("#viewMe").show();

            switch (givenType) {
                case "Decimal":
                    $("#vowel").text("a");
                    $("#txtDecimal").html(Converter.addBaseNumber("Decimal", input_number));
                    $("#txtBinary").html(Converter.addBaseNumber("Binary", Converter.DecimalToBinary(input_number)));
                    $("#txtHexa").html(Converter.addBaseNumber("Hexadecimal", Converter.DecimalToHexadecimal(input_number)));
                    $("#txtOctal").html(Converter.addBaseNumber("Octal", Converter.DecimalToOctal(input_number)));
                    break;
                case "Binary":
                    $("#vowel").text("a");
                    $("#txtBinary").html(Converter.addBaseNumber("Binary", input_number));
                    $("#txtDecimal").html(Converter.addBaseNumber("Decimal", Converter.BinaryToDecimal(input_number)));
                    $("#txtHexa").html(Converter.addBaseNumber("Hexadecimal", Converter.BinaryToHexadecimal(input_number)));
                    $("#txtOctal").html(Converter.addBaseNumber("Octal", Converter.BinaryToOctal(input_number)));
                    break;
                case "Hexadecimal":
                    $("#vowel").text("a");
                    $("#txtHexa").html(Converter.addBaseNumber("Hexadecimal", input_number));
                    $("#txtDecimal").html(Converter.addBaseNumber("Decimal", Converter.HexadecimalToDecimal(input_number)));
                    $("#txtBinary").html(Converter.addBaseNumber("Binary", Converter.HexadecimalToBinary(input_number)));
                    $("#txtOctal").html(Converter.addBaseNumber("Octal", Converter.HexadecimalToOctal(input_number)));
                    break;
                case "Octal":
                    $("#vowel").text("an"); // grammar fix
                    $("#txtOctal").html(Converter.addBaseNumber("Octal", input_number));
                    $("#txtDecimal").html(Converter.addBaseNumber("Decimal", Converter.OctalToDecimal(input_number)));
                    $("#txtBinary").html(Converter.addBaseNumber("Binary", Converter.OctalToBinary(input_number)));
                    $("#txtHexa").html(Converter.addBaseNumber("Hexadecimal", Converter.OctalToHexadecimal(input_number)));
                    break;
                case "IP Address":
                    $("#vowel").text("an");
                    // IP conversion here
                    $("#ipAns").html(Converter.convertIPAddress(input_number));

                    break;
            }
        };


        $("#btnCamera").click(function () {
            navigator.camera.getPicture(cameraCallback, errorMsg, { quality: 50,
                                                              destinationType: Camera.DestinationType.FILE_URI,

                                                                allowEdit: true});
        });

        // import event handler
        $("#btnImport").click(function() {
           navigator.camera.getPicture(cameraCallback, errorMsg, {quality: 50,
                                                                 destinationType: Camera.DestinationType.FILE_URI,
                                                                 sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                                                               allowEdit: true});
        });

        // MAIN convert function
        var convert = function (number, saveToHistory) {
            var num_systems_detected = detectNumberSystem(number.toUpperCase());
            var detected_count = num_systems_detected.length;

            // copy input to area
            $("#convNum").html(Converter.addBaseNumber(num_systems_detected[0], number.toUpperCase()));
            $("#hidNum").val(number);

            // convert the number and it's possbile number system
            if (detected_count > 0) {
                updateSystemList(num_systems_detected);
                convertOperation(number, num_systems_detected[0]);

                // showing/hiding content dependent on the number system detected
                if (num_systems_detected[0] == "IP Address" && detected_count == 1) {
                    $("#convNum").html(number);
                    $("#numberSystemAns").hide();
                    $("#ipAnswer").show();
                }
                else {
                    $("#numberSystemAns").show();
                    $("#ipAnswer").hide();
                }

                // save the input to history
                if (saveToHistory) {
                    var exist = false;

                    $("#clist li").each(function (i) {
                        if ($("#txtNumber").val() == $(this).text()) {
                            exist = true;
                            return false;
                        }
                    });

                    if (!exist)
                        convertedHistory.AddToList($("#txtNumber").val());

                    var found = false;

                    if ($("li.resultList").length > 0) {
                        var found = false;

                        $("li.resultList").each(function (i) {
                            var found = false;

                            $("li.resultList").each(function (i) {
                                if ($(this).text() == $("#txtNumber").val()) {
                                    found = true;
                                    return false;
                                }
                            });

                            if (!found) {
                                 $("#clistsimp").prepend("<li class='resultList ui-screen-hidden' data-icon='carat-u'><a href='#' class='convItem'>"
                                            + $("#txtNumber").val() + "</a></li>");
                            }
                        });
                    }
                    else
                         $("#clistsimp").prepend("<li class='resultList ui-screen-hidden' data-icon='carat-u'><a href='#' class='convItem'>"
                                    + $("#txtNumber").val() + "</a></li>");

                    $("#clistsimp").listview("refresh");
                    $("#clistsimp li").addClass("ui-screen-hidden");
                }

                return true;

            }
            else {
                alert("You input is invalid for any number system or an IP address.", clearInput, "MathCam", "OK");
                return false;
            }
        };

        // convert button click event
        $("#btnConvert").click(function () {
            if (convert($("#txtNumber").val(), true))
                transition();
        });

        // convert another button click event
        $("#btnAnother").click(function () {

            $("#results").removeClass("showResult");
            $("#results").css("visibility", "hidden");
            $("#input").css("visibility", "visible");
            $("#input").removeClass("inputHidden");


            clearInput();
        });

        // cmbFrom combobox change event
        $("#cmbFrom").change(function () {
            $("#cmbFrom").selectmenu("refresh");

            // update given number and do the conversion
            $("#convNum").html(Converter.addBaseNumber($("#cmbFrom").val(), $("#hidNum").val()));
            convertOperation($("#hidNum").val(), $("#cmbFrom").val());
        });

        // close panel click event
        $("#closePanel").click(function (e) {
            e.preventDefault();
            $("#historyPanel").panel("close");
        });

        // resize list container before opening
        $("#historyPanel").on("panelbeforeopen", function (event, ui) {
            $(".convertList").css("max-height", ($(window).height() - 200) + "px");
        });

        // show the list on the converted side
        $("#historyPanel").on("panelopen", function (event, ui) {
            var list = convertedHistory.RenderList();

            if (list) {
                var list_length = list.length,
                    i;

                if ($("#clist li").length == 0) {
                    for (i = 0; i < list_length; i += 1) {
                        var item = "<li data-icon='false'><a href='#' class='convItem'>" + list[i] + "</a></li>";
                        $("#clist").prepend($(item));

                    }
                    $("#clist").listview("refresh");
                    $("#clist li").each(function () {
                        $(this).addClass("showAnim");
                    });
                }
                else {
                    var item = "", height = 0;
                    for (i = 0; i < list_length; i += 1) {
                       item += "<li data-icon='false'><a href='#' class='convItem'>" + list[i] + "</a></li>";

                    }

                    var $newElem = $(item).prependTo("#clist");
                    $("#clist").listview("refresh");

                    $newElem.addClass("showAnim");
                }
            }
        });

        // history item click event
        $(document).on("click", ".convItem", function (e) {
            e.preventDefault();
            $("#clistsimp li").addClass("ui-screen-hidden");

            $("#historyPanel").panel("close");
            if (convert($(this).html(), false)) {
                if ($("#results").css("visibility") == "hidden")
                    transition();
            }

        });

        // SHOW SOLUTIONS
        $("#blockA").click(function () {
            $("#solutionDetails").html("<b>From " + $("#convNum").html() + " to " + $("#txtDecimal").html() + "</b>");

            if ($("#cmbFrom").val() == "Decimal") {
                $("#solutionContent").html("There's no need for an explanation for that.");
            }
            else if ($("#cmbFrom").val() == "Binary") {
                $("#solutionContent").html(NumberSystemSolution.DecimalSolution($("#hidNum").val(), $("#txtDecimal").html()).FromBinary());
            }
            else if ($("#cmbFrom").val() == "Hexadecimal") {
                $("#solutionContent").html(NumberSystemSolution.DecimalSolution($("#hidNum").val(), $("#txtDecimal").html()).FromHexadecimal());
            }
            else if ($("#cmbFrom").val() == "Octal") {
                $("#solutionContent").html(NumberSystemSolution.DecimalSolution($("#hidNum").val(), $("#txtDecimal").html()).FromOctal());
            }

            $("#solutionDialog").popup("open", {positionTo: "window", transition: "fade"});
        });

        // binary block click event
        $("#blockB").click(function () {
            $("#solutionDetails").html("<b>From " + $("#convNum").html() + " to " + $("#txtBinary").html() + "</b>");

            if ($("#cmbFrom").val() == "Decimal") {
                $("#solutionContent").html(NumberSystemSolution.BinarySolution($("#hidNum").val(), $("#txtBinary").html()).FromDecimal());
            }
            else if ($("#cmbFrom").val() == "Binary") {
                $("#solutionContent").html("There's no need for an explanation for that.");
            }
            else if ($("#cmbFrom").val() == "Hexadecimal") {
                $("#solutionContent").html(NumberSystemSolution.BinarySolution($("#hidNum").val(), $("#txtBinary").html()).FromHexadecimal());
            }
            else if ($("#cmbFrom").val() == "Octal") {
                $("#solutionContent").html(NumberSystemSolution.BinarySolution($("#hidNum").val(), $("#txtBinary").html()).FromOctal());
            }

            $("#solutionDialog").popup("open", {positionTo: "window", transition: "fade"});
        });

        // hexadecimal block click event
        $("#blockC").click(function () {
            $("#solutionDetails").html("<b>From " + $("#convNum").html() + " to " + $("#txtHexa").html() + "</b>");

            if ($("#cmbFrom").val() == "Decimal") {
                $("#solutionContent").html(NumberSystemSolution.HexadecimalSolution($("#hidNum").val(), $("#txtHexa").html()).FromDecimal());
            }
            else if ($("#cmbFrom").val() == "Binary") {
                $("#solutionContent").html(NumberSystemSolution.HexadecimalSolution($("#hidNum").val(), $("#txtHexa").html()).FromBinary());
            }
            else if ($("#cmbFrom").val() == "Hexadecimal") {
                $("#solutionContent").html("There's no need for an explanation for that.");
            }
            else if ($("#cmbFrom").val() == "Octal") {
                $("#solutionContent").html(NumberSystemSolution.HexadecimalSolution($("#hidNum").val(), $("#txtHexa").html()).FromOctal());
            }


            $("#solutionDialog").popup("open", {positionTo: "window", transition: "fade"});
        });

        // octal block click event
        $("#blockD").click(function () {
            $("#solutionDetails").html("<b>From " + $("#convNum").html() + " to " + $("#txtOctal").html() + "</b>");

            if ($("#cmbFrom").val() == "Decimal") {
                $("#solutionContent").html(NumberSystemSolution.OctalSolution($("#hidNum").val(), $("#txtOctal").html()).FromDecimal());
            }
            else if ($("#cmbFrom").val() == "Binary") {
                $("#solutionContent").html(NumberSystemSolution.OctalSolution($("#hidNum").val(), $("#txtOctal").html()).FromBinary());
            }
            else if ($("#cmbFrom").val() == "Hexadecimal") {
                $("#solutionContent").html(NumberSystemSolution.OctalSolution($("#hidNum").val(), $("#txtOctal").html()).FromHexadecimal());
            }
            else if ($("#cmbFrom").val() == "Octal") {
                 $("#solutionContent").html("There's no need for an explanation for that.");
            }

            $("#solutionDialog").popup("open", {positionTo: "window", transition: "fade"});
        });

        // solution popup tweaks
        $("#solutionDialog").on("popupbeforeposition", function (event, ui) {
           $("#solutionContent").css("max-height", ($(window).height() * 0.5) + "px");
           $("#solutionContent").scrollTop(0);
           //$("#mainPage").height($(window).height());
        });

        // show solution for ip
        $("#ipAns").click(function () {
            $("#solutionDetails").html("<h4>" + $("#hidNum").val() + "</h4>");
            $("#solutionContent").html(NumberSystemSolution.IpAddressSolution($("#convNum").html()));
            $("#solutionDialog").popup("open", {positionTo: "window", transition: "fade"});
        });

        $("#useImage").click(function () {
            // text generated will be placed to the text box
            $("#txtNumber").val($("#recognitionRes").html());

            $("#imgDesc").hide();
            $(".descImg").show();
            $("#recRes").hide();

            $("#imgPlaceholder").attr("src", "");
            $("#imgPlaceholder").height("0px");
            $("#useImage").hide();

            $( ":mobile-pagecontainer" ).pagecontainer( "change", "#mainPage", {allowSamePageTransition: true});
        });

    },

    onDeviceReady: function() {
        // any CORDOVA initialization comes here
        window.alert = navigator.notification.alert;
        window.confirm = navigator.notification.confirm;

        // load tesseract engine
        tesseractOCR.load(null, function (err) {
          alert("There is a problem when initializing the application. Please reinstall MathCam and try again.",
            function () {
              navigator.app.exitApp();
            }, "MathCam", "OK");
        });
    },

    loadImage: function(imgURI) {
        var windowWidth = $(window).width();

        $("#imgPlaceholder").attr("src", imgURI);
        //$("#imgPlaceholder").width("windowWidth - (windowWidth * 0.4) + "px"");
        $("#imgPlaceholder").width("100%");
        $("#imgPlaceholder").height("100%");
        $("#imgPlaceholder").css("max-height", $(window).height() * 0.5);

        $("#recRes").show();
        $("#recognitionRes").html("Recognizing...");
        $(".descImg").hide();

        // OCR Reading
        setTimeout(function () {
          tesseractOCR.recognizeImage(imgURI, function (msg) {
            var result = msg,
              pattern = /[^A-Fa-f0-9]|\s/g;

            if (pattern.test(result) || result.trim() == "") {
              $("#recognitionRes").html("Number is unrecognizable");
            }
            else {
              $("#recognitionRes").html(result);
              $("#imgDesc").show();
            }
          });
        }, 500);
    },

    onBackButton: function() {
        confirm("Are you sure you want to leave?", backCallback, "MathCam", ["Yes", "No"]);

        function backCallback(button) {
            if (button == 1)
                navigator.app.exitApp(); // app leaves on yes
        };
    }
};
