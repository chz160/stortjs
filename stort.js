/**
 * StortJs v1.0.0
 * Super simple stupid html table sorting library.
 * Provides table sorting functionality for string, numeric, and date columns.
 * Supports tables with multiple headers and custom sort directions.
 * 
 * @license MIT
 * (c) 2024 Noah Porch
 * Repository: https://github.com/chz160/stortjs
 */
(function() {
  // Constants to define ascending and descending sort directions.
  const ASC = 'asc';
  const DESC = 'desc';

  // Object to hold the sorting directions for each column, indexed by column number.
  const sortDirections = {};

  // Initializes sorting functionality once the DOM is fully loaded.
  document.addEventListener('DOMContentLoaded', () => {
    // Select all tables marked with the 'sortable' class.
    const tables = document.querySelectorAll(".sortable");

    tables.forEach((table, tableIndex) => {
      // Ensure each table has a unique data attribute incase there are multiple sortable tables on the page.
      if (!table.hasAttribute('data-sortable-id')) {
          table.setAttribute('data-sortable-id', `sortable-table-${tableIndex}`);
      }
      const tableId = table.getAttribute('data-sortable-id');

      // Determine if specific columns are marked as sortable.
      const hasSortableColumns = table.querySelectorAll("th.sortable-column").length > 0;

      // Select headers to attach click events to. If specific columns are marked as sortable, select only those.
      const headersSelector = hasSortableColumns ? "th.sortable-column" : "th:not(:empty)";
      const headers = table.querySelectorAll(headersSelector);

      headers.forEach((header, columnIndex) => {
        header.addEventListener('click', () => {
          const key = `${tableId}-column-${columnIndex}`;
          // Toggle the sort direction for the clicked column.
          sortDirections[key] = sortDirections[key] === ASC ? DESC : ASC;

          // Sort the table based on the clicked column and direction.
          sortTable(table, columnIndex, sortDirections[key]);

          // Update the sort indicators on the column headers.
          updateSortIndicator(headers, columnIndex, sortDirections[key]);
        });

        // Change the cursor to a pointer on hover to indicate the column is sortable.
        header.style.cursor = 'pointer';
      });
    });
  });

   /**
   * Performs the sorting of table rows based on the selected column and direction.
   * @param {HTMLElement} table - The table to be sorted.
   * @param {number} column - The index of the column based on which sorting is to be performed.
   * @param {string} dir - The direction of sorting ('asc' or 'desc').
   */
  function sortTable(table, column, dir) {
    // Select the table body or the whole table if no tbody is present.
    const tbody = table.tBodies[0] || table;
    // Convert the rows to an array for easier manipulation.
    const rows = Array.from(tbody.rows);
    // Find the index of the first data row by skipping header rows that contain <th> elements.
    const dataIndex = rows.findIndex(row => !row.querySelector('th'));
    // Exclude header rows from the sort.
    const dataRows = rows.slice(dataIndex);

    // Checks if the column contains date values by sampling rows with non-empty cells.
    function checkColumnForDates(dataRows, column) {
      const rowsWithValue = dataRows.filter(row => row.cells[column].textContent.trim() !== '');
      const sampleSize = Math.min(rowsWithValue.length, Math.max(10, Math.round(rowsWithValue.length * 0.1)));
      const dateSample = rowsWithValue.slice(0, sampleSize).map(row => row.cells[column].textContent.trim());
      return dateSample.every(sample => (sample.contains("/") || sample.contains("-") || sample.contains(":")) && !isNaN(Date.parse(sample)));
    }

    // parseFloat is kind of a dummy and can't handle , in string numbers so we need to clean it up first.
    // We also need to remove % from the string in the case of percentages.
    function cleanAndParseFloat(value) {
      return value ? parseFloat(value.replace(',', '').replace('%', '').trim()) : 0;
    }

    // Checks if the column contains numeric values by considering all non-empty cells.
    function checkColumnForNumbers(dataRows, column) {
      const rowsWithValue = dataRows.filter(row => row.cells[column].textContent.trim() !== '');
      return rowsWithValue.every(row => !isNaN(cleanAndParseFloat(row.cells[column].textContent)));
    }

    const isDateColumn = checkColumnForDates(dataRows, column);
    const isNumericColumn = !isDateColumn && checkColumnForNumbers(dataRows, column);

    // Sorts the data rows based on the column's data type and the specified direction.
    dataRows.sort((a, b) => {
      const cellA = a.cells[column].textContent.trim();
      const cellB = b.cells[column].textContent.trim();

      let x, y;
      if (isDateColumn) {
        x = cellA ? new Date(cellA).getTime() : new Date('01/01/1970').getTime(); // Uses a default date for empty cells.
        y = cellB ? new Date(cellB).getTime() : new Date('01/01/1970').getTime();
      } else if (isNumericColumn) {
        x = cleanAndParseFloat(cellA); // Parses numeric values, treating empty cells as 0.
        y = cleanAndParseFloat(cellB);
      } else {
        x = cellA.toLowerCase(); // Compares string values case-insensitively.
        y = cellB.toLowerCase();
      }

      return (x < y ? -1 : (x > y ? 1 : 0)) * (dir === ASC ? 1 : -1);
    });

    // Re-append the sorted rows to the tbody or table.
    dataRows.forEach((row) => tbody.appendChild(row));
  }

  /**
   * Updates the sort indicators on the column headers to reflect the current sort direction.
   * @param {NodeList} headers - The headers of the table.
   * @param {number} column - The index of the currently sorted column.
   * @param {string} direction - The direction of sorting ('asc' or 'desc').
   */
  function updateSortIndicator(headers, column, direction) {
    // Clear existing indicators from all headers.
    headers.forEach((header) => header.innerHTML = header.innerHTML.replace(/ \u25B2| \u25BC/g, ""));

    // Add the sort indicator to the currently sorted column.
    if (headers[column].textContent.trim() !== '') {
      const indicator = direction === ASC ? "\u25B2" : "\u25BC";
      headers[column].innerHTML += " " + indicator;
    }
  }
})();