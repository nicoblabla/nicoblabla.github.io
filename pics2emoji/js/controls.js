import { loadImage, parameters, compute } from './pic2emoji.js';

export default function setupControls() {
    var params = new Params();
    var gui = new dat.GUI({ autoPlace: true });
    document.getElementById('container').insertBefore(gui.domElement, document.getElementById('container').firstChild);
    gui.add(params, 'size', 1, 40).name('Size').step(1).onChange(function () {
        params.changeSize();
    });
    gui.add(params, 'density', 1, 50).name('Density').step(1).onChange(function () {
        params.refresh();
    });
    gui.add(params, 'accuracy', 0, 100).name('Color mode').step(1).onChange(function () {
        params.refresh();
    });

    gui.add(params, 'image', allImages).name('Image').onFinishChange(function () {
        params.changeImage();
    });

    gui.add(params, 'uploadImage').name("Upload an image");
}

document.previewFile = function () {
    var preview = document.querySelector('img');
    var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();

    reader.onloadend = function () {
        img = loadImage(reader.result, function () {
            resizeCanvas(img.width, img.height);
        });
    }

    if (file) {
        reader.readAsDataURL(file);
    } else {
        preview.src = "";
    }
}

var Params = function () {
    this.size = 6;
    this.density = 10;
    this.accuracy = 50;
    this.uploadImage = function () {
        document.getElementById('inputImage').click();
    }
    this.refresh = function () {
        parameters.density = this.density;
        parameters.colorMode = this.accuracy;
        compute();
    }
    this.changeSize = function () {
        document.getElementById('output').style.fontSize = this.size + "px";
    }

    this.image = "Floc1.jpg"
    this.changeImage = function () {
        loadImage('./img/' + this.image);
    }

    this.about = function () {
        document.getElementById('inputImage').click();
    }

}

var allImages = [
    'Floc1.jpg',
    'Floc2.jpg',
    'Floc3.jpg',
    'Iceland1.jpg',
    'Iceland2.jpg',
    'Sheep.jpg',
    'beach.jpg',
    'cloud.jpg',
    'NewYork.jpg',
    'psychedelic.jpg',
    'rainbow.jpg',
    'rgb1.jpg',
    'rgb2.jpg',
    'rgb3.jpg',
    'rgb4.jpg',
    'emoji1.png',
    'emoji2.png',
    'emoji3.png',
    'tree.jpg',
    'Trump.jpg'];
