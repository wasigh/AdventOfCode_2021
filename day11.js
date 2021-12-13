const fs = require('fs')
const path = require('path');
const { off } = require('process');




try {

    const data = fs.readFileSync(path.dirname(__filename) + '/Day11/in.txt', 'utf8')
    var lIn = data.split("\n");

    var cells = null;
    var columns = -1;
    var rows = lIn.length;

    function findIndex(row, column)
    {
        var r = row + 1;
        var column = column + 1;
        var index = (r * (columns + 2)) + column;
        return index;
    }


    for (var r = 0; r < lIn.length; r++) {
        var line = lIn[r].trim();
        if (cells == null)
        {
            columns = line.length;
            // generate a table with -1 at the borders to make neigbour searching easier
            cells = Array((columns + 2) * (rows + 2) ).fill(-1);
        }

        for (var c = 0; c < line.length; c++)
        {
            var index = findIndex(r, c);
            cells[index] = parseInt(line[c]);
        }
    }

    var step = 0;
    var finalStep  = 1000;
    var totalFlashes = 0;
    for (var step = 0; step < finalStep; step++)
    {
        var flashes = [];

        for (var row = 0; row < rows; row++ )
        {
            for(var col = 0; col < columns; col++)
            {
                var index = findIndex(row, col);
                var val = cells[index];
                val += 1;
                
                if (val > 9)
                {
                    cells[index] = 0;
                    flashes.push(index);
                }
                else
                {
                    cells[index] = val;
                }
            }
        }

        for (var f = 0; f < flashes.length;f++)
        {
            // add one to all surrounding cells
            // special case for zero the already flashed
            // special case for -1 = border
            // special case for > 9 also flashes and turns to zero
            // [ index - columns - 3 ] [ index - columns - 2] [index - columns - 3]
            // [ index - 1 ] [ index ] [ index + 1]
            // [ index + columns + 1 ] [ index + columns + 2] [index + columns + 3]

            var offset =  [ (-1 * columns) - 3, (-1 * columns) - 2, (-1 * columns) - 1,
                            -1, + 1,
                            columns + 1, columns + 2, columns + 3];

            var index = flashes[f];
            for(var sibling = 0; sibling < offset.length; sibling++)
            {
                var sibIndex = index + offset[sibling];
                var sibVal = cells[sibIndex];
                if (sibVal <= 0)
                    continue;
                
                sibVal++;
                if (sibVal > 9)
                {
                    sibVal = 0;
                    flashes.push(sibIndex);
                }
                cells[sibIndex] = sibVal;
            }
        }
        totalFlashes += flashes.length;
       // console.log(cells);

        if (flashes.length == (rows * columns))
            break;

    }


    console.log(totalFlashes);
    console.log("Final step: " + (step + 1));

    

} catch (err) {
    console.error(err)
}