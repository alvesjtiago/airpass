const {
  app, 
  Menu, 
  Tray, 
  Notification, 
  clipboard,
  shell
} = require('electron');

const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

var appIcon = null;

app.on('ready', function(){
  
  // Menu bar icon
  appIcon = new Tray(path.join(__dirname, '/assets/images/iconTemplate.png'));

  // Hide dock menu
  app.dock.hide();

  // Quit app on right click event
  appIcon.on('right-click', function(event, files) {
    app.quit();
  });
  
  // Renew MAC address on click event
  appIcon.on('click', function(event, files) {
    let notification = new Notification({
      title: 'Tricking the network 🤖',
      body: 'Please input your password when requested to make the necessary changes.'
    })
    notification.show();

    var sudo = require('sudo-prompt');
    var options = {
      name: 'Airpass'
    };
    sudo.exec("ifconfig en0 ether `openssl rand -hex 6 | sed 's/\(..\)/\1:/g; s/.$//'`", options,
      function(error, stdout, stderr) {
        if (!error) {
          let notification = new Notification({
            title: 'All done 👌',
            body: 'Join the network again for free wi-fi 📡'
          })
          notification.show();
        } else {
          let notification = new Notification({
            title: 'Something went wrong 😞',
            body: 'Plese try again.'
          })
          notification.show();
        }
      }
    );
  });
});