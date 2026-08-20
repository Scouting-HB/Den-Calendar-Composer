<script>
  import { getAdventures } from './adventures.js';

  let { events = $bindable(), packName = $bindable(), calendarTitle = $bindable(), selectedRank = $bindable(), defaultLocation = $bindable() } = $props();

  const base = import.meta.env.BASE_URL;

  let adventures = $derived(getAdventures(selectedRank));

  let activityMap = $derived.by(() => {
    const map = {};
    for (const a of [...adventures.required, ...adventures.elective]) {
      map[a.name] = a.activities;
    }
    return map;
  });

  const ranks = [
    { id: 'lion', label: 'Lion', image: 'Lion-insignia-CSBC.jpg' },
    { id: 'tiger', label: 'Tiger', image: 'TIGER-color-insignia-CSBC.jpg' },
    { id: 'wolf', label: 'Wolf', image: 'Wolf rank-color-insignia-CSBC.jpg' },
    { id: 'bear', label: 'Bear', image: 'CS_bear-insignia-CSBC.jpg' },
    { id: 'webelos', label: 'Webelos', image: 'Webelos Oval-color-insignia-CSBC.jpg' },
    { id: 'arrow-of-light', label: 'Arrow of Light', image: 'Arrow of Light-insignia-CSBC.jpg' },
  ];

  let customAdventure = $state({});
  let customActivity = $state({});

  function onAdventureChange(i, value) {
    if (value === '__other__') {
      customAdventure[i] = true;
      events[i].adventure = '';
      events[i].activity = '';
      customActivity[i] = false;
    } else {
      customAdventure[i] = false;
      events[i].adventure = value;
      events[i].activity = '';
      customActivity[i] = false;
    }
  }

  function onActivityChange(i, value) {
    if (value === '__other__') {
      customActivity[i] = true;
      events[i].activity = '';
    } else {
      customActivity[i] = false;
      events[i].activity = value;
    }
  }

  function handlePaste(e) {
    const text = e.clipboardData.getData('text/plain');
    if (!text) return;

    const lines = text.split('\n').filter(l => l.trim());
    const parsed = [];

    for (const line of lines) {
      const parts = line.split('\t');
      if (parts.length >= 2) {
        const dateStr = parseDate(parts[0].trim());
        const unit = parts.length >= 3 ? parts[1].trim() : '';
        const title = parts.length >= 3 ? parts[2].trim() : parts[1].trim();
        const location = parts.length >= 4 ? parts[3].trim() : '';
        const adventure = parts.length >= 5 ? parts[4].trim() : '';
        const activity = parts.length >= 6 ? parts[5].trim() : '';
        if (dateStr && title) {
          parsed.push({ date: dateStr, unit, title, location, adventure, activity });
        }
      } else {
        const altParts = line.split(/[|,]/).map(s => s.trim());
        if (altParts.length >= 2) {
          const dateStr = parseDate(altParts[0]);
          const unit = altParts.length >= 3 ? altParts[1] : '';
          const title = altParts.length >= 3 ? altParts[2] : altParts[1];
          const location = altParts.length >= 4 ? altParts[3] : '';
          const adventure = altParts.length >= 5 ? altParts[4] : '';
          const activity = altParts.length >= 6 ? altParts[5] : '';
          if (dateStr && title) {
            parsed.push({ date: dateStr, unit, title, location, adventure, activity });
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
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
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
    events = [...events, { date: '', unit: '', title: '', location: '', adventure: '', activity: '' }];
  }

  function removeRow(index) {
    events = events.filter((_, i) => i !== index);
    delete customAdventure[index];
    delete customActivity[index];
  }

  function clearAll() {
    events = [];
    customAdventure = {};
    customActivity = {};
  }

  function printPreview() {
    window.print();
  }
</script>

<div class="editor p-3">
  <h1 class="editor-title mb-3">Den Calendar Builder</h1>

  <div class="mb-3">
    <label class="form-label form-label-sm text-uppercase text-muted fw-semibold ls">Pack Name</label>
    <input type="text" bind:value={packName} class="form-control form-control-sm" />
  </div>

  <div class="mb-3">
    <label class="form-label form-label-sm text-uppercase text-muted fw-semibold ls">Calendar Title</label>
    <input type="text" bind:value={calendarTitle} class="form-control form-control-sm" />
  </div>

  <div class="mb-3">
    <label class="form-label form-label-sm text-uppercase text-muted fw-semibold ls">Default Meeting Location</label>
    <input type="text" bind:value={defaultLocation} class="form-control form-control-sm" style="font-size: 0.8rem" />
  </div>

  <div class="mb-3">
    <label class="form-label form-label-sm text-uppercase text-muted fw-semibold ls">Rank</label>
    <div class="d-flex gap-1">
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

  <div class="mb-3">
    <div class="d-flex justify-content-between align-items-center mb-1">
      <label class="form-label form-label-sm text-uppercase text-muted fw-semibold ls mb-0">Events</label>
      <div class="btn-group btn-group-sm">
        <button class="btn btn-outline-secondary btn-sm" onclick={addRow}>+ Add Row</button>
        <button class="btn btn-outline-danger btn-sm" onclick={clearAll}>Clear</button>
      </div>
    </div>

    <textarea
      class="form-control form-control-sm paste-area mb-2"
      placeholder="Paste rows from Excel or Google Sheets here (Date | Unit | Title | Location | Adventure | Activity)"
      onpaste={handlePaste}
      rows="2"
    ></textarea>

    <div class="table-responsive">
      <table class="table table-sm table-bordered table-hover mb-0 events-table">
        <thead>
          <tr>
            <th class="col-date">Date</th>
            <th class="col-unit">Unit</th>
            <th class="col-title">Title</th>
            <th class="col-loc">Location</th>
            <th class="col-agenda">Agenda</th>
            <th class="col-del"></th>
          </tr>
        </thead>
        <tbody>
          {#each events as event, i}
            <tr>
              <td class="col-date"><input type="date" bind:value={event.date} class="form-control form-control-sm border-0 px-1" /></td>
              <td class="col-unit"><input type="text" bind:value={event.unit} placeholder="Pack/Den" class="form-control form-control-sm border-0 px-1" /></td>
              <td class="col-title"><input type="text" bind:value={event.title} placeholder="Event title" class="form-control form-control-sm border-0 px-1" /></td>
              <td class="col-loc"><input type="text" bind:value={event.location} placeholder="Location, time" class="form-control form-control-sm border-0 px-1" /></td>
              <td class="col-agenda">
                <div class="d-flex flex-column gap-1 p-1">
                  {#if customAdventure[i]}
                    <div class="input-group input-group-sm">
                      <input
                        type="text"
                        bind:value={event.adventure}
                        placeholder="Adventure name"
                        class="form-control form-control-sm"
                      />
                      <button class="btn btn-outline-secondary btn-sm" onclick={() => { customAdventure[i] = false; event.adventure = ''; }} title="Pick from list">&larr;</button>
                    </div>
                  {:else}
                    <select
                      value={event.adventure}
                      onchange={(e) => onAdventureChange(i, e.target.value)}
                      class="form-select form-select-sm"
                    >
                      <option value="">Adventure...</option>
                      <optgroup label="Required">
                        {#each adventures.required as adv}
                          <option value={adv.name}>{adv.name}</option>
                        {/each}
                      </optgroup>
                      <optgroup label="Elective">
                        {#each adventures.elective as adv}
                          <option value={adv.name}>{adv.name}</option>
                        {/each}
                      </optgroup>
                      <option value="__other__">Other...</option>
                    </select>
                  {/if}

                  {#if event.adventure && (activityMap[event.adventure]?.length || customAdventure[i])}
                    {#if customActivity[i] || customAdventure[i]}
                      <div class="input-group input-group-sm">
                        <input
                          type="text"
                          bind:value={event.activity}
                          placeholder="Activity name"
                          class="form-control form-control-sm"
                        />
                        {#if !customAdventure[i]}
                          <button class="btn btn-outline-secondary btn-sm" onclick={() => { customActivity[i] = false; event.activity = ''; }} title="Pick from list">&larr;</button>
                        {/if}
                      </div>
                    {:else if activityMap[event.adventure]?.length}
                      <select
                        value={event.activity}
                        onchange={(e) => onActivityChange(i, e.target.value)}
                        class="form-select form-select-sm"
                      >
                        <option value="">Activity...</option>
                        {#each activityMap[event.adventure] as act}
                          <option value={act.name}>Req {act.reqs.join(',')} - {act.name}</option>
                        {/each}
                        <option value="__other__">Other...</option>
                      </select>
                    {/if}
                  {/if}
                </div>
              </td>
              <td class="col-del align-middle text-center">
                <button class="btn btn-sm btn-link text-danger p-0" onclick={() => removeRow(i)} title="Remove">&times;</button>
              </td>
            </tr>
          {/each}
          {#if events.length === 0}
            <tr>
              <td colspan="6" class="text-center text-muted py-4">
                No events yet. Add rows or paste from a spreadsheet.
              </td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  </div>

  <button class="btn btn-primary w-100" onclick={printPreview}>
    Print / Save PDF
  </button>
</div>

<style>
  .editor-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--cub-blue);
  }

  .ls {
    letter-spacing: 0.05em;
    font-size: 11px;
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
    border-style: dashed !important;
    text-align: center;
    color: #999;
    resize: none;
  }

  .events-table thead {
    background: var(--cub-blue);
    color: #fff;
  }
  .events-table thead th {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-color: var(--cub-blue) !important;
  }

  .col-date { width: 120px; }
  .col-unit { width: 60px; }
  .col-agenda { width: 200px; }
  .col-del { width: 32px; }

  .events-table td input.form-control {
    font-size: 12px;
    background: transparent;
  }
  .events-table td input.form-control:focus {
    background: #fffde7;
    box-shadow: none;
  }

  .events-table .form-select {
    font-size: 11px;
  }

  .btn-primary {
    background-color: var(--cub-blue);
    border-color: var(--cub-blue);
  }
  .btn-primary:hover {
    background-color: #001d45;
    border-color: #001d45;
  }
</style>
