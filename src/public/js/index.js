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
 * @param {string} id
 * @returns {HTMLDivElement}
 */
function getDivById(id) {
  const el = document.getElementById(id);
  if (el instanceof HTMLDivElement) {
    return el;
  } else if (el != null) {
    throw Error(`Element with id '${id}' is of type ${el.constructor.name}.`);
  } else {
    throw Error(`Element with id '${id}' does not exist.`);
  }
}

const appContainer = getDivById('app');
const deviceTokenContainer = getDivById('device_token_card');
const enrollCodeContainer = getDivById('enroll_code_card');

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
