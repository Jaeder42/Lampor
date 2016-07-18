
var config = {
    apiKey: "AIzaSyCJAHiFMRYDyzqf8xrX4OQ2On7tSTvdm2c",
    authDomain: "daddyo-796f0.firebaseapp.com",
    databaseURL: "https://daddyo-796f0.firebaseio.com",
    storageBucket: "daddyo-796f0.appspot.com",
  };
  firebase.initializeApp(config);



    firebase.database().ref('devices/').on('value', function(snapshot) {
      parseDevices(snapshot.val());
  });



function parseDevices(devices) {

  //console.log("something is wrong!??!?!?");

  var myNode = document.getElementById('devices');
  while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
  }

  for (var i = 0; i < devices.length; i++) {
    if(devices[i] != undefined){
      generateDeviceHtml(devices[i]);
      setButtonListener(devices[i]);
    }
  }

}

function setButtonListener(device) {
 var id = device.id;
 var button = document.getElementById('switch'+id);
 var status = device.status;

var slider = document.getElementById('slider'+id);
var level = device.level;

 button.addEventListener("click", function(e){
  if(status =='ON'){
    status = 'OFF';
  }
  else if(status == 'OFF'){
    status = 'ON';
  }
   else if(status == 'DIM'){

     status = 'OFF';

   }

  updateStatus(id, status, 0 )

 });
if(device.dimmable){
 slider.addEventListener("change",function(e){
   console.log(slider.value);
   updateStatus(id, 'DIM', slider.value)
 });
 }

}



function generateDeviceHtml(device) {


  var element = document.getElementById('devices');
  var li = document.createElement('li');
  var div = document.createElement('div');
//name
  var name = document.createElement('h3');
  var nametext = document.createTextNode(device.name);
  name.appendChild(nametext);
  name.className += 'deviceitem';
//status
var status = document.createElement('p');
var statustext = document.createTextNode(device.status);
status.appendChild(statustext);
status.className += 'deviceinteractive btn btn-lg btn-default';
status.id = 'switch'+device.id;

//Timerbutton
var timer = document.createElement('p');
var timertext = document.createTextNode('\u263c');

timer.className += 'devicetimer btn btn-lg btn-default'
timer.appendChild(timertext);
//Add to div
  div.appendChild(name);
  div.appendChild(status);
  div.appendChild(timer);
  //slider
  if(device.dimmable){
    var slider = document.createElement('input');
    var sliderdiv = document.createElement('div');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 255;
    slider.value = device.level;
    slider.className += 'slider';
    slider.id = 'slider' + device.id;
    sliderdiv.className += 'sliderdiv';
    sliderdiv.appendChild(slider);
    div.appendChild(sliderdiv);
  }

  div.className += 'devicediv';
//Add div to li
  li.appendChild(div);
//add li to ul
  element.appendChild(li);
}




function updateStatus(id, status, level) {
  var device;
  if(status == 'ON'){
    level = 255;
  }
  else if (status == 'OFF') {
    level = 0;
  }

  firebase.database().ref('/devices/' + id).once('value').then(function(snapshot) {
    device = snapshot.val();
    updateDevice(id, device.name, device.model, device.dimmable, status, level, device.timeron, device.timeroff,
      device.timer, device.timersun);
  });



}
function updateDevice(id, name, model, dimmable, status,level, timeron,
timeroff, timer, timersun) {
  var postdata = {
    id: id,
    name:name,
    model: model,
    dimmable: dimmable,
    status: status,
    level: level,
    timeron: timeron,
    timeroff: timeroff,
    timer: timer,
    timersun: timersun
  };

  var newPostKey = firebase.database().ref().child('devices').push().key;
  var updates = {};

  updates['/devices/' + id] = postdata;

  return firebase.database().ref().update(updates);
}
