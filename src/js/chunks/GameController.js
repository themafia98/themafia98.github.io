import {db} from '../lib/firebase';
export default class GameController{

    constructor(){
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
    }

    setEvent(location, gamer, load, game, UserInterface,sound){

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
    
    
            let command = UserInterface.linki; // short write
    
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
    }

    setKeyState(keyCode, isPressed){

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

    inputs(time, gamer){

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
    }

    dataBaseListener(loader){
    
        // * Update data when db data change
        db.collection('users').where('realPlayer', '==', true)
        .onSnapshot(function (snapshot){

            loader.startRecord = [];
            snapshot.forEach(function (doc){

                loader.startRecord.push(doc.data());

            });
            // * Sort records
            loader.startRecord.sort(compare);
        });
    }
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


