const fs = require('fs')
const path = require('path');


function lineIntersects(s1,e1, s2,e2)
{

    // no endpoint overlap
    if (s1 > e2)
        return false;

    if (e1 < s2)
        return false;

    if (s2 > e1)
        return false;

    if (e2 < s1)
        return false;

    return true;
}

class instruction {

    constructor(bOn, minX, maxX, minY, maxY, minZ, maxZ) {
        this.on = bOn;
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
        this.minZ = minZ;
        this.maxZ = maxZ;
    }

    getState(current, x, y, z) {
        if (x >= this.minX && x <= this.maxX
            && y >= this.minY && y <= this.maxY
            && z >= this.minZ && z <= this.maxZ) {
            return this.on;
        }

        return current;
    }

    inRangeX(x) {
        return (x >= this.minX && x <= this.maxX);
    }

    inRangeY(y) {
        return (y >= this.minY && y <= this.maxY);
    }

    inRangeZ(z) {
        return (z >= this.minZ && z <= this.maxZ);
    }
}

class Cube {

    points = [];

    constructor(minX, maxX, minY, maxY, minZ, maxZ) {
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
        this.minZ = minZ;
        this.maxZ = maxZ;
    }

    score() {
        var a = Math.abs((this.maxX + 1) - this.minX);
        var b = Math.abs((this.maxY + 1) - this.minY);
        var c = Math.abs((this.maxZ + 1) - this.minZ);

        return a * b * c;
    }


    isContainedBy(otherCube) {
        // check if this cube equals or is completely contained 
        var bContained = true;
        bContained = bContained && this.minX >= otherCube.minX;
        bContained = bContained && this.maxX <= otherCube.maxX;
        bContained = bContained && this.minY >= otherCube.minY;
        bContained = bContained && this.maxY <= otherCube.maxY;
        bContained = bContained && this.minZ >= otherCube.minZ;
        bContained = bContained && this.maxZ <= otherCube.maxZ;
        return bContained;
    }

    split(otherCube) {
        // TODO: check for special case where one Cube complety contains the other


        var overlapX = lineIntersects(this.minX, this.maxX, otherCube.minX, otherCube.maxX);
        var overlapY = lineIntersects(this.minY, this.maxY, otherCube.minY, otherCube.maxY);
        var overlapZ = lineIntersects(this.minZ, this.maxZ, otherCube.minZ, otherCube.maxZ);
        
        var overlap = overlapX && overlapY && overlapZ;

        if (!overlap)
            return null;

        var resultCube = this.splitX(otherCube);
        if (resultCube)
            return resultCube;

        resultCube = this.splitY(otherCube);
        if (resultCube)
            return resultCube;

        resultCube = this.splitZ(otherCube);
        if (resultCube)
            return resultCube;

        return null;

    }

    splitX(otherCube) {
        // case when otherCube minx is greater 
        if (otherCube.minX <= this.minX && otherCube.maxX >= this.maxX) 
        {
            return null;
        }

        if (otherCube.minX > this.minX && otherCube.minX <= this.maxX) {
            // split first x
            var newCube = new Cube(otherCube.minX, this.maxX, this.minY, this.maxY, this.minZ, this.maxZ);
            // adjust current Cube
            this.maxX = otherCube.minX - 1;
            return newCube;
        }

        // case when case when otherCube minx is greater 
        if (otherCube.maxX >= this.minX && otherCube.maxX < this.maxX) {
            // split first x
            var newCube = new Cube(this.minX, otherCube.maxX, this.minY, this.maxY, this.minZ, this.maxZ);
            // adjust current Cube
            this.minX = otherCube.maxX + 1;
            return newCube;
        }

        return null;
    }

    splitY(otherCube) {

        if (otherCube.minY <= this.minY && otherCube.maxY >= this.maxY) 
        {
            return null;
        }

        // case when otherCube minY is greater 
        if (otherCube.minY > this.minY && otherCube.minY <= this.maxY) {
            // split first x
            var newCube = new Cube(this.minX, this.maxX, otherCube.minY, this.maxY, this.minZ, this.maxZ);
            // adjust current Cube
            this.maxY = otherCube.minY - 1;
            return newCube;
        }

        // case when case when otherCube minY is greater 
        if (otherCube.maxY >= this.minY && otherCube.maxY < this.maxY) {
            // split first x
            var newCube = new Cube(this.minX, this.maxX, this.minY, otherCube.maxY, this.minZ, this.maxZ);
            // adjust current Cube
            this.minY = otherCube.maxY + 1;
            return newCube;
        }

        return null;

    }

    splitZ(otherCube) {

        if (otherCube.minZ <= this.minZ && otherCube.maxZ >= this.maxZ) 
        {
            return null;
        }

        // case when otherCube minY is greater 
        if (otherCube.minZ > this.minZ && otherCube.minZ <= this.maxZ) {
            // split first x
            var newCube = new Cube(this.minX, this.maxX, this.minY, this.maxY, otherCube.minZ, this.maxZ);
            // adjust current Cube
            this.maxZ = otherCube.minZ - 1;
            return newCube;
        }

        // case when case when otherCube minY is greater 
        if (otherCube.maxZ >= this.minZ && otherCube.maxZ < this.maxZ) {
            // split first x
            var newCube = new Cube(this.minX, this.maxX, this.minY, this.maxY, this.minZ, otherCube.maxZ);
            // adjust current Cube
            this.minZ = otherCube.maxZ + 1;
            return newCube;
        }

        return null;
    }

    toString() {
        return this.minX + "\t" + this.maxX + "\t\t" + this.minY + "\t" + this.maxY + "\t\t" + this.minZ + "\t" + this.maxZ + "\t";
    }

}

class Point {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}


function test1() {
    var a = new Cube(0, 4, 0, 4, 0, 4);
    var b = new Cube(2, 6, 0, 2, 0, 2);

    var result = a.split(b);
    console.log("a.maxX should be 1", a.maxX);
    console.log("result.minX should be 2", result.minX);

    return a.maxX == 1 && result.minX == 2;
}

function test2() {
    var a = new Cube(0, 4, 0, 4, 0, 4);
    var b = new Cube(-2, 2, 0, 2, 0, 2);

    var result = a.split(b);
    console.log("a.minX should be 3", a.minX);
    console.log("result.maxX should be 2", result.maxX);

    return a.minX == 3 && result.maxX == 2;
}

function test3() {
    var a = new Cube(0, 4, 0, 4, 0, 4);
    var b = new Cube(0, 4, 2, 6, 0, 4);

    var result = a.split(b);
    console.log("a.maxY should be 1", a.maxY);
    console.log("result.minY should be 2", result.minY);

    return a.maxY == 1 && result.minX == 2;
}

function test4() {
    var a = new Cube(0, 4, 0, 4, 0, 4);
    var b = new Cube(0, 4, -2, 2, 0, 4);

    var result = a.split(b);
    console.log("a.minY should be 3", a.minY);
    console.log("result.maxY should be 2", result.maxY);

    return a.minY == 3 && result.maxY == 2;
}

function test5() {
    var a = new Cube(0, 4, 0, 4, 0, 4);
    var b = new Cube(0, 4, 0, 4, 2, 6);

    var result = a.split(b);
    console.log("a.maxZ should be 1", a.maxZ);
    console.log("result.minZ should be 2", result.minZ);

    return a.maxZ == 1 && result.minZ == 2;
}

function test6() {
    var a = new Cube(0, 4, 0, 4, 0, 4);
    var b = new Cube(0, 4, 0, 4, -2, 2);

    var result = a.split(b);
    console.log("a.minZ should be 3", a.minZ);
    console.log("result.maxZ should be 2", result.maxZ);

    return a.minZ == 3 && result.maxZ == 2;
}

function test7() {
    var a = new Cube(0, 4, 0, 4, 0, 4);

    var result = a.isContainedBy(a);
    console.log("Cube should contain itself", result);

    return result;
}

function test8() {
    var a = new Cube(0, 4, 0, 4, 0, 4);
    var b = new Cube(1, 2, 1, 2, 1, 2);

    var result = b.isContainedBy(a)
    console.log("B should be contained by a", result);

    return result;
}

function test9() {
    var a = new Cube(-20, 26, -36, 17, -47, 7);
    var b = new Cube(-20, 33, -21, 23, -26, 28);

    var splitted = a.split(b);
    console.log("A should be split by Y", a.maxY == -21);
    console.log("Splitted should start by -21", splitted.minY == -21);

    var correct = a.maxY == -21 && splitted.minY == -21;
    var split2 = splitted.split(b);
    console.log("Split2 should be split by Z", splitted.maxZ == -26);
    console.log("Split2 should start by -21", split2.minZ == -26);

    correct = correct && splitted.maxZ == -26 && split2.minZ == -26;

    var contained = split2.isContainedBy(b);
    console.log("Split2 should be contained by B", contained);

    correct = correct && contained;

    return correct;
}

function test10() {
    var a = new Cube(0, 4, 0, 4, 0, 4);


    var result = a.score();
    console.log("Result should be 125", result == 125);

    return result == 125;
}

function test11() {
    var a = new Cube(-4, -4, -4, -4, 0, 0);

    var result = a.score();
    console.log("Result should be 1", result == 1);

    return result == 1;
}


function getTotalScore(cubes) {
    var scores = cubes.map((c) => c.score());
    var totalScore = scores.reduce((prev, cur) => prev + cur);
    return totalScore;
}


function getScoreByInstructions(instructions) {
    var curMinX = -50;// instructions.map((a) => a.minX).reduce((prev, cur) => Math.min(prev,cur), Number.MAX_SAFE_INTEGER);
    var curMaxX = 50;//instructions.map((a) => a.maxX).reduce((prev, cur) => Math.max(prev,cur), Number.MIN_SAFE_INTEGER);
    var curMinY = -50;//instructions.map((a) => a.minY).reduce((prev, cur) => Math.min(prev,cur), Number.MAX_SAFE_INTEGER);
    var curMaxY = 50;//instructions.map((a) => a.maxY).reduce((prev, cur) => Math.max(prev,cur), Number.MIN_SAFE_INTEGER);
    var curMinZ = -50;//instructions.map((a) => a.minZ).reduce((prev, cur) => Math.min(prev,cur), Number.MAX_SAFE_INTEGER);
    var curMaxZ = 50;//instructions.map((a) => a.maxZ).reduce((prev, cur) => Math.max(prev,cur), Number.MIN_SAFE_INTEGER);

    var total = 0;

    for (var x = curMinX; x <= curMaxX; x++) {
        for (var y = curMinY; y <= curMaxY; y++) {
            for (var z = curMinZ; z <= curMaxZ; z++) {
                var state = false;
                for (var i = 0; i < instructions.length; i++) {
                    state = instructions[i].getState(state, x, y, z);
                }

                if (state) {
                    total++;
                }
            }
        }
    }
    return total;
}


try {
    const data = fs.readFileSync(path.dirname(__filename) + '/Day22/in.txt', 'utf8')
    var lIn = data.split("\n");


    var instructions = [];

    for (var i = 0; i < lIn.length; i++) {
        var line = lIn[i].trim();
        var firstSplit = line.split(" ");

        var bOn = firstSplit[0] == "on";
        var secondSplit = firstSplit[1];

        secondSplit = secondSplit.replace("x=", "");
        secondSplit = secondSplit.replace("y=", "");
        secondSplit = secondSplit.replace("z=", "");
        secondSplit = secondSplit.replace("..", ",");
        secondSplit = secondSplit.replace("..", ",");
        secondSplit = secondSplit.replace("..", ",");

        var parts = secondSplit.split(",").map((x) => parseInt(x));
        var x1 = parts[0];
        var x2 = parts[1];
        var y1 = parts[2];
        var y2 = parts[3];
        var z1 = parts[4];
        var z2 = parts[5];

        var instr = new instruction(bOn, x1, x2, y1, y2, z1, z2);
        instructions.push(instr);

    }

    var cubes = [];
    // for every instruction
    // create a Cube

    if (!test1())
        Error("Failed Test1");

    if (!test2())
        Error("Failed Test2");

    if (!test3())
        Error("Failed Test3");

    if (!test4())
        Error("Failed Test4");

    if (!test5())
        Error("Failed Test5");

    if (!test6())
        Error("Failed Test6");

    if (!test7())
        Error("Failed Test7");

    if (!test8())
        Error("Failed Test8");

    if (!test9())
        Error("Failed Test9");

    if (!test10())
        Error("Failed Test10");

    if (!test11())
        Error("Failed Test11");

    for (var i = 0; i < instructions.length; i++) {
        if (i == 13 || i == 14) {
            var b = true;
        }

        var curInstruction = instructions[i];
        var newCube = new Cube(curInstruction.minX, curInstruction.maxX, curInstruction.minY, curInstruction.maxY, curInstruction.minZ, curInstruction.maxZ);
        for (var c = 0; c < cubes.length; c++) {
            var cube = cubes[c];
            if (cube.isContainedBy(newCube)) {
                //console.log("### Cubes: before splice");
                //cubes.map((a) => console.log(a.toString()));
                // delete cube
                cubes.splice(c, 1);
                // reset counter to previous pos
                //console.log("### Cubes: after splice");
                //cubes.map((a) => console.log(a.toString()));

                c--;
            }
            else {
                var splitted = cube.split(newCube);
                if (splitted != null) {
                    cubes.push(splitted);
                }
            }
        }

        if (curInstruction.on) {
            cubes.push(newCube);
        }


        //var s = getTotalScore(cubes);
        //var s1 = getScoreByInstructions(instructions.slice(0, i + 1));

        console.log("after: " + i);
    }

    // check if Cube equals already existing cube
    //  if they are equal delete one or both depending on .on config
    // If not equal split existing cube to not overlapping cube and remaining cube
    // split ruther if necessary

    var totalScore = getTotalScore(cubes);
    console.log(totalScore);
    console.log(getScoreByInstructions(instructions));





} catch (err) {
    console.error(err)
}