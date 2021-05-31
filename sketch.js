var runner, runnerImg;
var ground, groundImage;
var invisibleGround;
var corona, coronaImg;
var cloud, cloudImg;
var score = 0;
var virusGroup, cloudsGroup;
var  START = 0, PLAY = 1, END = 2;
var gameState = START;
var jumpSound, dieSound;
var coins = 0;


function preload(){
  
  groundImage = loadImage("ground2.png");
   runnerImg = loadImage("boy.png");
  coronaImg = loadImage("virus.png");
  cloudImg = loadImage("cloud.png");
  cityImg = loadImage("city.jpg");
  coinImg = loadImage("coin.png");
  startImg = loadImage("start.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
 
}

function setup() {
  createCanvas(displayWidth, displayHeight);
  
  runner = createSprite(10, height-47, 30, 100);
  runner.scale = 0.05;
  runner.addImage("run", runnerImg);
  
  
  invisibleGround = createSprite(displayWidth/2, displayHeight, displayWidth*10, 30);
  invisibleGround.visible = false;
  
 restart = createButton('RESTART');
 restart.position(displayWidth/2 + 600, 50);
 restart.mousePressed(reset);

  start = createSprite(width/2, height/2+80, 20, 20);
  start.addImage("play", startImg);
  start.scale = 0.2;
   
  virusGroup = new Group();
  cloudsGroup = new Group(); 
  coinGroup = new Group();
  
  runner.setCollider("rectangle", 0, 0, 40, 3000);
}

function draw(){

  background("skyblue");
  image(cityImg , -1000, displayHeight/2 - 480, displayWidth*5, displayHeight + 100 );
  

  if(gameState === START){

    textSize(30);
    fill("black");
    text("PLAY THE CORONA WARRIOR GAME!", width/2 - 250, height/2 - 100);
    text("BEWARE! SOMETIMES THE VIRUS FLIES!", width/2 - 300, height/2 - 50);
    text("OPEN THE CONSOLE TO CHECK THE MESSAGES!", width/2  - 400, height/2);
    text("CLICK ON PLAY TO START", width/2 - 200, height/2 + 250);

    if(mousePressedOver(start)){
      gameState = PLAY;
    }
    
  }
  
  if(gameState === PLAY){

    
  
    start.visible = false;

    camera.position.x = runner.x;
    runner.velocityX = 5;
   
  if(runner.x> 5800){
    gameState = END;
    virusGroup.destroyEach();
    console.log("GAME ENDED, YOU WON!");
  }

  runner.collide(invisibleGround);
  
  if(touches.length>0 || keyDown("space") && runner.y >= 600){
    runner.velocityY = -18;
    jumpSound.play();
    touches = [];
  }
  
  runner.velocityY = runner.velocityY + 0.8;
    
    score = score + Math.round(getFrameRate()/60);
  
  createVirus();
  spawnClouds();
  createCoins();
    
    if(virusGroup.isTouching(runner)){
      gameState = END;
      dieSound.play();
      console.log("GAME ENDED! TRY AGAIN!");
      
    }
    if(coinGroup.isTouching(runner)){
      coinGroup.destroyEach();
      coins = coins+1;
    }
  
  }
  
  else if(gameState === END){
    
    runner.velocityX = 0;
    runner.velocityY = 0;
    
     virusGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);
    
    virusGroup.setVelocityXEach(0);
    virusGroup.setVelocityYEach(0);
    cloudsGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);
    
    
    if(touches.length>0 || mousePressedOver(restart)){
      reset();
      touches = [];
    }
    
     }
  
  drawSprites();
  
  fill("red");
  textSize(25);
  text("Score: " + score, camera.position.x, 100);
  text("Coins: " + coins, camera.position.x +200, 100);
  
    }

function createVirus(){
  
  if(frameCount % 60 === 0){
  corona = createSprite(camera.position.x + 800, Math.round(random(height-100, height-101)), 20, 20);
    corona.shapeColor = "green";
    corona.velocityX = -(6 + score/100);
    corona.lifetime = width/5;
    corona.addImage("virus", coronaImg);
    corona.scale = 0.7;
    virusGroup.add(corona);
  }
  if(frameCount % 200 === 0){
    corona.velocityY = -5;
    
  }
  if(frameCount % 250 === 0){
    corona.velocityY = corona.velocityY + 1;
  }
}

function createCoins(){
  
  if (frameCount % 110 === 0){
    coin = createSprite( camera.position.x + 800, displayHeight - 150 , 40, 20);
    coin.velocityX = -(6 + score/100);
    coin.lifetime = width/5;
    coin.addImage("coin", coinImg);
    coin.scale = 0.11;
    coinGroup.add(coin);
    
  }
}

function spawnClouds(){
  
  if (frameCount % 100 === 0){
    cloud = createSprite( camera.position.x + 800,Math.round(random(height/6, height/2)), 40, 20);
    cloud.velocityX = -4;
    cloud.lifetime = width/5;
    cloud.addImage("cloud", cloudImg);
    cloud.scale = 0.2;
    cloudsGroup.add(cloud);
    
    cloud.depth = runner.depth;
    runner.depth = runner.depth +1;
    
  }
}


function reset(){

  runner.x = 10;
  runner.y = height - 47;
  
  runner.velocityX = 5;
  
  gameState = PLAY;
  
  virusGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  score = 0;
  coins = 0;
}


