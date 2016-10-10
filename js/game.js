(function () {
    var game = new Phaser.Game(800, 600,Phaser.AUTO, 'game', {preload: preload, create: create, update: update });
    function preload() {

        game.load.image('sky', 'img/sky.png');
        game.load.image('ground', 'img/platform.png');
        game.load.image('star', 'img/star.png');
        game.load.image('startBtn', 'img/start.png');
        game.load.image('restartBtn', 'img/restart.png');
        game.load.spritesheet('dude', 'img/dude.png', 32, 48);

    }

    var platforms, player, cursors, stars, scoreText, timeText, second = 60, score = 0, startBtn, playing = false;
    var restartBtn, recordText, record = 0, time;

    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.add.sprite(0,0, 'sky');

        platforms = game.add.group();
        platforms.enableBody = true;

        var ground = platforms.create(0, game.world.height -64, 'ground');
        ground.scale.setTo(2, 2);
        ground.body.immovable = true;

        var ledge = platforms.create(400, 400, 'ground');
        ledge.body.immovable = true;
        ledge = platforms.create(-150, 250, 'ground');
        ledge.body.immovable = true;

        player = game.add.sprite(32, game.world.height - 150, 'dude');
        game.physics.arcade.enable(player);
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 1000;
        player.body.collideWorldBounds = true;
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);
        player.frame = 4;


        stars = game.add.group();
        stars.enableBody = true;

        startBtn = game.add.button(game.world.width*0.5, game.world.height*0.5, 'startBtn', startGame, this, 1, 0, 2);
        startBtn.anchor.set(0.5);
        restartBtn = game.add.button(game.world.width*0.5, game.world.height*0.5, 'restartBtn', restartGame, this, 2, 1, 0);
        restartBtn.anchor.set(0.5);
        restartBtn.visible = false;

        scoreText = game.add.text(16, game.world.height - 50 , 'Звезды: 0', { fontSize: '32px', fill: '#eee' });
        recordText = game.add.text(240, game.world.height - 50 , 'Рекорд: 0', { fontSize: '32px', fill: '#eee' });
        timeText = game.add.text(630, game.world.height - 50 , 'Время: 60', { fontSize: '32px', fill: '#eee' });

    }

    function update() {
        var hitPlatform = game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(stars, platforms);
        game.physics.arcade.overlap(player, stars, collectStar, null, this);
        if(playing) {
            cursors = game.input.keyboard.createCursorKeys();
            player.body.velocity.x = 0;
            if (cursors.left.isDown) {
                player.body.velocity.x = -450;
                player.animations.play('left');

            }else if (cursors.right.isDown){
                player.body.velocity.x = 450;
                player.animations.play('right');
            }else{
                player.animations.stop();
                player.frame = 4;
            }
            if (cursors.up.isDown && player.body.touching.down && hitPlatform)
            {
                player.body.velocity.y = -600;
            }

        }

    }

    function collectStar (player, star) {
        star.kill();
        score +=1;
        scoreText.text = 'Звезды: ' + score;

        createStar();

    }

    function createStar() {
        var star = stars.create(randomInteger(10, 750), randomInteger(-750, -10), 'star');
        star.body.gravity.y = randomInteger(50, 200);
        star.body.bounce.y = 0.2 + Math.random()*0.2;
    }

    function randomInteger(min, max) {
        var rand = min - 0.5 + Math.random() * (max - min + 1);
        rand = Math.round(rand);
        return rand;
    }
    function timer() {
        if (second > 1) {
            second--;
            timeText.text = 'Время: ' + second;
        }else{
            gameOver();
            timeText.text = 'Время: 0';
        }
    }

    function startGame() {
        startBtn.destroy();
        playing = true;
        time = game.time.events.loop(Phaser.Timer.SECOND, timer, this);
        for (var i = 0; i < 20; i++) {
            createStar()
        }
    }

    function gameOver() {
        game.time.events.remove(time);
        playing = false;
        player.animations.stop();
        player.frame = 4;
        stars.removeAll();
        player.visible = false;
        restartBtn.visible = true;
        if (score > record) {
            record = score;
            recordText.text = 'Рекорд: ' + record;
        }
    }

    function restartGame() {
        scoreText.text = 'Звезды: 0';
        timeText.text = 'Время: 60';
        second = 60;
        score = 0;
        restartBtn.visible = false;
        startGame();
        player.visible = true;
        player.reset(32, game.world.height - 150);
    }
})();
