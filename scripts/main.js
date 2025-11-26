const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);
const state = { index: 0, names: [], key: null };

function norm(s){ return (s||'').toLowerCase().replace(/[^\w\s]/g,'').replace(/\s+/g,' ').trim(); }
function sameText(a,b){ return norm(a) === norm(b); }

function renderAlcoholRows(count, preset=[]) {
  const host = $('#alcohol-rows');
  host.innerHTML = '';
  const n = Math.max(count, preset.length || 0, 1);
  for (let i=0;i<n;i++){
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `
      <input type="number" class="ml" min="0" step="1" placeholder="ml" value="${preset[i]?.ml ?? ''}">
      <input type="text" class="name" placeholder="Ingredient name" value="${preset[i]?.name ?? ''}">
      <button type="button" class="remove" title="Remove">Remove</button>
    `;
    row.querySelector('.remove').onclick = () => { row.remove(); };
    host.appendChild(row);
  }
}

function collectAlcoholRows(){
  const rows = [...$$('#alcohol-rows .row')];
  return rows.map(r=>{
    const ml = parseInt(r.querySelector('.ml').value,10) || 0;
    const name = r.querySelector('.name').value.trim();
    return { ml, name };
  }).filter(x => x.ml>0 && x.name.length>0);
}

function applyKeyToForm(key){
  $('#title').textContent = `${key.name}`;
  $('#index-label').textContent = (state.index+1);
  const note = $('#bitters-note');
  if (key.bitters === 'peychaud’s bitters' || key.bitters === "peychaud's bitters") {
    note.hidden = false;
    note.textContent = 'Note: correct bitters is Peychaud’s (not available in dropdown).';
  } else { note.hidden = true; }
  renderAlcoholRows(key.alcohols.length);
  $('#bitters').value = 'none';
  $('#dashes').value = 0;
  $('#ice').value = key.ice;
  document.querySelector(`input[name="method"][value="${key.method}"]`).checked = true;
  document.querySelector(`input[name="strain"][value="${key.strain}"]`).checked = true;
  $('#garnish').value = '';
  $('#result').hidden = true;
}

function arraysEqualAsMultisets(user, expected){
  if (user.length !== expected.length) return false;
  const used = new Array(expected.length).fill(false);
  for (const u of user){
    let found = false;
    for (let i=0;i<expected.length;i++){
      if (used[i]) continue;
      if (expected[i].ml === u.ml && sameText(expected[i].name, u.name)){
        used[i] = true; found = true; break;
      }
    }
    if (!found) return false;
  }
  return true;
}

function showResult(ok, diffs, key){
  const res = $('#result');
  const status = $('#result-status');
  const details = $('#result-details');
  status.innerHTML = ok ? `<strong class="good">Correct ✔</strong>` : `<strong class="bad">Incorrect ✖</strong>`;
  const lines = [];
  for (const d of diffs){ lines.push(`<div>• ${d}</div>`); }
  if (!ok){
    const alcLines = key.alcohols.map(a=>`${a.ml}ml ${a.name}`).join('; ');
    lines.push(`<hr>`);
    lines.push(`<div><strong>Correct alcohols:</strong> ${alcLines || 'None'}</div>`);
    lines.push(`<div><strong>Bitters:</strong> ${key.bitters} ${key.dashes?`(${key.dashes} dashes)`:''}</div>`);
    lines.push(`<div><strong>Glassware/Ice:</strong> ${key.ice}</div>`);
    lines.push(`<div><strong>Method:</strong> ${key.method}, <strong>Strain:</strong> ${key.strain}</div>`);
    if (!key.skipGarnishCheck) lines.push(`<div><strong>Garnish:</strong> ${(key.garnish&&key.garnish.length)? key.garnish.join(' / ') : 'None'}</div>`);
    else lines.push(`<div><strong>Garnish:</strong> varies (accept any)</div>`);
  }
  details.innerHTML = lines.join('');
  res.hidden = false;
}

function compareAgainstKey(key){
  const diffs = [];
  const userAlcohols = collectAlcoholRows();
  if (!arraysEqualAsMultisets(userAlcohols, key.alcohols)) diffs.push('Alcohol ingredients (ml + exact name) do not match.');
  const userBitters = $('#bitters').value;
  const userDashes = parseInt($('#dashes').value,10) || 0;
  if (key.bitters === 'peychaud’s bitters' || key.bitters === "peychaud's bitters"){
    diffs.push('Bitters: expected Peychaud’s (not available in dropdown).');
  } else {
    if (!sameText(userBitters, key.bitters)) diffs.push(`Bitters should be "${key.bitters}".`);
    if ((key.dashes||0) !== userDashes) diffs.push(`Dashes should be ${key.dashes||0}.`);
  }
  const userIce = $('#ice').value;
  if (!sameText(userIce, key.ice)) diffs.push(`Glassware/Ice should be "${key.ice}".`);
  const userMethod = document.querySelector('input[name="method"]:checked').value;
  const userStrain = document.querySelector('input[name="strain"]:checked').value;
  if (!sameText(userMethod, key.method)) diffs.push(`Method should be "${key.method}".`);
  if (!sameText(userStrain, key.strain)) diffs.push(`Strain should be "${key.strain}".`);
  const userGarnish = $('#garnish').value;
  if (!key.skipGarnishCheck){
    const okGarnish = (key.garnish||[]).some(g => sameText(g, userGarnish));
    if (!okGarnish) diffs.push(`Garnish should be "${(key.garnish||[]).join(' / ')||'None'}".`);
  }
  const ok = diffs.length === 0;
  showResult(ok, diffs, key);
}

async function loadNamesAndRender(Module){
  state.getNames = Module.cwrap('getCocktailNamesJSON','string',[]);
  state.getKey = Module.cwrap('getAnswerKeyJSON','string',['number']);
  const names = JSON.parse(state.getNames());
  state.names = names;
  const list = $('#cocktail-list');
  list.innerHTML = '';
  names.forEach((n, i) => {
    const li = document.createElement('li');
    li.textContent = n;
    li.onclick = () => gotoIndex(i);
    list.appendChild(li);
  });
  gotoIndex(0);
}

function setActiveListItem(){
  [...$$('#cocktail-list li')].forEach((li,i)=>{
    li.classList.toggle('active', i===state.index);
  });
}

function gotoIndex(i){
  state.index = ( (i%60)+60 ) % 60;
  setActiveListItem();
  const key = JSON.parse(state.getKey(state.index));
  state.key = key;
  applyKeyToForm(key);
}

function bindUI(){
  $('#prev-btn').onclick = () => gotoIndex(state.index - 1);
  $('#next-btn').onclick = () => gotoIndex(state.index + 1);
  $('#add-row').onclick = () => {
    renderAlcoholRows(collectAlcoholRows().length + 1, collectAlcoholRows());
  };
  $('#reset-rows').onclick = () => renderAlcoholRows(state.key.alcohols.length);
  $('#show-answer').onclick = () => showResult(false, ['(Revealed by user)'], state.key);
  $('#quiz-form').onsubmit = (e) => { e.preventDefault(); compareAgainstKey(state.key); };
}
bindUI();
if (window.Module){ window.Module().then(loadNamesAndRender); } else { console.error('wasm/app.js not found. Build the C++ first.'); }
