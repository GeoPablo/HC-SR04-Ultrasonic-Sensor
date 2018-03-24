/**
 * HC-SR04 Demo - Raspberry PI
 * Date: March 22, 2018
 * HC-SR04 Driver using NodeJS
 *
 * Hardware:
 *  Connect the ultrasonic sensor to the Raspberry as per the
 *  hardware connections below.
 *
 * Hardware Connections:
 *  HC-SR04   |   Raspberry
 *  -------------------
 *    VCC     |   Pin  2
 *    Trig    |   Pin 16 (GPIO 23)
 *    Echo    |   Pin 18 (GPIO 24)
 *    GND     |   Pin  6
 *
 * !!!Recommended Circuit Assembly
 *  The sensor output signal (ECHO) on the HC-SR04 is rated at 5V.
 *  However, the input pin on the Raspberry Pi GPIO is rated at 3.3V.
 *  Sending a 5V signal into that unprotected 3.3V input port could
 *  damage your GPIO pins! Use a small voltage divider circuit,
 *  consisting of two resistors, to lower the sensor output
 *  voltage to something our Raspberry Pi can handle.
 *  One 1kΩ and one 2kΩ resistors should be fine.
 *
 * Software
 *  Copy the file to your Raspberry PI in a folder.
 *  Install the packages using your favorite package manager, then run the script.
 *  Run 'yarn install' inside the folder with this file.
 *  Run 'yarn run start' / 'sudo node driver.js' to run the driver.
 *  The distance read from the sensor will be displayed
 *  in centimeters and inches.
 */


"use strict"

// Setup
// ==============================================
// include pigpio to interact with the GPIO
const Gpio = require('pigpio').Gpio;

// Pins
const TRIG = new Gpio(23, {mode: Gpio.OUTPUT}),
      ECHO = new Gpio(24, {mode: Gpio.INPUT, alert: true});

// declare variables
let pulseStart,
    pulseEnd,
    diff,
    resCm,
    resInch;


//Set up an exitHandler when the user press CTRL+C or the program finish execution
// ==============================================
function exitHandler(options, err) {
  if (options.cleanup){
    TRIG.digitalWrite(0)
  }
  if (err){
    console.log('exit with error');
    console.log(err.stack);
  }
  if (options.exit){
    process.exit();
  }
}


//do something when app is closing
// ==============================================
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catch ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));


//Init
// ==============================================
// set TRIG to low
TRIG.digitalWrite(0);

ECHO.on('alert', (state, usTime) => { //event handler which calls each times ECHO changes it's state from low to high
  if (state == 1) pulseStart = usTime;
  else{ //when state is not 1 (0) it means that the measurement is over
    pulseEnd = usTime;
    diff = pulseEnd - pulseStart;

    resCm = diff / 58;    //from datasheet uS / 58 = centimeters where uS is time difference in microseconds
    resInch = diff / 148  // from datashet uS / 148 = inch where uS is time difference in microseconds
    console.log('Distance is ', resCm, ' cm')
    console.log('resInch is ', resInch, ' inch')
  }
});

// Trigger a distance measurement once per second
setInterval(() => {
  TRIG.trigger(10, 1); // Set trigger high for 10 microseconds
},1000)
