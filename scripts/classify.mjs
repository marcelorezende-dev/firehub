// ============================================================================
// FireHub — filename classification rules (shared, pure: no side effects).
// Used by build-catalog.mjs (fallback for un-frozen files) and by
// freeze-classification.mjs (to seed classification.json from the original
// Spanish/messy names before they were renamed).
// ============================================================================

export const TYPE_MAP = {
  '.pdf':  'PDF',
  '.doc':  'Word',  '.docx': 'Word',
  '.xls':  'Excel', '.xlsx': 'Excel', '.xlsb': 'Excel',
  '.ppt':  'PowerPoint', '.pptx': 'PowerPoint',
}
export const typeOf = (ext) => TYPE_MAP[ext.toLowerCase()] || 'File'

// category rules (first match wins)
export const CATEGORY_RULES = [
  ['Outcome Reports',               /outcome/i],
  ['Project Reporting & Management', /\bGCP\b|GLO[_ ]?1351|final report|narrative report|informe de actividades|informe consultor|deliverables description|indicators|_CRT|links to plenary|futerra/i],
  ['Training & Education',          /cartilha|cap[íi]tulo|guia curso|curso|course|fichas?_descriptivas|self[_ ]?assessment|assessment tool|^modelo|fire behavior course|\bS131\b/i],
  ['Concept Notes & Agendas',       /^nc[ _.]|nota concepto|nota de concepto|notaconcepto|concept note|annotated agenda|^agenda|methodology|annex.*(concept|agenda|methodolog)/i],
  ['Attendance & Participation',    /lista |listado|asistencia|attendance|listas de asistencia/i],
  ['Communication Products',        /comunicaci|infograf|\bredes\b|productos comunicaci/i],
  ['Dialogues & Workshops',         /di[áa]logo|taller|workshop|binacional|pan-amazon|side event|brainstorming|movilizaci[óo]n|plenar|intercultural|wtrex|exchange/i],
  ['Data & Technical',              /firedata|fdrs|algorithm|dataset|cicatrices|ews|mhews|fire module|mapa[_ ]?cooperaci|scce|^anexo|fuel material/i],
  ['Best Practices & Diagnostics',  /bestpractices|best practices|diagn[óo]stico|estudio mif|dimif|sistematizaci|executive summary|hallazgos|resumen|\bpaper\b/i],
  ['Country Reports & Roadmaps',    /roadmap|hoja de ruta|reporte comparativo|iniciativas de manejo|faoperu|informe jur[íi]dico|bolivia|per[úu]|colombia|ecuador/i],
]
export const CATEGORY_ORDER = CATEGORY_RULES.map(([c]) => c).concat('Other Deliverables')

export const categoryOf = (name) => {
  for (const [cat, re] of CATEGORY_RULES) if (re.test(name)) return cat
  return 'Other Deliverables'
}

export const COUNTRY_RULES = [
  ['Bolivia',  /bolivia|bol[íi]via/i],
  ['Peru',     /per[úu]\b|peru|faoperu|rioja/i],
  ['Colombia', /colombia|orinoqu|caribe|pac[íi]fico|monter[íi]a|valle del cauca|jimain/i],
  ['Ecuador',  /ecuador/i],
  ['Brazil',   /ipam|pnmif|cartilha|cap[íi]tulo|brasil|brazil|queimas|portugues/i],
  ['Regional', /pan-amazon|binacional|regional|lac\b|am[ée]rica latina|latin america|global|wtrex/i],
]
export const countriesOf = (name) => {
  const out = []
  for (const [c, re] of COUNTRY_RULES) if (re.test(name)) out.push(c)
  return out
}
