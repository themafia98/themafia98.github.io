import { AudioContext } from 'standardized-audio-context';
import fetch from  'isomorphic-fetch';
require('es6-promise');
export  class DataBase{
    // * firebase

    constructor(){
        this.MAX_WRITE = 0;
        this.currentIP = null;
    }

    updateLimit(){
        // * Limit on updata data
        let _that = this;
        this.timer = setTimeout(function limit(){
    
            _that.MAX_WRITE = 0;
            this.timer = setTimeout(limit, 60000);
        }, 60000);
    }

    updateUserData(ip, id, name, points){
        // * Update data
    
        if (this.MAX_WRITE > 3) throw new Error('limit');
    
        this.MAX_WRITE++;
        this.currentIP = (ip) ? ip : 'no ip detected';
    
        db.collection('users').doc(`user_${(name+id).replace(/\s/g,'').toLowerCase()}`)
            .set({
                name: name,
                points: points,
                id: id.slice(1, id.length),
                ip: this.currentIP,
                realPlayer: true
            })
    
            .catch(function (error){
    
                console.error(error.message);
            });
    }


}

export class Request{
    // * API

    constructor(){
        this.key = 'json';
    }

    getIP(load){
        // * Check users IP
    
        fetch(`https://api.ipify.org?format=${this.key}`)
    
            .then((response) => response.json())
            .then((response) =>{
    
                (response.ip) ? localStorage.IP = response.ip: localStorage.IP = 'no detected';
            })
    
            .catch(function (error){
    
                console.error(error.message);
            });
    }

    getSpriteData(load){
        fetch(`./js/data.json`)
    
        .then((response) => response.json())
        .then((response) => load.jsonData = response)
    
        .catch(function (error){
    
            console.error(error.message);
        });
    }



}


export class WebAudio{

    constructor(){
        this.effects = [];
        this.ctx = null;  // создание контекста звука
        this.gainNode = null;
        this.loaded = false;
        this.time = null;
        this.lastTime = null;
    }

    init(){

        this.ctx = new AudioContext();
        this.gainNode = this.ctx.createGain ? this.ctx.createGain() : this.ctx.createGainNode();
        this.gainNode.connect(this.ctx.destination);  // подключение к динамикам
        this.time = this.ctx.currentTime;
    }

    load(path,name){

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
                if (!effect.loaded) return;
    
    
                let sound = _that.ctx.createBufferSource(); // Создается источник звука
                sound.buffer = this.buffer; // настраивается буфер
    
    
                sound.connect(_that.gainNode);  // подключение источника к "колонкам"
                sound.loop = loop;
                _that.gainNode.gain.value = volume;
                sound.start(0); // start
                // sound.stop(5);
    
                // _that.lastTime = _that.ctx.currentTime - sound.buffer.duration;
                // _that.time = _that.ctx.currentTime;
                }
            });
        });
    }

    stopAll() {

        // отключение всех звуков
        this.gainNode.disconnect();
        this.gainNode = this.ctx.createGain ? this.ctx.createGain(0) : this.ctx.createGainNode(0);
        this.gainNode.connect(this.ctx.destination);
    }
}

export class UI{

    constructor(){
        this.linki = []; // save links
        this.coordsMouseX = null;
        this.coordsMouseY = null;
    }

    checkFrame(frame){ // check selected links

        if ((this.coordsMouseX > frame.pos[0]) &&
            (this.coordsMouseX < frame.pos[0] + frame.length[0]) &&
            (this.coordsMouseY > frame.pos[1]) &&
            (this.coordsMouseY < frame.pos[1] + frame.length[1])){
    
            return true;
        }
        return false;
    }
}


export class Game{

    constructor(){

        this.menu = 'menu';
        this.death = 'wait';
        this.rating = 'rating';
        this.play = 'play';
        this.startPlay = 'play-animation';
        this.pauseGame = 'pause';

        this.fade = 1;
        this.loadingPercent = 0;

        this.about ={
            state: 'loading',
            count: 0, // game count for win state
            stageBossCount: 0,
            stageExtraBossCount: 0,
            stageNumber: 0,
            lastTimeBull: 0, // time bullets
            requstCount: 0,
            lastTime: 0,
            lastTimeColl: 0,
        };
    }

    setRequstCount(i){

        return this.about.requstCount = i;
    }

// ----------------switch states---------------

    startGame(){

        return this.about.state = this.play;
    }

    startGameAnimation(load, gamer, activeLink,sound){

        activeLink.selectName = false; // link
        this.music(sound); // music
        this.updateGameStatus(gamer, load); // game state
        gamer.setHealth(200); // update health
    
        return this.about.state = this.startPlay;
    }

    stopGame(){

        return this.about.state = this.death;
    }

    ratingGame(activeLink){

        activeLink.selectName = false;
        return this.about.state = this.rating;
    }

    mainMenu(activeLink,sound){

        if (sound){  sound.stopAll();}
        activeLink.selectName = false;
        return this.about.state = this.menu;
    }

    pause(activeLink,escape){
    
        if ((escape) || ((activeLink) &&
            (activeLink.selectName))){

            activeLink.selectName = false;
            this.about.state = this.pauseGame;
            return true;

        } else return false;
    }

    spawnAndLvling(game, load, enemy, stageNumber,sound){

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
    }

    updateGameStatus(gamer, load){ // new game

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
    
    }

    music(sound){

        let delayForLoading = setTimeout( () => {
            sound.effects.find(item => item.name === 'main').play(true,1);
        },2500);
    }



}


export class Loader{ // for storage and loading files and datas

    constructor(){
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
    }

    // ---loading method---
    textureCache(src){

    return this.TextureStorage.push(src);
    }

    SpriteCache(src){

    return this.SpriteStorage.push(src);
    }

    SoundCache(src){

    return this.SoundsStorage.push(src);
    }

    loading(fileType, src, imageType){

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
    
    }
}


export class Player{

    constructor(type, location){
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
    }

    setHealth(count){

        return this.stat.health = count;
    };

    GameOver(gamer, game, load,sound){

        if (gamer.stat.health <= 0){
            
            load.enemy = []; // cleaer enemy
    
            if (!(gamer.SoundCount) && (game.about.stageNumber < 20)){
                
                sound.effects.find(item => item.name === 'gameOver').play(false,0.5);
                gamer.SoundCount++;
            }
            game.stopGame();
        }
    }

    Win(gamer, game, load){

        if (!(gamer.stat.health < 0)){
    
            if (!(load.enemy.length) && !(game.about.count)){
    
                game.about.stageNumber++;
                game.about.count++;
            }
        }
    }


}

export class Bullets{

    constructor(){
        this.lastFire = 0;
        this.i = 50;
        this.weapons ={
            speed: 320,
            active: false,
        };
    }

    useSkill(load, gamer, ui,sound){

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
    }

    createBullets(type){

        // bull for player
        return new Sprite('bull', type.SpriteStorage[0],
            [192.5, 31], [32, 36], 0);
    }
    
    createBulletsCustom(type, spriteCoordX, spriteCoordY){
    
        // bull for enemys
        return new Sprite('bull2', type.SpriteStorage[0],
            [spriteCoordX, spriteCoordY], [22, 34], 0);
    }


};



export class Enemy{


    constructor(){
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

    createEnemy(load, hp, damage, name, type,
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
    }
}



export class Sprite{

    constructor(name, url, pos, size, speed, frames, dir, once){
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
    }

    update(time){

        this.index += this.speed * time;
    }

    render(){

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
    }
};

export class Items{

    constructor(){
        let _that = this; // save ctx

        this.name = null;
        this.sprite = null;
        this.pos = [];

        this.settingsItems = {

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

    lucky(percent){
        return Math.random() < percent
    }

    setSprite(load, cordSpriteX, cordsSpriteY,
            sizeSpriteX, sizeSpriteY){
    
        return this.sprite = new Sprite(this.name, load.SpriteStorage[0],
            [cordSpriteX, cordsSpriteY], [sizeSpriteX, sizeSpriteY]);
    }
}


function getRandomPull(){

    // -----get random bullets dir-----
    let arr = [-1.2, -1, 1, 1.2];
    let rand = Math.floor(Math.random() * arr.length);
    return arr[rand];
}

function getRandom(){

    // -----get random enemy position-----
    let arr = [0.3, 0.6, 0.8, 0.9, 1.2];
    let rand = Math.floor(Math.random() * arr.length);
    return arr[rand];
}

