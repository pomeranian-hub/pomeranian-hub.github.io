'use strict';
(() => {
  const form = document.getElementById('planner');
  const coat = document.getElementById('coat');
  const season = document.getElementById('season');
  const minutes = document.getElementById('minutes');
  const plan = document.getElementById('plan');
  let copyText = '';
  function render() {
    const n = Math.min(20, Math.max(2, Number(minutes.value) || 10));
    const stage = coat.value;
    const names = {puppy: 'Puppy coat', blow: 'Coat blow', adult: 'Adult coat'};
    const weather = season.value === 'static' ? 'Static / indoor heating' : 'Normal season';
    const duration = stage === 'puppy' ? Math.min(3, n) : n;
    const tasks = stage === 'puppy'
      ? ['Show the brush; reward a calm sniff', 'Practise a few gentle strokes; reward pauses', 'Brief body brushing; finish before mouthing starts', 'Repeat the easiest area; stop while relaxed']
      : stage === 'blow'
      ? ['Part the coat; gently comb loose undercoat', 'Check behind ears and harness contact areas', 'Line brush in small sections; finish with a comb', 'Check ruff and trousers; record where tangles form']
      : ['Line brush body; comb ruff', 'Rear and trousers; check feet', 'Brush through the coat; finish with a comb', 'Gentle check behind ears and harness areas'];
    const days = ['Mon', 'Wed', 'Fri', 'Sun'];
    const times = [duration, duration, duration, Math.min(5, duration)];
    const extra = stage === 'puppy' ? 'Between these days, repeat a few calm strokes if your puppy is comfortable. The slider is a maximum, not a target to push through.'
      : stage === 'blow' ? 'Between sessions, check the coat for tangles and shorten or split sessions when needed. Adjust the routine as the coat changes.'
      : 'Use a brief comb check between sessions to see whether this rhythm suits the coat.';
    const seasonal = season.value === 'static' ? 'Static season: work in small sections and pause if the coat is difficult to comb. Ask your groomer how to adapt the tools to your coat.' : 'Normal season: adapt the areas and time to the tangles you actually find.';
    document.getElementById('minutes-label').textContent = n + ' min';
    document.getElementById('plan-title').textContent = names[stage] + ' · ' + weather;
    const summary = document.createElement('p');
    summary.textContent = 'Four planned sessions a week, up to ' + duration + ' minutes each.';
    const list = document.createElement('ul'); list.className = 'plan-week';
    days.forEach((day, i) => {
      const li = document.createElement('li');
      const d = document.createElement('strong'); d.textContent = day;
      const task = document.createElement('span'); task.textContent = tasks[i];
      const time = document.createElement('small'); time.textContent = times[i] + ' min';
      li.append(d, task, time); list.append(li);
    });
    const hint = document.createElement('p'); hint.className = 'small'; hint.textContent = extra;
    const note = document.createElement('p'); note.className = 'small'; note.textContent = seasonal;
    plan.replaceChildren(summary, list, hint, note);
    copyText = ['Pomeranian Hub — Brushing planner', names[stage] + ' · ' + weather,
      ...days.map((d,i) => d + ': ' + tasks[i] + ' — up to ' + times[i] + ' min'), extra, seasonal,
      'Do not skip week 7: reassess your own routine; coat changes vary.',
      'Adjustable AI-assisted planning aid. Sources: https://pomeranian-hub.github.io/pomeranian-grooming-schedule.html',
      'https://pomeranian-hub.github.io/pomeranian-puppy-brushing-routine.html'].join('\n');
    document.getElementById('copy-status').textContent = '';
    document.getElementById('copy-fallback').hidden = true;
  }
  form.addEventListener('submit', e => e.preventDefault());
  form.addEventListener('input', render);
  form.addEventListener('change', render);
  document.getElementById('print-plan').addEventListener('click', () => window.print());
  document.getElementById('copy-plan').addEventListener('click', async () => {
    const status = document.getElementById('copy-status');
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(copyText);
      status.textContent = 'Plan copied.';
    } catch (_) {
      const field = document.getElementById('copy-fallback');
      field.value = copyText; field.hidden = false; field.focus(); field.select();
      status.textContent = 'Select the plan text below and copy it with your device’s copy command.';
    }
  });
  render();
})();
