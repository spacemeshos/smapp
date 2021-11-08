const { ipcRenderer } = require('electron');

let promptId = null;
let promptOptions = null;

function promptError(error) {
  ipcRenderer.sendSync(`prompt-error:${promptId}`, error.message);
}

function promptCancel() {
  ipcRenderer.sendSync(`prompt-post-data:${promptId}`, null);
}

function promptSubmit() {
  const dataElement = document.querySelector('#data');
  let data = null;

  if (promptOptions.type === 'input') {
    data = dataElement.value;
  } else if (promptOptions.type === 'select') {
    if (promptOptions.selectMultiple) {
      data = dataElement.querySelectorAll('option[selected]').map((o) => o.getAttribute('value'));
    } else {
      data = dataElement.value;
    }
  }

  ipcRenderer.sendSync(`prompt-post-data:${promptId}`, data);
}

function promptCreateInput() {
  const dataElement = document.createElement('input');
  dataElement.setAttribute('type', 'text');

  if (promptOptions.value) {
    dataElement.value = promptOptions.value;
  } else {
    dataElement.value = '';
  }

  if (promptOptions.inputAttrs && typeof promptOptions.inputAttrs === 'object') {
    // eslint-disable-next-line
    for (const [k, v] of Object.entries(promptOptions.inputAttrs)) {
      dataElement.setAttribute(k, v);
    }
  }

  dataElement.addEventListener('keyup', (event) => {
    if (event.key === 'Escape') {
      promptCancel();
    }
  });

  dataElement.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      document.querySelector('#ok').click();
    }
  });

  return dataElement;
}

function promptCreateSelect() {
  const dataElement = document.createElement('select');
  let optionElement;

  // eslint-disable-next-line
  for (const [k, v] of Object.entries(promptOptions.selectOptions)) {
    optionElement = document.createElement('option');
    optionElement.setAttribute('value', k);
    optionElement.textContent = v;
    if (k === promptOptions.value) {
      optionElement.setAttribute('selected', 'selected');
    }

    dataElement.append(optionElement);
  }

  return dataElement;
}

function promptRegister() {
  promptId = document.location.hash.replace('#', '');

  try {
    promptOptions = JSON.parse(ipcRenderer.sendSync(`prompt-get-options:${promptId}`));
  } catch (error) {
    promptError(error);
    return;
  }

  if (promptOptions.useHtmlLabel) {
    document.querySelector('#label').innerHTML = promptOptions.label;
  } else {
    document.querySelector('#label').textContent = promptOptions.label;
  }

  if (promptOptions.buttonLabels && promptOptions.buttonLabels.ok) {
    document.querySelector('#ok').textContent = promptOptions.buttonLabels.ok;
  }

  if (promptOptions.buttonLabels && promptOptions.buttonLabels.cancel) {
    document.querySelector('#cancel').textContent = promptOptions.buttonLabels.cancel;
  }

  try {
    if (promptOptions.styles) {
      const customStyle = document.createElement('style');
      customStyle.setAttribute('rel', 'stylesheet');
      customStyle.append(document.createTextNode(promptOptions.styles));
      document.head.append(customStyle);
    }
  } catch (error) {
    promptError(error);
    return;
  }

  document.querySelector('#form').addEventListener('submit', promptSubmit);
  document.querySelector('#cancel').addEventListener('click', promptCancel);

  const dataContainerElement = document.querySelector('#data-container');

  let dataElement;
  if (promptOptions.type === 'input') {
    dataElement = promptCreateInput();
  } else if (promptOptions.type === 'select') {
    dataElement = promptCreateSelect();
  } else {
    promptError(`Unhandled input type '${promptOptions.type}'`);
    return;
  }

  dataContainerElement.append(dataElement);
  dataElement.setAttribute('id', 'data');

  dataElement.focus();
  if (promptOptions.type === 'input') {
    dataElement.select();
  }
}

window.addEventListener('error', (error) => {
  if (promptId) {
    promptError(`An error has occured on the prompt window: \n${error}`);
  }
});

document.addEventListener('DOMContentLoaded', promptRegister);
