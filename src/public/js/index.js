// views/layouts/main.ejs

import { createTable, updateTable } from './components/table.js';

const appContainer = document.getElementById('app');
const deviceTokenContainer = document.getElementById('device_token_card');

const deviceTokenTable = createTable({
  header: ['Id', 'Token', 'Issued At', 'Last Used', 'Revoked At'],
  data: [
    [1, 'ghjkfds;', 'a', 'a', 'a'],
    [2, 'ghjkfds;', 'a', 'a', 'a'],
    [3, 'ghjkfds;', 'a', 'a', 'a'],
  ],
});
console.log(deviceTokenTable);

deviceTokenContainer.appendChild(deviceTokenTable);