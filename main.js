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
var gw = 30;
var gh = 30;
//padding around grid
var size = 20;
//size of canvas
var cw = gw * size;
var ch = gh * size;

var min_length = 2;

var colors = ["#ffffff", "#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628"];
var colors_total = 6;

var grid = new Array(gw);
var score = 0;

for (var x = 0; x < gw; x++) {
    grid[x] = new Array(gh);
    for (var y = 0; y < gh; y++) {
        grid[x][y] = Math.floor(Math.random() * (colors_total - 1)) + 1;
    }
}

function drawBoard(canvas, context) {
    context.clearRect(0, 0, cw, ch);

    // for (var x = 0; x <= bw; x += 40) {
    //     context.moveTo(0.5 + x + p, p);
    //     context.lineTo(0.5 + x + p, bh + p);
    // }


    // for (var x = 0; x <= bh; x += 40) {
    //     context.moveTo(p, 0.5 + x + p);
    //     context.lineTo(bw + p, 0.5 + x + p);
    // }

    for (var x = 0; x < gw; x++) {
        for (var y = 0; y < gh; y++) {
            context.fillStyle = colors[grid[x][y]];
            context.fillRect(x * size, y * size, size - 1, size - 1);
        }
    }

    // console.log(getMousePos(canvas))

    // context.strokeStyle = "black";
    // context.stroke();
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
    if (x < gw - 1) n.push([x + 1, y]);
    if (y < gh - 1) n.push([x, y + 1]);
    return n
}

function bfs(from, visited) {
    var a = neighbors(from[0], from[1]).forEach(function (nn) {
        if (grid[nn[0]][nn[1]] == grid[from[0]][from[1]] && !visited.contains(nn)) {
            visited.push(nn);
            bfs(nn, visited)
        }
        // return visited
    });
    return visited
}

window.onload = function () {
    var canvas = document.getElementById('canvas');
    canvas.setAttribute("width", cw);
    canvas.setAttribute("height", ch);
    var score_s = document.getElementById('score');
    var context = canvas.getContext("2d");
    canvas.addEventListener('mousemove', function (evt) {
        drawBoard(canvas, context);
        var mousePos = getMousePos(canvas, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        var sq = [Math.floor(mousePos.x / size), Math.floor(mousePos.y / size)];
        if (grid[sq[0]][sq[1]] !== 0) {
            var group = bfs(sq, [sq]);
            // var group = bfs([0, 0], [[0, 0]]);
            if (group.length >= min_length) {
                group.forEach(function (sqn) {
                    context.fillStyle = colors[grid[sqn[0]][sqn[1]]];
                    context.fillRect(sqn[0] * size - size * 0.25, sqn[1] * size - size * 0.25, size * 1.5, size * 1.5);
                })
            }
        }
        // console.log(group);
    }, false);
    canvas.addEventListener('click', function (evt) {
        var mousePos = getMousePos(canvas, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        var sq = [Math.floor(mousePos.x / size), Math.floor(mousePos.y / size)];

        if (grid[sq[0]][sq[1]] !== 0) {
            var group = bfs(sq, [sq]);
            // var group = bfs([0, 0], [[0, 0]]);

            if (group.length >= min_length) {
                // group.forEach(function (sqn) {
                //     grid[sqn[0]][sqn[1]] = 0;
                //     context.fillStyle = colors[grid[sqn[0]][sqn[1]]];
                //     context.fillRect(sqn[0] * 20 - 5, sqn[1] * 20 - 5, 30, 30);
                // });
                group.sort(function (a, b) {
                    return a[1] - b[1]
                });

                group.forEach(function (sqn) {
                    // console.log(sqn);
                    // grid[sqn[0]][sqn[1]] = 0;
                    for (var y = sqn[1]; y >= 0; y--) {
                        grid[sqn[0]][y] = grid[sqn[0]][y - 1]
                    }
                    grid[sqn[0]][0] = 0;
                    // context.fillStyle = colors[grid[sqn[0]][sqn[1]]];
                    // context.fillRect(sqn[0] * 20 - 5, sqn[1] * 20 - 5, 30, 30);
                });

                score += Math.pow(2, group.length);
                score_s.innerHTML = score

            }
        }
        drawBoard(canvas, context);
        // console.log(group);
    }, false);
    drawBoard(canvas, context);
};