const fs = require('fs')
const path = require('path');


function matrixDot(m1, m2) {
    
    //https://www.mathsisfun.com/algebra/matrix-multiplying.html

    var a = (m1[0] * m2[0]) + (m1[1] * m2[3]) + (m1[2] * m2[6]);
    var b = (m1[0] * m2[1]) + (m1[1] * m2[4]) + (m1[2] * m2[7]);
    var c = (m1[0] * m2[2]) + (m1[1] * m2[5]) + (m1[2] * m2[8]);

    var d = (m1[3] * m2[0]) + (m1[4] * m2[3]) + (m1[5] * m2[6]);
    var e = (m1[3] * m2[1]) + (m1[4] * m2[4]) + (m1[5] * m2[7]);
    var f = (m1[3] * m2[2]) + (m1[4] * m2[5]) + (m1[5] * m2[8]);

    var g = (m1[6] * m2[0]) + (m1[7] * m2[3]) + (m1[8] * m2[6]);
    var h = (m1[6] * m2[1]) + (m1[7] * m2[4]) + (m1[8] * m2[7]);
    var i = (m1[6] * m2[2]) + (m1[7] * m2[5]) + (m1[8] * m2[8]);

    return [a,b,c,d,e,f,g,h,i];

}

function calcTransformMatrices()
{
    var cos = [1, 0, -1, 0];
    var sin = [0, 1, 0, -1];

    // x - axes
    var mx0 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    var mx90 = [0, -1, 0, 1, 0, 0, 0, 0, 1];
    var mx180 = [-1, 0, 0, 0, -1, 0, 0, 0, 1];
    var mx270 = [0, 1, 0, -1, 0, 0, 0, 0, 1];

    // y - axes
    var my0 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    var my90 = [0, 0, 1, 0, 1, 0, -1, 0, 0];
    var my180 = [-1, 0, 0, 0, 1, 0, 0, 0, -1];
    var my270 = [0, 0, -1, 0, 1, 0, 1, 0, 0];

    // z - axes
    var mz0 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    var mz90 = [1, 0, 0, 0, 0, -1, 0, 1, 0];
    var mz180 = [1, 0, 0, 0, -1, 0, 0, 0, -1];
    var mz270 = [1, 0, 0, 0, 0, 1, 0, -1, 0];


    var matrixes = [];
    matrixes.push(mx0);
    matrixes.push(mx90);
    matrixes.push(mx180);
    matrixes.push(mx270);

    matrixes.push(matrixDot(mx0, my90));
    matrixes.push(matrixDot(mx90, my90));
    matrixes.push(matrixDot(mx180, my90));
    matrixes.push(matrixDot(mx270, my90));

    matrixes.push(matrixDot(mx0, my180));
    matrixes.push(matrixDot(mx90, my180));
    matrixes.push(matrixDot(mx180, my180));
    matrixes.push(matrixDot(mx270, my180));

    matrixes.push(matrixDot(mx0, my270));
    matrixes.push(matrixDot(mx90, my270));
    matrixes.push(matrixDot(mx180, my270));
    matrixes.push(matrixDot(mx270, my270));

    matrixes.push(matrixDot(mx0, mz90));
    matrixes.push(matrixDot(mx90, mz90));
    matrixes.push(matrixDot(mx180, mz90));
    matrixes.push(matrixDot(mx270, mz90));

    matrixes.push(matrixDot(mx0, mz270));
    matrixes.push(matrixDot(mx90, mz270));
    matrixes.push(matrixDot(mx180, mz270));
    matrixes.push(matrixDot(mx270, mz270));

    return matrixes;
}


function invertMatrix(matrix)
{
    return []
}

class Scanner {
    points = [];
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    addPoint(point) {

        for (var i = 0; i < this.points.length; i++) {
            point.distanceTo(this.points[i]);

        }
        this.points.push(point);

    }

    rotate(matrix)
    {
        for(var i = 0; i < this.points; i++)
        {
            this.points[i] = this.points[i].dotProduct(matrix);
        }
    }

    transform(trans)
    {
        for(var i = 0; i < this.points; i++)
        {
            var p = this.points[i];
            this.points[i] = new point(
                p.x + trans.x,
                p.y + trans.y,
                p.z + trans.z
            );
        }
    }

    overlaps(scanner) {

        var transform = null;
        var rotationPoint = null;
        var originPoint = null;

        for (var p = 0; p < this.points.length; p++) {
            for (var q = 0; q < scanner.points.length; q++) {

                var p1 = this.points[p];
                var p2 = scanner.points[q];
                
                if (p1.equalTo(p2)) {
                    console.log("match", p1.toString(), p2.toString());
                    // remove point from other scanner

                    // first match is used to calculate to transform
                    if (originPoint == null) {
                        rotationPoint = p2;
                        originPoint = p1;
                    }
                    else {
                        // second match is used to calculate to rotation after transform
                        // use the first point as the center for the rotation 
                        // and check with which rotation the second point is aligned correctly


                        // the expectedpoint calculation goes wrong...
                        
                        var deltaX = p1.x - originPoint.x;
                        var deltaY = p1.y - originPoint.y;
                        var deltaZ = p1.z - originPoint.z;

                        var expectedPoint = new point(
                            rotationPoint.x + deltaX,
                            rotationPoint.y + deltaY,
                            rotationPoint.z + deltaZ,
                        )

                        // point as seen from rotationpoint
                        var normalizedPoint = new point(
                            p2.x - rotationPoint.x,
                            p2.y - rotationPoint.y,
                            p2.z - rotationPoint.z
                        );
                             
                        // https://en.wikipedia.org/wiki/Rotation_matrix
                        var matrices = calcTransformMatrices();
                        var match = null;
                        for (var m = 0; m < matrices.length; m++)
                        {
                            match = matrices[m];
                            var testPoint = normalizedPoint.dotProduct(match);

                            // add rotationPoint transform
                            testPoint = new point(
                                 testPoint.x + rotationPoint.x,
                                 testPoint.y + rotationPoint.y,
                                 testPoint.z + rotationPoint.z
                            )

                            if (expectedPoint.same(testPoint))
                            {
                                console.log("found matrix", match);
                                break;
                            }
                        }

                        // calculate the correct positon for the scanner
                        // rotate the found point with the matrix and calc the transform
                        

                        // how to find the start point for the scanner?
                        
                        // the origin point should be adjsuted with the same matrix and calculated
                        // then the transform matrix should be calculated again

                        var origin = new point(
                            0 - rotationPoint.x ,
                            0 - rotationPoint.y ,
                            0 - rotationPoint.z,
                        )
                        origin = origin.dotProduct(match); // as seen from rotation point

                        // and the rotation point to calculate the position from the view of the original origin
                        origin = new point(
                            origin.x + originPoint.x,
                            origin.y + originPoint.y,
                            origin.z + originPoint.z,
                        )
                        
                        console.log("Scanner origin: " + origin.toString());

                        // rotate all points
                        //scanner.rotate(match);
                        //scanner.transform(trans);
                        // transform all points
                        
                        // add them to the first scanner rotated if not a double
                        
                    }


                }
            }
        }
    }

    uniqueBeacons() {
        var total = 0;
        for (var i = 0; i < this.points.length; i++) {
            total += this.points[i].duplicate ? 0 : 1;
        }
        return total;
    }

}

class point {

    distances = [];
    duplicate = false;

    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    distanceTo(otherPoint) {
        var distX = Math.pow(this.x - otherPoint.x, 2);
        var distY = Math.pow(this.y - otherPoint.y, 2);
        var distZ = Math.pow(this.z - otherPoint.z, 2);

        var distance = Math.sqrt(distX + distY + distZ);
        distance *= 1000;
        distance = Math.round(distance);
        distance /= 1000;

        this.distances.push(distance);
        otherPoint.distances.push(distance);
    }

    equalTo(otherPoint) {
        var matches = 0;

        for (var i = 0; i < this.distances.length; i++) {
            var distance = this.distances[i];
            if (otherPoint.distances.includes(distance)) {
                matches++;
            }
        }

        //if (matches > 0)
        //    console.log(matches);

        //return (matches >= 11); // to find 12 matches we need this beacon to match plus 11 others
        return matches > 1;
    }

    dotProduct(matrix) {
        var a = (matrix[0] * this.x) + (matrix[1] * this.y) + (matrix[2] * this.z);
        var b = (matrix[3] * this.x) + (matrix[4] * this.y) + (matrix[5] * this.z);
        var c = (matrix[6] * this.x) + (matrix[7] * this.y) + (matrix[8] * this.z);

        return new point(a, b, c);
    }

    same(otherPoint)
    {
        return this.x == otherPoint.x && this.y == otherPoint.y && this.z == otherPoint.z;
    }

    toString()
    {
        return "[" + this.x + ", "+ this.y + ", "+ this.z + "]";
    }

}


try {
    const data = fs.readFileSync(path.dirname(__filename) + '/Day19/in.example2.txt', 'utf8')
    var lIn = data.split("\n");


    //var mDot = matrixDot([1,2,3,4,5,6,7,8,9], [1,2,1,2,4,6,7,2,5]);
    //console.log(mDot);
    // var matrices = calcTransformMatrices();

    // var p1 = new point(1,0,0);
    // var p2 = new point(0,1,0);
    // var p3 = new point(0,0,1);
    // for(var i =0; i < matrices.length; i++)     
    // {
    //     var m = matrices[i];
    //     console.log(p1.dotProduct(m).toString(), p2.dotProduct(m).toString(), p3.dotProduct(m).toString())
    // }

   
    this.scanners = [];
    currentScanner = new Scanner(0, 0, 0);
    this.scanners.push(currentScanner);

    for (var i = 0; i < lIn.length; i++) {
        var line = lIn[i].trim();
        if (line.startsWith("---"))
            continue;
        else if (line.length == 0) {
            currentScanner = new Scanner(0, 0, 0);
            this.scanners.push(currentScanner);
        }
        else {
            var vals = line.split(",").map((a) => parseInt(a));
            var p = new point(...vals);
            currentScanner.addPoint(p);
        }
    }

    //console.log(this.scanners);

    for (var x = 0; x < this.scanners.length; x++) {
        for (var y = x + 1; y < this.scanners.length; y++) {
            console.log("Checking scanners", x, y);
            this.scanners[x].overlaps(this.scanners[y]);
        }
    }

    var count = 0;
    for (var x = 0; x < this.scanners.length; x++) {
        count += this.scanners[x].uniqueBeacons();
    }
    console.log(count);


} catch (err) {
    console.error(err)
}