// views/layouts/main.ejs

import {
  createCallbackButton,
  createTable,
  updateTable,
} from './components/table.js';
import { device_token, enroll_code } from './api.js';

const appContainer = document.getElementById('app');
const deviceTokenContainer = document.getElementById('device_token_card');
const enrollCodeContainer = document.getElementById('enroll_code_card');

// #region device tokens
const refreshDeviceTokenTableButton = createCallbackButton(
  'Refresh',
  '',
  updateDeviceTokenTable,
);
const deviceTokenTable = createTable({
  header: [
    'Id',
    'Token',
    'Issued At',
    'Last Used',
    'Revoked At',
    refreshDeviceTokenTableButton,
  ],
  fixed: true,
  colgroup: [
    { style: 'width:5%;' },
    {},
    { style: 'width:20%;' },
    { style: 'width:20%;' },
    { style: 'width:20%;' },
    { style: 'width:8.5%' },
  ],
});
deviceTokenContainer.appendChild(deviceTokenTable);

async function updateDeviceTokenTable() {
  const res = await fetch('/api/admin/device_token');
  if (!res.ok) {
    console.error(
      'Could not update device token table:',
      res.status,
      res.statusText,
    );
    return;
  }
  const body = await res.json();
  const data = body.data;

  const rows = data.map((token) => [
    token.id,
    token.token,
    new Date(token.issuedAt * 1000).toLocaleString(),
    new Date(token.lastUsed * 1000).toLocaleString(),
    token.revokedAt
      ? new Date(token.revokedAt * 1000).toLocaleString()
      : 'Valid',
    createCallbackButton(
      'Revoke',
      token.revokedAt ? '!disabled' : 'action-danger',
      async () => {
        await device_token.revoke(token.id);
        updateDeviceTokenTable();
      },
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
    'Id',
    'Code',
    'Remaining Uses',
    'Issued At',
    'Valid Until',
    refreshEnrollCodeTableButton,
  ],
  fixed: true,
  colgroup: [
    { style: 'width:5%;' },
    {},
    { style: 'width:16%;' },
    { style: 'width:20%;' },
    { style: 'width:20%;' },
    { style: 'width:8.5%' },
  ],
});
enrollCodeContainer.appendChild(enrollCodeTable);

async function updateEnrollCodeTable() {
  const res = await fetch('/api/admin/enroll_code');
  if (!res.ok) {
    console.error(
      'Could not update enroll code table:',
      res.status,
      res.statusText,
    );
    return;
  }
  const body = await res.json();
  const data = body.data;

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
