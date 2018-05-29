const webdriver = require('selenium-webdriver');
const fs = require('fs');
const scenarios = require('./scenarios.json').scenarios;

const writeScreenShot = (data, name) => {
    name = name || 'ss.png';
    var screenshotPath = './snaps/';
    fs.writeFileSync(screenshotPath + name, data, 'base64');
};

const loadBrowser = async (driver, url) => {
    try {
        driver.manage().window().setRect({width: 1040, height: 2480});
        await driver.get(url);
    } catch(error) {
        console.error(error);
    }
}

const takeSnap = async (driver, name) => {
    const snapshot = await driver.takeScreenshot()
    
    try {
        await writeScreenShot(snapshot, `${name}.png`)
        console.log(`Writing screenshot ${name}`)
    } catch (error) {
        console.error(error);
    }
}

const runSnapShots = async() => {
    scenarios.forEach(async(scenario) => {
        const driver = await new webdriver.Builder().forBrowser('chrome').build()    
        // const driver = new webdriver.Builder().
        //     usingServer('http://selenium-grid.tnl-dev.ntch.co.uk:4444/wd/hub').
        //     withCapabilities(webdriver.Capabilities.chrome()).
        //     build();

        await loadBrowser(driver, scenario.url)
        
        try {
            //WOW what hackery :O (don't blame me this is a spike)
            let selectorString = '[ ';
            scenario.removeSelectors.forEach(function(selector) {
                selectorString += '\"' + selector + '\", '
            })
            selectorString += ' ]'
            let adElement = await driver.findElement(webdriver.By.id('ad-header'));
            await driver.wait(webdriver.until.elementIsVisible(adElement), 5000);
            await driver.executeAsyncScript('var identifierArray = ' + selectorString + '; identifierArray.forEach(function(identifier) { var element = document.getElementById(identifier); if(element) { element.parentNode.removeChild(element) } } )')
        } catch(error) {}

        await takeSnap(driver, scenario.label)
        await driver.quit()
    })
}

runSnapShots();
