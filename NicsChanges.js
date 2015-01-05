// messy stuff

var ErrorManager;

function ErrorManager() {
    this.errorHighlights = [];
    this.log = [];
    this.dialog = null;
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

ErrorManager.prototype.showLog2 = function () {

    var self = this;

    if (this.dialog !== null) {
        this.dialog.destroy();
    } 
    var dlg = new DialogBoxMorph();

    var textstring = '';
    this.log.forEach(function (msg) {
        textstring = textstring + msg + '\n';
    });

    var clearButton = dlg.addButton( function() {
            self.clearLog();
            dlg.body.text = "";
            dlg.body.drawNew();
            dlg.fixLayout();
            dlg.drawNew();
        },
        'Clear Log'
    );

    var cleanButton = dlg.addButton( function() {
            self.clearHighlights();
        },
        'Clear Errors' 
    );
   
    dlg.inform('Error Log',
        textstring, world);
    dlg.fixLayout();
    dlg.drawNew();  
    this.dialog = dlg;
    
}

ErrorManager.prototype.showLog = function () {
    var self = this;

    if (this.dialog !== null) {
        this.dialog.destroy();
    } 
    var dlg = new DialogBoxMorph();

    /*var textstring = '';
    this.log.forEach(function (msg) {
        textstring = textstring + msg + '\n';
    });*/

    dlg.labelString = 'Error Log';
    dlg.createLabel();

    var list = new ListMorph(
        self.log,
        null,
        null,
        null
    );
    list.setExtent(new Point(500, 100));

    dlg.addBody(list);
    dlg.addButton('ok', 'OK');

    dlg.fixLayout();
    dlg.drawNew();  
    dlg.popUp(world);

    this.dialog = dlg;
}

ErrorManager.prototype.clearLog = function() {
    this.log = [];
}

ErrorManager.prototype.logErrorMsg = function (msg) {
    this.log.push(msg);
}

var nicsglobalvar = new ErrorManager();

// From blocks.js
SyntaxElementMorph.prototype.showBubble = function (value, exportPic) {
    var bubble,
        txt,
        img,
        morphToShow,
        isClickable = false,
        sf = this.parentThatIsA(ScrollFrameMorph),
        wrrld = this.world();

    if ((value === undefined) || !wrrld) {
        return null;
    }
    if (value instanceof ListWatcherMorph) {
        morphToShow = value;
        morphToShow.update(true);
        morphToShow.step = value.update;
        morphToShow.isDraggable = false;
        isClickable = true;
    } else if (value instanceof Morph) {
        img = value.fullImage();
        morphToShow = new Morph();
        morphToShow.silentSetWidth(img.width);
        morphToShow.silentSetHeight(img.height);
        morphToShow.image = img;
    } else if (value instanceof Costume) {
        img = value.thumbnail(new Point(40, 40));
        morphToShow = new Morph();
        morphToShow.silentSetWidth(img.width);
        morphToShow.silentSetHeight(img.height);
        morphToShow.image = img;
    } else if (value instanceof Context) {
        img = value.image();
        morphToShow = new Morph();
        morphToShow.silentSetWidth(img.width);
        morphToShow.silentSetHeight(img.height);
        morphToShow.image = img;
    } else if (typeof value === 'boolean') {
        morphToShow = SpriteMorph.prototype.booleanMorph.call(
            null,
            value
        );
    } else if (isString(value)) {
        txt  = value.length > 500 ? value.slice(0, 500) + '...' : value;
        morphToShow = new TextMorph(
            txt,
            this.fontSize
        );
    } else if (value === null) {
        morphToShow = new TextMorph(
            '',
            this.fontSize
        );
    } else if (value === 0) {
        morphToShow = new TextMorph(
            '0',
            this.fontSize
        );
    } else if (value.toString) {
        morphToShow = new TextMorph(
            value.toString(),
            this.fontSize
        );
    }
    bubble = new SpeechBubbleMorph(
        morphToShow,
        null,
        Math.max(this.rounding - 2, 6),
        0
    );
    bubble.popUp(
        wrrld,
        this.rightCenter().add(new Point(2, 0)),
        isClickable
    );
    if (exportPic) {
        this.exportPictureWithResult(bubble);
    }
    if (sf) {
        bubble.keepWithin(sf);
    }
};

BlockMorph.prototype.highlight = function (color, blur, border) {
    var highlight = new BlockHighlightMorph(),
        fb = this.fullBounds(),
        edge = useBlurredShadows && !MorphicPreferences.isFlat ?
                blur : border;
    highlight.setExtent(fb.extent().add(edge * 2));
    highlight.color = color;
    highlight.image = useBlurredShadows && !MorphicPreferences.isFlat ?
            this.highlightImageBlurred(color, blur)
                : this.highlightImage(color, border);
    highlight.setPosition(fb.origin.subtract(new Point(edge, edge)));
    return highlight;
};

BlockMorph.prototype.singlehighlight = function (color, blur, border) {
    var highlight = new BlockHighlightMorph(),
        fb = this.bounds,
        edge = useBlurredShadows && !MorphicPreferences.isFlat ?
                blur : border;
    highlight.setExtent(fb.extent().add(edge*2));
    highlight.color = color;
    highlight.image = useBlurredShadows && !MorphicPreferences.isFlat ?
            this.highlightImageBlurred(color, blur)
                : this.highlightImage(color, border);
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
        this.activeBlur,
        2
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

    // dialog box stuff

   /* 
    dlg = new DialogBoxMorph();
    dlg.inform('About Snap',
        'Fixie gentrify disrupt trust fund, readymade chia semiotics\n'
        +'Truffaut umami vegan Pinterest deep v. Trust fund health goth\n'
        +'flannel synth street art. Trust fund wayfarers flannel wolf', world);
    dlg.fixLayout();
    dlg.drawNew();
*/

    //


    // add highlight to the trouble block
    var hl = m.addErrorHighlight();
    nicsglobalvar.addHighlight(hl);

    // add to temporaries, remove on next click
    //world.hand.temporaries.push(hl);

    // traverse the context tree
    // add error highlight to expression of root
    var t = this.context,
        t1;

    while (t != null) {
        t1 = t;
        t = t.parentContext;
    }
    if (t1.expression != m) {
        hl = t1.expression.addErrorHighlight();
        nicsglobalvar.addHighlight(hl);
        //world.hand.temporaries.push(hl);
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

Process.prototype.doInsertInList = function (element, index, list) {
    var idx = index;
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

Process.prototype.reportListItem = function (index, list) {

    if (list === null) {
        throw {name: "report item from list error", message: "there is no list to get an element from"};
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


// widgets.js
DialogBoxMorph.prototype.fixLayout = function () {
    var th = fontHeight(this.titleFontSize) + this.titlePadding * 2, w;

    if (this.head) {
        this.head.setPosition(this.position().add(new Point(
            this.padding,
            th + this.padding
        )));
        this.silentSetWidth(this.head.width() + this.padding * 2);
        this.silentSetHeight(
            this.head.height()
                + this.padding * 2
                + th
        );
    }

    if (this.body) {
        if (this.head) {
            this.body.setPosition(this.head.bottomLeft().add(new Point(
                0,
                this.padding
            )));
            this.silentSetWidth(Math.max(
                this.width(),
                this.body.width() + this.padding * 2
            ));
            this.silentSetHeight(
                this.height()
                    + this.body.height()
                    + this.padding
            );
            w = this.width();
            this.head.setLeft(
                this.left()
                    + Math.round((w - this.head.width()) / 2)
            );
            this.body.setLeft(
                this.left()
                    + Math.round((w - this.body.width()) / 2)
            );
        } else {
            this.body.setPosition(this.position().add(new Point(
                this.padding,
                th + this.padding
            )));
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
                + (this.label !== null ? this.label.height() : 0)
                + (this.buttons !== null ? this.buttons.height() : 0)
                + this.padding * 2
                + th
            );
        }
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
};
