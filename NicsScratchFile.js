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
        block.addTestHighlight();
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
    this.args[0].removeHighlight();
    Process.prototype.evaluateBlock.apply(this.process, this.args);
};

Debugger.prototype.resume = function() {
    this.process.resume();
    this.args[0].removeHighlight();
    this.process.evaluateBlock = Process.prototype.evaluateBlock;
    
    Process.prototype.evaluateBlock.apply(this.process, this.args);
};

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
        this.activeBorder
    );
    this.addBack(highlight);
    this.fullChanged();
    if (isHidden) {this.hide(); }
    return highlight;
};

// BlockMorph copying

BlockMorph.prototype.fullCopy = function () {
    var ans = BlockMorph.uber.fullCopy.call(this);
    //ans.removeHighlight();
    ans.isDraggable = true;
    if (this.instantiationSpec) {
        ans.setSpec(this.instantiationSpec);
    }
    ans.allChildren().filter(function (block) {
        return !isNil(block.comment);
    }).forEach(function (block) {
        var cmnt = block.comment.fullCopy();
        block.comment = cmnt;
        cmnt.block = block;
        //block.comment = null;

    });
    return ans;
};
