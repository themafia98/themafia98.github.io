require('./lib/firebase');
import '../img/box_background.png';
import '../img/box.png';
import '../img/coins.jpg';
import '../img/favicon.ico';
import '../img/frame_background.png';
import '../img/loading.gif';
import '../img/menu_800x600.jpg';
import '../img/modal_background.jpg';
import '../img/pause.png';
import '../img/sheet_objects_heroes.png';
import '../img/texture.png';

import '../font/Nautilus.otf';
import '../font/SHPinscher-Regular.otf';

import '../style/style.scss';
import '../style/media.scss';

import main from './chunks/init.js';

if (module.hot && process.env === 'development') module.hot.accept();

try {

main();

} catch(error){
    
    console.error('Critical error, restarting app...');
    setTimeout(function(){
    window.location.reload(true);
    }, 3000);
}

