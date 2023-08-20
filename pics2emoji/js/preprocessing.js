import * as progressBar from './progressBar.js';


export default async function computeEmojiInformation() {
    let informations = {};
    let emojis = await fetch('./resources/emojis.json').then(response => response.json());


    let container = document.getElementById('preprocessing');

    let canvas = document.getElementById('preprocessingCanvas');
    let testEmoji = document.getElementById('preprocessingTestEmoji');




    let ctx = canvas.getContext('2d');
    ctx.font = '100px emoji';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center'

    return new Promise(async (resolve, reject) => {
        await processArray();
        localStorage.setItem('emojis', JSON.stringify(informations));
        resolve(JSON.stringify(informations));
    });

    async function processArray() {
        return new Promise((resolve, reject) => {
            let batchSize = 50;
            let i = 0;
            async function processBatch() {
                for (let j = 0; j < batchSize && i < emojis.list.length; j++) {
                    await getInformation(emojis.list[i]);
                    i++;
                }
                progressBar.update(i / emojis.list.length * 100);
                if (i < emojis.list.length) {
                    requestAnimationFrame(processBatch);
                } else {
                    resolve();
                }
            }
            processBatch();
        });
    }


    async function getInformation(emoji) {
        return new Promise((resolve, reject) => {


            testEmoji.innerHTML = emoji;
            if (testEmoji.clientWidth < 95 || testEmoji.clientWidth > 105) {
                resolve();
                return;
            }

            ctx.clearRect(0, 0, 100, 100);
            ctx.fillText(emoji, 50, 60);
            let imageData = ctx.getImageData(0, 0, 100, 100);
            let data = imageData.data;
            let pixels = [];
            for (let i = 0; i < data.length; i += 4) {
                pixels.push({ r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] });
            }

            // mean colors of the pixels with transparency
            let meanColor = { r: 0, g: 0, b: 0 }
            let nbPixel = 0;

            for (let pixel of pixels) {
                meanColor.r += pixel.r * pixel.a / 255;
                meanColor.g += pixel.g * pixel.a / 255;
                meanColor.b += pixel.b * pixel.a / 255;
                nbPixel += pixel.a / 255;
            }
            meanColor.r /= nbPixel;
            meanColor.g /= nbPixel;
            meanColor.b /= nbPixel;

            // mean colors of the pixels with transparency counting as white
            let meanColor2 = { r: 0, g: 0, b: 0 }

            for (let pixel of pixels) {
                meanColor2.r += pixel.r * pixel.a / 255 + (255 - pixel.a);
                meanColor2.g += pixel.g * pixel.a / 255 + (255 - pixel.a);
                meanColor2.b += pixel.b * pixel.a / 255 + (255 - pixel.a);
            }
            meanColor2.r /= pixels.length;
            meanColor2.g /= pixels.length;
            meanColor2.b /= pixels.length;

            saveInformation(emoji, meanColor, meanColor2);
            resolve();
        });
    }

    function saveInformation(emoji, meanColor, meanColor2) {
        informations[emoji] = { meanColor, meanColor2 };
    }



}