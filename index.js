var telldus = require('telldus');
var firebase = require('firebase');
var http = require('http');

var sunset;
var sunrise;
var firsttime = true;
/*telldus.addDeviceEventListener(function(deviceId, status) {
  console.log('Device ' + deviceId + ' is now ' + status.name +' ' + status.level);
  updateStatus(deviceId, status.name, status.level);
});*/
startFun();
//setInterval(syncSunTimer, 86400000);
//setInterval(syncSunTimer, 3000);
//syncSunTimer();

var config = {
  apiKey: "yourapikey",
  authDomain: "yourdomain.firebaseapp.com",
  databaseURL: "yourdomain.firebaseio.com",
  storageBucket: "yourdomain.appspot.com",
  };
  firebase.initializeApp(config);


//TODO add logic for sensors
/*telldus.getSensors(function(err,sensors) {
  if ( err ) {
    console.log('Error: ' + err);
  } else {
    // The list of sensors and their values is returned
    console.log(sensors.data);
  }
});*/
//TODO add timer settings

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
console.log("Test");
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


function setFirebaseListners(deviceId){
  var deviceRef = firebase.database().ref('devices/' + deviceId);

  deviceRef.on('child_changed', function(data) {
    console.log(data.val() + ' ' + data.key);
    var device = data.val();
    var key = data.key
    if(key == 'status'){
      console.log('status');
    if(device == 'ON'){
      turnOn(deviceId);
    }
    else if(device == 'OFF'){
      turnOff(deviceId);
    }
}
else if(key == 'timersun')
{
  if(device == true){

  }
  else if(device == false){

  }
}
else if(key == 'level'){
  var level = parseInt(device);
  dim(deviceId, level)
}
  });

}

function startFun() {
  syncSunTimer();
  var today = new Date();
  var synctime = new Date();
  synctime.setHours(24);

  var difference = synctime-today;
  console.log('Today: ' +today);
  console.log('SyncTime: ' + synctime);
  console.log(difference);

  setTimeout(syncSunTimer, difference);
}

function syncSunTimer() {

var url = 'http://api.sunrise-sunset.org/json?lat=59.447117&lng=18.011013';
http.get(url, function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        var sunResponse = JSON.parse(body);
        sunrise = sunResponse.results.sunrise;
        sunset = sunResponse.results.sunset;

        telldus.getDevices(function(err,devices) {
          if ( err ) {
            console.log('Error: ' + err);
          } else {
            // A list of all configured devices is returned
            for (var i = 0; i < devices.length; i++) {
              setFirebaseListners(devices[i].id);
              if(devices[i].suntimer == true){
                updateSunTimer(devices[i].id);
              }
            }

          }
        });


    });
}).on('error', function(e){
      console.log("Got an error: ", e);
});
if(firsttime){
  firsttime = false;
}
else{
  setTimeout(syncSunTimer,86400000 )
}
//setTimeout(syncSunTimer, difference);
}

function updateSunTimer(id) {
  var today = new Date();
  var ret = new Date();

  var ampm = sunrise.substring(9);
  var timestring = sunrise.substring(0,8)

  var times = timestring.split(":");
  var hours = parseInt(times[0]);
  var minutes = parseInt(times[1]);
  var hh;
  var mm;

  if(ampm == 'AM'){
    if(hours < 10){
      hh = '0'+hours;
    }else {
      hh = hours;
    }
  }else if (ampm == 'PM') {
    hours += 12;
  }

  if(minutes < 10){
    mm = '0'+minutes;
  }else{
    mm = minutes;
  }
  ret.setHours(hours+2);
  ret.setMinutes(minutes);

  sunrisetimer = ret-today;
  if(sunrisetimer < 0){
    ret.setHours(hours+26)
    sunrisetimer = ret-today;
  }
  console.log(sunrisetimer);


}

function setTimer(deviceId) {


}

function dim(deviceId, level) {
  telldus.dim(deviceId, level,function(err) {
  console.log('Device ' + deviceId + ' is now dimmed to level ' + level);
});
}

function turnOn(deviceId) {
  console.log('turnOn');
  telldus.turnOn(deviceId,function(err) {
    console.log('deviceId is now ON');
  });
}

function turnOff(deviceId) {
  console.log('turnOff');
  telldus.turnOff(deviceId,function(err) {
    console.log('Device' + deviceId + ' is now OFF');
  });

}
