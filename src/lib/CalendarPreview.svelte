<script>
  let { events, packName, calendarTitle, selectedRank, defaultLocation } = $props();

  const rankImages = {
    lion: 'Lion-insignia-CSBC.jpg',
    tiger: 'TIGER-color-insignia-CSBC.jpg',
    wolf: 'Wolf rank-color-insignia-CSBC.jpg',
    bear: 'CS_bear-insignia-CSBC.jpg',
    webelos: 'Webelos Oval-color-insignia-CSBC.jpg',
    'arrow-of-light': 'Arrow of Light-insignia-CSBC.jpg',
  };

  const rankLabels = {
    lion: 'Lion',
    tiger: 'Tiger',
    wolf: 'Wolf',
    bear: 'Bear',
    webelos: 'Webelos',
    'arrow-of-light': 'Arrow of Light',
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function groupByMonth(events) {
    const sorted = [...events]
      .filter(e => e.date && e.title)
      .sort((a, b) => a.date.localeCompare(b.date));

    const groups = {};
    for (const event of sorted) {
      const d = new Date(event.date + 'T00:00:00');
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
      if (!groups[key]) {
        groups[key] = {
          label: monthNames[d.getMonth()],
          events: [],
        };
      }
      const dayNum = d.getDate();
      const dayName = dayNames[d.getDay()];
      groups[key].events.push({
        ...event,
        dayNum,
        dayName,
      });
    }
    return Object.values(groups);
  }

  let months = $derived(groupByMonth(events));
</script>

<div class="page" style="--rank-color: var(--{selectedRank})">
  <!-- Header -->
  <div class="header">
    <img class="rank-badge" src="/{rankImages[selectedRank]}" alt={rankLabels[selectedRank]} />
    <div class="header-text">
      <h1>{packName}</h1>
      <h2>{calendarTitle}{#if rankLabels[selectedRank]} &mdash; {rankLabels[selectedRank]} Den{/if}</h2>
    </div>
    <img class="rank-badge" src="/{rankImages[selectedRank]}" alt={rankLabels[selectedRank]} />
  </div>

  {#if defaultLocation}
    <div class="default-location">
      Our default meeting location is {defaultLocation}
    </div>
  {/if}

  <!-- Calendar body -->
  <div class="calendar-body">
    {#each months as month}
      <div class="month-section">
        <div class="month-name">{month.label}</div>
        <div class="month-events">
          {#each month.events as event}
            <div class="event-row">
              <div class="event-date">
                <span class="event-day-num">{event.dayNum}</span>
                <span class="event-day-name">({event.dayName})</span>
              </div>
              <div class="event-details">
                <span class="event-title">{event.title}</span>
                {#if event.location}
                  <span class="event-location">{event.location}</span>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/each}

    {#if months.length === 0}
      <div class="empty">Add events to see the calendar preview</div>
    {/if}
  </div>

  <div class="footer">
    <p>New to Scouting? Have questions? Just Ask!</p>
  </div>
</div>

<style>
  .page {
    width: 8.5in;
    min-height: 11in;
    background: #fff;
    padding: 0.5in 0.6in;
    box-shadow: 0 2px 12px rgba(0,0,0,0.15);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #222;
    position: relative;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 3px solid var(--rank-color);
  }

  .rank-badge {
    width: 72px;
    height: 72px;
    object-fit: contain;
    flex-shrink: 0;
  }

  .header-text {
    flex: 1;
    text-align: center;
  }

  .header-text h1 {
    font-size: 22px;
    font-weight: 800;
    color: var(--cub-blue);
    margin: 0;
    line-height: 1.2;
  }

  .header-text h2 {
    font-size: 15px;
    font-weight: 600;
    color: var(--rank-color);
    margin: 2px 0 0;
  }

  .default-location {
    font-size: 10px;
    color: #666;
    text-align: center;
    margin-bottom: 16px;
    font-style: italic;
  }

  .calendar-body {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .month-section {
    break-inside: avoid;
  }

  .month-name {
    font-size: 16px;
    font-weight: 800;
    color: var(--cub-blue);
    background: var(--rank-color);
    padding: 3px 12px;
    border-radius: 3px;
    display: inline-block;
    margin-bottom: 6px;
  }

  .month-events {
    padding-left: 4px;
  }

  .event-row {
    display: flex;
    align-items: baseline;
    padding: 3px 0;
    border-bottom: 1px dotted #ddd;
    gap: 6px;
  }

  .event-date {
    flex-shrink: 0;
    width: 130px;
    font-size: 12px;
  }

  .event-day-num {
    font-weight: 700;
    font-size: 14px;
    color: var(--cub-blue);
  }

  .event-day-name {
    color: #888;
    font-size: 11px;
  }

  .event-details {
    flex: 1;
  }

  .event-title {
    font-size: 12.5px;
    font-weight: 600;
  }

  .event-location {
    display: block;
    font-size: 10.5px;
    color: #777;
  }

  .footer {
    margin-top: 24px;
    padding-top: 10px;
    border-top: 2px solid var(--rank-color);
    text-align: center;
    font-size: 11px;
    color: #666;
    font-style: italic;
  }

  .empty {
    text-align: center;
    padding: 48px;
    color: #bbb;
    font-size: 14px;
  }

  /* Print styles */
  @media print {
    .page {
      box-shadow: none;
      width: 100%;
      min-height: auto;
      padding: 0.4in 0.5in;
    }
  }
</style>
