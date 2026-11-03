// views/layouts/main.ejs

/**
 * Create a table component
 * @param table Data about the table
 * @param {string[]} table.header Headers of the table
 * @param {string[][]} table.data Data rows for the table
 *
 */
function createTable(table) {
  const header = table.header;
  const rows = table.data;
  rows.forEach((row, i) => {
    if (header.length != row.length) {
      throw Error(
        `Rows must be the same length as the header (row ${i}: expected ${header.length}, got ${row.length}`,
      );
    }
  });

  // Conversion
  const columns = header.map((head) => [head]);
  rows.forEach((row) => {
    row.forEach((cell, x) => {
      columns[x].push(cell);
    });
  });

  // Table creation
  const tableDiv = document.createElement('div');
  tableDiv.classList.add('table');
  for (let x = 0; x < columns.length; x++) {
    const column = columns[x];
    const columnDiv = document.createElement('div');
    tableDiv.appendChild(columnDiv);
    columnDiv.classList.add('column');
    for (let y = 0; y < column.length; y++) {
        const cellSpan = document.createElement("span");
        columnDiv.appendChild(cellSpan)
        cellSpan.classList.add("cell");
        cellSpan.innerText = column[y].toString()
    }
  }

  return tableDiv
}

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