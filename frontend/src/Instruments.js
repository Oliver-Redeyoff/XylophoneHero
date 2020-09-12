import sounds from './Assets/sounds/Sounds.js';

export const instrumentTemplate = {
    "xylophone": {
        numBoxes: 7,
        genBoxes: regularRectangleBoxes,
    }
};

function instruments(name, minX, maxX, minY, maxY) {
    const template = Object.create(instrumentTemplate[name]);
    template.boxes = template.genBoxes(template.numBoxes, minX, maxX, minY, maxY, sounds[name])
    delete template.genBoxes;
    return template
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
            sound: sound
        });
    }
};

export default instruments;