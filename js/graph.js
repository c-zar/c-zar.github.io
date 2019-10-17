var graphContainer;
var visualGraph;
var graph;

var delay = 50;
var cancel = false;
var sortMode = 0;

var cellDimension = 25;

$(document).ready(function () {
    visualGraph = $('#graph');
    graphContainer = $('#main');
    setupGraph();
    setupButtonCallbacks();
    setupCellCallbacks();
})

//creates the cells for tables
setupGraph = function () {
    visualGraph.children().remove();
    graph = Array(Math.floor(graphContainer.height() / cellDimension));
    for (let i = 0; i < graph.length; i++) {
        graph[i] = Array(Math.floor(graphContainer.width() / cellDimension));
        let row = visualGraph[0].insertRow(i);
        for (let j = 0; j < graph[i].length; j++) {
            let cell = row.insertCell(j);
            cell.innerHTML = "";
            cell.className = "cell ";
        }
    }
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

setupCellCallbacks = function(){
    var mousePressed = false;
    var currCell;

    $('td').mousedown(function(event){
        event.preventDefault();
        mousePressed = true;
        if(currCell != this){
            $(this).toggleClass("wall")
            currCell = this;
        }
    });

    $('td').mousemove(function(event) {
        if(mousePressed && currCell != this){
            $(this).toggleClass("wall")
            currCell = this;
        }     
    })

    $(document).mouseup(function(event) {
        mousePressed = false;
        currCell = null;
	});
}


$(window).resize(function () {
    setupGraph();
})

// Helper methods
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}