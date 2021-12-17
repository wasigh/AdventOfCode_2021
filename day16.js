const fs = require('fs')
const path = require('path');


var allPackets = [];
var pos = 0;
var totalVersion = 0;


class Packet{
    childValues()
    {
        var values = this.subPackets.map(a => a.getValue());
        return values;
    }

    getValue()
    {
        switch(this.typeId)
        {
            case 0: // sum

                var values = this.childValues();
                this.value = values.reduce((prev, cur) => prev + cur, 0);
                return this.value;
            case 1: // product
                var values = this.childValues();
                this.value = values.reduce((prev, cur) => prev * cur, 1);
                return this.value;
            case 2: // minimum
                var values = this.childValues();
                this.value = Math.min(... values);
                return this.value;
            case 3: // maximum
                var values = this.childValues();
                this.value = Math.max(... values);
                return this.value;
            case 4: // value
                return this.value;
            case 5: // greater then
                var values = this.childValues();
                this.value = values[0] > values[1]? 1:0;
                return this.value;
            case 6: // less then
                var values = this.childValues();
                this.value = values[0] < values[1]? 1:0;
                return this.value;
            case 7: // equal
                var values = this.childValues();
                this.value = values[0] == values[1]? 1:0;
                return this.value;
        }
    }
}

class Parser
{
    constructor(startPos, endPos)
    {
        this.startPos = startPos;
        this.endPos = endPos;
    }

    readBits(count)
    {
        val = 0;
        for (i = 0; i < count; i++)
        {
            var bit = bits[pos++];
            val = val << 1;
            val += bit;
        }
        return val;
    }

    readNextPacket()
    {
        
        var version = this.readBits(3);
        totalVersion += version;
        var typeId = this.readBits(3)
        var length = 0;
        var subPackets = [];

        if (typeId == 4)
        {
            var value =  this.readPacket4Value();
            length = pos - this.startPos;
            var p =  new Packet() 
                p.version = version;
                p.typeId = typeId;
                p.value = value;
                p.length = length;
            return p;
        }

        var variant = this.readBits(1);
        if (variant == 0)
        {
            // parse subpackets
            var subPacketLength = this.readBits(15);
            var endPos = pos + subPacketLength;
            var parser = new Parser(pos, pos + subPacketLength);
            do {
                var subPacket = parser.readNextPacket();
                subPackets.push(subPacket);
                allPackets.push(subPacket);
            }
            while (pos < endPos)
            
            length = pos - this.startPos;
            var p =  new Packet() 
                p.version = version;
                p.typeId = typeId;
                p.value = value;
                p.length = length;
                p.subPackets = subPackets;
            return p;
            
        }
        else if (variant == 1)
        {
            var nrSubPackets = this.readBits(11);
            
            for (let t = 0; t< nrSubPackets; t++)
            {
                var parser = new Parser(pos, -1);
                var subPacket = parser.readNextPacket();
                subPackets.push(subPacket);
                allPackets.push(subPacket);
            }
            
            length = pos - this.startPos;
            
            var p =  new Packet() 
                p.version = version;
                p.typeId = typeId;
                p.value = value;
                p.length = length;
                p.subPackets = subPackets;
            return p;
        }
    }

    readPacket4Value()
    {
        var cont = 0;
        var val = 0;
        do{
            cont = this.readBits(1);
            val = val * 16;
            val += this.readBits(4);
        }while (cont == 1);

        return val;
    }


    

    
}

try {

    const data = fs.readFileSync(path.dirname(__filename) + '/Day16/in.txt', 'utf8')
    var bits = [];
    
    for (var i = 0; i < data.length; i++)
    {
        var c = data[i];
        var val = parseInt(c, 16);

        bits.push((val & 8) > 0? 1:0);
        bits.push((val & 4) > 0? 1:0);
        bits.push((val & 2) > 0? 1:0);
        bits.push((val & 1) > 0? 1:0);
    }
   

    console.log(bits.join(""));

    
    var p = new Parser(0, bits.length);

    
    console.log(pos, bits.length);
    packet = p.readNextPacket();
    
    console.log(totalVersion);    

    var val = packet.getValue();
    console.log(val);

    return;

} catch (err) {
    console.error(err)
}