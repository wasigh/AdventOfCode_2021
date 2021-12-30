const fs = require('fs')
const path = require('path');

class instruction
{

    constructor(bOn, minX, maxX, minY, maxY, minZ, maxZ)
    {
        this.on = bOn;
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
        this.minZ = minZ;
        this.maxZ = maxZ;
    }

    getState(current, x,y,z)
    {
        if (x >= this.minX && x <= this.maxX 
            && y >= this.minY && y <= this.maxY  
            && z >= this.minZ && z <= this.maxZ )
            {
                return this.on;
            }

        return current;
    }

    inRangeX(x)
    {
        return (x >= this.minX && x <= this.maxX);
    }

    inRangeY(y)
    {
        return (y >= this.minY && y <= this.maxY);
    }

    inRangeZ(z)
    {
        return (z >= this.minZ && z <= this.maxZ);
    }
}


try {
	const data = fs.readFileSync(path.dirname(__filename) + '/Day22/in.2.txt', 'utf8')
	var lIn = data.split("\n");

	
	var minX = 0;
    var maxX = 0;
    var minY = 0;
    var maxY = 0;
    var minZ = 0;
    var maxZ = 0;

    var instructions = [];

    for (var i =0; i < lIn.length; i++)
    {
        var line = lIn[i].trim();
        var firstSplit = line.split(" ");

        var bOn = firstSplit[0] == "on";
        var secondSplit = firstSplit[1];

        secondSplit = secondSplit.replace("x=", "");
        secondSplit = secondSplit.replace("y=", "");
        secondSplit = secondSplit.replace("z=", "");
        secondSplit = secondSplit.replace("..", ",");
        secondSplit = secondSplit.replace("..", ",");
        secondSplit = secondSplit.replace("..", ",");

        var parts = secondSplit.split(",").map((x) => parseInt(x));
        var x1 = parts[0];
        var x2 = parts[1];
        var y1 = parts[2];
        var y2 = parts[3];
        var z1 = parts[4];
        var z2 = parts[5];

        var instr = new instruction(bOn, x1,x2,y1,y2,z1,z2);
        instructions.push(instr);

        minX = Math.min(minX, x1);
        maxX = Math.max(maxX, x2);
        minY = Math.min(minY, y1);
        maxY = Math.max(maxY, y2);
        minZ = Math.min(minZ, z1);
        maxZ = Math.max(maxZ, z2);
    }



    // var minX = -50;
    // var maxX = 50;
    // var minY = -50;
    // var maxY = 50;
    // var minZ = -50;
    // var maxZ = 50;


    var state = false;
    var total = 0;

    var totalCalcSteps = (maxX - minX)
    console.log(totalCalcSteps);
    var steps = 0;

    for (var x = minX; x <= maxX; x++)
    {
        var mapX = instructions.filter((ins) => ins.inRangeX(x));
        steps++;
        
        console.log("Total steps", steps, totalCalcSteps, ((steps / totalCalcSteps) * 100) + "%");
       

        if (mapX.length)
        {
            var curMinY = mapX.map((a) => a.minY).reduce((prev, cur) => Math.min(prev,cur), Number.MAX_SAFE_INTEGER);
            var curMaxY = mapX.map((a) => a.maxY).reduce((prev, cur) => Math.max(prev,cur), Number.MIN_SAFE_INTEGER);

            for (var y= curMinY; y <= curMaxY; y++ )
            {
                var mapY = mapX.filter((ins) => ins.inRangeY(y));
                if (mapY.length == 1)
                {
                   if (mapY[0].on)
                   {
                       total += Math.abs(mapY[0].maxZ - mapY[0].minZ);
                   }     
                }
                else if (mapY.length)
                {
                    
                    var curMinZ = mapX.map((a) => a.minZ).reduce((prev, cur) => Math.min(prev,cur), Number.MAX_SAFE_INTEGER);
                    var curMaxZ = mapX.map((a) => a.maxZ).reduce((prev, cur) => Math.max(prev,cur), Number.MIN_SAFE_INTEGER);
                    
                    for (var z= curMinZ; z <= curMaxZ; z++ )
                    {
                        state = false;
                        for (var i = 0; i <mapY.length; i++)
                        {
                            state = mapY[i].getState(state,x,y,z);
                        }

                        if (state)
                        {
                            total++;
                        }
                    }
                }    
            }
        }
    }

    console.log(total);

} catch (err) {
	console.error(err)
}