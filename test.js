const { remote } = require('webdriverio');

const capabilities = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'emulator-5554',
  'appium:app': 'test_demo.apk',
  // 'appium:appPackage': 'com.android.settings',
  // 'appium:appActivity': '.Settings',
};

const wdOpts = {
  hostname: process.env.APPIUM_HOST || 'localhost',
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  logLevel: 'info',
  capabilities,
};

async function runTest() {
  const driver = await remote(wdOpts);
  try {
    await driver.pause(5000);

    await enterTextAndSubmit(driver, 'hhhhh', 'Invalid URL message');
    await enterTextAndSubmit(driver, 'http://155.0.0.1', 'Navigate to home screen');

    await deleteItem(driver, 5);
    
    console.log('Item 5 deleted successfully');
  } catch (error) {
    console.error(error);
  } finally {
    await driver.pause(1000);
    await driver.deleteSession();
  }
}

async function enterTextAndSubmit(driver, text, actionDescription) {
  try {
    const textField = await driver.$('android.widget.EditText');
    await textField.click();
    await textField.clearValue();
    await textField.setValue(text);

    const connectButton = await driver.$('android.widget.Button');
    await connectButton.click();

    
    await driver.pause(2000); // Optionally replace with an explicit wait
  } catch (error) {
    console.log(error)
  }
}

async function deleteItem(driver, itemIndex) {
    try {
      // Locate and click on the item to view details
      const item = await driver.$(`(//android.widget.Button[@content-desc="View Details"])[${itemIndex}]`);
      await item.click();
  
      // Go back to the main screen
      const homeButton = await driver.$('//android.widget.Button[@content-desc="Back"]');
      await homeButton.click();
  
      // Locate and click the delete button
      const deleteButton = await driver.$(`//android.view.View[@content-desc="Item ${itemIndex}"]/android.widget.Button[2]`);
      await deleteButton.click();
  
      // Confirm the deletion
      const confirmDeleteButton = await driver.$('//android.widget.Button[@content-desc="Delete"]');
      await confirmDeleteButton.click();
  
      // Wait for the item to be removed
      const itemLocator = `//android.view.View[@content-desc="Item ${itemIndex}"]`;
      await driver.waitUntil(async () => {
        const items = await driver.$$(itemLocator);
        return items.length === 0;
      }, {
        timeout: 5000, // Adjust timeout as needed
        timeoutMsg: `Item ${itemIndex} was not deleted successfully`
      });
  
      console.log(`Item ${itemIndex} deleted and verification complete`);
    } catch (error) {
      throw new Error(error);
    }
  }
  

runTest().catch(console.error);