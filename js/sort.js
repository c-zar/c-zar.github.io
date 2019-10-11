var array = [];
let fr = 60;
var sorter;
var dimension, canvas, curr, comp, parent;

function setup() {
    parent = document.getElementById('main');
    canvas = createCanvas(dimension, dimension);
    resize();
}

//resizes the canvas to be the biggest square it can be
function resize() {
    dimension = min(parent.offsetWidth, parent.offsetHeight);
    resizeCanvas(dimension, dimension);
    init();
}

function init() {
    canvas.parent('canvas');
    fill(255);
    frameRate(fr);
    background(255);
    curr = 0;
    comp = 1;

    //init array values based on height of screen
    array.length = (int)(dimension / 10);
    for (i = 0; i < array.length; i++) {
        array[i] = ((i + 1) / array.length) * dimension;
    }

    //shuffle values
    for (j = 0; j < array.length; j++) {
        a = floor(random(array.length));
        b = array[j];
        array[j] = array[a];
        array[a] = b;
    }
    sorter = partition(0, array.length - 1);
    redraw();
}


function draw() {
    dimension = min(parent.offsetWidth, parent.offsetHeight);
    background(255);
    strokeWeight(4);
    stroke(255);
    fill('#130b15');
    for (let l = 0; l < array.length; l++) {

        //change keeps track of current index and index we are comparing to
        if (l == curr) {
            fill('#2aa84c');
        } else if (l == comp) {
            fill('#a82a67')
        } else {
            fill('#130b15');
        }

        //draw rectangle (xpos, ypos, width, height);
        //canvas 0,0 = top left
        rect(l * (width / array.length), height + 4, (width / array.length), -array[l]);
    }
    if (sorter.next().done) {
        noLoop();
    }
}

function swap(i, j) {
    let tmp = array[i]; //Temporary variable to hold the current number
    array[i] = array[j];
    array[j] = tmp;
}

function* bubblesort() {
    for (let x = 0; x < array.length - 1; x++) {
        for (let z = 0; z < array.length - x - 1; z++) {
            curr = z;
            comp = z + 1;
            yield;                              //yield to so we can redraw array
            if (array[z] > array[z + 1]) {
                //Swap the numbers
                swap(z, z + 1)
            }
            curr = z + 1;
            comp = z;
            yield;
        }
    }
}

function* partition(low, high) {
    let pivot = array[high];
    let j = low - 1;
    for (let i = low; i < high; i++) {
        if (array[i] < pivot) {
            j++;
            swap(i, j);
        }
        yield;                              //yield to so we can redraw array
    }
    swap(i + 1, high);
    return (i + 1);
}

function* quicksort(low, high) {
    if (low < high) {
        mid = partition(low,high);
        quicksort(low, mid - 1);
        quicksort(mid + 1, high);
    }
}

function windowResized() {
    resize();
}

function pause() {
    noLoop();
}

function play() {
    loop();
}

function step() {
    redraw();
}

function restart() {
    resize();
}
