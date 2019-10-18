var mainArray = [];
var arrayState = [];
var delay = 50;
var cancel = false;
var sortMode = 0;

//variables for input elements
var playbtn, stopbtn;

var dimension, canvas, parent;

/*
    P5 js specific code
*/

// setup for p5. need to direct the canvas to a parent.
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

// initialize the array values
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
        switch (arrayState[l]) {
            case 1:
                fill('#2aa84c');
                break;
            case 2:
                fill('#a82a67')
                break;
            default:
                fill('#130b15');
        }

        rect(l * (width / mainArray.length), height + 4, (width / mainArray.length), -mainArray[l]);
    }
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
    arrayState.fill(1, low, high);
    let pivotVal = arr[high];
    let pivotIndex = low;
    arrayState[pivotIndex] = 2;
    for (let i = low; i < high; i++) {

        //cancels the sort
        if (cancel) {
            cancel = false;
            return;
        }

        if (arr[i] < pivotVal) {
            swap(arr, i, pivotIndex);
            arrayState[pivotIndex] = 0;
            pivotIndex++;
            arrayState[pivotIndex] = 2;
        }
        await sleep(delay);
    }
    await sleep(delay);
    swap(arr, pivotIndex, high);
    arrayState.fill(0, low, high);
    return pivotIndex;
}

async function quicksort(arr, low, high) {
    if (low < high) {
        let mid = await partition(arr, low, high);
        arrayState[mid] = 1;
        await quicksort(arr, low, mid - 1);
        await quicksort(arr, mid + 1, high);
        /* await Promise.all([
            quicksort(arr, low, mid - 1),
            quicksort(arr, mid + 1, high)
        ]); */
        arrayState.fill(0);
    }
}

/*
Sorting Helper Functions
 */

//swaps 2 indices of the array
function swap(arr, i, j) {
    let tmp = arr[i]; //Temporary variable to hold the current number
    arr[i] = arr[j];
    arr[j] = tmp;
}

// function to sleep during swaps so the canvas has time to redraw
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/*
Functions for input/output
*/

function windowResized() {
    resize();
}

function play() {
    playbtn.prop('disabled', true);
    cancel = false;
    switch (sortMode) {
        case 0:
            bubblesort(mainArray);
            break;
        case 1:
            quicksort(mainArray, 0, mainArray.length - 1);
            break;
        default:
            break;
    }
}

function restart() {
    cancel = true;
    resize();
    playbtn.prop('disabled', false);

}

// waits for the page to load to add listeners
$(document).ready(function () {
    playbtn = $('#play');
    playbtn.on('click', function (event) {
        play();
    });

    stopbtn = $('#restart');
    stopbtn.on('click', function (event) {
        restart();
    });

    $('.dropdown-menu > ').on('click', function (event) {
        $('.dropdown-menu > ').removeClass('active');
        $(this).addClass('active');
        sortMode = $(this).index();

    });

    $('#delay').on("input change", function (event) {
        console.log($(this).val());
        delay = 105 - $(this).val();
        console.log("delay: " + delay)
    })
})