const fs = require('fs')
const path = require('path');

try {

    const data = fs.readFileSync(path.dirname(__filename) + '/Day17/in.example.txt', 'utf8')
    

    var minX = 156;
    var maxX = 202;

    var minY = -69;
    var maxY = -110;

    // example
    // minX = 20;
    // maxX = 30;
    // minY = -5;
    // maxY = -10;

    var distances = [];
    var possibleX = [];
    for (var x = 1; x <= maxX; x ++ )
    {
        distances[x] = x;
    }


    var maxNrSteps = 0;
    var count = 0;
    for (var x = maxX; x > 0; x -- )
    {
        var total = distances[x];
        var step = 0;
        while(total <= maxX)
        {
            step++;
            total += distances[x - step];
            if (total >= minX)
            {
                if (possibleX.indexOf(x) < 0)
                {
                    possibleX.push(x);
                }
                maxNrSteps = Math.max(maxNrSteps, step + 1);
            }
        }
    }

    console.log(possibleX.join(","));
    console.log(maxNrSteps);
    
    
    var areaHeight = Math.abs(maxY + minY);
    var rangeYMax = areaHeight * maxNrSteps;
    var rangeYMin = maxY * 10;
    var maxHeight = 0;

    function calcHeight(x,y)
    {
        var curX = 0;
        var curY = 0;
        
        var velX = x;
        var velY = y;

        var maxHeight = 0;

        while(curX < minX || curY > minY )
        {
            curX += velX;
            curY += velY;

            if (curX <= maxX && curY >= minY)
            {
                maxHeight = Math.max(maxHeight, curY);
            }
            velX = Math.max(0, velX - 1);
            velY--;
        }

        if (curX <= maxX && curY >= maxY)
        {
            return maxHeight;
        }
        return Number.MAX_SAFE_INTEGER;
    }    


    
    for (var y = rangeYMin; y < rangeYMax; y++)
    {
        for (var i = 0; i < possibleX.length; i++)
        {
            var x = possibleX[i];
            //var x = i;    
            var height = calcHeight(x,y);
            
            if (height != Number.MAX_SAFE_INTEGER)
            {
                count++;
                console.log(x,y, height);
                maxHeight = Math.max(maxHeight, height);
            }
        }
    }

    console.log(count);
    console.log(maxHeight);
    return;

} catch (err) {
    console.error(err)
}