var array = [];
let fr = 60;
var sorter;
var dimension, canvas, curr, comp, parent;

function setup() {
    parent = document.getElementById('main');
    canvas = createCanvas(dimension, dimension);
    resize();
    init();
}

function resize() {
    dimension = min(parent.offsetWidth, parent.offsetHeight);
    resizeCanvas(dimension, dimension);
}

function init() {
    canvas.parent('canvas');
    fill(255);
    frameRate(fr);
    background(255);

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
    sorter = bubblesort();
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

function* bubblesort() {
    for (let x = 0; x < array.length - 1; x++) {
        for (let z = 0; z < array.length - x - 1; z++) {
            curr = z;
            comp = z + 1;
            yield;                              //yield to so we can redraw array
            if (array[z] > array[z + 1]) {
                //Swap the numbers
                let tmp = array[z]; //Temporary variable to hold the current number
                array[z] = array[z + 1]; //Replace current number with adjacent number
                array[z + 1] = tmp;
            }
        }
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