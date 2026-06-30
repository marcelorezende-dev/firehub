// ============================================================================
// FireHub — Learnings page logic.
// Summarised cards open a printable A4 one-pager per learning. Each learning has
// a project code  FH-<THEME>-<NN>  (THEME = POL/IND/CAP/DAT/REG/COM/KNO).
// Content lives in the L array; cite sources via SRC. Deep-link a one-pager with
// learnings.html#FH-POL-01.  Filter by type and theme.
// ============================================================================
(function () {
  // ---- metadata ------------------------------------------------------------
  const TYPES = {
    finding:  { label: 'Key finding',              pl: 'Key findings',              c: 'var(--color-gold)' },
    lesson:   { label: 'Lesson learned',           pl: 'Lessons learned',           c: 'var(--color-petrol-blue)' },
    practice: { label: 'Best practice',            pl: 'Best practices',            c: 'var(--color-forest)' },
    rec:      { label: 'Technical recommendation', pl: 'Technical recommendations', c: 'var(--accent)' },
  };
  const CLS = { finding: 't-finding', lesson: 't-lesson', practice: 't-practice', rec: 't-rec' };
  const THEMES = {
    policy:     'Policy, governance & coordination',
    indigenous: 'Indigenous Peoples & traditional knowledge',
    capacity:   'Capacity building & training',
    data:       'Fire data & early warning',
    regional:   'Regional cooperation',
    community:  'Community fire management',
    knowledge:  'Knowledge & communication',
  };
  const THEMECODE = { policy: 'POL', indigenous: 'IND', capacity: 'CAP', data: 'DAT', regional: 'REG', community: 'COM', knowledge: 'KNO' };
  // source key -> [filename in the catalogue, short label]
  const SRC = {
    comparative: ['01 - Comparative Report - IFM Initiatives in Bolivia & Peru (ES).docx', 'Comparative Report — Bolivia & Peru'],
    bolInd:      ['02 - IFM Initiatives & Indigenous Peoples - Bolivia (ES).docx', 'IFM & Indigenous Peoples — Bolivia'],
    peruInd:     ['03 - IFM Initiatives & Indigenous Peoples - Peru (ES).docx', 'IFM & Indigenous Peoples — Peru'],
    bolCountry:  ['04 - Country Report - Bolivia (ES).docx', 'Country Report — Bolivia'],
    peruCountry: ['05 - Country Report - Peru (ES).docx', 'Country Report — Peru'],
    peruRoad:    ['08 - Roadmap - Peru (ES).docx', 'Roadmap — Peru'],
    ifmPaper:    ['10 - Integrated Fire Management Paper.docx', 'IFM Paper (Pan-Amazon)'],
    panAmazon:   ['14 - Pan-Amazon Workshop Report (EN).docx', 'Pan-Amazon Workshop Report'],
    faoPeru:     ['FAO Peru - Report (ES).docx', 'FAO Peru — Report'],
    ecuador:     ['Ecuador Report - GCP GLO 1351 CAN (ES).docx', 'Ecuador Report'],
    diag:        ['Diagnostic & Roadmap - Summary (ES).docx', 'Diagnostic & Roadmap — Summary'],
    ews:         ['IFM LAC - EWS Cooperation Mapping - Progress Report.docx', 'EWS Cooperation Mapping — LAC'],
    assess:      ['GAC Report - IFM Assessment Tool.docx', 'IFM Assessment Tool — GAC Report'],
    mhews:       ['Activity 1222.2 - Fire Module for MHEWS.docx', 'Fire Module for MHEWS'],
  };

  // ---- the learnings (extracted from the deliverables) ---------------------
  // t = title (card summary) · x = description · why = why it matters · s = sources
  const L = [
    // Policy, governance & coordination
    { ty: 'finding', th: 'policy', rg: 'Peru', t: 'Prohibition-based law weakens prevention', x: 'Peru’s Penal Code criminalises burning without distinguishing traditional agricultural practices, prescribed burns and wildfire — limiting recognition of community-based fire management.', why: 'While all fire is treated as a crime, communities cannot legally practise the prevention burns that reduce catastrophic-fire risk.', s: ['peruCountry', 'ifmPaper'] },
    { ty: 'rec', th: 'policy', rg: 'Peru', t: 'Move from prohibition to regulation of fire use', x: 'Reform the legal framework so responsible and prescribed fire use is recognised. The draft “National IFM Strategy” bill is a real opportunity but still carries a punitive bias in its Penal Code amendments.', why: 'Legal recognition of prescribed and responsible fire is the enabling condition for almost every other IFM measure.', s: ['peruCountry', 'diag'] },
    { ty: 'finding', th: 'policy', rg: 'Peru', t: 'No single fire-management authority', x: 'Competencies are fragmented across national and subnational bodies (PCM/SINAGERD, SERFOR, firefighters, SERNANP), creating leadership tensions — the strongest field capacity (SERNANP) sits outside the formal lead.', why: 'Without a clear lead, prevention falls between mandates and the institutions with real field capacity are under-used.', s: ['peruCountry'] },
    { ty: 'rec', th: 'policy', rg: 'Bolivia', t: 'Update emergency-response laws to recognise all IFM actors', x: 'Revise Risk Management Law 602 and Firefighter Law 449 to reflect the different functional actors in fire response — built participatively with all of them.', why: 'Current laws omit several actors who actually respond to fire, leaving roles and responsibilities undefined during emergencies.', s: ['bolCountry'] },
    { ty: 'finding', th: 'policy', rg: 'Regional', t: 'Fire is framed mainly through disaster response', x: 'A reactive, emergency-first lens under-prioritises prevention, conservation and restoration. Peru’s multisectoral plan lacks restoration lines and IFM concepts; Ecuador remains suppression-dominant.', why: 'An emergency-only framing funds suppression but not the prevention and restoration that lower future fire risk.', s: ['peruCountry', 'ecuador'] },
    { ty: 'lesson', th: 'policy', rg: 'Peru', t: 'Subnational implementation is the weak link', x: 'Regional and local governments have very unequal resources; many lack fire plans, trained brigades and operational early warning. A “territorialisation” axis with prioritised, costed actions is needed.', why: 'National policy only changes outcomes if regions and municipalities have the plans, brigades and budget to act on it.', s: ['peruCountry', 'diag'] },
    { ty: 'rec', th: 'policy', rg: 'Bolivia', t: 'Fix regulations that incentivise deforestation', x: 'Strengthen IFM-focused policy and adapt norms that still leave gaps encouraging deforestation and agribusiness expansion.', why: 'Norms that reward land clearing pull against IFM, so prevention gains are erased upstream by the drivers of fire.', s: ['bolCountry'] },
    { ty: 'finding', th: 'policy', rg: 'Ecuador', t: 'Harmonise overlapping legal frameworks', x: 'The challenge is not integrating the Environmental Code (which carries IFM) with the newer disaster-risk law, but building operational mechanisms for coordinated application without overlapping mandates.', why: 'Two valid laws without operational bridges create duplication and gaps in the field, slowing coordinated action.', s: ['ecuador'] },

    // Indigenous Peoples & traditional knowledge
    { ty: 'finding', th: 'indigenous', rg: 'Regional', t: 'Indigenous Peoples are the first responders', x: 'Indigenous Peoples and local communities are first to face fire. Their centrality — as formal co-managers with direct access to resources and decisions — is a precondition for IFM to consolidate.', why: 'Programmes that bypass the people already managing fire forfeit their knowledge, reach and legitimacy.', s: ['comparative', 'ifmPaper'] },
    { ty: 'finding', th: 'indigenous', rg: 'Regional', t: 'Cultural fire use is not catastrophic wildfire', x: 'Traditional fire-use practices can reduce fuel loads and prevent large-scale fires when integrated into IFM — the opposite of treating all fire as a threat to suppress.', why: 'Banning all fire removes a low-cost prevention tool and criminalises livelihoods, raising both conflict and risk.', s: ['ifmPaper'] },
    { ty: 'practice', th: 'indigenous', rg: 'Bolivia', t: 'Recover and integrate ancestral fire knowledge', x: 'In ANMI San Matías, Ayoreo and Chiquitano fire knowledge is documented and integrated into Fire Management Plans (PMIF), turning fire from a threat into a regulated tool.', why: 'Codifying traditional practice into management plans makes it transferable, defensible and scalable.', s: ['bolInd'] },
    { ty: 'practice', th: 'indigenous', rg: 'Bolivia', t: 'Safe-burning techniques fused with tradition', x: 'Torches (“hisopos”) and firebreaks around plots combine with the traditional “chaqueo” to protect food security without degrading the forest.', why: 'Pairing simple techniques with an existing practice protects food security at near-zero cost and high adoption.', s: ['bolInd'] },
    { ty: 'practice', th: 'indigenous', rg: 'Bolivia', t: 'Climate-adapted traditional calendars', x: 'Through technical dialogue, Chiquitanía farmers shifted sowing later (December rather than November), using weather-station data to validate traditional soil-moisture knowledge.', why: 'Traditional calendars are shifting with the climate; blending them with weather data keeps burns safe.', s: ['bolInd'] },
    { ty: 'lesson', th: 'indigenous', rg: 'Peru', t: 'Community fire knowledge is not yet in policy', x: 'Andean and Amazonian fire-control techniques remain unrecognised. Isolated successes (CARE on the Ene river; SERNANP’s “prevention backpack”) must be systematised into policy instruments.', why: 'Proven local methods stay one-off pilots until policy recognises, standardises and resources them.', s: ['peruCountry', 'peruInd'] },

    // Capacity building & training
    { ty: 'lesson', th: 'capacity', rg: 'Peru', t: 'Build capacity progressively in the same territory', x: 'Capacity building is most effective when consolidated from basic to intermediate to advanced levels in one territory, rather than through one-off courses.', why: 'Single courses fade; a basic→advanced pathway in one place builds lasting local capability.', s: ['faoPeru'] },
    { ty: 'rec', th: 'capacity', rg: 'Peru', t: 'Site advanced courses at inter-regional “nodes”', x: 'Qualified candidates for specialised training are scarce — locate advanced courses at strategic hubs between regions to cut logistics costs and maximise reach.', why: 'Concentrating scarce qualified trainees at hubs delivers more trained responders per dollar spent.', s: ['faoPeru'] },
    { ty: 'rec', th: 'capacity', rg: 'Bolivia', t: 'Standardise and certify firefighter training', x: 'Public policy should standardise forest-firefighter courses and certify instructors so responders “speak the same technical language.” Peru’s 2024 standardised curriculum is a positive precedent.', why: 'A shared curriculum and certification let responders coordinate safely across institutions and borders.', s: ['bolCountry', 'peruCountry'] },
    { ty: 'lesson', th: 'capacity', rg: 'Peru', t: 'Partner with actors permanently in the territory', x: 'Anchoring training to institutions with direct, ongoing landscape management enables post-course follow-up and continuity of the process.', why: 'Institutions rooted in the landscape sustain the process after the project and external trainers leave.', s: ['faoPeru'] },

    // Fire data & early warning
    { ty: 'rec', th: 'data', rg: 'Regional', t: 'Make alerts actionable, not just accurate', x: '“Technical excellence is useless if the alert does not reach the community in an actionable format.” Translate metrics (e.g. FWI > 30) into culturally appropriate guidance, disseminated via WhatsApp, radio and SMS.', why: 'An accurate alert no one can act on prevents no fire; the “last mile” is where risk is actually reduced.', s: ['ews'] },
    { ty: 'finding', th: 'data', rg: 'Ecuador', t: 'Community-adapted EWS tools are scarce', x: 'Technical fire-danger systems exist but are often inaccessible or unintelligible to local actors, limiting their use in prevention — technical information must be translated into territorially relevant formats.', why: 'If local actors cannot read the warning, the investment in monitoring never converts into prevention.', s: ['ecuador', 'ews'] },
    { ty: 'practice', th: 'data', rg: 'Regional', t: 'Embed a fire module in multi-hazard early warning', x: 'A fire module is being developed within existing multi-hazard early-warning systems (MHEWS), aligned with the “Early Warnings for All” agenda.', why: 'Embedding fire in existing multi-hazard systems leverages infrastructure and reaches communities already served.', s: ['mhews', 'ecuador'] },

    // Regional cooperation
    { ty: 'finding', th: 'regional', rg: 'Regional', t: 'Fire is transboundary — act regionally', x: 'Isolated national responses are insufficient. Regional coordination needs interoperable systems and harmonised protocols across borders.', why: 'Smoke, fire and their drivers cross borders; uncoordinated national systems leave shared landscapes exposed.', s: ['ifmPaper'] },
    { ty: 'rec', th: 'regional', rg: 'Regional', t: 'Create a permanent Pan-Amazon mechanism', x: 'Establish a standing forum and Executive Committee to deliver prioritised multisectoral actions, articulated through a Pan-Amazon Fire Hub.', why: 'Workshops fade without a standing body to carry agreed priorities into actual delivery.', s: ['panAmazon'] },
    { ty: 'lesson', th: 'regional', rg: 'Regional', t: 'Plan for language and cross-country differences', x: 'Bilingual (Spanish/Portuguese) facilitation worked best by starting discussions within countries, then moving to mixed thematic groups.', why: 'Facilitation design determines whether a multi-country exchange actually produces shared agreements.', s: ['panAmazon'] },
    { ty: 'practice', th: 'regional', rg: 'Peru', t: 'Replicate proven national tools across borders', x: 'SERNANP’s community “fire-prevention backpack” has been replicated in other countries of the region.', why: 'Adapting a working national tool is faster and cheaper than building one from scratch in each country.', s: ['peruCountry'] },

    // Community fire management
    { ty: 'rec', th: 'community', rg: 'Peru', t: 'Formally recognise and support community brigades', x: 'Design State mechanisms (economic incentives or social benefits) plus clear rapid-response protocols that integrate community brigades, with defined action routes and timely resources.', why: 'Volunteer brigades are the front line; without recognition, incentives and protocols their effort is unsustainable.', s: ['peruRoad'] },
    { ty: 'lesson', th: 'community', rg: 'Ecuador', t: 'Clarify the brigade role beyond “combat”', x: 'Persistent perceptions tie community brigades to firefighting. Sensitisation is needed to position them in prevention, monitoring, responsible fire use and community risk management.', why: 'Framing brigades only as firefighters creates safety risks and wastes their prevention and monitoring value.', s: ['ecuador'] },
    { ty: 'finding', th: 'community', rg: 'Regional', t: 'Fewer hotspots ≠ lower structural risk', x: 'Vulnerability stays high under forest degradation, agricultural expansion and climate change. Prevention must be structural, not just suppression of active fires.', why: 'Counting active fires hides the structural drivers; prevention must target degradation and land use, not just flames.', s: ['ifmPaper'] },
    { ty: 'rec', th: 'community', rg: 'Bolivia', t: 'Channel equipment to communities', x: 'Public policy should resource community-level fire management directly, equipping the actors who respond first.', why: 'Communities respond first but often lack basic gear; equipping them is among the highest-leverage investments.', s: ['bolCountry'] },

    // Knowledge & communication
    { ty: 'practice', th: 'knowledge', rg: 'Regional', t: 'Start assessments with country-level pre-work', x: 'Giving stakeholders a shared baseline “snapshot” before workshops markedly improved the IFM self-assessment tool; guiding questions were simplified for broader use.', why: 'A shared starting picture turns workshops from information-gathering into genuine prioritisation.', s: ['assess'] },
    { ty: 'lesson', th: 'knowledge', rg: 'Peru', t: 'Frame the message constructively', x: 'Recognising existing institutional progress — not only gaps — is critical to dialogue. Inter-institutional articulation needs realistic timelines, especially amid political instability.', why: 'Institutions engage when their progress is acknowledged; a gaps-only framing triggers defensiveness and stalls reform.', s: ['faoPeru'] },
    { ty: 'rec', th: 'knowledge', rg: 'Ecuador', t: 'Connect science to decision-making', x: 'Research is dispersed and weakly linked to policy. Permanent coordination (e.g. Ecuador’s RICMIF research network under the ANIMIF agenda) is needed to channel research to strategic needs.', why: 'Research that never reaches decision-makers cannot improve fire outcomes; a standing interface fixes the disconnect.', s: ['ecuador'] },
    { ty: 'lesson', th: 'knowledge', rg: 'Regional', t: 'Sustainability needs dedicated budget lines', x: 'Without specific budget allocations and institutionalised mechanisms, gains in training, brigade equipment and coordination bodies risk fading in the medium term.', why: 'Without recurrent funding, training, equipment and coordination bodies decay once project support ends.', s: ['ecuador'] },
  ];

  // ---- project numbering: FH-<THEME>-<NN> (sequence within theme) -----------
  const seq = {};
  L.forEach((d) => { seq[d.th] = (seq[d.th] || 0) + 1; d.code = `FH-${THEMECODE[d.th]}-${String(seq[d.th]).padStart(2, '0')}`; });

  // ---- render --------------------------------------------------------------
  if (!document.getElementById('learngrid')) return; // only runs on the Learnings page
  const docIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>`;
  const href = (f) => encodeURI('GAC deliverables/' + f);
  const srcLinks = (d) => d.s.map((k) => `<a class="lsrc" href="${href(SRC[k][0])}" download title="${SRC[k][0]}">${docIcon}${SRC[k][1]}</a>`).join('');
  const state = { types: new Set(), themes: new Set() };

  // summary chips (counts per type)
  const counts = {}; L.forEach((d) => counts[d.ty] = (counts[d.ty] || 0) + 1);
  document.getElementById('learnSummary').innerHTML = Object.entries(TYPES)
    .map(([k, m]) => `<span class="lsum"><i style="background:${m.c}"></i><b>${counts[k] || 0}</b> ${m.pl}</span>`).join('');

  // filter chips
  function mkChip(wrap, label, on) {
    const el = document.createElement('button');
    el.className = 'lchip'; el.type = 'button'; el.textContent = label; el.setAttribute('aria-pressed', 'false');
    el.addEventListener('click', () => { on(el.getAttribute('aria-pressed') !== 'true'); render(); });
    wrap.appendChild(el);
  }
  const typeWrap = document.getElementById('typeFilter');
  const themeWrap = document.getElementById('themeFilter');
  Object.entries(TYPES).forEach(([k, m]) => mkChip(typeWrap, m.label, (v) => v ? state.types.add(k) : state.types.delete(k)));
  Object.entries(THEMES).forEach(([k, label]) => mkChip(themeWrap, label, (v) => v ? state.themes.add(k) : state.themes.delete(k)));

  const grid = document.getElementById('learngrid');
  const countEl = document.getElementById('learnCount');
  const resetEl = document.getElementById('learnReset');
  resetEl.addEventListener('click', () => { state.types.clear(); state.themes.clear(); render(); });

  function syncChips() {
    [...typeWrap.querySelectorAll('.lchip')].forEach((el) => el.setAttribute('aria-pressed', state.types.has(Object.keys(TYPES).find((k) => TYPES[k].label === el.textContent)) ? 'true' : 'false'));
    [...themeWrap.querySelectorAll('.lchip')].forEach((el) => el.setAttribute('aria-pressed', state.themes.has(Object.keys(THEMES).find((k) => THEMES[k] === el.textContent)) ? 'true' : 'false'));
  }

  // ---- summarised card -----------------------------------------------------
  function card(d, i) {
    return `<article class="learn ${CLS[d.ty]}" tabindex="0" role="button" data-i="${i}" aria-label="Open one-pager ${d.code}: ${d.t}">
      <div class="learn-top"><span class="lcode">${d.code}</span><span class="ltype">${TYPES[d.ty].label}</span></div>
      <h4>${d.t}</h4>
      <div class="lfoot"><span class="ltag">${THEMES[d.th]}</span><span class="ltag region">${d.rg}</span><span class="lopen">One-pager →</span></div>
    </article>`;
  }

  function render() {
    syncChips();
    const items = L.map((d, i) => [d, i]).filter(([d]) => (!state.types.size || state.types.has(d.ty)) && (!state.themes.size || state.themes.has(d.th)));
    grid.innerHTML = items.length ? items.map(([d, i]) => card(d, i)).join('') : '<p style="color:var(--text-muted)">No learnings match the current filters.</p>';
    countEl.textContent = `Showing ${items.length} of ${L.length}`;
    resetEl.hidden = !(state.types.size || state.themes.size);
  }

  // ---- A4 one-pager --------------------------------------------------------
  const overlay = document.getElementById('sheetOverlay');
  const sheet = document.getElementById('sheet');
  const FAO = 'resources/fire-hub-identity/assets/identity/fao-logo-white.png';

  const TYPE_BADGE = { finding: 'st-finding', lesson: 'st-lesson', practice: 'st-practice', rec: 'st-rec' };
  function openSheet(d) {
    sheet.innerHTML = `
      <div class="sheet-band">
        <img src="${FAO}" alt="FAO">
        <div class="sb-r"><span class="sheet-kicker">FireHub Learnings register · ${THEMES[d.th]}</span><span class="sheet-code">${d.code}</span></div>
      </div>
      <div class="sheet-body">
        <span class="badge-st ${TYPE_BADGE[d.ty]}">${TYPES[d.ty].label}</span>
        <h1>${d.t}</h1>
        <div class="sheet-tags">${THEMES[d.th]} &nbsp;·&nbsp; ${d.rg}</div>
        <h2>Summary</h2><p>${d.x}</p>
        <h2>Why it matters</h2><p>${d.why}</p>
        <h2>Source documents</h2><div class="sheet-srcs">${srcLinks(d)}</div>
        <p class="sheet-foot">MARVEL · Learning layer · FAO Global Fire Management Hub · Integrated Fire Management (GCP/GLO/1351/CAN, Global Affairs Canada). Distilled from the cited project deliverables.</p>
      </div>`;
    overlay.hidden = false;
    document.body.classList.add('sheet-open');
    if (location.hash.slice(1) !== d.code) history.replaceState(null, '', '#' + d.code);
    overlay.scrollTop = 0;
    document.getElementById('sheetClose').focus();
  }

  function closeSheet() {
    overlay.hidden = true;
    document.body.classList.remove('sheet-open');
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  }

  grid.addEventListener('click', (e) => { const el = e.target.closest('.learn'); if (el) openSheet(L[+el.dataset.i]); });
  grid.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('learn')) { e.preventDefault(); openSheet(L[+e.target.dataset.i]); }
  });
  document.getElementById('sheetClose').addEventListener('click', closeSheet);
  document.getElementById('sheetPrint').addEventListener('click', () => window.print());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSheet(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !overlay.hidden) closeSheet(); });

  render();

  // deep-link: open a one-pager directly via #FH-POL-01
  const fromHash = decodeURIComponent(location.hash.slice(1));
  if (fromHash) { const d = L.find((x) => x.code === fromHash); if (d) openSheet(d); }
})();
