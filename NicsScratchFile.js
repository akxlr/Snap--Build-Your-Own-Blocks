var Debugger;

function Debugger(process) {
    this.init(process);
}

Debugger.prototype.init = function (process) {
    this.process = process;
    var self = this;

    // hijack process evaluateBlock function

    process.evaluateBlock = function(block, argCount) {

        console.log('Paused on block: ' + block.blockSpec);
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


//////////////////////////

BlockMorph.prototype.addTestHighlight = function (color) {
    var block_color = new Color(0, 0, 255, 255);

    if (color != null) {
        block_color = color;
    }

    var isHidden = !this.isVisible,
        highlight;

    if (isHidden) {this.show(); }
    this.removeHighlight();
    highlight = this.singlehighlight(
        block_color,
        this.activeBlur,
        this.activeBorder
    );
    this.addBack(highlight);
    this.fullChanged();
    if (isHidden) {this.hide(); }
    return highlight;
};
