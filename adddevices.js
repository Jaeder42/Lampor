var telldus = require('telldus');
var firebase = require('firebase');

//Replace the below config with yours!
var config = {
  apiKey: "yourapikey",
  authDomain: "yourdomain.firebaseapp.com",
  databaseURL: "yourdomain.firebaseio.com",
  storageBucket: "yourdomain.appspot.com",
  };
  firebase.initializeApp(config);

telldus.getDevices(function(err,devices) {
  if ( err ) {
    console.log('Error: ' + err);
  } else {
    // A list of all configured devices is returned
      for(var i = 0; i < devices.length; i++){
        parseDevice(devices[i]);
      }
  }
});

function parseDevice(device) {
  var id = device.id;
  var name = device.name;
  var model = device.model;
  var status = device.status.name;
  var level = getLevel(device.status);
  var dimmable = getDimmable(device.methods);


  updateDevice(id,name,model,dimmable,status, level, '00:00',
    '00:00', false, false);
}

function getLevel(status){

    if(status.level != null){
      return status.level;
    }
    else{
      return 0;
    }


}

function getDimmable(methods) {
  for(var i = 0; i < methods.length; i++){
    method = methods[i];
    if(method == 'DIM'){
      return true;
    }
  }
  return false;
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
