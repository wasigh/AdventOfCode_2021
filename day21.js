const { Z_UNKNOWN } = require("zlib");

class Dice {

    number = 1;
    rolls = 0;

    nextNumber() {
        var next = this.number;

        this.number++
        if (this.number > 100)
            this.number = 1;
        this.rolls++;
        return next;
    }
}

class universe {

    pos1 = 0;
    pos2 = 0;
    score1 = 0;
    score2 = 0;

    constructor(pos1, pos2, score1, score2) {
        this.pos1 = pos1;
        this.pos2 = pos2;
        this.score1 = score1;
        this.score2 = score2;
    }

    pack() {
        var val = this.score1;
        val = val << 5;
        val += this.score2;
        val = val << 5;
        val += this.pos1;
        val = val << 5;
        val += this.pos2;

        return val;
    }

    newUniverseP1(scoreInc) {
        var pos1 = this.pos1 + scoreInc;
        pos1 = pos1 % 10;
        var score1 = this.score1 + (pos1 + 1);

        return new universe(pos1, this.pos2, score1, this.score2);
    }

    newUniverseP2(scoreInc) {
        var pos2 = this.pos2 + scoreInc;
        pos2 = pos2 % 10;
        var score2 = this.score2 + (pos2 + 1);

        return new universe(this.pos1, pos2, this.score1, score2);
    }
}

unpack = function (val) {
    var uni = new universe();
    uni.score1 = val >> 15 & 31;
    uni.score2 = val >> 10 & 31;
    uni.pos1 = val >> 5 & 31;
    uni.pos2 = val & 31;
    return uni;
}


try {

    // count pos from 0 - 9
    var pos1 = 4 - 1;
    var pos2 = 8 - 1;

    var score1 = 0;
    var score2 = 0;

    // var bPlayer1 = true;
    // var dice = new Dice();
    // while (score1 < 1000 && score2 < 1000)
    // {
    //     var steps = dice.nextNumber() + dice.nextNumber() + dice.nextNumber();

    //     if (bPlayer1)
    //     {
    //         pos1 += steps;
    //         pos1 = pos1 % 10;
    //         score1 += (pos1 + 1);

    //         console.log("Player 1 to: ", pos1, score1);
    //     }
    //     else{
    //         pos2 += steps;
    //         pos2 = pos2 % 10;
    //         score2 += (pos2 + 1);

    //         console.log("Player 2 to: ", pos2, score2);
    //     }

    //     bPlayer1 = !bPlayer1;
    // }

    // console.log("Dice", dice.rolls);
    // console.log("Player1", score1, dice.rolls * score1);
    // console.log("Player2", score2, dice.rolls * score2);

    var startUni = new universe();
    startUni.score1 = score1;
    startUni.score2 = score2;
    startUni.pos1 = pos1;
    startUni.pos2 = pos2;


    var possibleRolls = [];
    for (var d1 = 1; d1 <= 3; d1++) {
        for (var d2 = 1; d2 <= 3; d2++) {
            for (var d3 = 1; d3 <= 3; d3++) {
                possibleRolls.push(d1 + d2 + d3);
            }
        }
    }

    console.log(possibleRolls);


    // bepaal voor elke roll het aantal punten voor die speler inclusief een slimme cache
    // bereken hoeveel universes er zijn

    // pos, score + wie er aan de beurt is

    // [player1 pos] [player2 pos] [player1 score] [player 2 score]

    // loop trough all possibble positions?


    var player1 = [];
    var player2 = [];

    for (var i = 0; i < 24; i++) {
        player1[i] = [];
        player2[i] = [];
    }

    player1[score1][" " + startUni.pack()] = 1;

    for (var score = 0; score < 21; score++) {
        var scoresPlayer1 = player1[score];

        if (scoresPlayer1) {
            for (var key in scoresPlayer1) {
                if (scoresPlayer1.hasOwnProperty(key)) {
                    var val = scoresPlayer1[key];
                    var curUni = unpack(parseInt(key));

                    for (var r = 0; r < possibleRolls.length; r++) {
                        var points = possibleRolls[r];
                        var p2Uni = curUni.newUniverseP1(points);
                        var pack = p2Uni.pack();

                        var p2Score = p2Uni.score2;
                        if (player2[p2Score]["" + pack])
                        {
                            player2[p2Score]["" + pack] += val;
                        }
                        else{
                            player2[p2Score]["" + pack] = val;
                        }
                    }
                }
            }
        }
    }


} catch (err) {
    console.error(err)
}