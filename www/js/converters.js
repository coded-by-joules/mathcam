// declare a class-like function for static functions

var Converter = function () {
    // this is for static use only so we don't need to add anything inside this class-like function

};

// static functions for converting number systems and checking inputs
// functions for converting Decimal to other systems
Converter.convertDecimalToBinary = function (decimal) {
    if (!Converter.isNormalInteger(decimal))
        return "The input is not a decimal";
    else {
        var dec = decimal;
        var binary = [];

        while (dec >= 1) {
            binary.push(~~(dec % 2));
            dec /= 2;
        }

        var newbinary = binary.reverse();
        var binaryStr = "";
        for (var i = 0; i < newbinary.length; i++)
            binaryStr += newbinary[i].toString();

        return binaryStr;
    }
};

Converter.convertDecimalToOctal = function (decimal) {
    var dec = decimal;
    var remainders = [];
    var quotient = decimal;

    do {
        remainders.push(~~(quotient % 8));
        quotient = ~~(quotient / 8);
    } while (quotient > 8);

    var octal = quotient.toString();
    var revOctal = remainders.reverse();
    for (var i = 0; i < revOctal.length; i++)
        octal += revOctal[i].toString();

    return octal;
};

Converter.convertDecimalToHexa = function (decimal) {
    var hexaList = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
    var remainders = [];

    while (decimal > 16) {
        remainders.push(hexaList[~~(decimal % 16)]);
        decimal = ~~(decimal / 16);
    }

    var hexa = hexaList[decimal];
    var revHexa = remainders.reverse();
    for (var i = 0; i < revHexa.length; i++) {
        hexa += revHexa[i];
    }

    return hexa;

};

// functions for converting Binary to other systems
Converter.convertBinaryToDecimal = function (binary) {
    var total = 0;
    var bin = binary.toString();

    for (pos = 0; pos < binary.toString().length; pos++) {
        total = total * 2;
        total = total + parseInt(bin[pos]);
    }

    return total;
};

Converter.convertBinaryToHexa = function (binary) {
    var revBinary = Converter.reverseStr(binary.toString());
    var remainder = ~~(revBinary.length % 4);
    if (remainder > 0) {
        for (var i = 0; i < 4 - remainder; i++)
            revBinary += "0";
    }
    var trueBinary = Converter.reverseStr(revBinary);

    // divide string by four
    var groups = [];
    for (var i = 0; i < ~~(trueBinary.length / 4) ; i++)
        groups.push(trueBinary.substr(i * 4, 4));

    var hex = "";
    for (var i = 0; i < groups.length; i++)
        hex += Converter.convertBinaryChunk(groups[i]);

    return hex;

};

Converter.convertBinaryToOctal = function (binary) {
    var octalArray = ["000", "001", "010", "011", "100", "101", "110", "111"];
    var reversed = Converter.reverseStr(binary.toString());
    var groups = ~~(reversed.length / 3);
    var remainder = reversed.length % 3;
    var zeros = (remainder == 1) ? "00" : remainder == 2 ? "0" : "";
    var newBinary = Converter.reverseStr(reversed + zeros);
    if (remainder != 0)
        groups++;

    var groupArray = [];
    for (var i = 0; i < groups; i++)
        groupArray.push(newBinary.substr(i * 3, 3));

    var octal = "";
    for (var x = 0; x < groupArray.length; x++) {
        for (var y = 0; y < octalArray.length; y++) {
            if (groupArray[x] == octalArray[y])
                octal += y;
        }
    }

    return octal;
};

Converter.convertBinaryChunk = function (chunk) {
    var hex = "";

    switch (chunk) {
        case "0000":
            hex = "0";
            break;
        case "0001":
            hex = "1";
            break;
        case "0010":
            hex = "2";
            break;
        case "0011":
            hex = "3";
            break;
        case "0100":
            hex = "4";
            break;
        case "0101":
            hex = "5";
            break;
        case "0110":
            hex = "6";
            break;
        case "0111":
            hex = "7";
            break;
        case "1000":
            hex = "8";
            break;
        case "1001":
            hex = "9";
            break;
        case "1010":
            hex = "A";
            break;
        case "1011":
            hex = "B";
            break;
        case "1100":
            hex = "C";
            break;
        case "1101":
            hex = "D";
            break;
        case "1110":
            hex = "E";
            break;
        case "1111":
            hex = "F";
            break;
    }

    return hex;
};

// functions for converting Octal to other systems
Converter.convertOctalToDecimal = function (octal) {
    var total = 0;
    var oct = octal.toString();

    for (pos = 0; pos < octal.toString().length; pos++) {
        total = total * 8;
        total = total + parseInt(oct[pos]);
    }

    return total;
};

Converter.convertOctalToBinary = function (octal) {
    var binary = "";
    var octalStr = octal.toString();
    var octalArray = ["000", "001", "010", "011", "100", "101", "110", "111"];

    for (var i = 0; i < octalStr.length; i++) {
        binary += octalArray[parseInt(octalStr[i])];
    }

    return parseInt(binary);
};

Converter.convertOctalToHexa = function (octal) {
    return Converter.convertBinaryToHexa(Converter.convertOctalToBinary(octal)); // lazy, but this one is better
};

// functions for converting Hexadecimal to other systems
Converter.convertHexaToDecimal = function (hexa) {
    var total = 0;
    var hex = hexa.toString();

    for (pos = 0; pos < hexa.toString().length; pos++) {
        total = total * 8;
        switch (hex[pos]) {
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                total += parseInt(hex[pos]);
                break;
            case 'A':
                total += 10;
                break; 
            case 'B':
                total += 11;
                break;
            case 'C':
                total += 12;
                break;
            case 'D':
                total += 13;
                break;
            case 'E':
                total += 14;
                break;
            case 'F':
                total += 15;
                break;
        }

    }

    return total;
};

Converter.convertHexaToBinary = function (hexa) {
    var binary = "";
    var hexaStr = hexa.toString();

    for (var i = 0; i < hexaStr.length; i++) {
        switch (hexaStr[i]) {
            case '0':
                binary += "0";
                break;
            case '1':
                binary += "1";
                break;
            case '2':
                binary += "10";
                break;
            case '3':
                binary += "11";
                break;
            case '4':
                binary += "100";
                break;
            case '5':
                binary += "101";
                break;
            case '6':
                binary += "110";
                break;
            case '7':
                binary += "111";
                break;
            case '8':
                binary += "1000";
                break;
            case '9':
                binary += "1001";
                break;
            case 'A':
                binary += "1010";
                break;
            case 'B':
                binary += "1011";
                break;
            case 'C':
                binary += "1100";
                break;
            case 'D':
                binary += "1101";
                break;
            case 'E':
                binary += "1110";
                break;
            case 'F':
                binary += "1111";
                break;

        }
    }

    return binary;
};

Converter.convertHexaToOctal = function (hexa) {
    return Converter.convertBinaryToOctal(Converter.convertHexaToBinary(hexa)); // lazy mode agen
};

// integer parser
Converter.isNormalInteger = function (str) {
    var n = ~~Number(str);
    return String(n) === str && n >= 0;
};

// regex to check number inputs
Converter.validNumberInput = function (number) {
    var patt = /^\d+$/;

    return patt.test(number.toString().trim());
};

Converter.validBinaryInput = function (binary) {
    var patt = /^[0-1]+$/;
    return patt.test(binary.toString().trim());
};

Converter.validOctalInput = function (octal) {
    var patt = /^[0-7]+$/;
    return patt.test(octal.toString().trim());
};

Converter.validHexaInput = function (hexa) {
    var patt = /^[0-9|A-F]+$/;
    return patt.test(hexa.toString().trim());
};

// string reverse
Converter.reverseStr = function (str) {
    var o = "";
    for (var i = str.length - 1; i >= 0; i--)
        o += str[i];
    return o;
};

// add a base number subscript
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
            subscript = "<sub class='smSub'>16</sub>"
            break;
        case "Octal":
            subscript = "<sub class='smSub'>8</sub>"
            break;
    }

    return number.toString() + subscript;
};