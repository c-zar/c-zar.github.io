//global variables
var grid;
var cancel = true;
var searchMode = 0;

var cellDimension = 25; //px

//variables for input elements
var playbtn, stopbtn, resetbtn;

//waits for the page to load before any queries
$(document).ready(function () {
    setupAll();
})

// gets the element where graph will be inserted and starts creation
function setupAll() {
    visualGraph = $('#graph');
    setupButtonCallbacks();
    reset();
}

// starts the asynchrounous pathfinding algorithm
// button disabled after because only 1 should be running at a time
function play() {
    playbtn.prop('disabled', true);
    cancel = false;
    switch (searchMode) {
        case 0:
            BFS();
            break;
        case 1:
            DFS();
            break;
        default:
            break;
    }
}

// function used to end the visualization and clear the graph
function stop() {
    cancel = true;
    stopSearch();
    playbtn.prop('disabled', false);
}

//function to reinitialize the grid cells
function reset() {
    cancel = true;
    setupGraph();
    playbtn.prop('disabled', false);
}


// mouse callbacks for manipulating cells
setupGraphCallbacks = function () {

    // tracking variables
    var mousePressed = false;
    var startPressed = false;
    var endPressed = false;
    var currCell;

    $('td').mousedown(function (event) {
        if (cancel) {
            event.preventDefault();
            mousePressed = true;
            if ($(this).hasClass("start")) { //start cell pressed
                startPressed = true;
                currCell = this;
            } else if ($(this).hasClass("end")) { //target cell pressed
                endPressed = true;
                currCell = this;
            } else if (currCell != this) {
                $(this).toggleClass("cell wall"); //normal cell/wall pressed
                currCell = this;
            }
        }
    });

    $('td').mousemove(function (event) {
        if (mousePressed && currCell != this) {
            if (startPressed && !$(this).hasClass("wall") && !$(this).hasClass("end")) { //start cell can only be moved to normal cells
                $(currCell).toggleClass("start fa fa-car");
                $(this).toggleClass("start fa fa-car");
                currCell = this;
            } else if (endPressed && !$(this).hasClass("wall") && !$(this).hasClass("start")) { //end cell can only be moved to normal cells
                $(currCell).toggleClass("end fa fa-dot-circle-o");
                $(this).toggleClass("end fa fa-dot-circle-o");
                currCell = this;
            } else if (!startPressed && !endPressed && !$(this).hasClass("end") && !$(this).hasClass("start") &&
                !$(this).hasClass("visited") && !$(this).hasClass("path")) { //toggle cells/walls if mouse held over
                $(this).toggleClass("cell wall");
                currCell = this;
            }
        }

    })

    // reset all variables when mouse button released
    $(document).mouseup(function (event) {
        mousePressed = false;
        startPressed = false;
        endPressed = false;
        currCell = null;
    });
}

// clear graph on window resize
$(window).resize(function () {
    reset();
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
    setupGraphCallbacks();
}

//resets the grid without clearing walls
stopSearch = function () {
    $('.visited').toggleClass("visited cell");
    $('.path').toggleClass("path cell");
}

// sets up callbacks for the buttons and menu
setupButtonCallbacks = function () {

    playbtn = $('#play');
    playbtn.on('click', function (event) {
        play();
    });

    stopbtn = $('#stop');
    stopbtn.on('click', function (event) {
        stop();
    });

    resetbtn = $('#reset');
    resetbtn.on('click', function (event) {
        reset();
    });

    $('.dropdown-menu > ').on('click', function (event) {
        $('.dropdown-menu > ').removeClass('active');
        $(this).addClass('active');
        searchMode = $(this).index();
        // $('#sort-dropdown').text(this.text);
    });

}

/*
Pathfinding algorithms
*/

// breadth first search
// unweighted, guarantees shortest path if one exists
BFS = async function () {
    let queue = []; //queue used to store visited nodes

    //2d array holding the previous cells. used to keep track of shortest path.
    let prev = new Array(grid.length).fill(0).map(() => new Array(grid[0].length).fill(0));
    // console.log(prev);

    queue.push($('.start'));
    $('.start').toggleClass('cell visited'); //tracking visited cells by classname
    let currCell; //used in the end to see if target cell was found
    while (queue.length > 0) {
        if (cancel) //used to stop search if cancelled
            return;

        currCell = queue.shift(); //FIFO
        if ($(currCell).hasClass("end")) //if target found, stop search
            break;

        //cell position in graph
        let Ypos = $(currCell).parent().index();
        let Xpos = $(currCell).index();
        // console.log($(currCell)[0]);
        // console.log(Ypos + "," + Xpos);

        //visit the neighbors in cardinal order
        let currNeightbor;
        if (Ypos - 1 >= 0) { //  North
            if ($($('#graph')[0].rows[Ypos - 1].cells[Xpos]).hasClass("cell")) {
                currNeightbor = $($('#graph')[0].rows[Ypos - 1].cells[Xpos]);
                prev[Ypos - 1][Xpos] = $(currCell);
                $(currNeightbor).toggleClass("cell visited");
                queue.push(currNeightbor);
            }
        }

        if (Xpos + 1 < grid[0].length) { //  East
            if ($($('#graph')[0].rows[Ypos].cells[Xpos + 1]).hasClass("cell")) {
                currNeightbor = $($('#graph')[0].rows[Ypos].cells[Xpos + 1]);
                prev[Ypos][Xpos + 1] = $(currCell);
                $(currNeightbor).toggleClass("cell visited");
                queue.push(currNeightbor);
            }
        }

        if (Ypos + 1 < grid.length) { //  South
            if ($($('#graph')[0].rows[Ypos + 1].cells[Xpos]).hasClass("cell")) {
                currNeightbor = $($('#graph')[0].rows[Ypos + 1].cells[Xpos]);
                prev[Ypos + 1][Xpos] = $(currCell);
                $(currNeightbor).toggleClass("cell visited");
                queue.push(currNeightbor);
            }
        }

        if (Xpos - 1 >= 0) { //  West
            if ($($('#graph')[0].rows[Ypos].cells[Xpos - 1]).hasClass("cell")) {
                currNeightbor = $($('#graph')[0].rows[Ypos].cells[Xpos - 1]);
                prev[Ypos][Xpos - 1] = $(currCell);
                $(currNeightbor).toggleClass("cell visited");
                queue.push($(currNeightbor));
            }
        }

        await sleep(1); //sleep to allow animations time to load
    }

    // if target found, highlight the shortest path
    if ($(currCell).hasClass("end")) {
        await sleep(500); //sleep to allow search animations to

        let shortestPath = [];
        let pathCell;
        // traverse the prev array from the end postion to the start pushing each cell on to a stack
        while (currCell) {
            if (cancel) //used to stop search if cancelled
                return;
            shortestPath.push(currCell);
            currCell = prev[$(currCell).parent().index()][$(currCell).index()];
        }
        //path was found backwards so we reverse
        while (shortestPath.length > 0) {
            if (cancel) //used to stop search if cancelled
                return;
            pathCell = shortestPath.pop();
            $(pathCell).toggleClass("visited path")
            await sleep(10);
        }
    }
    // if($(currCell).hasClass("end")){
    //     // while(!$(currCell).hasClass("start")){
    //     //     $(currCell).toggleClass("visited path");
    //     //     currCell = prev[$(currCell).parent().index()][$(currCell).index()]
    //     // }
    // }
    // console.log(prev);
}

// Depth First Search
DFS = async function () {
    let stack = []; //stack used to store visited nodes

    //2d array holding the previous cells. used to keep track of shortest path.
    let prev = new Array(grid.length).fill(0).map(() => new Array(grid[0].length).fill(0));
    // console.log(prev);

    stack.push($('.start')); //push the start node
    $('.start').toggleClass('cell visited'); //tracking visited cells by classname
    let currCell; //used in the end to see if target cell was found
    while (stack.length > 0) {
        console.log(stack);
        if (cancel) //used to stop search if cancelled
            return;

        currCell = stack[stack.length - 1]; //FIFO
        if ($(currCell).hasClass("end")) //if target found, stop search
            break;

        //cell position in graph
        let Ypos = $(currCell).parent().index();
        let Xpos = $(currCell).index();
        // console.log($(currCell)[0]);
        // console.log(Ypos + "," + Xpos);

        //visit the neighbors in cardinal order
        let currNeightbor;
        if (Ypos - 1 >= 0 && $($('#graph')[0].rows[Ypos - 1].cells[Xpos]).hasClass("cell")) { //  North
            currNeightbor = $($('#graph')[0].rows[Ypos - 1].cells[Xpos]);
            prev[Ypos - 1][Xpos] = $(currCell);
            $(currNeightbor).toggleClass("cell visited");
            stack.push(currNeightbor);
        } else if (Xpos + 1 < grid[0].length && $($('#graph')[0].rows[Ypos].cells[Xpos + 1]).hasClass("cell")) { //  East
            currNeightbor = $($('#graph')[0].rows[Ypos].cells[Xpos + 1]);
            prev[Ypos][Xpos + 1] = $(currCell);
            $(currNeightbor).toggleClass("cell visited");
            stack.push(currNeightbor);
        } else if (Ypos + 1 < grid.length && $($('#graph')[0].rows[Ypos + 1].cells[Xpos]).hasClass("cell")) { //  South
            currNeightbor = $($('#graph')[0].rows[Ypos + 1].cells[Xpos]);
            prev[Ypos + 1][Xpos] = $(currCell);
            $(currNeightbor).toggleClass("cell visited");
            stack.push(currNeightbor);
        } else if (Xpos - 1 >= 0 && $($('#graph')[0].rows[Ypos].cells[Xpos - 1]).hasClass("cell")) { //  West
            currNeightbor = $($('#graph')[0].rows[Ypos].cells[Xpos - 1]);
            prev[Ypos][Xpos - 1] = $(currCell);
            $(currNeightbor).toggleClass("cell visited");
            stack.push($(currNeightbor));
        } else {
            // if the node has no unvisited neighbors, remove it from the stack
            stack.pop();
        }
        await sleep(1); //sleep to allow animations time to load
    }

    // if target found, highlight the shortest path
    if ($(currCell).hasClass("end")) {
        await sleep(500); //sleep to allow search animations to
        let shortestPath = [];
        let pathCell;
        // traverse the prev array from the end postion to the start pushing each cell on to a stack
        while (currCell) {
            if (cancel) //used to stop search if cancelled
                return;
            shortestPath.push(currCell);
            currCell = prev[$(currCell).parent().index()][$(currCell).index()];
        }
        //path was found backwards so we reverse
        while (shortestPath.length > 0) {
            if (cancel) //used to stop search if cancelled
                return;
            pathCell = shortestPath.pop();
            $(pathCell).toggleClass("visited path")
            await sleep(10);
        }
    }
}

// Helper methods

//used to pause during loops to allow animations to start at different times
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}