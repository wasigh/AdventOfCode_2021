const { BADFLAGS } = require('dns');
const fs = require('fs')
const path = require('path');
const { memoryUsage } = require('process');

var pairs = [];

class Pair {
    constructor(input, output) {
        this.letters = Array();
        this.input = input;
        this.output = output;


        var inLetters = this.input + this.output;
        this.letters[0] = [];
        for (var i = 0; i < inLetters.length; i++) {
            var char = inLetters[i];
            if (this.letters[0][char]) {
                this.letters[0][char] += 1;
            }
            else {
                this.letters[0][char] = 1;
            }

        }
    }

    split(amount) {
        var split1 = this.input[0] + this.output;
        var split2 = this.output + this.input[1];

        if (split1 == split2) {
            throw error("wronggggg");
        }

        var splitted = {};
        splitted[split1] = amount;
        splitted[split2] = amount;

        return splitted;
    }
}


// bla()
// {
//     var result = Object.assign({}, obj1);
//         for (const key in obj2) {
//             if (Object.hasOwnProperty.call(obj2, key)) {
//                 const val = obj2[key];
//                 if (result[key])
//                 {
//                     result[key] += val;
//                 }
//                 else
//                 {
//                     result[key] = val; 
//                 }
//             }   
//         }   
// }

function merge(target, extra) {
    for (const key in extra) {
        if (Object.hasOwnProperty.call(extra, key)) {
            const val = extra[key];
            if (target[key]) {
                target[key] += val;
            }
            else {
                target[key] = val;
            }
        }
    }
}


try {
    const data = fs.readFileSync(path.dirname(__filename) + '/Day14/in.txt', 'utf8')

    var lIn = data.split("\n");

    var bParsingRules = false;
    var template = "";
    var rules = [];

    for (var i = 0; i < lIn.length; i++) {

        var line = lIn[i].trim();;
        if (line.length == 0) {
            bParsingRules = true;
        }
        else if (!bParsingRules) {
            template = line;
        }
        else {

            var splits = line.split(" -> ");
            var p = new Pair(splits[0], splits[1]);
            pairs[splits[0]] = p;
        }
    }

    console.log(template);


    var current = {};
    for (var i = 0; i < template.length - 1; i++) {
        var key = template.substring(i, i + 2);
        if (current[key]) {
            current[key] += 1;
        }
        else {
            current[key] = 1;
        }
    }



    console.log(pairs);
    console.log(current);

    for (var l = 0; l < 40; l++) {
        console.log("Loop " + l);
        var nCurrent = {};
        for (const key in current) {
            if (Object.hasOwnProperty.call(current, key)) {
                const amount = current[key];
                var splitted = pairs[key].split(amount);

                merge(nCurrent, splitted);
            }
        }
        current = nCurrent;
    }
    console.log(nCurrent);

    var lastChar = template[template.length - 1];
    var occurences = [];
    occurences[lastChar] = 1;
    for (const key in current) {
        if (Object.hasOwnProperty.call(current, key)) {
            const amount = current[key];
            
            var sPart1 = key[0];
            var sPart2 = key[1];
            count1 = {};
            count1[sPart1] = amount;
            //count2 = {};
            //count2[sPart2] = amount;
            merge(occurences, count1);
            //merge(occurences, count2);
        }
    }

    console.log(occurences);

    var min = Number.MAX_SAFE_INTEGER
    var max = Number.MIN_SAFE_INTEGER;

    for (const property in occurences) {
        var val =  occurences[property];

        min = Math.min(min, val);
        max = Math.max(max, val);
    }

    console.log(min, max, max - min);

} catch (err) {
    console.error(err)
}