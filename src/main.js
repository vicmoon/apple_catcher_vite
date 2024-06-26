
import Phaser from 'phaser';

const canvas = {
  width: 500, 
  height: 500
}

const speedDown= 300;

const gameStart = document.querySelector("#gameStart");
const startButton = document.querySelector("#startBtn");
const gameEnd = document.querySelector("#gameEnd"); 
const finalScore = document.querySelector("#endScore"); 


class GameScene extends Phaser.Scene{
  constructor(){
    super("scene-game");
    this.player;
    this.playerSpeed = speedDown+50;
    this.target;
    this.points =0;
    this.textScore; 
    this.textTime;
    this.timedEvent;
    this.remainingTime;
    this.coinSound;
    this.backMusic;
    this.emitter;

  }

  preload(){
    this.load.image("bg", "./assets/bg.png");
    this.load.image("basket", "./assets/basket.png");
    this.load.image("apple", "./assets/apple.png");
    this.load.audio("coin", "./assets/coin.mp3");
    this.load.audio("bgMusic", "./assets/bgMusic.mp3");
    this.load.image("star", "./assets/star.jpg");
  }
  create(){

    this.scene.pause("scene-game"); 

    this.coinSound = this.sound.add("coin");
    this.backMusic = this.sound.add("bgMusic");
    this.backMusic.play();
    this.backMusic.stop();

    this.add.image(0,0,"bg").setOrigin(0,0);  // x, y and the name we gave to it
    this.player = this.physics.add.image(0, canvas.height-100, "basket").setOrigin(0,0);
    this.player.setImmovable(true)
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);
    this.player.setSize(this.player.width - this.player.width/4, this.player.height/6).setOffset(this.player.width/10, this.player.height/10);

    this.target = this.physics.add.image(0,0, "apple").setOrigin(0,0);
    this.target.setMaxVelocity(0, speedDown);

    this.physics.add.overlap(this.target, this.player, this.targetHit, null, this);

    this.cursor = this.input.keyboard.createCursorKeys();

    this.textScore = this.add.text(canvas.width - 120, 20, "Score:0", {
      font:" 18px Arial",
      fill: "#000000"
  });

  this.textTime = this.add.text(canvas.width - 400, 20, "Time left:", {
    font:" 18px Arial",
    fill: "#000000"
  });

  this.timedEvent = this.time.delayedCall(30000, this.gameOver,[],this );

  this.emitter = this.add.particles(0, 0,"star", {
    speed: 100, 
    scale:0.01,
    gravityY: speedDown-200,
    duration: 100, 
    emitting: false

  }); 

  this.emitter.startFollow(this.player,this.player.width/2, this.player.height/2, true);


}


  update(){
    this.remainingTime = this.timedEvent.getRemainingSeconds(); 
    console.log(this.remainingTime);
    this.textTime.setText(`Time left: ${Math.round(this.remainingTime).toString()} `);
    
    if(this.target.y >= canvas.height){
      this.target.setY(1);
      this.target.setX(this.getRandomX());

    }

    const {left, right} = this.cursor;

    if(left.isDown){
      this.player.setVelocityX(-this.playerSpeed);
    }else if(right.isDown){
      this.player.setVelocityX(this.playerSpeed);
    }else{
      this.player.setVelocityX(0);  // set a random position 
    }
  }

  getRandomX(){
    return Math.floor(Math.random() * 480);  
  }
  

  targetHit(){

    this.coinSound.play();
    this.emitter.start();
    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.points++; 
    this.textScore.setText(`Score: ${this.points}`);
  }

  gameOver(){
    this.sys.game.destroy(true);

    if(this.points >= 20){
      finalScore.innerHTML = this.points;
      finalScore.innerHTML = "You won 🏆" 
    }else{
      finalScore.innerHTML = this.points; 
      finalScore.innerHTML = "You lost!😭"
    }
     gameEnd.style.display = "flex";
  

  }

}

const config = {
  type: Phaser.WEBGL,
  width: canvas.width,
  height: canvas.height, 
  canvas: gameCanvas, 
  physics: {
    default:"arcade",
    arcade: {
      gravity: {y:speedDown},
      debug: false
    }
  },
  scene: [GameScene]  
}




startButton.addEventListener("click", () => {
  console.log("Clicked");
  gameStart.style.display = "none"; 
  game.scene.resume("scene-game"); 

})


const game = new Phaser.Game(config);
export default game;
