const fs = require('fs');
const resemble = require('resemblejs');
const looksSame = require('looks-same');

const testFolder = './baseline/';

const compare = (image1, image2) => {
    const fileName = image1.replace('./baseline/', '');
    
    looksSame.createDiff({
        reference: image1,
        current: image2,
        diff: `./comparisons/${fileName}`,
        highlightColor: '#ff00ff', //color to highlight the differences
        strict: false,//strict comparsion
        tolerance: 2.5
    }, function(error) {
    });
}

// const compare = (image1, image2) => {
//     resemble(image1).compareTo(image2).onComplete(function(data) {
//         console.log(`${image1}: Mismatch percentage: ${data.misMatchPercentage}%`);
//     });
// }

fs.readdir(testFolder, (err, files) => {
    files.forEach(file => {
        compare(`./baseline/${file}`, `./snaps/${file}`)
    });
})