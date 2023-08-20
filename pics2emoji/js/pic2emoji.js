import * as progressBar from './progressBar.js';

let container, canvas, ctx, emojisInformation, output;

export let parameters = {
    density: 6,
    colorMode: 50,
}

export default function pic2emoji(emojisInformationP) {

    container = document.getElementById('display');
    canvas = document.getElementById('input');
    output = document.getElementById('output');
    ctx = canvas.getContext('2d', { willReadFrequently: true });
    emojisInformation = emojisInformationP;

    loadImage('./img/Floc1.jpg');
}

export function loadImage(imageUrl) {
    let img = new Image();
    img.onload = function () {
        displayImage(img);
    }
    img.src = imageUrl;
}

function displayImage(image) {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    compute();
}
let isRunning = false;
let requestStop = false;

async function waitForStop() {
    return new Promise((resolve, reject) => {
        function wait() {
            if (isRunning) {
                requestAnimationFrame(wait);
            } else {
                resolve();
            }
        }
        wait();
    });
}
export async function compute() {
    if (isRunning) {
        requestStop = true;
        await waitForStop();
    }
    isRunning = true;
    let density = parameters.density;
    let colorMode = parameters.colorMode;
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let width = Math.floor(canvas.width / density) * density;
    let height = Math.floor(canvas.height / density) * density;
    let pixels = [];
    let emojis = '';
    for (let i = 0; i < height / density; i++) {
        pixels.push([]);
        for (let j = 0; j < width / density; j++) {
            pixels[i].push([]);
        }
    }
    for (let i = 0; i < imageData.length; i += 4) {
        let x = (i / 4) % canvas.width;
        let y = Math.floor((i / 4) / canvas.width);
        if (x >= width || y >= height) {
            continue;
        }
        let chunkX = Math.floor(x / density);
        let chunkY = Math.floor(y / density);

        pixels[chunkY][chunkX].push({ r: imageData[i], g: imageData[i + 1], b: imageData[i + 2], a: imageData[i + 3] });
    }

    for (let i = 0; i < pixels.length; i++) {
        for (let j = 0; j < pixels[i].length; j++) {
            let meanColor = { r: 0, g: 0, b: 0 };
            for (let k = 0; k < pixels[i][j].length; k++) {
                meanColor.r += pixels[i][j][k].r;
                meanColor.g += pixels[i][j][k].g;
                meanColor.b += pixels[i][j][k].b;
            }
            meanColor.r /= pixels[i][j].length;
            meanColor.g /= pixels[i][j].length;
            meanColor.b /= pixels[i][j].length;
            pixels[i][j] = meanColor;
        }
    }


    /* The code below this comment is the non-blocking way of this code.
    for (let i = 0; i < pixels.length; i++) {
        for (let j = 0; j < pixels[i].length; j++) {
            let emoji = getNearestEmoji(pixels[i][j]);
            emojis += emoji;
        }
        emojis += '\n';
    }*/
    let emojiColors = computeEmojiColors(colorMode);
    async function processArray() {
        return new Promise((resolve, reject) => {
            let batchSize = 1000;
            let i = 0, j = 0;

            async function processBatch() {
                return new Promise((resolve, reject) => {
                    let cpt = 0;
                    for (; i < pixels.length; i++) {
                        for (; j < pixels[i].length; j++) {
                            let emoji = getNearestEmoji(pixels[i][j], emojiColors);
                            emojis += emoji;
                            cpt++;
                            if (cpt > batchSize) {
                                j++;
                                break;
                            }
                        }
                        if (cpt > batchSize) {
                            break;
                        }
                        emojis += '\n';
                        j = 0;
                    }
                    if (i < pixels.length) {
                        if (requestStop) {
                            requestStop = false;
                            isRunning = false;
                            resolve();
                            return;
                        }
                        progressBar.update((i * pixels[0].length + j) / (pixels.length * pixels[0].length) * 100);
                        requestAnimationFrame(processBatch);
                    } else {
                        isRunning = false;
                        output.innerHTML = emojis;
                        progressBar.finish();
                        resolve();
                    }
                });
            }
            processBatch();
        });
    }

    processArray();


}

function computeEmojiColors(colorMode) {
    return Object.entries(emojisInformation).map(([emoji, info]) => {
        return {
            emoji,
            color: {
                r: info.meanColor.r * colorMode / 100 + info.meanColor2.r * (100 - colorMode) / 100,
                g: info.meanColor.g * colorMode / 100 + info.meanColor2.g * (100 - colorMode) / 100,
                b: info.meanColor.b * colorMode / 100 + info.meanColor2.b * (100 - colorMode) / 100,
            }
        };
    });
}


function getNearestEmoji(color, emojiColors) {
    let minDistance = Infinity;
    let nearestEmoji = null;
    for (const { emoji, color: emojiColor } of emojiColors) {
        let distance = getDistance(color, emojiColor);
        if (distance < minDistance) {
            minDistance = distance;
            nearestEmoji = emoji;
        }
    }
    return nearestEmoji;
}

function getDistance(color1, color2) {
    let r = color1.r - color2.r;
    let g = color1.g - color2.g;
    let b = color1.b - color2.b;
    return r * r + g * g + b * b;
}


