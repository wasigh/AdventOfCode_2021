const fs = require('fs')
const path = require('path');


function process(sLine) {
    var nestLevel = 0;
    var reduced = [];
    var lastNumberPos = -1
    var parsedNumber = -1;
    var numberSaved = -1;
    var exploded = false;
    for (var i = 0; i < sLine.length; i++) {
        var char = sLine[i];
        switch (char) {
            case "[":

                if (nestLevel == 4 && !exploded) {
                    // explode!
                    exploded = true;
                    var posClose = sLine.indexOf("]", i);
                    var subStr = sLine.substring(i + 1, posClose);
                    var values = subStr.split(",").map((a) => parseInt(a));

                    if (lastNumberPos > -1) {
                        reduced[lastNumberPos] += values[0];
                    }
                    numberSaved = values[1];
                    // update i as we already parsed a couple of things
                    i += (subStr.length + 1);
                    reduced.push(0);
                }
                else {
                    nestLevel += 1;
                    reduced.push("[");
                }
                break;
            case "]":
                if (parsedNumber >= 0) {
                    if (numberSaved > -1) {
                        parsedNumber += numberSaved;
                        numberSaved = -1;
                    }
                    reduced.push(parsedNumber);
                    parsedNumber = -1;
                }
                nestLevel -= 1;
                reduced.push("]");
                break;
            case ",":

                if (parsedNumber >= 0) {
                    if (numberSaved > -1) {
                        parsedNumber += numberSaved;
                        numberSaved = -1;
                    }
                    reduced.push(parsedNumber);
                    parsedNumber = -1;
                }


                reduced.push(",");

                break;
            default:

                if (parsedNumber == -1) {
                    lastNumberPos = reduced.length;
                    parsedNumber = 0;
                }

                parsedNumber *= 10;
                parsedNumber += parseInt(char);
        }

    }


    var splitted = false
    if (!exploded) {
        // try splits
        for (var i = 0; i < reduced.length; i++) {
            var val = reduced[i];
            if (val >= 10) {
                // split!

                var insert = ["[", Math.floor(val / 2), ",", Math.ceil(val / 2), "]"];
                reduced.splice(i, 1, ...insert);
                splitted = true;
                break;
            }
        }
    }

    var sResult = reduced.join("");
    //console.log(sResult);
    if (exploded || splitted)
        return process(sResult);

    return reduced;
}

class Pair
{
    left = null;
    right = null;

    value()
    {
        return (3* this.getLeftValue()) + (2 * this.getRightValue());
    }

    getRightValue()
    {
        if (typeof this.right !== "object")
            return this.right;
        else 
            return this.right.value();
    }

    getLeftValue()
    {
        if (typeof this.left !== "object")
            return this.left;
        else 
            return this.left.value();
    }

    add(value)
    {
        if (this.left == null)
            this.left = value;
        else   
            this.right = value;
    }
}

function magnitude(reduced)
{
    var currentPair = null
    var pairs = [];
    
    for (var i = 0; i < reduced.length - 1; i++) {
        var char = reduced[i];
        switch (char) {
            case "[":
                var newPair = new Pair();
                if (currentPair != null)
                {
                    currentPair.add(newPair);
                }    
                currentPair = newPair;
                pairs.push(newPair);
                break;
            case "]":
                pairs.pop();

                currentPair = pairs[pairs.length - 1];
                break;
            case ",":
                break;
            default:
                if (currentPair)
                    currentPair.add(char);
        }
    }

    return pairs[0].value();
}

try {

    const data = fs.readFileSync(path.dirname(__filename) + '/Day18/in.txt', 'utf8')
    var lIn = data.split("\n");

    var start = lIn[0].trim();
    var result = 0;

    // for (var i = 1; i < lIn.length; i++) {
    //     var sLine = lIn[i].trim();
    //     var sum = "[" + start + "," + sLine + "]";
    //     result = process(sum);
    //     start = result.join("");
    // }

    var top = -1;

    for (var i = 0; i < lIn.length; i++) {
        for (var j = 0 ; j < lIn.length; j++) {

            if (i == j)
                continue;
            console.log("testing combo:", i, j);
            var first = lIn[i].trim();
            var second = lIn[j].trim();
            var sum = "[" + first + "," + second + "]";
            result = process(sum);
            var score = magnitude(result);
            console.log("testing combo:", i, j, score);
            top = Math.max(top, score);
        }
    }

    // console.log("Result", result.join(""));
    // console.log("Sum", magnitude(result));
    console.log("Top", top);

} catch (err) {
    console.error(err)
}