const fs = require('fs')
const path = require('path');
const ListCounter = require('./Classes/ListCounter.js')
const ItemGrouper = require('./Classes/ItemGrouper.js')


try {
    const data = fs.readFileSync(path.dirname(__filename) + '/Day1/in1.txt', 'utf8')
    var lIn = data.split("\n");
    
    console.log(lIn);

    var grouper = new ItemGrouper();
    var lGrouped = grouper.map(lIn);

    console.log(lGrouped);

    var counter = new ListCounter();
    bigger = counter.increased(lGrouped);

    console.log("Bigger:" + bigger);

} catch (err) {
  console.error(err)
}