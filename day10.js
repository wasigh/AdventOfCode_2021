const fs = require('fs')
const path = require('path');

class Parser {
    correct = true;
    inCorrectPos = -1;
    inCorrectChar = '';
    stack = [];

    constructor(sLine) {
        this.line = sLine.trim();
        
        for (var i = 0; i < this.line.length; i++) {

            if (!this.correct)
                break;

            var char = this.line[i];

            switch (char) {
                case "{":
                case "[":
                case "<":
                case "(":
                    this.stack.push(char);
                    break;

                case "}":
                case "]":
                case ">":
                case ")":
                    if (! this.close(char))
                    {   
                        this.correct = false;
                        this.inCorrectChar = char;
                        this.inCorrectPos = i;
                    }
                    break;
                default:
                    this.correct = false;
                    this.inCorrectChar = char;
                    this.inCorrectPos = i;
            }

        }
    }

    close(char)
    {
        if (this.stack.length == 0)
            return false;
        
        var lastChar = this.stack.pop();
        if (lastChar == "{" && char != "}")
            return false;
        if (lastChar == "(" && char != ")")
            return false;
        if (lastChar == "<" && char != ">")
            return false;
        if (lastChar == "[" && char != "]")
            return false;

        return true;
        
    }

    calcCompleteScore()
    {
        var score = 0;
        while(this.stack.length > 0)
        {
            score = score * 5;
            var lastChar = this.stack.pop();
            switch(lastChar){
                case "{":
                    score += 3;
                    break;
                case "[":
                    score += 2;
                    break;
                case "<":
                    score += 4;
                    break;
                case "(":
                    score += 1;
                    break;
            }
        }

        return score;
    }

    isCorrect() {
        return this.correct;    
    }

    inCorrectPos() {
        return this.inCorrectPos;
    }

    inCorrectChar() {
        return this.inCorrectChar;s
    }

}


try {

    const data = fs.readFileSync(path.dirname(__filename) + '/Day10/in.txt', 'utf8')
    var lIn = data.split("\n");

    var total = 0;
    var scores = [];

    for (var i = 0; i < lIn.length; i++) {

        var row = lIn[i].trim();
        var parser = new Parser(row);

        if (!parser.isCorrect())
        {
            console.log("Line: " + i + " = incorrect: " + parser.inCorrectChar + " @ " + parser.inCorrectPos);


            if (parser.inCorrectChar == ")")
                total += 3;
                if (parser.inCorrectChar == "]")
                total += 57;
                if (parser.inCorrectChar == "}")
                total += 1197;
                if (parser.inCorrectChar == ">")
                total += 25137;
        }
        else{

            var completeScore = parser.calcCompleteScore();
            scores.push(completeScore);
            console.log("Line: " + i + " = correct: completeScore: " + completeScore);
        }
    }
    console.log("Part 1:" + total);

    scores.sort((a,b) => a-b);
    var index = (scores.length - 1) / 2 ;
    console.log("Part 2: " + scores[index]);
    

} catch (err) {
    console.error(err)
}