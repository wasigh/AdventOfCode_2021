const fs = require('fs')
const path = require('path');
const ListCounter = require('./Classes/ListCounter.js')


try {
  const data = fs.readFileSync(path.dirname(__filename) + '/Day1/in1.txt', 'utf8')
  var lIn = data.split("\n");
    
    var counter = new ListCounter();
    bigger = counter.increased(lIn)

    console.log("Bigger:" + bigger);

} catch (err) {
  console.error(err)
}