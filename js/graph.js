var grid;

var delay = 50;
var cancel = false;
var sortMode = 0;

var cellDimension = 25;

var start, end;


$(document).ready(function () {
    visualGraph = $('#graph');
    setupGraph();
    setupButtonCallbacks();
    breadthFirstSearch();
})

//creates the cells for tables
setupGraph = function () {
    var visualGraph = $('#graph');
    var graphContainer = $('#main');
    visualGraph.children().remove();
    grid = Array(Math.floor(graphContainer.height() / cellDimension));
    for (let i = 0; i < grid.length; i++) {
        grid[i] = Array(Math.floor(graphContainer.width() / cellDimension));
        let row = visualGraph[0].insertRow(i);
        for (let j = 0; j < grid[i].length; j++) {
            let cell = row.insertCell(j);
            grid[i][j] = cell;
            if (i == 1 && j == 1) {
                cell.className = "cell start fa fa-car";
            } else if (i == grid.length - 2 && j == grid[i].length - 2) {
                cell.className = "cell end fa fa-dot-circle-o";
            } else {
                cell.className = "cell";
            }
        }
    }
    console.log(grid);
    setupGraphCallbacks();
}

setupButtonCallbacks = function () {

    $('#play').on('click', function (event) {
        // play();
    });
    $('#restart').on('click', function (event) {
        // restart();
    });

    $('.dropdown-menu > ').on('click', function (event) {
        $('.dropdown-menu > ').removeClass('active');
        $(this).addClass('active');
        sortMode = $(this).index();
        // $('#sort-dropdown').text(this.text);
    });

}

setupGraphCallbacks = function () {
    var mousePressed = false;
    var startPressed = false;
    var endPressed = false;
    var currCell;

    $('td').mousedown(function (event) {
        event.preventDefault();
        mousePressed = true;
        // console.log($(this).parent().index() + "," + $(this).index());
        if ($(this).hasClass("start")) {
            startPressed = true;
            currCell = this;
        } else if ($(this).hasClass("end")) {
            endPressed = true;
            currCell = this;
        } else if (currCell != this) {
            $(this).toggleClass("cell wall");
            currCell = this;
        }
    });

    $('td').mousemove(function (event) {
        if (mousePressed && currCell != this) {
            if (startPressed && !$(this).hasClass("wall") && !$(this).hasClass("end")) {
                $(currCell).toggleClass("start fa fa-car");
                $(this).toggleClass("start fa fa-car");
                currCell = this;
            } else if (endPressed && !$(this).hasClass("wall") && !$(this).hasClass("start")) {
                $(currCell).toggleClass("end fa fa-dot-circle-o");
                $(this).toggleClass("end fa fa-dot-circle-o");
                currCell = this;
            } else if (!startPressed && !endPressed && !$(this).hasClass("end") && !$(this).hasClass("start")) {
                $(this).toggleClass("cell wall");
                currCell = this;
            }
        }

    })

    $(document).mouseup(function (event) {
        mousePressed = false;
        startPressed = false;
        endPressed = false;
        currCell = null;
    });
}


$(window).resize(function () {
    setupGraph();
})

breadthFirstSearch = async function () {
    let queue = [];
    let prev = Array(grid.length).fill(Array(grid[0].length));
    queue.push($('.start'));
    $('.start').toggleClass('cell visited');

    while (queue.length > 0) {
        let currCell = queue.shift();
        if ($(currCell).hasClass("end"))
            break;
        let Ypos = $(currCell).parent().index();
        let Xpos = $(currCell).index();

        //visit the neighbors
        let currNeightbor;
        if (Ypos - 1 >= 0) { //  North
            if ($($('#graph')[0].rows[Ypos - 1].cells[Xpos]).hasClass("cell")) {
                currNeightbor = $($('#graph')[0].rows[Ypos - 1].cells[Xpos]);
                $(currNeightbor).toggleClass("cell visited fa fa-arrow-down");
                queue.push(currNeightbor);
                prev[Ypos - 1][Xpos] = currCell;
            }
        }

        if (Xpos + 1 < grid[0].length) { //  East
            if ($($('#graph')[0].rows[Ypos].cells[Xpos + 1]).hasClass("cell")) {
                currNeightbor = $($('#graph')[0].rows[Ypos].cells[Xpos + 1]);
                $(currNeightbor).toggleClass("cell visited fa fa-arrow-left");
                queue.push(currNeightbor);
                prev[Ypos][Xpos + 1] = currCell;
            }
        }

        if (Ypos + 1 < grid.length) { //  South
            if ($($('#graph')[0].rows[Ypos + 1].cells[Xpos]).hasClass("cell")) {
                currNeightbor = $($('#graph')[0].rows[Ypos + 1].cells[Xpos]);
                $(currNeightbor).toggleClass("cell visited fa fa-arrow-up");
                queue.push(currNeightbor);
                prev[Ypos + 1][Xpos] = currCell;

            }
        }

        if (Xpos - 1 >= 0) { //  West
            if ($($('#graph')[0].rows[Ypos].cells[Xpos - 1]).hasClass("cell")) {
                currNeightbor = $($('#graph')[0].rows[Ypos].cells[Xpos - 1]);
                $(currNeightbor).toggleClass("cell visited fa fa-arrow-right");
                queue.push($(currNeightbor));
                prev[Ypos][Xpos - 1] = currCell;
            }
        }

        await sleep(5);

    }
    console.log(prev);
}

// Helper methods
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}