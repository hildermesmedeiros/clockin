feather.replace();

const width = screen.width;
const height = screen.height;
feather.replace();

const controls = document.querySelector('.controls');
const cameraOptions = document.querySelector('.video-options>select');
const select = document.getElementById('select');
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const screenshotImage = document.querySelector('img');
const buttons = [...controls.querySelectorAll('button')];
let streamStarted = false;
let stream;
let camId;
let currentStream;

const [play, pause, screenshot] = buttons;


var constraints = {
  video: {
    width: {
      min: 1280,
      ideal: width,
      max: 2560,
    },
    height: {
      min: 720,
      ideal: height,
      max: 1440
    },
  }
};


const deviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
    }
    else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return "mobile";
    }
    return "desktop";
};
const device = deviceType();

function stopMediaTracks(stream) {
    stream.getTracks().forEach(track => {
        track.stop();
    });
    streamStarted = false;
}

play.addEventListener('click', event => {
  if (typeof currentStream !== 'undefined') {
    stopMediaTracks(currentStream);
  }

  if (cameraOptions.value === '') {
      constraints.video.facingMode = 'environment';
  } else {
      constraints.video.deviceId = { exact: cameraOptions.value };
  }

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(stream => {
        play.classList.add('d-none');
        pause.classList.remove('d-none');
        screenshot.classList.remove('d-none');
        currentStream = stream;
        video.srcObject = stream;
        return navigator.mediaDevices.enumerateDevices();
    })
    .then(gotDevices)
    .catch(error => {
      console.error(error);
    });
});

const pauseStream = () => {
    stopMediaTracks(currentStream);
    play.classList.remove('d-none');
    pause.classList.add('d-none');
};

const doScreenshot = () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    screenshotImage.src = canvas.toDataURL('image/webp');
    screenshotImage.classList.remove('d-none');
};

pause.onclick = pauseStream;
screenshot.onclick = doScreenshot;

function gotDevices(mediaDevices) {
  cameraOptions.innerHTML = '';
  cameraOptions.appendChild(document.createElement('option'));
  let count = 1;
  mediaDevices.forEach(mediaDevice => {
    if (mediaDevice.kind === 'videoinput') {
      const option = document.createElement('option');
      option.value = mediaDevice.deviceId;
      const label = mediaDevice.label || `Camera ${count++}`;
      const textNode = document.createTextNode(label);
      option.appendChild(textNode);
      cameraOptions.appendChild(option);
    }
  });
}
navigator.mediaDevices.enumerateDevices().then(gotDevices);