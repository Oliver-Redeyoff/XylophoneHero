import xylophoneA from './xylophone-sounds/a.mp3';
import xylophoneB from './xylophone-sounds/b.mp3';
import xylophoneC from './xylophone-sounds/c2.mp3';
import xylophoneD from './xylophone-sounds/d1.mp3';
import xylophoneE from './xylophone-sounds/e1.mp3';
import xylophoneF from './xylophone-sounds/f.mp3';
import xylophoneG from './xylophone-sounds/g.mp3';
import emin from './guitar-sounds/emin.mp3';
import cmaj from './guitar-sounds/cmaj.mp3';
import dmaj from './guitar-sounds/dmaj.mp3';
import gmaj from './guitar-sounds/gmaj.mp3';

const sounds = {
    "xylophone": [
        xylophoneC,
        xylophoneD,
        xylophoneE,
        xylophoneF,
        xylophoneG,
        xylophoneA,
        xylophoneB
    ],
    "guitar": [
        null,
        null,
        null,
        emin,
        gmaj,
        dmaj,
        cmaj,
        null,
        null,
    ]
}

export default sounds;
