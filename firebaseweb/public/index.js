//Replace the below config with yours!
var config = {
  apiKey: "yourapikey",
  authDomain: "yourdomain.firebaseapp.com",
  databaseURL: "yourdomain.firebaseio.com",
  storageBucket: "yourdomain.appspot.com",
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

var timercheckbox = document.getElementById('timer'+id);
var suntimercheckbox = document.getElementById('suntimer'+id);

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
timercheckbox.addEventListener("change", function(e){
 console.log('Change');
 var onh = document.getElementById('timeronh'+id).value;
 var onm = document.getElementById('timeronm'+id).value;

 var offh = document.getElementById('timeroffh'+id).value;
 var offm = document.getElementById('timeroffm'+id).value;

 var on = onh+':'+onm;
 var off = offh+':'+offm;

 updateTimer(id, timercheckbox.checked, on, off);
});
suntimercheckbox.addEventListener("change", function(e){
updateTimerSun(id, suntimercheckbox.checked);
});
}

function getH(time) {
var str = time.split(':');
return str[0];
}
function getM(time) {
var str = time.split(':');
return str[1];
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

//Timer
var timerdiv = document.createElement('div');
timerdiv.className += 'timerdiv';
var on = document.createElement('p');
var off = document.createElement('p');
var ontext = document.createTextNode('On');
var offtext = document.createTextNode('Off');
on.className += 'timeritems';
off.className += 'timeritems';
on.appendChild(ontext);
off.appendChild(offtext);

var timeron = document.createElement("div");
timeron.classname += 'deviceinteractive';
timeron.id = 'timeron'+device.id;
timeron.className = 'timeritems';
var timeronh = document.createElement('select');
timeronh.className += 'timeronh'+device.id;
for(var i = 0; i < 24; i++){
var h = document.createElement("option");

if(i < 10){
  i = '0'+i;
}
h.innerHTML = i;
h.setAttribute("value", i);
h.className = 'timeritems';
timeronh.appendChild(h);
}
timeronh.id = 'timeronh'+device.id;
timeronh.value = getH(device.timeron);
var timeronm = document.createElement('select');
for(var i = 0; i < 60; i++){
var m = document.createElement("option");
if(i < 10){
  i = '0'+i;
}
m.innerHTML = i;
m.setAttribute("value", i);
m.className = 'timeritems';
timeronm.appendChild(m);
}
timeronm.id = 'timeronm'+device.id;
timeronm.value = getM(device.timeron);

timeron.appendChild(timeronh);
timeron.appendChild(timeronm);

var timeroff = document.createElement("div");
timeroff.className = 'timeritems';
timeroff.id = 'timeroff'+device.id;
var timeroffh = document.createElement('select');
for(var i = 0; i < 24; i++){
var h = document.createElement("option");
if(i < 10){
  i = '0'+i;
}
h.innerHTML = i;
h.setAttribute("value", i);
h.className = 'timeritems';
timeroffh.appendChild(h);
}
timeroffh.id = 'timeroffh'+device.id;
timeroffh.value = getH(device.timeroff);
var timeroffm = document.createElement('select');
for(var i = 0; i < 60; i++){
var m = document.createElement("option");
if(i < 10){
  i = '0'+i;
}
m.innerHTML = i;
m.setAttribute("value", i);
m.className = 'timeritems';
timeroffm.appendChild(m);
}
timeroffm.id = 'timeroffm'+device.id;
timeroffm.value = getM(device.timeroff);
timeroff.appendChild(timeroffh);
timeroff.appendChild(timeroffm);


var checkbox = document.createElement("input");
checkbox.setAttribute("type", "checkbox");
checkbox.checked = device.timer;
checkbox.id = 'timer'+device.id;

timerdiv.appendChild(on);
timerdiv.appendChild(timeron);
timerdiv.appendChild(off);
timerdiv.appendChild(timeroff);
timerdiv.appendChild(checkbox);

//Suntimer
var sundiv = document.createElement('div');
sundiv.className += 'sundiv';
var suncheck = document.createElement('input');
suncheck.setAttribute('type', 'checkbox');
suncheck.checked = device.timersun;
suncheck.id = 'suntimer'+device.id;
suncheck.className += 'sunitem';
var suntext = document.createElement('p');
var textsun = document.createTextNode('Sun Timer');
suntext.appendChild(textsun);
suntext.className += 'sunitem';
sundiv.appendChild(suncheck);
sundiv.appendChild(suntext);



//sunTimerbutton
/*var timer = document.createElement('p');
var timertext = document.createTextNode('\u263c');



timer.className += 'devicetimer btn btn-lg btn-default'
timer.appendChild(timertext);*/
//Add to div
div.appendChild(name);
div.appendChild(status);
div.appendChild(timerdiv);
div.appendChild(sundiv);
//div.appendChild(timer);
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

function updateTimerSun(id, timersun) {
var device;
firebase.database().ref('/devices/' + id).once('value').then(function(snapshot) {
  device = snapshot.val();
  updateDevice(id, device.name, device.model, device.dimmable, device.status, device.level, device.timeron, device.timeroff,
    device.timer, timersun);
});
}

function updateTimer(id, timer, timeron, timeroff) {
var device;


firebase.database().ref('/devices/' + id).once('value').then(function(snapshot) {
  device = snapshot.val();
  updateDevice(id, device.name, device.model, device.dimmable, device.status, device.level, timeron, timeroff,
    timer, device.timersun);
});
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
