
var app = {
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
           
        var cameraCallback = this.loadImage;
        
        // function to be invoked when camera returns an error
        function errorMsg(msg) {
          //  alert("Error");   
        }
        
        // detects the number system inputted
        // returns an array of possible number systems
        function detectNumberSystem(number) {
            var number_systems = [],
                decimal_regex = /^\d+$/,
                binary_regex = /^[0-1]+$/,
                hex_regex = /^[0-9|A-F]+$/,
                octal_regex = /^[0-7]+$/;
            
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
        function clearInput() {
            $("#txtNumber").val("");   
        }
        
        // adds the number system detected to the combo box
        function updateSystemList(num_systems_array) {
            $("#cmbFrom option").remove();
            var system_length = num_systems_array.length;
            
            for (var i = 0; i < system_length; i += 1) {
                $("#cmbFrom").append("<option value='" + num_systems_array[i] + "'>" + num_systems_array[i] + "</option>");   
            }
            
            $("#cmbFrom").selectmenu("refresh");
        }
        
        // IMPORTANT METHOD HERE
        // converts the input number to the different number systems
        function convertOperation(givenType, doAnimation) {
            var input_number = $("#txtNumber").val();
            
            switch (givenType) {
                case "Decimal":
                    $("#txtDecimal").html(Converter.addBaseNumber("Decimal", input_number));
                    $("#txtBinary").html(Converter.addBaseNumber("Binary", Converter.convertDecimalToBinary(input_number)));
                    $("#txtHexa").html(Converter.addBaseNumber("Hexadecimal", Converter.convertDecimalToHexa(input_number)));
                    $("#txtOctal").html(Converter.addBaseNumber("Octal", Converter.convertDecimalToOctal(input_number)));
                    break;
                case "Binary":
                    $("#txtBinary").html(Converter.addBaseNumber("Binary", input_number));
                    $("#txtDecimal").html(Converter.addBaseNumber("Decimal", Converter.convertBinaryToDecimal(input_number)));
                    $("#txtHexa").html(Converter.addBaseNumber("Hexadecimal", Converter.convertBinaryToHexa(input_number)));
                    $("#txtOctal").html(Converter.addBaseNumber("Octal", Converter.convertBinaryToOctal(input_number)));
                    break;
                case "Hexadecimal":
                    $("#txtHexa").html(Converter.addBaseNumber("Hexadecimal", input_number));
                    $("#txtDecimal").html(Converter.addBaseNumber("Decimal", Converter.convertHexaToDecimal(input_number)));
                    $("#txtBinary").html(Converter.addBaseNumber("Binary", Converter.convertHexaToBinary(input_number)));
                    $("#txtOctal").html(Converter.addBaseNumber("Octal", Converter.convertHexaToOctal(input_number)));
                    break;
                case "Octal":
                    $("#txtOctal").html(Converter.addBaseNumber("Octal", input_number));
                    $("#txtDecimal").html(Converter.addBaseNumber("Decimal", Converter.convertOctalToDecimal(input_number)));
                    $("#txtBinary").html(Converter.addBaseNumber("Binary", Converter.convertOctalToBinary(input_number)));
                    $("#txtHexa").html(Converter.addBaseNumber("Hexadecimal", Converter.convertOctalToHexa(input_number)));
                    break;
            }
        }
        
        // camera event handler
        $("#btnCamera").click(function () {
            navigator.camera.getPicture(cameraCallback, errorMsg, { quality: 50, 
                                                              destinationType: Camera.DestinationType.FILE_URI,
                                                                  saveToPhotoAlbum: true});               
        });
        
        // import event handler
        $("#btnImport").click(function() {
           navigator.camera.getPicture(cameraCallback, errorMsg, {quality: 50,
                                                                 destinationType: Camera.DestinationType.FILE_URI,
                                                                 sourceType: Camera.PictureSourceType.PHOTOLIBRARY});
        });
                
        // camera popup event handler
        $("#cameraPopup").click(function(e) {
            e.preventDefault();
            
            if ($("#imgPlaceholder").attr("src")) {
                $("#imgPlaceholder").removeAttr("src"); 
                $("#imgPlaceholder").height("0px");
                $("#imgDesc").show();
            }
            
            $("#cameraDialog").popup("open", {transition: "fade", positionTo: "window"});
        });
        
        // convert button click event
        $("#btnConvert").click(function () {
            var num_systems_detected = detectNumberSystem($("#txtNumber").val().toUpperCase());
            var detected_count = num_systems_detected.length;
            
            // copy input to area
            $("#convNum").html(Converter.addBaseNumber($("#cmbFrom").val(), $("#txtNumber").val().toUpperCase()));
            
            // convert the number and it's possbile number system
            if (detected_count > 0) {
                updateSystemList(num_systems_detected);
                convertOperation($("#cmbFrom").val(), false);
                
                // animate UI by hiding the input area, and showing the results area
                $("#input").addClass("inputHidden");
                $("#input").css("visibility", "hidden");
                $("#results").addClass("showResult");
                $("#results").css("visibility", "visible");
                
            }
            else {
                alert("You input is invalid for any number system.", clearInput, "MathCam", "OK");
            } 
            
            
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
            $("#convNum").html(Converter.addBaseNumber($("#cmbFrom").val(), $("#txtNumber").val().toUpperCase()));
            convertOperation($("#cmbFrom").val(), false); 
        });
        
    },
    
    onDeviceReady: function() {
        // any CORDOVA initialization comes here
        window.alert = navigator.notification.alert;
        window.confirm = navigator.notification.confirm;
        
    },
    
    loadImage: function(imgURI) {
        var windowWidth = $(window).width();
        
        $("#imgPlaceholder").attr("src", imgURI);
        //$("#imgPlaceholder").width("windowWidth - (windowWidth * 0.4) + "px"");
        $("#imgPlaceholder").width("100%");
        $("#imgPlaceholder").height("100%");
        $("#imgPlaceholder").css("max-height", $(window).height() * 0.5);
        $("#imgDesc").hide();
        
        // reposition popup
        setInterval(function() {
            $("#cameraDialog").popup("reposition", { positionTo: "window" });
        }, 300);
    },
    
    onBackButton: function() {
        confirm("Are you sure you want to leave?", backCallback, "MathCam", ["Yes", "No"]);
        
        function backCallback(button) {
            if (button == 1)
                navigator.app.exitApp(); // app leaves on yes
        };
    }
};
