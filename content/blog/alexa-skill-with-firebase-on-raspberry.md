---
title: Alexa Skill with Firebase on Raspberry
date: 2020-06-06T18:38:32.802Z
subtitle: Project that implemented a Alexa, Google, Fadecandy, Neopixel,
  Raspberry Strategy
cover: /assets/togo.png
tags: neopixel raspberry amazon alexa polly node.js
---
Recently a group of enthusiasts came with the idea of generating a parents **assistant** that could take care of **children's activities** at noon or at morning. One of the requirements was that this "little guy" should **talk and receive command voice**s. It was decided that prototyping such a system using a **raspberry, Amazon Alexa and a Google Firestore Database** would be the best option.

This was all done during COVID19 crisis in Mexico. The project development suddenly became harder due to the distance and safety rules.

As "Togo" had to display some faces, the team decided to implement the **Neopixel LED Strings** (that would be later changed for **LED Rings**). So a **Fadecandy** controller was also inside the prototype as this makes easier LED development and testing.

There were some "holes" in the plan:

1. **There was not a talking component**: Although it was decided that Togo should talk, there was no clear option on how to develop this requirement. Later, Amazon polly was implemented being an easy option and a pretty powerful one too.
2. **The development language was still TBD**: just after the decision on Alexa, FadeCandy and Raspberry, the alternatives became clear: javascript or python. A Java decision would have made a complicated journey on the Alexa Skill development phase. Anything else would be unexplainable to the team (coding guy, me, wanted to keep the code and development as clear as possible to the rest of the party).
3.  **The fadecandy needed an extra componen**t: the previous implementations of Fadecandy required a server that could open the USB and start sending the commands.
4. **Raspberry would need speakers, and a microphone**: the raspberry that the team bought was a Raspberry PI 3 A+. With one speakers output and no Mic input. A USB Hub implemented to overcome this, on top a mic/speakers input-output USB sound card.
5. **There was no clear "skill" development mode/server**: as the research was unveiling different technical aspects, it became clear that there should be a server routed with ngrok or an Amazon Lambda based script. The latter did its way to the final development strategy as it needed minimal configuration each time the system would be tested.
6. **There was an idea of having Togo as a reminder of special days**: Google calendar was decided as the best option to get a list of events in a certain calendar.
7. **A certain mechanism for stopping of telling togo that assigned tasks were done, had to be designed:** long after starting the project, it was needed a physical button. A limit switch was implemented.

## Software Architecture / Togo-Alexa-Lambda-Firestore

From a general perspective, what the entire solution does is:

1. Togo hears the voice from user (this has to be done saying "Alexa").
2. Sends the clip to Alexa Service
3. If Alexa Service recognizes it, call Lamda Service
4. Lambda Service would send the order to Firebase (in a event catalogue).
5. Togo will ask each 10 seconds for a new event on Firebase.
6. Firebase will return every event happened.
7. Togo app will set those events in Firebase as "consumed".
8. Specific code will deal with each of the events.

![/assets/togo%20Untitled.png](/assets/togo%20Untitled.png)

## Process

The project's development was divided into two teams: Coding & Electronics, and Industrial Design. These would provide the necessary components to make Togo happen.

A diagram of the solution is presented:

![/assets/togo%20Untitled%201.png](/assets/togo%20Untitled%201.png)

It should be clear that for every component in the Cloud, there is a client that should be configured.

With this definition given, development was oficially started and followed the following steps:

1. Test Amazon SDK and raspberry integration
    
   1. *Installed a Windows test with instructions provided directly from Amazon* ([instructions here](https://developer.amazon.com/en-US/docs/alexa/avs-device-sdk/windows-64.html)): the first challenge was to understand the Amazon Alexa Solution components. Reader can analyze a diagram on this section (really helpful as this is hard to find on web). Cygwin environment was needed as Amazon has the process for a linux based computer (easy and you can go forward with no issues). A certain minor setback is taking the config.json key from Amazon website ([here](https://developer.amazon.com/en-US/docs/alexa/alexa-voice-service/register-a-product.html)). Any folk implementing this could make the process before or after installing cygwin, but must be prior to hitting the "MAKE" command to build Alexa Base Listener. ![/assets/togo%20Untitled%202.png](/assets/togo%20Untitled%202.png) alexa and developer components. Order in which they are called.  

   2. Test the Amazon Alexa service by configuring a Skill. Amazon has an app for that!. Alexa App allows you to check that is going on with your Alexa. The config.json donde is linked to your account. As long as you keep the same email, Alexa will know who's the developer, and your "new device" (simulated windows account). There's also a web that shows the activated skills, some examples and the last recognized commands: [alexa.amazon.com](http://alexa.amazon.com). One of the problems encountered was that instructions specifies that one should wait for this screen: ![/assets/togo%20Untitled%203.png](/assets/togo%20Untitled%203.png) But the text just goes by giving a screen of "can't connect yet". So, whenever a developer wants to find the code, he should scroll in search of this segment.
    After this, the testing is very easy.

   

2. Set up Alexa skill and utterances : the developer has to go inside alexa developer console and create a new skill. As this is pretty straightforward, one of the main issues is connecting it to lambda service. First, the configuration was done by following the next tutorial: [https://developer.amazon.com/en-US/docs/alexa/devconsole/create-a-skill-and-choose-the-interaction-model.html](https://developer.amazon.com/en-US/docs/alexa/devconsole/create-a-skill-and-choose-the-interaction-model.html). At the end of the tutorial, this won't be connected to lambda service (to decide something other than Custom Skill, read: [https://developer.amazon.com/en-US/docs/alexa/ask-overviews/understanding-the-different-types-of-skills.html](https://developer.amazon.com/en-US/docs/alexa/ask-overviews/understanding-the-different-types-of-skills.html)).
3. Configure Amazon lambda service: this tutorial at [medium.com](http://medium.com) is excellent; anyone should understand the code associated ([here](https://medium.com/coinmonks/how-to-develop-an-amazon-alexa-skill-using-node-js-b872ef5320b1)). After all the setup, a dveloper has to zip all (index and node_modules) and go to aws developer console (this is also in the tutorial), create the lambda service and upload the zip.  It is very important to generate the Alexa Skills Kit Trigger, as this will generate the end point for the service. Config will need the skill id, that is found on Alexa Developer Console (inside the skill), on Endpoint section. This id will go into the trigger, and finally the trigger will output a "ARN" address. The ARN address has to be set on Alexa Endpoint to connect alexa skill with lambda service (tutorial is excellent for this as Amazon fails to provide something as clear).
4. Study some of the amazon ask core code implemented. On the project, one of the first issues was to understand what was going on inside the node.js lambda service. The very base after requiring the ask-core is the main.exports area:

    ```jsx
    exports.handler = Alexa.SkillBuilders.custom()
        .addRequestHandlers(
            LaunchRequestHandler,
            HelloWorldIntentHandler,
            SetWakeUpTimeIntentHandler,
            TaskCompletionIntentHandler,
            StartBedtimeRoutineIntentHandler,
            StoryTellIntentHandler,
            SetImportantDateIntentHandler,
            HelpIntentHandler,
            CancelAndStopIntentHandler,
            SessionEndedRequestHandler
            )
        .addErrorHandlers(
            ErrorHandler)
        .withApiClient(new Alexa.DefaultApiClient())
        .lambda();
    ```

    Alghough it might appear complicated at the very start, is pretty easy.  The exports.handler on index.js (required as this) will generate a server that is "listening" to Alexa Invocation inside Amazon network. What a developer wants to ser after "LauchRequestHandler" are all the classes (defined earlier in tutorial) that should answer a certain attempt. A good question would be: How does lambda service know which intent/utterance goes to which class? The message that will come from Amazon Alexa has a string property that has the "order". The standard is that a IntentName in Alexa Console has the same name without "Handler" suffix.
    So each class defined above will check the "order" sent by alexa and, if developer explicitely defines it, will respond to that intent.
    The name at Alexa Amazon Developer Console set for the Intent, is the one that shpuld be checked at code:

    ![/assets/togo%20Untitled%204.png](/assets/togo%20Untitled%204.png)

    In this case "HelloWorldIntent" , should have a class (conveniently named **HelloWordIntentHandler**) that will set up code to check the IntentName:

    ```jsx
    const HelloWorldIntentHandler = {
      canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
      },
      async handle(handlerInput) {
         const firstNameValue = Alexa.getSlotValue(handlerInput.requestEnvelope, 'name');
    	let speechText =" Hello you " + firsNameValue;
      return handlerInput.responseBuilder
          .speak(speechText)
          .withSimpleCard( "Hello from App",  speechText )
          .getResponse();
      }
    };
    ```

    Callback function canHandle will let AlexaSkillsKit the this class can responde to HelloWorldIntent. After that, ASK CORE will call  `handle(handlerInput)` passing some of the Alexa Developer Console defined parameters through function parameters. This is especially useful when requiring a type of VARIABLE to be recognized such as names, dates, or numbers. This technique is called SLOTS  and there are a ton of them: [https://developer.amazon.com/en-US/docs/alexa/custom-skills/slot-type-reference.html](https://developer.amazon.com/en-US/docs/alexa/custom-skills/slot-type-reference.html). This is a voice-interface-design consideration, and while is very easy to set, it might be difficult to decide which one. From Amazon developer console the developer has to set the slot in the specific utterance:

    ![/assets/togo%20Untitled%205.png](/assets/togo%20Untitled%205.png)

    ![/assets/togo%20Untitled%206.png](/assets/togo%20Untitled%206.png)

    After that (it is very easy to create the slot, and just below you have to define a type), a developer should always Save the Model and Build the Model. This will set it up for calling.

5. Test the skill: To set the skill and check wether is functioning or not, it must be activated on amazon alexa USER APP.  The developers went on to: [alexa.amazon.com](http://alexa.amazon.com/) and inside "SKILLS" section there is a top right small button that will list USER SKILLS.

    ![/assets/togo%20Untitled%207.png](/assets/togo%20Untitled%207.png)

    ![/assets/togo%20Untitled%208.png](/assets/togo%20Untitled%208.png)

    Inside the section, there's a section (third from the right) that will list the Developer Skills. The user has Click on it, and inside this section, ACTIVATE IT.

    ![/assets/togo%20Untitled%209.png](/assets/togo%20Untitled%209.png)

    ![/assets/togo%20Untitled%2010.png](/assets/togo%20Untitled%2010.png)

    If a developer wants to try, at first, it might do nothing, or the orders won't appear to be being received. The HOME section on the very first part of the alexa site has the calls. The problem is that if the service has some type of problem, the "CARD" will not show.

6. Debug the call: to be able to do some debugging (especifically the lambda part), it is possible to set some `console.log()` calls and see them through Cloud Watch.

    Inside lambda service, there is a tab called MONITORING

    ![/assets/togo%20Untitled%2011.png](/assets/togo%20Untitled%2011.png)

    Inside, there is a Recent Invocations sector, that will show any codeing error or the `console.log()` calls.

    Remember to take out these console calls before going to production.

7. Generated database that would hold Alexa Orders: On Firestore, the necessary catalogued where generated.

    ![/assets/togo%20Untitled%2012.png](/assets/togo%20Untitled%2012.png)

    Main structure used (other collections are just for future releases) :

    - robot_events: holds alexa orders
    - routines: holds the robot morning and noon routines.

    Events collection is like this:

    ![/assets/togo%20Untitled%2013.png](/assets/togo%20Untitled%2013.png)

    Routines collections appears like this:

    ![/assets/togo%20Untitled%2014.png](/assets/togo%20Untitled%2014.png)

8. Set up Amazon polly service: As Togo needed to talk, Amazon Polly was the weapon of choice. Configuring it is pretty straightforward with specific attention to permissions. This tutorial was followed: [MEDIUM](https://medium.com/better-programming/text-to-speech-build-apps-that-talk-with-aws-polly-and-node-js-a9cdab99af04)
9. Set up code access on final togo code: each of the services would need their own config file for user auth and recognition. Each of the files were set on development machine.
    - Amazon Alexa does not need any config file inside togo. No more than the SDK configured at the very start
    - Config_aws.json: file downloaded to set up Polly
    - google auth json: When setting up firebase there will be an account linked to the project that a developer has to confiure: [https://firebase.google.com/docs/admin/setup#initialize_the_sdk](https://firebase.google.com/docs/admin/setup#initialize_the_sdk)
    - In project's case, a Google Calendar.json ([https://developers.google.com/calendar/quickstart/nodejs](https://developers.google.com/calendar/quickstart/nodejs))
10. With all the credentials and setup done: Code the final Solution. Once the different components were done, the code was basic, with no more than 700 lines, and 578 for the fadecandy easier control. A further explanation of the coding is below.
11. Once the code was ready, install on raspberry. The final implementation was on the Raspberry. Amazon has quite a good tutorial on installing the sdk that is actually easier than the windows side: [https://developer.amazon.com/en-US/docs/alexa/alexa-voice-service/set-up-raspberry-pi.html](https://developer.amazon.com/en-US/docs/alexa/alexa-voice-service/set-up-raspberry-pi.html). Notes on the installation:
    1. Is INCREDIBLY SLOW at least on rasperry pi 3 A+. When generating the install, this part (took hours):

        ```bash
        cd /home/pi/
        sudo bash setup.sh config.json [-s 1234]
        ```

    2. Take out -j2 parameter inside setup.sh
    3. Get a bigger swap file (dhpys)
12. Set raspberry as a devlopment machine: before to getting the code inside the RASP, some modifications had to be done. W3Schools has a great tutorial on this; [https://www.w3schools.com/nodejs/nodejs_raspberrypi.asp](https://www.w3schools.com/nodejs/nodejs_raspberrypi.asp)
    1. SD card had the most basic raspian available
    2. Install node js. At the time of writing, version 12 was available.
    3. install libusb-dev, libudev1, libudev-dev (apt-get 'em) for fadecandy direct usb module
13. Wire everything up
14. Set up git as a tool to version and handover the code from windows dev machine to raspberry machine. ([https://github.com/joekreatera/togoapp](https://github.com/joekreatera/togoapp)) Main file: index.js
15. Execute npm install to set up all the libs needed:

    [Libs needed by Togo App](https://www.notion.so/8a40d0906025453aa9bd7ff3343b8aa3)

16. Get all cables and processors inside Togo Friend
17. Test and finish.

## Notes on code development

for a graphical detail, data model and very general sequence diagram: [https://app.lucidchart.com/publicSegments/view/c61e548e-2953-4c15-bd2c-3dcc38720500/image.pdf](https://app.lucidchart.com/publicSegments/view/c61e548e-2953-4c15-bd2c-3dcc38720500/image.pdf)

Maybe the first great principle of all coding challenges is "DEFINE THE REQUIREMENTS". For this project in particular, a chart was done with some critical and wanted features.

![/assets/togo%20Untitled%2015.png](/assets/togo%20Untitled%2015.png)

![/assets/togo%20Untitled%2016.png](/assets/togo%20Untitled%2016.png)

The development team wants to show that this was done at different stages in the project, names might have changed but objectives and implementation keeps the same

### General Algorithm

With those requirements defined, there was a general main algorithm defined:

![/assets/togo%20Untitled%2017.png](/assets/togo%20Untitled%2017.png)

A general loop based on timeouts and intervals was defined in order to manage some async code as firebase. The SynFunction controls the state in which the app is:

![/assets/togo%20Untitled%2018.png](/assets/togo%20Untitled%2018.png)

And the general query asks the database for the latests events:

![/assets/togo%20Untitled%2019.png](/assets/togo%20Untitled%2019.png)

Basically, what this is doing is asking for all the events. Once it has obtained them, set the desired state according to what Alexa sent to Firebase. If is a routine, there's an extra step in which the system will get the activity routine from firebase (as this is a feature in which the parent would be able to change, add remove tasks of an activity from a webapp) . Afterwards, Togo will enter on activity_check state that just keeps asking the limit switch (placed on the head of the object) wether it has been pressed.

There are some parts that change Togo's face. A complete component was generated towards this requirement. Face changing is not visualizaed on general algorithm for simplification purposes.

### Neopixel Module

Neopixel lights are a great product that relates perfectly to the [fadecandy](https://www.adafruit.com/product/1689). Wiring is minimal and the LEDs last forever. On previous projects, Raspberry had to manage Fadecandy through a server that had to be installed. The development of a new node module allows direct access to USB and just works.

So, after some lighting tests (initially bought LED Strips) the team determined that the product that would fit better to the project was [LED RING](https://www.adafruit.com/product/1463).

Being easy to wire, an issue came out. Each of the RINGS would be wired separately to different ports on the Fadecandy.  Each of the ports can control up to 512 LEDs, and the way it has to manage the "next strip" is on indexes above that number. So total number of LEDS available es 8*512, dividided in eight strips (that's the 8).

Also, the requirement needed Togo to smile. This had to be made with specific pixel lighting, and the basic library provided is just a general data train that is sent to USB.

So a more useful set of classes were built:


![/assets/togo-untitled-20.png](/assets/togo-untitled-20.png)

Neopixel: Main class that exposes all the methods via a static interface for a SingleTon pattern (inside).

NeopixelLogicModule: class that represents each of the lines of Fadecandy strings (in this case, rigns).

PixelColor: abstraction of a color with R,G,B components.

NeopixelConstants: constants used everywhere. 

So the way to work of these classes: user code should jjust refer to Neopixel. This class initializes with a JSON similar to this one:

```jsx
var configData ={
    ledsPerStrip:16,
    strips:[
      {
        mode:NeopixelConstants.PIXEL_MODE,
        loopMode:NeopixelConstants.PING_PONG,
        mainColor:PixelColor.CYAN,
        secondaryColor:PixelColor.CYAN,
        leds:16,
        chaseWidth:4,
        pixelArray:[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1]
     },
      {
        mode:NeopixelConstants.EYE_BLINK_MODE,
        loopMode:NeopixelConstants.FORWARD,
        mainColor:PixelColor.CYAN,
        secondaryColor:PixelColor.CYAN,
        leds:16,
        chaseWidth:4
     },
     {
       mode:NeopixelConstants.EYE_BLINK_MODE,
       loopMode:NeopixelConstants.FORWARD,
       mainColor:PixelColor.CYAN,
       secondaryColor:PixelColor.CYAN,
       leds:16,
       chaseWidth:4
    },

    ]
};
```

After it is initialized, user code could change each of the strips/rings separetly or together. Neopixel code offers an additional layer of abstraction to show, with 3 rings, a happy face, sad face and idle face. 

There are some important modes in NeopixelLogicModules:

- BreathMode: gradients from one color to the other in time.
- ChaseMode: a set if pixels going throught the strip/ring as chasing each other. The chase mode has a chase_width variable that determines how many pixels will be going after. The other pixels in the strip will just set to 0.
- Breath-Chase Mode: is a layered mode in which the pixels not being used by Chase mode, are breathing.
- Freestyle Mode: a syncFunction and GetColor are callback functions that will be called so user code can change arbitrarily the display. Cjanges the color,  but won't specify the indexes of the data.
- EyeBlink Mode: the rings are taken from 0 to 15 indexes and divided in halves. After certain amound of seconds they start to turn off from the first quarter index to middle and 0. At the same time, there will be turning off from the third-quarter index to the midlle and full index.
- Pixel mode: an array is passed with the pixels that should be in color. 1 for color , 0 for no color. The color will be taken from main module color.

In a very general way, this was the project development. Should you have any issues, questions or suggestions, you can always email me to: [joe@videogamesacademy.com](mailto:joe@videogamesacademy.com) or using this [contact form](https://cms.joe.videogamesacademy.com/contact).

---
## You can check the actual product site (spanish) at: [TOGO BOT](https://www.togobot.com.mx/)

---
Thanks for reading!

![/assets/joeLogoStroke.png](/assets/joeLogoStroke.png)