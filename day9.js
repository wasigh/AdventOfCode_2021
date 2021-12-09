const fs = require('fs')
const path = require('path');


class Basin {


}

try {


    function findIndex(r, c) {
        return (r * columns) + c;
    }


    const data = fs.readFileSync(path.dirname(__filename) + '/Day9/in.txt', 'utf8')
    var lIn = data.split("\n");

    var columns = 0;
    var rows = 0;
    var map = Array();
    for (var i = 0; i < lIn.length; i++) {
        rows++;
        var row = lIn[i].trim();
        columns = row.length;

        for (var c = 0; c < columns; c++) {
            map.push(parseInt(row[c]));
        }
    }

    console.log(map);

    var lowPoints = Array();

    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < columns; c++) {
            var index = findIndex(r, c);
            var curVal = map[index];

            var neigbours = [];
            if (r > 0) {
                neigbours.push(map[findIndex(r - 1, c)])
            }
            if (r < (rows - 1)) {
                neigbours.push(map[findIndex(r + 1, c)])
            }
            if (c > 0) {
                neigbours.push(map[findIndex(r, c - 1)])
            }
            if (c < (columns - 1)) {
                neigbours.push(map[findIndex(r, c + 1)])
            }

            var minVal = Math.min(...neigbours);
            if (curVal < minVal)
                lowPoints.push(index);
        }
    }

    console.log(lowPoints);

    var basin = Array(rows * columns).fill(-1);
    var total = 0;
    for (var p = 0; p < lowPoints.length; p++) {
        var index = lowPoints[p];
        total += map[index] + 1;

        basin[index] = p;
    }

    console.log(total);
    console.log(basin);

    // Loop through all to find neightbous
    for (var n = 1; n < 9; n++) {
        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < columns; c++) {
                var index = findIndex(r, c);
                var curVal = map[index];

                if (basin[index] > -1)
                    continue;

                if (curVal != n)
                    continue;

                var neigbours = [];
                if (r > 0) {
                    neigbours.push(findIndex(r - 1, c))
                }
                if (r < (rows - 1)) {
                    neigbours.push(findIndex(r + 1, c))
                }
                if (c > 0) {
                    neigbours.push(findIndex(r, c - 1))
                }
                if (c < (columns - 1)) {
                    neigbours.push(findIndex(r, c + 1))
                }

                for (var nb = 0; nb < neigbours.length; nb++) {
                    var neigbour = neigbours[nb];
                    var nVal = map[neigbour];
                    if (nVal < curVal) {
                        basin[index] = basin[neigbour];
                    }
                }
            }
        }

        
    }

    var sizes = Array(lowPoints.length).fill(0);
    for (var z = 0; z < basin.length; z++)
        {
            var val = basin[z];
            if (val > -1)
                sizes[val] += 1;
        }
        console.log(sizes);

    sizes.sort((a, b) => b - a);

    var total = 1;
    for (var i = 0; i < 3; i++)
    {
        total *= sizes[i];
    }

    console.log(total);

} catch (err) {
    console.error(err)
}