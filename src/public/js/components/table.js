//@ts-check

/**
 * Create a button that calls a callback when clicked
 * @param {string} inner Text on the button
 * @param {string} className Space separated string of classes to assign to the button
 * @param {EventListenerOrEventListenerObject} callback On click callback
 */
function _createCallbackButton(inner, className, callback) {
  const el = document.createElement('button');

  el.innerText = inner;

  if (className[0] == '!') {
    switch (className.substring(1)) {
      case 'disabled':
        el.disabled = true;
        break;

      default:
        console.warn(
          `Ignoring unknown button property '${className.substring(1)}'`,
        );
        break;
    }
  } else {
    el.className = className;
  }

  el.addEventListener('click', callback);

  return el;
}
/**
 * Create a button that calls a callback when clicked
 * @param {...[inner:string,className: string,callback:EventListenerOrEventListenerObject]} buttons
 */
function createCallbackButtons(...buttons) {
  const spanEl = document.createElement('span');
  spanEl.classList.add('button-container');

  for (const [inner, className, callback] of buttons) {
    const el = _createCallbackButton(inner, className, callback);
    el.classList.add('self-align-right');
    spanEl.appendChild(el);
  }

  return spanEl;
}
/**
 * Create a button that calls a callback when clicked
 * @param {string} inner Text on the button
 * @param {string} className Space separated string of classes to assign to the button
 * @param {EventListenerOrEventListenerObject} callback On click callback
 */
function createCallbackButton(inner, className, callback) {
  return createCallbackButtons([inner, className, callback]);
}

/**
 * @typedef TableHeader
 * @prop {string|HTMLElement} value Value of the header cell. Can be a string or any HTMLElement.
 * @prop {number|string} [width] Width of the <col>. If a number is provided `em` unit is used by default.
 * @prop {boolean} [mobile=true] Display collumn on mobile
 * @prop {string} [colStyle] Additional styling for the <col>
 * 
 * @typedef {(string|number|HTMLElement)[]} TableData

 * 
 * @typedef TableObject
 * @prop {TableHeader[]} header Headers of the table
 * @prop {TableData[]} [data] Data rows for the table
 */

/**
 * Create a table component
 * @overload
 * @param {TableObject} table Data about the table
 * @return {HTMLDivElement} The wrapper element that was provided, will not be a div if no div was provided
 */
/**
 * Create a table component
 * @overload
 * @param {TableObject} table Data about the table
 * @param {HTMLElement} [container] Element to be turned into a wrapper
 * @return {HTMLElement} The wrapper element that was provided, will not be a div if no div was provided
 */
/**
 * @param {TableObject} table Data about the table
 * @param {HTMLElement} [container] Element to be turned into a wrapper
 * @return {HTMLElement} The wrapper element that was provided, will not be a div if no div was provided
 */
function createTable(table, container) {
  const wrapperDiv = container ?? document.createElement('div');
  wrapperDiv.classList.add('table-wrapper');

  const tableDiv = document.createElement('table');
  tableDiv.classList.add('fixed');
  wrapperDiv.appendChild(tableDiv);

  const colgroup = document.createElement('colgroup');
  tableDiv.appendChild(colgroup);

  const thead = document.createElement('thead');
  tableDiv.appendChild(thead);
  const tRow = document.createElement('tr');
  thead.appendChild(tRow);

  for (let header of table.header) {
    const col = document.createElement('col');
    colgroup.appendChild(col);
    if (header.width && typeof header.width == 'number') {
      col.style = `width: ${header.width}em;`;
    } else if (header.width) {
      col.style = `wdith: ${header.width};`;
    }
    if (header.colStyle) {
      col.style += header.colStyle;
    }

    const tHeader = document.createElement('th');
    tRow.appendChild(tHeader);
    if (header.value instanceof HTMLElement) {
      tHeader.replaceChildren(header.value);
    } else {
      tHeader.innerText = header.value;
    }
  }

  const tbody = document.createElement('tbody');
  tableDiv.appendChild(tbody);

  if (table.data) {
    updateTable(wrapperDiv, table.data);
  }

  return wrapperDiv;
}

/**
 * Update an already created table with new data
 * @param {HTMLElement} wrapperDiv The table to update
 * @param {TableData[]} data The data to put into the table
 */
function updateTable(wrapperDiv, data) {
  if (!(
    wrapperDiv.childElementCount == 1 &&
    wrapperDiv.children[0] instanceof HTMLTableElement
  )) {
    throw Error('Invalid table component');
  }
  const tableDiv = wrapperDiv.children[0];

  if (tableDiv.tBodies.length == 0) {
    const tBody = document.createElement('tbody');
    tableDiv.appendChild(tBody);
  }

  const tBody = tableDiv.tBodies[0];
  tBody.innerHTML = '';
  for (let row of data) {
    const tRow = document.createElement('tr');
    tBody.appendChild(tRow);
    for (let cell of row) {
      const tData = document.createElement('td');
      tRow.appendChild(tData);
      if (cell instanceof HTMLElement) {
        tData.replaceChildren(cell);
      } else {
        // @ts-ignore
        tData.innerText = cell;
      }
    }
  }
}

export { createCallbackButton, createCallbackButtons, createTable, updateTable };
