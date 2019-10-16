var graphContainer;
var visualGraph;
var graph;

var delay = 50;
var cancel = false;
var sortMode = 0;

var cellDimension = 25;

setupGraph = function () {
    visualGraph.children().remove();
    graph = Array(Math.floor(graphContainer.height() / cellDimension));
    for (let i = 0; i < graph.length; i++) {
        graph[i] = Array(Math.floor(graphContainer.width() / cellDimension));
        let row = visualGraph[0].insertRow(i);
        for (let j = 0; j < graph[i].length; j++) {
            let cell = row.insertCell(j);
            cell.innerHTML = "";
            cell.className = "cell";
        }
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

$(document).ready(function () {
    setUpCallbacks();
    setupGraph();
})

setUpCallbacks = function () {
    visualGraph = $('#graph');
    graphContainer = $('#main');
    console.log(graphContainer.height());
    $('#play').on('click', function (event) {
        // play();
    });
    $('#restart').on('click', function (event) {
        // restart();
    });

    visualGraph.children().children().children()

    $('.dropdown-menu > ').on('click', function (event) {
        $('.dropdown-menu > ').removeClass('active');
        $(this).addClass('active');
        sortMode = $(this).index();
        // $('#sort-dropdown').text(this.text);
    });
}

$(window).resize(function () {
    setupGraph();
})