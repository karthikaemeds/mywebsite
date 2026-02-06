export default async function decorate(block) {
  // Map dropdown value → sheet JSON
  const CONTINENT_SHEETS = {
  Asia: '/countries.json?sheet=asia',
  Europe: '/countries.json?sheet=europe',
  America: '/countries.json?sheet=america',
  Africa: '/countries.json?sheet=africa',
  Australia: '/countries.json?sheet=australia',
};


  // Clear authored content
  block.innerHTML = '';

  // ---------- DROPDOWN ----------
  const select = document.createElement('select');
  select.className = 'continent-filter';
  select.setAttribute('aria-label', 'Select continent');

  Object.keys(CONTINENT_SHEETS).forEach((continent) => {
    const option = document.createElement('option');
    option.value = continent;
    option.textContent = continent;
    select.appendChild(option);
  });

  // ---------- TABLE ----------
  const table = document.createElement('table');

  block.append(select, table);

  async function loadTable(url) {
    try {
      const resp = await fetch(url);
      const json = await resp.json();

      const rows = json?.data;
      const columns = json?.columns;

      if (!Array.isArray(rows) || !columns) return;

      table.innerHTML = '';

      // THEAD
      const thead = document.createElement('thead');
      const trHead = document.createElement('tr');

      columns.forEach((col) => {
        const th = document.createElement('th');
        th.textContent = col;
        th.scope = 'col';
        trHead.appendChild(th);
      });

      thead.appendChild(trHead);
      table.appendChild(thead);

      // TBODY
      const tbody = document.createElement('tbody');

      rows.forEach((row) => {
        const tr = document.createElement('tr');

        columns.forEach((key) => {
          const td = document.createElement('td');
          td.textContent = row[key] ?? '';
          tr.appendChild(td);
        });

        tbody.appendChild(tr);
      });

      table.appendChild(tbody);

    } catch (e) {
      console.error('Table load error:', e);
    }
  }

  // ---------- INITIAL LOAD ----------
  const firstContinent = select.value;
  await loadTable(CONTINENT_SHEETS[firstContinent]);

  // ---------- ON CHANGE ----------
  select.addEventListener('change', (e) => {
    const continent = e.target.value;
    loadTable(CONTINENT_SHEETS[continent]);
  });
}
