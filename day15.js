const fs = require('fs')
const path = require('path');

var columns = -1;
var rows = -1;
var toVisit = [];

function insertToVisit(cell) {
    // insertion sort
    var cellCost = cell.cost;
    let i = 0;
    for (; i < toVisit.length; i++) {
        var curCell = toVisit[i];
        var curCellCost = curCell.cost;

        if (cellCost < curCellCost)
            break;
    }
    toVisit = [].concat(toVisit.slice(0, i), cell, toVisit.slice(i));

}


class Cell {

    constructor(index, cost) {
        this.index = index;
        this.cost = cost;
    }

    visitNeighbours() {
        //     .. [index - columns - 2 ] ..
        // [index - 1]  [index]  [index +1]
        //     .. [index + columns + 2 ] ..
        // start bij het beginpint
        // vind de buren
        var neighbours = [this.index - columns - 2, this.index - 1, this.index + 1, this.index + columns + 2];

        // bereken de afstand totaan de buren en zet deze in een lijst om te bezoeken
        for (var k = 0; k < neighbours.length; k++) {
            var nIndex = neighbours[k];
            var val = cells[nIndex];
            if (val == -1)
                continue;

            // als de buren al een afstand hebben en deze is lager update dan niet.
            var risk = risks[nIndex];
            var newRisk = this.cost + val;

            if (risk == -1 || newRisk < risk) {
                risks[nIndex] = newRisk;
                insertToVisit(new Cell(nIndex, newRisk));
            }
        }


        // sorteer de lijst met te bezoeken buren op de gene met de laagste score
        // herhaal proces
        //
    }
};


function findIndex(row, column) {
    var r = row + 1;
    var column = column + 1;
    var index = (r * (columns + 2)) + column;
    return index;
}

function printArray(data)
{
    var s = "";
    for (var i = 0; i < data.length;i++)
    {

        s += data[i] == -1? "*":data[i] ;

        if (i != 0 && i % (columns + 2) == 0)
        {
            s += "\n\r";
        }
    }
    return s;
}


try {

    const data = fs.readFileSync(path.dirname(__filename) + '/Day15/in.txt', 'utf8')
    var lIn = data.split("\n");

    var cells = null;
    columns = -1;
    originalColumns = -1;
    originalRows = lIn.length ;
    rows = originalRows * 5

    for (var r = 0; r < lIn.length; r++) {
        var line = lIn[r].trim();
        if (cells == null) {

            originalColumns = line.length;
            columns = originalColumns * 5;
            // generate a table with -1 at the borders to make neigbour searching easier
            cells = Array((columns + 2) * (rows + 2)).fill(-1);
        }

        for (var c = 0; c < line.length; c++) {
            
            var val = parseInt(line[c]);

            for (dc = 0; dc < 5; dc ++)
            {
               for (dr = 0; dr < 5; dr ++)
               {
                   var row = r + (dr * originalRows);
                   var col = c + (dc * originalColumns);
                   var index = findIndex(row, col);

                   var calcVal = (val + dr + dc);
                   while(calcVal > 9)
                   {
                       calcVal -= 9;
                   }
                   cells[index] = calcVal; 
               }     
            }
        }
    }

    var risks = Array(cells.length).fill(-1);
    var toVisit = [];

    //console.log(printArray(cells));

    var finalCell = findIndex(rows - 1, columns - 1);
    var firstCell = new Cell(findIndex(0, 0), 0);
    insertToVisit(firstCell);

    while (risks[finalCell] == -1) {
        var cell = toVisit.shift();
        cell.visitNeighbours();

        console.log("Check Length:", toVisit.length);
    }

    console.log(risks[finalCell]);

    return;



} catch (err) {
    console.error(err)
}