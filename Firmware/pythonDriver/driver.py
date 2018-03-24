# /**
#  * HC-SR04 Demo - Raspberry PI
#  * Date: March 22, 2018
#  * HC-SR04 Driver using Python
#  *
#  * Hardware:
#  *  Connect the ultrasonic sensor to the Raspberry as per the
#  *  hardware connections below.
#  *
#  * Hardware Connections:
#  *  HC-SR04   |   Raspberry
#  *  -------------------
#  *    VCC     |   Pin  2
#  *    Trig    |   Pin 16 (GPIO 23)
#  *    Echo    |   Pin 18 (GPIO 24)
#  *    GND     |   Pin  6
#  *
#  * !!!Recommended Circuit Assembly
#  *  The sensor output signal (ECHO) on the HC-SR04 is rated at 5V.
#  *  However, the input pin on the Raspberry Pi GPIO is rated at 3.3V.
#  *  Sending a 5V signal into that unprotected 3.3V input port could
#  *  damage your GPIO pins! Use a small voltage divider circuit,
#  *  consisting of two resistors, to lower the sensor output
#  *  voltage to something our Raspberry Pi can handle.
#  *  One 1k Ohm and one 2k Ohm resistors should be fine.
#  *
#  * Software
#  *  Copy the file to your Raspberry PI in a folder.
#  *  Run the script 'python driver.py'
#  *  The distance read from the sensor will be displayed
#  *  in centimeters and inches.
#  */



# Setup
# ==============================================

import RPi.GPIO as GPIO   # import RPi.GPIO to interact with the GPIO
import time               # import time to set the app to wait 10uS

GPIO.setmode(GPIO.BCM)    # set the pin numerotation to use the Gpio number on Raspberry and not number of the pin

# Pins
TRIG=23
ECHO=24
GPIO.setup(TRIG,GPIO.OUT)
GPIO.setup(ECHO,GPIO.IN)

try:
    while(True):

        # Wait a second to be sure that the measurement is precise
        time.sleep(1)

        # Set TRIG to low
        GPIO.output(TRIG,False)


        # Set trigger high for 10 microseconds
        GPIO.output(TRIG,True)
        time.sleep(0.00001)
        GPIO.output(TRIG,False)

        # Get the last timestamp just before the return signal is receive
        while(GPIO.input(ECHO)==0):
            pass
        pulse_start=time.time()

        # Get the last timestamp when the ECHO pulse is over(it means that the measurement is over)
        while(GPIO.input(ECHO)==1):
            pass
        pulse_end=time.time()

        pulse_duration=pulse_end - pulse_start

        resCm = round(pulse_duration * 17150, 2)
        resInch = round(pulse_duration  * 17150 * 0.3937, 2)

        print('Distance is ', resCm, ' cm')
        print('Distance is ', resInch, ' inch')

except KeyboardInterrupt:
    GPIO.cleanup()
