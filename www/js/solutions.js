var NumberSystemSolution = function () {
    // we will not supply anything inside
    // this is just a static class
    // all return values are HTML Generated Strings
};

// for decimal numbers
NumberSystemSolution.DecimalSolution = function (number, answer) {
    return {
        FromBinary: function () {
            var binary = number.toString(),
                binary_length = binary.length,
                result = "", i;
            
            result = "<p>First, determine the number of digits of the binary number.</p>";
            result += "<p>Multiply each digit of the binary number by <b>2 to the "
                + "power of (n - 1)</b> where <b>n</b> is the number of "
                + "digits of the binary number.";
            result += "<p>Starting from the left, decrement the exponent for every digit, until it reaches zero.<p>";
                        
            result += "<p>";
            var starting_exponent = binary_length - 1;
            for (i = 0; i < binary_length; i += 1) {
                result += "(<b>" + binary[i] + "</b>*2<sup class='smSub'>" + starting_exponent + "</sup>) + ";
                starting_exponent -= 1;
            }
            
            // trim that last character (+)
            result = result.substring(0, result.length - 3) + "</p>";
            result += "<p>And the sum of those products will be the decimal number, which is:</p>";
            result += "<p><b>" + answer + " = " + number + "</b></p>";
            
            return result;
        },
        
        FromHexadecimal: function () {
            var hexa = number.toString(),
                hexa_length = hexa.length,
                result = "";

            result += "<p>First write down the equivalent decimal number of each of the hex digits. Refer to the table on the side</p>";
            result += "<div class='ui-grid-a'>";
                result += "<div class='ui-block-a'>";
                    result += "<table data-role='table'>";
                        result += "<thead>";
                            result += "<tr>";
                                result += "<th>Hex</th>";
                                result += "<th>Dec</th>"
                            result += "</tr>";
                        result += "</thead>";
                        result += "<tbody>";
                            var i;
                            for (i = 0; i < 10; i += 1) {
                                result += "<tr>";
                                    result += "<td>" + i + "</td>";
                                    result += "<td>" + Converter.HexadecimalToDecimal(i) + "</td>";
                                result += "</tr>";
                            }
                            result += "<tr>";
                                result += "<td>A</td>";
                                result += "<td>10</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>B</td>";
                                result += "<td>11</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>C</td>";
                                result += "<td>12</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>D</td>";
                                result += "<td>13</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>E</td>";
                                result += "<td>14</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>F</td>";
                                result += "<td>15</td>";
                            result += "</tr>";
                        result += "</tbody>";
                    result += "</table></p>";
                result += "</div>";
                result += "<div class='ui-block-b'>";
                    var exponent = hexa_length - 1;
                    result += "<p>Solution:</p><p>";
                    for (i = 0; i < hexa_length; i += 1) {
                        result += "(<b>" + Converter.HexadecimalToDecimal(hexa[i]) + "</b>*16<sup class='smSub'>" + exponent + "</sup>) + ";
                        exponent--;
                    }
                    result = result.substring(0, result.length - 3) + " = <b>" + answer + "</b></p>";
                    result += "<p>Therefore:</p><p><b>" + number + " = " + answer + "</b></p>";
                result += "</div>";
            result += "</div>";      

            return result;
        },

        FromOctal: function () {
            var octal = number.toString(),
                octal_length = octal.length,
                result = "", i;
            
            result = "<p>First, determine the number of digits of the octal number.</p>";
            result += "<p>Multiply each digit of the binary number by <b>8 to the "
                + "power of (n - 1)</b> where <b>n</b> is the number of "
                + "digits of the octal number.";
            result += "<p>Starting from the left, decrement the exponent for every digit, until it reaches zero.<p>";
                        
            result += "<p>";
            var starting_exponent = octal_length - 1;
            for (i = 0; i < octal_length; i += 1) {
                result += "(<b>" + octal[i] + "</b>*8<sup class='smSub'>" + starting_exponent + "</sup>) + ";
                starting_exponent -= 1;
            }
            
            // trim that last character (+)
            result = result.substring(0, result.length - 3) + "</p>";
            result += "<p>And the sum of those products will be the decimal number, which is:</p>";
            result += "<p><b>" + answer + " = " + number + "</b></p>";

            return result;
        }
    };
};

// for binary numbers
NumberSystemSolution.BinarySolution = function (number, answer) {
    return {
        FromDecimal: function () {
            var decimal = number,
                result = "";
                
            result = "<p>First, divide the decimal number by 2, then write down the remainder. Repeat the process until the quotient reaches 0.</p>";
            result += "<p>";
            while (decimal >= 1) {
                result += "<b>" + ~~decimal + "</b> &divide; 2 = <b>" + ~~(decimal/2) + "</b> with a remainder of <b>" + ~~(decimal%2) + "</b><br />";
                decimal = ~~(decimal/2);
            }
            result += "</p>";
            
            result += "<p>Write down the remainders from bottom to top which gives:</p>";
            result += "<p><b>" + answer + " = " + number + "</b></p>";
            return result;
        },
        
        FromHexadecimal: function () {
            var hexaStr = number.toString(),
                hex_len = hexaStr.length,
                result = "", i;

            result += "<p>To convert hexadecimal numbers to binary, just substitute the hexadecimal digits to its equivalent binary number.</p>";
            result += "<p>Refer to the table on the left for the hexadecimal to binary conversion factors.</p>";
            result += "<div class='ui-grid-a'>";
                result += "<div class='ui-block-a'>";
                    result += "<table data-role='table'>";
                        result += "<thead>";
                            result += "<tr>";
                                result += "<th>Hex</th>";
                                result += "<th>Bin</th>"
                            result += "</tr>";
                        result += "</thead>";
                        result += "<tbody>";
                            result += "<tr>";
                                result += "<td>0</td>";
                                result += "<td>0</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>1</td>";
                                result += "<td>1</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>2</td>";
                                result += "<td>10</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>3</td>";
                                result += "<td>11</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>4</td>";
                                result += "<td>100</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>5</td>";
                                result += "<td>101</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>6</td>";
                                result += "<td>110</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>7</td>";
                                result += "<td>111</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>8</td>";
                                result += "<td>1000</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>9</td>";
                                result += "<td>1001</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>A</td>";
                                result += "<td>1010</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>B</td>";
                                result += "<td>1011</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>C</td>";
                                result += "<td>1100</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>D</td>";
                                result += "<td>1101</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>E</td>";
                                result += "<td>1110</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>F</td>";
                                result += "<td>1111</td>";
                            result += "</tr>";
                        result += "</tbody>";
                    result += "</table></p>";
                result += "</div>";
                result += "<div class='ui-block-b'>";
                    result += "<p>Solution:</p><p>";
                    // convert the digits here
                    for (i = 0; i < hex_len; i++) {
                        var binn = "" + Converter.HexadecimalToBinary(hexaStr[i]);
                        var strbin = "0000";

                        result += hexaStr[i] + " = <b>";
                        result += strbin.substring(0, strbin.length - binn.length) + binn;
                        result += "</b><br>";
                    }
                    result += "</p><p>Therefore:</p>";
                    result += "<p><b>" + number + " = " + answer + "</b></p>";
                result += "</div>";
            result += "</div>";   

            return result;   

        },
        
        FromOctal: function () {
            result = "<p>Just write the binary equivalent of each octal digit, and you will get its binary number.</p>"
            result += "<p>Refer to the table on the left.</p>"
            // pretty long table here
            result += "<div class='ui-grid-a'>";
                result += "<div class='ui-block-a'>";
                    result += "<p><table data-role='table'>";
                        result += "<thead>";
                            result += "<tr>";
                                result += "<th>Oct</th>";
                                result += "<th>Bin</th>"
                            result += "</tr>";
                        result += "</thead>";
                        result += "<tbody>";
                            result += "<tr>";
                                result += "<td>1</td><td>000</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>1</td><td>001</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>2</td><td>010</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>3</td><td>011</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>4</td><td>100</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>5</td><td>101</td>";
                            result += "</tr>";                      
                            result += "<tr>";
                                result += "<td>6</td><td>110</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>7</td><td>111</td>";
                            result += "</tr>";
                        result += "</tbody>";
                    result += "</table></p>";
                result += "</div>";
                result += "<div class='ui-block-b'>";
                    result += "<p>Solution:</p><p><b>";
                    var i, num_length = number.length;
                    for (i = 0; i < num_length; i++) 
                        result += number[i] + " = " + Converter.OctalToBinary(number[i]) + "<br />";
                    result += "</b></p><p>Write down the binary numbers, which results to:</p>";
                    result += "<p><b>" + number + " = " + answer + "</b></p>";
                result += "</div>";
            result += "</div>";
            
            return result;            
        }
    };
};

// for hexadecimal numbers
NumberSystemSolution.HexadecimalSolution = function (number, answer) {
    return {
        FromDecimal: function () {
            var decimal = number,
                result = "";
            
            result = "<p>First, divide the decimal number by 16, then write down the remainder. Repeat the process until the quotient reaches 0.</p>";
            result += "<p>";
            while (decimal >= 1) {
                result += "<b>" + ~~decimal + "</b> &divide; 16 = <b>" + ~~(decimal/16) + "</b> with a remainder of <b>" + ~~(decimal%16) + "</b><br />";
                decimal = ~~(decimal/16);
            }
            result += "</p>";
            
            result += "<p>Write down the remainders from bottom to top.</p><p>If one of the remainders is <b>below 10</b>, you can "
                + "copy it. But if it is <b>more than 10</b>, you have to write between <b>A to F</b>, depending on the "
                + "remainder. This gives the result:</p>";
            result += "<p><b>" + answer + " = " + number + "</b></p>";
            return result;
        },
        
        FromBinary: function() {
            var groups = NumberSystemSolution.GroupBy(number, 4);
            
            result = "<p>Group the binary number by 4 digits. Add zeros if necessary. </p>"
            result += "<p>Then, write down its equivalent hex digit. Refer to the table on the left.</p>"
            // pretty long table here
            result += "<div class='ui-grid-a'>";
                result += "<div class='ui-block-a'>";
                    result += "<table data-role='table'>";
                        result += "<thead>";
                            result += "<tr>";
                                result += "<th>Bin</th>";
                                result += "<th>Hex</th>"
                            result += "</tr>";
                        result += "</thead>";
                        result += "<tbody>";
                            result += "<tr>";
                                result += "<td>0000</td><td>0</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>0001</td><td>1</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>0010</td><td>2</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>0011</td><td>3</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>0100</td><td>4</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>0101</td><td>5</td>";
                            result += "</tr>";                      
                            result += "<tr>";
                                result += "<td>0110</td><td>6</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>0111</td><td>7</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>1000</td><td>8</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>1001</td><td>9</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>1010</td><td>A</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>1011</td><td>B</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>1100</td><td>C</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>1101</td><td>D</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>1110</td><td>E</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>1111</td><td>F</td>";
                            result += "</tr>";
                        result += "</tbody>";
                    result += "</table></p>";
                result += "</div>";
                result += "<div class='ui-block-b'>";
                    var i, group_length = groups.length;
                    result += "<p>Solution:</p><p>";
                    for (i = 0; i < group_length; i += 1) {
                        result += "<b>" + groups[i] + "</b> = " + NumberSystemSolution.convertBinaryChunk(groups[i]) + "<br />";
                    }
                    result += "</p>";
            
                    result += "<p>Therefore:</p><p><b>" + number + " = " + answer + "</b></p>";
                result += "</div>";
            result += "</div>";
            
            return result;
        },
        
        FromOctal: function() {
            var result = "", bin = Converter.OctalToBinary(number);

            result = "<p>First, convert the octal number to binary format</p>";
            result += "<p><b>" + number + " = " + bin + "</b></p>";
            result += "<p>Then, group the digits by 4, and convert them to its hexadecimal format</p><p><b>";
            
            var groups = NumberSystemSolution.GroupBy(bin, 4), 
                group_length = groups.length,
                i;

            for (i = 0; i < group_length; i += 1) {
                result += groups[i] + " = " + Converter.BinaryToHexadecimal(groups[i]) + "<br />";
            }
            result += "</b></p><p>Lastly, write down the equivalent hexadecimal numbers, which results to:</p>";
            result += "<p><b>" + number + " = " + answer + "</b></p>";

            return result;
        }
    };
};

// for octal numbers
NumberSystemSolution.OctalSolution = function (number, answer) {
    return {
        FromDecimal: function() {
            var decimal = number,
                result = "";
            
            result = "<p>First, divide the decimal number by 8, then write down the number. Repeat the process until the quotient reaches 0.</p>";
            while (decimal >= 1) {
                result += "<b>" + ~~decimal + "</b> &divide; 8 = <b>" + ~~(decimal/8) + "</b> with a remainder of <b>" + ~~(decimal%8) + "</b><br />";
                decimal = ~~(decimal/8);
            }
            
            result += "<p>Write down the remainders from bottom to top. This gives the result:</p>";
            result += "<p><b>" + answer + " = " + number + "</b></p>";
            return result;
        },
        
        FromBinary: function() {
            var octalArray = ["000", "001", "010", "011", "100", "101", "110", "111"],
                binary = number,
                reversed = NumberSystemSolution.ReverseStr(binary.toString()),
                groups = ~~(reversed.length / 3),
                remainder = reversed.length % 3,
                zeros = (remainder == 1) ? "00" : remainder == 2 ? "0" : "",
                newBinary = NumberSystemSolution.ReverseStr(reversed + zeros),
                result = "";
            
            if (remainder != 0)
                groups++;

            var groupArray = [];
            for (var i = 0; i < groups; i++)
                groupArray.push(newBinary.substr(i * 3, 3));

            result = "<p>Group the binary number by 3 digits. Add zeros if necessary. </p>"
            result += "<p>Then, write down its equivalent octal digit. Refer to the table on the left.</p>"
            // pretty long table here
            result += "<div class='ui-grid-a'>";
                result += "<div class='ui-block-a'>";
                    result += "<p><table data-role='table'>";
                        result += "<thead>";
                            result += "<tr>";
                                result += "<th>Bin</th>";
                                result += "<th>Oct</th>"
                            result += "</tr>";
                        result += "</thead>";
                        result += "<tbody>";
                            result += "<tr>";
                                result += "<td>000</td><td>0</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>001</td><td>1</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>010</td><td>2</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>011</td><td>3</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>100</td><td>4</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>101</td><td>5</td>";
                            result += "</tr>";                      
                            result += "<tr>";
                                result += "<td>110</td><td>6</td>";
                            result += "</tr>";
                            result += "<tr>";
                                result += "<td>111</td><td>7</td>";
                            result += "</tr>";
                        result += "</tbody>";
                    result += "</table></p>";
                result += "</div>";
                result += "<div class='ui-block-b'>";
                    var group_ctr, group_length = groupArray.length,
                        octal_ctr, octal_length = octalArray.length;
            
                    result += "<p>Solution:</p><p>";
                    for (group_ctr = 0; group_ctr < group_length; group_ctr += 1) {
                        result += "<b>" + groupArray[group_ctr] + " = ";
                        for (octal_ctr = 0; octal_ctr < octal_length; octal_ctr += 1) {
                            if (groupArray[group_ctr] == octalArray[octal_ctr])
                                result += octal_ctr;
                        }
                        result += "<br>";
                    }
                    result += "</p>";
            
                    result += "<p>Therefore:</p><p><b>" + number + " = " + answer + "</b></p>";
                result += "</div>";
            result += "</div>";
            
            return result;
        },

        FromHexadecimal: function () {
            var result = "", binary_format, i, binary=Converter.HexadecimalToBinary(number);

            result += "<p>First, convert the hexadecimal number to binary format</p>";
            result += "<p>So, <b>number = " + binary + "</b></p>";
            result += "<p>Then, group the digits into three, starting from the right, and convert them to octal numbers</p>";
            result += "<p><b>";
            binary_format = NumberSystemSolution.GroupBy(binary, 3);
            var bin_len = binary_format.length;

            for (i = 0; i < bin_len; i++) 
                result += binary_format[i] + " = " + Converter.BinaryToOctal(binary_format[i]) + "<br>";
            result += "</b></p>";
            result += "<p>Then, write down the octal numbers, which results to:</p>";
            result += "<p><b>" + answer + "</b></p>";

            return result;
        }
    };
};


// misc functions (but I can use them there)
NumberSystemSolution.convertBinaryChunk = function (chunk) {
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

// ip address converter
NumberSystemSolution.IpAddressSolution = function (number) {
    var result = "",
        octets = number.split(".", 4),
        octet_length = octets.length,
        i;

    result = "<p>Convert each octet to binary</p><p><b>";
    for (i = 0; i < octet_length; i += 1) {
        result += octets[i] + " = " + Converter.DecimalToBinary(octets[i]) + "<br>";
    }

    result += "</b></p>";
    
    return result;

};

NumberSystemSolution.ReverseStr = function (str) {
    var o = "";
    for (var i = str.length - 1; i >= 0; i--)
        o += str[i];
    return o;
};

NumberSystemSolution.GroupBy = function(binary, number) {
    var revBinary = NumberSystemSolution.ReverseStr(binary.toString()),
        remainder = ~~(revBinary.length % number);
    
    if (remainder > 0) {
        for (var i = 0; i < number - remainder; i += 1)
            revBinary += "0";
    }
    var trueBinary = NumberSystemSolution.ReverseStr(revBinary);

    // divide string by four
    var groups = [];
    for (var i = 0; i < ~~(trueBinary.length / number) ; i++)
        groups.push(trueBinary.substr(i * number, number));

    return groups;
};