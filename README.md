# Lampor
Server and web UI for controlling your TelldusCenter.
Useful if you are running telldus center on a deticated machine.

# Installation
This program will require some configuration on your part.

First clone this repo! You should also have node.js installed on your system. 
You will also need to install Telldus as per the instructions [here](https://www.npmjs.com/package/telldus). 
Add all your devices to TelldusCenter.

Then navigate to the project and run the following line:

```
npm install firebase --save-dev
```

Once this is done you will need to set up a firebase-project.

Go [here](https://firebase.google.com/) and follow the instructions.

After you have a firebase-project you will need to edit the .js files in the project, index.js, adddevices.js, and firebaseweb/public/index.js

Near the top of these files should be a codeblock that looks like this:

```javascript
//Replace the below config with yours!
var config = {
  apiKey: "yourapikey",
  authDomain: "yourdomain.firebaseapp.com",
  databaseURL: "yourdomain.firebaseio.com",
  storageBucket: "yourdomain.appspot.com",
  };
```
You will need to get this configuration from the console in your firebase-project.

Navigate to you console and click the "Add firebase to your web app". Copy the config from there and insert it into the files.

After this, make sure telldus center is running and then navigate to the lampor directory. 
Run:
````
node adddevices
```

If it does not terminate kill it with ctrl+z.

Check you firebase database from the firebase console. You should have a list of your deviceids!

#Add the Web UI

Now you will need to add the Web UI to firebase to be able to control the lights!

Follow the steps in hosting in your firebase console. The folder firebaseweb is where you want to run the commands.

Once that is done you can run the server by running: 

````
node index
````

in the lampor folder!

That should be it, if I missed a step and it doesn't work, post an issue!
