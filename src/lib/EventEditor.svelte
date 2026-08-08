<script>
  let { events = $bindable(), packName = $bindable(), calendarTitle = $bindable(), selectedRank = $bindable(), defaultLocation = $bindable() } = $props();

  const base = import.meta.env.BASE_URL;

  const ranks = [
    { id: 'lion', label: 'Lion', image: 'Lion-insignia-CSBC.jpg' },
    { id: 'tiger', label: 'Tiger', image: 'TIGER-color-insignia-CSBC.jpg' },
    { id: 'wolf', label: 'Wolf', image: 'Wolf rank-color-insignia-CSBC.jpg' },
    { id: 'bear', label: 'Bear', image: 'CS_bear-insignia-CSBC.jpg' },
    { id: 'webelos', label: 'Webelos', image: 'Webelos Oval-color-insignia-CSBC.jpg' },
    { id: 'arrow-of-light', label: 'Arrow of Light', image: 'Arrow of Light-insignia-CSBC.jpg' },
  ];

  function handlePaste(e) {
    const text = e.clipboardData.getData('text/plain');
    if (!text) return;

    const lines = text.split('\n').filter(l => l.trim());
    const parsed = [];

    for (const line of lines) {
      const parts = line.split('\t');
      if (parts.length >= 2) {
        // Tab-separated: Date \t Title [\t Location]
        const dateStr = parseDate(parts[0].trim());
        const title = parts[1].trim();
        const location = parts.length >= 3 ? parts[2].trim() : '';
        if (dateStr && title) {
          parsed.push({ date: dateStr, title, location });
        }
      } else {
        // Try comma or pipe separated as fallback
        const altParts = line.split(/[|,]/).map(s => s.trim());
        if (altParts.length >= 2) {
          const dateStr = parseDate(altParts[0]);
          const title = altParts[1];
          const location = altParts.length >= 3 ? altParts[2] : '';
          if (dateStr && title) {
            parsed.push({ date: dateStr, title, location });
          }
        }
      }
    }

    if (parsed.length > 0) {
      e.preventDefault();
      e.target.value = '';
      events = [...events, ...parsed];
    }
  }

  function parseDate(str) {
    // Try various date formats
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
    // Try MM/DD/YYYY
    const match = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
    if (match) {
      const year = match[3].length === 2 ? '20' + match[3] : match[3];
      const d2 = new Date(year, match[1] - 1, match[2]);
      if (!isNaN(d2.getTime())) {
        return d2.toISOString().split('T')[0];
      }
    }
    return null;
  }

  function addRow() {
    events = [...events, { date: '', title: '', location: '' }];
  }

  function removeRow(index) {
    events = events.filter((_, i) => i !== index);
  }

  function clearAll() {
    events = [];
  }

  function printPreview() {
    window.print();
  }
</script>

<div class="editor">
  <div class="editor-header">
    <h1>Den Calendar Builder</h1>
  </div>

  <div class="section">
    <label class="field-label">Pack Name</label>
    <input type="text" bind:value={packName} class="text-input" />
  </div>

  <div class="section">
    <label class="field-label">Calendar Title</label>
    <input type="text" bind:value={calendarTitle} class="text-input" />
  </div>

  <div class="section">
    <label class="field-label">Default Meeting Location</label>
    <input type="text" bind:value={defaultLocation} class="text-input small" />
  </div>

  <div class="section">
    <label class="field-label">Rank</label>
    <div class="rank-picker">
      {#each ranks as rank}
        <button
          class="rank-btn"
          class:selected={selectedRank === rank.id}
          onclick={() => selectedRank = rank.id}
          title={rank.label}
          style="--rank-color: var(--{rank.id})"
        >
          <img src="{base}{rank.image}" alt={rank.label} />
        </button>
      {/each}
    </div>
  </div>

  <div class="section">
    <div class="section-header">
      <label class="field-label">Events</label>
      <div class="btn-group">
        <button class="btn btn-sm" onclick={addRow}>+ Add Row</button>
        <button class="btn btn-sm btn-danger" onclick={clearAll}>Clear</button>
      </div>
    </div>

    <textarea
      class="paste-area"
      placeholder="Paste rows from Excel or Google Sheets here (Date | Title | Location)"
      onpaste={handlePaste}
    ></textarea>

    <div class="events-table">
      <div class="table-header">
        <span class="col-date">Date</span>
        <span class="col-title">Title</span>
        <span class="col-loc">Location</span>
        <span class="col-del"></span>
      </div>
      {#each events as event, i}
        <div class="table-row">
          <input
            type="date"
            class="col-date"
            bind:value={event.date}
          />
          <input
            type="text"
            class="col-title"
            bind:value={event.title}
            placeholder="Event title"
          />
          <input
            type="text"
            class="col-loc"
            bind:value={event.location}
            placeholder="Location, time"
          />
          <button class="col-del del-btn" onclick={() => removeRow(i)} title="Remove">&times;</button>
        </div>
      {/each}
      {#if events.length === 0}
        <div class="empty-state">
          No events yet. Add rows or paste from a spreadsheet.
        </div>
      {/if}
    </div>
  </div>

  <div class="section">
    <button class="btn btn-primary btn-print" onclick={printPreview}>
      Print / Save PDF
    </button>
  </div>
</div>

<style>
  .editor {
    padding: 20px;
  }

  .editor-header h1 {
    font-size: 20px;
    font-weight: 700;
    color: var(--cub-blue);
    margin-bottom: 16px;
  }

  .section {
    margin-bottom: 16px;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }

  .field-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #666;
    margin-bottom: 4px;
  }

  .text-input {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
  .text-input.small {
    font-size: 12px;
  }

  .rank-picker {
    display: flex;
    gap: 6px;
  }

  .rank-btn {
    width: 56px;
    height: 56px;
    border: 3px solid transparent;
    border-radius: 8px;
    background: #f5f5f5;
    cursor: pointer;
    padding: 4px;
    transition: border-color 0.15s;
  }
  .rank-btn img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .rank-btn.selected {
    border-color: var(--rank-color);
    background: #fff;
    box-shadow: 0 0 0 1px var(--rank-color);
  }

  .paste-area {
    width: 100%;
    height: 48px;
    border: 2px dashed #ccc;
    border-radius: 6px;
    padding: 12px;
    font-size: 12px;
    color: #999;
    background: #fafafa;
    resize: none;
    margin-bottom: 8px;
    text-align: center;
    outline: none;
    transition: border-color 0.15s;
  }
  .paste-area:focus {
    border-color: var(--cub-blue);
    background: #fff;
  }

  .events-table {
    border: 1px solid #ddd;
    border-radius: 6px;
    overflow: hidden;
  }

  .table-header {
    display: flex;
    gap: 1px;
    background: var(--cub-blue);
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 6px 0;
  }
  .table-header span {
    padding: 0 8px;
  }

  .table-row {
    display: flex;
    gap: 1px;
    border-top: 1px solid #eee;
  }

  .col-date {
    width: 120px;
    min-width: 120px;
    max-width: 120px;
    flex: 0 0 120px;
  }
  .col-title {
    flex: 1;
    min-width: 0;
  }
  .col-loc {
    flex: 1;
    min-width: 0;
  }
  .col-del {
    width: 30px;
    flex-shrink: 0;
    text-align: center;
  }

  .table-row input {
    border: none;
    padding: 6px 8px;
    font-size: 12px;
    outline: none;
    background: transparent;
    width: 100%;
  }
  .table-row input:focus {
    background: #fffde7;
  }

  .del-btn {
    background: none;
    border: none;
    color: #ccc;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  }
  .del-btn:hover {
    color: var(--wolf);
  }

  .empty-state {
    padding: 24px;
    text-align: center;
    color: #aaa;
    font-size: 13px;
  }

  .btn-group {
    display: flex;
    gap: 6px;
  }

  .btn {
    padding: 6px 14px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;
    font-size: 13px;
  }
  .btn:hover {
    background: #f5f5f5;
  }
  .btn-sm {
    padding: 4px 10px;
    font-size: 12px;
  }
  .btn-danger {
    color: var(--wolf);
    border-color: var(--wolf);
  }
  .btn-danger:hover {
    background: #fef2f2;
  }
  .btn-primary {
    background: var(--cub-blue);
    color: #fff;
    border-color: var(--cub-blue);
    font-weight: 600;
  }
  .btn-primary:hover {
    background: #001d45;
  }
  .btn-print {
    width: 100%;
    padding: 10px;
    font-size: 15px;
  }
</style>
