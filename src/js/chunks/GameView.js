export default class Draw {

    constructor(){
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

    render() {
        // -----All render-----
    
        this.getCtx.ctx.drawImage(this.drawBuffer.canvasBuffer,
                                  this.settings.drawInX, this.settings.drawInY,
                                  this.settings.width, this.settings.height);
    
        this.drawBuffer.ctxBuffer.restore();
    }

    renderEnemys(gamer) {

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

    renderItems(load) {


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

    renderPlayer(gamer, game) {

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

    fadeIn(game, load) {

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

    renderEnemyBulls(bull) {

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

    renderBulls(bull, load, gamer) {
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

    renders(gamer, load, game, UserInterface,sound) {

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

    pauseMenuView(game, gamer, UserInterface, load) {

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

    DrawMenu(load, game, UserInterface, gamer) {

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
        CTX.fillText('v1.0.0', this.menu.version[0], this.menu.version[1]);
    }

    drawRatingList(load, game, UserInterface) {

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
        CTX.fillText('v1.0.0', this.menu.version[0], this.menu.version[1]);
    }

    gameOverView(gamer, UserInterface, game) {

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

    building(load, gamer, game) {

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

    loadingRender(load) {

        this.getCtx.ctx.fillRect(this.settings.drawInX, this.settings.drawInY,
                                 this.settings.width, this.settings.height);
    
        this.getCtx.ctx.fillStyle = 'grey';
        this.getCtx.ctx.textAlign = "center";
    
        (this.view != 'mobile') ? this.getCtx.ctx.font = '100px Aria bold':
    
        this.getCtx.ctx.font = '45px Aria bold';
    
        this.getCtx.ctx.fillText('My project', this.settings.width / 2,
                                 this.settings.height / 2);
    }

    renderMouse(load, ul) {

        this.drawBuffer.ctxBuffer.drawImage(load.SpriteStorage[0], 255, 192,
            65, 65, ul.coordsMouseX - 32.5, ul.coordsMouseY - 32.5, 65, 65);
    }

    buildingGetNameView(type, canvas) {

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

    deleteGetNameView(type) {

        const modal = type.querySelector('.background-modal');
        modal.remove();
    }

    height() {

        if (window.screen.availHeight < 620) {
    
            this.view = 'mobile';
    
            return (window.screen.availHeight);
        } else return 620;
    }

    width() {

        if (window.screen.availWidth < 800) {
    
            ((760 < window.screen.availWidth) && (window.screen.availWidth < 800)) &&
            (this.viewDesktop = 'half-half');
            (window.screen.availWidth < 760) && (this.viewMode = 'demo');
            this.view = 'mobile';
    
            return window.screen.availWidth - 10;
    
        } else  return 800;
      }
}


