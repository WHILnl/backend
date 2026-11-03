/**
 * Create a table component without rows
 * @param table Data about the table
 * @param {string[]} table.header Headers of the table
 *
 * @return {string} table
 */
function createEmptyTable(table) {
  const header = table.header;

  // Conversion
  const columns = header.map((head) => [head]);

  // Table creation
  const tableDiv = document.createElement('div');
  tableDiv.classList.add('table');
  tableDiv.component = 'table';
  tableDiv.header = header;

  for (let x = 0; x < columns.length; x++) {
    const column = columns[x];
    const columnDiv = document.createElement('div');
    tableDiv.appendChild(columnDiv);
    columnDiv.classList.add('column');

    const cellSpan = document.createElement('span');
    columnDiv.appendChild(cellSpan);
    cellSpan.classList.add('cell');
    cellSpan.innerText = column[0].toString();
  }

  return tableDiv;
}
/**
 * Create a table component with rows
 * @param table Data about the table
 * @param {string[]} table.header Headers of the table
 * @param {string[][]} table.data Data rows for the table
 *
 * @return {string} table
 */
function createFilledTable(table) {
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
  tableDiv.component = 'table';
  tableDiv.header = header;

  for (let x = 0; x < columns.length; x++) {
    const column = columns[x];
    const columnDiv = document.createElement('div');
    tableDiv.appendChild(columnDiv);
    columnDiv.classList.add('column');
    for (let y = 0; y < column.length; y++) {
      const cellSpan = document.createElement('span');
      columnDiv.appendChild(cellSpan);
      cellSpan.classList.add('cell');
      cellSpan.innerText = column[y].toString();
    }
  }

  return tableDiv;
}
/**
 * Create a table component
 * @param table Data about the table
 * @param {string[]} table.header Headers of the table
 * @param {string[][]} [table.data] Data rows for the table
 *
 * @return {string} table
 */
function createTable(table) {
  if (table.data == undefined) {
    return createEmptyTable(table);
  } else {
    return createFilledTable(table);
  }
}

/**
 * Update an already created table with new data
 * @param {HTMLDivElement} tableDiv The table to update
 * @param {"table"} tableDiv.component
 * @param {string[][]} data The data to put into the table
 */
function updateTable(tableDiv, data) {
  if (!(tableDiv instanceof HTMLDivElement) || tableDiv.component != 'table') {
    throw Error('Invalid table element');
  }

  // Conversion
  const columns = tableDiv.header.map((head) => [head]);
  data.forEach((row) => {
    row.forEach((cell, x) => {
      columns[x].push(cell);
    });
  });

  tableDiv.innerHTML = '';
  for (let x = 0; x < columns.length; x++) {
    const column = columns[x];
    const columnDiv = document.createElement('div');
    tableDiv.appendChild(columnDiv);
    columnDiv.classList.add('column');
    for (let y = 0; y < column.length; y++) {
      const cellSpan = document.createElement('span');
      columnDiv.appendChild(cellSpan);
      cellSpan.classList.add('cell');
      cellSpan.innerText = String(column[y]);
    }
  }
}

export { createTable, updateTable };
