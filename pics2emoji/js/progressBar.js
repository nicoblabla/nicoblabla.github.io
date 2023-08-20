
let container = document.getElementById('progressBarContainer');
let progressBar = document.getElementById('progressBar');

export function update(x) {
    progressBar.style.width = x + "%";
}

export function finish() {
    update(100);
}