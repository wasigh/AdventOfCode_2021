const fs = require('fs')
const path = require('path');
const { markAsUntransferable } = require('worker_threads');





try {
	const data = fs.readFileSync(path.dirname(__filename) + '/Day7/in.txt', 'utf8')
	var lIn = data.split(",").filter(Boolean).map(a => parseInt(a));

    var max = Math.max(... lIn);

    var spread = Array(max + 1).fill(0);
    var fuelToPos =  Array(max + 1).fill(0);

    var  fuelTable = Array(max + 1).fill(0);
    for (var t= 1; t < fuelTable.length; t++)
    {
        fuelTable[t] = fuelTable[t - 1] + t;
    }
    
    console.log(fuelTable);

    for (var i =0 ; i < lIn.length; i++)
    {
        var val = lIn[i];
        spread[val] += 1;
    }   

    console.log(spread);

    for(var i = 0; i < spread.length; i++)
    {
        for (var f = 0; f < fuelToPos.length; f++)
        {
            var nrFish = spread[i];
            var distance = Math.abs(i - f);
            var fuelUsed = fuelTable[distance];
            var fuel = nrFish * fuelUsed;

            fuelToPos[f] += fuel;
        }
    }

    console.log(fuelToPos);
    var minFuel = Math.min(... fuelToPos);
    console.log("maxFuel", minFuel);


} catch (err) {
	console.error(err)
}