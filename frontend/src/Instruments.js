import sounds from './Assets/sounds/Sounds.js';

export const instrumentTemplate = {
    "xylophone": {
        numBoxes: 7,
        genBoxes: regularRectangleBoxes,
        name: "xylophone"
    },
    "guitar": {
        numBoxes: 7,
        genBoxes: guitarBoxes,
        name: "guitar"
    }
};

function instruments(name, minX, maxX, minY, maxY) {
    const template = Object.create(instrumentTemplate[name]);
    template.boxes = template.genBoxes(template.numBoxes, minX, maxX, minY, maxY, sounds[name])
    delete template.genBoxes;
    return template;
}

function guitarBoxes(numBoxes, minX, maxX, minY, maxY, sounds) {
    numBoxes += 2;
    let boxes = (regularRectangleBoxes(numBoxes, minX, maxX, 0, 600, sounds));
    boxes[2].minX = boxes[0].minX;
    boxes = boxes.slice(2, numBoxes-2);
    boxes[0].effect = () => {};
    boxes[0].toggle = false;
    boxes[0].minY = minY*6/5;
    boxes[0].maxY = maxY;
    return boxes;
}

function regularRectangleBoxes(numBoxes, minX, maxX, minY, maxY, sounds) {
    if (sounds.length < numBoxes) {
        throw `There aren't enough sounds (${sounds.length}) for the number of boxes (${numBoxes}) you kiddy fiddler`;
    }
    const differenceX = maxX - minX;
    const width = differenceX / numBoxes;
    const boxes = [];
    for (let i = 0; i < numBoxes; i++) {
        const newMinX = minX + (width*i);
        const newMaxX = newMinX + width;
        const sound = sounds[i];
        boxes.push({
            minY: minY,
            maxY: maxY,
            minX: newMinX,
            maxX: newMaxX,
            played: false,
            effect: () => playSound(sound)
        });
    }
    return boxes;
};

function playSound(sound){
    const audio = new Audio(sound);
    audio.play();
}

export default instruments;
