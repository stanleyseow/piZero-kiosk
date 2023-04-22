const axios = require('axios');
const fs = require('fs-extra');
const sleep = require('system-sleep');
const exec = require('child_process').exec;

require('dotenv').config();


const file = '/home/pi/getConfig/config.cfg'
const template = '/home/pi/getConfig/dashboard.txt'
const dashboard = '/home/pi/dashboard.sh'
let data2

// url , payload and config for Axios


let payload  =
{
    deviceName: "KD-001",
    deviceClass: "kiosk-dashboard",
    chipID: "ABCD1234",
    location: "nolocation",
    msg: "bootup"
}


let config = {
    headers: {
      'Authorization': 'Bearer Basic e17d4868-098b-11eb-a77d-4f439fc3fa32'
    }
}

const url = process.env.SERVER_URL

const str = '/usr/bin/chromium-browser --noerrdialogs --disable-infobars --kiosk '
fs.readFile(template, 'utf8', function(err, data) {
    if (err) throw err;
    //console.log(data);
    data2 = data;
});


console.log('*** url: ', url);
axios.post(url, payload , config )
  .then(response => {
        let json = response.data;
        console.log('*** display url: ',json.url);

        fs.writeFile(dashboard, data2, function(err) {
                if ( err) throw err;
                });

        fs.appendFile('/home/pi/dashboard.sh', str  + json.url + '\n', function (err) {
                if (err) throw err;

                console.log('URL updated!');
                sleep(1000);
                execute('sudo systemctl restart dashboard', function(callback){
                        console.log(callback);
                        });

                console.log("sleep 5 mins");
                sleep(300000);
        })


   })
  .catch(error => {
    console.log(error);
  });


function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
}

