feather.replace();

const width = screen.width;
const height = screen.height;
feather.replace();

const controls = document.querySelector('.controls');
let cameraOptions = document.querySelector('.video-options>select');
let select;
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const screenshotImage = document.querySelector('img');
const buttons = [...controls.querySelectorAll('button')];
let streamStarted = false;
let stream;
let camId;
let currentStream;
var idx = -1;
let foward = true;

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
    let selectSize = cameraOptions.options.length - 1;
    if (foward == true){
        idx++;
        document.querySelector('.video-options>select').options.selectedIndex = idx;
        cameraOptions = document.querySelector('.video-options>select')
        constraints.video.deviceId = { exact: cameraOptions.value };
        if (idx == selectSize){
        foward = false
        }
    }
    else{
        idx--;
        if (idx >=0 ){
            document.querySelector('.video-options>select').options.selectedIndex = idx;
            cameraOptions = document.querySelector('.video-options>select')
            constraints.video.deviceId = { exact: cameraOptions.value };
        }
        if (idx < 1){
         foward = true
         }
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

const getCameraSelection = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter(device => device.kind === 'videoinput');
  const options = videoDevices.map(videoDevice => {
    return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
  });
  cameraOptions.innerHTML = await options.join('');
};

getCameraSelection();
