import { Builder, By, Key, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

function generateCPF() {
  const numbers = Array.from({ length: 9 }, () => Math.floor(Math.random() * 9));
  const d1 =
    numbers.reduce((acc, value, index) => acc + value * (10 - index), 0) % 11;
  const digit1 = d1 < 2 ? 0 : 11 - d1;
  const d2 =
    [...numbers, digit1].reduce((acc, value, index) => acc + value * (11 - index), 0) % 11;
  const digit2 = d2 < 2 ? 0 : 11 - d2;
  return [...numbers, digit1, digit2].join('');
}

function generateCNPJ() {
  const numbers = Array.from({ length: 12 }, (_, index) => {
    if (index >= 8 && index <= 10) {
      return 0;
    }
    if (index === 11) {
      return 1;
    }
    return Math.floor(Math.random() * 9);
  });

  const weight1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const sum1 = numbers.reduce((acc, num, idx) => acc + num * weight1[idx], 0);
  const digit1 = sum1 % 11 < 2 ? 0 : 11 - (sum1 % 11);

  const weight2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const sum2 = [...numbers, digit1].reduce(
    (acc, num, idx) => acc + num * weight2[idx],
    0
  );
  const digit2 = sum2 % 11 < 2 ? 0 : 11 - (sum2 % 11);

  return [...numbers, digit1, digit2].join('');
}

async function fillInputByLabel(driver, labelText, value, timeout = 20000) {
  const label = await driver.findElement(
    By.xpath(`//label[contains(normalize-space(.), "${labelText}")]`)
  );
  const fieldId = await label.getAttribute('for');
  let target;
  if (fieldId) {
    const wrapper = await driver.findElement(By.id(fieldId));
    try {
      target = await wrapper.findElement(By.tagName('input'));
    } catch (err) {
      target = wrapper;
    }
  } else {
    target = await label.findElement(By.xpath('following::input[1] | following::textarea[1]'));
  }
  await driver.wait(until.elementIsVisible(target), timeout);
  const inputType = (await target.getAttribute('type')) ?? '';
  if (inputType === 'date') {
    await driver.executeScript(
      `const element = arguments[0];
       const inputValue = arguments[1];
       const { value: currentValue } = element;
       if (currentValue !== inputValue) {
         const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
         setter.call(element, inputValue);
         element.dispatchEvent(new Event('input', { bubbles: true }));
         element.dispatchEvent(new Event('change', { bubbles: true }));
       }
       element.dispatchEvent(new Event('blur', { bubbles: true }));`,
      target,
      value
    );
    await driver.sleep(200);
  } else if (inputType === 'datetime-local') {
    await driver.executeScript('arguments[0].focus();', target);
    await driver.sleep(150);

    let calendarButton;
    try {
      calendarButton = await target.findElement(By.xpath("following-sibling::button[contains(@aria-label, 'calendário') or contains(@class, 'mantine-DatePickerInput-calendarButton')]"));
    } catch (err) {
      calendarButton = null;
    }

    if (calendarButton) {
      await calendarButton.click();
      await driver.wait(
        until.elementLocated(By.xpath("//table//td/button[not(@disabled)]")),
        timeout
      );
      const [year, month, day] = value.split('-');
      const dayButton = await driver.findElement(
        By.xpath(`//table//td/button[normalize-space(.)='${parseInt(day, 10)}']`)
      );
      await dayButton.click();
    } else {
      await target.sendKeys(Key.chord(Key.CONTROL, 'a'));
      await target.sendKeys(value);
      await target.sendKeys(Key.ENTER);
    }

    await driver.executeScript('arguments[0].dispatchEvent(new Event("input", { bubbles: true }));', target);
    await driver.executeScript('arguments[0].dispatchEvent(new Event("change", { bubbles: true }));', target);
    await driver.executeScript('arguments[0].dispatchEvent(new Event("blur", { bubbles: true }));', target);
    await driver.sleep(200);
  } else if (inputType === 'time') {
    await target.sendKeys(Key.chord(Key.CONTROL, 'a'));
    await target.sendKeys(value);
    await target.sendKeys(Key.ENTER);
  } else {
    await target.clear();
    await target.sendKeys(value);
  }
}

async function fillTextareaByLabel(driver, labelText, value, timeout = 20000) {
  const label = await driver.findElement(
    By.xpath(`//label[contains(normalize-space(.), "${labelText}")]`)
  );
  const textarea = await label.findElement(By.xpath('following::textarea[1]'));
  await driver.wait(until.elementIsVisible(textarea), timeout);
  await textarea.clear();
  await textarea.sendKeys(value);
}

async function selectComboboxOption(driver, labelText, optionText, timeout = 20000) {
  const label = await driver.findElement(
    By.xpath(`//label[contains(normalize-space(.), "${labelText}")]`)
  );
  const input = await label.findElement(By.xpath('following::input[1]'));
  await driver.executeScript('arguments[0].focus();', input);
  await input.click();
  await driver.sleep(150);
  await input.sendKeys(Key.chord(Key.CONTROL, 'a'));
  await input.sendKeys(optionText);
  await driver.sleep(300);

  const dropdownId = await input.getAttribute('aria-controls');

  let dropdown;
  try {
    if (dropdownId) {
      dropdown = await driver.wait(
        until.elementLocated(By.id(dropdownId)),
        timeout
      );
    } else {
      dropdown = await driver.wait(
        until.elementLocated(By.xpath("//div[@data-combobox-dropdown]")),
        timeout
      );
    }
  } catch (err) {
    await driver.sleep(300);
    dropdown = await driver.wait(
      until.elementLocated(By.xpath("//div[@role='presentation' and descendant::div[@data-combobox-option]]")),
      timeout
    );
  }

  await driver.sleep(400);

  let desiredOption = null;
  const start = Date.now();
  while (!desiredOption && Date.now() - start < timeout) {
    const optionsRoot = dropdown ?? await driver.wait(
      until.elementLocated(By.xpath("//div[@role='presentation' and descendant::div[@data-combobox-option]]")),
      timeout
    );

    const allOptions = await optionsRoot.findElements(By.xpath(".//div[@data-combobox-option]"));

    for (const optionElement of allOptions) {
      const text = (await optionElement.getText()).trim();
      if (text === optionText || text.startsWith(optionText)) {
        desiredOption = optionElement;
        break;
      }
    }

    if (!desiredOption) {
      await driver.sleep(300);
      await input.sendKeys(Key.chord(Key.CONTROL, 'a'));
      await input.sendKeys(optionText);
      await driver.sleep(300);
    }
  }

  if (!desiredOption) {
    throw new Error(`Opção "${optionText}" não encontrada no combobox "${labelText}".`);
  }

  await driver.executeScript(
    'arguments[0].scrollIntoView({ block: "center", inline: "center" });',
    desiredOption
  );
  await driver.wait(until.elementIsVisible(desiredOption), timeout);
  await driver.executeScript('arguments[0].click();', desiredOption);
  await driver.sleep(200);
  await driver.executeScript('arguments[0].dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));', input);
  await driver.wait(
    async () => {
      const dropdownVisible = await driver.findElements(By.xpath("//div[@data-combobox-dropdown]"));
      if (dropdownVisible.length === 0) {
        return true;
      }
      const expanded = await input.getAttribute('aria-expanded');
      return expanded === 'false';
    },
    timeout
  ).catch(async () => {
    await driver.executeScript('arguments[0].dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));', input);
  });
  await driver.sleep(200);
}

async function clickLinkSequential(driver, labels, timeout = 20000) {
  const links = Array.isArray(labels) ? labels : [labels];
  for (const label of links) {
    const element = await driver.wait(
      until.elementLocated(
        By.xpath(
          `//*[self::a or self::button][contains(@class, 'mantine-NavLink-root')][.//span[normalize-space(.)="${label}"]]`
        )
      ),
      timeout
    );
    await driver.executeScript(
      'arguments[0].scrollIntoView({ block: "center", inline: "nearest" });',
      element
    );
    await driver.wait(until.elementIsVisible(element), timeout);
    await driver.wait(until.elementIsEnabled(element), timeout);
    await driver.executeScript('arguments[0].click();', element);
    await driver.sleep(400);
  }
}

async function waitForToastMessage(driver, messageSubstring, timeout = 20000) {
  await driver.wait(
    until.elementLocated(
      By.xpath(`//*[contains(normalize-space(.), "${messageSubstring}")]`)
    ),
    timeout
  );
}

async function clickActionIconTrashForRow(driver, textIdentifier) {
  const row = await driver.wait(
    until.elementLocated(
      By.xpath(
        `//tr[.//*[contains(normalize-space(.), "${textIdentifier}")]]`
      )
    ),
    15000
  );
  await driver.sleep(200);
  await driver.executeScript(
    'arguments[0].scrollIntoView({ block: "center", inline: "nearest" });',
    row
  );
  const actionButtons = await row.findElements(
    By.xpath('.//button[contains(@class,"mantine-ActionIcon-root")]')
  );
  const trashButton = actionButtons.at(-1);
  if (!trashButton) {
    throw new Error(`ActionIcon trash não encontrado para "${textIdentifier}".`);
  }
  await driver.wait(until.elementIsVisible(trashButton), 5000);
  await driver.wait(until.elementIsEnabled(trashButton), 5000);
  await driver.executeScript('arguments[0].click();', trashButton);
  const confirmButton = await driver.wait(
    until.elementLocated(By.xpath('//button[normalize-space(.)="Excluir"]')),
    10000
  );
  await confirmButton.click();
  await driver.wait(until.stalenessOf(row), 20000);
}

async function clickEditIconForRow(driver, textIdentifier) {
  const row = await driver.wait(
    until.elementLocated(
      By.xpath(
        `//tr[.//*[contains(normalize-space(.), "${textIdentifier}")]]`
      )
    ),
    20000
  );
  await driver.sleep(200);
  await driver.executeScript(
    'arguments[0].scrollIntoView({ block: "center", inline: "nearest" });',
    row
  );
  const editButtons = await row.findElements(
    By.xpath('.//button[contains(@class,"mantine-ActionIcon-root")]')
  );
  if (editButtons.length === 0) {
    throw new Error(`Nenhum ActionIcon encontrado para "${textIdentifier}".`);
  }
  const editButton = editButtons[0];
  await driver.wait(until.elementIsVisible(editButton), 5000);
  await driver.wait(until.elementIsEnabled(editButton), 5000);
  await driver.executeScript('arguments[0].click();', editButton);
}

async function run() {
  const baseUrl = process.env.AUVET_E2E_BASE_URL ?? 'http://localhost:5173';
  const options = new chrome.Options()
    .addArguments('--disable-gpu', '--no-sandbox', '--window-size=1440,900');

  const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

  const unique = Date.now();
  const admin = {
    cpf: generateCPF(),
    nome: `Admin QA ${unique}`,
    email: `admin.qa.${unique}@example.com`,
    senha: `SenhaQa!${unique}`,
    registro: `CRMV${unique.toString().slice(-5)}`,
  };
  const clinica = {
    cnpj: generateCNPJ(),
    nome: `Clinica QA ${unique}`,
    endereco: `Rua Teste ${unique}, Centro`,
    telefone: '61999999999',
    email: `clinica.qa.${unique}@example.com`,
  };
  const funcionario = {
    cpf: generateCPF(),
    nome: `Funcionario QA ${unique}`,
    email: `func.qa.${unique}@example.com`,
    senha: `SenhaQa!${unique + 1}`,
    registro: `REG${unique.toString().slice(-4)}`,
  };
  const tutor = {
    cpf: generateCPF(),
    nome: `Tutor QA ${unique}`,
    email: `tutor.qa.${unique}@example.com`,
    senha: `SenhaQa!${unique + 2}`,
    telefone: '61988887777',
    endereco: `Avenida Teste ${unique}`,
  };
  const animal = {
    nome: `Animal QA ${unique}`,
    especie: 'Cachorro',
    raca: 'SRD',
    tutorCpf: tutor.cpf,
  };
  const consulta = {
    data: '2025-12-15',
    hora: '10:30',
    motivo: 'Consulta de rotina',
    observacoes: 'Consulta gerada automaticamente no fluxo E2E',
  };
  const tutorUpdatedNome = `${tutor.nome} Ajustado`;
  const tutorUpdatedTelefone = '61977776666';
  const tutorUpdatedEndereco = `${tutor.endereco} Atualizado`;

  try {
    await driver.get(baseUrl);

    const ctaButton = await driver.wait(
      until.elementLocated(
        By.xpath("//a[contains(normalize-space(.), 'Cadastrar clínica')]")
      ),
      10000
    );
    await ctaButton.click();

    await driver.wait(until.urlContains('/registrar-clinica'), 10000);

    await fillInputByLabel(driver, 'CPF', admin.cpf);
    await fillInputByLabel(driver, 'Registro Profissional', admin.registro);
    await fillInputByLabel(driver, 'Nome', admin.nome);
    await fillInputByLabel(driver, 'Email', admin.email);
    await fillInputByLabel(driver, 'Senha', admin.senha);

    const nextButton = await driver.findElement(By.xpath("//button[normalize-space(.)='Próximo']"));
    await nextButton.click();

    await driver.wait(
      until.elementLocated(By.xpath("//label[contains(normalize-space(.), 'Nome da Clínica')]")),
      10000
    );

    await fillInputByLabel(driver, 'Nome da Clínica', clinica.nome);
    await fillInputByLabel(driver, 'CNPJ', clinica.cnpj);
    await fillInputByLabel(driver, 'Email Address', clinica.email);
    await fillInputByLabel(driver, 'Endereço', clinica.endereco);
    await fillInputByLabel(driver, 'Telefone', clinica.telefone);

    const submitClinic = await driver.findElement(
      By.xpath("//button[normalize-space(.)='Cadastrar Clínica']")
    );
    await submitClinic.click();

    await driver.wait(until.urlContains('/dashboard/admin'), 60000);

    await clickLinkSequential(driver, ['Gestão de Funcionários', 'Cadastrar funcionário'], 30000);
    await driver.wait(
      until.elementLocated(By.xpath("//h2[contains(normalize-space(.), 'Cadastrar Funcionário')]")),
      10000
    );

    await fillInputByLabel(driver, 'CPF', funcionario.cpf);
    await fillInputByLabel(driver, 'Nome', funcionario.nome);
    await fillInputByLabel(driver, 'Email', funcionario.email);
    await fillInputByLabel(driver, 'Senha', funcionario.senha);
    await selectComboboxOption(driver, 'Cargo', 'Médico Veterinário');
    const registroField = await driver.findElement(By.xpath("//label[contains(normalize-space(.), 'Registro Profissional')]/following::input[1]"));
    await driver.executeScript('arguments[0].focus();', registroField);
    await registroField.click();
    await registroField.clear();
    await registroField.sendKeys(funcionario.registro);

    const cadastrarFuncionario = await driver.findElement(
      By.xpath("//button[normalize-space(.)='Cadastrar']")
    );
    await cadastrarFuncionario.click();
    await waitForToastMessage(driver, 'Funcionário cadastrado', 30000);

    await clickLinkSequential(driver, ['Tutores', 'Cadastrar tutor'], 30000);
    await driver.wait(
      until.elementLocated(By.xpath("//h2[contains(normalize-space(.), 'Cadastrar Tutor')]")),
      10000
    );

    await fillInputByLabel(driver, 'CPF', tutor.cpf);
    await fillInputByLabel(driver, 'Nome', tutor.nome);
    await fillInputByLabel(driver, 'Email', tutor.email);
    await fillInputByLabel(driver, 'Senha', tutor.senha);
    await fillInputByLabel(driver, 'Telefone', tutor.telefone);
    await fillInputByLabel(driver, 'Endereço', tutor.endereco);

    const cadastrarTutor = await driver.findElement(
      By.xpath("//button[normalize-space(.)='Cadastrar']")
    );
    await cadastrarTutor.click();
    await waitForToastMessage(driver, 'Tutor cadastrado', 30000);

    await clickLinkSequential(driver, ['Animais', 'Cadastrar animal'], 30000);
    await driver.wait(
      until.elementLocated(By.xpath("//h2[contains(normalize-space(.), 'Cadastrar Animal')]")),
      10000
    );

    await fillInputByLabel(driver, 'Nome', animal.nome);
    await fillInputByLabel(driver, 'CPF do Tutor', animal.tutorCpf);
    await selectComboboxOption(driver, 'Espécie', animal.especie);
    await fillInputByLabel(driver, 'Raça', animal.raca);
    await selectComboboxOption(driver, 'Sexo', 'Macho');
    await fillInputByLabel(driver, 'Idade', '3');
    await fillInputByLabel(driver, 'Peso (kg)', '12');

    const cadastrarAnimal = await driver.findElement(
      By.xpath("//button[normalize-space(.)='Cadastrar']")
    );
    await cadastrarAnimal.click();
    await waitForToastMessage(driver, 'Animal cadastrado', 30000);

    await clickLinkSequential(driver, ['Consultas', 'Cadastrar consulta'], 30000);
    await driver.wait(
      until.elementLocated(By.xpath("//h2[contains(normalize-space(.), 'Cadastrar Consulta')]")),
      10000
    );

    await fillInputByLabel(driver, 'Data', "2025-12-15");
    const dataAfterFill = await driver.findElement(
      By.xpath("//label[contains(normalize-space(.), 'Data')]/following::input[1]")
    );
    const dataRawValue = await dataAfterFill.getAttribute('value');
    console.log('Valor final no campo Data:', dataRawValue);
    await fillInputByLabel(driver, 'Hora', consulta.hora);
    await selectComboboxOption(driver, 'Animal', animal.nome);
    await selectComboboxOption(driver, 'Funcionário', funcionario.nome);
    await fillInputByLabel(driver, 'Motivo', consulta.motivo);
    await selectComboboxOption(driver, 'Status', 'Agendada');
    await fillTextareaByLabel(driver, 'Observações', consulta.observacoes);

    const cadastrarConsulta = await driver.findElement(
      By.xpath("//button[normalize-space(.)='Cadastrar']")
    );
    await cadastrarConsulta.click();
    await driver.wait(
      until.elementLocated(
        By.xpath("//*[contains(normalize-space(.), 'Consulta cadastrada com sucesso')]")
      ),
      30000
    );

    await clickLinkSequential(driver, 'Lista de consultas', 30000);
    await driver.wait(
      until.elementLocated(By.xpath(`//tr[.//*[contains(normalize-space(.), "${consulta.motivo}")]]`)),
      20000
    );
    await driver.sleep(2000);
    await clickActionIconTrashForRow(driver, consulta.motivo);

    await clickLinkSequential(driver, 'Lista de funcionários', 30000);
    await driver.wait(
      until.elementLocated(By.xpath(`//tr[.//*[contains(normalize-space(.), "${funcionario.nome}")]]`)),
      20000
    );
    await driver.sleep(2000);

    await clickLinkSequential(driver, 'Lista de animais', 30000);
    await driver.wait(
      until.elementLocated(By.xpath(`//tr[.//*[contains(normalize-space(.), "${animal.nome}")]]`)),
      20000
    );
    await driver.sleep(2000);

    await clickLinkSequential(driver, 'Lista de tutores', 30000);
    await driver.wait(
      until.elementLocated(By.xpath("//h2[contains(normalize-space(.), 'Tutores')]")),
      10000
    );
    await driver.wait(
      until.elementLocated(By.xpath(`//tr[.//*[contains(normalize-space(.), "${tutor.nome}")]]`)),
      20000
    );
    await driver.sleep(2000);

    const logoutButton = await driver.findElement(By.xpath("//button[normalize-space(.)='Sair']"));
    await logoutButton.click();
    await driver.wait(until.urlContains('/login'), 20000);

    console.log('Fluxo completo executado com sucesso.');
  } finally {
    await driver.quit();
  }
}

run().catch((error) => {
  console.error('Falha ao executar fluxo completo:', error);
  process.exitCode = 1;
});

