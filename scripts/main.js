const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);
const state = { index: 0, names: [], key: null };

function norm(s){ return (s||'').toLowerCase().replace(/[^\w\s&/-]/g,'').replace(/\s+/g,' ').trim(); }
function sameText(a,b){ return norm(a) === norm(b); }

// Glassware grading map (editable)
const GLASS_KEY = {
  // coupes / coupettes / n&n
  "ESPRESSO MARTINI": ["coupe"],
  "MARTINI": ["nick and nora","coupette"],
  "DAIQUIRI": ["coupette"],
  "DAIQUIRI (HEMINGWAY)": ["coupette"],
  "LAST WORD": ["coupette","nick and nora"],
  "AVIATION": ["coupette"],
  "COSMOPOLITAN": ["nick and nora","coupette"],
  "CLOVER CLUB": ["coupe"],
  "GRASSHOPPER": ["coupette"],
  "JAPANESE SLIPPER": ["nick and nora","coupette"],
  "SOUTHSIDE": ["nick and nora","coupette"],
  "CORPSE REVIVER #2": ["coupette"],
  "SLOE GIN SOUR": ["coupe"],
  "GIMLET": ["coupette"],
  "GIN FIZZ": ["collins"],
  "MANHATTAN": ["coupette"],

  // flute / wine glass
  "FRENCH 75": ["flute"],
  "APEROL SPRITZ": ["wine glass"],
  "LIMONCELLO SPRITZ": ["wine glass"],
  "ELDERFLOWER SPRITZ": ["wine glass"],

  // rocks
  "NEGRONI": ["rocks"],
  "OLD FASHIONED": ["rocks"],
  "BOULEVARDIER": ["rocks"],
  "SAZERAC (Original)": ["rocks"],
  "SAZERAC (New Orleans)": ["rocks"],
  "SAZERAC (New York)": ["rocks"],
  "NEW YORK SOUR": ["rocks"],
  "BRAMBLE": ["rocks"],
  "WHISKY SOUR": ["rocks"],
  "BLACK & WHITE RUSSIAN": ["rocks"],
  "RUSTY NAIL": ["rocks"],

  // collins/highball
  "TOM COLLINS": ["collins"],
  "PALOMA": ["collins"],
  "LONG ISLAND ICED TEA": ["collins"],
  "DARK AND STORMY": ["collins"],
  "MAI TAI": ["collins"],
  "PINA COLADA": ["collins"],
  "PAINKILLER": ["collins"],
  "PI YI": ["collins"],

  // tiki
  "ZOMBIE": ["tiki"],

  // built muddled/crushed
  "MOJITO": ["collins"],
  "CAIPIRINHA": ["rocks"],
  "CAPRIOSKA": ["rocks"],

  // mule
  "MOSCOW MULE": ["camping mug"],

  // slings etc.
  "SINGAPORE SLING": ["collins"],
};

function normalizeGlass(v){
  const x = norm(v);
  if (x === "n&n" || x === "nick n nora" || x === "nick nora") return "nick and nora";
  return x;
}
function glassMatches(user, allowed){
  const u = normalizeGlass(user);
  return allowed.some(opt => normalizeGlass(opt) === u);
}

// Dynamic total label
function updateTotalLabel() {
  const total = state.names.length || 0;
  const indexHdr = document.querySelector('.index');
  if (indexHdr) indexHdr.innerHTML = `#<span id="index-label">${state.index+1}</span>/${total}`;
}

// Build rows
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

function snapshotAlcoholRows(){
  const rows = [...document.querySelectorAll('#alcohol-rows .row')];
  return rows.map(r => ({
    // keep raw values; don't coerce to number yet
    ml: r.querySelector('.ml').value,
    name: r.querySelector('.name').value
  }));
}

function collectAlcoholRows(){
  const rows = [...document.querySelectorAll('#alcohol-rows .row')];
  return rows.map(r=>{
    const ml = parseInt(r.querySelector('.ml').value,10) || 0;
    const name = r.querySelector('.name').value.trim();
    return { ml, name };
  }).filter(x => x.ml>0 && x.name.length>0);
}

function applyKeyToForm(key){
  document.querySelector('#title').textContent = key.name;
  document.querySelector('#index-label').textContent = (state.index+1);

  const note = document.querySelector('#bitters-note');
  if (key.bitters === 'peychaud’s bitters' || key.bitters === "peychaud's bitters") {
    note.hidden = false;
    note.textContent = 'Note: correct bitters is Peychaud’s (not available in dropdown).';
  } else { note.hidden = true; }

  renderAlcoholRows(1); // start with 1 blank row

  document.querySelector('#bitters').value = 'none';
  document.querySelector('#dashes').value = 0;
  if (document.querySelector('#glass'))   document.querySelector('#glass').value = '';
  if (document.querySelector('#iceType')) document.querySelector('#iceType').value = key.ice;

  (document.querySelector(`input[name="method"][value="${key.method}"]`)
    || document.querySelector(`input[name="method"][value="shaken"]`))?.click();
  (document.querySelector(`input[name="strain"][value="${key.strain}"]`)
    || document.querySelector(`input[name="strain"][value="single"]`))?.click();

  const mud = document.querySelector('#Muddled'); if (mud) mud.checked = false;

  document.querySelector('#garnish').value = '';
  document.querySelector('#result').hidden = true;
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
  for (const d of diffs) lines.push(`<div>• ${d}</div>`);

  if (!ok){
    const alcLines = key.alcohols.map(a=>`${a.ml}ml ${a.name}`).join('; ');
    lines.push(`<hr>`);
    lines.push(`<div><strong>Correct alcohols:</strong> ${alcLines || 'None'}</div>`);
    lines.push(`<div><strong>Bitters:</strong> ${key.bitters} ${key.dashes?`(${key.dashes} dashes)`:''}</div>`);

    const chosenGlass = $('#glass')?.value || '(none)';
    const allowed = GLASS_KEY[key.name];
    if (allowed && allowed.length){
      lines.push(`<div><strong>Glassware:</strong> expected ${allowed.join(' / ')}, you chose ${chosenGlass}</div>`);
    } else {
      lines.push(`<div><strong>Glassware:</strong> ${chosenGlass} <em>(not graded for this drink)</em></div>`);
    }

    lines.push(`<div><strong>Ice:</strong> ${key.ice}</div>`);
    lines.push(`<div><strong>Method:</strong> ${key.method}, <strong>Strain:</strong> ${key.strain || 'none'}</div>`);
    if (!key.skipGarnishCheck) lines.push(`<div><strong>Garnish:</strong> ${(key.garnish&&key.garnish.length)? key.garnish.join(' / ') : 'None'}</div>`);
    else lines.push(`<div><strong>Garnish:</strong> varies (accept any)</div>`);
  }

  details.innerHTML = lines.join('');
  res.hidden = false;
}

function compareAgainstKey(key){
  if (!key){ alert("Still loading data. Try again in a moment."); return; }

  const diffs = [];
  const userAlcohols = collectAlcoholRows();

  // Alcohols
  if (!arraysEqualAsMultisets(userAlcohols, key.alcohols))
    diffs.push('Alcohol ingredients (ml + exact name) do not match.');

  // Bitters
  const userBitters = $('#bitters').value;
  const userDashes = parseInt($('#dashes').value,10) || 0;
  if (key.bitters === 'peychaud’s bitters' || key.bitters === "peychaud's bitters"){
    diffs.push('Bitters: expected Peychaud’s (not available in dropdown).');
  } else {
    if (!sameText(userBitters, key.bitters)) diffs.push(`Bitters should be "${key.bitters}".`);
    if ((key.dashes||0) !== userDashes) diffs.push(`Dashes should be ${key.dashes||0}.`);
  }

  // Glassware (graded if we have an answer)
  const userGlass = $('#glass')?.value || '';
  const allowed = GLASS_KEY[key.name];
  if (allowed && allowed.length){
    if (!userGlass) diffs.push('Select a glass type.');
    else if (!glassMatches(userGlass, allowed)) {
      diffs.push(`Glassware should be ${allowed.join(' / ')}.`);
    }
  }

  // Ice
  const userIce = $('#iceType')?.value || 'none';
  if (!sameText(userIce, key.ice)) diffs.push(`Ice should be "${key.ice}".`);

  // Method
  const userMethod = document.querySelector('input[name="method"]:checked').value;
  if (!sameText(userMethod, key.method)) diffs.push(`Method should be "${key.method}".`);

  // Strain
  const userStrain = document.querySelector('input[name="strain"]:checked').value;
  if (!sameText(userStrain, key.strain)) diffs.push(`Strain should be "${key.strain || 'none'}".`);

  // Muddled (optional, not graded)
  const muddled = $('#Muddled')?.checked || false;

  // Garnish
  const userGarnish = $('#garnish').value;
  if (!key.skipGarnishCheck){
    const okGarnish = (key.garnish||[]).some(g => sameText(g, userGarnish));
    if (!okGarnish) diffs.push(`Garnish should be "${(key.garnish||[]).join(' / ')||'None'}".`);
  }

  const ok = diffs.length === 0;
  showResult(ok, diffs, key);
}

// Load names and render
async function loadNamesAndRender(Module){
  state.getNames = Module.cwrap('getCocktailNamesJSON','string',[]);
  state.getKey   = Module.cwrap('getAnswerKeyJSON','string',['number']);

  const names = JSON.parse(state.getNames() || "[]");
  state.names = names;

  const list = $('#cocktail-list');
  list.innerHTML = '';
  names.forEach((n, i) => {
    const li = document.createElement('li');
    li.textContent = n;
    li.onclick = () => gotoIndex(i);
    list.appendChild(li);
  });
  updateTotalLabel();
  gotoIndex(0);
}

function setActiveListItem(){
  [...$$('#cocktail-list li')].forEach((li,i)=>{
    li.classList.toggle('active', i===state.index);
  });
}

function gotoIndex(i){
  const total = state.names.length || 1;
  state.index = ((i % total) + total) % total;
  setActiveListItem();
  const key = JSON.parse(state.getKey(state.index));
  state.key = key;
  applyKeyToForm(key);
  updateTotalLabel();
}

function bindUI(){
  document.querySelector('#prev-btn').onclick = () => gotoIndex(state.index - 1);
  document.querySelector('#next-btn').onclick = () => gotoIndex(state.index + 1);

  // FIXED: add one row regardless of whether current rows are empty
  document.querySelector('#add-row').onclick = () => {
    const snap = snapshotAlcoholRows();           // keeps partial inputs
    renderAlcoholRows(snap.length + 1, snap);     // add one more
  };

  // Reset → exactly 1 blank row
  document.querySelector('#reset-rows').onclick = () => renderAlcoholRows(1);

  document.querySelector('#show-answer').onclick = () => showResult(false, ['(Revealed by user)'], state.key);
  document.querySelector('#quiz-form').onsubmit = (e) => { e.preventDefault(); compareAgainstKey(state.key); };

  const backBtn = document.getElementById('back-to-top');
  const sidebar = document.querySelector('.sidebar');
  const toggleBackBtn = () => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) { backBtn?.classList.remove('show'); return; }
    const pageScrolled = (document.documentElement.scrollTop || document.body.scrollTop) > 80;
    const listScrolled = sidebar && sidebar.scrollTop > 80;
    backBtn?.classList.toggle('show', pageScrolled || listScrolled);
  };
  const scrollBehavior = () => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');

  window.addEventListener('scroll', toggleBackBtn, { passive: true });
  sidebar?.addEventListener('scroll', toggleBackBtn, { passive: true });
  backBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
    sidebar?.scrollTo({ top: 0, behavior: scrollBehavior() });
  });
  toggleBackBtn();

    // Mobile: expand/minimise the bottom list to half-screen
  const toggleTop60 = document.getElementById('toggle-top60');
  if (toggleTop60){
    const isMobile = () => window.matchMedia('(max-width: 768px)').matches;
    const setHalf = (on) => {
      document.body.classList.toggle('list-half', on);
      toggleTop60.setAttribute('aria-pressed', String(on));
      toggleTop60.textContent = on ? 'Top 60 ▴' : 'Top 60 ▾';
    };
    toggleTop60.addEventListener('click', () => setHalf(!document.body.classList.contains('list-half')));

    // Ensure desktop always uses the left sidebar (no half mode)
    window.addEventListener('resize', () => { if (!isMobile()) setHalf(false); });
    // Initial state
    setHalf(false);
  }
}
bindUI();

// Guard submit until WASM is ready
const submitBtn = document.getElementById('submit-btn');
if (submitBtn) submitBtn.disabled = true;

if (window.Module){
  window.Module().then((Module) => {
    loadNamesAndRender(Module);
    if (submitBtn) submitBtn.disabled = false;
  });
} else {
  console.error('wasm/app.js not found. Build the C++ first.');
}