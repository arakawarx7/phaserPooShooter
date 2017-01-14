var game = new Phaser.Game(800,600,Phaser.CANVAS, 'gameDiv');

var cursors;
var backgroundCloudSpeed;
var player;

var enemyBullets;
var enemyBulletTime = 0;
var enemyAutoFire;

var bullets;
var bulletTime = 0;
var fireButton;

var enemies;

var score = 0;
var scoreText;
var winText;
var gameOverText;

var mobileView;
var buttonRight;
var buttonLeft;
var buttonShoot;


var playerKeys;


var mainstate = {
	preload:function(){

	game.load.image('backgroundCloud', "assets/backgroundCloud.jpg");
	game.load.image('player', "assets/player.png");
	game.load.image('bullet', "assets/bullet.png");
	game.load.image('enemy', "assets/enemy.png");
	game.load.image('buttonRight', "assets/arrowRight.png");
	game.load.image('buttonLeft', "assets/arrowLeft.png");
	game.load.image('buttonShoot', "assets/buttonShoot.png");
	game.load.image('enemybullet', "assets/dollar.png");
	game.load.image('mobileView', "assets/mobile.png");



	},

	create:function(){
		cloud = game.add.tileSprite(0,0,800,600,'backgroundCloud');
		backgroundCloudSpeed = 3;

		player = game.add.sprite(game.world.centerX,game.world.centerY + 150 , 'player');
		player.enableBody = true;
		player.physicsBodyType = Phaser.Physics.ARCADE;
				

		game.physics.enable(player,Phaser.Physics.ARCADE);

		cursors = game.input.keyboard.createCursorKeys();

		bullets = game.add.group();
		bullets.enableBody = true;
		bullets.physicsBodyType = Phaser.Physics.ARCADE;
		bullets.createMultiple(30, 'bullet');
		bullets.setAll('anchor.x', -0.5);
		bullets.setAll('anchor.y',0.5);
		bullets.setAll('outOfBoundsKill', true);
		bullets.setAll('checkWorldBounds', true);

		enemyBullets = game.add.group();
		enemyBullets.enableBody = true;
		enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
		enemyBullets.createMultiple(1, 'enemybullet');
		enemyBullets.setAll('anchor.x', -3.5);
		enemyBullets.setAll('anchor.y',0.5);
		enemyBullets.setAll('outOfBoundsKill', true);
		enemyBullets.setAll('checkWorldBounds', true);


		fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		enemies = game.add.group();
		enemies.enableBody = true;
		enemies.physicsBodyType = Phaser.Physics.ARCADE;


		mobileView = game.add.button(game.world.centerX +305, 10, 'mobileView');
		buttonRight = game.add.button(game.world.centerX -300, 400, 'buttonRight');
		buttonRight.visible = false;
		buttonLeft = game.add.button(game.world.centerX -395, 400, 'buttonLeft');
		buttonLeft.visible = false;
		buttonShoot = game.add.button(game.world.centerX +305, 400, 'buttonShoot');
		buttonShoot.visible = false;

		createEnemies();
		playerKeys = game.add.text(0,560, 'USE Left & right arrows to move and SPACEBAR to Shoot' ,{font: '30px Arial', fill:'#fff'});

		scoreText = game.add.text(0,0,'score:',{font:'40px Arial', fill:'#fff'});
		winText = game.add.text(game.world.centerX,game.world.centerY, 'you Win' ,{font: '32px Arial', fill:'#fff'});
		winText.visible = false;

		gameOverText = game.add.text(game.world.centerX,game.world.centerY, 'you LOSE!!!' ,{font: '50px Arial', fill:'#fff'});
		gameOverText.visible = false;

		game.time.events.loop(Phaser.Timer.SECOND * 1, descend, this);
		// game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);

	},

	update:function(){
		// code below is for any object that collides with each other (param1,param2,functionName,null,this)
		game.physics.arcade.overlap(bullets,enemies,collisionHandler,null,this);
		game.physics.arcade.overlap(enemies,player,collisionPlayer,null,this);
		game.physics.arcade.overlap(enemyBullets,player,collisionEnemyBullet,null,this);
		playerKeys.visible = true ;
		// playerKeys.text ='Left & right arrows to move and SPACEBAR to Shoot';
		player.body.velocity.x = 0;
		 // player.body.gravity.y =900;

		cloud.tilePosition.y += backgroundCloudSpeed;

		enemyFireBullet();

		if(cursors.up.isDown){
			 player.body.velocity.y = -350;
		}

		if(cursors.left.isDown){
			player.body.velocity.x = -350;
		}
		

		if(cursors.right.isDown){
			player.body.velocity.x = 350;
		}

		if(fireButton.isDown){
			fireBullet();
		}

		if(mobileView.input.pointerOver()){
			buttonRight.visible = true;
			buttonLeft.visible = true;
			buttonShoot.visible = true;
			playerKeys.visible = false;
		}

		if(buttonRight.input.pointerOver()){
			player.body.velocity.x = 350;
			console.log("right");
		}

		if(buttonLeft.input.pointerOver()){
			player.body.velocity.x = -350;
			console.log("left");
		}

		if(buttonShoot.input.pointerOver()){
			fireBullet();
		}

	scoreText.text = 'score:' + score;
	if(score == 2800){
		winText.visible = true;
		scoreText.visible = false;
	}

	},




}


function enemyFireBullet(){
	if(game.time.now > enemyBulletTime){
		enemyBullet = enemyBullets.getFirstExists(false);

		if(enemyBullet){
			enemyBullet.reset(enemies.x +14,enemies.y);
			enemyBullet.body.velocity.y = 400;
			enemyBulletTime = game.time.now + 200;
		}
	}
}

function fireBullet(){
	if(game.time.now > bulletTime){
		bullet = bullets.getFirstExists(false);

		if(bullet){
			bullet.reset(player.x +14,player.y);
			bullet.body.velocity.y = -400;
			bulletTime = game.time.now + 200;
		}
	}
}

function createEnemies(){
	for(var y = 0; y < 4; y++){
		for(var x = 0; x < 7; x++){
			var enemy = enemies.create(x*100,y*70, 'enemy');
			enemy.anchor.setTo(0.5,0.5);
		}
	}

	enemies.x = 30;
	enemies.y = 50;

	var tween = game.add.tween(enemies).to({x:200},1000,Phaser.Easing.Linear.None,true,50,1000,true);

	tween.onLoop.add(descend,this);
	// descend();
}

function descend(){
	enemies.y += 10;
}

function collisionHandler(bullet,enemy){
	bullet.kill();
	enemy.kill();
	score += 100;
}

function collisionPlayer(player,enemy){
	// enemy.kill();
    player.kill();
	var playerKilled = true;
	if(playerKilled == true){
		gameOverText.visible = true;
	}
}

function collisionEnemyBullet(enemybullet,player){
	enemybullet.kill();
	var playerKilled = true;
	if(playerKilled == true){
		gameOverText.visible = true;
	}
}

function actionOnClick () { 
	console.log("actionOnClick")
}


game.state.add('mainState',mainstate);

game.state.start('mainState')