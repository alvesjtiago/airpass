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
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Refresh MAC address...', 
      type: 'normal',
      click: function(event) { renewMacAddress() }
    },
    {
      label: 'Quit', 
      type: 'normal', 
      click: function(event) { app.quit(); }
    }
  ]);
  appIcon.setToolTip('Airpass');
  appIcon.setContextMenu(contextMenu);

  // Hide dock menu
  app.dock.hide();

  function renewMacAddress() {
    let notification = new Notification({
      title: 'Changing MAC adddress 🤖',
      body: 'Please input your password when requested to make the necessary changes.',
      silent: true
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
            title: 'MAC address changed 👌',
            body: 'Connect to the network again to start a new session 📡',
            silent: true
          })
          notification.show();
        } else {
          let issues_url = "https://github.com/alvesjtiago/airpass/issues"
          let notification = new Notification({
            title: 'Could not refresh MAC address',
            body: 'Please check ' + issues_url + ' for help.',
            silent: true
          })
          notification.show();
          notification.on('click', function(event) {
            shell.openExternal(issues_url)
          })
        }
      }
    );
  }
});