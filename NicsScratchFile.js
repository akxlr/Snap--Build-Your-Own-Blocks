var Debugger;

function Debugger(process) {
    this.init(process);
}

Debugger.prototype.init = function (process) {
    this.process = process;
    var self = this;

    // hijack process evaluateBlock function

    process.evaluateBlock = function(block, argCount) {

        this.pause();
        self.args = [block, argCount];

        //Process.prototype.evaluateBlock.apply(process, [block, argCount]);
    };
};

Debugger.prototype.printVars = function () {
    this.process.context.variables.allNames().forEach(function (name) {
        console.log(name, '=>', this.process.context.variables.getVar(name));
    });
};

Debugger.prototype.step = function() {
    this.process.resume();
    Process.prototype.evaluateBlock.apply(this.process, this.args);
}

/*Debugger.prototype.step = function () {
    this.process.resume();
    this.process.runStep();
    this.process.pause();
};*/

var nicsglobalvar2;
