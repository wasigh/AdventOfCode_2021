const { throws } = require('assert');
const { Console } = require('console');
const fs = require('fs')
const path = require('path');

class Node {

    leftNode = null;
    rightNode = null;
    parentNode = null;

    isTargetFor = null;

    constructor(index, isTargetFor, nodes) {
        this.index = index;
        this.isTargetFor = isTargetFor;
        nodes[this.index] = this;
    }

    addLeftNode(node) {
        this.leftNode = node;
        this.leftNode.parentNode = this;
    }

    addRightNode(node) {
        this.rightNode = node;
        this.rightNode.parentNode = this;
    }

    routeCost(nodeId, costSoFar, maze)
    {
        // TODO: CHECK if Move is valid (do not pass occupied) 
        // check for costsSoFar to skip first move
        if (costSoFar > 0 && maze.input[this.index] != ".")
            return -1;
     
        // first try to find routes in childNodes
        if (this.index == nodeId)
            return costSoFar;

     
        if (this.leftNode && this.leftNode.hasRoutesTo().indexOf(nodeId) >= 0)
        {
            return this.leftNode.routeCost(nodeId, costSoFar + 1, maze);
        }

        if (this.rightNode && this.rightNode.hasRoutesTo().indexOf(nodeId) >= 0)
        {
            return this.rightNode.routeCost(nodeId, costSoFar + 1, maze);
        }

        if (this.parentNode)
        {
            return this.parentNode.routeCost(nodeId, costSoFar + 1, maze);
        }

        return -1;
    }

    hasRoutesTo()
    {
        var routes = [this.index];
        if (this.leftNode != null)
        {
            routes.push(... this.leftNode.hasRoutesTo());
        }

        if (this.rightNode != null)
        {
            routes.push(... this.rightNode.hasRoutesTo());
        }

        return routes;
    }
}

class Route {
    constructor() {
        this.nodes = [];

        var a1 = new Node(0, "A", this.nodes);
        var a2 = new Node(1, "A", this.nodes);
        var a3 = new Node(2, "A", this.nodes);
        var a4 = new Node(3, "A", this.nodes);
        a2.addLeftNode(a1);
        a3.addLeftNode(a2);
        a4.addLeftNode(a3);

        var b1 = new Node(4, "B", this.nodes);
        var b2 = new Node(5, "B", this.nodes);
        var b3 = new Node(6, "B", this.nodes);
        var b4 = new Node(7, "B", this.nodes);
        b2.addLeftNode(b1);
        b3.addLeftNode(b2);
        b4.addLeftNode(b3);

        var c1 = new Node(8, "C", this.nodes);
        var c2 = new Node(9, "C", this.nodes);
        var c3 = new Node(10, "C", this.nodes);
        var c4 = new Node(11, "C", this.nodes);
        c2.addLeftNode(c1);
        c3.addLeftNode(c2);
        c4.addLeftNode(c3);

        var d1 = new Node(12, "D", this.nodes);
        var d2 = new Node(13, "D", this.nodes);
        var d3 = new Node(14, "D", this.nodes);
        var d4 = new Node(15, "D", this.nodes);
        d2.addLeftNode(d1);
        d3.addLeftNode(d2);
        d4.addLeftNode(d3);

        var r1 = new Node(16, null, this.nodes);
        var r2 = new Node(17, null, this.nodes);
        r2.addLeftNode(r1);

        var r3 = new Node(18, "-", this.nodes);
        r3.addLeftNode(a4);
        r3.addRightNode(r2);

        var r4 = new Node(19, null, this.nodes);
        r4.addLeftNode(r3);

        var r5 = new Node(20, "-", this.nodes);
        r5.addLeftNode(r4);
        r5.addRightNode(b4);

        var r6 = new Node(21, null, this.nodes);
        var r7 = new Node(22, "-", this.nodes);
        var r8 = new Node(23, null, this.nodes);
        var r9 = new Node(24, "-", this.nodes);
        var r10 = new Node(25, null, this.nodes);
        var r11 = new Node(26, null, this.nodes);

        r10.addRightNode(r11);

        r9.addRightNode(r10);
        r9.addLeftNode(d4);

        r8.addRightNode(r9);

        r7.addRightNode(r8);
        r7.addLeftNode(c4);

        r6.addRightNode(r7);
        r6.addLeftNode(r5);
    }
}

class Maze {
    moveCosts = { "A": 1, "B": 10, "C": 100, "D": 1000 };

    constructor(sInput, cost) {
        this.input = sInput;
        this.cost = cost;
    }

    isCorrect() {
        return this.input.slice(0, 16) == "AAAABBBBCCCCDDDD";
    }

    generateMoves() {

        var mazes = [];
        for (var i = 0; i < this.input.length; i++) {
            
            var char = this.input[i];
            if (char != ".")
            {

                var startNode = route.nodes[i];

                // if we are already in the correct location stay there if possible
                if (startNode.isTargetFor == char)
                {
                    // we are only correct if all our sub nodes are also correct
                    // check if underlying cells are occupied
                    var childIds = startNode.hasRoutesTo();
                    var allCorrect = true;
                    for (var cId = 0; cId < childIds.length; cId++)
                    {
                        let index = childIds[cId];
                        if (index != startNode.index)
                        {
                            if (this.input[index] != char)
                                allCorrect = false;
                        }
                    }
                    if (allCorrect)
                        continue;
                }

                var maxLength = i < 16 ? route.nodes.length: 16;

                for (var n = 0; n < maxLength; n++)
                {
                    if (i == n)
                        continue;

                    // can not move into a location that is already occupied
                    if (this.input[n] != ".")    
                        continue;
                    
                    var targetNode = route.nodes[n];
                    
                    if (targetNode.isTargetFor != null)
                    {
                        // can not move into a target thats not for you
                        if (targetNode.isTargetFor != char)
                            continue;
                        
                        // we only move in a locatin when underlying are occupied by the correct
                        // check if underlying cells are occupied
                        var childIds = targetNode.hasRoutesTo();
                        var correct = true;
                        for (var cId = 0; cId < childIds.length;cId++)
                        {
                            let index = childIds[cId];
                            if (index != targetNode.index)
                            {
                                if (this.input[index] != char)
                                {
                                    correct = false;
                                    break;
                                }
                            }
                        }

                        if (!correct)
                            continue;
                    }
                    

                    // TODO: check to fill columns only from the bottom up    

                    var costs = startNode.routeCost(n, 0, this);
                    costs = costs * this.moveCosts[char];

                    if (costs > 0)
                    {
                        var newInput = this.input.split("");
                        newInput[n] = this.input[i];
                        newInput[i] = this.input[n];

                        var aMaze = new Maze(newInput.join(""), this.cost + costs);
                        aMaze.prevMaze = this;
                        mazes.push(aMaze);
                    }
                }        
            }
        }
        return mazes;
    }

    predictedCosts()
    {

        if (this._predictedCosts)
            return this._predictedCosts;

        var predictMaze = new Maze("...........................", 0);
        var preCosts = this.cost;

        for (var i = 0; i < this.input.length; i++) {
            var char = this.input[i];
            
            if (char != ".")
            {
                var startNode = route.nodes[i];
                if (startNode.isTargetFor == char)
                    continue;

                switch (char)
                {
                    case "A":
                        preCosts += (startNode.routeCost(1, 0,predictMaze) * this.moveCosts[char]);
                        break;
                    case "B":
                        preCosts += (startNode.routeCost(3, 0,predictMaze) * this.moveCosts[char]);
                        break;
                    case "C":
                        preCosts += (startNode.routeCost(5, 0,predictMaze) * this.moveCosts[char]);
                        break;
                    case "D":
                        preCosts += (startNode.routeCost(7, 0,predictMaze) * this.moveCosts[char]);
                        break;
                }



            }
        }

        return this._predictedCosts = preCosts;
    }

}

var route = new Route();

try {

    //var maze = new Maze("ADDBDBCCCABBACAD...........",0)
    var maze = new Maze("BDDDABCDAABCCCAB...........",0)
    
    var visited = {};
    var toVisit =[maze];
    var count = 0;

    while(!maze.isCorrect() && toVisit.length > 0 )
    {
        count++;
        // find maze with the lowest cost
        toVisit.sort((a, b) => a.predictedCosts() - b.predictedCosts());
        
        var maze = toVisit.splice(0,1)[0];
        if (count % 1000 == 0)
        {
            console.log(count, "Cost", maze.cost, "PredictedCost: ", maze.predictedCosts(),"Togo: ", toVisit.length );
        }
                
        // add maze to visited list
        var mazes = maze.generateMoves();
        for(var m = 0; m < mazes.length; m++)
        {
            var checkMaze = mazes[m];

            if (!visited[checkMaze.input])
            {
                visited[checkMaze.input] = checkMaze.predictedCosts();
                toVisit.push(checkMaze);
            }
            else{
                if (visited[checkMaze.input] > checkMaze.predictedCosts())
                {
                    visited[checkMaze.input] = checkMaze.predictedCosts();
                    toVisit.push(checkMaze);
                }

            }
        }

    }
    console.log(maze);

} catch (err) {
    console.error(err)
}