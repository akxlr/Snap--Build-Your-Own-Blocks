Process.prototype.doBreakpoint = function (process) {
    var process = this;
    process.doPauseAll();
    console.log('break', process);

    process.context.variables.allNames().forEach(function (name) {
        console.log(name, '=>', process.context.variables.getVar(name));
    });

    nicsglobalvar2 = new Debugger(process);

};

Process.prototype.clearWatchers = function (process) {
    var process = this;

    if (process.context.receiver instanceof StageMorph) {
        var watchers = process.context.receiver.children.filter(function (child) {
            return (child instanceof WatcherMorph);
        });
        watchers.map(function (x) { x.destroy(); });
    }
}
