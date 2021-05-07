var chat_input;
var chat_button;
var theFont;
let img, img2;
var capture;
var question = ""
var reply = ""
let speechRec = new p5.SpeechRec('en-US', gotSpeech)


var selected_list = [];
var started = false;

function preload() {
  theFont = loadFont('SHPinscher-Regular.otf');
  imgBubble = loadImage('speechBubble.png')
}

function setup() {
  //createCanvas(1200, 800);
  mycanvas = createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO); 
	pixelDensity(1); 
	capture.size(640, 480); 
	capture.hide(); 
  //speechRec.start(true, false); //continues and interum

  // set up socket
  //socket = io.connect('http://localhost:3000');
  socket = io.connect('https://emoji-cam.herokuapp.com/');

  
  socket.on('guess', makeAGuess);

  slider = createSlider(7,30, 0, 1);
  slider.position(width/2-70, 600);
  
  button = createButton('Press and speak');
  button.position(100, 520);
  button.mousePressed(startSpeak);

  ss_button = createButton('Save Image');
  ss_button.position(width-300, 250);
  ss_button.mousePressed(saveImage);
}


function startSpeak(){
  speechRec.start(false, false);
}




function gotSpeech(){
  if (speechRec.resultValue){
    let input = speechRec.resultString
    //console.log(input);
    socket.emit('guess', input);
   
    reply = input;
    started = true;
  }
}

function makeAGuess(data){
  if(data == 'apple'){
    selected_list = ["👩‍💻", "📱","🎧","⌚️","🖱"];
    
  }else if(data == 'covid'){
    selected_list = ["👩🏽‍⚕️","👨‍⚕️","💉","🏥","🦠"];
  }
  else if (data == 'food'){
    selected_list = ["🥝","🍎","🍔","🍿","🍇"];
  }

  else if (data == 'music'){
    selected_list = ["👨🏻‍🎤","🎻","🎵","🥁","🎷"];
  }

  else if (data == 'sports'){
    selected_list = ["🏀","⚾️","⚽️","⛹️‍♂️","🎾"];
  }

  else if (data == 'animal'){
    selected_list = ["🐶","🙀","🦁","🐙","🐬"];
  }
 
}

function saveImage(){
	saveCanvas(mycanvas,"emojiMirror","png");
}

function draw() {
  background('#CAFAFE');
  imgBubble.resize(170, 0);
  image(imgBubble, 200, 300)
  push();
  textFont(theFont);
  textAlign(CENTER);
  textSize(70)
  text('Emoji Mirror', width/2, 60);
  textSize(20)
  textAlign(LEFT);
  text(reply, 125, 130,150)
  textSize(30)
  text("Tell me something about Apple, Covid, sports, music, animals, or food!", width-300, 130,260)

  pop();
  
  capture.loadPixels();
	capture.updatePixels(); // puts the modified pixel array back and xfers it to the GPU
	noSmooth();
	imageMode(CENTER);
  
  if (started == false){  
    image(capture, width/2, height/2);
  }
  
  else if (started == true){
    translate(width/4, height/4);
		let radius = slider.value();
		for (var y = 0; y < capture.height; y += radius) {
			for (var x = 0; x < capture.width; x += radius) {
				var  i = y * capture.width + (capture.width-x-1);	
				var darkness = (255 - capture.pixels[i * 4]) / 255;
				var x_= x * width / capture.width/2;
				var y_ = y * height / capture.height/2;
				if (darkness > 0.75) {
					text(selected_list[0], x_, y_);
				}else if (darkness > 0.6) {
					text(selected_list[1], x_, y_);
        }else if (darkness > 0.4) {
          text(selected_list[2], x_, y_);
         
        }else if (darkness > 0.2) {
          text(selected_list[3], x_, y_);
        }  
				else{
					text(selected_list[4], x_, y_);
					
				}
			}
		}
  }
  
   
}

