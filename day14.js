const fs = require('fs')
const path = require('path');




try {
	const data = fs.readFileSync(path.dirname(__filename) + '/Day14/in.example.txt', 'utf8')
	
    var lIn = data.split("\n");

    var bParsingRules = false;
    var template = "";
    var rules = [];
    for (var i = 0; i < lIn.length; i++) {

        var line = lIn[i].trim();;
        if (line.length == 0)
        {
            bParsingRules = true;
        }
        else if (!bParsingRules)
        {
            template = line;
        }
        else{

            var splits = line.split(" -> ");
            rules[splits[0]] = splits[1];
        }
    }

    console.log(template);
    console.log(rules);

    var steps = 1;
    var totalSteps = 40;

    for (steps = 1; steps <= totalSteps; steps++)
    {
        var newTemplate = "";

        for (var i = 0; i < template.length - 1; i++)
        {
            newTemplate += template[i];
            var match = template[i] + template[i + 1];
            var insert = rules[match];
            newTemplate += insert;
        }
        newTemplate += template[template.length - 1];

        template = newTemplate;
        console.log("After step " + steps);
    }

    var counts = [];
    for (var pos = 0; pos < template.length; pos++)
    {
        var char = template[pos];
        var val = counts[char] || 0;
        counts[char] = val + 1;
    }

    
    var min = Number.MAX_SAFE_INTEGER
    var max = Number.MIN_SAFE_INTEGER;

    for (const property in counts) {
        var val =  counts[property];

        min = Math.min(min, val);
        max = Math.max(max, val);
    }

    console.log(min, max, max - min);

} catch (err) {
	console.error(err)
}