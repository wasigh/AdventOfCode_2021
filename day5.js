const fs = require('fs')
const path = require('path');

class Line{
    constructor(sLine)
    {
        sLine = sLine.replace("->", ",");
        var parts = sLine.split(",").filter(Boolean).map(a => parseInt(a));

        this.x1 = parts[0];
        this.y1 = parts[1];
        this.x2 = parts[2];
        this.y2 = parts[3];
    }


    maxX()
    {
        return Math.max(this.x1, this.x2);

    }

    maxY()
    {
        return Math.max(this.y1, this.y2);
    }

}

class table
{
    constructor(rows, columns)
    {
        this.data = Array(rows*columns).fill(0);
        this.rows = rows;
        this.columns = columns;
    }

    getIndex(r,c)
    {
        return (r * this.columns)+ c;
    }

    appendLine(line)
    {
        var xEq  = line.x1 == line.x2;
        var yEq = line.y1 == line.y2;
        if (!xEq && !yEq)
        {

            var steps = line.x1 > line.x2? line.x1 - line.x2: line.x2 - line.x1 ;
            steps++; //inclusive
            var xDir = line.x1 < line.x2 ? 1: -1;
            var yDir = line.y1 < line.y2 ? 1: -1;

            for (var i = 0; i <steps; i++)
            {
                var y = line.y1 + (yDir * i);
                var x = line.x1 + (xDir * i);

                var index = this.getIndex(y,x);
                this.data[index] = this.data[index] + 1;
            }
            return;
        }


        var minX = Math.min(line.x1, line.x2);
        var maxX = Math.max(line.x1, line.x2);
        var minY = Math.min(line.y1, line.y2);
        var maxY = Math.max(line.y1, line.y2);

        for (var x = minX; x <= maxX; x++)
        {
            for (var y = minY; y <= maxY; y++)
            {
                var index = this.getIndex(y,x);
                this.data[index] = this.data[index] + 1;
            }
        }
    }

    countCrosses()
        {
            var total = 0;
            for (var i = 0; i < this.data.length; i++)
            {
                var val = this.data[i];
                if (val > 1)
                    total++;
            }
            return total;
        };

    toString()
    {
        var s = "";

        for (var i = 0; i < this.data.length; i++)
        {
            var val = this.data[i];
            s += " " + val;
            
            if ((i + 1) % this.columns == 0 )
                s += "\n\r";
        }
        return s;
    }
}


try {
	const data = fs.readFileSync(path.dirname(__filename) + '/Day5/in.txt', 'utf8')
	var lIn = data.split("\n");

	var lines = [];
	for (var i =0; i < lIn.length; i++)
    {
        var line = new Line(lIn[i]);
        lines.push(line);
    }

    var maxCols = Math.max(... lines.map(l => l.maxX())) + 1;
    var maxRows = Math.max(... lines.map(l => l.maxY())) + 1; // zero included

    console.log(maxCols, maxRows);

    var t = new table(maxCols, maxRows);
    lines.forEach(l => {
        t.appendLine(l)
        //console.log(t.toString() + "\n\r");
    });

    //console.log(t.toString());
    console.log("Answer: ", t.countCrosses());

} catch (err) {
	console.error(err)
}