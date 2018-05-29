const fs = require('fs');
const resemble = require('resemblejs');

const testFolder = './baseline/';

const compare = (image1, image2) => {
    resemble(image1).compareTo(image2).onComplete(function(data){
        console.log(data.misMatchPercentage);
    });
}

fs.readdir(testFolder, (err, files) => {
    files.forEach(file => {
        compare(`./baseline/${file}`, `./snaps/${file}`)
    });
})