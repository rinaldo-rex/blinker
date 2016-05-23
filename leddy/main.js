/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Leave the above lines for propper jshinting
//Type Node.js Here :)

var Client = require("ibmiotf");

var appClientConfig = {
	"org" : "a1bl4a",
	"id" : "leddy1",
	"auth-key" : "a-a1bl4a-qkxmthdvws",
	"auth-token" : "C+@qBdNsvo6bwu6@w3"
}

var appClient = new Client.IotfApplication(appClientConfig);
var groveSensor = require('jsupm_grove'); //for grove sensors
var green_led = new groveSensor.GroveLed(2); //LED connected to pin D3
var orange_led = new groveSensor.GroveLed(3); //LED connected to pin D3
var red_led = new groveSensor.GroveLed(4); //LED connected to pin D3

var led = orange_led;
console.log("LED connected to: " + led.name());
var i = 0;//loop initialization variable

//Connecting to the IOTF

appClient.connect();
var totalRating = 0.0;
var rateCount = 0;
var sleep = require('sleep');
appClient.on("connect", function() {
console.log("Successfully connected to IOTF");
appClient.subscribeToDeviceEvents("Rater");
appClient.on("deviceEvent", function (deviceType, deviceId, eventType, format, payload) {

	        console.log("Device Event from :: "+deviceType+" : "+deviceId+" of event "+eventType+" with payload : "+payload);
            console.log("totalRating as of now " +  totalRating);
            console.log("Current Count: "+rateCount);
            rateCount++;
            totalRating += JSON.parse(payload).Rating;
            var aggRate = Math.round(totalRating/rateCount);
            console.log("Aggregated rating: " +aggRate);
            if(aggRate>3){led = green_led;}
            else if(aggRate==3){led = orange_led;}
            else {led = red_led;}
            led.on();
            sleep.usleep(100000);
            led.off();
//            for(var i=0; i<aggRate; i++){
//                console.log("Blinking");
//                led.on();
//                sleep.usleep(100000);
//                led.off();
//                sleep.usleep(100000);   
//            }
});
});
