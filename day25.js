const fs = require('fs')
const path = require('path');

class Map {



    rowCount = 0;
    columnCount = 0;
    currentRow = 0;


    constructor(rows, cols) {
        this.rowCount = rows;
        this.columnCount = cols;
        this.aNumbers = new Array(this.rowCount * this.columnCount).fill(".");
    }

    addLine(sLine) {
        var values = sLine.split("").filter(Boolean);
        for (var i = 0; i < values.length; i++) {
            var index = this.getIndex(this.currentRow, i);
            this.aNumbers[index] = values[i];
        }
        this.currentRow++;
    }


    getIndex(row, column) {
        row = row % this.rowCount;
        column = column % this.columnCount;

        return (row * this.columnCount) + column;
    }


    nextGen() {

        var newNumbers = new Array(this.rowCount * this.columnCount).fill(".");

        moves = 0;
        // first the rows
        for (var r = 0; r < this.rowCount; r++) {
            for (var c = 0; c < this.columnCount; c++) {
                var index = this.getIndex(r, c);
                var nextIndex = this.getIndex(r, c + 1);

                if (this.aNumbers[index] == ">" && this.aNumbers[nextIndex] == ".") {
                    newNumbers[index] = ".";
                    newNumbers[nextIndex] = ">";
                    moves++;
                    c++;
                }
                else
                {
                    newNumbers[index] = this.aNumbers[index];
                }
            }
        }

        // first the rows

        for (var c = 0; c < this.columnCount; c++) {
            for (var r = 0; r < this.rowCount; r++) {
                var index = this.getIndex(r, c);
                var nextIndex = this.getIndex(r + 1, c);

                if (this.aNumbers[index] == "v" && this.aNumbers[nextIndex] != "v" && newNumbers[nextIndex] == ".") {
                    newNumbers[index] = ".";
                    newNumbers[nextIndex] = "v";
                    moves++;
                    r++;
                }
            }
        }

        this.aNumbers = newNumbers;
        return moves;
    }

    toString() {
        var str = "";
        for (var r = 0; r < this.rowCount; r++) {
            for (var c = 0; c < this.columnCount; c++) {

                var index = this.getIndex(r, c);

                str += this.aNumbers[index];

            }
            str += "\n\r";
        }
        return str;
    }

}

try {
    const data = fs.readFileSync(path.dirname(__filename) + '/Day25/in.txt', 'utf8')
    var lIn = data.split("\n");

    var rows = lIn.length;
    var cols = lIn[0].trim().length;

    var map = new Map(rows, cols);

    for (var i = 0; i < lIn.length; i++) {
        var sLine = lIn[i].trim();
        map.addLine(sLine);
    }

    console.log(map.toString());

    var moves = 0;
    var steps = 0;
    do {


        console.log("Moving step: ", steps)
        moves = map.nextGen();
        steps++;

        if (steps < 5) {
            console.log(map.toString());
        }
    } while (moves > 0)

    console.log(steps);

} catch (err) {
    console.error(err)
}