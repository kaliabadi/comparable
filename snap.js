const webdriver = require('selenium-webdriver');

const fs = require('fs');
const scenarios = require('./scenarios.json').scenarios;

const writeScreenShot = (data, name) => {
    name = name || 'ss.png';
    var screenshotPath = './snaps/';
    fs.writeFileSync(screenshotPath + name, data, 'base64');
};

const removeSelectors = async(driver, selectors) => {
    selectors.forEach(async(selector) => {
        try {
            let adElement = await driver.findElement(webdriver.By.id(elementId));
            await driver.wait(webdriver.until.elementIsVisible(adElement), 5000);
            await driver.executeAsyncScript(`var element = document.getElementById("${elementId}"); element.parentNode.removeChild(element)`);
        } catch(error) {
            console.error(error)
        }
    })
}

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

const cleanUp = async(driver) => {
    await driver.quit()
}

const runSnapShots = async() => {
    scenarios.forEach(async(scenario) => {
        console.log(scenario.label)
        const driver = await new webdriver.Builder().forBrowser('chrome').build()    
        // const driver = new webdriver.Builder().
        //     usingServer('http://selenium-grid.tnl-dev.ntch.co.uk:4444/wd/hub').
        //     withCapabilities(webdriver.Capabilities.chrome()).
        //     build();
    
        await loadBrowser(driver, scenario.url)
        await removeSelectors(driver, scenarios.removeSelectors)
        await takeSnap(driver, scenario.label)
        await cleanUp(driver);
    })
}

runSnapShots();
