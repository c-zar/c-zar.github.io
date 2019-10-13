var mainArray = [];
var arrayState = [];
var delay = 50;
var cancel = false;

var dimension, canvas, parent;

/*
    P5 js specific code
*/

function setup() {
    parent = document.getElementById('main');
    canvas = createCanvas(dimension, dimension);
    canvas.parent('canvas');
    resize();
}

//resizes the canvas to be the biggest square it can be
function resize() {
    dimension = min(parent.offsetWidth, parent.offsetHeight);
    resizeCanvas(dimension, dimension);
    initArray();
}

function initArray() {
    //init array values based on height of screen
    mainArray = new Array(floor(dimension / 20));
    arrayState = Array(mainArray.length).fill(0);
    for (i = 0; i < mainArray.length; i++) {
        mainArray[i] = ((i + 1) / mainArray.length) * dimension;
    }

    //shuffle values
    for (j = 0; j < mainArray.length; j++) {
        a = floor(random(mainArray.length));
        b = mainArray[j];
        mainArray[j] = mainArray[a];
        mainArray[a] = b;
    }
    redraw();
}

function draw() {
    background(255);
    strokeWeight(4);
    stroke(255);
    for (let l = 0; l < mainArray.length; l++) {

        //change keeps track of current index and index we are comparing to
        if (arrayState[l] == 1) {
            fill('#2aa84c');
        } else if (arrayState[l] == 2) {
            fill('#a82a67')
        } else {
            fill('#130b15');
        }
        rect(l * (width / mainArray.length), height + 4, (width / mainArray.length), -mainArray[l]);
    }
}

/*
    Functions for control
*/

function windowResized() {
    resize();
}

function play() {
    quicksort(mainArray, 0, mainArray.length - 1);
}

function restart() {
    cancel = true;
    resize();
}

/*
    Sorting Functions
*/

async function bubblesort(arr) {
    for (let x = 0; x < arr.length - 1; x++) {
        for (let z = 0; z < arr.length - x - 1; z++) {

            //check if sort was cancelled
            if (cancel) {
                cancel = false;
                return;
            }

            //highlights the current and compare indexes
            arrayState[z] = 1;
            arrayState[z + 1] = 2;

            if (arr[z] > arr[z + 1]) {
                //Swap the numbers
                swap(arr, z, z + 1)
            }

            // sleep to give canvas timet to redraw
            await sleep(delay);

            // clears the previous state
            arrayState.fill(0);
        }
    }
    arrayState.fill(0);
}

async function partition(arr, low, high) {
    arrayState[high] = 1;
    let pivotVal = arr[high];
    let pivotIndex = low;
    for (let i = low; i < high; i++) {
        if (arr[i] < pivotVal) {
            await swap(arr, i, pivotIndex);
            pivotIndex++;
        }
        await sleep(delay);
    }
    await sleep(delay);
    await swap(arr, pivotIndex, high);
    return pivotIndex;
}

async function quicksort(arr, low, high) {
    if (low < high) {
        let mid = await partition(arr, low, high);
        arrayState[mid] = 1;
        await Promise.all([
            quicksort(arr, low, mid - 1),
            quicksort(arr, mid + 1, high)
        ]);
    }
}

/*
Sorting Helper Functions
 */

//swaps 2 indices of the array
async function swap(arr, i, j) {
    let tmp = arr[i]; //Temporary variable to hold the current number
    arr[i] = arr[j];
    arr[j] = tmp;
}

// function to sleep during swaps so the canvas has time to redraw
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}