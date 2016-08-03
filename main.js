Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

Array.prototype.contains = function (elem) {
    for (var i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i].equals(elem)) {
            return true;
        }
    }
    return false;
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

//grid width and height
var bw = 600;
var bh = 600;
//padding around grid
var p = 0;
//size of canvas
var cw = bw + (p * 2) + 1;
var ch = bh + (p * 2) + 1;

var colors = ["#ffffff", "#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628"];

var grid = new Array(30);

for (var x = 0; x < 30; x++) {
    grid[x] = new Array(30);
    for (var y = 0; y < 30; y++) {
        grid[x][y] = Math.floor(Math.random() * (colors.length - 1)) + 1;
    }
}

function drawBoard(canvas, context) {
    context.clearRect(0, 0, 600, 600);

    // for (var x = 0; x <= bw; x += 40) {
    //     context.moveTo(0.5 + x + p, p);
    //     context.lineTo(0.5 + x + p, bh + p);
    // }


    // for (var x = 0; x <= bh; x += 40) {
    //     context.moveTo(p, 0.5 + x + p);
    //     context.lineTo(bw + p, 0.5 + x + p);
    // }

    for (var x = 0; x < 30; x++) {
        for (var y = 0; y < 30; y++) {
            context.fillStyle = colors[grid[x][y]];
            context.fillRect(x * 20, y * 20, 19, 19);
        }
    }

    // console.log(getMousePos(canvas))

    context.strokeStyle = "black";
    context.stroke();
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function neighbors(x, y) {
    var n = [];
    if (x > 0) n.push([x - 1, y]);
    if (y > 0) n.push([x, y - 1]);
    if (x < 30) n.push([x + 1, y]);
    if (y < 30) n.push([x, y + 1]);
    return n
}

function bfs(from, visited) {
    var a = neighbors(from[0], from[1]).forEach(function (nn) {
        if (grid[nn[0]][nn[1]] == grid[from[0]][from[1]] && !visited.contains(nn)) {
            visited.push(nn);
            bfs(nn, visited)
        }
        return visited
    });
    return visited
}

window.onload = function () {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext("2d");
    canvas.addEventListener('mousemove', function (evt) {
        drawBoard(canvas, context);
        var mousePos = getMousePos(canvas, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        var sq = [Math.floor(mousePos.x / 20), Math.floor(mousePos.y / 20)];
        if (grid[sq[0]][sq[1]] !== 0) {
            var group = bfs(sq, [sq]);
            // var group = bfs([0, 0], [[0, 0]]);
            group.forEach(function (sqn) {
                context.fillStyle = colors[grid[sqn[0]][sqn[1]]];
                context.fillRect(sqn[0] * 20 - 5, sqn[1] * 20 - 5, 30, 30);
            })
        }
        // console.log(group);
    }, false);
    canvas.addEventListener('click', function (evt) {
        var mousePos = getMousePos(canvas, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        var sq = [Math.floor(mousePos.x / 20), Math.floor(mousePos.y / 20)];

        var group = bfs(sq, [sq]);
        // var group = bfs([0, 0], [[0, 0]]);

        if (group.length > 1) {
            group.forEach(function (sqn) {
                grid[sqn[0]][sqn[1]] = 0;
                // context.fillStyle = colors[grid[sqn[0]][sqn[1]]];
                // context.fillRect(sqn[0] * 20 - 5, sqn[1] * 20 - 5, 30, 30);
            });
            group.forEach(function (sqn) {
                grid[sqn[0]][sqn[1]] = 0;
                for(var y = sqn[1]; y > 0; y--) {
                    grid[sqn[0]][y] = grid[sqn[0]][y - 1]
                }
                grid[sqn[0]][0] = 0;
                // context.fillStyle = colors[grid[sqn[0]][sqn[1]]];
                // context.fillRect(sqn[0] * 20 - 5, sqn[1] * 20 - 5, 30, 30);
            })
        }
        drawBoard(canvas, context);
        // console.log(group);
    }, false);
    drawBoard(canvas, context);
};