const fs = require('fs')
const path = require('path');

class Bingo {

    rowCount = 5;
    columnCount = 5;

    currentRow = 0;

    constructor() {
        this.aNumbers = new Array(this.rowCount * this.columnCount).fill(-1);
    }

    addLine(sLine) {
        var values = sLine.split(' ').filter(Boolean);
        for (var i = 0; i < values.length; i++) {
            var index = this.getIndex(this.currentRow, i);
            this.aNumbers[index] = parseInt(values[i]);
        }
        this.currentRow++;
    }

    markNumber(nr) {
        for (var r = 0; r < this.rowCount; r++) {
            for (var c = 0; c < this.columnCount; c++) {
                var index = this.getIndex(r, c);
                if (this.aNumbers[index] == nr) {
                    this.aNumbers[index] = -1;
                }
            }
        }
    }

    hasBingo() {
        var bingo = false;
        for (var r = 0; r < this.rowCount; r++) {
            bingo = bingo | this.getRowBingo(r);
        }

        for (var c = 0; c < this.rowCount; c++) {
            bingo = bingo | this.getColumnBingo(c);
        }
        return bingo;
    }

    getColumnBingo(nr) {
        var bingo = true
        for (i = 0; i < this.rowCount; i++) {
            var index = this.getIndex(i, nr);
            var val = this.aNumbers[index];
            bingo = bingo && val == -1;

            if (!bingo)
                break;
        }
        return bingo
    }

    getRowBingo(nr) {
        var bingo = true
        for (i = 0; i < this.columnCount; i++) {
            var index = this.getIndex(nr, i);
            var val = this.aNumbers[index];
            bingo = bingo && val == -1;

            if (!bingo)
                break;
        }
        return bingo
    }

    getColumnTotal(nr) {
        var total = 0
        for (i = 0; i < this.rowCount; i++) {
            var index = this.getIndex(i, nr);
            var val = this.aNumbers[index];
            total += math.max(val, 0);
        }
        return total
    }

    getRowTotal(nr) {
        var total = 0
        for (i = 0; i < this.columnCount; i++) {
            var index = this.getIndex(nr, i);
            var val = this.aNumbers[index];
            total += math.max(val, 0);
        }
        return total
    }

    getIndex(row, column) {
        return (row * this.columnCount) + column;
    }

    getBoardScore() {
        var total = 0;
        for (var i = 0; i < this.aNumbers.length; i++) {
            var val = this.aNumbers[i];
            val = Math.max(val, 0); // ignore negative
            total += val;
        }

        return total;
    }
}

try {
    const data = fs.readFileSync(path.dirname(__filename) + '/Day4/in.txt', 'utf8')
    var lIn = data.split("\n");


    var numbers = lIn[0].split(",").map((a) => parseInt(a));

    var currBingo = null;
    var allCards = []
    for (var i = 1; i < lIn.length; i++) {
        var sLine = lIn[i].trim();
        if (sLine.length == 0) {
            currBingo = new Bingo();
            allCards.push(currBingo);
        }
        else {
            currBingo.addLine(sLine);
        }
    }

    //   console.log(allCards);

    var bingoCard = null;
    var num = -1;

    for (var x = 0; x < numbers.length; x++) {
        
        num = numbers[x];

        console.log("checking nr", num);

        if (allCards.length == 1) {
            var c = allCards[0];
            c.markNumber(num);
            if (c.hasBingo()) {
                bingoCard = c;
                break;
            }
        }
        else {

            if (bingoCard != null)
                break;

            
            allCards = allCards.filter(c => {
                c.markNumber(num);

                if (c.hasBingo()) {
                    //bingoCard = c;
                    //return false;
                    return false
                }
                return true;
            });
        }
    }

    console.log("Bingo with number: ", num, bingoCard.getBoardScore());
    console.log("Answer: ", num * bingoCard.getBoardScore());


} catch (err) {
    console.error(err)
}