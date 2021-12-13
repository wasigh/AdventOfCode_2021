const fs = require('fs')
const path = require('path');

class routeNode {
    neighbours = [];

    constructor(sName) {
        this.sName = sName;
    }

    addNeighbour(aNode) {
        this.neighbours.push(aNode);
    }

    visitOnlyOnce() {
        // Names with only lowercase can only be visited once
        return this.sName.toLowerCase() == this.sName;
    }

    canVisit(sRoute) {

        if (!this.visitOnlyOnce())
            return true;

        var mayAddDouble = sRoute[0] != "#";
        if (mayAddDouble)
            return true;

        var pos = sRoute.indexOf("," + this.sName + ",");
        return pos < 0;
    }

    findRouteToEnd(routes, routeSoFar) {

        if (this.visitOnlyOnce()) {
            var pos = routeSoFar.indexOf("," + this.sName + ",");
            if (pos >= 0) {
                if (this.sName == "start" || this.sName == 'end')
                    return;
                routeSoFar = "#" + routeSoFar;
            }
        }

        routeSoFar += "," + this.sName;

        routes.push(routeSoFar);

        if (this.sName == "end")
            return;

        for (var i = 0; i < this.neighbours.length; i++) {
            var ng = this.neighbours[i];

            if (ng.canVisit(routeSoFar)) {
                ng.findRouteToEnd(routes, routeSoFar);
            }
        }
    }
}




try {

    const data = fs.readFileSync(path.dirname(__filename) + '/Day12/in.txt', 'utf8')
    var lIn = data.split("\n");

    var nodes = [];
    var routes = [];

    for (var i = 0; i < lIn.length; i++) {
        //start-A
        var line = lIn[i].trim();
        var nodeLists = line.split("-");

        var firstNodeName = nodeLists[0];
        var firstNode = nodes[firstNodeName];
        if (!firstNode) {
            firstNode = new routeNode(firstNodeName);
            nodes[firstNodeName] = firstNode;
        }

        var secondNodeName = nodeLists[1];
        var secondNode = nodes[secondNodeName];
        if (!secondNode) {
            secondNode = new routeNode(secondNodeName);
            nodes[secondNodeName] = secondNode;
        }

        firstNode.addNeighbour(secondNode);
        secondNode.addNeighbour(firstNode);

    }

    var startNode = nodes["start"];
    var routes = [];

    startNode.findRouteToEnd(routes, "");

    //console.log(nodes);
    //console.log(routes);
    var total = 0;

    for (var r = 0; r < routes.length; r++) {
        var route = routes[r];
        if (route.endsWith("end")) {
            console.log(route);
            total++;
        }
    }
    console.log(total);

} catch (err) {
    console.error(err)
}