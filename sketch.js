var PLAY = 1;
var END = 0;
var gameState = PLAY;

var background1, background1_image, ground, groundImage;
var ninja,
  ninja_running,
  ninja_jumping,
  ninja_collided,
  robot,
  robot_running,
  robot_jumping;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var jumpSound, dieSound, gameSound;
var score;
var gameOver, restart, gameOverImage, restartImage;

function preload() {
  background1_image = loadImage("background.png");
  ninja_running = loadAnimation(
    "ninja run00.png",
    "ninja run01.png",
    "ninja run02.png",
    "ninja run03.png",
    "ninja run04.png",
    "ninja run05.png",
    "ninja run06.png",
    "ninja run07.png",
    "ninja run08.png",
    "ninja run09.png"
  );

  ninja_jumping = loadAnimation(
    "ninja jump00.png",
    "ninja jump01.png",
    "ninja jump02.png",
    "ninja jump03.png",
    "ninja jump04.png",
    "ninja jump05.png",
    "ninja jump06.png",
    "ninja jump07.png",
    "ninja jump08.png",
    "ninja jump09.png"
  );

  robot_running = loadAnimation(
    "run00.png",
    "run01.png",
    "run02.png",
    "run03.png",
    "run04.png",
    "run05.png",
    "run06.png",
    "run07.png"
  );

  robot_jumping = loadAnimation(
    "jump00.png",
    "jump01.png",
    "jump02.png",
    "jump03.png",
    "jump04.png",
    "jump05.png",
    "jump06.png",
    "jump07.png",
    "jump08.png",
    "jump09.png"
  );

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("over.mp3");
  gameSound = loadSound("game sound.mp3");
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  ninja_collided = loadImage("ninja run00.png");
  robot_idle = loadImage("run00.png");
  groundImage = loadImage("platform.png");
}

function setup() {
  createCanvas(600, 500);

  background1 = createSprite(350, 250);
  background1.addImage("background1_image", background1_image);
  background1.scale = 1.5;
  background1.velocityX = -1;

  ninja = createSprite(300, 420, 600, 10);
  ninja.addAnimation("ninja_running", ninja_running);
  ninja.addAnimation("ninja_jumping", ninja_jumping);
  ninja.addImage("ninja_collided", ninja_collided);
  ninja.scale = 1;
  ninja.debug = false;
  ninja.setCollider("rectangle", 0, 0, ninja.width, ninja.height);

  robot = createSprite(50, 410, 600, 10);
  robot.addAnimation("robot_running", robot_running);
  robot.addAnimation("robot_jumping", robot_jumping);
  robot.addImage("robot_idle", robot_idle);
  robot.scale = 1.5;
  robot.debug = false;

  ground = createSprite(500, 625, 600, 10);
  ground.velocityX = -6;
  ground.addImage(groundImage);

  gameOver = createSprite(300, 200);
  gameOver.addImage(gameOverImage);

  restart = createSprite(300, 280);
  restart.addImage(restartImage);

  obstaclesGroup = new Group();

  score = 0;
}

function draw() {
  camera.x = ninja.x;
  camera.y = ninja.y;

  gameOver.position.x = restart.position.x = camera.x;
  background("black");

  ninja.velocityY = ninja.velocityY + 0.8;
  ninja.collide(ground);

  //Gravity
  robot.velocityY = robot.velocityY + 0.8;
  robot.collide(ground);

  if (gameState === PLAY) {
    gameOver.visible = false;
    restart.visible = false;
    score = score + Math.round(getFrameRate() / 60);

    spawnObstacles();
    if (obstaclesGroup.isTouching(robot)) {
      robot.changeAnimation("robot_jumping", robot_jumping);
      robot.velocityY = -12;
    }
    background1.velocityX = -(4 + (3 * score) / 100);

    if (background1.x < 0) {
      background1.x = background1.width / 2;
    }

    if (ground.x < 200) {
      ground.x = 500;
    }

    if (keyDown("space") && ninja.y >= 400) {
      ninja.changeAnimation("ninja_jumping", ninja_jumping);
      ninja.velocityY = -12;
      jumpSound.play();
    }

    if (ninja.isTouching(obstaclesGroup)) {
      gameState = END;
      dieSound.play();
    }
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    background1.velocityX = 0;
    ground.velocityX = 0;
    ninja.velocityY = 0;
    ninja.changeImage("ninja_collided", ninja_collided);
    robot.changeAnimation("robot_idle", robot_idle);
    robot.x = ninja.x;
    if (robot.isTouching(ninja)) {
      ninja.changeImage("ninja_collided", ninja_collided);
      robot.changeImage("robot_idle", robot_idle);
    }

    obstaclesGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);

    if (mousePressedOver(restart)) {
      reset();
    }
  }

  drawSprites();
  fill("lightpink");
  textSize(20);
  text("Score: " + score, 500, 300);
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  ninja.changeAnimation("ninja_running", ninja_running);
  obstaclesGroup.destroyEach();
  score = 0;
  robot.x = 50;
}

function spawnObstacles() {
  if (frameCount % 100 === 0) {
    var obstacle = createSprite(600, 450, 10, 40);
    obstacle.velocityX = -6;

    var rand = Math.round(random(1, 4));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      default:
        break;
    }

    obstacle.scale = 0.1;
    obstaclesGroup.add(obstacle);

    obstacle.setCollider("circle", 0, 0, 1);
  }
}
