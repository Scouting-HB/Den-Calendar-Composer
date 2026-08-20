<script>
  import EventEditor from './lib/EventEditor.svelte';
  import CalendarPreview from './lib/CalendarPreview.svelte';

  let events = $state([
    { date: '2025-08-26', unit: 'Pack', title: 'Join Scout Night', location: 'Peak View Elementary School, 6:00 PM', adventure: '', activity: '' },
    { date: '2025-09-08', unit: 'Den', title: 'Den Meeting: Rocket Launch', location: 'Rockingham Park, 3:00 PM', adventure: 'Adventures in Science', activity: '' },
    { date: '2025-09-16', unit: 'Pack', title: 'Pack Meeting: Bobcat Badge', location: 'MPC, 6:00 PM', adventure: 'Bobcat', activity: '' },
    { date: '2025-10-05', unit: 'Pack', title: 'Pack Campout', location: 'Camp Overlook, 3:00 PM', adventure: 'Paws on the Path', activity: '' },
    { date: '2025-10-21', unit: 'Pack', title: 'Pack Meeting: Personal Safety', location: 'MPC, 6:00 PM', adventure: '', activity: '' },
  ]);

  let packName = $state('Cub Scout Pack 120');
  let calendarTitle = $state('Events & Den Schedule');
  let selectedRank = $state('wolf');
  let defaultLocation = $state('Massanutten Presbyterian Church (MPC), 50 Indian Trail Road, Penn Laird VA');

  // Layout: 'builder' = 2/3 builder, 'preview' = 2/3 preview
  let layoutMode = $state('builder');
  let popoutWindow = $state(null);

  function toggleLayout() {
    layoutMode = layoutMode === 'builder' ? 'preview' : 'builder';
  }

  function popOutPreview() {
    if (popoutWindow && !popoutWindow.closed) {
      popoutWindow.focus();
      return;
    }

    const w = window.open('', 'calendar-preview', 'width=900,height=700,scrollbars=yes');
    if (!w) return;
    popoutWindow = w;

    // Copy stylesheets
    const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
    w.document.write(`<!DOCTYPE html><html><head><title>Calendar Preview</title>`);
    styles.forEach(s => w.document.write(s.outerHTML));
    w.document.write(`<style>
      body { background: #e8e8e8; margin: 0; display: flex; justify-content: center; padding: 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
      :root { --lion: #EEC250; --tiger: #DA834C; --wolf: #C6443F; --bear: #9FC2DC; --webelos: #8E9F63; --arrow-of-light: #E9D8C5; --cub-blue: #002F6D; --cub-yellow: #FFCE04; }
      * { margin: 0; padding: 0; box-sizing: border-box; }
    </style>`);
    w.document.write(`</head><body><div id="preview-root"></div></body></html>`);
    w.document.close();

    function sync() {
      if (w.closed) {
        popoutWindow = null;
        return;
      }
      const source = document.querySelector('.preview-pane .page');
      if (source) {
        const root = w.document.getElementById('preview-root');
        if (root) {
          root.innerHTML = source.outerHTML;
          // Copy computed styles for scoped classes
          const sourceStyles = document.querySelectorAll('style');
          const existingPopoutStyles = w.document.querySelectorAll('style[data-synced]');
          existingPopoutStyles.forEach(s => s.remove());
          sourceStyles.forEach(s => {
            const clone = w.document.createElement('style');
            clone.textContent = s.textContent;
            clone.setAttribute('data-synced', 'true');
            w.document.head.appendChild(clone);
          });
        }
      }
      requestAnimationFrame(sync);
    }
    requestAnimationFrame(sync);

    w.addEventListener('beforeunload', () => {
      popoutWindow = null;
    });
  }
</script>

<div class="app-layout" class:layout-preview={layoutMode === 'preview'}>
  <div class="editor-pane">
    <EventEditor
      bind:events
      bind:packName
      bind:calendarTitle
      bind:selectedRank
      bind:defaultLocation
    />
  </div>
  <div class="pane-divider">
    <div class="d-flex flex-column gap-2">
      <button class="btn btn-sm btn-light shadow-sm divider-btn" onclick={toggleLayout} title={layoutMode === 'builder' ? 'Enlarge preview' : 'Enlarge builder'}>
        {#if layoutMode === 'builder'}
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M10 2l4 4-4 4V7H6v6H4V6a1 1 0 011-1h5V2z"/></svg>
        {:else}
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M6 2L2 6l4 4V7h4v6h2V6a1 1 0 00-1-1H6V2z"/></svg>
        {/if}
      </button>
      <button class="btn btn-sm btn-light shadow-sm divider-btn" onclick={popOutPreview} title="Pop out preview">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M9 1h6v6h-2V4.4L8.7 8.7 7.3 7.3 11.6 3H9V1zM3 3h4v2H4v8h8V9h2v5a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1z"/></svg>
      </button>
    </div>
  </div>
  <div class="preview-pane">
    <CalendarPreview
      {events}
      {packName}
      {calendarTitle}
      {selectedRank}
      {defaultLocation}
    />
  </div>
</div>

<style>
  .app-layout {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  .editor-pane {
    flex: 2;
    min-width: 360px;
    background: #fff;
    overflow-y: auto;
    transition: flex 0.3s ease;
  }

  .preview-pane {
    flex: 1;
    overflow-y: auto;
    padding: 32px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    background: #e8e8e8;
    transition: flex 0.3s ease;
  }

  .layout-preview .editor-pane {
    flex: 1;
  }

  .layout-preview .preview-pane {
    flex: 2;
  }

  .pane-divider {
    width: 28px;
    background: #dee2e6;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
  }

  .divider-btn {
    width: 24px;
    height: 24px;
    padding: 0 !important;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
  }

  .divider-btn:hover {
    color: var(--cub-blue);
  }
</style>
