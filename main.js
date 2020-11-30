'use strict';

const video = document.querySelector('video');
const param = document.querySelector('#param');
const switchCamera = document.querySelector('#switchCamera');
const takePicture = document.querySelector('#takePicture');
const upload = document.querySelector('#upload');
const retake = document.querySelector('#retake');
const submit = document.querySelector('#submit');
const videoSelect = document.querySelector('select#videoSource');
const selectors = [videoSelect];
const canvas = window.canvas = document.querySelector('canvas');
canvas.width = 0;
canvas.height = 0;
let videoDevices = [];
let defaultCamera = true;

const queryString = window.location.search;
param.innerHTML = queryString;

takePicture.onclick = function () {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  video.style.display = "none";
  takePicture.style.display = "none";
  switchCamera.style.display = "none";
  upload.style.display = "none";
  canvas.style.display = "block";
  retake.style.display = "inline";
  submit.style.display = "inline";
};

retake.onclick = function () {
  canvas.style.display = "none";
  retake.style.display = "none";
  submit.style.display = "none";
  video.style.display = "block";
  takePicture.style.display = "inline";
  switchCamera.style.display = "inline";
  upload.style.display = "inline";
};

submit.onclick = function () {
  canvas.style.display = "none";
  retake.style.display = "none";
  submit.style.display = "none";
  video.style.display = "block";
  takePicture.style.display = "inline";
  switchCamera.style.display = "inline";
  upload.style.display = "inline";
  submitImage();
  alert("Success!\n\n\Your snapshot was submitted to sennder")
};

upload.onclick = function () {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  video.style.display = "none";
  takePicture.style.display = "none";
  switchCamera.style.display = "none";
  upload.style.display = "none";
  canvas.style.display = "block";
  retake.style.display = "inline";
  submit.style.display = "inline";
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


function getDevices(deviceInfos) {
  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    if (deviceInfo.kind === 'videoinput') {
      videoDevices.push(deviceInfo.deviceId)
    };
  };
};

//navigator.mediaDevices.enumerateDevices().then(getDevices).catch(handleError);

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
  const videoSource = defaultCamera ? videoDevices[0] : videoDevices[videoDevices.length - 1];
  defaultCamera = !defaultCamera;
  const constraints = {
    audio: false,
    video: { deviceId: videoSource ? { exact: videoSource } : undefined }
  };
  navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(getDevices).catch(handleError);
};

function submitImage() {
  const link = document.createElement('a')
  link.setAttribute('download', 'sennder.png');
  link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
  link.click();
};

//videoSelect.onchange = start;
switchCamera.onclick = start;

start();