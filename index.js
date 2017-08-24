var express = require("express");
var alexa = require("alexa-app");
var bodyParser = require('body-parser');

var PORT = process.env.PORT || 8080;
var app = express();

// ALWAYS setup the alexa app and attach it to express before anything else.
var alexaApp = new alexa.app("alexa");

alexaApp.express({
  expressApp: app,
  //router: express.Router(),

  // verifies requests come from amazon alexa. Must be enabled for production.
  // You can disable this if you're running a dev environment and want to POST
  // things to test behavior. enabled by default.
  checkCert: true,

  // sets up a GET route when set to true. This is handy for testing in
  // development, but not recommended for production. disabled by default
  debug: false
});

// now POST calls to /test in express will be handled by the app.request() function

// from here on you can setup any other express routes or middlewares as normal
app.set("view engine", "ejs");

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================
var steps = {
  8 : 'Hi there! I can tell you how to build an eclipse projection box so you can safely view a solar eclipse without ever staring directly at the sun! Just say begin to begin, Or say stop to exit.',
  1 : 'to begin, you\'ll need to collect the following supplies. A cardboard box, could be a cereal box, white copy paper, scissors, tape, aluminum foil, and a thumbtack or other sharp thin pin-like object.',
  2 : 'Cut a strip of white paper the size of the end of your box and tape it inside. ',
  3 : 'seal all the seams with strips of tape and aluminum foil to make it light tight. ',
  4 : 'Use the scissors to cut two holes on the far left and right sides of the box panel opposite the white paper.',
  5 : 'Cover one of the holes with foil and tape it in place. ',
  6 : 'Use the thumbtack, or similar thin, pointy ended object to Punch a pinhole through the foil.',
  7 : 'At this stage, the projector you\'ve built should be ready to use! You can wait for a solar eclipse, or you can test it out on any sunny day. Just go outside with your trusty contraption, turn your back to the Sun, line up the box with your shadow, and look through the big hole.  You should be able to see a very small, moderately bright, inverted image of the sun, in sharp focus, projected on the white paper screen on the other end of the inside of the box. If you don\'t see anything,  try moving the box or yourself around, and once you are properly lined up, the image should appear. Cool, eh? Happy sciencing!'
  };
  


alexaApp.launch(function(req, res) {

  
 // res.session('persstep', 0); //maybe we want to put that or some variation of this somewhere else like in the intent. We also never  figured out the repeat function but the hell with that.
  var prompt = "Hi there! I can tell you how to build an eclipse projection box so you can view a solar eclipse safely, and without ever staring directly at the sun! Just say begin, and I'll start with step 1, or, if we've done this before, I'll begin where we last left off. Alternatively, you can say the number of any step from 1 to 7 you'd like to review, and I'll start from there instead. After each instruction, you can say continue to go on to the next step, or stop to exit.  ";
  res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

alexaApp.intent('StepIntent', {
    "slots": {"stepno" : "numnum" },
    "utterances": ["continue", "next step", "begin", "{stepno}", "step {stepno}", "go to {stepno}", "go to step {stepno}", "read step {stepno}", "begin with step {stepno}", "start at step {stepno}"]
  },
  function(req, res) {
  var slotstep = req.slot('stepno');
  var persstep = +req.session('step');
  console.log("persstep= " + persstep + ", slotstep = " + slotstep + ", number.isintegerslotstep= " + Number.isInteger(slotstep) ); //should it be freaking number. Or should I just be integer?
  
if (slotstep && slotstep > 0 && slotstep < 8 && parseFloat(slotstep) == parseInt(slotstep) && !isNaN(slotstep)){
  var step = slotstep; 
    } else if (slotstep == 0){
    var step = 8;
    
    } else if (slotstep > 7 ){
   var morethanseven = 1; 
   // //  res.say("Whoa there, there are only 7 steps. Please choose a step between 1 and 7, or say continue and I'll start from where I think you left off.").shouldEndSession(false);
     } else if (slotstep < 0 && !isNaN(slotstep)){
   var screwingwithme = 1;
     ////   res.say("Really? Negative numbers? You must be messing with me.  C'mon, let's try again, but this time, use positive integers between 1 and 7. Or say continue.").shouldEndSession(false);
        // else if  //***********somewhere we have to define the we have to check to see if the req session variable is defined and then if it isn't defined, define res.session stepcounter/stepno variable as 1 or zero or whatever. If it is defined, then move on to the rest of the code processing. Why is it step req+1 again, i wonder? ;
       } else if (slotstep > 0 && parseFloat(slotstep) != parseInt(slotstep) && !isNaN(slotstep)){ 
         var needinteger = 1;
     } else if (!(+req.session('step')) || !persstep || persstep == 0  || persstep == "??"){
   var step = 1;
 } else if ( persstep == 8 || persstep > 8) {
   var exit = 1;
 } else if (slotstep != "??" && isNaN(slotstep)) {
   var garbage = 1;
   
   //Eep - how do we deal with things that are not defined in the slot? Like an invalid intents? Or invalid rejected slots?
   //need to know of if garbage slot like 'pineapple' and persstep is valid, then refer to persstep. if no slot, then wgat

 } else if (persstep > 0 && persstep < 8 ){
   var step = persstep;
   //for lower down the road //if step = 7 then res.say or end session. or set res.saybsection to...somethjng else  or set turuthiness to a varuable 
 
 
 } else { var didntunderstanderror = 1 }       
  
  if (didntunderstanderror){
    res.session('step', 1)
    res.say("Oh my, this is embarrassing, but I've lost count of where we were stepwise. You can say continue to start at the beginning, or step followed by the step number you'd like to resume, or say stop to exit.").shouldEndSession(false);
    } else if (exit) {
      res.session('step', 1)
      res.say("Hey, If you want to review a step, just say step followed by the step number you'd like to hear. You can say continue to start over.").shouldEndSession(false);
    } else if (step == 7) { 
       res.session('step', 1);
       res.say("Okay, one last step, step " + step + ". " + steps[step] +  " Goodbye!").shouldEndSession(true);
    } else if (step == 8) {
      res.say(steps[step]).shouldEndSession(false);
      res.session('step', 1);
      } else if (morethanseven){
        if (persstep == 8) {
          persstep = 1;
    } else if (persstep == 0 || !(+req.session('step'))){
           persstep = 1; 
                    }
      res.session('step', persstep)
      res.say("Whoa there, there are only 7 steps to this skill. Please choose a step between 1 and 7, or say continue and I'll start from where I think we left off.").shouldEndSession(false);
    } else if (screwingwithme){
        res.say("Really? Negative numbers? You must be messing with me.  C'mon, let's try again, but this time, let's use positive integers between 1 and 7 when specifying steps. Or say continue. Darned jokers. It's a good thing I have an accommodating sense of humor!").shouldEndSession(false);
        res.session('step', persstep);
      } else if (needinteger){
        res.say("Really? Decimals? The steps aren't that long! I'm almost insulted! Do please give me a step number using integers this time, and only integers, or say continue to go on to the next appropriate step.").shouldEndSession(false);
        res.session('step', persstep);
    } else if (garbage){
       if (persstep > 0 && persstep < 8) {
        // persstep += 1;
         res.say("I'm sorry, I did not understand what you were trying to say there. Please choose a step number between 1 and 7, or say continue and I'll start from where I think we left off.").shouldEndSession(false);
         res.session('step', persstep);
         } else { 
         res.say("I'm sorry, I did not understand what you were trying to say there, Please try again. Choose a step number between 1 and 7, or say begin and I'll start from the beginning.").shouldEndSession(false);
         res.session('step', 1);
         }
      } else {
        res.say("Step " + step + ". " + steps[step] + " When you're ready for the next step, say continue, or say step and the step number you wish to jump to.").shouldEndSession(false);
        step += 1;
        res.session('step', step);
        }
  }
                //}
                );
  
alexaApp.intent('StepContinue', {
    "slots": {},
    "utterances": ["continue", "next step", "begin", "{stepno}", "step {stepno}", "go to {stepno}", "go to step {stepno}", "read step {stepno}", "begin with step {stepno}", "start at step {stepno}"]
  },
  function(req, res) {
  var slotstep = req.slot('stepno');
  var persstep = +req.session('step');
  console.log("persstep= " + persstep + ", slotstep = " + slotstep); 
  
//Intro block 3
 if (persstep > 0 && persstep < 8 ){
   var step = persstep;
   //for lower down the road //if step = 7 then res.say or end session. or set res.saybsection to...somethjng else  or set turuthiness to a varuable 
 } else if ( persstep == 8 || persstep > 8) {
   var exit = 1;
 } else if (persstep == 0) {
   var step = 8;
 }  else { var didntunderstanderror = 1 }       
  
  if (didntunderstanderror){
    res.session('step', 1)
    res.say("Oh my, this is embarrassing, but I've lost count of where we were stepwise. You can say begin to start at the beginning, or step followed by the step number you'd like to resume, or say stop to exit.").shouldEndSession(false);
    } else if (exit) {
      res.session('step', 1)
      res.say("Hey, If you want to review a step, just say step followed by the step number you'd like to hear.").shouldEndSession(false);
    } else if (step == 7) { 
       res.session('step', 1);
       res.say("Okay, one last step, step " + step + ". " + steps[step] +  " Goodbye and Good luck!").shouldEndSession(true);
    } else if (step == 8) {
      res.say(steps[step]).shouldEndSession(false);
      res.session('step', 1);
    } else {
        res.say("Step " + step + ". " + steps[step] + " When you're ready for the next step, say continue, or say step and the step number you wish to jump to.").shouldEndSession(false);
        step += 1;
        res.session('step', step);
        }
  }
                //}
                );
  
  

alexaApp.intent("AMAZON.HelpIntent", {
  "slots": {} },
  function(request, response) {
    
var HELP_MESSAGE = "Say continue to proceed to the next instructive step, or specify a step by sayibg saying step followed by a step number between 1 and 7.  Follow the instructions and further prompts or say stop to exit at any time. And remember, do NOT look directly at the sun!";
    response.say(HELP_MESSAGE).shouldEndSession(false);
  }
 );


 //   'AMAZON.HelpIntent': function () {
 //       var speechOutput = HELP_MESSAGE;
  //      var reprompt = HELP_REPROMPT;
  //      this.emit(':ask', speechOutput, reprompt);
  //  },
  //  'AMAZON.CancelIntent': function () {
    //    this.emit(':tell', STOP_MESSAGE);
 //   },
  //  'AMAZON.StopIntent': function () {
   //     this.emit(':tell', STOP_MESSAGE);
 //   }
// };


alexaApp.intent("AMAZON.StopIntent", {
  "slots": {} },
//"utterances": [ 
 //              "help", "help me"
  //              ]
//  },
  function(request, response) {
    response.say("Ok, Goodbye!").shouldEndSession(true);
  }
 );

alexaApp.intent("AMAZON.CancelIntent", {
  "slots": {} },
//"utterances": [ 
 //              "help", "help me"
  //              ]
//  },
  function(request, response) {
    response.say("Cancelling. Goodbye!").shouldEndSession(true);
  }
 );

app.listen(PORT, () => console.log("Listening on port " + PORT + "."));
