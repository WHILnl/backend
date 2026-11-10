//@ts-check
// views/layouts/main.ejs

import {
  createCallbackButton,
  createCallbackButtons,
  createTable,
  updateTable,
} from './components/table.js';
import { device_token, enroll_code } from './api.js';

/**
 * @template {HTMLElement} T
 * @param {string} id
 * @param {new (...args: any[]) => T} type
 * @returns {T}
 */
function getElementById(id, type) {
  const el = document.getElementById(id);
  if (el instanceof type) {
    return el;
  } else if (el != null) {
    throw Error(`Element with id '${id}' is of type ${el.constructor.name}.`);
  } else {
    throw Error(`Element with id '${id}' does not exist.`);
  }
}

const appContainer = getElementById('app', HTMLDivElement);
const deviceTokenContainer = getElementById(
  'device_token_card',
  HTMLDivElement,
);
const enrollCodeContainer = getElementById('enroll_code_card', HTMLDivElement);

// #region device tokens
const refreshDeviceTokenTableButton = createCallbackButton(
  'Refresh',
  '',
  updateDeviceTokenTable,
);
const deviceTokenTable = createTable({
  header: [
    { value: 'Id', width: 4 },
    { value: 'Token' },
    { value: 'Issued At', width: 12.5, mobile: false },
    { value: 'Last Used', width: 12.5, mobile: false },
    { value: 'Revoked At', width: 12.5, mobile: false },
    { value: refreshDeviceTokenTableButton, width: 10 },
  ],
});

deviceTokenContainer.appendChild(deviceTokenTable);

async function updateDeviceTokenTable() {
  const data = await device_token.getAll();
  if (!data) {
    return;
  }

  const rows = data.map((token) => [
    token.id,
    token.token,
    new Date(token.issuedAt * 1000).toLocaleString(),
    new Date(token.lastUsed * 1000).toLocaleString(),
    token.revokedAt
      ? new Date(token.revokedAt * 1000).toLocaleString()
      : 'Valid',
    createCallbackButtons(
      [
        'Revoke',
        token.revokedAt ? '!disabled' : 'action-danger',
        async () => {
          await device_token.revoke(token.id);
          updateDeviceTokenTable();
        },
      ],
      [
        'Delete',
        'action-danger',
        async () => {
          await device_token.delete(token.id);
          updateDeviceTokenTable();
        },
      ],
    ),
  ]);

  updateTable(deviceTokenTable, rows);
}
// #endregion

// #region Enroll codes
const refreshEnrollCodeTableButton = createCallbackButton(
  'Refresh',
  '',
  updateEnrollCodeTable,
);
const enrollCodeTable = createTable({
  header: [
    { value: 'Id', width: 4 },
    { value: 'Code' },
    { value: 'Remaining Uses' },
    { value: 'Issued At', width: 12.5 },
    { value: 'Valid Until', width: 12.5 },
    { value: refreshEnrollCodeTableButton, width: 5.75 },
  ],
});
enrollCodeContainer.appendChild(enrollCodeTable);

async function updateEnrollCodeTable() {
  const data = await enroll_code.getAll();
  if (!data) {
    return;
  }

  const rows = data.map((token) => [
    token.id,
    token.code,
    token.usesRemaining >= 0 ? token.usesRemaining : 'Unlimited',
    new Date(token.issuedAt * 1000).toLocaleString(),
    new Date(token.validUntil * 1000).toLocaleString(),
    createCallbackButton('Delete', 'action-danger', async () => {
      await enroll_code.delete(token.id);
      updateEnrollCodeTable();
    }),
  ]);

  updateTable(enrollCodeTable, rows);
}
// #endregion

updateDeviceTokenTable();
updateEnrollCodeTable();

// #region Enroll code creation form
const durationInput = getElementById(
  'enroll_code_uses_input',
  HTMLInputElement,
);

durationInput?.addEventListener('focus', (e) => {
  const t = /** @type {HTMLInputElement} */ (e.target);
  // @ts-ignore
  if (isNaN(t.value)) {
    t.type = 'number';
    t.value = "0";
  } else {
    t.type = 'number';
  }
});
durationInput?.addEventListener('blur', (e) => {
  const t = /**@type{HTMLInputElement}*/ (e.target);
  // @ts-ignore
  if (t.value == 0 || isNaN(t.value)) {
    t.type = 'text';
    t.value = 'Infinite';
  }
});
