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
