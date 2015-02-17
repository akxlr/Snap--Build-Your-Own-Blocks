// Custom Error Dialog

var ErrorLogMorph

ErrorLogMorph.prototype = new DialogBoxMorph();
ErrorLogMorph.prototype.constructor = ErrorLogMorph;
ErrorLogMorph.uber = DialogBoxMorph.prototype;

function ErrorLogMorph(target) {
    this.init(target);
}

ErrorLogMorph.prototype.init = function (error_manager) {
    /*
     * buttons - button names and callback functions
     *     [{name: 'asdf', action: somefunc}]
     * log - array of messages to be rendered
     *     ['kitten in the fireplace', 'list is empty']
     */

    // Call parent init function
    ErrorLogMorph.uber.init.call(
        this
    );

    var myself = this;
    this.error_manager = error_manager;

    this.labelString = 'Error Log';
    this.createLabel();

    // create error log area
    var list = new ListMorph(
        (error_manager.log !== null ? error_manager.log : []),
        null,
        null,
        null
    ); 

    this.addBody(list);
    this.addButton('ok', 'OK');
    if (error_manager.clearHighlights) {
        this.addButton(function () {
            error_manager.clearHighlights();
        }, 'Clear GFX Errors');
    }
    if (error_manager.clearLog) {
        this.addButton(function () {
            error_manager.clearLog();
        }, 'Clear Log');
    }

    this.fixLayout();
    this.drawNew();
    
}

ErrorLogMorph.prototype.popUp = function (world) {
    ErrorLogMorph.uber.popUp.call(this, world);
    this.handle = new HandleMorph(
        this,
        null,
        null,
        this.corner,
        this.corner
    );
}

ErrorLogMorph.prototype.fixLayout = function () {
    var th = fontHeight(this.titleFontSize) + this.titlePadding * 2, w;


    if (this.body) {
        this.body.setPosition(this.position().add(new Point(
            this.padding,
            th + this.padding
        )));

        this.body.setExtent(new Point(
            this.width() - this.padding * 2,
            this.height() - this.padding * 3 - th - this.buttons.height()
        ));

        this.silentSetWidth(
            Math.max(
                this.body.width(),
                (this.label !== null ? this.label.width() : 0),
                (this.buttons !== null ? this.buttons.width() : 0)
            )
            + this.padding * 2
        );

        this.silentSetHeight(
            this.body.height()
            //+ (this.label !== null ? this.label.height() : 0)
            //+ (this.buttons !== null ? this.buttons.height() : 0)
            + this.padding * 2
            + th
        );
    }

    if (this.label) {
        this.label.setCenter(this.center());
        this.label.setTop(this.top() + (th - this.label.height()) / 2);
    }

    if (this.buttons && (this.buttons.children.length > 0)) {
        this.buttons.fixLayout();
        this.silentSetHeight(
            this.height()
                    + this.buttons.height()
                    + this.padding
        );
        this.buttons.setCenter(this.center());
        this.buttons.setBottom(this.bottom() - this.padding);
    }

    /*if (this.buttons && (this.buttons.children.length > 0)) {
        this.buttons.setCenter(this.center());
        this.buttons.setBottom(this.bottom() - this.padding);
    }*/ // alternate from EditorBox
}

ErrorLogMorph.prototype.accept = function() {
    this.error_manager.dialog = null;
    this.destroy();
}

// messy stuff

var ErrorManager;

function ErrorManager() {
    this.errorHighlights = [];
    this.log = [];
    this.dialog = null; // Graphical Error Log
}

ErrorManager.prototype.addHighlight = function (hl) {
    this.errorHighlights.push(hl);
}

ErrorManager.prototype.clearHighlights = function () {
    this.errorHighlights.forEach(function (hl) {
        hl.destroy();
    });
    this.errorHighlights = [];
}

ErrorManager.prototype.clearLog = function() {
    this.log = [];
    if (this.dialog) {
        this.dialog.body.destroy();
    }
    this.dialog.addBody(new ListMorph(this.log));
    this.dialog.fixLayout();
    this.dialog.drawNew();
}

ErrorManager.prototype.logErrorMsg = function (msg) {
    this.log.push(msg);
}

ErrorManager.prototype.showLog = function () {
    if (this.dialog == null) {
        this.dialog = new ErrorLogMorph(this);

        if (world) {
            this.dialog.popUp(world);
        }
    } else {
        this.dialog.body.destroy();
        this.dialog.addBody(new ListMorph(this.log));
        this.dialog.fixLayout();
        this.dialog.drawNew();
    }
}

var nicsglobalvar = new ErrorManager();

BlockMorph.prototype.highlight = function (color, blur, border) {
    var highlight = new BlockHighlightMorph(),
        fb = this.fullBounds(),
        edge = border;
    highlight.setExtent(fb.extent().add(edge * 2));
    highlight.color = color;
    highlight.image = this.highlightImage(color, border);
    highlight.setPosition(fb.origin.subtract(new Point(edge, edge)));
    return highlight;
};

BlockMorph.prototype.singlehighlight = function (color, border) {
    var highlight = new BlockHighlightMorph(),
        fb = this.bounds,
        edge = border;
    highlight.setExtent(fb.extent().add(edge*2));
    highlight.color = color;
    highlight.image = this.highlightImage(color, border);
    highlight.setPosition(fb.origin.subtract(new Point(edge, edge)));
    return highlight;
};

BlockMorph.prototype.addErrorHighlight = function () {
    var isHidden = !this.isVisible,
        highlight;

    if (isHidden) {this.show(); }
    this.removeHighlight();
    highlight = this.singlehighlight(
        this.errorHighlight,
        this.activeBorder
    );
    this.addBack(highlight);
    this.fullChanged();
    if (isHidden) {this.hide(); }
    return highlight;
};

// threads.js
Process.prototype.handleError = function (error, element) {
    var m = element;
    this.stop();
    this.errorFlag = true;

    this.topBlock.removeHighlight();

    // add highlight to the trouble block
    var hl = m.addErrorHighlight();
    nicsglobalvar.addHighlight(hl);

    // add to temporaries, remove on next click
    //world.hand.temporaries.push(hl);

    // traverse the context tree
    // add error highlight to expression of root
    var t = this.context,
        t1;

    /* old code
     while (t != null) {
     
        t1 = t;
        t = t.parentContext;
    }
    if (t1.expression != m) {
        hl = t1.expression.addErrorHighlight();
        nicsglobalvar.addHighlight(hl);
        //world.hand.temporaries.push(hl);
    }*/


    while (t != null) {
        t1 = t;
        t = t.parentContext;

        if (t1.expression instanceof BlockMorph) {
            hl = t1.expression.addErrorHighlight();
            nicsglobalvar.addHighlight(hl);
        }
    }

    if (this.topBlock instanceof CustomCommandBlockMorph) {
        hl = this.topBlock.addErrorHighlight();
        nicsglobalvar.addHighlight(hl);
    }

    console.log("Error in block (", m.blockSpec, "): ", error.name, error.message);

    if (isNil(m) || isNil(m.world())) {
        m = this.topBlock;
    }

    nicsglobalvar.logErrorMsg(
        (m === element ? '' : 'Inside error: ')
        +"Error in block (" + element.blockSpec + "): " + error.name + " - " + error.message);
    nicsglobalvar.showLog();
    

    /*m.showBubble(
        (m === element ? '' : 'Inside: ')
            + error.name
            + '\n'
            + error.message
    );*/
};


// morphic.js
SpeechBubbleMorph.prototype.popUp = function (world, pos, isClickable) {
    this.drawNew();
    this.setPosition(pos.subtract(new Point(0, this.height())));
    this.addShadow(new Point(2, 2), 80);
    this.keepWithin(world);
    world.add(this);
    this.fullChanged();
    world.hand.destroyTemporaries();
    world.hand.temporaries.push(this);

    if (!isClickable) {
        // stop hovering over the bubble from destroying it
        /*this.mouseEnter = function () {
            this.destroy();
        };*/
    } else {
        this.isClickable = true;
    }
};


