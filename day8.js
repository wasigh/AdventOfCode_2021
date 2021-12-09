const { Console } = require('console');
const fs = require('fs');
const path = require('path');

function findNumber(sInput) {
    var l = sInput.length;

    if (l == 2)
        return 1;
    if (l == 4)
        return 4;
    if (l == 3)
        return 7;
    if (l == 7)
        return 8;

    return 0;
}

class Line {
    sets = Array(10);

    constructor(input, result) {

        this.result = result.split(" ").filter(Boolean);
        this.inputs = input.split(" ").filter(Boolean);

        // setup knowns
        for (var i = 0; i < this.inputs.length; i++) {
            var sInput = this.inputs[i].trim();
            var number = findNumber(sInput);
            if (number > 0) {
                this.sets[number] = sInput;
            }
        }

        var val1 = this.sets[1];
        var val4 = this.sets[4];
        this.hook4 = "";
        for (var h = 0; h < val4.length; h++) {
            var c = val4[h];
            if (val1.indexOf(c) < 0) {
                this.hook4 += c;
            }
        }

        for (var i = 0; i < this.result.length; i++) {
            var sInput = this.result[i].trim();
            var number = findNumber(sInput);
            if (number > 0) {
                this.sets[number] = sInput;
            }
        }

        for (var i = 0; i < this.inputs.length; i++) {
            var sInput = this.inputs[i].trim();
            var entry = new LineEntry(sInput);

            var val = entry.findValue(this);
            this.sets[val] = sInput;
        }
    }


    calcResult() {
        var total = "";
        for (var i = 0; i < this.result.length; i++) {
            var sInput = this.result[i].trim();
            var entry = new LineEntry(sInput);

            var val = entry.findValue(this);
            total += val;


        }
        return parseInt(total);
    }

    contains1(sIn) {
        return this.contains(sIn, this.sets[1]);
    }

    contains4(sIn) {
        return this.contains(sIn, this.sets[4]);
    }

    contains4Hook(sIn) {
        return this.contains(sIn, this.hook4);
    }

    contains7(sIn) {
        return this.contains(sIn, this.sets[7]);
    }

    contains8(sIn) {
        return this.contains(sIn, this.sets[8]);
    }

    contains(sIn, sCompare) {
        var bContains = true;
        for (var i = 0; i < sCompare.length; i++) {
            var char = sCompare[i];
            var has = sIn.indexOf(char) > -1;
            bContains &= has;
        }

        return bContains;
    }



}


class LineEntry {
    constructor(entry) {
        this.entry = entry;
    }

    sortedEntry() {
        return this.entry;
    }

    findValue(line) {
        var val = findNumber(this.entry);
        if (val > 0)
            return val;

        if (this.entry.length == 5) {
            if (line.contains1(this.entry))
                return 3;
            if (line.contains4Hook(this.entry))
                return 5;
            else
                return 2;
        }

        if (this.entry.length == 6) {
            if (line.contains1(this.entry) && !line.contains4(this.entry))
                return 0;
            if (line.contains1(this.entry) && line.contains4(this.entry))
                return 9;
            else
                return 6;
        }
    }


}



try {

    const data = fs.readFileSync(path.dirname(__filename) + '/Day8/in.txt', 'utf8')

    var lIn = data.split("\n")
    var total = 0;


    for (var i = 0; i < lIn.length; i++) {
        var line = lIn[i];

        var parts = line.split("|");
        var aa = new Line(parts[0], parts[1]);
        var number = aa.calcResult();
        total += number;
        console.log("Line: " + i + ":" + number);
    }

    console.log(total);

} catch (err) {
    console.error(err)
}