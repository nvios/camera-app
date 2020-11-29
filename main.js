'use strict';

const video = document.querySelector('video');
const takePicture = document.querySelector('#takePicture');
const retake = document.querySelector('#retake');
const submit = document.querySelector('#submit');
const videoSelect = document.querySelector('select#videoSource');
const selectors = [videoSelect];

const canvas = window.canvas = document.querySelector('canvas');
canvas.width = 0;
canvas.height = 0;

takePicture.onclick = function () {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  video.style.display = "none";
  takePicture.style.display = "none";
  canvas.style.display = "block";
  retake.style.display = "inline";
  submit.style.display = "inline";
};

retake.onclick = function () {
  canvas.style.display = "none";
  retake.style.display = "none";
  submit.style.display = "none";
  video.style.display = "block";
  takePicture.style.display = "block";
};

submit.onclick = function () {
  canvas.style.display = "none";
  retake.style.display = "none";
  submit.style.display = "none";
  video.style.display = "block";
  takePicture.style.display = "block";
  alert("Success!\n\n\Your snapshot was submitted to > 𝕤 𝕖 𝕟 𝕟 𝕕 𝕖 𝕣")
};

function gotDevices(deviceInfos) {
  // Handles being called several times to update labels. Preserve values.
  const values = selectors.map(select => select.value);
  selectors.forEach(select => {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    };
  });
  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    const option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'videoinput') {
        option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
        videoSelect.appendChild(option);
    };
    selectors.forEach((select, selectorIndex) => {
      if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
        select.value = values[selectorIndex];
      };
    });
  };
};

navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

function gotStream(stream) {
  window.stream = stream; // make stream available to console
  video.srcObject = stream;
  // Refresh button list in case labels have become available
  return navigator.mediaDevices.enumerateDevices();
};

function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
};

function start() {
  if (window.stream) {
    window.stream.getTracks().forEach(track => {
      track.stop();
    });
  };
  const videoSource = videoSelect.value;
  const constraints = {
    audio: false,
    video: { deviceId: videoSource ? { exact: videoSource } : undefined }
  };
  navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError);
};

videoSelect.onchange = start;

start();