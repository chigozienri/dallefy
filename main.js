const result = document.querySelector('#result');
const dallefyButton = document.querySelector('#dallefy');
const fileInput = document.querySelector('#file');
const urlInput = document.querySelector('#url');
const canvas = document.querySelector('#canvas');
const size = document.querySelector('#size');
const download = document.querySelector('#download');
const dallefiedImage = document.querySelector('#dallefiedImage');

// Canvas 2D context
const ctx = canvas.getContext('2d');

var imageSrc = undefined;

function dallefy (imageSrc) {
    const img = new Image();
    img.src = imageSrc;
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        watermark(size.value);
        dallefiedImage.src = canvas.toDataURL("image/png");
    }
}

function watermark (size) {
    var colors = ['#FFFF67', '#43FFFF', '#51DA4C', '#FF6F3D', '#3C46FF']
    for (let i = 0; i < colors.length; i++) {
        ctx.fillStyle = colors[i];
        ctx.fillRect(canvas.width-(colors.length-i)*size, canvas.height - size, size, size)
    }
}

function readAndDallefy () {
    var file = fileInput.files[0];
    if (file) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.addEventListener("load", function () {
            imageSrc = this.result;
            dallefy(imageSrc);
        }); 
    } else if (urlInput.value) {
        imageSrc = urlInput.value;
        dallefy(imageSrc);
    } else {
        return
    }
    result.style.display = "block";
    fileInput.value = "";
    urlInput.value = "";
}

dallefyButton.addEventListener('click', () => {readAndDallefy()});
urlInput.addEventListener('keypress', (e) => {
    if (e.keyCode === 13) {
        readAndDallefy();
    }
});
fileInput.addEventListener('change', () => {
    readAndDallefy();
});
size.addEventListener('change', () => {
    if (imageSrc) {
        dallefy(imageSrc);
    }
});

function dlCanvas() {
    // https://stackoverflow.com/a/12796748
    var dt = dallefiedImage.src;
    /* Change MIME type to trick the browser to downlaod the file instead of displaying it */
    dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
  
    /* In addition to <a>'s "download" attribute, you can define HTTP-style headers */
    dt = dt.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=dallefied.png');
  
    this.href = dt;
  };
  download.addEventListener('click', dlCanvas, false);