
var app = {
    
    // global variables
    dialog_handler: null,
    imported: false,
    fileNumber: localStorage.getItem("lastFile"),
    doneFeedback: (localStorage.getItem("doneFeedback") !== null) ? true : false,
    userFeedback: (localStorage.getItem("userFeedback") !== null) ? JSON.parse(localStorage.getItem("userFeedback")) : {sent: false},
    feedbackEngine: null,
    isEquation: false,
    eqChanged: false,
    equationMode: false,

    // Application Constructor
    initialize: function () {
        "use strict";
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
        $("#eqDetails").css("max-height", ($(window).height() * 0.3) + "px");
        $("#drawing").css("height", ($(window).height() * 0.70) + "px");
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

            // doing this pattern rather than else if enables it to test the pattern 5 times
            // instead of having to to validate one system, and then leaves the others
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
            app.isEquation = false;
            $("#equationArea").html("<b>TIP:</b> Type an equation and the answer will be shown here.");
            if (app.equationMode) {
                $("#equationArea").html("<b>TIP: </b>Type an equation and the answer will be shown here.");
            }
            else {
                $("#equationArea").html("");
            }
            $("#eqDetails").html(""); // clear the too much content
            $("#fullEq").val("");

            $.mobile.silentScroll(0);
        };

        // adds the list of number systems detected to the combo box
        var updateSystemList = function (num_systems_array) {
            $("#cmbFrom option").remove();
            var system_length = num_systems_array.length;

            for (var i = 0; i < system_length; i += 1) {
                $("#cmbFrom").append("<option value='" + num_systems_array[i] + "'>" + num_systems_array[i] + "</option>");
            }

            $("#cmbFrom").selectmenu("refresh");
        };

        // an
        var transition = function () {
            $("#drawing").fadeOut("fast", function () {
                $("#equationArea").html("");
                $("#input").addClass("inputHidden");
                $("#input").css("visibility", "hidden");
                $("#results").addClass("showResult");
                $("#results").css("visibility", "visible");
                
                $(document).undelegate(".ui-content", "scrollstart", false);
            });
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

        // camera launching event
        $("#btnCamera").click(function () {
            if (app.fileNumber !== null) 
                    app.deleteLastImage();
            navigator.camera.getPicture(cameraCallback, errorMsg, { quality: 50,
                                                              destinationType: Camera.DestinationType.FILE_URI,
                                                            correctOrientation: true,
                                                            saveToPhotoAlbum: true});
            app.imported = false;
        });

        // import event handler
        $("#btnImport").click(function() {
            if (app.fileNumber !== null)
                app.deleteLastImage();
           navigator.camera.getPicture(cameraCallback, errorMsg, {quality: 50,
                                                                 destinationType: Camera.DestinationType.FILE_URI,
                                                                 sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                                                               correctOrientation: true});
           app.imported = true;
        });

        var onConfirmToGoBack = function (buttonIndex) {
          if (buttonIndex == 1) { // user chooses Yes
            clearTakeImage();
          }
        };

        var clearTakeImage = function () {
          $("#imgDesc").hide();
          $(".descImg").show();
          $("#recRes").hide();

          $("#imgPlaceholder").attr("src", "");
          $("#imgPlaceholder").height("0px");
          $("#useImage").hide();

          $("#recognitionResults").popup("close");
          $("#resultPanel").hide();
          $(document).delegate(".ui-content", "scrollstart", false);
          $( ":mobile-pagecontainer" ).pagecontainer( "change", "#mainPage", {allowSamePageTransition: true});
        };
        
        // validates the number entered to the number system toggles
        var validateNumber = function (number, systemsAvailable, selectedSystem) {
            var decimal_regex = /^\d+$/,
                binary_regex = /^[0-1]+$/,
                hex_regex = /^[0-9|A-F]+$/,
                octal_regex = /^[0-7]+$/,
                number_of_systems = systemsAvailable.length,
                number_systems = {
                    Dec: "Decimal",
                    Bin: "Binary",
                    Hex: "Hexadecimal",
                    Oct: "Octal"
                },
                test_system = {
                    Dec: decimal_regex,
                    Bin: binary_regex,
                    Hex: hex_regex,
                    Oct: octal_regex
                };
                
            
            for (var i = 0; i < number_of_systems; i += 1) {
                if (systemsAvailable[i] === number_systems[selectedSystem]) {                    
                  if (test_system[selectedSystem].test(number))
                    return true;  
                }
            }            
                         
            return false;
        };

        // updates the answer on the equation dialog box
        var updateAnswer = function () {
            // replace values on equation
            var eq = $("#fullEq").val(),
                eq_obj = new Equation(eq),
                num = eq_obj.GetNumbers(),
                ctr = 0;

            // this replaces any changes on the equation string inside the edit equation dialog box 
            for (var key in num) {
                var number_stored = $("input[type='hidden']#en" + ctr).val(),
                    rep = new RegExp(num[key], 'g');
                
                eq = eq.replace(rep, number_stored); 
                ctr++;
            }

            // then solves the new equation
            var eqObj = new Equation(eq);
            $("#eqAnswer").fadeOut("fast", function () {
                var reg = /[A-Fa-f]/,
                    base = reg.test(eq) ? "Hexadecimal" : "Decimal",
                    ans = eqObj.SolvePostfix(eqObj.ToPostfix(), base).toUpperCase();
                    
                $("#eqAnswer").html("<span class='numericalAns'>" + ans  + 
                    "</span><sub class='subSys'>" + (base == "Decimal" ? "10" : "16") + "</sub>");
                $("#eqAnswer").fadeIn("fast");
            });
        };

        // shows equation details during text input
        var showEquationDetails = function (equation) {                   
            var reg = /[A-Fa-f]/;
            var base = reg.test(equation) ? "16" : "10";
            var eq = new Equation(equation);
            var ans = eq.SolvePostfix(eq.ToPostfix(), (base == "10" ? "Decimal" : "Hexadecimal")).toUpperCase(),
                valid = (ans != "NAN") ? true : false;


            if (valid) {
                var numbers = eq.GetNumbers(); // get all numbers used in the operation
                
                $("#eqStatus").html("These are the numbers in your equation");
                var content = "";
                
                content += "<table class='ui-responsive number-list' data-role='table' data-mode='reflow'>";
                content += "<thead><tr><th>Number</th><th>System</th></thead>";
                content += "<tbody>";
                
                var ctr = 0;
                for (var key in numbers) {
                    var number = numbers[key],
                        systems = detectNumberSystem(number),
                        sys_length = systems.length;

                    
                    // placing an input-hidden tag beside the original number will store its equivalent decimal number
                    // so if user sets 40 as a hex number, the input-hidden value will be its equivalent decimal number
                    content += "<tr><td><span class='valueEquation'>" + number + "<sub>" + base + "</sub></span>";
                    content += "<input type='hidden' value='" + number + "'  id='en" + ctr + "'/></td>";
                    content += "<td><select class='eqSel' id='sys" + ctr + "' data-mini='true'>";                

                    for (var i = 0; i < sys_length; i++) {
                        content += "<option value='" + systems[i] + "' ";

                        // set as default option, depending on the number system
                        if (base == "16" && systems[i] == "Hexadecimal") {
                            content += "selected='selected'";
                        } 
                        else if (base == "10" && systems[i] == "Decimal") {
                            content += "selected='selected'";
                        }

                        content += ">" + systems[i] + "</option>";
                    }

                    content += "</select></td></tr>";

                    ctr += 1;
                }
                content += "</tbody>";
                content += "</table>";

                $("#eqDetails").html(content);
                $("table.number-list").find("tbody tr td select").each(function () {
                    $(this).selectmenu().selectmenu("refresh");
                });

                $("#eqStat2").html("<b>Answer (in <span id='sysAns'></span> format):</b> ");
                $("span#sysAns").html(base == "10" ? "Decimal" : "Hexadecimal");
                $("p#eqAnswer").html("<span class='numericalAns'>" + ans + "</span><sub class='subSys'>" + base + "</sub>");
            }
            else {
                $("#eqDetails").html("");
                $("p#eqAnswer").html("");
                $("#eqStatus").html("Equation incomplete... Keep going...");
            }            
        };

        // MAIN convert function
        var convert = function (number, saveToHistory) {          
            var num_systems_detected = detectNumberSystem(number.toUpperCase());
            var detected_count = num_systems_detected.length;
            var selected_system = $("#toggleSys span").html();
                    
            // copy input to area
            if (selected_system == "Any")
                $("#convNum").html(Converter.addBaseNumber(num_systems_detected[0], number.toUpperCase()));
            else {
                var base;

                switch (selected_system) {
                    case "Dec":
                        base = "Decimal";
                        break;
                    case "Bin":
                        base = "Binary";
                        break;
                    case "Hex":
                        base = "Hexadecimal";
                        break;
                    case "Octal":
                        base = "Octal";
                        break;
                }

                $("#convNum").html(Converter.addBaseNumber(base, number.toUpperCase()));
            }
            $("#hidNum").val(number);

            // convert the number and it's possbile number system
            if (detected_count > 0) {
                updateSystemList(num_systems_detected);
                
                if (num_systems_detected[0] == "IP Address" || selected_system == "Any")
                    convertOperation(number, num_systems_detected[0]);
                else {
                    // in some instances, when the user chooses a number system, it may not be valid for his input
                    // so it's better to double check it (again)
                    if (validateNumber(number, num_systems_detected, selected_system)) {
                        switch (selected_system) {
                            case "Dec":
                                $("#cmbFrom").val("Decimal");
                                convertOperation(number, "Decimal");
                                break;
                            case "Bin":
                                $("#cmbFrom").val("Binary");
                                convertOperation(number, "Binary");
                                break;
                            case "Hex":
                                $("#cmbFrom").val("Hexadecimal");
                                convertOperation(number, "Hexadecimal");
                                break;
                            case "Oct":
                                $("#cmbFrom").val("Octal");
                                convertOperation(number, "Octal");
                                break;
                        }
                        $("#cmbFrom").selectmenu("refresh");
                    }
                    else {
                        alert("You've selected a number system that is not valid to the one you've entered.", null, "MathCam", "OK");
                        return false;
                    }
                        
                }

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
                        found = false;

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
                alert("You input is invalid for any number system or an IP address.", null, "MathCam", "OK");
                return false;
            }
        };

        // convert button click event
        $("#btnConvert").click(function () {
            // transfer the value of the answer if the input is an equation
            if (app.isEquation && app.equationMode) {
                $("#txtNumber").val($("div#eqAns span").html());                   
            }
            
            if (convert($("#txtNumber").val(), true))
                transition();
        });

        // convert another button click event
        $("#btnAnother").click(function () {

            $("#results").removeClass("showResult");
            $("#results").css("visibility", "hidden");
            $("#input").css("visibility", "visible");
            $("#input").removeClass("inputHidden");

            $(document).delegate(".ui-content", "scrollstart", false);
            setTimeout(function () {
                $("#drawing").fadeIn("fast");}, 200);
            clearInput();
        });

        // cmbFrom combobox change event
        $("#cmbFrom").change(function () {
            $("#cmbFrom").selectmenu("refresh");

            // update given number and do the conversion
            $("#convNum").html(Converter.addBaseNumber($("#cmbFrom").val(), $("#hidNum").val()));
            convertOperation($("#hidNum").val(), $("#cmbFrom").val());
        });
        
        // toggleSys button click event 
        $("#toggleSys").click(function (e) {
            e.preventDefault();
            var $txt = $(this).children("span");
            
            $txt.fadeOut("fast", function () {
                switch ($txt.html()) {
                    case "Any":
                        $txt.html("Dec");
                        break;
                    case "Dec":
                        $txt.html("Bin");
                        break;
                    case "Bin":
                        $txt.html("Hex");
                        break;
                    case "Hex":
                        $txt.html("Oct");
                        break;
                    case "Oct":
                        $txt.html("Any");
                        break;
                }            
            }).fadeIn("fast");
        });

        // close panel click event
        $("#closePanel").click(function (e) {
            e.preventDefault();
            $("#historyPanel").panel("close");
        });

        $("#closeAction").click(function (e) {
          e.preventDefault();
          $("#actionCenter").panel("close");
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

                if ($("#clist li").length === 0) {
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
            // switch to Any
            $("#toggleSys span").html("Any");
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
        
        // text input event.. checks if the input is a number or an equation
        $("#txtNumber").on("input", function () {
            if (app.equationMode) {
               var equationCheck = /[\[\]\+\-\*\/\(\)]/g;
               if (!app.eqChanged)
                   app.eqChanged = true;

               if (equationCheck.test($("#txtNumber").val().replace(/ /g, ''))) {
                   $("#equationArea").html("Solving...");
                        
                   // validate the equation, and show the answer
                   setTimeout(function () {
                       var eq = new Equation($("#txtNumber").val().replace(/ /g, '')),
                           base;
                           

                        if ($("#toggleSys span").html() == "Any") {
                            var reg = /[A-Fa-f]/;
                            base = reg.test($("#txtNumber").val().replace(/ /g, '')) ? "Hexadecimal" : "Decimal";
                        }
                        else {
                            var nsys = $("#toggleSys span").html();

                            switch (nsys) {
                                case "Dec":
                                    base = "Decimal";
                                    break;
                                case "Bin":
                                    base = "Binary";
                                    break;
                                case "Hex":
                                    base = "Hexadecimal";
                                    break;
                                case "Oct":
                                    base = "Octal";
                                    break;
                            }
                        }

                        var ans = eq.SolvePostfix(eq.ToPostfix(), base).toUpperCase();
                       
                        if (ans.toString() == "NAN") {
                            $("#equationArea").html("Equation incomplete... Keep going...");
                            app.isEquation = false;
                        }                   
                        else {
                            if (eq.ValidateEquation()) {
                                var subBase;

                                switch (base) {
                                    case "Decimal":
                                        subBase = "10";
                                        break;
                                    case "Binary":
                                        subBase = "2";
                                        break;
                                    case "Hexadecimal":
                                        subBase = "16";
                                        break;
                                    case "Octal":
                                        subBase = "8";
                                        break;
                                }

                                var str = "<div class='ui-grid-a'>"
                                    + "<div class='ui-block-a' id='eqAns'><span class='numericalAns'>" + ans + "</span>"
                                    + "<sub class='subSys'>" + subBase + "</sub></div>";

                                if ($("#toggleSys span").html() == "Any")
                                    str = str + "<div class='ui-block-b'><a href='#' class='ui-btn ui-mini ui-btn-icon-left ui-icon-info ui-corner-all' id='btnEditEquation'>Edit Equation</a></div>"

                                str = str + "</div>";
                                $("#equationArea").html(str);
                                app.isEquation = true;
                            }
                            else {
                                $("#equationArea").html("Invalid equation");
                            }
                        }
                    }, 1000);
               } 
               else {
                   $("#equationArea").html("<b>TIP:</b> Type an equation and the answer will be shown here.");
               }
            }
        });

        
        $("#fullEq").on("input", function () {
            $("#eqDetails, p#eqStat2, p#eqAnswer").html("");
            $("#eqStatus").html("Solving...");


            setTimeout(function () {
                showEquationDetails($("#fullEq").val().trim());
                $("#editEquationDialog").popup("reposition", {positionTo: "window"});
            }, 1000);
        });
        
        // editEquation click event
        $(document).on("click", "#btnEditEquation", function () {
            var eqt = new Equation($("#txtNumber").val());
            if (eqt.ValidateEquation())
                $("#editEquationDialog").popup("open", {positionTo: "window", transition: "fade"});
            else {
                alert("Your equation syntax is invalid. Review its syntax and try again.", null, "MathCam", "OK");
            }

        });
        
        $("#editEquationDialog").on("popupbeforeposition", function (event, ui) {
           $("#editEquationDialog").css("width", (0.8 * $(window).width()) + "px"); 
           $(document).undelegate(".ui-content", "scrollstart", false);
        });
        
        // shows the equation dialog...
        $("#editEquationDialog").on("popupafteropen", function (event, ui) {
            // sometimes, if the user clicked this button again without changing the equation
            // let the system preview on what the user did before
            if (app.eqChanged) {

                $("#eqDetails").html("");
                $("#fullEq").val($("#txtNumber").val());
                showEquationDetails($("#txtNumber").val());

                $("#editEquationDialog").popup("reposition", {positionTo: "window"});
            }
        });

        // closing settings for edit equation dialog
        $("#editEquationDialog").on("popupafterclose", function (event, ui) {
            $(document).delegate(".ui-content", "scrollstart", false);
        });

        $("#saveEquation").click(function (e) {
            if ($("#fullEq").val().trim() !== "") {
                $("#txtNumber").val($("#fullEq").val());
                $("div#eqAns").html($("p#eqAnswer").html());
                if (app.eqChanged)
                    app.eqChanged = false;
            }
            else {
                e.preventDefault();
            }
        });

        // event handler that changes the number system inside the equation detail dialog
        $(document).on("change", "select.eqSel", function () {
            var selected_system = $(this).val(),
                $adjacent_input = $(this).parent().parent().parent().siblings().children("input"),
                given_number = $adjacent_input.siblings("span").html(),
                num_ssys = $adjacent_input.siblings("span").children().html();

            // string cleaning
            given_number = given_number.replace("<sub>" + num_ssys + "</sub>", "");

            // do a silent conversion
            switch (selected_system) {
                case "Decimal":
                    $adjacent_input.val(given_number);
                    $adjacent_input.siblings("span").children().html("10");
                    break; // nothing to change here, really
                case "Binary":
                    $adjacent_input.val(Converter.BinaryToDecimal(given_number));
                    $adjacent_input.siblings("span").children().html("2");
                    break;
                case "Hexadecimal":
                    $adjacent_input.val(Converter.HexadecimalToDecimal(given_number));
                    $adjacent_input.siblings("span").children().html("16");
                    break;
                case "Octal":
                    $adjacent_input.val(Converter.OctalToDecimal(given_number));
                    $adjacent_input.siblings("span").children().html("8");
                    break;
            }
            

            // then update the answer
            updateAnswer();
        });

        $("#equationMode").change(function () {
            if ($("#equationMode").attr("checked") == "checked") {
                $("#txtNumber").attr("maxlength", "15");
                $("#equationMode").removeAttr("checked");
                app.equationMode = false;
                $("#equationArea").fadeOut("fast");
            }
            else {
                $("#equationMode").attr("checked", true);
                app.equationMode = true;   
                $("#equationArea").html("<b>TIP: </b>Type an equation and the answer will be shown here.");
                $("#equationArea").fadeIn("fast");
                $("#txtNumber").removeAttr("maxlength");
            }

            $("#equationMode").flipswitch("refresh");

        });
        
        $("#useImage").click(function () {
            // text generated will be placed to the text box
            $("#txtNumber").val($("span#txtRes").html());
            if (app.equationMode) {
                $("#txtNumber").trigger("input");
            }

            clearTakeImage();
        });
        
        // loads the camera page
        $("#cameraPopup").click(function (e) {
            e.preventDefault();
            
            $(document).undelegate(".ui-content", "scrollstart", false);
          $( ":mobile-pagecontainer" ).pagecontainer( "change", "#cameraPage", {allowSamePageTransition: true});
        });

        // button that returns from the camera page to the main page
        $("#btnTakeBack").click(function (e) {
          e.preventDefault();

          if ($("#imgPlaceholder").attr("src") !== null && $("#imgPlaceholder").attr("src") !== "") {
            confirm(
              "There is still an image loaded for recognition. Are you sure you want to go back?",
              onConfirmToGoBack,
              "MathCam",
              ["Yes", "No"]);
          }
          else {
            clearTakeImage();
          }
        });

        // feedback submission
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

        // feedback dialog close
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

        $(document).on('click', 'a#lnkCorrect', function () {

            var $cont = $("#recognitionRes > div"),
                elem = "";

            // replace the link with some div
            $cont.addClass('ui-grid-a');
            elem += "<div class='ui-block-a'><input type='text' id='txtRep' data-mini='true'/></div>";
            elem += "<div class='ui-block-b'><input type='button' id='btnRep' data-mini='true' value='Replace' /></div>";
            $cont.html(elem);

            $("input[type='text']#txtRep").textinput();
            $("input[type='button']#btnRep").button();

            setTimeout(function () {
                $("#recognitionResults").popup("reposition", {
                    x: ~~(windowWidth / 2),
                    y: 190  
                });
              }, 700);
        });

        $(document).on('click', "input[type='button']#btnRep", function () {
            var $cont = $("#recognitionRes > div"),
                $txt = $("input[type='text']#txtRep");

            if ($txt.val().trim() !== "") {
                $("span#txtRes").html($txt.val().trim());
                $cont.html("<a href='#' id='lnkCorrect'>Edit</a>");

                setTimeout(function () {
                $("#recognitionResults").popup("reposition", {
                    x: ~~($(window).width() / 2),
                    y: 190  
                });
              }, 500);
            }
        });

        $(document).on('taphold', 'p#convNum', function () {
            $("#showUp p").html($("p#convNum").html());
            $("#showUp").popup("open", {positionTo: "p#convNum", transition: "fade"});
        });

        $(document).on('taphold', 'div.answer', function () {
            $("#showUp p").html($(this).html());
            $("#showUp").popup("open", {positionTo: "div.answer", transition: fade});
        });

        
    },

    onDeviceReady: function() {
        // any CORDOVA initialization comes here
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

    loadImage: function(imgURI) {
        // ask user if image will be cropped or not
        confirm("Crop the image?", function (index) {
            if (index == 1) {
                plugins.crop(function (newPath) {
                    app.imgOperation(newPath);
                }, null, imgURI, {quality: 100});
            }
            else {
                window.FilePath.resolveNativePath(imgURI, function (newStr) {
                    app.imgOperation("file://" + newStr);    
                }, null);
                
            }

            
        }, "MathCam", ["Yes", "No"]);
        
    },

    imgOperation: function (newPath) {
        window.resolveLocalFileSystemURL(newPath, function resolveURL(fileEntry) {
            var dirPath = cordova.file.externalRootDirectory + "OCRFolder/";

            window.resolveLocalFileSystemURL(dirPath, function saveImage(dir) {
                app.fileNumber = "ocr" + app.generateRandom(100, 999) + ".jpg";
                localStorage.setItem("lastFile", app.fileNumber);

                fileEntry.copyTo(dir, app.fileNumber, app.showImage, app.saveError);
            }, app.saveError);
        
        }, app.saveError);
          
    },
    
    deleteLastImage: function () {
      var imgPath = cordova.file.externalRootDirectory + "OCRFolder/" + app.fileNumber;
      window.resolveLocalFileSystemURL(imgPath, function (fileEntry) {
        
        fileEntry.remove(null, function () {
          app.fileNumber = null;
        });
      }, null);
    },

    generateRandom: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    saveError: function (e) {
        var code = e.code,
            cal = arguments.callee.caller.toString();
            
        // alert("There is a problem saving the image. Please restart MathCam.", null,
        //         "MathCam", "OK");
        app.feedbackEngine.AddFeedback("System", "Number System", "Error code: " + code + "\nFunction: " + cal, function () {
           alert("There is a problem saving the image. Please restart MathCam.", function () {
               //app.feedbackEngine.SendFeedback(null, null);
           }, "MathCam", "OK");
       }, null);

    },

    showImage: function (imgURI) {
      var url = cordova.file.externalRootDirectory + "OCRFolder/" + app.fileNumber;
      var windowWidth = $(window).width();
      var imgPos = null;
      $("#imgPlaceholder").attr("src", url);
      $("#imgPlaceholder").load(function () {
        imgPos = $("#imgPlaceholder").offset(); 
      });
      //$("#imgPlaceholder").width("windowWidth - (windowWidth * 0.4) + "px"");
      $("#imgPlaceholder").width("100%");
      $("#imgPlaceholder").height("100%");
      $("#imgPlaceholder").css("max-height", $(window).height() * 0.5);

      $("#useImage").hide();
      $("#resultPanel").fadeIn("slow", function () {
          $(".descImg").hide();
          $("#imgDesc").show();
          // show popup
               
          setTimeout(function () {
            $("#recognitionResults").popup("open", 
                {
                    x: ~~(windowWidth / 2),
                    y: 190,
                    transition: "fade"
              });
          }, 500);

          $("#recognitionRes").html("&#8226;&#8226;&#8226;"); // small three dots

          // OCR Reading
          setTimeout(function () {
            tesseractOCR.recognizeImage(url, function (msg) {
              var result = msg,
                pattern;

              
              if (!app.equationMode) {
                result = result.replace(/[^a-zA-Z0-9]+/g, "");
                pattern = /[^a-zA-Z0-9\.]+/g;
              }
              else {
                 result = result.replace(/[^A-Fa-f0-9\.\+\-\*\/]|\s/g, "");
                 pattern = /[^a-zA-Z0-9\.\+\-\*\/]+/g;
              }

              

              if (pattern.test(result) || result.trim() === "") {
                $("#recognitionRes").html("The number detected is invalid");
              }
              else {
                result = "<span id='txtRes' style='text-align: center'>" + result + "</span><br>";
                result = result + "<div><a href='#' id='lnkCorrect'>Is this correct?</a></div>";
                $("#recognitionRes").html(result);
                $("#useImage").show();
              }

              setTimeout(function () {
                $("#recognitionResults").popup("reposition", {
                    x: ~~(windowWidth / 2),
                    y: 190  
                });
              }, 1000);
              // $("#recognitionRes").html(msg);
            });
          }, 500);
      });
    },

    onBackButton: function() {
      confirm("Are you sure you want to leave?", app.backCallback, "MathCam", ["Yes", "No"]);
      // confirm(
      //       "We would like to get your feedback about the application.",
      //       app.giveFeedback,
      //       "MathCam",
      //       ["OK", "Cancel"]);
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