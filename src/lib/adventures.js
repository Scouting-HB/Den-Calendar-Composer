import lionData from '../../scouting.org-2026/lion.json';
import tigerData from '../../scouting.org-2026/tiger.json';
import wolfData from '../../scouting.org-2026/wolf.json';
import bearData from '../../scouting.org-2026/bear.json';
import webelosData from '../../scouting.org-2026/webelos.json';
import aolData from '../../scouting.org-2026/arrow-of-light.json';

const rankData = {
  lion: lionData,
  tiger: tigerData,
  wolf: wolfData,
  bear: bearData,
  webelos: webelosData,
  'arrow-of-light': aolData,
};

function extractActivities(adventure) {
  const activities = [];
  const byName = {};
  for (const req of adventure.requirements || []) {
    for (const act of req.suggestedActivities || []) {
      if (!act.name) continue;
      if (!byName[act.name]) {
        byName[act.name] = { name: act.name, reqs: [] };
        activities.push(byName[act.name]);
      }
      if (!byName[act.name].reqs.includes(req.id)) {
        byName[act.name].reqs.push(req.id);
      }
    }
  }
  return activities;
}

function mapAdventures(list) {
  return (list || []).map(a => ({
    name: a.name,
    activities: extractActivities(a),
  }));
}

export function getAdventures(rankId) {
  const data = rankData[rankId];
  if (!data) return { required: [], elective: [] };
  return {
    required: mapAdventures(data.requiredAdventures),
    elective: mapAdventures(data.electiveAdventures),
  };
}
