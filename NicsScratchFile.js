var Debugger;

function Debugger(process) {
    this.init(process);
}

Debugger.prototype.init = function (process) {
    this.process = process;
};

Debugger.prototype.printVars = function () {
    this.process.context.variables.allNames().forEach(function (name) {
        console.log(name, '=>', this.process.context.variables.getVar(name));
    });
};

Debugger.prototype.step = function () {
    this.process.resume();
    this.process.runStep();
    this.process.pause();
};

var nicsglobalvar2;
