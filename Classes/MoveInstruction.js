
class Position {
    horizontal;
    depth;
    aim;

    constructor(horizontal, depth, aim) {
        this.horizontal = horizontal;
        this.depth = depth;
        this.aim = aim;
    }

    checkCorrect() {
        return true;
    }

    product() {
        return this.horizontal * this.depth;
    }

    toString() {
        return "H: " + this.horizontal + " D: " + this.depth + " A: " + this.aim;
    }
}


class MoveInstruction {
    constructor(line) {
        var parts = line.split(" ");
        console.log(parts);
        this.operator = parts[0].trim().toLowerCase();
        this.operand = Number.parseInt(parts[1].trim());
    }

    execute(startPosition) {
        var horizontal = startPosition.horizontal;
        var depth = startPosition.depth;

        switch (this.operator) {
            case "forward":
                horizontal += this.operand;
                break;
            case "down":
                depth += this.operand;
                break;
            case "up":
                depth -= this.operand;
                break;
        }

        return new Position(horizontal, depth);
    }

    executeWithAim(startPosition) {
        var horizontal = startPosition.horizontal;
        var depth = startPosition.depth;
        var aim = startPosition.aim;

        
        switch (this.operator) {
            case "forward":
                horizontal += this.operand;
                depth += (this.operand * aim);
                break;
            case "down":
                aim += this.operand;
                break;
            case "up":
                aim -= this.operand;
                break;
        }

        return new Position(horizontal, depth, aim);
    }

    
}

module.exports = { MoveInstruction, Position };