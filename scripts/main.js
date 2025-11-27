// ===== helpers =====
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);
const state = { index: 0, names: [], key: null };

function norm(s){ return (s||'').toLowerCase().replace(/[^\w\s&/-]/g,'').replace(/\s+/g,' ').trim(); }
function sameText(a,b){ return norm(a) === norm(b); }

// ===== GLASS KEY (grading map) =====
const GLASS_KEY = {
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

  "FRENCH 75": ["flute"],
  "APEROL SPRITZ": ["wine glass"],
  "LIMONCELLO SPRITZ": ["wine glass"],
  "ELDERFLOWER SPRITZ": ["wine glass"],

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

  "TOM COLLINS": ["collins"],
  "PALOMA": ["collins"],
  "LONG ISLAND ICED TEA": ["collins"],
  "DARK AND STORMY": ["collins"],
  "MAI TAI": ["collins"],
  "PINA COLADA": ["collins"],
  "PAINKILLER": ["collins"],
  "PI YI": ["collins"],

  "ZOMBIE": ["tiki"],

  "MOJITO": ["collins"],
  "CAIPIRINHA": ["rocks"],
  "CAPRIOSKA": ["rocks"],

  "MOSCOW MULE": ["camping mug"],
  "SINGAPORE SLING": ["collins"],
};

function setQuizDefaults(){
  // Ice -> (choose)
  const ice = document.getElementById('iceType');
  if (ice) {
    // safety: if someone forgot to add the placeholder, create it on the fly
    if (!ice.querySelector('option[value=""]')) {
      ice.insertBefore(new Option('(choose)', ''), ice.firstChild);
    }
    ice.value = ''; // select the placeholder
  }

  // Method -> shaken
  const methodShaken = document.querySelector('input[name="method"][value="shaken"]');
  if (methodShaken) methodShaken.checked = true;

  // Strain -> single
  const strainSingle = document.querySelector('input[name="strain"][value="single"]');
  if (strainSingle) strainSingle.checked = true;
}

function normalizeGlass(v){
  const x = norm(v);
  if (x === "n&n" || x === "nick n nora" || x === "nick nora") return "nick and nora";
  return x;
}
function glassMatches(user, allowed){
  const u = normalizeGlass(user);
  return allowed.some(opt => normalizeGlass(opt) === u);
}

// ===== UI bits =====
function updateTotalLabel() {
  const total = state.names.length || 0;
  const indexHdr = document.querySelector('.index');
  if (indexHdr) indexHdr.innerHTML = `#<span id="index-label">${state.index+1}</span>/${total}`;
}

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

  //print key to console
  console.log('KEY:', key.name, {
    require_muddled: key.require_muddled,
    with_soda: key.with_soda,
    with_ginger_beer: key.with_ginger_beer,
    with_grapefruit_soda: key.with_grapefruit_soda
  });
  // Header + index
  document.querySelector('#title').textContent = key.name;
  document.querySelector('#index-label').textContent = (state.index + 1);

  // Bitters note
  const note = document.querySelector('#bitters-note');
  if (key.bitters === 'peychaud’s bitters' || key.bitters === "peychaud's bitters") {
    note.hidden = false;
    note.textContent = 'Note: correct bitters is Peychaud’s (not available in dropdown).';
  } else {
    note.hidden = true;
  }

  // Start with 1 blank row
  renderAlcoholRows(1);

  // --- Default ALL inputs to their FIRST option/value in the DOM ---

  // Selects -> first option
  const selBitters = document.querySelector('#bitters');
  const selGlass   = document.querySelector('#glass');
  const selIce     = document.querySelector('#iceType');
  if (selBitters) selBitters.selectedIndex = 0;
  if (selGlass)   selGlass.selectedIndex   = 0;
  if (selIce)     selIce.selectedIndex     = 0;

  // Numeric inputs
  const dashes = document.querySelector('#dashes');
  if (dashes) dashes.value = 0;

  // Radios -> first radio in each group
  const checkFirstRadio = (name) => {
    const first = document.querySelector(`input[name="${name}"]`);
    if (first) first.checked = true;
  };
  checkFirstRadio('method');  // e.g., first of shaken/stirred/build
  checkFirstRadio('strain');  // e.g., first of single/double/dump/na

  // Checkboxes (extras) -> unchecked
  const cbMud  = document.getElementById('Muddled');
  const cbSoda = document.getElementById('extra-soda');
  const cbGing = document.getElementById('extra-ginger');
  const cbGrap = document.getElementById('extra-grapefruit');
  if (cbMud)  cbMud.checked  = false;
  if (cbSoda) cbSoda.checked = false;
  if (cbGing) cbGing.checked = false;
  if (cbGrap) cbGrap.checked = false;

  const noteBox = document.getElementById('method-note');
const stepsBox = document.getElementById('method-steps');

// Show method note / steps in the form (read-only)
  const noteBox = document.getElementById('method-note');
  const stepsOl = document.getElementById('method-steps');

  if (noteBox) {
    const hasNote = !!(key.method_note && key.method_note.trim());
    noteBox.hidden = !hasNote;
    noteBox.textContent = hasNote ? key.method_note : '';
  }
  if (stepsOl) {
    const steps = Array.isArray(key.method_steps) ? key.method_steps : [];
    stepsOl.hidden = steps.length === 0;
    stepsOl.innerHTML = steps.map(s => `<li>${s}</li>`).join('');
  }

  // Hide any previous result
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
    const methodLabel = key.method === 'build' ? 'build in glass' : key.method;
    lines.push(`<div><strong>Method:</strong> ${methodLabel}, <strong>Strain:</strong> ${key.strain || 'none'}</div>`);
    if (!key.skipGarnishCheck) lines.push(`<div><strong>Garnish:</strong> ${(key.garnish&&key.garnish.length)? key.garnish.join(' / ') : 'None'}</div>`);
    else lines.push(`<div><strong>Garnish:</strong> varies (accept any)</div>`);
    
    // Method note / steps (if supplied in key)
    if (key.method_note && key.method_note.trim()) {
      lines.push(`<div><strong>Method note:</strong> ${key.method_note}</div>`);
    }
    if (Array.isArray(key.method_steps) && key.method_steps.length) {
      lines.push(`<div><strong>Method steps:</strong></div>`);
      lines.push(`<ol style="margin:.25rem 0 0 1.25rem;">${
        key.method_steps.map(s => `<li>${s}</li>`).join('')
      }</ol>`);
    }

    const extras = [];
    if (key.with_soda) extras.push('soda');
    if (key.with_ginger_beer) extras.push('ginger beer');
    if (key.with_grapefruit_soda) extras.push('grapefruit soda');
    if (key.require_muddled) extras.push('muddled');

    if (extras.length){
      lines.push(`<div><strong>Extras:</strong> ${extras.join(', ')}</div>`);
    }
  }
  details.innerHTML = lines.join('');
  res.hidden = false;
}

function compareAgainstKey(key){
  if (!key){ alert("Still loading data. Try again in a moment."); return; }

  const diffs = [];
  const userAlcohols = collectAlcoholRows();

  if (!arraysEqualAsMultisets(userAlcohols, key.alcohols))
    diffs.push('Alcohol ingredients (ml + exact name) do not match.');

  const userBitters = $('#bitters').value;
  const userDashes = parseInt($('#dashes').value,10) || 0;
  if (key.bitters === 'peychaud’s bitters' || key.bitters === "peychaud's bitters"){
    diffs.push('Bitters: expected Peychaud’s (not available in dropdown).');
  } else {
    if (!sameText(userBitters, key.bitters)) diffs.push(`Bitters should be "${key.bitters}".`);
    if ((key.dashes||0) !== userDashes) diffs.push(`Dashes should be ${key.dashes||0}.`);
  }

  const userGlass = $('#glass')?.value || '';
  const allowed = GLASS_KEY[key.name];
  if (allowed && allowed.length){
    if (!userGlass) diffs.push('Select a glass type.');
    else if (!glassMatches(userGlass, allowed)) diffs.push(`Glassware should be ${allowed.join(' / ')}.`);
  }

  const userIce = $('#iceType')?.value || 'none';
  if (!sameText(userIce, key.ice)) diffs.push(`Ice should be "${key.ice}".`);

  // Method & Strain
  const userMethod = document.querySelector('input[name="method"]:checked')?.value || '';
  const userStrain = document.querySelector('input[name="strain"]:checked')?.value || '';

  if (!sameText(userMethod, key.method)) {
    diffs.push(`Method should be "${key.method === 'build' ? 'build in glass' : key.method}".`);
  } else {
    // If the method is BUILD, don't grade strain at all (strain not applicable)
    if (!sameText(key.method, 'build')) {
      if (!sameText(userStrain, key.strain)) {
        diffs.push(`Strain should be "${key.strain || 'none'}".`);
      }
    }
  }

  const userGarnish = $('#garnish').value;
  if (!key.skipGarnishCheck){
    const okGarnish = (key.garnish||[]).some(g => sameText(g, userGarnish));
    if (!okGarnish) diffs.push(`Garnish should be "${(key.garnish||[]).join(' / ')||'None'}".`);
  }

  const muddled = document.getElementById('Muddled')?.checked || false;
  const hasSoda = document.getElementById('extra-soda')?.checked || false;
  const hasGing = document.getElementById('extra-ginger')?.checked || false;
  const hasGrap = document.getElementById('extra-grapefruit')?.checked || false;

  if (key.require_muddled && !muddled) diffs.push('This drink should be muddled.');
  if (key.with_soda && !hasSoda) diffs.push('Top with soda.');
  if (key.with_ginger_beer && !hasGing) diffs.push('Add ginger beer.');
  if (key.with_grapefruit_soda && !hasGrap) diffs.push('Add grapefruit soda.');

  const ok = diffs.length === 0;
  showResult(ok, diffs, key);
}

// ===== WASM glue + list rendering =====
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

// ===== Bind UI =====
function bindUI(){
  $('#prev-btn').onclick = () => gotoIndex(state.index - 1);
  $('#next-btn').onclick = () => gotoIndex(state.index + 1);

  $('#add-row').onclick = () => {
    const snap = snapshotAlcoholRows();
    renderAlcoholRows(snap.length + 1, snap);
  };
  $('#reset-rows').onclick = () => renderAlcoholRows(1);

  $('#show-answer').onclick = () => showResult(false, ['(Revealed by user)'], state.key);
  $('#quiz-form').onsubmit = (e) => { e.preventDefault(); compareAgainstKey(state.key); };

  // Back-to-top uses the drawer (mobile) for extra scroll trigger
  const backBtn = document.getElementById('back-to-top');
  const sidebar = document.getElementById('mobile-drawer');
  const toggleBackBtn = () => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) { backBtn?.classList.remove('show'); return; }
    const pageScrolled = (document.documentElement.scrollTop || document.body.scrollTop) > 80;
    const listScrolled = sidebar && sidebar.scrollTop > 80;
    backBtn?.classList.toggle('show', pageScrolled || listScrolled);
  };
  const scrollBehavior = () =>
    (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');

  window.addEventListener('scroll', toggleBackBtn, { passive: true });
  sidebar?.addEventListener('scroll', toggleBackBtn, { passive: true });
  backBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
    sidebar?.scrollTo({ top: 0, behavior: scrollBehavior() });
  });
  toggleBackBtn();

  // Drawer open/close (mobile)
  const drawerBtn = document.getElementById('open-drawer');
  const backdrop  = document.getElementById('drawer-backdrop');

  function openDrawer(open){
    document.body.classList.toggle('drawer-open', open);
    drawerBtn?.setAttribute('aria-expanded', String(open));
    if (backdrop) backdrop.hidden = !open;

    // Lock background scroll while drawer is open
    document.documentElement.style.overflow = open ? 'hidden' : '';
    document.body.style.overflow = open ? 'hidden' : '';
  }

  drawerBtn?.addEventListener('click', () => {
    openDrawer(!document.body.classList.contains('drawer-open'));
  });
  backdrop?.addEventListener('click', () => openDrawer(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') openDrawer(false);
  });
  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width:769px)').matches) openDrawer(false);
  });
}
bindUI();

// ===== WASM boot =====
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