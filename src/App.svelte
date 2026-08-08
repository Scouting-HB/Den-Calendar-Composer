<script>
  import EventEditor from './lib/EventEditor.svelte';
  import CalendarPreview from './lib/CalendarPreview.svelte';

  let events = $state([
    { date: '2025-08-26', title: 'Join Scout Night', location: 'Peak View Elementary School, 6:00 PM' },
    { date: '2025-09-08', title: 'Den Meeting: Rocket Launch', location: 'Rockingham Park, 3:00 PM' },
    { date: '2025-09-16', title: 'Pack Meeting: Bobcat Badge', location: 'MPC, 6:00 PM' },
    { date: '2025-10-05', title: 'Pack Campout', location: 'Camp Overlook, 3:00 PM' },
    { date: '2025-10-21', title: 'Pack Meeting: Personal Safety', location: 'MPC, 6:00 PM' },
  ]);

  let packName = $state('Cub Scout Pack 120');
  let calendarTitle = $state('Events & Den Schedule');
  let selectedRank = $state('wolf');
  let defaultLocation = $state('Massanutten Presbyterian Church (MPC), 50 Indian Trail Road, Penn Laird VA');
</script>

<div class="app-layout">
  <div class="editor-pane">
    <EventEditor
      bind:events
      bind:packName
      bind:calendarTitle
      bind:selectedRank
      bind:defaultLocation
    />
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
    width: 460px;
    min-width: 360px;
    background: #fff;
    border-right: 1px solid #ccc;
    overflow-y: auto;
    flex-shrink: 0;
  }

  .preview-pane {
    flex: 1;
    overflow-y: auto;
    padding: 32px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    background: #e8e8e8;
  }
</style>
