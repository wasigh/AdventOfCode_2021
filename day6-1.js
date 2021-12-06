const fs = require('fs')
const path = require('path');
const { markAsUntransferable } = require('worker_threads');





try {
	const data = fs.readFileSync(path.dirname(__filename) + '/Day6/in.txt', 'utf8')
	var lIn = data.split(",").filter(Boolean).map(a => parseInt(a));

    var age = Array(9).fill(0);

    for (var i =0 ; i < lIn.length; i++)
    {
        var val = lIn[i];
        age[val] += 1;
    }   

    console.log(age);

    var days = 256;
    for (d = 0; d< days; d++)
    {
        var first = age.shift();
        age[6] += first;
        age[8] = first;

        console.log("Day " + (d + 1) + " -> " + age.reduce((a, b) => a + b, 0));
    }


} catch (err) {
	console.error(err)
}