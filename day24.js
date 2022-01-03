const fs = require('fs')
const path = require('path');

class ALU {
    w = 0;
    x = 0;
    y = 0;
    z = 0;

    inputsRead = 0;

     addInstruction(instruction)
     {
        var newFunction = this.operaratorFunction(instruction);
        this[instruction.operand1] = newFunction;
     }

     operaratorFunction(instruction)
     {

        var op = instruction.op;
        var operand1 = instruction.operand1;
        var operand2 = instruction.operand2;

            switch (op) {
                case "inp":

                    var index = this.inputsRead;

                    var func = (input) => {return this.readInput(index, input)};
                    this.inputsRead++;
                    return func;
                    break;
                case "add":

                    var val1 = this.getval(operand1);
                    var val2 = this.getval(operand2);
                    
                    var func = (input) => {

                        var x = val1;
                        var y = val2;

                        if (typeof val1 == "function")
                            x = val1(input);
                        if (typeof val2 == "function")
                            y = val2(input);

                        return parseInt(x) + parseInt(y);
                    };
                    return func;
                    break;
                case "mul":
                    var val1 = this.getval(operand1);
                    var val2 = this.getval(operand2);
                    
                    if (val1 == 0 || val2 == 0)
                        return 0; 

                    var func = (input) => {

                        var x = val1;
                        var y = val2;
                     

                        if (typeof val1 == "function")
                            x = val1(input);
                        if (typeof val2 == "function")
                            y = val2(input);

                        return parseInt(x) * parseInt(y);
                    };
                    return func;
                    break;
                case "div":

                    var val1 = this.getval(operand1);
                    var val2 = this.getval(operand2);
                                        
                    var func = (input) => {

                        var x = val1;
                        var y = val2;

                        if (typeof val1 == "function")
                            x = val1(input);
                        if (typeof val2 == "function")
                            y = val2(input);

                        var val = parseInt(x) / parseInt(y);
                        val = val > 0 ? Math.floor(val) : Math.ceil(val);

                        return val;
                    };
                    return func;

                    break;
                case "mod":

                    var val1 = this.getval(operand1);
                    var val2 = this.getval(operand2);
                    
                    var func = (input) => {

                        var x = val1;
                        var y = val2; 

                        if (typeof val1 == "function")
                            x = val1(input);
                        if (typeof val2 == "function")
                            y = val2(input);

                        return parseInt(x) % parseInt(y);
                    };
                    return func;

                    break;
                case "eql":

                    var val1 = this.getval(operand1);
                    var val2 = this.getval(operand2);
                    
                    var func = (input) => {

                        var x = val1;
                        var y = val2;

                        if (typeof val1 == "function")
                            x = val1(input);
                        if (typeof val2 == "function")
                            y = val2(input);

                        var val = parseInt(x) == parseInt(y) ? 1 : 0;
                        return val;
                    };
                    return func;

                                        
                    break;
            }
     }

     getval(operand)
     {
         if ("wyzx".indexOf(operand) != -1)
         {
             return this[operand];
         }
         return operand;
     }

     readInput(index, input)
     {
        console.log("ReadInput", index);
        return parseInt(input[index]);
     }

}

class Instruction {
    constructor(sInstruction) {
        this.instruction = sInstruction;
        var parts = this.instruction.split(" ");
        this.op = parts[0];
        this.operand1 = parts[1];
        this.operand2 = parts[2] || "";
    }

}



try {
    const data = fs.readFileSync(path.dirname(__filename) + '/Day24/in.txt', 'utf8')
    var lIn = data.split("\n");

    var instructions = [];
    var alu = new ALU();    

    for (var i = 0; i < lIn.length; i++) {
        var line = lIn[i].trim();
        var instruction = new Instruction(line);
        instructions.push(instruction);
        alu.addInstruction(instruction);
    }

    //console.log("z = ", alu.z("99999999999999"));
    console.log("z = ", alu.z("19999999999999"));
    console.log("z = ", alu.z("91999999999999"));
    console.log("z = ", alu.z("99199999999999"));
    console.log("z = ", alu.z("99919999999999"));
    console.log("z = ", alu.z("99991999999999"));
    console.log("z = ", alu.z("99999199999999"));
    console.log("z = ", alu.z("99999919999999"));
    console.log("z = ", alu.z("99999991999999"));
    console.log("z = ", alu.z("99999999199999"));
    console.log("z = ", alu.z("99999999919999"));
    console.log("z = ", alu.z("99999999991999"));
    console.log("z = ", alu.z("99999999999199"));
    console.log("z = ", alu.z("99999999999919"));
    console.log("z = ", alu.z("99999999999991"));
    

} catch (err) {
    console.error(err)
}