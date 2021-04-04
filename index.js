const axios = require('axios');

function evaluateExpression (expression) {
    expressionList = parseExpression(expression);
    return evaluateExpressionList(expressionList);
}

function parseExpression (expression) {
    // Remove white spaces
    expression = expression.trim().split(/\s*/).join("");

    const operators = {
        "+": 1, "-": 1,
        "*": 1, "/": 1,
        "^": 1,
    };
    const operatorOrder = {
        "+": 1, "-": 1,
        "*": 2, "/": 2,
        "^": 3,
    };

    let number = [];
    let output = [];
    let stack = [];

    for (let i = 0; expression.length > i; i++) {
        const char = expression[i];

        // Number or ., assuming numbers supplied are valid
        if (/\d/.test(char) || char === ".") {
            number.push(char);
            continue;
        } else if (number.length > 0) {
            output.push(parseFloat(number.join("")));
            number = [];
        }

        // Operators
        if (char in operators) {
            const operator = char;
            while (stack.length > 0) {
                const stackOperator = peek(stack);
                if (stackOperator in operators && (
                        operatorOrder[operator] <= operatorOrder[stackOperator])) {
                    output.push(stack.pop());
                } else {
                    break;
                }
            }

            stack.push(operator);
        }
        // Parentheses
        else if (char === "(") {
            stack.push(char);
        }
        else if (char === ")") {
            let leftParenthesisFound = false;
            while (stack.length > 0) {
                const stackOperator = stack.pop();
                if (stackOperator === "(") {
                    leftParenthesisFound = true;
                    break;
                } else {
                    output.push(stackOperator);
                }
            }

            if (!leftParenthesisFound) {
                throw new Error("No matching left parenthesis found. On index: " + i);
            }
        }
        else {
            throw new Error("Unexpected character: " + char + ". On index: " + i);
        }
    }

    if (number.length > 0) {
        output.push(number.join(""));
        number = [];
    }

    while (stack.length > 0) {
        const stackOperator = stack.pop();
        if (stackOperator === "(") {
            throw new Error("No matching right parenthesis found. On index: " + i);
        }

        output.push(stackOperator);
    }

    return output;
}

function peek (arr) { return arr[arr.length - 1] }

async function evaluateExpressionList(expressionList) {
    const operators = {
        "+": 1, "-": 1,
        "*": 1, "/": 1,
        "^": 1,
    };

    numberStack = [];
    for(let i = 0; expressionList.length > i; i++) {
        unit = expressionList[i];
        if (!(unit in operators)) {
            numberStack.push(unit);
            continue;
        }

        const baseUrl = "http://localhost:3000";
        numRight = numberStack.pop();
        numLeft = numberStack.pop();
        if (unit === "+") {
            numberStack.push(await(axisGet(baseUrl, "add", numLeft, numRight)));
        } else if (unit === "-") {
            numberStack.push(await(axisGet(baseUrl, "subtract", numLeft, numRight)));
        } else if (unit === "*") {
            numberStack.push(await(axisGet(baseUrl, "multiply", numLeft, numRight)));
        } else if (unit === "/") {
            numberStack.push(await(axisGet(baseUrl, "divide", numLeft, numRight)));
        } else if (unit === "^") {
            numberStack.push(await(axisGet(baseUrl, "power", numLeft, numRight)));
        }
    }

    if (numberStack.length > 1) {
        throw new Error("Expression did not evaluate into one number.");
    }

    return numberStack[0];
}

async function axisGet(baseUrl, operator, numLeft, numRight) {
    return axios.get([baseUrl, operator, numLeft, numRight].join("/"))
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            throw new Error(error);
        });
}

module.exports = {
    'evaluateExpression': evaluateExpression
};
