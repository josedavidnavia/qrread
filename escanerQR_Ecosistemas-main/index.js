const contenedorPrincipal = document.getElementById("contenedorPrincipal");

const video = document.createElement("video");
const canvasElement = document.createElement("canvas");
contenedorPrincipal.appendChild(canvasElement);
const canvas = canvasElement.getContext("2d");

window.addEventListener('load', () => {
    encenderCamara();
});

function encenderCamara() {
    navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
            video.setAttribute("playsinline", true);
            video.srcObject = stream;
            video.play();
            requestAnimationFrame(tick);
        })
        .catch(err => console.error("Error accessing camera: ", err));
}

function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });
        if (code) {
            console.log("QR Code found: ", code.data);
        }
    }
    requestAnimationFrame(tick);
}
