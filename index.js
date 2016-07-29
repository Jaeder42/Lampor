var telldus = require('telldus');
var firebase = require('firebase');
var http = require('http');

var sunset;
var sunrise;
var firsttime = true;



//Replace the below config with yours!
var config = {
  apiKey: "yourapikey",
  authDomain: "yourdomain.firebaseapp.com",
  databaseURL: "yourdomain.firebaseio.com",
  storageBucket: "yourdomain.appspot.com",
  };
  firebase.initializeApp(config);

  startFun();
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
  else if(key == 'timer'){
    for(var i = 0; i < timers.length; i++){
      clearTimeout(timers[i]);
    }
    if(device == true){

      console.log('Update timer');

      syncTimer(deviceId);
    }

  }
  else if(key == 'timersun'){
    for(var i = 0; i < timers.length; i++){
      clearTimeout(timers[i]);
    }
    if(device == true){
      firsttime = true;
      syncSunTimer(deviceId);
    }
  }

  });

  }
  function randomize(id) {
    //TODO contrsuct function that will make lights turn randomly on and/or off during a certain time period
    //for exaple when it is dark.
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

  function syncTimer() {
    console.log('Syncing timer!');
    firebase.database().ref('/devices/').once('value').then(function(snapshot) {
      console.log('Got data from firebase');
      var devices = snapshot.val();
      for(var i = 0; i < devices.length; i++){
        if(devices[i] == undefined){i++}
        var device = devices[i];

        console.log(device);

        var id = device.id;
        var timer = device.timer;
        if(timer){
          updateTimers(id, device.timeron, device.timeroff);
      }
    }
    });

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


              }

            }
          });

          //TODO get device.suntimer from firebase alt. get all data since it should sync the timers as well
          firebase.database().ref('/devices/').once('value').then(function(snapshot) {

            var devices = snapshot.val();

            for(var i = 0; i < devices.length; i++){
              if(devices[i] == undefined){ i++}
              var device = devices[i];
              var id = device.id
              var suntimer = device.timersun;
              var timer = device.timer;
              if(suntimer == true){
                updateSunTimers(id);
              }
              if(timer == true){
                updateTimers(id, device.timeron, device.timeroff);
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
  function updateSunTimers(id){
    var timeroff = updateTimer(sunrise, true);
    var timeron = updateTimer(sunset, true);
    suntimers.push(setTimeout(function(){ turnOn(id); }, timeron));
    suntimers.push(setTimeout(function(){ turnOff(id); }, timeroff));

  }
  function updateTimers(id, on, off) {
    var timeron = updateTimer(on, false);
    var timeroff = updateTimer(off, false);
    timers.push(setTimeout(function(){ turnOn(id); }, timeron));
    timers.push(setTimeout(function(){ turnOff(id); }, timeroff));
  }

  function updateTimer(time, sun) {
    console.log('test');
    var today = new Date();
    var ret = new Date();
    var offset = 0;
    if(sun){
      offset = 2;
    }

    var ampm = time.substring(8);
    var timestring = time.substring(0,8)


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
    ret.setHours(hours+offset);
    ret.setMinutes(minutes);
    ret.setSeconds(0);


    timer = ret-today;
    if(timer < 0){
      ret.setHours(hours+24+offset)
      timer = ret-today;
    }
    console.log(ret);
    console.log(timer);
    return timer;

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
