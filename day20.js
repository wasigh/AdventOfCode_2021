
const fs = require('fs')
const path = require('path');

var outsideChar = "."

function getValue(image, row, column) {
    if (row < 0 || row >= image.length)
        return outsideChar;  // Get correct val here

    if (column < 0 || column >= image[0].length)
        return outsideChar;

    return image[row][column];
}

function calcCell(image, dRow, dCol)
{
    var a = getValue(image, dRow - 1, dCol - 1);
    var b = getValue(image, dRow - 1, dCol);
    var c = getValue(image, dRow - 1, dCol + 1);
    var d = getValue(image, dRow, dCol - 1);
    var e = getValue(image, dRow, dCol);
    var f = getValue(image, dRow, dCol + 1);
    var g = getValue(image, dRow + 1, dCol - 1);
    var h = getValue(image, dRow + 1, dCol);
    var i = getValue(image, dRow + 1, dCol + 1);

    var binary = a == "#" ? "1" : "0";
    binary += b == "#" ? "1" : "0";
    binary += c == "#" ? "1" : "0";
    binary += d == "#" ? "1" : "0";
    binary += e == "#" ? "1" : "0";
    binary += f == "#" ? "1" : "0";
    binary += g == "#" ? "1" : "0";
    binary += h == "#" ? "1" : "0";
    binary += i == "#" ? "1" : "0";

    var dec = parseInt(binary, 2);
    var val = mapping[dec];
    return val;
}


function nextGen(image, mapping) {
    var columns = image[0].length;
    var rows = image.length;
    var newColumns = columns + 2;
    var newRows = rows + 2;

    var newImage = [];

    for (var row = 0; row < newRows; row++) {
        newImage[row] = "";
        for (var col = 0; col < newColumns; col++) {

            var dRow = row -1;
            var dCol = col -1;

            val = calcCell(image, dRow, dCol);
            newImage[row] += val;
        }
    }
    return newImage;
}

try {
    const data = fs.readFileSync(path.dirname(__filename) + '/Day20/in.txt', 'utf8')
    var lIn = data.split("\n");

    var mapping = lIn[0].trim();
    var image = [];

    for (var i = 1; i < lIn.length; i++) {
        var line = lIn[i].trim();
        if (line.length == 0)
            continue;

        image.push(line);
    }

    for (var runs = 0; runs < 50; runs++)
    {
        image = nextGen(image, mapping);
        outsideChar = calcCell(image, -10000,-10000);
    }

    var count = 0;
    for (var i = 0; i < image.length; i++)
    {
        for (var j = 0; j < image[i].length; j++)
        {
            if (image[i][j] == "#")
                count ++;
        }   
    }

    console.log(count);

} catch (err) {
    console.error(err)
}