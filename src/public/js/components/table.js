const propMap = {
  class: 'className',
};

/**
 * Create a table component
 * @param table Data about the table
 * @param {string[]} table.header Headers of the table
 * @param {string[][]} [table.data] Data rows for the table
 *
 * @return {string} table
 */
function createTable(table) {
  const tableDiv = document.createElement('table');
  tableDiv.classList.toggle("fixed", table.fixed == true)
  if (table.colgroup) {
    const colgroup = document.createElement('colgroup');
    tableDiv.appendChild(colgroup);
    let totalSpan = 0;
    for (let colData of table.colgroup) {
      let span = 1;
      const col = document.createElement('col');
      colgroup.appendChild(col);
      
      for (let property in colData) {
        col[propMap[property] || property] = colData[property];
        if (property == "span") {
          span = Number(colData[property])
        }
      }
      totalSpan += span;
    }
    for (let i = totalSpan; i < table.header.length; i++) {
      const col = document.createElement('col');
      colgroup.appendChild(col);
    }
  }
  {
    const thead = document.createElement('thead');
    tableDiv.appendChild(thead);
    const tRow = document.createElement('tr');
    thead.appendChild(tRow);
    for (let header of table.header) {
      const tHeader = document.createElement('th');
      tRow.appendChild(tHeader);

      tHeader.innerText = header;
    }
  }
  {
    const tbody = document.createElement('tbody');
    tableDiv.appendChild(tbody);
  }
  if (table.data) {
    updateTable(tableDiv, table.data);
  }

  return tableDiv;
}

/**
 * Update an already created table with new data
 * @param {HTMLDivElement} tableDiv The table to update
 * @param {"table"} tableDiv.component
 * @param {string[][]} data The data to put into the table
 */
function updateTable(tableDiv, data) {
  if (!(tableDiv instanceof HTMLTableElement)) {
    throw Error('Invalid table element');
  }
  if (tableDiv.tBodies.length == 0) {
    const tBody = document.createElement('tbody');
    tableDiv.appendChild(tBody);
  }

  const tBody = tableDiv.tBodies[0];
  for (let row of data) {
    const tRow = document.createElement('tr');
    tBody.appendChild(tRow);
    for (let cell of row) {
      const tData = document.createElement('td');
      tRow.appendChild(tData);
      tData.innerText = cell;
    }
  }
}

export { createTable, updateTable };
