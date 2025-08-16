// --- JAVASCRIPT LOGIC ---

// DOM Elements
const barContainer = document.getElementById('bar-container');
const generateArrayBtn = document.getElementById('generate-array');
const sortBtn = document.getElementById('sort');
const algorithmSelect = document.getElementById('algorithm');
const sizeSlider = document.getElementById('size');
const speedSlider = document.getElementById('speed');

let array = [];
let isSorting = false;

// --- UTILITY FUNCTIONS ---

/**
 * Generates a new array of random numbers and renders them as bars.
 */
function generateArray() {
    if (isSorting) return;
    array = [];
    barContainer.innerHTML = '';
    const size = sizeSlider.value;
    for (let i = 0; i < size; i++) {
        // Generate random number between 5 and 100
        array.push(Math.floor(Math.random() * 96) + 5);
    }
    renderBars();
}

/**
 * Renders the current state of the array as bars in the container.
 */
function renderBars() {
    barContainer.innerHTML = '';
    // Ensure the container has a width before calculating bar width
    if (barContainer.clientWidth === 0) {
        setTimeout(renderBars, 100); // Retry after a short delay
        return;
    }
    const containerWidth = barContainer.clientWidth;
    const barWidth = Math.max(1, Math.floor(containerWidth / array.length) - 2); // -2 for margin, min width of 1px

    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement('div');
        bar.style.height = `${array[i]}%`;
        bar.style.width = `${barWidth}px`;
        bar.classList.add('bar');
        barContainer.appendChild(bar);
    }
}


/**
 * A helper function to pause execution for a specified duration.
 * @param {number} ms - The base number of milliseconds to sleep.
 * @returns {Promise} A promise that resolves after the specified duration.
 */
function sleep(ms) {
    // Adjust speed based on slider. A lower slider value means a longer delay.
    // The divisor is decreased to make the maximum delay longer (slower).
    const delay = 151 - speedSlider.value;
    return new Promise(resolve => setTimeout(resolve, ms * (delay / 8)));
}

/**
 * Disables UI controls while sorting is in progress.
 */
function disableControls() {
    isSorting = true;
    sortBtn.disabled = true;
    generateArrayBtn.disabled = true;
    sizeSlider.disabled = true;
    algorithmSelect.disabled = true;
    sortBtn.classList.add('opacity-50', 'cursor-not-allowed');
    generateArrayBtn.classList.add('opacity-50', 'cursor-not-allowed');
}

/**
 * Enables UI controls after sorting is complete.
 */
function enableControls() {
    isSorting = false;
    sortBtn.disabled = false;
    generateArrayBtn.disabled = false;
    sizeSlider.disabled = false;
    algorithmSelect.disabled = false;
    sortBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    generateArrayBtn.classList.remove('opacity-50', 'cursor-not-allowed');
}


// --- SORTING ALGORITHMS ---

/**
 * Bubble Sort Algorithm
 */
async function bubbleSort() {
    const bars = document.getElementsByClassName('bar');
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (isSorting === false) return;
            // Highlight bars being compared
            bars[j].style.backgroundColor = '#facc15'; // yellow-400
            bars[j + 1].style.backgroundColor = '#facc15'; // yellow-400
            await sleep(10);

            if (array[j] > array[j + 1]) {
                // Swap elements
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                
                // Update bar heights
                bars[j].style.height = `${array[j]}%`;
                bars[j + 1].style.height = `${array[j + 1]}%`;
                
                // Highlight swapped bars
                bars[j].style.backgroundColor = '#ef4444'; // red-500
                bars[j + 1].style.backgroundColor = '#ef4444'; // red-500
                await sleep(10);
            }
            
            // Reset color
            bars[j].style.backgroundColor = '#6366f1'; // indigo-500
            bars[j + 1].style.backgroundColor = '#6366f1'; // indigo-500
        }
        // Mark the sorted element
        bars[array.length - 1 - i].style.backgroundColor = '#22c55e'; // green-500
    }
    if (bars[0]) bars[0].style.backgroundColor = '#22c55e'; // green-500
}

/**
 * Selection Sort Algorithm
 */
async function selectionSort() {
    const bars = document.getElementsByClassName('bar');
    for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i;
        // Highlight the current position we are trying to fill
        bars[i].style.backgroundColor = '#f97316'; // orange-500

        for (let j = i + 1; j < array.length; j++) {
            if (isSorting === false) return;
            // Highlight the bar being compared
            bars[j].style.backgroundColor = '#facc15'; // yellow-400
            await sleep(5);

            if (array[j] < array[minIndex]) {
                if (minIndex !== i) {
                    // Reset color of the old minimum
                    bars[minIndex].style.backgroundColor = '#6366f1'; // indigo-500
                }
                minIndex = j;
                // Highlight the new minimum
                bars[minIndex].style.backgroundColor = '#ef4444'; // red-500
            } else {
                // Reset color if not the new minimum
                bars[j].style.backgroundColor = '#6366f1'; // indigo-500
            }
        }
        
        // Swap elements
        [array[i], array[minIndex]] = [array[minIndex], array[i]];

        // Update bar heights
        bars[i].style.height = `${array[i]}%`;
        bars[minIndex].style.height = `${array[minIndex]}%`;
        
        // Reset color of the previous minimum
        if (minIndex !== i) {
           bars[minIndex].style.backgroundColor = '#6366f1'; // indigo-500
        }

        // Mark the element as sorted
        bars[i].style.backgroundColor = '#22c55e'; // green-500
    }
    if (bars[array.length - 1]) bars[array.length - 1].style.backgroundColor = '#22c55e'; // green-500
}

/**
 * Insertion Sort Algorithm
 */
async function insertionSort() {
    const bars = document.getElementsByClassName('bar');
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;

        // Highlight the key element
        bars[i].style.backgroundColor = '#ef4444'; // red-500
        await sleep(20);

        while (j >= 0 && array[j] > key) {
            if (isSorting === false) return;
            // Highlight comparison
            bars[j].style.backgroundColor = '#facc15'; // yellow-400
            
            array[j + 1] = array[j];
            bars[j + 1].style.height = `${array[j + 1]}%`;
            
            await sleep(20);
            
            // Reset color
            bars[j].style.backgroundColor = '#22c55e'; // green-500 (part of sorted section)
            j = j - 1;
        }
        array[j + 1] = key;
        bars[j + 1].style.height = `${key}%`;
        
        // Mark all sorted elements
        for(let k = 0; k <= i; k++) {
            bars[k].style.backgroundColor = '#22c55e'; // green-500
        }
    }
}

/**
 * Merge Sort Algorithm
 */
async function mergeSort(arr, l, r) {
    if (l >= r || !isSorting) {
        return;
    }
    const m = l + Math.floor((r - l) / 2);
    await mergeSort(arr, l, m);
    await mergeSort(arr, m + 1, r);
    await merge(arr, l, m, r);
}

async function merge(arr, l, m, r) {
    if (!isSorting) return;
    const bars = document.getElementsByClassName('bar');
    const n1 = m - l + 1;
    const n2 = r - m;

    let L = new Array(n1);
    let R = new Array(n2);

    for (let i = 0; i < n1; i++) L[i] = arr[l + i];
    for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

    let i = 0, j = 0, k = l;

    while (i < n1 && j < n2) {
        if (!isSorting) return;
        // Highlight bars being compared
        if (bars[l + i]) bars[l + i].style.backgroundColor = '#facc15'; // yellow-400
        if (bars[m + 1 + j]) bars[m + 1 + j].style.backgroundColor = '#facc15'; // yellow-400
        await sleep(20);

        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        
        // Update bar height and color
        if (bars[k]) {
            bars[k].style.height = `${arr[k]}%`;
            bars[k].style.backgroundColor = '#ef4444'; // red-500 (being placed)
        }
        await sleep(20);
        k++;
    }

    while (i < n1) {
        if (!isSorting) return;
        arr[k] = L[i];
        if (bars[k]) {
            bars[k].style.height = `${arr[k]}%`;
            bars[k].style.backgroundColor = '#ef4444'; // red-500
        }
        await sleep(20);
        i++;
        k++;
    }

    while (j < n2) {
        if (!isSorting) return;
        arr[k] = R[j];
        if (bars[k]) {
            bars[k].style.height = `${arr[k]}%`;
            bars[k].style.backgroundColor = '#ef4444'; // red-500
        }
        await sleep(20);
        j++;
        k++;
    }
    
    // Mark merged section as sorted
    for(let idx = l; idx <= r; idx++) {
        if (bars[idx]) bars[idx].style.backgroundColor = '#22c55e'; // green-500
    }
}


/**
 * Quick Sort Algorithm
 */
async function quickSort(arr, low, high) {
    if (low < high && isSorting) {
        let pi = await partition(arr, low, high);
        if (!isSorting) return;
        await quickSort(arr, low, pi - 1);
        if (!isSorting) return;
        await quickSort(arr, pi + 1, high);
    }
}

async function partition(arr, low, high) {
    if (!isSorting) return high;
    const bars = document.getElementsByClassName('bar');
    let pivot = arr[high];
    let i = low - 1;

    // Highlight pivot
    if (bars[high]) bars[high].style.backgroundColor = '#f97316'; // orange-500

    for (let j = low; j <= high - 1; j++) {
        if (!isSorting) return high;
        // Highlight current element
        if (bars[j]) bars[j].style.backgroundColor = '#facc15'; // yellow-400
        await sleep(20);

        if (arr[j] < pivot) {
            i++;
            // Swap arr[i] and arr[j]
            [arr[i], arr[j]] = [arr[j], arr[i]];
            if (bars[i]) bars[i].style.height = `${arr[i]}%`;
            if (bars[j]) bars[j].style.height = `${arr[j]}%`;
            // Highlight swap
            if (bars[i]) bars[i].style.backgroundColor = '#ef4444'; // red-500
            await sleep(20);
            if (bars[i]) bars[i].style.backgroundColor = '#6366f1'; // indigo-500
        }
        if (bars[j]) bars[j].style.backgroundColor = '#6366f1'; // indigo-500
    }
    
    // Swap arr[i+1] and arr[high] (pivot)
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    if (bars[i + 1]) bars[i + 1].style.height = `${arr[i + 1]}%`;
    if (bars[high]) bars[high].style.height = `${arr[high]}%`;
    
    // Reset pivot color
    if (bars[high]) bars[high].style.backgroundColor = '#6366f1'; // indigo-500
    // Mark pivot's new position as sorted
    if (bars[i + 1]) bars[i + 1].style.backgroundColor = '#22c55e'; // green-500
    
    await sleep(20);

    return i + 1;
}

// --- FINALIZATION ---

/**
 * After sorting, run a final animation to show completion.
 */
async function finishAnimation() {
    const bars = document.getElementsByClassName('bar');
    for (let i = 0; i < bars.length; i++) {
        if (!isSorting) break;
        bars[i].style.backgroundColor = '#22c55e'; // green-500
        await sleep(5);
    }
}

// --- EVENT LISTENERS ---

generateArrayBtn.addEventListener('click', () => {
    isSorting = false; // Stop any ongoing sort
    setTimeout(generateArray, 50); // Allow time for sort to stop
});

sizeSlider.addEventListener('input', () => {
    isSorting = false; // Stop any ongoing sort
    setTimeout(generateArray, 50);
});

sortBtn.addEventListener('click', async () => {
    if (isSorting) return;
    
    disableControls();
    
    const selectedAlgorithm = algorithmSelect.value;
    
    switch (selectedAlgorithm) {
        case 'bubble':
            await bubbleSort();
            break;
        case 'selection':
            await selectionSort();
            break;
        case 'insertion':
            await insertionSort();
            break;
        case 'merge':
            await mergeSort(array, 0, array.length - 1);
            break;
        case 'quick':
            await quickSort(array, 0, array.length - 1);
            break;
    }

    if (isSorting) { // Only finish if it wasn't cancelled
        await finishAnimation();
    }
    enableControls();
});

// Initial array generation on page load
window.addEventListener('load', () => {
    generateArray();
});

// Regenerate array on window resize to fit the screen
window.addEventListener('resize', () => {
    if (!isSorting) {
        renderBars();
    }
});

