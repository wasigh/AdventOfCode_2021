const fs = require('fs')
const path = require('path');
const { markAsUntransferable } = require('worker_threads');

class Fish
{

    constructor(live)
    {
        this.live = live;
    }

    nextDay()
    {
        this.live -= 1;
        if (this.live < 0)
        {
            this.live = 6;
            return new Fish(8);
        }

        return null;
    }

    toString()
    {
        return this.live.toString();
    }
}

class FishLife
{
    

    fillData(startPos, days, data)
    {
                
        // add fish every 7 days
        for (var i = startPos; i < days; i += 7)
        {
            data[i + 1] = data[i + 1] + 1;
            
            var newFish = i + 9;
            this.fillData(newFish, days, data);
        }
        return data;
    }

}


try {
	const data = fs.readFileSync(path.dirname(__filename) + '/Day6/in.txt', 'utf8')
	var lIn = data.split(",").filter(Boolean).map(a => parseInt(a));

    var fishSet = Array(8);
    var days= 258;
    var l1 = new FishLife();
    for(let h = 0; h < fishSet.length; h++)
    {
        console.log("Creating ", h);
        var fdata = Array(days + 1).fill(0);
        fdata[0] = 1;
        var resultData = l1.fillData(h,days,fdata);
        fishSet[h] = fdata;
    }


    console.log(fishSet[4]);

    
    for (var d = 1; d <= 256; d++)
    {
        total = 0;
        for (var i =0; i < lIn.length; i++)
        {
            var startFish = lIn[i];
            var val = fishSet[startFish]
            
            var subArray = val.slice(0, d + 1);
            var subTotal = 0;

            for (var l = 0; l < subArray.length; l++)
            {
                subTotal += subArray[l];
            }

            total += subTotal;
        }
        console.log("Day: ", d, "fish, "+ total);
    }

    

} catch (err) {
	console.error(err)
}