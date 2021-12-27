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
    var pos1 = 3 - 1;
    var pos2 = 7 - 1;

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

    var a = unpack(284676);


    var startUni = new universe();
    startUni.score1 = score1;
    startUni.score2 = score2;
    startUni.pos1 = pos1;
    startUni.pos2 = pos2;


    var possibleRolls = Array(10);
    possibleRolls.fill(0);
    for (var d1 = 1; d1 <= 3; d1++) {
        for (var d2 = 1; d2 <= 3; d2++) {
            for (var d3 = 1; d3 <= 3; d3++) {
                possibleRolls[d1 + d2 + d3] += 1;
            }
        }
    }

    console.log(possibleRolls);


    // houdt een lijst bij per player
    // eerst player 1 dan player2
    // wanneer player1 geweest is gaat nieuwe universe naar player2.
    // houdt het aantal universes bij dat in dezelfde staat is.


    var player1 = {};
    var player2 = {};

    player1["_" + startUni.pack()] = 1;

    var loop = 0
    while (true) {

        var bInjectedNew = false;

        for (var key in player1) {
            if (player1.hasOwnProperty(key)) {
                var val = player1[key];

                var uniPacked = parseInt(key.substring(1))
                var curUni = unpack(uniPacked);

                if (curUni.score1 < 21) {
                    delete player1[key];
                    bInjectedNew = true;
                    
                    for (var r = 0; r < possibleRolls.length; r++) {
                        var points = r;
                        var universes = possibleRolls[r] * val;
                        
                        if (universes == 0)
                            continue;

                        var p2Uni = curUni.newUniverseP1(points);
                        var pack = p2Uni.pack();

                        if (p2Uni.score1 < 21)
                        {
                            if (player2["_" + pack]) {
                                player2["_" + pack] += universes;
                            }
                            else {
                                player2["_" + pack] = universes;
                            }
                        }
                        else{
                            if (player1["_" + pack]) {
                                player1["_" + pack] += universes;
                            }
                            else {
                                player1["_" + pack] = universes;
                            }
                        }
                    }
                }
            }
        }


        // Player 2
        for (var key in player2) {
            if (player2.hasOwnProperty(key)) {
                var val = player2[key];
                var uniPacked = parseInt(key.substring(1))
                var curUni = unpack(uniPacked);

                if (curUni.score2 < 21) {

                    delete player2[key];
                    bInjectedNew = true;

                    for (var r = 0; r < possibleRolls.length; r++) {
                        
                        var points = r;
                        var universes = possibleRolls[r] * val;

                        if (universes == 0)
                            continue;
                        
                        var p1Uni = curUni.newUniverseP2(points);
                        var pack = p1Uni.pack();

                        if (p1Uni.score2 < 21)
                        {
                            if (player1["_" + pack]) {
                                player1["_" + pack] += universes;
                            }
                            else {
                                player1["_" + pack] = universes;
                            }
                        }
                        else{
                            if (player2["_" + pack]) {
                                player2["_" + pack] += universes;
                            }
                            else {
                                player2["_" + pack] = universes;
                            }
                        }
                    }
                }

            }

        }

        if (!bInjectedNew)
                break;
        console.log("Loop", loop++);
    }

    console.log("Endgame");


    var scoresp1 = 0;
    var scoresp2 = 0;
    
    for (var key in player1) {
        if (player1.hasOwnProperty(key)) {
            var val = player1[key];
            scoresp1 += val;
        }
    }
    for (var key in player2) {
        if (player2.hasOwnProperty(key)) {
            var val = player2[key];
            scoresp2 += val;
        }
    }
    
    console.log(scoresp1, scoresp2);
    console.log(Math.max(scoresp2, scoresp1));


} catch (err) {
    console.error(err)
}