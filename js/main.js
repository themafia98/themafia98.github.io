function DataBase(){
    // * firebase

    this.MAX_WRITE = 0;
    this.currentIP = null;
}

DataBase.prototype.updateLimit = function (){
    // * Limit on updata data
    let _that = this;
    this.timer = setTimeout(function limit(){

        _that.MAX_WRITE = 0;
        this.timer = setTimeout(limit, 60000);
    }, 60000);
}

DataBase.prototype.updateUserData = function (ip, id, name, points, loader){
    // * Update data

    if (this.MAX_WRITE > 3) throw new Error('limit');

    this.MAX_WRITE++;
    this.currentIP = (ip) ? ip : 'no ip detected';

    cloudDB.use.collection('users').doc(`user_${(name+id).replace(/\s/g,'').toLowerCase()}`)
        .set({
            name: name,
            points: points,
            id: id.slice(1, id.length),
            ip: this.currentIP,
            realPlayer: true
        })

        .catch(function (error){

            console.log(error.message);
        });
}

function Request(){
    // * API
    this.key = () => 'json';

}

Request.prototype.getIP = function (load){
    // * Check users IP

    fetch(`https://api.ipify.org?format=${this.key()}`)

        .then((response) => response.json())
        .then((response) =>{

            (response.ip) ? localStorage.IP = response.ip: localStorage.IP = 'no detected';
        })

        .catch(function (error){

            console.log(error.message);
        });
}

Request.prototype.getSpriteData = function (load){

    fetch(`js/data.json`)

    .then((response) => response.json())
    .then((response) => load.jsonData = response)

    .catch(function (error){

        console.log(error.message);
    });
}

function WebAudio(){

    this.effects = [];
    this.ctx = null;  // создание контекста звука
    this.gainNode = null;
    this.loaded = false;
}

WebAudio.prototype.init = function(){

    this.ctx = new AudioContext();
    this.gainNode = this.ctx.createGain ? this.ctx.createGain() : this.ctx.createGainNode();
    this.gainNode.connect(this.ctx.destination);  // подключение к динамикам
}

WebAudio.prototype.load = function(path,name){

    let effect = {};
    let _that = this;

    fetch(path)
    .then((response) => response.arrayBuffer())
    .then ((response) => {
        
        this.ctx.decodeAudioData(response)
        .then ((buffer) => {
            effect.name = name;
                effect.path = path;
                effect.buffer = buffer;
                effect.loaded = true;
                _that.effects.push(effect);
            })

        .then (()=>{
            
            effect.play = function(loop,volume) {
            
            let sound = _that.ctx.createBufferSource(); // Создается источник звука
            sound.buffer = this.buffer; // настраивается буфер
            sound.connect(_that.gainNode);  // подключение источника к "колонкам"
            sound.loop = loop;
            _that.gainNode.gain.value = volume;
            sound.start(0); // start
            effect.sound = sound;
            }

        });
    });
}


function UI(){
    this.linki = []; // save links
    this.coordsMouseX = null;
    this.coordsMouseY = null;
}

function Links(url, name, coordsX, coordsY, lengthX, lengthY){

    this.url = url;
    this.Name = name;
    this.pos = [coordsX, coordsY];
    this.length = [lengthX, lengthY];
    this.color = 'red';
    this.selectColor = 'rgb(255,140,0)';
    this.selectName = false;
}

UI.prototype.checkFrame = function (frame){ // check selected links

    if ((this.coordsMouseX > frame.pos[0]) &&
        (this.coordsMouseX < frame.pos[0] + frame.length[0]) &&
        (this.coordsMouseY > frame.pos[1]) &&
        (this.coordsMouseY < frame.pos[1] + frame.length[1])){

        return true;
    }
    return false;
};

function Game(){
    // states
    this.menu = 'menu';
    this.death = 'wait';
    this.rating = 'rating';
    this.play = 'play';
    this.startPlay = 'play-animation';
    this.pauseGame = 'pause';

    this.fade = 1;
    this.loadingPercent = 0;

    this.setRequstCount = function (i){

        return this.about.requstCount = i;
    };

    this.about ={
        state: 'loading',
        count: 0, // game count for win state
        stageBossCount: 0,
        stageExtraBossCount: 0,
        stageNumber: 0,
        lastTimeBull: 0, // time bullets
        requstCount: 0,
    };

}


// ----------------switch states---------------

Game.prototype.startGame = function (){

    return this.about.state = this.play;
};

Game.prototype.startGameAnimation = function (load, gamer, activeLink,sound){

    activeLink.selectName = false;
    this.music(sound); // music
    this.updateGameStatus(gamer, load); // game state
    gamer.setHealth(200); // update health

    return this.about.state = this.startPlay;
};

Game.prototype.stopGame = function (){

    return this.about.state = this.death;
};

Game.prototype.ratingGame = function (activeLink){

    activeLink.selectName = false;
    return this.about.state = this.rating;
};

Game.prototype.mainMenu = function (activeLink){

    activeLink.selectName = false;
    return this.about.state = this.menu;
};

Game.prototype.pause = function (activeLink,escape){
    
    if ((escape) || ((activeLink) &&
        (activeLink.selectName))){

        activeLink.selectName = false;
        this.about.state = this.pauseGame;
        return true;

    } else return false;
};

Game.prototype.spawnAndLvling = function (game, load, enemy, stageNumber,sound){

    let CreateEnemy = enemy.createEnemy; // short
    game.about.stageNumber = stageNumber; // get stageNumber

    let bossExtraSound = sound.effects.find(item => item.name === 'bossExtra');
    let bathSound = sound.effects.find(item => item.name === 'deathBat');
    let bossSound = sound.effects.find(item => item.name === 'deathBoss');

    if ((game.about.stageNumber) &&
        (game.about.stageNumber === game.about.stageNumber)){

        if (game.about.stageNumber < 7){

            for (let i = 0; i < game.about.stageNumber; i++){

                CreateEnemy(
                    load,
                    load.jsonData.essenceSettings.birds.health,
                    load.jsonData.essenceSettings.birds.dmg,
                    load.jsonData.essenceSettings.birds.name + i,
                    load.jsonData.essenceSettings.birds.type,
                    load.jsonData.essenceSettings.birds.x,
                    load.jsonData.essenceSettings.birds.y,
                    load.jsonData.essenceSettings.birds.sizeX,
                    load.jsonData.essenceSettings.birds.sizeY,
                    load.jsonData.essenceSettings.birds.frameCount,
                    load.jsonData.essenceSettings.birds.frameArray,
                    load.jsonData.enemyStartPosition.x,load.jsonData.enemyStartPosition.y,
                    bathSound);
            }

        } else if (game.about.stageNumber >= 10){

            for (let j = 0; j < game.about.stageExtraBossCount; j++){

                CreateEnemy(
                    load,
                    load.jsonData.essenceSettings.bossExtra.health,
                    load.jsonData.essenceSettings.bossExtra.dmg,
                    load.jsonData.essenceSettings.bossExtra.name + j,
                    load.jsonData.essenceSettings.bossExtra.type,
                    load.jsonData.essenceSettings.bossExtra.x,
                    load.jsonData.essenceSettings.bossExtra.y,
                    load.jsonData.essenceSettings.bossExtra.sizeX,
                    load.jsonData.essenceSettings.bossExtra.sizeY,
                    load.jsonData.essenceSettings.bossExtra.frameCount,
                    load.jsonData.essenceSettings.bossExtra.frameArray,
                    load.jsonData.enemyStartPosition.x,load.jsonData.enemyStartPosition.y,
                    bossExtraSound);

            }
        }

        if ((game.about.stageNumber >= 7) && (game.about.stageNumber <= 15)){

            for (let i = 0; i < 5; i++){

                CreateEnemy(
                    load,
                    load.jsonData.essenceSettings.birds.health,
                    load.jsonData.essenceSettings.birds.dmg,
                    load.jsonData.essenceSettings.birds.name + i,
                    load.jsonData.essenceSettings.birds.type,
                    load.jsonData.essenceSettings.birds.x,
                    load.jsonData.essenceSettings.birds.y,
                    load.jsonData.essenceSettings.birds.sizeX,
                    load.jsonData.essenceSettings.birds.sizeY,
                    load.jsonData.essenceSettings.birds.frameCount,
                    load.jsonData.essenceSettings.birds.frameArray,
                    load.jsonData.enemyStartPosition.x,load.jsonData.enemyStartPosition.y,
                    bathSound);

            }

            for (let j = 0; j < game.about.stageBossCount; j++){

                CreateEnemy(
                    load,
                    load.jsonData.essenceSettings.boss.health,
                    load.jsonData.essenceSettings.boss.dmg,
                    load.jsonData.essenceSettings.boss.name + j,
                    load.jsonData.essenceSettings.boss.type,
                    load.jsonData.essenceSettings.boss.x,
                    load.jsonData.essenceSettings.boss.y,
                    load.jsonData.essenceSettings.boss.sizeX,
                    load.jsonData.essenceSettings.boss.sizeY,
                    load.jsonData.essenceSettings.boss.frameCount,
                    load.jsonData.essenceSettings.boss.frameArray,
                    load.jsonData.enemyStartPosition.x,load.jsonData.enemyStartPosition.y,
                    bossSound);

            }
        } else if (game.about.stageNumber > 15){

            for (let i = 0; i < game.about.stageNumber - 5; i++){

                CreateEnemy(
                    load,
                    load.jsonData.essenceSettings.bossExtra.health,
                    load.jsonData.essenceSettings.bossExtra.dmg,
                    load.jsonData.essenceSettings.bossExtra.name + j,
                    load.jsonData.essenceSettings.bossExtra.type,
                    load.jsonData.essenceSettings.bossExtra.x,
                    load.jsonData.essenceSettings.bossExtra.y,
                    load.jsonData.essenceSettings.bossExtra.sizeX,
                    load.jsonData.essenceSettings.bossExtra.sizeY,
                    load.jsonData.essenceSettings.bossExtra.frameCount,
                    load.jsonData.essenceSettings.bossExtra.frameArray,
                    load.jsonData.enemyStartPosition.x,load.jsonData.enemyStartPosition.y,
                    bossExtraSound);

            }
        }
    }
};

Game.prototype.updateGameStatus = function (gamer, load){ // new game

    this.about.stageNumber = -1;
    this.about.stageExtraBossCount = 1;
    this.about.stageBossCount = -1;
    this.about.count = -1;
    this.fade = 2;
    this.loadingPercent = 0;

    // update game statistic
    gamer.countThrow = 0;
    gamer.killCount = 0;
    gamer.stat.points = 0;
    gamer.SoundCount = 0;

    // update items and enemys on state
    load.enemy = [];
    gamer.bullets = [];
    load.bullets = [];
    load.coins = [];
    load.eat = [];

    // sprite player start position
    gamer.stat.sprite.size[0] = 34;
    gamer.stat.sprite.pos[0] = 700;

    // gamers position update
    gamer.move.pos[0] = gamer.move.startPos[0];
    gamer.move.pos[1] = gamer.move.startPos[1];

};

Game.prototype.music = function (sound){

    let delayForLoading = setTimeout( () => {
        sound.effects.find(item => item.name === 'main').play(true,1);
    },2500);
};


function Loader(){ // for storage and loading files and datas

    this.loadCount = 1; // load counter

    this.jsonData = [];

    // sprite storage for game filds
    this.TextureStorage = [];
    this.SpriteStorage = [];
    this.SoundsStorage = [];

    // storage enemy and bullets
    this.enemy = [];
    this.bullets = [];

    // items storage
    this.coins = [];
    this.eat = [];
    this.upgrade = [];

    // records storage
    this.startRecord = [];
};

// ---loading method---
Loader.prototype.textureCache = function (src){

    return this.TextureStorage.push(src);
};
Loader.prototype.SpriteCache = function (src){

    return this.SpriteStorage.push(src);
};
Loader.prototype.SoundCache = function (src){

    return this.SoundsStorage.push(src);
};

Loader.prototype.loading = function (fileType, src, imageType){

    if ((fileType === 'Image') && (imageType === 'texture')){

        const file = new Image();
        file.src = src;
        this.textureCache(file);
    } else if ((fileType === 'Image') && (imageType === 'sprite')){

        const file = new Image();
        file.src = src;
        this.SpriteCache(file);
    }

    if (fileType === 'Audio'){

        const file = new Audio(); // main game music 1
        file.src = src;
        this.SoundCache(file);
    }

};



function Player(type, location){

    let _that = this;

    _that.gameTime = 0; // time in game
    _that.countThrow = 0;
    _that.killCount = 0;
    _that.SoundCount = 0;
    _that.bullets = []; // player bullets

    _that.stat ={
        name: 'player', // type
        gamerName: null, // || defult generated random name
        health: 200,
        points: 0,
        damage: 25,
        whatDrop: false,
        upgradeRate: false,
        sprite: new Sprite('player', type.SpriteStorage[0],
            [703, 0], [31, 34], 2, [0, 1]),
        bullets: new Bullets(),
    };
    _that.move ={
        speeds: 200,
        pos: [location.settings.width / 2, location.settings.height / 2],
        startPos: [385, -120], // position for start animation
        animationPos: [location.settings.width / 2, location.settings.height / 2],
    };

    _that.setHealth = function (count){

        return this.stat.health = count;
    };
}


Player.prototype.GameOver = function (gamer, game, load,sound){

    if (gamer.stat.health <= 0){
        
        load.enemy = []; // cleaer enemy

        if (!(gamer.SoundCount) && (game.about.stageNumber < 20)){
            
            sound.effects.find(item => item.name === 'gameOver').play(false,0.5);
            gamer.SoundCount++;
        }
        game.stopGame();
    }
};

Player.prototype.Win = function (gamer, game, load){

    if (!(gamer.stat.health < 0)){

        if (!(load.enemy.length) && !(game.about.count)){

            game.about.stageNumber++;
            game.about.count++;
        }
    }
};



function Bullets(){

    this.lastFire = 0;
    this.i = 50;
    this.weapons ={
        speed: 320,
        active: false,
    };
};

Bullets.prototype.useSkill = function (load, gamer, ui,sound){

    // * Bull
    if (Date.now() - this.lastFire > 300){ // delay

        gamer.countThrow++; // counter

        load.bullets.push({
            pos:{
                x: gamer.move.pos[0],
                y: gamer.move.pos[1]
            },
            direction: new Vector(ui.coorddX, ui.coorddY).normalize(),
            degree: 0,
            sprite: this.createBullets(load), // bullets sprite
            siz: [15, 32], // sprite size
        });
        sound.effects.find(item => item.name === 'shot').play(false,0.8);

        this.lastFire = Date.now();


        return this.weapons.active = true;
    }
};

Bullets.prototype.createBullets = function (type){

    // bull for player
    return new Sprite('bull', type.SpriteStorage[0],
        [192.5, 31], [32, 36], 0);
};

Bullets.prototype.createBulletsCustom = function (type, spriteCoordX, spriteCoordY){

    // bull for enemys
    return new Sprite('bull2', type.SpriteStorage[0],
        [spriteCoordX, spriteCoordY], [22, 34], 0);
};

function Enemy(){


    this.enemySpeedX = 1 * getRandomPull(); // start random position X
    this.enemySpeedY = 1 * getRandomPull(); // start random position X
    this.DeathTimer = null;

    this.stat ={
        name: '',
        type: '',
        collision: false,
        getDmg: false,
        health: null,
        damage: null,
        sprite: null, // for sprite
        sizes: [32, 20], // sprite size
        onDeath: false,
    };

    this.bull ={
        bullStorage: [], // enemys bulls 
        speed: null,
        speedY: null,
        pos: [0, 0],
        on: false, // active || not active
        lastBull: null, // delay
    }

    this.move ={
        speeds: 10, // bullets enemys speed
        pos: [0, 0], // bullets position
        randomMove: getRandomPull(), // random flight
    };
}

Enemy.prototype.createEnemy = function (load, hp, damage, name, type,
                                        spriteX, spriteY, spriteW, spriteH,
                                        frameCount, frameGo, posX, posY, music){

    let spriteEnemy = new Enemy(load, this, hp, damage, name,
                                type, spriteX, spriteY,
                                spriteW, spriteH,
                                frameCount, frameGo,
                                music);

    // * Set settings enemy
    spriteEnemy.stat.name = name;
    spriteEnemy.stat.type = type;
    spriteEnemy.stat.health = hp;
    spriteEnemy.stat.damage = damage;
    spriteEnemy.move.pos[0] = posX * getRandom();
    spriteEnemy.move.pos[1] = posY * getRandom();
    spriteEnemy.sound = music;

    // ----Start moving position-----
    if ((spriteEnemy.stat.type === 'boss' ||
        spriteEnemy.stat.type === 'bossExtra') &&
        (spriteEnemy.enemySpeedY < 0)){

        spriteX = 452;
    }

    if ((spriteEnemy.stat.type === 'boss' ||
        spriteEnemy.stat.type === 'bossExtra') &&
        (spriteEnemy.enemySpeedY > 0)){

        spriteX = 964;
    }

    // * Set sprite
    spriteEnemy.stat.sprite = new Sprite('enemy', load.SpriteStorage[0],
        [spriteX, spriteY], [spriteW, spriteH],
        frameCount, frameGo);

    // * Add in enemy array
    load.enemy.push(spriteEnemy);
};

function Sprite(name, url, pos, size, speed, frames, dir, once){

    this.Saveframes = null;
    this.name = name;
    this.pos = pos;
    this.size = size; // size one frame
    this.speed = speed; // animation speed
    this.frames = frames; //  array animation frame from start to end
    this.index = 0;
    this.url = url; // путь к изображению
    this.once = once; // once:true if need one cycle animation
    this.x = null;
    this.y = null;
};

Sprite.prototype.update = function (time){

    this.index += this.speed * time;
};

Sprite.prototype.render = function (){

    let frame;

    if (this.speed > 0){

        let max = this.frames.length;
        let idx;

        if (this.index){

            idx = Math.floor(this.index);
        }

        frame = this.frames[idx % max];

        if (this.once && idx >= max){

            this.once = true;
            return;
        }

    } else frame = 0;

    this.x = this.pos[0];
    this.y = this.pos[1];
    this.Saveframes = frame;

    return this.x += frame * this.size[0];
};

function Items(){

    let _that = this; // save ctx

    this.name = null;
    this.sprite = null;
    this.pos = [];
    this.lucky = (percent) =>{
        return Math.random() < percent
    }

    this.settingsItems ={

        get name(){ // get items name
            return _that.name;
        },
        set name(valueName){ // set items name
            return _that.name = valueName;
        },

        get sprite(){ // get item sprite
            return _that.sprite;
        },
    }
}

Items.prototype.setSprite = function (load, cordSpriteX, cordsSpriteY,
    sizeSpriteX, sizeSpriteY){

    return this.sprite = new Sprite(this.name, load.SpriteStorage[0],
        [cordSpriteX, cordsSpriteY], [sizeSpriteX, sizeSpriteY]);
}


function update(time, gamer, load, game, link,sound){

    gamer.gameTime += time; // game time

    // ---start game---
    (((game.about.state === 'play-animation') && (game.fade <= 0))) &&
    animationMoving(gamer, game, time);

    /* check win and gameOver */
    if ((game.about.state === 'play') ||
        (game.about.state === 'wait')){
        gamer.GameOver(gamer, game, load,sound);
        gamer.Win(gamer, game, load);

    }

    // * If game state play
    if ((!(game.pause(link[5]))) && (game.about.state !== 'pause') &&
        ((game.about.state !== 'menu') && (game.about.state !== 'rating'))){
        updateCreeps(time, gamer, load, game,sound); // check enemys and update player/enemy sprite
        updateBulls(time, gamer, load); // check bullets
        checkShot(load, gamer); // check shot
        checkItem(load, gamer,sound); // drop items
        damageCheck(load, gamer,sound); // get damage check

    }

}

function damageCheck(load, gamer,sound){

    let resetSprite; // timer for splice items

    load.enemy.forEach((itemEnemy, i, arrayEnemy) =>{ // check all enemys

        if (itemEnemy.stat.health <= 0){

            if ((itemEnemy.stat.onDeath === false)){

                itemEnemy.stat.onDeath = true;
                gamer.stat.whatDrop = Math.random() < 0.5;
                gamer.stat.upgradeRate = Math.random() < 0.05;

                deathEnemyUpdate(itemEnemy);

                (itemEnemy.stat.type === 'common') && (itemEnemy.stat.sprite.pos[0] = 960);
                (itemEnemy.stat.type === 'common') &&  (itemEnemy.stat.sprite.pos[1] = 102);

                (itemEnemy.stat.type === 'boss') && (itemEnemy.stat.sprite.pos[0] = 1540);
                (itemEnemy.stat.type === 'boss') && (itemEnemy.stat.sprite.pos[1] = 232);
                (itemEnemy.stat.type === 'boss') && (itemEnemy.stat.sprite.frames = [0, 1, 2]);

                (itemEnemy.stat.type === 'bossExtra') && (itemEnemy.stat.sprite.pos[0] = 1542);
                (itemEnemy.stat.type === 'bossExtra') && (itemEnemy.stat.sprite.pos[1] = 298);
                (itemEnemy.stat.type === 'bossExtra') && (itemEnemy.stat.sprite.frames = [0, 1, 2]);

                if (gamer.stat.whatDrop){ // drops

                    coins = new Items();
                    coins.settingsItems.name = 'coin';

                    if (coins.lucky(0.7)){ // drop coins

                        coins.setSprite(load, 69, 30, 26, 37);
                        // coins position
                        coins.pos[0] = itemEnemy.move.pos[0];
                        coins.pos[1] = itemEnemy.move.pos[1];

                        load.coins.push(coins);

                    } else delete coins;

                } else{

                    eat = new Items();
                    eat.settingsItems.name = 'eat';

                    if (eat.lucky(0.5)){ // drop eats

                        eat.setSprite(load, 95, 30, 39, 40);
                        // eat position
                        eat.pos[0] = itemEnemy.move.pos[0];
                        eat.pos[1] = itemEnemy.move.pos[1];

                        load.eat.push(eat);

                    } else delete eat;

                }

                if (gamer.stat.upgradeRate){

                    upgrade = new Items();
                    upgrade.settingsItems.name = 'scroll';

                    upgrade.setSprite(load, 128, 192, 42, 44);

                    upgrade.pos[0] = itemEnemy.move.pos[0] + 5;
                    upgrade.pos[1] = itemEnemy.move.pos[1] + 5;

                    load.upgrade.push(upgrade);
                }

                // -----------collision-----------

                gamer.killCount++;
                itemEnemy.sound.play(false,1);
            }

            if (itemEnemy.stat.sprite.index >= itemEnemy.stat.sprite.frames.length){
                itemEnemy.DeathTimer = null;
                arrayEnemy.splice(i, 1);
                gamer.stat.points += 25;

            }
        }

        checkPlayerDmg(itemEnemy, gamer, load,sound);

    });
}

function checkPlayerDmg(itemEnemy, gamer, load,sound){

    // * Get player dmg or no
    if ((itemEnemy) && (boxCollides([itemEnemy.move.pos[0], itemEnemy.move.pos[1]],
            [30, 30], [gamer.move.pos[0], gamer.move.pos[1]], [32, 32]))){

        if (gamer.stat.health > -1){

            gamer.stat.sprite.pos[0] = 956; // damage player sprite
            sound.effects.find(item => item.name === 'damage').play(false,0.8);
            gamer.stat.health--; // get damage
            gamer.move.pos[0, 1]++; // repulsion

            resetSprite = setTimeout(() =>{ gamer.stat.sprite.pos[0] = 700; },0);
        } else gamer.stat.health = 0;
    }
}

function deathEnemyUpdate(itemEnemy){

    // * Death enemy
    itemEnemy.stat.sprite.once = true;
    itemEnemy.stat.sprite.speed = 10;
    itemEnemy.stat.sprite.index = 0;
    itemEnemy.stat.sprite.Saveframes = 0;

    itemEnemy.enemySpeedX = 0;
    itemEnemy.enemySpeedY = 0;

    itemEnemy.bull.on = false;
    itemEnemy.bull.bullStorage = [];
}

function updateCreeps(time, gamer, load, game,sound){

    gamer.stat.sprite.update(time); // update player sprite

    if (Date.now() - game.about.lastTimeBull > 10){ // delay

        load.enemy.forEach((item) =>{

            let bulPosX = item.bull.pos[0]; // get bullets pos x
            let bulPosY = item.bull.pos[1]; // get bullets pos y

            let gamerPosX = gamer.move.pos[0]; // get player pos x
            let gamerPosY = gamer.move.pos[1]; // get player pos y

            item.stat.sprite.update(time);

            if ((item.bull.bullStorage.length) &&
                ((item.bull.pos[0] <= 40) || (item.bull.pos[0] > 755) ||
                (item.bull.pos[1] < 60) || (item.bull.pos[1] > 440))){

                // delete bullets
                item.bull.bullStorage.splice(0, 1);
                item.bull.pos[0] = item.move.pos[0];
                item.bull.pos[1] = item.move.pos[1];
                return;
            }
            // -------Create bullets sprite-------
            if (!(item.bull.bullStorage.length)){
                let bullEnemy;

                (item.stat.type === `boss`) &&
                    (bullEnemy = new Sprite('bull2', load.SpriteStorage[0],
                                            [192, 2], [30, 30], 0)
                    );

                (item.stat.type === `bossExtra`) &&
                    (bullEnemy = new Sprite('bull2', load.SpriteStorage[0],
                                            [354, 2], [30, 30], 0)
                    );

                (item.stat.type === `common`) &&
                    (bullEnemy = new Sprite('bull2', load.SpriteStorage[0],
                        [324, 0], [30, 30], 0)
                    );

                item.bull.bullStorage.push(bullEnemy); // bullets storage
                item.bull.speed = 150; // set bullets speed x
                item.bull.speedY = 150; // set bullets speed y
                item.bull.speed *= getRandomPull(); // set random dir move bullets
            }

            item.bull.pos[0] += item.bull.speed * time; // move x
            item.bull.pos[1] += item.bull.speedY * time; // move y
            item.bull.on = 'true'; // shot on

            // ------collision enemy bullets with player------
            if ((boxCollides([bulPosX, bulPosY], [30, 30],
                    [gamerPosX, gamerPosY], [32, 32]))){

                sound.effects.find(item => item.name === 'damage').play(false,0.8);
                gamer.stat.sprite.pos[0] = 956;
                gamer.stat.health--;
                gamer.move.pos[0, 1]++;

                // set start sprite frame
                resetSprite = setTimeout(() =>{
                    gamer.stat.sprite.pos[0] = 700;

                }, 200);
            }

            // ------pushing and set sprite frames away from the walls------

            // ---change dir moving---

            dirMovingEnemy(item);

            item.move.pos[0] += item.enemySpeedX; // moving enemy x
            item.move.pos[1] += item.enemySpeedY; // moving enemy y
        });

        game.about.lastTimeBull = Date.now(); // delay
    }
}

function dirMovingEnemy(item){

    if ((item) && (item.move.pos[0] > 700)){

        item.enemySpeedX *= -1;

        // ---set sprite frames---
        (item.stat.type === 'boss' || item.stat.type === 'bossExtra') &&
                                        (item.stat.sprite.pos[0] = 1226);

    }

    // ---change dir moving---
    if ((item) && (item.move.pos[0] < 70)){

        item.enemySpeedX *= -1;

        // ---set sprite frames---
        (item.stat.type === 'boss' || item.stat.type === 'bossExtra') &&
                                        (item.stat.sprite.pos[0] = 712);
    }

    // ---change dir moving---
    if ((item) && (item.move.pos[1] < 70)){

        item.enemySpeedY *= -1; // change dir moving

        // ---set sprite frames---
        ((item.stat.type === 'boss') || (item.stat.type === 'bossExtra')) &&
                                        (item.stat.sprite.pos[0] = 964);
    }

    // ---change dir moving---
    if ((item) && (item.move.pos[1] > 400)){

        item.enemySpeedY *= -1; // change dir moving

        // ---set sprite frames---
        ((item.stat.type === 'boss') || (item.stat.type === 'bossExtra')) &&
                                            (item.stat.sprite.pos[0] = 452);
    }
}

function updateBulls(time, gamer, load){


    load.bullets.forEach((item, i, array) =>{

        let bull = item; // short write

        // ------ bullets gamer move dir ------

        calcBullet(item, gamer, time);

        if (bull.pos.y < 50 || bull.pos.y > 440 ||
            bull.pos.x > 727 || bull.pos.x < 35){

            // if bullets left valid dir
            array.splice(i, 1);
            i--;
        }
    });
}

function calcBullet(bullet, gamer, time){

    // преобразуем координаты в объект класса Vector
    const pos = new Vector(bullet.pos.x, bullet.pos.y);

    // рассчитываем вектор приращения в направлении движения пули для ее скорости
    const vector = bullet.direction.multiply(gamer.stat.bullets.weapons.speed * time);

    // добавляем к координатам пули значение вектора с приращениями
    bullet.pos = pos.add(vector);
}

function getName(buttonName, gamer){

    // get gamer name from localStorage and set
    localStorage.name = buttonName;
    return gamer.stat.gamerName = buttonName;
}


function collides(x, y, r, b, x2, y2, r2, b2){

    // check collisions
    return !(r <= x2 || x > r2 ||
            b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2){

    // check collisions
    return collides(
        pos[0], pos[1],
        pos[0] + size[0],
        pos[1] + size[1],
        pos2[0], pos2[1],
        pos2[0] + size2[0],
        pos2[1] + size2[1]
    );
}

function checkShot(load, gamer){ // get plater damage or no

    //---auxiliary variables---
    let posBull = [];
    let enemyPos = [];

    load.bullets.forEach((itemBull, i) =>{

        posBull[0] = itemBull.pos.x;
        posBull[1] = itemBull.pos.y;

        load.enemy.forEach((itemEnemy) =>{

            enemyPos[0] = itemEnemy.move.pos[0];
            enemyPos[1] = itemEnemy.move.pos[1];

            if (boxCollides(enemyPos, [35, 35], posBull, [35, 35]) &&
                (itemEnemy.stat.health > 0)){

                itemEnemy.stat.health -= gamer.stat.damage;
                load.bullets.splice(i, 1);
            }
        });
    });
}

function checkItem(load, gamer,sound){ // player came on items or no

    //---auxiliary variables---
    let posItem = [];
    let posGamer = [];
    let timerDelete = null; // timer for delte unactive items


    load.coins.forEach((item, i, array) =>{

        posItem[0] = item.pos[0]; // coins position x
        posItem[1] = item.pos[1]; // coins position y

        posGamer[0] = gamer.move.pos[0]; // gamer position x
        posGamer[1] = gamer.move.pos[1]; // gamer position y

        if (boxCollides(posGamer, [26, 26], posItem, [26, 26])){

            sound.effects.find(item => item.name === 'money').play(false,0.8);
            gamer.stat.points += 10;
            array.splice(i, 1);
        }
    });

    load.eat.forEach((item, i, array) =>{

        posItem[0] = item.pos[0]; // eat position x
        posItem[1] = item.pos[1]; // eat position y

        posGamer[0] = gamer.move.pos[0]; // gamer position x
        posGamer[1] = gamer.move.pos[1]; // gamer position y

        if (boxCollides(posGamer, [26, 26], posItem, [26, 26])){

            if ((gamer.stat.health < 200) &&
                ((gamer.stat.health + (gamer.stat.health * 0.20) < 200))){

                sound.effects.find(item => item.name === 'eat').play(false,0.8);
                gamer.stat.health += Math.floor(200 * 0.16);
                array.splice(i, 1);

            } else timerDelete = setTimeout(() =>{
                array.splice(i, 1);
            }, 2000);
        }
    });

    load.upgrade.forEach((item, i, array) =>{

        posItem[0] = item.pos[0]; // eat position x
        posItem[1] = item.pos[1]; // eat position y

        posGamer[0] = gamer.move.pos[0]; // gamer position x
        posGamer[1] = gamer.move.pos[1]; // gamer position y

        if (boxCollides(posGamer, [30, 30], posItem, [30, 30])){

            sound.effects.find(item => item.name === 'lvlUP').play(false,0.8);
            gamer.stat.damage += 5;
            array.splice(i, 1);

        }
    });
}


function calculate(gamer){

    // -----calculate player position-----

        (gamer.move.pos[0] <= 35) && (gamer.move.pos[0] = 35);

        (gamer.move.pos[0] >= 727) && (gamer.move.pos[0] = 727);

        (gamer.move.pos[1] <= 55) && (gamer.move.pos[1] = 55);

        (gamer.move.pos[1] >= 440) && (gamer.move.pos[1] = 440);

}

function animationMoving(gamer, game, time){

    // -----start game animation-----
    if (gamer.move.animationPos[1] >= gamer.move.pos[1]){

        gamer.move.pos[1] += gamer.move.speeds * time;

    } else game.about.state = 'play'; // set state
}

function getRandom(){

    // -----get random enemy position-----
    let arr = [0.3, 0.6, 0.8, 0.9, 1.2];
    let rand = Math.floor(Math.random() * arr.length);
    return arr[rand];
}

function getRandomPull(){

    // -----get random bullets dir-----
    let arr = [-1.2, -1, 1, 1.2];
    let rand = Math.floor(Math.random() * arr.length);
    return arr[rand];
}

function compare(a, b){

    // bubble sort records list
    if (a.points < b.points){

        return -1;
    }
    if (a.points > b.points){

        return 1;
    }
    return 0;
}
function Draw() {
    let _that = this;

    this.blink = 1;
    this.scaleValue = 1;
    this.frameBlink = true;
    this.view = 'xl';
    this.viewMode = 'full';
    this.viewDesktop = 'none';

    _that.settings = {
        width: _that.width(), // canvas w
        height: _that.height(), // canvas h
        textureW: _that.width(), // texture weight
        textureH: _that.height(), // texture weight
        openGate: 0, // end gate possition
        countModal: 0, // counter modal window in game
        drawInX: 0, // position X to draw in main ctx
        drawInY: 0, // position Y to draw in main ctx
        mouse: 0
    };

    _that.bullets = {
        //---for player---
        spriteListBulletsPosition: [106, 0],
        spritePlayerSizeW: 14,
        spritePlayerSizeH: 32,
    };

    _that.items = {
        spriteItemSize: [15, 15]
    };

    _that.pause = {
        RectPause: [this.settings.width / 6, 40],
        RectPauseSize: [this.settings.width / 1.5, this.settings.height / 1.4],
        TextStageName: [this.settings.width / 2.1, 100],
        Notification: [this.settings.width / 2 - 5, 135],
        Menu: [this.settings.width / 2.1, 450],
        pauseLink: [350,420],
        sizeLinkPause: [100, 30]
    }

    _that.menu = {
        background: null,
        TitleGame: [this.settings.width / 2, 100],
        play: [this.settings.width / 2, this.settings.height / 2.5],
        rating: [this.settings.width / 2, this.settings.height / 1.8],
        myName: [40, this.settings.height - 20],
        version: [this.settings.width - 40, this.settings.height - 20],
        sizeLinkPlay: [200,80],
        coordsLinkRating: [ (this.settings.width / 2) - 120, (this.settings.height / 1.8) - 40],
        sizeLinkRating: [250, 80]
    }

    _that.rating = {
        TitleGame: [this.settings.width / 2, 50],
        return: [this.settings.width / 2, 165],
        StrokeRectCoords: [this.settings.width / 9.4, 200],
        StrokeRectSize: [this.settings.width / 1.3, this.settings.height / 1.8],
        RectCoords: [this.settings.width / 9.4, 200],
        RectSize: [this.settings.width / 1.3, this.settings.height / 1.8],
        TitleName: [this.settings.width / 8, 235],
        TitlePoints: [this.settings.width / 1.45, 235],
        ratingListX: [this.settings.width / 8, this.settings.height - 50],
        ratingListPointsX: [this.settings.width / 8, this.settings.height - 50],
        returnLinkCoords: [(this.settings.width / 2) - 60, 110],
        returnLinkSize: [ 110, 70]
    }

    _that.gameOver = {
        TitleCoords: [this.settings.width / 2, 100],
        win: [this.settings.width / 2, 100],
        Points: [this.settings.width / 2, 150],
        Throw: [this.settings.width / 2, 200],
        killCount: [this.settings.width / 2, 250],
        menu: [this.settings.width / 2.02, 450],
        menuLinkCoords: [350,430],
        menuLinkSize: [110, 30]
    }

    _that.playGame = {
        spriteTextureBorder: [5, 610],
        spriteTexture: [5, 5],
        gamePanelCoords: [0, 542],
        gamePanelSize: [this.settings.width, 80],
        hpTextPosition: [this.settings.width / 3, 588],
        hpBarSize: [375, 588],
        hpBarBoorderCoords: [this.settings.width / 2.7, 570],
        hpBarBoorderSize: [204, 25],
        PointsCoords: [-12, 20],
        PointsSize: [45, 45],
        PointsGetCoords: [0, 560],
        PointsGetSize: [35, 35],
        PointsTextCoords: [40, 592],
        ModalTextWASD: [this.settings.width / 2, 35],
        ModalPress: [this.settings.width / 2, 65],
        Audio: [this.settings.width, 460],
        pauseButton: [this.settings.width - 40, this.settings.height - 48],
        pauseLinkSize: [50, 50]
    }

    _that.loading = {
        loadingText: [this.settings.width / 4.7, this.settings.height / 2],
    }



    _that.drawBuffer = {
        canvasBuffer: null,
        ctxBuffer: null
    }; // buffer canvas
    _that.getCanvas = {
        canvas: document.getElementById('arena'),
    }; // get canvas in app
    _that.getCtx = {
        ctx: _that.getCanvas.canvas.getContext('2d'),
    }; // get ctx in app
}

Draw.prototype.render = function () {
    // -----All render-----

    this.getCtx.ctx.drawImage(this.drawBuffer.canvasBuffer,
                              this.settings.drawInX, this.settings.drawInY,
                              this.settings.width, this.settings.height);

    this.drawBuffer.ctxBuffer.restore();
};

Draw.prototype.renderEnemys = function (gamer) {

    if (gamer.stat.name !== 'player') {

        gamer.stat.sprite.x = gamer.stat.sprite.render(); // render sprite update

        // HP enemys
        this.drawBuffer.ctxBuffer.fillStyle = 'red';
        this.drawBuffer.ctxBuffer.font = 'bold 12px Aria';
        this.drawBuffer.ctxBuffer.fillText(gamer.stat.health + 'HP',
                                           gamer.move.pos[0] - 5,
                                           gamer.move.pos[1] - 5);

        // ---render enemys---
        this.drawBuffer.ctxBuffer.drawImage(gamer.stat.sprite.url,
                                            gamer.stat.sprite.x,
                                            gamer.stat.sprite.pos[1],
                                            gamer.stat.sprite.size[0],
                                            gamer.stat.sprite.size[1],
                                            gamer.move.pos[0], gamer.move.pos[1],
                                            gamer.stat.sprite.size[1],
                                            gamer.stat.sprite.size[1]);

    }
}

Draw.prototype.renderItems = function (load) {


    load.coins.forEach((item) => {

        if (item.lucky) {
            item.sprite.x = item.sprite.render(); // render sprite coins
            // render coins
            this.drawBuffer.ctxBuffer.drawImage(item.settingsItems.sprite.url,
                                                item.sprite.x, item.sprite.pos[1],
                                                item.sprite.size[0], item.sprite.size[1],
                                                item.pos[0], item.pos[1],
                                                this.items.spriteItemSize[0],
                                                this.items.spriteItemSize[1]);
        }
    });

    load.eat.forEach((item) => {

        if (item.lucky) {

            item.sprite.x = item.sprite.render(); // render sprite eat
            this.drawBuffer.ctxBuffer.drawImage(item.settingsItems.sprite.url,
                                                item.sprite.x, item.sprite.pos[1],
                                                item.sprite.size[0], item.sprite.size[1],
                                                item.pos[0], item.pos[1],
                                                this.items.spriteItemSize[0],
                                                this.items.spriteItemSize[1]);
        }
    });

    load.upgrade.forEach((item) => {

        if (item.lucky) {

            item.sprite.x = item.sprite.render(); // render sprite eat

            this.drawBuffer.ctxBuffer.drawImage(item.settingsItems.sprite.url,
                                                item.sprite.x, item.sprite.pos[1],
                                                item.sprite.size[0], item.sprite.size[1],
                                                item.pos[0], item.pos[1],
                                                this.items.spriteItemSize[0],
                                                this.items.spriteItemSize[1]);
        }
    });
}

Draw.prototype.renderPlayer = function (gamer, game) {

    if (game.fade <= 0) {

        gamer.stat.sprite.x = gamer.stat.sprite.render(); // update sprite player

        this.drawBuffer.ctxBuffer.drawImage(gamer.stat.sprite.url,
                                            gamer.stat.sprite.x,
                                            gamer.stat.sprite.pos[1],
                                            gamer.stat.sprite.size[0],
                                            gamer.stat.sprite.size[1],
                                            gamer.move.pos[0], gamer.move.pos[1],
                                            gamer.stat.sprite.size[1],
                                            gamer.stat.sprite.size[1]);
    }
}

Draw.prototype.fadeIn = function (game, load) {

    this.drawBuffer.ctxBuffer.restore();
    this.drawBuffer.ctxBuffer.save();

    let cof = (this.settings.width / 2) / game.loadingPercent;
    let perc = 100 / cof;

    this.drawBuffer.ctxBuffer.globalAlpha = game.fade;

    this.drawBuffer.ctxBuffer.drawImage(load.SpriteStorage[1],
                                        this.settings.drawInX,
                                        this.settings.drawInX,
                                        this.settings.width,
                                        this.settings.height);

    this.drawBuffer.ctxBuffer.strokeStyle = 'gold';
    this.drawBuffer.ctxBuffer.lineWidth = 2;
    this.drawBuffer.ctxBuffer.strokeRect(this.settings.width / 4, this.settings.height / 2.5,
                                         this.settings.width / 2,
                                         this.settings.height / 6);

    this.drawBuffer.ctxBuffer.fillStyle = 'brown';
    this.drawBuffer.ctxBuffer.fillRect(this.settings.width / 4, this.settings.height / 2.5,
                                       game.loadingPercent, this.settings.height / 6);

    this.drawBuffer.ctxBuffer.font = '30px PIXI';
    this.drawBuffer.ctxBuffer.textAlign = 'center';
    this.drawBuffer.ctxBuffer.fillStyle = 'white';

    this.drawBuffer.ctxBuffer.fillText(`Rendering... ${perc.toFixed(1)} %`,
                                        this.settings.width / 2,
                                        this.settings.height / 2);

    (game.loadingPercent < this.settings.width / 2) && (game.loadingPercent += 2.5);
    (game.loadingPercent >= this.settings.width / 2) && (game.fade -= 0.05);

    this.drawBuffer.ctxBuffer.restore();
}

Draw.prototype.renderEnemyBulls = function (bull) {

    let bulls = bull.bull; // short write
    if (!(bull.bull.on) || !(bulls.bullStorage.length)) return;

    this.drawBuffer.ctxBuffer.restore(); // restove ctx

    this.drawBuffer.ctxBuffer.drawImage(bull.bull.bullStorage[0].url,
                                        bull.bull.bullStorage[0].pos[0],
                                        bull.bull.bullStorage[0].pos[1],
                                        bull.bull.bullStorage[0].size[0],
                                        bull.bull.bullStorage[0].size[1],
                                        bulls.pos[0], bulls.pos[1],
                                        this.items.spriteItemSize[0],
                                        this.items.spriteItemSize[1]);

    this.render(); // render bullets
    this.drawBuffer.ctxBuffer.restore(); // restove ctx
}

Draw.prototype.renderBulls = function (bull, load, gamer) {
    // translate and rotate for renders bullets in corect dir

    if (!(load.bullets.length)) return;

    this.drawBuffer.ctxBuffer.setTransform(1, 0, 0, 1, 0, 0);
    this.drawBuffer.ctxBuffer.save();

    this.drawBuffer.ctxBuffer.translate(bull.pos.x, bull.pos.y);
    this.drawBuffer.ctxBuffer.rotate((bull.degree * 2) * (Math.PI / 180));

    this.drawBuffer.ctxBuffer.drawImage(bull.sprite.url,
        bull.sprite.pos[0],
        bull.sprite.pos[1],
        bull.sprite.size[0], bull.sprite.size[1],
        this.settings.drawInX, this.settings.drawInY,
        25, 27);
    bull.degree++;

    this.drawBuffer.ctxBuffer.restore();
}

Draw.prototype.renders = function (gamer, load, game, UserInterface,sound) {

    // ---render gameOver---
    ((game.about.state === 'play') && (gamer.stat.health <= 0)) &&
                                (gamer.GameOver(gamer, game, load,sound));

    (game.about.state === 'play' || game.about.state === 'play-animation') &&
                                        this.renderMouse(load, UserInterface);

    // ---render pause menu---
    ((game.about.state === 'wait') && (this.gameOverView(gamer, UserInterface, game)));
    // --render rating---
    ((game.about.state === 'rating') && (this.drawRatingList(load, gamer, UserInterface, gamer)));

    // ---if game state play--
    if ((game.about.state === 'play')) {
        load.enemy.forEach((item) => { // render all enemys and items

            this.renderEnemys(item);
            this.renderItems(load);

        });

        this.renderPlayer(gamer, game);

        load.bullets.forEach((item) => { // render player bullets

            this.renderBulls(item, load, gamer);

        });

        load.enemy.forEach((item) => { // render enemys bullets

            this.renderEnemyBulls(item);

        });
    }

    if (game.about.state === 'play-animation') { // render start animation state

        (game.fade > 0) && (this.fadeIn(game, load));
        (game.fade <= 0) && (this.renderPlayer(gamer, game));

    }

    this.pauseMenuView(game, gamer, UserInterface, load); // render pause menu

    ((game.about.state === 'menu') && (UserInterface)) && (this.DrawMenu(load, game, UserInterface));

    if ((((game.about.state === 'pause')) && (UserInterface))) {

        (UserInterface.linki[0].selectName) && (game.about.state = 'menu');
        (UserInterface.linki[0].selectName) && (this.DrawMenu(load, game, UserInterface));
    }

    this.render(); // all render in main canvas
}

Draw.prototype.pauseMenuView = function (game, gamer, UserInterface, load) {

    if (game.about.state === 'pause') {

        let CTX = this.drawBuffer.ctxBuffer; // short write

        CTX.restore();
        CTX.save();
        CTX.fillStyle = 'black';
        CTX.globalAlpha = 0.9;

        this.drawBuffer.ctxBuffer.drawImage(load.SpriteStorage[1],
            this.pause.RectPause[0], this.pause.RectPause[1],
            this.pause.RectPauseSize[0], this.pause.RectPauseSize[1]);

        CTX.strokeStyle = 'gold';
        CTX.globalAlpha = 0.9;

        CTX.strokeRect(this.pause.RectPause[0] + 10, this.pause.RectPause[1] + 10,
                       this.pause.RectPauseSize[0] - 20, this.pause.RectPauseSize[1] - 20);

        CTX.fillStyle = 'yellow';
        CTX.textAlign = 'center';
        CTX.shadowColor = 'rgb(50,50,50)';
        CTX.shadowOffsetX = 2;
        CTX.shadowOffsetY = 3;
        CTX.font = '50px PIXI';
        CTX.fillText('PAUSE', this.pause.TextStageName[0], this.pause.TextStageName[1]);

        CTX.fillStyle = 'gold';
        CTX.shadowColor = 'rgb(50,80,50)';
        CTX.textAlign = 'center';
        CTX.shadowOffsetX = 2;
        CTX.shadowOffsetY = 3;
        CTX.font = '25px PIXI';
        CTX.fillText('If you leave the game, all saves will be lost.', this.pause.Notification[0],
                     this.pause.Notification[1]);

        CTX.restore();
        CTX.save();

        CTX.fillStyle = 'yellow';
        CTX.shadowColor = 'brown';
        CTX.textAlign = 'center';
        CTX.font = '35px PIXI';

        CTX.fillText('Throws: ' + gamer.countThrow, this.gameOver.Throw[0] - 20,
                     this.gameOver.Throw[1]);
        CTX.fillText('Kills: ' + gamer.killCount, this.gameOver.killCount[0] - 20,
                     this.gameOver.killCount[1] + 10);

        if (UserInterface.checkFrame(UserInterface.linki[0])) { // menu link

            CTX.fillStyle = UserInterface.linki[0].selectColor;
        } else {

            CTX.fillStyle = UserInterface.linki[0].color;
        }

        CTX.shadowOffsetX = 2;
        CTX.shadowOffsetY = 3;
        CTX.textAlign = 'center';
        CTX.font = '40px PIXI';
        CTX.fillText('MENU', this.pause.Menu[0], this.pause.Menu[1]);
        this.render(); // all render
    } else {

        this.drawBuffer.ctxBuffer.clearRect(0, 0, this.settings.width, this.settings.health);
    }
}

Draw.prototype.DrawMenu = function (load, game, UserInterface, gamer) {

    let CTX = this.drawBuffer.ctxBuffer; // short write

    this.menu.background = CTX.createPattern(load.SpriteStorage[3], 'repeat');
    CTX.fillRect(this.settings.drawInX, this.settings.drawInY,
                 this.settings.width, this.settings.height);

    CTX.fillStyle = this.menu.background;

    CTX.fillRect(this.settings.drawInX, this.settings.drawInY,
                 this.settings.width, this.settings.height);

    CTX.fillStyle = 'rgb(255,215,0)';
    CTX.shadowColor = 'brown';
    CTX.shadowBlur = 3;
    CTX.textAlign = "center";
    CTX.textBaseline = "middle";
    CTX.shadowOffsetX = 6;
    CTX.shadowOffsetY = 7;
    CTX.font = 'bold 100px PIXI';

    CTX.globalAlpha = this.blink;

    (this.blink <= 0.5) && (this.frameBlink = false);
    (this.blink >= 1) && (this.frameBlink = true);

    ((this.frameBlink) && (this.blink > 0.5)) && (this.blink -= 0.01);
    ((!(this.frameBlink)) && (this.blink != 1)) && (this.blink += 0.01);

    CTX.fillText('ARENA', this.menu.TitleGame[0], this.menu.TitleGame[1]);
    // --reset shadow--
    CTX.shadowOffsetX = 0;
    CTX.shadowOffsetY = 0;
    CTX.globalAlpha = 1;


    CTX.shadowColor = 'black';
    CTX.font = '100px PIXI';

    (UserInterface.checkFrame(UserInterface.linki[1])) &&
    (CTX.fillStyle = UserInterface.linki[1].selectColor);

    !(UserInterface.checkFrame(UserInterface.linki[1])) &&
    (CTX.fillStyle = UserInterface.linki[1].color);

    CTX.fillText('PLAY', this.menu.play[0], this.menu.play[1]);

    (UserInterface.checkFrame(UserInterface.linki[2])) &&
    (CTX.fillStyle = UserInterface.linki[2].selectColor);

    !(UserInterface.checkFrame(UserInterface.linki[2])) &&
    (CTX.fillStyle = UserInterface.linki[2].color);


    CTX.fillText('RATING', this.menu.rating[0], this.menu.rating[1]);

    if (this.viewMode === 'demo') {

        CTX.fillStyle = 'lightblue';
        CTX.font = '20px bold Aria';

        CTX.fillText('This is a demo game.',
            this.settings.width / 2, this.settings.height - 120);

        CTX.fillText(`Your device doesn\'t support :(`,
            this.settings.width / 2, this.settings.height - 100);


        CTX.fillText(`Need width 760px and more for full.`,
            this.settings.width / 2, this.settings.height - 80);

    }

    CTX.fillStyle = 'white';
    CTX.font = 'bold 14px Arial';
    CTX.fillText('© 2019', this.menu.myName[0], this.menu.myName[1]);

    CTX.fillStyle = 'white';
    CTX.font = 'bold 14px Arial';
    CTX.fillText('v0.0.5', this.menu.version[0], this.menu.version[1]);
}

Draw.prototype.drawRatingList = function (load, game, UserInterface) {

    let CTX = this.drawBuffer.ctxBuffer; // short write
    let speedText = null; // for records text cycle
    let posTxtY = null; // for records text cycle
    let RecordsY = null;
    let length = null; // for records text cycle
    let frameCheck = null;
    let checkMobile = (this.view === 'mobile') ? true : false;

    !(checkMobile) && (length = (load.startRecord.length < 8) ?
        load.startRecord.length : 8); // length records array

    (checkMobile) && (length = (load.startRecord.length < 5) ?
        load.startRecord.length : 5);

    !(checkMobile) && (RecordsY = 275); // start draw position
    (checkMobile) && (RecordsY = Math.floor(350 / 1.5));
    speedText = 32; // i

    CTX.restore();
    CTX.save();
    CTX.textAlign = "center";
    CTX.textBaseline = "middle";

    CTX.fillStyle = this.menu.background;
    CTX.fillRect(this.settings.drawInX, this.settings.drawInY,
                 this.settings.width, this.settings.height);

    CTX.fillStyle = this.menu.background;
    CTX.fillRect(this.settings.drawInX, this.settings.drawInY,
                 this.settings.width, this.settings.height);

    CTX.fillStyle = 'rgb(255,215,0)';
    CTX.shadowColor = 'brown';
    CTX.shadowBlur = 3;
    CTX.shadowOffsetX = 6;
    CTX.shadowOffsetY = 7;
    !(checkMobile) ? CTX.font = 'bold 80px PIXI': CTX.font = 'bold 60px PIXI';

    (checkMobile) && (this.rating.TitleGame[1] = 40);

    (checkMobile) &&
    (CTX.fillText('THE BEST', this.rating.TitleGame[0], this.rating.TitleGame[1]));

    !(checkMobile) &&
    (CTX.fillText('THE BEST', this.rating.TitleGame[0], this.menu.TitleGame[1]));

    CTX.restore();
    CTX.save();

    frameCheck = UserInterface.checkFrame(UserInterface.linki[3]);

    (frameCheck) && (CTX.fillStyle = UserInterface.linki[3].selectColor);

    !(frameCheck) && (CTX.fillStyle = UserInterface.linki[3].color);

    !(checkMobile) ? CTX.font = 'bold 50px PIXI': CTX.font = 'bold 40px PIXI';
    (checkMobile) && (this.rating.return[1] = 120);

    CTX.fillText('RETURN', this.rating.return[0], this.rating.return[1]);
    CTX.strokeStyle = 'yellow';
    (checkMobile) && (this.rating.StrokeRectCoords[1] = 140);

    CTX.strokeRect(this.rating.StrokeRectCoords[0],
                   this.rating.StrokeRectCoords[1],
                   this.rating.StrokeRectSize[0],
                   this.rating.StrokeRectSize[1]);

    CTX.fillStyle = 'black';
    (checkMobile) && (this.rating.RectCoords[1] = 140);
    CTX.fillRect(this.rating.RectCoords[0], this.rating.RectCoords[1],
                this.rating.RectSize[0], this.rating.RectSize[1]);


    CTX.textAlign = "left";
    CTX.font = 'bold 45px PIXI';
    CTX.fillStyle = 'yellow';

    !(checkMobile) && (CTX.fillText('NAME', this.rating.TitleName[0],
                                this.rating.TitleName[1]));

    (checkMobile) && (CTX.textAlign = 'center');
    (checkMobile) &&  (CTX.fillText('NAME', this.settings.width / 2.1, this.rating.TitleName[1] / 1.3));


    if ( !(checkMobile) || this.viewDesktop === 'half-half') {

        CTX.fillStyle = 'yellow';
        CTX.fillText('POINTS', this.rating.RectSize[0] - 70, this.rating.TitlePoints[1]);

    }

    CTX.font = 'bold 40px PIXI';
    CTX.fillStyle = 'yellow';

    for (let i = 0; i < length; i++) {

        ( (checkMobile) && (CTX.textAlign = 'left'));
            this.rating.ratingListX[0] = this.rating.RectCoords[0] + 10;


        CTX.fillText(`${i+1}. ` + load.startRecord[load.startRecord.length - (i + 1)].name,
            this.rating.ratingListX[0], RecordsY);

        if (!(checkMobile) || this.viewDesktop === 'half-half') {

            CTX.fillText(load.startRecord[load.startRecord.length - (i + 1)].points,
                this.rating.RectSize[0] - 50, RecordsY);

        }

        RecordsY += speedText;
    }


    CTX.textAlign = "center";
    CTX.fillStyle = 'white';
    CTX.font = 'bold 14px Arial';
    CTX.restore();
    CTX.save();

    CTX.fillText('© 2019', this.menu.myName[0], this.menu.myName[1]);

    CTX.fillStyle = 'white';
    CTX.font = 'bold 14px Arial';
    CTX.fillText('v0.0.5', this.menu.version[0], this.menu.version[1]);
}

Draw.prototype.gameOverView = function (gamer, UserInterface, game) {

    this.drawBuffer.ctxBuffer.save();
    let CTX = this.drawBuffer.ctxBuffer; // short write
    let checkLink = UserInterface.checkFrame(UserInterface.linki[4]);

    CTX.fillStyle = 'grey';
    CTX.globalAlpha = 0.8;
    CTX.fillRect(0, 0, this.settings.width, this.settings.height - 75);

    CTX.fillStyle = 'red';
    CTX.textAlign = 'center';
    CTX.font = '100px PIXI';

    ((game.about.stageNumber >= 20) && (gamer.stat.health > 0)) &&
    (CTX.fillText('W I N', this.gameOver.win[0], this.gameOver.win[1]));

    (gamer.stat.health <= 0) &&
    CTX.fillText('GAME OVER', this.gameOver.TitleCoords[0], this.gameOver.TitleCoords[1]);

    CTX.shadowColor = 'brown';
    CTX.shadowOffsetX = 2;
    CTX.shadowOffsetY = 3;
    CTX.font = '40px PIXI';
    CTX.fillStyle = 'yellow';
    CTX.shadowColor = 'brown';

    CTX.fillText('Points: ' + gamer.stat.points, this.gameOver.Points[0],
                this.gameOver.Points[1]);

    CTX.fillText('Throws: ' + gamer.countThrow, this.gameOver.Throw[0],
                this.gameOver.Throw[1]);

    CTX.fillText('Kills: ' + gamer.killCount, this.gameOver.killCount[0],
                this.gameOver.killCount[1]);

    (checkLink) && (CTX.fillStyle = UserInterface.linki[4].selectColor);
    !(checkLink) && (CTX.fillStyle = UserInterface.linki[4].color);

    CTX.font = '50px PIXI';
    CTX.fillText('MENU', this.gameOver.menu[0], this.gameOver.menu[1]);

    this.render(); // render game over
}

Draw.prototype.building = function (load, gamer, game) {

    // ---get main canvas---
    this.drawBuffer.canvasBuffer = document.createElement('canvas');
    this.drawBuffer.ctxBuffer = this.drawBuffer.canvasBuffer.getContext('2d');
    this.drawBuffer.canvasBuffer.setAttribute('width', this.settings.width);
    this.drawBuffer.canvasBuffer.setAttribute('height', this.settings.height);

    let CTX = this.drawBuffer.ctxBuffer; // short write

        CTX.drawImage(load.TextureStorage[0],
            this.playGame.spriteTextureBorder[0], this.playGame.spriteTextureBorder[1],
            this.settings.textureW, this.settings.textureH,
            this.settings.drawInX, this.settings.drawInY,
            this.settings.textureW, this.settings.textureH);

        CTX.drawImage(load.TextureStorage[0],
            this.playGame.spriteTexture[0], this.playGame.spriteTexture[1],
            this.settings.textureW, this.settings.textureH,
            this.settings.drawInX, this.settings.drawInY,
            this.settings.textureW, this.settings.textureH);


        //-----GATES----
        // gate 1

        CTX.drawImage(load.SpriteStorage[0], -14, 190, 85, 65, 109, 0, 95, 65);

        // gate 2
        if ((game.about.state === 'play-animation')) {

            (this.settings.openGate !== -50) && (this.settings.openGate--);
            CTX.drawImage(load.SpriteStorage[0], -14, 190, 85, 65, 349, this.settings.openGate, 95, 65);

        } else {

            (this.settings.openGate !== 0) && (this.settings.openGate++);
            CTX.drawImage(load.SpriteStorage[0], -14, 190, 85, 65, 349, this.settings.openGate, 95, 65);

        }

        // gate 3
        CTX.drawImage(load.SpriteStorage[0], -14, 190, 85, 65, 588, 0, 95, 65);

    // Game panel
    let panel = this.drawBuffer.ctxBuffer.createLinearGradient(0, 0, 170, 0);
    panel.addColorStop(0, "rgb(105,105,105)");
    panel.addColorStop(0.5, "rgb(128,128,128)");
    panel.addColorStop(1, "rgb(169,169,169)");
    CTX.fillStyle = panel;
    CTX.fillRect(this.playGame.gamePanelCoords[0], this.playGame.gamePanelCoords[1],
        this.playGame.gamePanelSize[0], this.playGame.gamePanelSize[1]);

    CTX.strokeStyle = 'blue';
    CTX.lineWidth = 5;
    (this.view === 'mobile') && (this.playGame.hpBarBoorderCoords[0] = this.settings.width / 4);

    CTX.strokeRect(this.playGame.hpBarBoorderCoords[0], this.playGame.hpBarBoorderCoords[1],
        this.playGame.hpBarBoorderSize[0], this.playGame.hpBarBoorderSize[1]);
    CTX.fillStyle = 'crimson';

    (gamer.stat.health <= 0) &&
    (CTX.fillRect(this.playGame.hpBarBoorderCoords[0] + 2,
                  this.playGame.hpBarBoorderCoords[1] + 2,0, 20));

    !(gamer.stat.health <= 0) &&
    (CTX.fillRect(this.playGame.hpBarBoorderCoords[0] + 2,
                  this.playGame.hpBarBoorderCoords[1] + 2,
                  gamer.stat.health, 20));

    // HP bar
    CTX.fillStyle = 'white';
    CTX.font = 'bold 15px PIXI';
    (this.view != 'mobile') &&
    CTX.fillText(gamer.stat.health + 'HP', this.playGame.hpBarSize[0],
        this.playGame.hpBarSize[1]);


    // Lvl
    CTX.fillStyle = 'red';
    CTX.shadowColor = 'rgb(255,255,25)';
    CTX.shadowOffsetX = 2;
    CTX.shadowOffsetY = 3;
    CTX.font = 'bold 30px PIXI';
    CTX.fillText(game.about.stageNumber + ' LVL', 10, 30);
    CTX.shadowOffsetX = 0;
    CTX.shadowOffsetY = 0;
    // Points
    CTX.drawImage(load.SpriteStorage[0],
                  this.playGame.PointsCoords[0], this.playGame.PointsCoords[1],
                  this.playGame.PointsSize[0], this.playGame.PointsSize[1],
                  this.playGame.PointsGetCoords[0], this.playGame.PointsGetCoords[1],
                  this.playGame.PointsGetSize[0], this.playGame.PointsGetSize[1]);

    CTX.fillStyle = 'gold';
    CTX.font = 'bold 27px PIXI';
    CTX.fillText(gamer.stat.points, this.playGame.PointsTextCoords[0],
                 this.playGame.PointsTextCoords[1]);

    CTX.drawImage(load.SpriteStorage[2], this.playGame.pauseButton[0],
                  this.playGame.pauseButton[1], 20, 20);

    if ((game.about.state === 'play') && (this.settings.countModal === 0)) {

        CTX.fillStyle = 'black';
        CTX.globalAlpha = '0.8';
        CTX.fillRect(0, 0, this.settings.width, 100);
        CTX.textAlign = 'center';
        CTX.fillStyle = 'white';
        CTX.font = 'PIXI 30px bold';
        CTX.fillText('Move with the WASD keys', this.playGame.ModalTextWASD[0],
            this.playGame.ModalTextWASD[1]);
        CTX.textAlign = 'center';
        CTX.fillStyle = 'lightblue';
        CTX.font = 'PIXI 20px bold';
        CTX.fillText('Press any keys', this.playGame.ModalPress[0],
            this.playGame.ModalPress[1]);


    CTX.restore();
}
}

Draw.prototype.loadingRender = function (load) {

    this.getCtx.ctx.fillRect(this.settings.drawInX, this.settings.drawInY,
                             this.settings.width, this.settings.height);

    this.getCtx.ctx.fillStyle = 'grey';
    this.getCtx.ctx.textAlign = "center";

    (this.view != 'mobile') ? this.getCtx.ctx.font = '100px Aria bold':

    this.getCtx.ctx.font = '45px Aria bold';

    this.getCtx.ctx.fillText('My project', this.settings.width / 2,
                             this.settings.height / 2);
};

Draw.prototype.renderMouse = function (load, ul) {

    this.drawBuffer.ctxBuffer.drawImage(load.SpriteStorage[0], 255, 192,
        65, 65, ul.coordsMouseX - 32.5, ul.coordsMouseY - 32.5, 65, 65);
}

Draw.prototype.buildingGetNameView = function (type, canvas) {

    const inputName = type.createElement('input');
    const buttonCancel = type.createElement('input');
    const buttonSave = type.createElement('input');

    const div = type.createElement('div');
    const modal = type.createElement('div');
    const bgModal = type.createElement('div');

    modal.classList.add('modal-window');
    bgModal.classList.add('background-modal');
    inputName.classList.add('name');
    buttonSave.classList.add('btnName');
    buttonCancel.classList.add('cancelName');

    div.classList.add('center');
    inputName.setAttribute('type', 'text');
    inputName.setAttribute('maxlength', '11');
    inputName.placeholder = 'NAME';
    buttonSave.setAttribute('type', 'button');
    buttonSave.value = 'SAVE';
    buttonCancel.setAttribute('type', 'button');
    buttonCancel.value = 'NO';

    div.appendChild(inputName);
    div.appendChild(buttonSave);
    div.appendChild(buttonCancel);
    modal.appendChild(div);
    bgModal.appendChild(modal);

    type.body.insertBefore(bgModal, canvas);

}

Draw.prototype.deleteGetNameView = function (type) {

    const modal = type.querySelector('.background-modal');
    modal.remove();
}


Draw.prototype.height = function () {

    if (window.screen.availHeight < 620) {

        this.view = 'mobile';

        return (window.screen.availHeight);
    } else return 620;
}

Draw.prototype.width = function () {

    if (window.screen.availWidth < 800) {

        ((760 < window.screen.availWidth) && (window.screen.availWidth < 800)) &&
        (this.viewDesktop = 'half-half');
        (window.screen.availWidth < 760) && (this.viewMode = 'demo');
        this.view = 'mobile';

        return window.screen.availWidth - 10;

    } else  return 800;
}
function GameController(){

    this.count = 0;
    this.canvasLeft = null;
    this.canvasTop = null;

    this.inputState ={
        UP: false,
        DOWN: false,
        LEFT: false,
        RIGHT: false,
        ESCAPE: false,
    };

};

GameController.prototype.setEvent =  function(location, gamer, load, game, UserInterface,sound){

    let _that = this;
    let canvas = document.getElementById('arena');
    let inputName = document.getElementsByClassName('name')[0];

    document.addEventListener('keydown', moveTrue, false);
    document.addEventListener('keyup', moveFalse, false);
    document.addEventListener('mousemove', movingMouse);
    document.addEventListener('click', clickOnDOM, false);
    location.getCanvas.canvas.addEventListener('click', clickOnCanvas, false);

    function moveTrue(e){

        if (e.target.className === 'name') return 0;

       ((location.settings.countModal === 0) && (game.about.state === 'play')) &&
        (location.settings.countModal++);

        if (!(game.about.state === 'play' || game.about.state === 'pause')){
            e.preventDefault();

        } else if (_that.inputState.ESCAPE){

            game.about.state = 'play';

            return _that.setKeyState(e.which, false);

        } else return _that.setKeyState(e.which, true);
    }

    function moveFalse(e){
        
        if (!(game.about.state === 'play' || game.about.state === 'pause')){

            e.preventDefault();
        } else{

            if (_that.inputState.ESCAPE) return;
            else {

            return _that.setKeyState(e.which, false);
            }
        }
    };

    function movingMouse(e){

        // For links and bullets
        if (e.target === canvas){

            _that.canvasLeft = canvas.offsetLeft;
            _that.canvasTop = canvas.offsetTop;

            UserInterface.coordsMouseX = e.pageX - _that.canvasLeft;
            UserInterface.coordsMouseY = e.pageY - _that.canvasTop;

            UserInterface.coorddX = UserInterface.coordsMouseX - gamer.move.pos[0];
            UserInterface.coorddY = UserInterface.coordsMouseY - gamer.move.pos[1];
        }
    };

    function clickOnCanvas(e){

        if (game.about.state === 'loading' || game.about.state === 'play-animation'){

            e.preventDefault();
            return;
        }


        command = UserInterface.linki; // short write

        for (let i = 0; i < command.length; i++){

            if ((UserInterface.checkFrame(command[i])) &&
                (command[i].Name === game.about.state)){

                command[i].selectName = true;

            } else command[i].selectName = false;
        }

        (location.viewMode === 'demo') && (UserInterface.linki[1].selectName = false);

        if (game.about.state === 'menu' ||
            game.about.state === 'rating' ||
            game.about.state === 'wait'){

            for (let elem in _that.inputState){

                _that.inputState[elem] = false;
            }

        } else{

            if ((_that.inputState.ESCAPE) || (UserInterface.linki[5].selectName)){

                return;
            } else{

                gamer.stat.bullets.useSkill(load, gamer, UserInterface,sound);
            }

        }

    };

    function clickOnDOM(e){

        if (e.target.className === 'btnName' && inputName.value !== ''){

            getName(inputName.value, gamer);
            location.deleteGetNameView(document, e.target);

        } else if (e.target.className === 'cancelName'){

            location.deleteGetNameView(document, e.target);
        }

    };
};


GameController.prototype.setKeyState = function (keyCode, isPressed){

    switch (keyCode){
        case 65:
            this.inputState.LEFT = isPressed; break;
        case 87:
            this.inputState.UP = isPressed; break;
        case 68:
            this.inputState.RIGHT = isPressed; break;
        case 83:
            this.inputState.DOWN = isPressed; break;
        case 27:
            this.inputState.ESCAPE = isPressed; break;
    }
};


GameController.prototype.inputs = function(time, gamer){

    // -----player moving-----
    if (this.inputState.RIGHT){

        gamer.stat.sprite.size[0] = 34;
        gamer.stat.sprite.pos[0] = 572.1;
        gamer.move.pos[0] += gamer.move.speeds * time;
    }
    if ((this.inputState.LEFT)){

        gamer.stat.sprite.size[0] = 33;
        gamer.stat.sprite.pos[0] = 828;
        gamer.stat.sprite.frames = [0, 1];
        gamer.move.pos[0] -= gamer.move.speeds * time;
    }
    if (this.inputState.UP){

        gamer.stat.sprite.size[0] = 34;
        gamer.stat.sprite.pos[0] = 444;
        gamer.move.pos[1] -= gamer.move.speeds * time;
    }
    if (this.inputState.DOWN){

        gamer.stat.sprite.size[0] = 34;
        gamer.stat.sprite.pos[0] = 700;
        gamer.move.pos[1] += gamer.move.speeds * time;
    }
    if ((this.inputState.UP) && (this.inputState.RIGHT)){

        gamer.stat.sprite.size[0] = 33;
        gamer.stat.sprite.pos[0] = 510;
    } else
    if ((this.inputState.UP) && (this.inputState.LEFT)){

        gamer.stat.sprite.size[0] = 34;
        gamer.stat.sprite.pos[0] = 891;
    }

    if ((this.inputState.DOWN) && (this.inputState.LEFT)){

        gamer.stat.sprite.size[0] = 33;
        gamer.stat.sprite.pos[0] = 766;
    } else
    if ((this.inputState.DOWN) && (this.inputState.RIGHT)){

        gamer.stat.sprite.size[0] = 33;
        gamer.stat.sprite.pos[0] = 636.5;
    }
};

GameController.prototype.dataBaseListener = function(loader){
    
        // * Update data when db data change
        cloudDB.use.collection('users').where('realPlayer', '==', true)
        .onSnapshot(function (snapshot){

            loader.startRecord = [];
            snapshot.forEach(function (doc){

                loader.startRecord.push(doc.data());

            });
            // * Sort records
            loader.startRecord.sort(compare);
        });
};





//--------INIT--------//

(function (){
    function main(){


        let canvas = document.getElementById('arena');
        canvas.classList.add('canvasInit');
        const statistic = null;
        let gameLoop = null;
        let lastTime = null;
        let now = null;
        let time = null;


        let sound = new WebAudio();
        sound.init();
        sound.load('audio/main.mp3','additional');
        sound.load('audio/shot.mp3','shot');
        sound.load('audio/Fly_A_Kite.mp3','main');
        sound.load('audio/money.wav','money');
        sound.load('audio/eat.wav','eat');
        sound.load('audio/damage.wav','damage');
        sound.load('audio/death_boss.wav','deathBoss');
        sound.load('audio/death-bat.mp3','deathBat');
        sound.load('audio/death-bossExtra.wav','bossExtra');
        sound.load('audio/gameOver.wav','gameOver');
        sound.load('audio/lvl.mp3','lvl');
        sound.load('audio/lvlUP.wav','lvlUp');
        sound.load('audio/lvlUP.wav','lvlUp2');
        sound.load('audio/select.wav','select');
        console.log(sound);

        // Object init
        const game = new Game();
        const gamePlayDraw = new Draw();
        const controller = new GameController();
        const UserInterface = new UI();
        const loader = new Loader();
        const request = new Request();




        !(localStorage.IP) && (request.getIP(loader));

        mainDB = new DataBase();
        mainDB.updateLimit();
        request.getSpriteData(loader);

        gamePlayDraw.getCanvas.canvas.setAttribute('width', gamePlayDraw.settings.width);
        gamePlayDraw.getCanvas.canvas.setAttribute('height', gamePlayDraw.settings.height);

        (gamePlayDraw.view === 'mobile') && (gamePlayDraw.getCanvas.canvas.classList.add('scale'));

        // links

        if (gamePlayDraw.view != 'mobile'){

            UserInterface.linki.push(new Links('PAUSE', 'pause',
                                                gamePlayDraw.pause.pauseLink[0],
                                                gamePlayDraw.pause.pauseLink[1],
                                                gamePlayDraw.pause.sizeLinkPause[0],
                                                gamePlayDraw.pause.sizeLinkPause[1]));

            UserInterface.linki.push(new Links('PLAY', 'menu',
                                                gamePlayDraw.menu.play[0] - 85,
                                                gamePlayDraw.menu.play[1] - 45,
                                                gamePlayDraw.menu.sizeLinkPlay[0],
                                                gamePlayDraw.menu.sizeLinkPlay[1]));

            UserInterface.linki.push(new Links('RATING', 'menu',
                                                gamePlayDraw.menu.coordsLinkRating[0],
                                                gamePlayDraw.menu.coordsLinkRating[1],
                                                gamePlayDraw.menu.sizeLinkRating[0],
                                                gamePlayDraw.menu.sizeLinkRating[1]));

            UserInterface.linki.push(new Links('RETURN', 'rating',
                                                gamePlayDraw.rating.returnLinkCoords[0],
                                                gamePlayDraw.rating.returnLinkCoords[1],
                                                gamePlayDraw.rating.returnLinkSize[0],
                                                gamePlayDraw.rating.returnLinkSize[1]));

            UserInterface.linki.push(new Links('MENU', 'wait',
                                                gamePlayDraw.gameOver.menuLinkCoords[0],
                                                gamePlayDraw.gameOver.menuLinkCoords[1],
                                                gamePlayDraw.gameOver.menuLinkSize[0],
                                                gamePlayDraw.gameOver.menuLinkSize[1]));

            UserInterface.linki.push(new Links('PAUSE-MENU', 'play',
                                                gamePlayDraw.playGame.pauseButton[0],
                                                gamePlayDraw.playGame.pauseButton[1],
                                                gamePlayDraw.playGame.pauseLinkSize[0],
                                                gamePlayDraw.playGame.pauseLinkSize[1]));

        } else{

            UserInterface.linki.push(new Links('PAUSE', 'pause',
                                                gamePlayDraw.pause.pauseLink[0],
                                                gamePlayDraw.pause.pauseLink[1],
                                                100, 30));

            UserInterface.linki.push(new Links('PLAY', 'menu',
                                                gamePlayDraw.menu.play[0] - 85,
                                                gamePlayDraw.menu.play[1] - 45,
                                                200, 80));

            UserInterface.linki.push(new Links('RATING', 'menu',
                                                gamePlayDraw.menu.coordsLinkRating[0],
                                                gamePlayDraw.menu.coordsLinkRating[1],
                                                250, 80));

            UserInterface.linki.push(new Links('RETURN', 'rating',
                                                gamePlayDraw.rating.return[0] - 40,
                                                gamePlayDraw.rating.returnLinkCoords[1]-10,
                                                gamePlayDraw.rating.returnLinkSize[0],
                                                gamePlayDraw.rating.returnLinkSize[1]));
        }

        loader.loading('Image', 'img/texture.png', 'texture');
        loader.loading('Image', 'img/sheet_objects_heroes.png', 'sprite');
        loader.loading('Image', 'img/menu_800x600.jpg', 'sprite');
        loader.loading('Image', 'img/pause.png', 'sprite');
        loader.loading('Image', 'img/box_background.png', 'sprite');
        loader.loading('Image', 'img/box.png', 'sprite');

        // loading
        gamePlayDraw.loadingRender(loader);


        // enemy and player
        let enemy = new Enemy();
        let player = new Player(loader, gamePlayDraw);


        loader.enemy.forEach(() =>{
            // -----start move-----
            loader.enemy[i].bull.pos[0] = loader.enemy[i].move.pos[0];
            loader.enemy[i].bull.pos[1] = loader.enemy[i].move.pos[1];
            loader.enemy[i].enemySpeed *= getRandomPull();
        });


        function linkers(loader, player,sound){

            (UserInterface.linki.slice(1,UserInterface.linki.length)
            .some ((link) => link.selectName)) && (sound.effects.find(item => item.name === 'select').play(false,1));

            (UserInterface.linki[1].selectName) &&
            (game.startGameAnimation(loader, player, UserInterface.linki[1],sound));

            (UserInterface.linki[2].selectName) &&
            (game.ratingGame(UserInterface.linki[2]));

            (UserInterface.linki[3].selectName) &&
            game.mainMenu(UserInterface.linki[3]);

            ((gamePlayDraw.viewMode != 'demo') && (UserInterface.linki[4].selectName)) &&
            game.mainMenu(UserInterface.linki[4]);

            ((gamePlayDraw.viewMode != 'demo') && (UserInterface.linki[5].selectName)) &&
            (game.pause(UserInterface.linki[5],controller.inputState.ESCAPE));

        }


        function menu(loader, player){

            if (!(game.about.state === 'menu')) return;

                player.setHealth(200);
                game.setRequstCount(0);
                
        }

        (!localStorage.name) &&
            (gamePlayDraw.buildingGetNameView(document, gamePlayDraw.getCanvas.canvas));


        let timer = setTimeout(() =>{

            game.about.state = 'menu';
            gameLoop = requestAnimationFrame(loop);
        }, 3000);

        controller.setEvent(gamePlayDraw, player, loader, game, UserInterface,sound);
        gamePlayDraw.building(loader, player, game);

        controller.dataBaseListener(loader);


        function gameplay(loader, player, game,sound){

            (game.about.state === 'play-animation') &&
            (gamePlayDraw.building(loader, player, game));

            if ((game.about.state === 'play') && !(loader.enemy.length)){


                (game.about.stageNumber >= 20) && (player.setHealth(0));

                if (game.about.stageNumber >= 10){

                    game.about.stageNumber++;
                    game.about.stageBossCount++;
                    game.about.stageExtraBossCount++;

                } else if (game.about.stageNumber >= 7){

                    game.about.stageNumber++;
                    game.about.stageBossCount++;
                }

                (game.about.stageNumber < 7) && (game.about.stageNumber++);

                game.spawnAndLvling(game, loader, enemy, game.about.stageNumber,sound);
            };
        }

        function buildTexture(game, loader, player){

                (game.about.state === 'play') && (calculate(player));

                ((game.about.state === 'play') || (game.about.state === 'wait')) &&
                (gamePlayDraw.building(loader, player, game))
        }

        function pauseCheck(game, controller){

            ((game.about.state === 'pause') && !(controller.inputState.ESCAPE)) &&
            (controller.inputState.ESCAPE = true);
        }

        function death(game, player, loader,sound){

            if ((game.about.state === 'wait') &&(game.about.requstCount === 0) &&
                (player.stat.health <= 0)){

                (localStorage.name) && (player.stat.gamerName = localStorage.name);
                !(localStorage.name) && (player.stat.gamerName = 'player' +
                                        (Math.random().toFixed(3)).toString());

                let id = '_id' + loader.startRecord.length;

                const statistic ={

                    result:{
                        name: player.stat.gamerName,
                        points: player.stat.points,
                        id: id.slice(1, id.length),
                        ip: localStorage.IP,
                    }
                }

                localStorage.setItem("result", JSON.stringify(statistic));

                mainDB.updateUserData(localStorage.IP, id, player.stat.gamerName,
                    player.stat.points, loader);

                game.about.requstCount++;
            }
        }

        function loop(){

            now = Date.now();
            time = (now - lastTime) / 1000.0;

            linkers(loader, player, sound);
            menu(loader, player);
            gameplay(loader, player, game,sound);

            if ((!(game.pause(UserInterface.linki[5],
                controller.inputState.ESCAPE))) &&
                (game.about.state === 'play')){

            controller.inputs(time, player); // check inputs
            }
            update(time, player, loader, game, UserInterface.linki,sound);
            pauseCheck(game, controller);
            buildTexture(game, loader, player,sound);
            gamePlayDraw.renders(player, loader, game, UserInterface,sound);
            death(game, player, loader,sound); //, request

            lastTime = now;
            requestAnimationFrame(loop);
        }
    }
    return application ={ init: main }
})();

application.init();
//# sourceMappingURL=main.js.map
