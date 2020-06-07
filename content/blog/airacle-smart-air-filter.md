---
title: "Airacle: Smart Air Filter"
date: 2020-06-07T01:22:43.649Z
subtitle: Difficult times require trascendental measures
tags: arduino neopixel sensors virus micron
---
# Airacle: Smart Air Filter

On times of COVID19 and cleanliness exacerbation, a group of people did think of an idea that just might help a lot of people. These guys came and proposed an AirFilter project, nonetheless it had a twist, some uv inside, modular addenda,  and wifi connection to develop (towards future) machine learning algorithms.

Thinking about it, all the people in the world should have one on those systems. It would be so helpful to air control, pollution and sickness control.  Actually one of the problems are the costs implied by some of the components, and the other one is the size required to clean a place in certain time.

Taking the size problem out as it could be exchanged for the time turned on, the development team looked for a not-so-expensive solution that could allevitate some of the problems related to air contamination inside houses. This document will not focus on the process of how they came to the idea, but on the tech used to build this.

![/assets/airacle%20Untitled.png](/assets/airacle%20Untitled.png)

## Design considerations

There were some specific requirements that had to be met in order to build the aparatus:

- It should be done with reachable technology (as for a small city).
- Costs should be kept at minimal
- Should have a humidifier
- Should meaure 1,2.5 and 10 micron particles
- Should be controlled by an app
- Should have a ventilator that could suck up the air and expell it through a UV filter
- Should be secure and easy to use and mantain
- The data should be taken out of the system to a web database

Those specific elements were gathered and the final hardware proposal was the following:

- Main control module: Arduino UNO
- WifiController: NodeMCU
- Humidifier RC D4
- MQ2 Gas Sensor
- GP2Y1014 Dust Sensor
- DHT11 Humidity and temperature sensor
- L298N motor controller
- A simple PC Fan
- Neopixel strip for function display
- UV cleaning germicide light

![/assets/airacle%20Untitled%201.png](/assets/airacle%20Untitled%201.png)

After defining the hardware components, a document to set the different functions was made and shared by the entire crew.

## Elecronic conceptual wiring

Next, is the way all the components were connected. This gathers a lot of information from many different sites (as almost every component was on its very own project).  

![/assets/airacle%20Schematic_Airacle_2020-06-06_18-20-19.png](/assets/airacle%20Schematic_Airacle_2020-06-06_18-20-19.png)

in the graphic, there are all the main components and the wiring between them. The NEOPIXEL is just indicated. The wiring is based on a breadboard. Some modifications were done on this design to get it into de final device.

## Software Architecture

As the code was going to be implemented on Arduino, an imperative paradign became the choice.

There are 5 modules and three main modules that are the following:

### Main Arduino control system

1. [MAIN MODULE] Airacle: in charge of joining everything and setting the times for every component in the system. One specific consideration as of this module is that it is the only one that has a call to "delay()".
2. Communication controller: abstraction design to communicatio with nodemcu via serial.
3. Motor Controller: module designed to maintain all the implementation details of motors in just one place
4. Sensor Controller: module that has every sensor in the system: MQ2, GP2Y1014 and DHT11
5. Timer: abstraction done to get a sense of events according to millis that had to pass before something happened
6. LedController: main neopixel controller implementing breath and chase modes.

### NodeMCU transmitter control system

1. [MAIN MODULE] Airacle_HTTP_Module: main communications module has imp´lemented a server and a client. Meanwhile just the client is used to transfer the data to the server, a Serial Communications port is opened with the Airacle Main Module (to receive the data).

### Web server

1. server: PHP script that supports the sending of all the serialized variables (string).
2. GetMode: incase a mode was set on database, this script (PHP) delivers the mode.
3. ChangeMode: a url to change the actual function mode of the Aircle sent on id header.

## Main Algorithms

There are some algorithms that are worth to mention as a reference for other projects that wish to implement the same architecture.  

### General Main Module Algorithm & Event Handling

From robotics programs, it should be clear that a delay that sets NOOP order on the processor is needed so motors and sensors subsystems can work. Nevertheless, lots of alumni get delays everywhere, asking themselves why there are parts of the program that sometimes run, and sometimes doesn't.

The following algorithm considers:

1. There should be just one delay in all the system
2. A possibility for timing or delayed events must be considered
3. All must function "at the same time" just by calling "update" functions.

![/assets/airacle%20Untitled%202.png](/assets/airacle%20Untitled%202.png)

As it can be seen, the main module alfgorithm initializes the timer and sets the events it needs to check after. The parameters in setEvent are just integers that mean the ID of the event, and the time when the next event should be called. Once an event fired up, it clears the counter.

It is very important to note that doFunctionMode is really implemented as doFunctionOneWithMode(), and inside that IF there's a big classification of the cases.

Inside Timer Initialization the algorithm is like this:

![/assets/airacle%20Untitled%203.png](/assets/airacle%20Untitled%203.png)

![/assets/airacle%20Untitled%204.png](/assets/airacle%20Untitled%204.png)

SetEvent and TimerEvent are called whenever a module wants to setup an event, and then when loop function notifies the module by calling explicitely timerEvent and calling the module update (or whatever name it is ) function.

### General feature mode Algorithm

All the function modes are divided internally in phases. Each phase and mode set the LEDs, motors or other actuators.

![/assets/airacle%20Untitled%205.png](/assets/airacle%20Untitled%205.png)

Basically, each function on its first phase sets the time that it will need to setup. When that has happened, it sets another time (that could o could not be the same as before) setting how much next phase is going to last. When next phase has completed (timerEvent) it repeats with the following phase. At the very end, not only phase finishes but also mode is returned to 0.

## Conclussions

- Germicide UV Light is not only difficult to get, but also very expensive. The prototype had to implement a much more basic one.
- The interface that Neopixel lights give in great for giving a sense of what is going on. Very bright and quick.

The code, electronics and setup is just a small part iof this project that aims towards a very noble objective, help the people on this time and forward. The algorithms done with this can ve seen on GitHub: [https://github.com/joekreatera/Airacle](https://github.com/joekreatera/Airacle)

This project's website is [http://airacle.com.mx](http://airacle.com.mx) and Sunday May 7th shpuld be online.

I hope this setup, project and demo helps other people to generate as fast as possible a similar implementation, or maybe some ther stuff much more complicated.

Thanks for reading!
