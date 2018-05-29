const { Builder, By, until } = require('selenium-webdriver');

const fs = require('fs');
const scenarios = require('./scenarios.json').scenarios;

const writeScreenShot = (data, name) => {
    name = name || 'ss.png';
    var screenshotPath = './snaps/';
    fs.writeFileSync(screenshotPath + name, data, 'base64');
};

const takeSnap= async (url, name) => {
    // LOCAL
    const driver = await new Builder().forBrowser('chrome').build()
    
    //REMOTE
    // const driver = new webdriver.Builder().
    //     usingServer('http://selenium-grid.tnl-dev.ntch.co.uk/wd.hub')
    //     withCapabilities(webdriver.Capabilities.chrome()).
    //     build();

    await driver.get(url);
    await driver.executeAsyncScript('document.getElementsByClassName("AD").remove()');
    const snapshot = await driver.takeScreenshot()
    
    await writeScreenShot(snapshot, `${name}.png`)
    await driver.quit()
}

scenarios.forEach(scenario => {
    takeSnap(scenario.url, scenario.label)
})
