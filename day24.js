const fs = require('fs')
const path = require('path');

class ALU {
    w = 0;
    x = 0;
    y = 0;
    z = 0;

    usedInput = "";

    writeval(register, val) {

        val = parseInt(val);

        switch (register) {
            case "w":
                this.w = val;
                break;
            case "x":
                this.x = val;
                break;
            case "y":
                this.y = val;
                break;
            case "z":
                this.z = val;
                break;
        }
    }

    getval(register) {
        switch (register) {
            case "w":
                return this.w;
            case "x":
                return this.x;
            case "y":
                return this.y;
            case "z":
                return this.z;
        }
        return parseInt(register);
    }

    copy() {
        var c = new ALU();
        c.w = this.w;
        c.x = this.x;
        c.y = this.y;
        c.z = this.z;
        c.usedInput = this.usedInput;
        return c;
    }

    isValid()
    {
        return !isNaN(this.w) &&
                !isNaN(this.x) &&
                !isNaN(this.y) &&
                !isNaN(this.z);
    }

    toString() {
        return "w:" + this.w + "x:" + this.x + "y:" + this.y + "z:" + this.z;
    }
}

class Instruction {
    constructor(sInstruction) {
        this.instruction = sInstruction;
    }

    execute(alu, inputs) {
        var parts = this.instruction.split(" ");
        var op = parts[0];
        var operand1 = parts[1];
        var operand2 = parts[2] || "";

        switch (op) {
            case "inp":
                var input = parseInt(inputs[0]);
                inputs = inputs.substring(1);
                alu.writeval(operand1, input);
                break;
            case "add":
                var val = alu.getval(operand1) + alu.getval(operand2);
                alu.writeval(operand1, val);
                break;
            case "mul":
                var val = alu.getval(operand1) * alu.getval(operand2);
                alu.writeval(operand1, val);
                break;
            case "div":
                var val = alu.getval(operand1) / alu.getval(operand2);
                val = val > 0 ? Math.floor(val) : Math.ceil(val);
                alu.writeval(operand1, val);
                break;
            case "mod":
                var val = alu.getval(operand1) % alu.getval(operand2);
                alu.writeval(operand1, val);
                break;
            case "eql":
                var val = alu.getval(operand1) == alu.getval(operand2) ? 1 : 0;
                alu.writeval(operand1, val);
                break;
        }

        return inputs;
    }
}

function findPossibleIns(instructions, totalString, pos)
{
    var targetZ= [];

    for (var nr = 9; nr > 0; nr--) 
    {
        var input = nr.toString();
        if (input.indexOf("0") !== -1) {
            continue;
        }
    
        for (z = 0; z <= 26; z ++)
        {
            var alu = new ALU();
            alu.z = z;
            
            for (var i = 0; i < instructions.length; i++) {
                var instr = instructions[i];
                instr.execute(alu, input);
            }
                            
            var preZ = alu.z >= 26? Math.floor(alu.z / 26): alu.z;
            
            if (preZ == 0)
            {
                //console.log(nr, z, alu.z, preZ);
                //console.log("Valid digit", nr);
                if (!targetZ[z])
                {
                    var s = totalString.split("");
                    s[pos] = nr;
                    targetZ[z] = s.join("");
                }
            }
        }
    }
    return targetZ;
}

function findInForOutput(instructions, targets,  totalString, pos)
{
    var ins = [];

    for (var nr = 9; nr > 0; nr--) {
        var input = nr.toString();
        if (input.indexOf("0") !== -1) {
            continue;
        }
    
        for (z = 0; z <= 26; z ++)
        {
            var alu = new ALU();
            alu.z = z;
            
            for (var i = 0; i < instructions.length; i++) {
                var instr = instructions[i];
                instr.execute(alu, input);
            }
                            
            var preZ = alu.z;
            
            if (targets[preZ] && targets[preZ].length)
            {
                var s = targets[preZ].split("");
                s[pos] = nr;
                ins[nr]= s.join("");
            }
        }
    }
    return ins;
}

function findFor(a, b)
{
    var ins = findPossibleIns(instructions[a], used, a );
    var out = findInForOutput(instructions[b], ins, used, b);
    console.log(out);
}

try {
    const data = fs.readFileSync(path.dirname(__filename) + '/Day24/in.txt', 'utf8')
    var lIn = data.split("\n");

    var instructions = [];
    var group = -1;

    for (var i = 0; i < lIn.length; i++) {
        var line = lIn[i].trim();
        var instruction = new Instruction(line);
        if (line.substring(0, 3) == "inp") {
            group++;
            instructions[group] = [];
        }

        instructions[group].push(instruction);
    }


    for (var i = 0; i < instructions.length; i++){
        var group = instructions[i];
        console.log(group[4], ".", group[5], ".", group[15] );

    }
    
    var used = "..............";


    // 0  - 13
    findFor(13,0)
    // 1 - 12
    findFor(12,1)
    // 2 - 3
    findFor(3,2)
    // 4 - 11
    findFor(11,4)
    // 5 - 6
    findFor(6,5)
    // 6 - 7
    findFor(8,7)
    // 8 - 9
    findFor(10,9)
   
    var ins = findPossibleIns(instructions[13], used, last );
    var out = findInForOutput(instructions[0], ins, used, 1);
    console.log(out);

} catch (err) {
    console.error(err)
}