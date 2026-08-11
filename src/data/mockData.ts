import type {
  DeliveryOption,
  CodeItem,
  Discount,
  ProductRule,
  OrderProcedure,
  ReturnProcedure,
  SystemItem,
  Contact,
  UpdateItem,
  SearchableItem,
  AppData,
} from '../types'

const STORAGE_KEY = 'ilva-app-data'

function loadOverride(): AppData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AppData
  } catch {
    return null
  }
}

const override = loadOverride()

const _deliveryOptions: DeliveryOption[] = [
  {
    id: 'hemleverans-015',
    name: 'Hemleverans till trottoarkant (Närområde)',
    code: '015',
    price: 599,
    priceDisplay: '599 kr',
    deliveryTime: 'Bokbart datum vid beställning',
    description: 'Leverans till trottoar- eller tomtgräns. Kunden väljer specifikt datum vid beställning.',
    situations: ['Möbler inom 015-området', 'Kunden vill boka exakt datum'],
    notes: ['Trottoar/tomtgräns', 'Specifikt datum vid beställning', 'Postnummer 200 00 – 313 95'],
    coverage: 'Postnummer 200 00 – 313 95',
    cities: ['Malmö', 'Lund', 'Helsingborg', 'Landskrona', 'Eslöv', 'Höör', 'Hörby', 'Ystad', 'Trelleborg', 'Svedala', 'Staffanstorp', 'Vellinge', 'Ängelholm', 'Båstad', 'Halmstad'],
    postalRanges: [[20000, 31395]],
    keywords: ['015', 'hemleverans', 'trottoarkant', 'närområde', 'malmö', 'lund', 'halmstad'],
  },
  {
    id: 'bring-012',
    name: 'Bring Hemleverans',
    code: '012',
    price: 699,
    priceDisplay: '699 kr',
    deliveryTime: 'SMS inom 2–3 arbetsdagar för bokning',
    description: 'Transporteras via Brings terminal. Kunden får SMS inom 2–3 arbetsdagar för att boka datum.',
    situations: ['Övriga Sverige inom 012-området', 'Bring-täckning'],
    notes: ['Brings terminal', 'SMS bokning 2–3 arbetsdagar', 'Postnummer 100 00 – 199 99 och 313 96 – 769 99'],
    coverage: 'Postnummer 100 00 – 199 99 och 313 96 – 769 99',
    cities: ['Stockholm', 'Uppsala', 'Västerås', 'Örebro', 'Linköping', 'Norrköping', 'Jönköping', 'Borås', 'Göteborg', 'Trollhättan', 'Uddevalla', 'Karlstad', 'Växjö', 'Kalmar', 'Karlskrona', 'Gävle', 'Sundsvall', 'Falun', 'Luleå', 'Umeå'],
    postalRanges: [[10000, 19999], [31396, 76999]],
    keywords: ['012', 'bring', 'hemleverans', 'stockholm', 'göteborg', 'umeå'],
  },
  {
    id: 'inbarning-015',
    name: 'Inbärning (Närområde)',
    code: '010',
    price: 599,
    priceDisplay: '599 kr',
    deliveryTime: 'Bokas tillsammans med 015',
    description: 'Inbärning i bostad. Endast tillgänglig inom 015-området.',
    situations: ['Möbler som ska bäras in i bostaden', 'Närområde 015'],
    notes: ['Inbärning i bostad', 'Endast inom 015-området', 'Gäller med hemleverans 015'],
    coverage: 'Postnummer 200 00 – 313 95',
    cities: ['Malmö', 'Lund', 'Helsingborg', 'Landskrona', 'Eslöv', 'Höör', 'Hörby', 'Ystad', 'Trelleborg', 'Svedala', 'Staffanstorp', 'Vellinge', 'Ängelholm', 'Båstad', 'Halmstad'],
    postalRanges: [[20000, 31395]],
    keywords: ['010', 'inbärning', 'närområde', '015', 'malmö', 'halmstad'],
  },
  {
    id: 'inbarning-012',
    name: 'Inbärning (Bring)',
    code: '022',
    price: 699,
    priceDisplay: '699 kr',
    deliveryTime: 'Bokas tillsammans med 012',
    description: 'Inbärning i bostad. Endast tillgänglig inom 012-området.',
    situations: ['Möbler som ska bäras in i bostaden', 'Bring-området 012'],
    notes: ['Inbärning i bostad', 'Endast inom 012-området', 'Gäller med Bring 012'],
    coverage: 'Postnummer 100 00 – 199 99 och 313 96 – 769 99',
    cities: ['Stockholm', 'Uppsala', 'Västerås', 'Örebro', 'Linköping', 'Norrköping', 'Jönköping', 'Borås', 'Göteborg', 'Trollhättan', 'Uddevalla', 'Karlstad', 'Växjö', 'Kalmar', 'Karlskrona', 'Gävle', 'Sundsvall', 'Falun', 'Luleå', 'Umeå'],
    postalRanges: [[10000, 19999], [31396, 76999]],
    keywords: ['022', 'inbärning', 'bring', '012', 'stockholm', 'göteborg'],
  },
  {
    id: 'hämtning-030',
    name: 'Hämtning i butik',
    code: '030',
    price: 0,
    priceDisplay: '0 kr',
    deliveryTime: 'När ordern är redo',
    description: 'Kunden hämtar själv i vald butik när ordern är redo.',
    situations: ['Kunden vill spara frakt', 'Bor nära butik', 'Mindre möbler'],
    notes: ['Kostnadsfritt', 'Kunden hämtar själv', 'Gäller alla butiker'],
    coverage: 'Alla butiker',
    cities: ['Alla ILVA-butiker'],
    postalRanges: [],
    keywords: ['030', 'hämtning', 'butik', 'gratis', 'click and collect'],
  },
  {
    id: 'montering',
    name: 'Montering',
    code: 'Montering',
    price: 0,
    priceDisplay: 'Se offert',
    deliveryTime: 'Bokas separat',
    description: 'Sök på "Montering" i systemet och välj motsvarande möbelgrupp.',
    situations: ['Kunden vill ha hjälp att montera', 'Större möbelgrupper'],
    notes: ['Sök "Montering" i systemet', 'Välj möbelgrupp', 'Offert/pris visas i kassan'],
    coverage: 'Tillgängligt i kassan',
    cities: ['Alla butiker'],
    keywords: ['montering', 'tillägg', 'offert', 'möbelgrupp'],
  },
  {
    id: 'bortforsling',
    name: 'Bortforsling',
    code: 'Bortf',
    price: 0,
    priceDisplay: 'Se offert',
    deliveryTime: 'Bokas separat',
    description: 'Sök på "Bortf" i sökfältet eller sök direkt på produktens artikelnummer.',
    situations: ['Kunden vill bli av med gammal möbel', 'Byte mot nytt'],
    notes: ['Sök "Bortf"', 'Använd artikelnummer', 'Offert/pris visas i kassan'],
    coverage: 'Tillgängligt i kassan',
    cities: ['Alla butiker'],
    keywords: ['bortforsling', 'bortf', 'tillägg', 'artikelnummer'],
  },
]

const _codes: CodeItem[] = [
  {
    id: 'c1',
    code: 'DEMO-DELIVERY-01',
    name: 'Standardleverans',
    category: 'Leverans',
    description: 'Demo-kod för standardleverans av möbler.',
    whenToUse: 'När kunden köper vanliga möbler som ska levereras hem.',
    whenNotToUse: 'Använd inte för specialbyggda varor eller fjärrkunder.',
    related: 'Hemleverans, Specialleverans',
    keywords: ['leverans', 'standard', 'kod'],
  },
  {
    id: 'c2',
    code: 'DEMO-DELIVERY-02',
    name: 'Hemleverans',
    category: 'Leverans',
    description: 'Demo-kod för hemleverans in i rummet.',
    whenToUse: 'Större möbler där kunden vill ha hjälp in i rummet.',
    whenNotToUse: 'Använd inte utan bokad leveranstid.',
    related: 'Standardleverans',
    keywords: ['hemleverans', 'kod', 'soffa'],
  },
  {
    id: 'c3',
    code: 'DEMO-RETURN-01',
    name: 'Retur standard',
    category: 'Retur',
    description: 'Demo-kod för att registrera en vanlig retur.',
    whenToUse: 'Vid retur inom 14 dagar från mottagande.',
    whenNotToUse: 'Ej vid skada eller reklamation.',
    related: 'Reklamation',
    keywords: ['retur', 'återlämning', 'kod'],
  },
  {
    id: 'c4',
    code: 'DEMO-DISCOUNT-01',
    name: 'Säljarrabatt',
    category: 'Rabatt',
    description: 'Demo-kod för att registrera säljarrabatt i kassan.',
    whenToUse: 'När kunden begär rabatt inom säljarens gräns.',
    whenNotToUse: 'Ej om beloppet överstiger säljarrabattgränsen.',
    related: 'Rabatter',
    keywords: ['rabatt', 'säljare', 'kod'],
  },
  {
    id: 'c5',
    code: 'DEMO-ORDER-01',
    name: 'Beställningsvara',
    category: 'Order',
    description: 'Demo-kod för beställningsvara som inte finns på lager.',
    whenToUse: 'När kunden beställer en vara som ska tas hem.',
    whenNotToUse: 'Ej för direktlevererade lagervaror.',
    related: 'Beställningar',
    keywords: ['beställning', 'lager', 'kod'],
  },
  {
    id: 'c6',
    code: 'DEMO-PAY-01',
    name: 'Delbetalning',
    category: 'Betalning',
    description: 'Demo-kod för delbetalningsalternativ.',
    whenToUse: 'När kunden vill dela upp betalningen.',
    whenNotToUse: 'Kontrollera kreditprövning innan kod används.',
    related: 'Betalning',
    keywords: ['betalning', 'delbetalning', 'kod'],
  },
  {
    id: 'c7',
    code: 'DEMO-SYS-01',
    name: 'ERP-kod',
    category: 'System',
    description: 'Demo-kod för manuell registrering i affärssystemet.',
    whenToUse: 'När kassan inte kan hitta artikeln.',
    whenNotToUse: 'Fråga alltid manager vid osäkerhet.',
    related: 'System',
    keywords: ['erp', 'system', 'kod'],
  },
]

const _discounts: Discount[] = [
  { id: 'rule-ax', section: 'rule', name: 'Finns ej max rabatt i AX', value: 'Använd översikt', description: 'Om det inte finns en max rabatt i AX, använd denna rabattöversikt.', requiresApproval: false, examples: [], keywords: ['regel', 'ax', 'maxrabatt'] },
  { id: 'rule-fast', section: 'rule', name: 'Fast lav pris', value: '0 %', description: 'Det får ALDRIG ges rabatt på "Fast lav pris"-produkter.', requiresApproval: false, examples: [], keywords: ['fast lav pris', 'nej rabatt'] },
  { id: 'rule-fallback', section: 'rule', name: 'Generell regel', value: '25 %', description: 'Hittar du fortsatt inte varan bland kategorier eller serier, får du ge 25 % rabatt.', requiresApproval: false, examples: [], keywords: ['regel', '25%', 'generell'] },

  { id: 'cat-sofaer', section: 'category', name: 'Sofaer', value: '25 %', description: 'Max rabatt för sofaer.', requiresApproval: false, examples: [], keywords: ['soffa', '25%'] },
  { id: 'cat-lænestole', section: 'category', name: 'Lænestole', value: '25 %', description: 'Max rabatt för lænestole.', requiresApproval: false, examples: [], keywords: ['lænestol', '25%'] },
  { id: 'cat-sofaborde', section: 'category', name: 'Sofaborde', value: '25 %', description: 'Max rabatt för sofaborde.', requiresApproval: false, examples: [], keywords: ['sofaborde', '25%'] },
  { id: 'cat-sovesofaer', section: 'category', name: 'Sovesofaer', value: '25 %', description: 'Max rabatt för sovesofaer.', requiresApproval: false, examples: [], keywords: ['sovesofa', '25%'] },
  { id: 'cat-spiseborde', section: 'category', name: 'Spiseborde', value: '25 %', description: 'Max rabatt för spiseborde.', requiresApproval: false, examples: [], keywords: ['spisebord', '25%'] },
  { id: 'cat-spisebordsstole', section: 'category', name: 'Spisebordsstole', value: '25 %', description: 'Max rabatt för spisebordsstole.', requiresApproval: false, examples: [], keywords: ['spisebordsstole', '25%'] },
  { id: 'cat-opbevaringsmøbler', section: 'category', name: 'Opbevaringsmøbler', value: '25 %', description: 'Max rabatt för opbevaringsmøbler.', requiresApproval: false, examples: [], keywords: ['opbevaringsmøbler', '25%'] },
  { id: 'cat-skriveborde', section: 'category', name: 'Skriveborde', value: '25 %', description: 'Max rabatt för skriveborde.', requiresApproval: false, examples: [], keywords: ['skrivebord', '25%'] },
  { id: 'cat-kontorstole', section: 'category', name: 'Kontorstole', value: '25 %', description: 'Max rabatt för kontorstole.', requiresApproval: false, examples: [], keywords: ['kontorstol', '25%'] },
  { id: 'cat-entrémøbler', section: 'category', name: 'Entrémøbler', value: '25 %', description: 'Max rabatt för entrémøbler.', requiresApproval: false, examples: [], keywords: ['entrémøbler', '25%'] },
  { id: 'cat-havemøbler', section: 'category', name: 'Havemøbler', value: '25 %', description: 'Max rabatt för havemøbler.', requiresApproval: false, examples: [], keywords: ['havemøbler', '25%'] },
  { id: 'cat-lamper', section: 'category', name: 'Lamper', value: '25 %', description: 'Max rabatt för lamper.', requiresApproval: false, examples: [], keywords: ['lampor', '25%'] },
  { id: 'cat-tæpper', section: 'category', name: 'Tæpper', value: '25 %', description: 'Max rabatt för tæpper.', requiresApproval: false, examples: [], keywords: ['mattor', '25%'] },
  { id: 'cat-spejle', section: 'category', name: 'Spejle', value: '25 %', description: 'Max rabatt för spejle.', requiresApproval: false, examples: [], keywords: ['spegel', '25%'] },

  { id: 'ser-air', section: 'series', name: 'Air', value: '30 %', description: 'Max rabatt för Air-serien.', requiresApproval: false, examples: [], keywords: ['air', 'serie'] },
  { id: 'ser-arrow', section: 'series', name: 'Arrow', value: '30 %', description: 'Max rabatt för Arrow-serien.', requiresApproval: false, examples: [], keywords: ['arrow', 'serie'] },
  { id: 'ser-angolo', section: 'series', name: 'Angolo', value: '30 %', description: 'Max rabatt för Angolo-serien.', requiresApproval: false, examples: [], keywords: ['angolo', 'serie'] },
  { id: 'ser-besalu', section: 'series', name: 'Besalu', value: '30 %', description: 'Max rabatt för Besalu-serien.', requiresApproval: false, examples: [], keywords: ['besalu', 'serie'] },
  { id: 'ser-galena', section: 'series', name: 'Galena', value: '40 %', description: 'Max rabatt för Galena-serien.', requiresApproval: false, examples: [], keywords: ['galena', 'serie'] },
  { id: 'ser-curve', section: 'series', name: 'Curve', value: '30 %', description: 'Max rabatt för Curve-serien.', requiresApproval: false, examples: [], keywords: ['curve', 'serie'] },
  { id: 'ser-flex', section: 'series', name: 'Flex', value: '30 %', description: 'Max rabatt för Flex-serien.', requiresApproval: false, examples: [], keywords: ['flex', 'serie'] },
  { id: 'ser-flexlux', section: 'series', name: 'Flexlux', value: '30 %', description: 'Max rabatt för Flexlux-serien.', requiresApproval: false, examples: [], keywords: ['flexlux', 'serie'] },
  { id: 'ser-kingston', section: 'series', name: 'Kingston', value: '30 %', description: 'Max rabatt för Kingston-serien.', requiresApproval: false, examples: [], keywords: ['kingston', 'serie'] },
  { id: 'ser-landholm', section: 'series', name: 'Landholm', value: '30 %', description: 'Max rabatt för Landholm-serien.', requiresApproval: false, examples: [], keywords: ['landholm', 'serie'] },
  { id: 'ser-larvik', section: 'series', name: 'Larvik', value: '30 %', description: 'Max rabatt för Larvik-serien.', requiresApproval: false, examples: [], keywords: ['larvik', 'serie'] },
  { id: 'ser-lean', section: 'series', name: 'Lean', value: '40 %', description: 'Max rabatt för Lean-serien.', requiresApproval: false, examples: [], keywords: ['lean', 'serie'] },
  { id: 'ser-mistral', section: 'series', name: 'Mistral Kubus', value: '30 %', description: 'Max rabatt för Mistral Kubus-serien.', requiresApproval: false, examples: [], keywords: ['mistral kubus', 'serie'] },
  { id: 'ser-molino', section: 'series', name: 'Molino', value: '30 %', description: 'Max rabatt för Molino-serien.', requiresApproval: false, examples: [], keywords: ['molino', 'serie'] },
  { id: 'ser-nordstrom', section: 'series', name: 'Nordstrom', value: '30 %', description: 'Max rabatt för Nordstrom-serien.', requiresApproval: false, examples: [], keywords: ['nordstrom', 'serie'] },
  { id: 'ser-nyland', section: 'series', name: 'Nyland', value: '40 %', description: 'Max rabatt för Nyland-serien.', requiresApproval: false, examples: [], keywords: ['nyland', 'serie'] },
  { id: 'ser-richmond', section: 'series', name: 'Richmond', value: '30 %', description: 'Max rabatt för Richmond-serien.', requiresApproval: false, examples: [], keywords: ['richmond', 'serie'] },
  { id: 'ser-richmont', section: 'series', name: 'Richmont', value: '30 %', description: 'Max rabatt för Richmont-serien.', requiresApproval: false, examples: [], keywords: ['richmont', 'serie'] },
  { id: 'ser-runar', section: 'series', name: 'Runar', value: '30 %', description: 'Max rabatt för Runar-serien.', requiresApproval: false, examples: [], keywords: ['runar', 'serie'] },
  { id: 'ser-scott', section: 'series', name: 'Scott', value: '30 %', description: 'Max rabatt för Scott-serien.', requiresApproval: false, examples: [], keywords: ['scott', 'serie'] },
  { id: 'ser-siena', section: 'series', name: 'Siena', value: '40 %', description: 'Max rabatt för Siena-serien.', requiresApproval: false, examples: [], keywords: ['siena', 'serie'] },
  { id: 'ser-skovby', section: 'series', name: 'Skovby', value: 'DK 25 % / SE 10 %', description: 'Max rabatt för Skovby-serien. DK 25 %, SE 10 %.', requiresApproval: false, examples: [], keywords: ['skovby', 'serie'] },
  { id: 'ser-springfield', section: 'series', name: 'Springfield', value: '40 %', description: 'Max rabatt för Springfield-serien.', requiresApproval: false, examples: [], keywords: ['springfield', 'serie'] },
  { id: 'ser-systema', section: 'series', name: 'Systema', value: '40 %', description: 'Max rabatt för Systema-serien.', requiresApproval: false, examples: [], keywords: ['systema', 'serie'] },
  { id: 'ser-timber', section: 'series', name: 'Timber', value: '30 %', description: 'Max rabatt för Timber-serien.', requiresApproval: false, examples: [], keywords: ['timber', 'serie'] },
  { id: 'ser-timian', section: 'series', name: 'Timian', value: '40 %', description: 'Max rabatt för Timian-serien.', requiresApproval: false, examples: [], keywords: ['timian', 'serie'] },
  { id: 'ser-torsby', section: 'series', name: 'Torsby', value: '30 %', description: 'Max rabatt för Torsby-serien.', requiresApproval: false, examples: [], keywords: ['torsby', 'serie'] },
  { id: 'ser-vesta', section: 'series', name: 'Vesta', value: '40 %', description: 'Max rabatt för Vesta-serien.', requiresApproval: false, examples: [], keywords: ['vesta', 'serie'] },
  { id: 'ser-winston', section: 'series', name: 'Winston', value: '30 %', description: 'Max rabatt för Winston-serien.', requiresApproval: false, examples: [], keywords: ['winston', 'serie'] },

  { id: 'bed-sengeben', section: 'bed', name: 'Sengeben', value: '25 %', description: 'Max rabatt för sengeben.', requiresApproval: false, examples: [], keywords: ['sengeben', 'sängben'] },
  { id: 'bed-sengegavle', section: 'bed', name: 'Sengegavle', value: '25 %', description: 'Max rabatt för sengegavle.', requiresApproval: false, examples: [], keywords: ['sengegavle', 'sänggavel'] },
  { id: 'bed-sengeborde', section: 'bed', name: 'Sengeborde', value: '25 %', description: 'Max rabatt för sengeborde.', requiresApproval: false, examples: [], keywords: ['sengeborde', 'sängbord'] },
  { id: 'bed-dunlopillo', section: 'bed', name: 'Dunlopillo senge', value: '40 %', description: 'Max rabatt för Dunlopillo senge.', requiresApproval: false, examples: [], keywords: ['dunlopillo', 'säng'] },
  { id: 'bed-wonderland', section: 'bed', name: 'Wonderland senge', value: '35 %', description: 'Max rabatt för Wonderland senge.', requiresApproval: false, examples: [], keywords: ['wonderland', 'säng'] },
  { id: 'bed-tempur', section: 'bed', name: 'Tempur senge', value: '25 %', description: 'Max rabatt för Tempur senge.', requiresApproval: false, examples: [], keywords: ['tempur', 'säng'] },
  { id: 'bed-elegant', section: 'bed', name: 'Elegant senge', value: '50 %', description: 'Max rabatt för Elegant senge.', requiresApproval: false, examples: [], keywords: ['elegant', 'säng'] },
  { id: 'bed-exclusive', section: 'bed', name: 'Exclusive senge', value: '60 %', description: 'Max rabatt för Exclusive senge.', requiresApproval: false, examples: [], keywords: ['exclusive', 'säng'] },
  { id: 'bed-excellence', section: 'bed', name: 'Excellence senge', value: '40 %', description: 'Max rabatt för Excellence senge.', requiresApproval: false, examples: [], keywords: ['excellence senge', 'säng'] },
  { id: 'bed-excellence-gavle', section: 'bed', name: 'Excellence gavle', value: '40 %', description: 'Max rabatt för Excellence gavle.', requiresApproval: false, examples: [], keywords: ['excellence gavle', 'sänggavel'] },
]

const _productRules: ProductRule[] = [
  {
    id: 'p1',
    name: 'Soffor',
    category: 'Vardagsrum',
    description: 'Demo-regler för försäljning av soffor.',
    rules: ['Kontrollera tygval och färg', 'Bekräfta leveransalternativ', 'Förklara garanti'],
    keywords: ['soffa', 'produkt', 'regel'],
  },
  {
    id: 'p2',
    name: 'Matbord',
    category: 'Matplats',
    description: 'Demo-regler för matbord och stolar.',
    rules: ['Mät utrymme hos kund', 'Kontrollera iläggsskivor', 'Boka hemleverans vid behov'],
    keywords: ['matbord', 'stol', 'produkt'],
  },
  {
    id: 'p3',
    name: 'Sängar',
    category: 'Sovrum',
    description: 'Demo-regler för sängar och madrasser.',
    rules: ['Bekräfta storlek', 'Fråga om bäddmadrass', 'Hemleverans rekommenderas'],
    keywords: ['säng', 'madrass', 'produkt'],
  },
]

const _orderProcedures: OrderProcedure[] = [
  {
    id: 'o1',
    title: 'Beställningsvara',
    description: 'Demo-rutin när en vara inte finns i lager.',
    steps: ['Kontrollera tillgänglighet i system', 'Bekräfta leveranstid', 'Registrera kundens uppgifter', 'Skicka orderbekräftelse'],
    keywords: ['beställning', 'lager', 'order'],
  },
  {
    id: 'o2',
    title: 'Orderändring',
    description: 'Demo-rutin för att ändra en befintlig order.',
    steps: ['Hitta ordern i kassan', 'Kontrollera status', 'Bekräfta ändring med kund', 'Spara ny orderinformation'],
    keywords: ['ändra', 'order', 'beställning'],
  },
  {
    id: 'o3',
    title: 'Orderbekräftelse',
    description: 'Demo-rutin för att skicka bekräftelse.',
    steps: ['Dubbelkolla adress', 'Bekräfta leveranstid', 'Skicka bekräftelse via mejl/SMS'],
    keywords: ['bekräftelse', 'order', 'mejl'],
  },
]

const _returnProcedures: ReturnProcedure[] = [
  {
    id: 'r1',
    title: 'Retur inom 14 dagar',
    description: 'Demo-rutin för vanlig retur.',
    steps: ['Kontrollera kvitto', 'Bekräfta att varan är oanvänd', 'Registrera retur i kassan', 'Återbetala enligt villkor'],
    keywords: ['retur', 'återlämning', 'öppet köp'],
  },
  {
    id: 'r2',
    title: 'Reklamation',
    description: 'Demo-rutin vid reklamation av defekt vara.',
    steps: ['Dokumentera skadan', 'Fotografera', 'Registrera ärende', 'Förklara processen för kunden'],
    keywords: ['reklamation', 'defekt', 'skada'],
  },
  {
    id: 'r3',
    title: 'Skadad vara vid leverans',
    description: 'Demo-rutin om skada upptäcks vid leverans.',
    steps: ['Notera på fraktsedeln', 'Fotografera', 'Registrera i kundtjänstsystem', 'Erbjud ersättning eller omsändning'],
    keywords: ['skada', 'leverans', 'frakt'],
  },
]

const _systems: SystemItem[] = [
  {
    id: 's1',
    name: 'ERP',
    description: 'Demo-beskrivning: affärssystemet för order, lager och fakturering.',
    usedFor: ['Orderhantering', 'Lagersaldo', 'Kundregister'],
    keywords: ['erp', 'system', 'order', 'lager'],
  },
  {
    id: 's2',
    name: 'Kassasystem',
    description: 'Demo-beskrivning: kassan där försäljning och betalning registreras.',
    usedFor: ['Försäljning', 'Betalning', 'Rabattkoder'],
    keywords: ['kassa', 'betalning', 'försäljning'],
  },
  {
    id: 's3',
    name: 'Lagersystem',
    description: 'Demo-beskrivning: överblick över lager och plockning.',
    usedFor: ['Lagerstatus', 'Plock', 'Inleveranser'],
    keywords: ['lager', 'plock', 'inleverans'],
  },
  {
    id: 's4',
    name: 'Kundtjänstverktyg',
    description: 'Demo-beskrivning: verktyg för ärenden och kundkontakter.',
    usedFor: ['Ärenden', 'Reklamationer', 'Mejl och telefon'],
    keywords: ['kundtjänst', 'support', 'ärende'],
  },
]

const _contacts: Contact[] = [
  {
    id: 'ct1',
    name: 'Butikschef',
    role: 'Ansvarig butik',
    department: 'Halmstad',
    phone: 'Demo-123-456',
    email: 'demo.manager@ilva.example',
    keywords: ['chef', 'manager', 'godkännande'],
  },
  {
    id: 'ct2',
    name: 'Kundtjänst',
    role: 'Kundsupport',
    department: 'Centrum',
    phone: 'Demo-987-654',
    email: 'demo.support@ilva.example',
    keywords: ['kundtjänst', 'support', 'reklamation'],
  },
  {
    id: 'ct3',
    name: 'Logistik',
    role: 'Leverans och lager',
    department: 'Lager',
    phone: 'Demo-555-010',
    email: 'demo.logistics@ilva.example',
    keywords: ['logistik', 'leverans', 'lager'],
  },
  {
    id: 'ct4',
    name: 'IT-support',
    role: 'Teknik',
    department: 'IT',
    phone: 'Demo-555-019',
    email: 'demo.it@ilva.example',
    keywords: ['it', 'system', 'teknisk'],
  },
]

const _updates: UpdateItem[] = [
  {
    id: 'u1',
    date: '2026-08-09',
    category: 'Leverans',
    title: 'Ny leveransinformation',
    description: 'Demo-uppdatering av leveranstider för större möbler.',
    importance: 'medium',
    lastUpdated: '2026-08-09',
  },
  {
    id: 'u2',
    date: '2026-08-07',
    category: 'Rabatter',
    title: 'Uppdaterade rabattregler',
    description: 'Demo-justering av säljarrabattgränser.',
    importance: 'high',
    lastUpdated: '2026-08-07',
  },
  {
    id: 'u3',
    date: '2026-08-05',
    category: 'Order',
    title: 'Ändrad orderrutin',
    description: 'Demo-förenkling av beställningsvaror.',
    importance: 'low',
    lastUpdated: '2026-08-05',
  },
  {
    id: 'u4',
    date: '2026-08-02',
    category: 'System',
    title: 'Nytt kassasystem',
    description: 'Demo-information om kommande kassasystemuppdatering.',
    importance: 'medium',
    lastUpdated: '2026-08-02',
  },
]

function translateDanish(text: string): string {
  const map: [string, string][] = [
    ['Exclusive senge', 'Exclusive sängar'],
    ['Sengegavle', 'Sänggavlar'],
    ['Sengeben', 'Sängben'],
    ['Sovesofaer', 'Bäddsoffor'],
    ['Sofaborde', 'Soffbord'],
    ['Spisebordsstole', 'Matstolar'],
    ['Spiseborde', 'Matbord'],
    ['Opbevaringsmøbler', 'Förvaringsmöbler'],
    ['Skriveborde', 'Skrivbord'],
    ['Kontorstole', 'Kontorsstolar'],
    ['Entrémøbler', 'Hallmöbler'],
    ['Havemøbler', 'Utemöbler'],
    ['Tæpper', 'Mattor'],
    ['Spejle', 'Speglar'],
    ['Sofaer', 'Soffor'],
    ['Lænestole', 'Fåtöljer'],
    ['Lamper', 'Lampor'],
    ['senge', 'sängar'],
    ['sove', 'bädd'],
    ['sofa', 'soffa'],
    ['møbler', 'möbler'],
  ]
  let result = text
  for (const [from, to] of map) {
    result = result.replace(new RegExp(from, 'gi'), to)
  }
  result = result
    .replace(/Fast lav pris/gi, 'Fast lågt pris')
    .replace(/Max rabatt för/gi, 'Maximal rabatt för')
    .replace(/Max rabatt/gi, 'Maximal rabatt')
    .replace(/för lænestole/gi, 'för fåtöljer')
    .replace(/för sovesofaer/gi, 'för bäddsoffor')
    .replace(/för sofaborde/gi, 'för soffbord')
    .replace(/för spisebordsstole/gi, 'för matstolar')
    .replace(/för spiseborde/gi, 'för matbord')
    .replace(/för opbevaringsmøbler/gi, 'för förvaringsmöbler')
    .replace(/för skriveborde/gi, 'för skrivbord')
    .replace(/før kontorstole/gi, 'för kontorsstolar')
    .replace(/för entrémøbler/gi, 'för hallmöbler')
    .replace(/för havemøbler/gi, 'för utemöbler')
    .replace(/för tæpper/gi, 'för mattor')
    .replace(/för spejle/gi, 'för speglar')
    .replace(/för sofaer/gi, 'för soffor')
    .replace(/för lænestole/gi, 'för fåtöljer')
  return result
}

function toSwedishDiscount(d: Discount): Discount {
  return {
    ...d,
    name: translateDanish(d.name),
    description: translateDanish(d.description),
    keywords: d.keywords.map(translateDanish),
  }
}

export const deliveryOptions = override?.deliveryOptions ?? _deliveryOptions
export const codes = override?.codes ?? _codes
export const discounts = (override?.discounts ?? _discounts).map(toSwedishDiscount)
export const productRules = override?.productRules ?? _productRules
export const orderProcedures = override?.orderProcedures ?? _orderProcedures
export const returnProcedures = override?.returnProcedures ?? _returnProcedures
export const systems = override?.systems ?? _systems
export const contacts = override?.contacts ?? _contacts
export const updates = override?.updates ?? _updates

function toSearchable(item: SearchableItem): SearchableItem {
  return item
}

export const searchIndex: SearchableItem[] = [
  ...deliveryOptions.map<SearchableItem>((d) => ({
    type: 'delivery',
    id: d.id,
    title: d.name,
    subtitle: d.code,
    description: d.description,
    category: 'Leverans',
    code: d.code,
    keywords: [...d.keywords, d.name, d.code],
    url: `/delivery/${d.id}`,
  })),
  ...codes.map<SearchableItem>((c) => ({
    type: 'code',
    id: c.id,
    title: c.name,
    subtitle: c.code,
    description: c.description,
    category: c.category,
    code: c.code,
    keywords: [...c.keywords, c.code, c.name],
    url: `/codes/${c.id}`,
  })),
  ...discounts.map<SearchableItem>((d) => ({
    type: 'discount',
    id: d.id,
    title: d.name,
    subtitle: d.value,
    description: d.description,
    category: 'Rabatt',
    keywords: [...d.keywords, d.name, d.value],
    url: '/discounts',
  })),
  ...productRules.map<SearchableItem>((p) => ({
    type: 'product',
    id: p.id,
    title: p.name,
    subtitle: p.category,
    description: p.description,
    category: 'Produkt',
    keywords: [...p.keywords, p.name, p.category],
    url: '/products',
  })),
  ...orderProcedures.map<SearchableItem>((o) => ({
    type: 'order',
    id: o.id,
    title: o.title,
    description: o.description,
    category: 'Order',
    keywords: [...o.keywords, o.title],
    url: '/orders',
  })),
  ...returnProcedures.map<SearchableItem>((r) => ({
    type: 'return',
    id: r.id,
    title: r.title,
    description: r.description,
    category: 'Retur',
    keywords: [...r.keywords, r.title],
    url: '/returns',
  })),
  ...systems.map<SearchableItem>((s) => ({
    type: 'system',
    id: s.id,
    title: s.name,
    description: s.description,
    category: 'System',
    keywords: [...s.keywords, s.name],
    url: '/systems',
  })),
  ...contacts.map<SearchableItem>((c) => ({
    type: 'contact',
    id: c.id,
    title: c.name,
    subtitle: c.role,
    description: c.department,
    category: 'Kontakt',
    keywords: [...c.keywords, c.name, c.role],
    url: '/contacts',
  })),
  ...updates.map<SearchableItem>((u) => ({
    type: 'update',
    id: u.id,
    title: u.title,
    subtitle: u.category,
    description: u.description,
    category: u.category,
    keywords: [u.title, u.category, u.description],
    url: '/updates',
  })),
].map(toSearchable)

export function saveAppData(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function resetAppData() {
  localStorage.removeItem(STORAGE_KEY)
}
