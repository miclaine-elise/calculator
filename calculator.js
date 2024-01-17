let input = document.querySelector("#input");
let equation = document.querySelector("#equation");
let num = document.querySelectorAll(".num");
let operatorBtns = document.querySelectorAll(".operator");
let evaluateBtn = document.querySelector("#evaluate");
let clearBtn = document.querySelector("#clear");
let deleteBtn = document.querySelector("#delete");
let btns = document.querySelectorAll('button');
let operator;
let result;
let terms;
let evaluated;
let operatedFlag;

clearBtn.addEventListener("click", function (event) {
    clearInput(0);
    clearExpression();
})
deleteBtn.addEventListener("click", function (event) {
    if (!evaluated) { //Don't delete if the input is showing a solution
        input.textContent = input.textContent.slice(0, -1);
    }
})
function clearInput(value) {
    input.textContent = value;
}
function clearExpression() {
    equation.textContent = "";
}
showNumInput();
function showNumInput() {
    for (let i = 0; i <= num.length - 1; i++) {
        num[i].addEventListener('click', function (event) {
            if (evaluated) {
                clearInput();
                clearExpression();
                evaluated = false;
            }
            if (input.textContent.slice(0, 1) === "0") {
                input.textContent = input.textContent.slice(1);
            }
            input.textContent = input.textContent + this.textContent;
            handleOverflow('#input', 48);
            operatedFlag = false;
        });
    }
}

for (let i = 0; i <= operatorBtns.length - 1; i++) {
    operatorBtns[i].addEventListener("click", function (event) {
        //operatedFlag is a flag keeping track if the last button pressed was an operator. 
        if (!operatedFlag) {
            operatedFlag = true;
            //Restart the expression with the result if there is one
            if (evaluated) {
                equation.textContent = input.textContent + this.textContent;
                evaluated = false;
            } else {
                equation.textContent = equation.textContent + input.textContent + this.textContent;
            }
            getTerms();
            //If there's already a second term, evaluate current expression and then append the operator that was just pressed.
            if (terms[1] !== '') {
                newOperator = this.textContent;
                evaluateExpression();
                operator = newOperator;
                equation.textContent = result + operator;
            } else {
                operator = this.textContent;
            }
        } else {
            //If last button clicked was an operator, delete the old operator and append the new operator.
            operatedFlag = true;
            equation.textContent = equation.textContent.slice(0, -1);
            equation.textContent = equation.textContent + this.textContent;
            operator = this.textContent;

        }
        clearInput();
    });
}
evaluateBtn.addEventListener("click", function (event) {
    equation.textContent = equation.textContent + input.textContent + this.textContent;
    getTerms();
    if (terms[1]) {
        evaluateExpression();
        evaluated = true;
    } else {
        //Catch cases where equals was hit without an expression
        equation.textContent = equation.textContent.slice(0, -2);

    }
});

function getTerms() {
    if (equation.textContent.slice(0, 1) === "-") {
        expression = equation.textContent.slice(1);
        terms = expression.replaceAll('=', '').replaceAll('+', '#').replaceAll('-', '#').replaceAll('x', '#').replaceAll('/', '#').split('#');
        terms[0] = -+terms[0];
    } else {
        let expression = equation.textContent;
        terms = expression.replaceAll('=', '').replaceAll('+', '#').replaceAll('-', '#').replaceAll('x', '#').replaceAll('/', '#').split('#');
    }
}
function evaluateExpression() {
    console.log("term1: " + terms[0] + " operator:" + operator + " term2: " + terms[1]);
    let solution;
    switch (operator) {
        case operator = "+":
            solution = +terms[0] + +terms[1];
            break;
        case operator = "-":
            solution = terms[0] - terms[1];
            break;
        case operator = "x":
            solution = terms[0] * terms[1];
            break;
        case operator = "/":
            solution = terms[0] / terms[1];
            break;
    }
    if (solution > 999999) {
        result = solution.toExponential(4);
    } else {
        result = solution;
    }
    input.textContent = result;
    handleOverflow('#input', 48);
    handleOverflow('#equation', 16);

}

function handleOverflow(id, size) {
    let element = document.querySelector(id);
    element.style.fontSize = size + "px"
    const parent_width = parseInt(getComputedStyle(element.parentElement).getPropertyValue('width'));
    while (element.offsetWidth > parent_width) {
        element.style.fontSize = size + "px"
        size -= 1
    }
}

