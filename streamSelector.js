<<<<<<< HEAD
//Source for multiple device access: https://github.com/samdutton/simpl/blob/gh-pages/getusermedia/sources/js/main.js

'use strict';

var videoElement = document.querySelector('video');

var streamIndex = 0;
var videoDevicesArray = [];
var totalDevices  = 0;

getStream().then(getDevices).then(gotDevices);

document.getElementById("flipCamera").onclick = setStreamIndex;

function getDevices() {
  return navigator.mediaDevices.enumerateDevices();
}

function gotDevices(deviceInfos) {
  window.deviceInfos = deviceInfos;
  console.log('Available input and output devices:', deviceInfos);
  for (const deviceInfo of deviceInfos) {
    const option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'videoinput') {
      totalDevices++;
      videoDevicesArray.push(option.value);
    }
  }
  document.getElementById("flipCamera").disabled = (videoDevicesArray.length <= 1);
}

function setStreamIndex()
{
  streamIndex++;
  streamIndex = streamIndex % totalDevices;
  getStream();
}

function getStream() {
  if (window.stream) {
    window.stream.getTracks().forEach(track => {
      track.stop();
    });
  }
  const videoSource = videoDevicesArray[streamIndex];
  const constraints = {
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  return navigator.mediaDevices.getUserMedia(constraints).
    then(gotStream).catch(handleError);
}

function gotStream(stream) {
  window.stream = stream;
  videoElement.srcObject = stream;
}

function handleError(error) {
  console.error('Error: ', error);
=======
//Source for multiple device access: https://github.com/samdutton/simpl/blob/gh-pages/getusermedia/sources/js/main.js

'use strict';

var videoElement = document.querySelector('video');

var streamIndex = 0;
var videoDevicesArray = [];
var totalDevices  = 0;

getStream().then(getDevices).then(gotDevices);

document.getElementById("flipCamera").onclick = setStreamIndex;

function getDevices() {
  return navigator.mediaDevices.enumerateDevices();
}

function gotDevices(deviceInfos) {
  window.deviceInfos = deviceInfos;
  console.log('Available input and output devices:', deviceInfos);
  for (const deviceInfo of deviceInfos) {
    const option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'videoinput') {
      totalDevices++;
      videoDevicesArray.push(option.value);
    }
  }
  document.getElementById("flipCamera").disabled = (videoDevicesArray.length <= 1);
}

function setStreamIndex()
{
  streamIndex++;
  streamIndex = streamIndex % totalDevices;
  getStream();
}

function getStream() {
  if (window.stream) {
    window.stream.getTracks().forEach(track => {
      track.stop();
    });
  }
  const videoSource = videoDevicesArray[streamIndex];
  const constraints = {
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  return navigator.mediaDevices.getUserMedia(constraints).
    then(gotStream).catch(handleError);
}

function gotStream(stream) {
  window.stream = stream;
  videoElement.srcObject = stream;
}

function handleError(error) {
  console.error('Error: ', error);
>>>>>>> 78e344a (Add existing project files to Git)
}