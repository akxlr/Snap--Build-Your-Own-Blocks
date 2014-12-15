
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
    highlight.setExtent(fb.extent().add(edge * 2));
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

    // traverse the context tree
    // add error highlight to expression of root
    var t = this.context,
        t1;

    while (t != null) {
        t1 = t;
        t = t.parentContext;
    }
    t1.expression.addErrorHighlight();

    //console.log(this.context);
    //console.log(this, error.name, error.message);
    
    console.log("Error in block (", m.blockSpec, "): ", error.name, error.message);

    if (isNil(m) || isNil(m.world())) {m = this.topBlock; }
    m.showBubble(
        (m === element ? '' : 'Inside: ')
            + error.name
            + '\n'
            + error.message
    );
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
        throw {name: "reportListItemError", message: "list is null"};
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
