import {Sprite,Items} from './GameModel.js';

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
        damageCheck(load, gamer,sound,game); // get damage check

    }

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

                let timers = new Date().getTime();
                let dmgSound = sound.effects.find(item => item.name === 'damage');

                if ( timers > game.about.lastTime + (dmgSound.buffer.duration*1000)){

                dmgSound.play(false,0.8);
                game.about.lastTime = timers;
                }

                gamer.stat.sprite.pos[0] = 956;
                gamer.stat.health--;
                gamer.move.pos[0, 1]++;

                // set start sprite frame
                let resetSprite = setTimeout(() =>{
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

            sound.effects.find(item => item.name === 'lvlUp').play(false,0.8);
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

function getName(buttonName, gamer){

    // get gamer name from localStorage and set
    localStorage.name = buttonName;
    return gamer.stat.gamerName = buttonName;
}

function calcBullet(bullet, gamer, time){

    // преобразуем координаты в объект класса Vector
    const pos = new Vector(bullet.pos.x, bullet.pos.y);

    // рассчитываем вектор приращения в направлении движения пули для ее скорости
    const vector = bullet.direction.multiply(gamer.stat.bullets.weapons.speed * time);

    // добавляем к координатам пули значение вектора с приращениями
    bullet.pos = pos.add(vector);
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

function damageCheck(load, gamer,sound,game){

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

                    let coins = new Items();
                    coins.settingsItems.name = 'coin';

                    if (coins.lucky(0.7)){ // drop coins

                        coins.setSprite(load, 69, 30, 26, 37);
                        // coins position
                        coins.pos[0] = itemEnemy.move.pos[0];
                        coins.pos[1] = itemEnemy.move.pos[1];

                        load.coins.push(coins);

                    } else coins = null;

                } else{

                    let eat = new Items();
                    eat.settingsItems.name = 'eat';

                    if (eat.lucky(0.5)){ // drop eats

                        eat.setSprite(load, 95, 30, 39, 40);
                        // eat position
                        eat.pos[0] = itemEnemy.move.pos[0];
                        eat.pos[1] = itemEnemy.move.pos[1];

                        load.eat.push(eat);

                    } else eat = null;

                }
                gamer.stat.upgradeRate = true;
                if (gamer.stat.upgradeRate){

                    let upgrade = new Items();
                    upgrade.settingsItems.name = 'scroll';

                    if(upgrade.lucky(0.2)){

                    upgrade.setSprite(load, 128, 192, 42, 44);

                    upgrade.pos[0] = itemEnemy.move.pos[0] + 5;
                    upgrade.pos[1] = itemEnemy.move.pos[1] + 5;

                    load.upgrade.push(upgrade);
                    } else upgrade = null;
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

        checkPlayerDmg(itemEnemy,gamer,sound,game);

    });
}

function checkPlayerDmg(itemEnemy,gamer,sound,game){

    

    // * Get player dmg or no
    if ((itemEnemy) && (boxCollides([itemEnemy.move.pos[0], itemEnemy.move.pos[1]],
            [30, 30], [gamer.move.pos[0], gamer.move.pos[1]], [32, 32]))){

        if (gamer.stat.health > -1){

            gamer.stat.sprite.pos[0] = 956; // damage player sprite
            let timers = new Date().getTime();
            let dmgSound = sound.effects.find(item => item.name === 'damage');

            if ( timers > game.about.lastTimeColl + (dmgSound.buffer.duration*1000)){

            dmgSound.play(false,0.8);
            game.about.lastTimeColl = timers;
            }
            gamer.stat.health--; // get damage
            gamer.move.pos[0, 1]++; // repulsion

           let resetSprite = setTimeout(() =>{ gamer.stat.sprite.pos[0] = 700; },0);
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

function getRandomPull(){

    // -----get random bullets dir-----
    let arr = [-1.2, -1, 1, 1.2];
    let rand = Math.floor(Math.random() * arr.length);
    return arr[rand];
}


export { update,calculate }