const fs = require('fs')
const path = require('path');

class ALU {
    w = 0;
    x = 0;
    y = 0;
    z = 0;

    usedInput = "";

    writeval(register, val) {
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
        return register;
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

    var possibleAlus = [1];
    possibleAlus[0] = new ALU();

    for (var group = 0; group< instructions.length; group++)
    {
        console.log("calculating group", group, "from:" , instructions.length, possibleAlus.length);

        var newAlus = {};
        for (var nr = 9; nr > 0; nr--) {
            var input = nr.toString();
            if (input.indexOf("0") !== -1) {
                continue;
            }

            for (var a = 0; a < possibleAlus.length; a++) {
                var alu = possibleAlus[a].copy();
                for (var i = 0; i < instructions[group].length; i++) {
                    var instr = instructions[group][i];
                    instr.execute(alu, input);
                }
                alu.usedInput += nr;

                if (alu.isValid())
                {
                    if (!newAlus[alu.toString()])
                    {
                        newAlus[alu.toString()] = alu;
                    }
                    
                }
            }
        }
        possibleAlus = Object.entries(newAlus).map(( [k, v] ) => ( v ));
    }

    var maxNr = possibleAlus.filter((a) => a.z == 0).map((a) =>parseInt(a.usedInput)).reduce((prev, cur) => Math.max(prev,cur));
    console.log(maxNr);

} catch (err) {
    console.error(err)
}