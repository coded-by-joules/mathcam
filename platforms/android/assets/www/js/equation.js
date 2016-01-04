// Equation Solver for Calculators
(function (obj) {	
    // number holders	
    var numbersOnExpression = {};
	
	// class constructor
	function Equation(eq) {
		this.equation = eq;
	}
	
	// convert to postfix expression
	Equation.prototype.ToPostfix = function() {
		var postfix = "";
		var infix = replaceNumbers(this.equation);
		var stack = [];
		
		for (var i = 0; i < infix.length; i++) {
			if (IsOperand(infix.charAt(i))) {
				if (stack.length === 0)
					stack.push(infix.charAt(i));
				else {
					if (Precedence(stack[stack.length-1]) >= Precedence(infix.charAt(i))) {
						while (stack.length !== 0 && Precedence(stack[stack.length-1]) >= Precedence(infix.charAt(i))) {
							if (stack[stack.length-1] == '(')
								break;
							else
								postfix += stack.pop().toString();
						}
						
						if (infix.charAt(i) != ')')
							stack.push(infix.charAt(i));
					}
					else {
						if (infix.charAt(i) != ')')
							stack.push(infix.charAt(i));
						else {
							while (stack[stack.length-1] != '(') {
								postfix += stack.pop().toString();
								if (stack[stack.length-1] == '(') {
									stack.pop();
									break;
								}
							}
						}
					}
				}
			}
			else
				postfix += infix.charAt(i);
		}
		
		while (stack.length !== 0) {
			if (stack[stack.length-1] != '(')
				postfix += stack.pop().toString();
			else
				stack.pop();
		}
		
		return postfix;
	};
	
	// Solve PostFix Expression
	Equation.prototype.SolvePostfix = function(postfix, base) {
		var expStack = [];
		var radix = 10;
		switch (base) {
		    case "Decimal":
		        radix = 10; // default
		        break;
		    case "Binary":
		        radix = 2;
		        break;
		    case "Hexadecimal":
		        radix = 16;
		        break;
		    case "Octal":
		        radix = 8;
		        break;
		}

		for (var i = 0; i < postfix.length; i++) {
		    var e = postfix.charAt(i);
			if (IsOperand(e)) {
				var temp1 = parseInt(expStack.pop(), radix);
				var temp2 = parseInt(expStack.pop(), radix);
				var answer = 0;
				
				switch (e) {
					case '+':
						answer = temp2 + temp1;
						break;
					case '-':
						answer = temp2 - temp1;
						break;
					case '*':
						answer = temp2 * temp1;
						break;
					case '/':
						answer = ~~(temp2 / temp1);
						break;
				}
				expStack.push(answer.toString(radix));
			}
			else
				expStack.push(numbersOnExpression[e]);
		}
		

		return expStack[expStack.length-1].toString();
	};
    
    // validate infix expression
    Equation.prototype.ValidateEquation = function () {
        var exp = /^([\(0-9A-F\)]+([\*\+\-\/][0-9A-F\(\)]+)+)+$/;
        
        return checkParenthesis(this.equation) && exp.test(this.equation);
    };

    // get numbers
    Equation.prototype.GetNumbers = function () {
    	numbersOnExpression = {}; // clear list
        var numbers = this.equation.split(/[\(\)\+\-\*\/]+/);

        // assign the numbers in variables
        var vars = "a";
        for (var i = 0; i < numbers.length; i++) {
            if (numbers[i].trim() !== "" && !valueExists(numbers[i])) {
                numbersOnExpression[vars] = numbers[i];
                var code = vars.charCodeAt(0);
                code++;
                vars = String.fromCharCode(code);
            }
        }

        return numbersOnExpression;
    };
	
    function checkParenthesis(text) {
        var stack = [];
 
        for (var i = 0; i < text.length; i++) {
            if (text.charAt(i) == '(')
                stack.push('(');
            else if (text.charAt(i) == ')') {
                if (stack.length !== 0)
                    stack.pop();
                else
                    return false; // if ) is found without (, return as error
            }
            
        }
 
        return stack.length === 0;

    }
    
    function replaceNumbers(infix) {
        numbersOnExpression = {}; // clear list
        var numbers = infix.split(/[\(\)\+\-\*\/]+/);
		infix = "[" + infix + "]";

        // assign the numbers in variables
        var vars = "a";
        for (var i = 0; i < numbers.length; i++) {
            if (numbers[i].trim() !== "" && !valueExists(numbers[i])) {
                numbersOnExpression[vars] = numbers[i];
                var code = vars.charCodeAt(0);
                code++;
                vars = String.fromCharCode(code);
            }
        }
        
		// replace numbers with variables
		for (var key in numbersOnExpression) {
			var regexp = "((\[)|([\(\)\*\+\-\/]))+" + numbersOnExpression[key] + "(([\(\)\*\+\-\/])|(\]$))+";
			var pattern = new RegExp(regexp, "g");
			var result;
			
			while ((result = pattern.exec(infix)) !== null) {
				var replaceExp = new RegExp(numbersOnExpression[key]);
				var replaceStr = result[0].replace(replaceExp, key);
				infix = infix.replace(result[0], replaceStr);
			}			
		}
		
		// replace the variables that are not replaced previously
		for (key in numbersOnExpression) {
			infix = infix.replace(numbersOnExpression[key], key);
		}
		
		// remove brackets
		infix = infix.replace("[", "");
		infix = infix.replace("]", "");
						

		return infix;
    }
	
	function valueExists(val) {
		var found = false;
		
		for (var key in numbersOnExpression)
			if (numbersOnExpression[key] == val)
				found = true;
		
		return found;
	}
	
	function IsOperand(c) {
		var operand = false;
		
		switch (c) {
			case '+':
			case '-':
			case '*':
			case '/':
			case '(':
			case ')':
				operand = true;
				break;
			default:
				operand = false;
				break;
		}
		
		return operand;
	}
	
	function Precedence(c) {
		var status = 0;
		
		switch (c) {
			case '+':
			case '-':
				status = 0;
				break;
			case '*':
			case '/':		
				status = 1;
				break;
			case '(':
			case ')':
				status = 2;
				break;
		}
		
		return status;
	}
	
	obj.Equation = Equation;
})(this);