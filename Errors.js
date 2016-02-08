//functions override the functions written in threads.js
// Check Process variable primitives
//report error if there is no list or the index is not a number
Process.prototype.reportListItem = function (index, list) {

    if (list === null) {
        throw {name: "report item from list error", message: "there is no list to get an element from"};
    }

    if (isNaN(index)) {
        throw {name: "report item from list error", message: "the index should be a number"};
    }

    var idx = index;
    if (index === '') {
        return '';
    }
    if (this.inputOption(index) === 'any') {
        idx = this.reportRandom(1, list.length());
    }
    if (this.inputOption(index) === 'last') {
        idx = list.length();
    }
    return list.at(idx);
};

//in the original method , when input is zero , the last element in the list will be deleted
//when the absolute value of the negative input is larger than the length of the list
//the first element in the list will be deleted.
Process.prototype.doDeleteFromList = function (index, list) {
    var idx = index;

    if (list === null) {
         throw {name: "report delete from list error", message: "there is no list to delete "};
    }

    if (index > list.length()) {
        throw {name: "report delete from list error", message: "the input is out of range"};
    }
    if (index <= 0) {
        throw {name: "report delete from list error", message: "the input is out of range"};
    }

    if (isNaN(index)) {
        throw {name: "report item from list error", message: "the index should be a number"};
    }

    if (this.inputOption(index) === 'all') {
        return list.clear();
    }
    if (index === '') {
        return null;
    }
    if (this.inputOption(index) === 'last') {
        idx = list.length();
    }
    list.remove(idx);
};

//in the original method , when any number inserted is larger than the length of the list
//the new element will be inserted at the end of the list
//also if the negative number is inserted , the new element will be inserted at the beginning of the list
Process.prototype.doInsertInList = function (element, index, list) {
    var idx = index;

    if (list === null) {
         throw {name: "report insert in list error", message: "there is no list to insert "};
    }

    if (index > list.length()) {
        throw {name: "report insert in list error", message: "the input is out of range"};
    }
    if (index <= 0) {
        throw {name: "report insert in list error", message: "the input is out of range"};
    }

    if (isNaN(index)) {
        throw {name: "report item from list error", message: "the index should be a number"};
    }

    if (index === '') {
        return null;
    }
    if (this.inputOption(index) === 'any') {
        idx = this.reportRandom(1, list.length());
    }
    if (this.inputOption(index) === 'last') {
        idx = list.length() + 1;
    }
    list.add(element, idx);
};

//report error if the index is not a number
Process.prototype.doReplaceInList = function (index, list, element) {
    var idx = index;

    if (list === null) {
         throw {name: "report replace in list error", message: "there is no list to replace "};
    }

    if (index === '') {
        return null;
    }
    if (isNaN(index)) {
        throw {name: "report item from list error", message: "the index should be a number"};
    }
    if (this.inputOption(index) === 'any') {
        idx = this.reportRandom(1, list.length());
    }
    if (this.inputOption(index) === 'last') {
        idx = list.length();
    }
    list.put(element, idx);
};

Process.prototype.reportCDR = function (list) {
    if (list === null) {
        throw {name: "report all but first error", message: "there is no list to report all but first"};
    }
    return list.cdr();
};

Process.prototype.doAddToList = function (element, list) {
     if (list === null) {
         throw {name: "report add to list error", message: "there is no list "};
    }
    list.add(element);
};

Process.prototype.reportListLength = function (list) {
    if (list === null) {
         throw {name: "report list length error", message: "there is no list to report list length"};
    }
    return list.length();
};

Process.prototype.reportListContainsItem = function (list, element) {
    if (list === null) {
         throw {name: "report list contains item error", message: "there is no list"};
    }
    return list.contains(element);
};

//Check Process control primitives
//the input should be non-negative numbers
Process.prototype.doWait = function (secs) {
    if (secs < 0) {
        throw {name: "report wait error", message: "the input should be nonnegative"};
    }
    if (isNaN(secs)) {
        throw {name: "report wait error", message: "the input should be a number"};
    }
    if (!this.context.startTime) {
        this.context.startTime = Date.now();
    }
    if ((Date.now() - this.context.startTime) >= (secs * 1000)) {
        return null;
    }
    this.pushContext('doYield');
    this.pushContext();
};

// Check Process math primitives

//function isString(str){
//    return (typeof str=='string')
//}

//for the math primitives , the elements operated should be numbers
//for the reportQuotient and reportModulus , the divisor can not be zero
Process.prototype.reportSum = function (a, b) {
    if (isNaN(a) && isNaN(b)) {
        throw {name: "report sum error", message: "both the elements should be numbers"};
    } else if (isNaN(a)) {
        throw {name: "report sum error", message: " the first element " + a + " should be a number "};
    } else if (isNaN(b)) {
        throw {name: "report sum error", message: " the second element " + b + " should be a number "};
    } else {
        return +a + (+b);
    }
};

Process.prototype.reportDifference = function (a, b) {
    if (isNaN(a) && isNaN(b)) {
        throw {name: "report difference error", message: "both the elements should be numbers"};
    } else if (isNaN(a)) {
        throw {name: "report difference error", message: " the first element " + a + " should be a number "};
    } else if (isNaN(b)) {
        throw {name: "report difference error", message: " the second element " + b + " should be a number "};
    } else {
        return +a - (+b);
    }
};

Process.prototype.reportProduct = function (a, b) {
    if (isNaN(a) && isNaN(b)) {
        throw {name: "report product error", message: "both the elements should be numbers"};
    } else if (isNaN(a)) {
        throw {name: "report product error", message: " the first element " + a + " should be a number "};
    } else if (isNaN(b)) {
        throw {name: "report product error", message: " the second element " + b + " should be a number "};
    } else {
        return +a * (+b);
    }
};

Process.prototype.reportQuotient = function (a, b) {
    if (isNaN(a) && isNaN(b)) {
        throw {name: "report quotient error", message: "both the elements should be numbers"};
    } else if (isNaN(a)) {
        throw {name: "report quotient error", message: " the first element " + a + " should be a number "};
    } else if (isNaN(b)) {
        throw {name: "report quotient error", message: " the second element " + b + " should be a number "};
    } else if (b == ' '|| b == '0' ) {
        throw {name: "report quotient error", message: "The divisor can not be zero"};
    } else {
        return +a / +b;
    }
};

Process.prototype.reportModulus = function (a, b) {
    var x = +a,
        y = +b;

    if (isNaN(x) && isNaN(y)) {
        throw {name: "report quotient error", message: "both the elements should be numbers"};
    } else if (isNaN(x)) {
        throw {name: "report quotient error", message: " the first element " + a + " should be a number "};
    } else if (isNaN(y)) {
        throw {name: "report quotient error", message: " the second element " + b + " should be a number "};
    } else if (y == ' ') {
        throw {name: "report modulus error", message: "The divisor can not be zero"};
    } else {
        return ((x % y) + y) % y;
    }
};


Process.prototype.reportRandom = function (min, max) {
    var floor = +min,
        ceil = +max;

    if (isNaN(floor) && isNaN(ceil)) {
        throw {name: "report random error", message: "both the elements should be numbers"};
    }
    if (isNaN(floor)) {
        throw {name: "report random error", message: " the first element " + floor + " should be a number "};
    }
    if (isNaN(ceil)) {
        throw {name: "report random error", message: " the second element " + ceil + " should be a number "};
    }
    if ((floor % 1 !== 0) || (ceil % 1 !== 0)) {
        return Math.random() * (ceil - floor) + floor;
    }
    return Math.floor(Math.random() * (ceil - floor + 1)) + floor;
};

   

   

Process.prototype.reportRound = function (n) {
    if (isNaN(n)) {
        throw {name: "report round error", message: "the element should be a number"};
    } else {
        return Math.round(+n);
    }
};

Process.prototype.reportMonadic = function (fname, n) {
    var x = +n,
        result = 0;

    if (isNaN(x)) {
        throw {name: "report round error", message: "the element should be a number"};
    }

    switch (this.inputOption(fname)) {
    case 'abs':
        result = Math.abs(x);
        break;
    case 'floor':
        result = Math.floor(x);
        break;
    case 'sqrt':
        if (x < 0) {
            throw {name: "report sqrt error", message: "the number should be positive"};
        } else {
            result = Math.sqrt(x);
        }
        break;
    case 'sin':
        result = Math.sin(radians(x));
        break;
    case 'cos':
        result = Math.cos(radians(x));
        break;
    case 'tan':
        result = Math.tan(radians(x));
        break;
    case 'asin':
        result = degrees(Math.asin(x));
        break;
    case 'acos':
        result = degrees(Math.acos(x));
        break;
    case 'atan':
        result = degrees(Math.atan(x));
        break;
    case 'ln':
        if (x < 0) {
            throw {name: "report ln error", message: "the number should be positive"};
        } else {
            result = Math.log(x);
        }
        break;
    case 'log':
        result = 0;
        break;
    case 'e^':
        result = Math.exp(x);
        break;
    case '10^':
        result = 0;
        break;
    default:
        nop();
    }
    return result;
};



// Process string ops

Process.prototype.reportLetter = function (idx, string) {
    if (isNaN(idx)) {
        throw {name: "report letter error", message: "the element should be a number"};
    }
    if (idx <= 0 || idx > string.length) {
        throw {name: "report letter error", message: "the index is out of range"};
    }
    var i = +(idx || 0),
        str = (string || '').toString();
    return str[i - 1] || '';
};


Process.prototype.reportUnicodeAsLetter = function (num) {
    var code = +(num || 0);
    if (isNaN(code)) {
        throw {name: "report unicodeAsLetter error", message: "the input should be a number"};
    }
    return String.fromCharCode(code);
};


