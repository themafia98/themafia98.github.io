import {DataBase,Request,WebAudio,
        Game,UI, Loader,Player,Enemy} from './GameModel.js';
import Draw from './GameView.js';
import GameController from './GameController.js';
import {update, calculate} from './headlerModal.js';

//--------INIT--------//


function Links(url, name, coordsX, coordsY, lengthX, lengthY){

    this.url = url;
    this.Name = name;
    this.pos = [coordsX, coordsY];
    this.length = [lengthX, lengthY];
    this.color = 'red';
    this.selectColor = 'rgb(255,140,0)';
    this.selectName = false;
}

export default function main(){

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

        let mainDB = new DataBase();
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

            ((gamePlayDraw.viewMode != 'demo') && (UserInterface.linki[4].selectName || UserInterface.linki[0].selectName)) &&
            game.mainMenu(UserInterface.linki[4],sound);

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


