const fs = require('fs')
const path = require('path');

class Table
{
    constructor (rows, cols)
    {
        this.rows = rows;
        this.cols = cols;

        this.data = Array(rows * cols).fill(0);
    }

    getIndex(row, col)
    {
        return (row * this.cols) + col;
    }

    foldX(x)
    {
        var newRows = this.rows;
        var newCols = x;
        var t = new Table(newRows, newCols);
        for (var r = 0; r < newRows; r++)
        {
            for (var c = 0; c < newCols; c++)
            {
                var val = this.data[this.getIndex(r,c)];
                var foldCol = (2 * x) - c;
                val += this.data[this.getIndex(r, foldCol)];
                t.data[t.getIndex(r,c)] = val > 0 ? 1: 0;
            }
        }

        return t;
    }

    foldY(y)
    {
        var newRows = y;
        var newCols = this.cols;
        var t = new Table(newRows, newCols);
        for (var r = 0; r < newRows; r++)
        {
            for (var c = 0; c < newCols; c++)
            {
                var ind0 = this.getIndex(r,c);
                var foldRow = (2 * y) - r;
                var ind1  = this.getIndex(foldRow, c);

                var val = this.data[ind0];
                val += this.data[ind1];

                t.data[t.getIndex(r,c)] = val > 0 ? 1: 0;
            }
        }

        return t;
    }

    toString()
    {
        var s = "";
        for (var r = 0; r < this.rows; r++)
        {
            for (var c = 0; c < this.cols; c++)
            {
                s += this.data[this.getIndex(r, c)] > 0? "*": " ";
            }   
            s += "\n\r";
        }
        return s;
    }

    dots()
    {
        return this.data.reduce((prev, cur) => cur > 0? prev + 1: prev, 0);
    }
}


try {
	const data = fs.readFileSync(path.dirname(__filename) + '/Day13/in.txt', 'utf8')
	
    var lIn = data.split("\n");

    var folds = [];
    var cords = [];
    var bParsingFolds = false;

    for (var i = 0; i < lIn.length; i++) {

        var line= lIn[i].trim();
        if (line.length == 0)
        {
            bParsingFolds = true;
        }
        else if (bParsingFolds)
        {
            folds.push(line);
        }
        else{
            var cord = line.split(",").map((a) => parseInt(a));
            cords.push(cord);
        }
    }
    
    var maxRows = cords.map((a) => a[1]).reduce((prev, cur) => Math.max(prev, cur)) + 1;
    var maxCols = cords.map((a) => a[0]).reduce((prev, cur) => Math.max(prev, cur)) + 1;

    console.log(maxRows, maxCols);

    var table = new Table(maxRows, maxCols);
    for (var c = 0; c < cords.length; c++)
    {
        var cord = cords[c];
        var col = cord[0];
        var row = cord[1];

        table.data[table.getIndex(row, col)] = 1;
    }
    

    for(var f = 0; f < folds.length; f++)
    {
        var foldLine = folds[f];

        if (foldLine.startsWith("fold along x="))
        {
            var param = parseInt(foldLine.split("=")[1]);
            table = table.foldX(param);
        }
        else if (foldLine.startsWith("fold along y="))
        {
            var param = parseInt(foldLine.split("=")[1]);
            table = table.foldY(param);
        }

        console.log("Dots after " + f + ": " + table.dots());
        //console.log(table.toString());
    }

    console.log(table.toString());
    
} catch (err) {
	console.error(err)
}