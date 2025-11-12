import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

async function run() {
  const baseUrl = process.env.AUVET_E2E_BASE_URL ?? 'http://localhost:5173';
  const options = new chrome.Options()
    .addArguments('--disable-gpu', '--no-sandbox', '--window-size=1280,720');

  const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

  try {
    await driver.get(baseUrl);

    const heroHeading = await driver.wait(until.elementLocated(By.css('h1')), 10000);
    const headingText = await heroHeading.getText();

    if (!headingText.toLowerCase().includes('gestão completa')) {
      throw new Error(`Texto inesperado no título principal: "${headingText}"`);
    }

    const ctaButton = await driver.wait(
      until.elementLocated(By.xpath("//a[contains(normalize-space(.), 'Cadastrar clínica')]")),
      5000
    );

    await driver.wait(until.elementIsVisible(ctaButton), 5000);
    await driver.wait(until.elementIsEnabled(ctaButton), 5000);

    await ctaButton.click();

    await driver.wait(until.urlContains('/registrar-clinica'), 5000);

    console.log('Teste Selenium concluído com sucesso.');
  } finally {
    await driver.quit();
  }
}

run().catch((error) => {
  console.error('Falha ao executar teste Selenium:', error);
  process.exitCode = 1;
});

