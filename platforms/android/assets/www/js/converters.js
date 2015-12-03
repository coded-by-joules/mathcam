/** 
2 * Convert From/To Binary/Decimal/Hexadecimal in JavaScript 
3 * https://gist.github.com/faisalman 
4 * 
5 * Copyright 2012-2015, Faisalman <fyzlman@gmail.com> 
6 * Licensed under The MIT License 
7 * http://www.opensource.org/licenses/mit-license 
8 */ 


// declare a class-like function for static functions
(function() {
    var Converter = function (num) {
        return {
            from: function (baseFrom) {
                return {
                    to: function (baseTo) {
                        return parseInt(num, baseFrom).toString(baseTo);   
                    }
                };
            }
        };
    };
    
    // static functions for conversion
    Converter.DecimalToBinary = function (num) {
        return Converter(num).from(10).to(2);  
    };
    
    Converter.DecimalToHexadecimal = function (num) {
        return Converter(num).from(10).to(16).toUpperCase();
    };
    
    Converter.DecimalToOctal = function (num) {
        return Converter(num).from(10).to(8);  
    };
    
    Converter.BinaryToDecimal = function (num) {
        return Converter(num).from(2).to(10);  
    };
    
    Converter.BinaryToHexadecimal = function (num) {
        return Converter(num).from(2).to(16).toUpperCase();  
    };
    
    Converter.BinaryToOctal = function (num) {
        return Converter(num).from(2).to(8);  
    };
    
    Converter.HexadecimalToDecimal = function (num) {
        return Converter(num).from(16).to(10);     
    };
    
    Converter.HexadecimalToBinary = function (num) {
        return Converter(num).from(16).to(2);
    };
    
    Converter.HexadecimalToOctal = function (num) {
        return Converter(num).from(16).to(8);
    };
    
    Converter.OctalToDecimal = function (num) {
        return Converter(num).from(8).to(10);  
    };
    
    Converter.OctalToBinary = function (num) {
        return Converter(num).from(8).to(2);
    };
    
    Converter.OctalToHexadecimal = function (num) {
        return Converter(num).from(8).to(16).toUpperCase();  
    };
    
    Converter.addBaseNumber = function (numbersystem, number) {
        var subscript = "";
        
        switch (numbersystem) {
            case "Decimal":
                subscript = "<sub class='smSub'>10</sub>";
                break;
            case "Binary":
                subscript = "<sub class='smSub'>2</sub>";
                break;
            case "Hexadecimal":
                subscript = "<sub class='smSub'>16</sub>";
                break;
            case "Octal":
                subscript = "<sub class='smSub'>8</sub>";
                break;
        }
        
        return number.toString() + subscript;
    };
    
    Converter.convertIPAddress = function (ip) {
        var octets = ip.split(".", 4),
            octet_length = octets.length,
            binary_str = "";
        
        for (var i = 0; i < octet_length; i+=1) {
            binary_str += Converter.DecimalToBinary(octets[i]) + ".";
        }
        
        return binary_str.substring(0, binary_str.length - 1);
    };
    
    this.Converter = Converter;
    
})(this);