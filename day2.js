const fs = require('fs')
const path = require('path');

const { MoveInstruction, Position } = require('./classes/MoveInstruction.js');

try {
	const data = fs.readFileSync(path.dirname(__filename) + '/Day2/in.txt', 'utf8')
	var lIn = data.split("\n");

	
	var startPos = new Position(0,0);
    for (var i =0; i < lIn.length; i++)
    {
        var instruction = new MoveInstruction(lIn[i]);
        startPos = instruction.execute(startPos);
    }

    console.log(startPos.product());


} catch (err) {
	console.error(err)
}