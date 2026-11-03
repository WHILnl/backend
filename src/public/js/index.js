// views/layouts/main.ejs

import { createTable, updateTable } from './components/table.js';

const appContainer = document.getElementById('app');
const deviceTokenContainer = document.getElementById('device_token_card');

const deviceTokenTable = createTable({
  header: ['Id', 'Token', 'Issued At', 'Last Used', 'Revoked At'],
});
deviceTokenContainer.appendChild(deviceTokenTable);

async function updateDeviceTokenTable() {
  const res = await fetch('/api/admin/device_token');
  if (!res.ok) {
    console.error('Could not update device token table');
    return;
  }
  const body = await res.json();
  const data = body.data;
  const rows = data.map((token) => [
    token.id,
    token.token,
    new Date(token.issuedAt*1000).toLocaleString(),
    new Date(token.lastUsed*1000).toLocaleString(),
    token.revokedAt ? new Date(token.revokedAt*1000).toLocaleString() : "valid",
  ]);

  updateTable(deviceTokenTable, rows);
}

updateDeviceTokenTable();