const { Console } = require('console');
const fs = require('fs')
const path = require('path');

class Diagnostics {
    values;

    constructor(sLine) {
        this.values = Array(sLine.trim().length);
        for (var i = 0; i < this.values.length; i++) {
            var curVal = parseInt(sLine[i]);
            curVal = curVal == 0 ? -1 : curVal;
            this.values[i] = curVal
        }
    }

    append(otherDiagnostics)
    {
        for (var i = 0; i < this.values.length; i++) {
        
            this.values[i] += otherDiagnostics.values[i];    
        }
    }

    toString() {
        return this.values.toString();
    }

    toDecimalValue()
    {
        var val = parseInt(this.toBinaryString(), 2);
        return val;
    }

    toInverseDecimalValue()
    {
        var val = this.toDecimalValue();
        var maxValue = (1 << this.values.length) - 1;
                
        return maxValue - val;
    }

    zeroAsOne()
    {
        for(var i = 0; i< this.values.length; i++)
        {
            if (this.values[i] == 0)
            {
                this.values[i] = 1;
            }
        }

        return this;
    }

    toBinaryString()
    {
        var binary = "";
        for(var i = 0; i < this.values.length; i++)
        {
            var val = this.values[i];
            binary += val > 0? "1" : "0";
        }
        return binary;
    }
}

try {
    const data = fs.readFileSync(path.dirname(__filename) + '/Day3/in.txt', 'utf8')
    var lIn = data.split("\n");

    var allDiags = [];

    var diag = new Diagnostics(lIn[0]);
    // Push first
    allDiags.push(new Diagnostics(lIn[0]));
    
    for (var i = 1; i < lIn.length; i++) {
        var otherDiag = new Diagnostics(lIn[i]);
        diag.append(otherDiag);
        allDiags.push(otherDiag);
    }

    console.log( diag.toDecimalValue(), diag.toInverseDecimalValue());
    
    // find the length of the input
    // Start at the first bit (MSB)
    // Find the bit with value from decimalValue
    // filter all array items with this bit
    var bitLength = diag.values.length;
    var oxygenVal = diag.toDecimalValue();
    var filtered = Array(... allDiags);
    for (var i = bitLength; i > 0 ; bitLength--)
    {
        // stel decimal val =   11100101
        // pos 3 =              00100000
        // 
        var shift = bitLength -1;
        var mask = oxygenVal >> shift
        filtered = filtered.filter((diag) => {
            var val = diag.toDecimalValue() >> shift;
            return val == mask;
        })
        
        if (filtered.length == 1)
            break;

        // recalc most used val
        var newStart = new Diagnostics(filtered[0].toBinaryString());
        for(var k = 1; k <filtered.length; k++)
        {
            newStart.append(filtered[k]);
        }

        oxygenVal = newStart.zeroAsOne().toDecimalValue();
        console.log(... filtered.map((i) => i.toBinaryString()));
    }

    oxygenVal = filtered[0].toDecimalValue();
    console.log("found: ", filtered[0].toDecimalValue(), filtered[0].toBinaryString());


// co2
    bitLength = diag.values.length;
    var co2Val = diag.toInverseDecimalValue();
    var filtered = Array(... allDiags);
    for (var i = bitLength; i > 0 ; bitLength--)
    {
        // stel decimal val =   11100101
        // pos 3 =              00100000
        // 
        var shift = bitLength -1;
        var mask = co2Val >> shift
        filtered = filtered.filter((diag) => {
            var val = diag.toDecimalValue() >> shift;
            return (val & 1) == (mask & 1);
        })
        
        if (filtered.length == 1)
            break;

        // recalc most used val
        var newStart = new Diagnostics(filtered[0].toBinaryString());
        for(var k = 1; k <filtered.length; k++)
        {
            newStart.append(filtered[k]);
        }

        co2Val = newStart.zeroAsOne().toInverseDecimalValue();
        console.log(... filtered.map((i) => i.toBinaryString()));
    }
    co2Val = filtered[0].toDecimalValue();
    console.log("found: ", filtered[0].toDecimalValue(), filtered[0].toBinaryString());

    console.log("Solution", co2Val * oxygenVal);


} catch (err) {
    console.error(err)
}