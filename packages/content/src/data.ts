import type { AlbumPage, FestivalEvent, PlaceInput, RouteInput } from "./schema";

/* ------------------------------------------------------------------ */
/* Sources                                                             */
/* ------------------------------------------------------------------ */

const SRC = {
  osm: (id: string) => ({
    label: `OpenStreetMap ${id} (© colaboradores de OSM, ODbL)`,
    url: `https://www.openstreetmap.org/${id}`,
  }),
  semana2026: {
    label: "Semana, mayo 2026",
    url: "https://www.semana.com/turismo/articulo/asi-es-el-pueblo-de-boyaca-que-le-rinde-homenaje-al-bocadillo-un-destino-con-termales-e-ideal-para-hacer-ecoturismo/202645/",
  },
  semana2024: {
    label: "Semana, 2024",
    url: "https://www.semana.com/turismo/articulo/en-donde-queda-y-que-se-puede-hacer-en-la-ciudad-dulce-de-colombia/202455/",
  },
  pulzo: {
    label: "Pulzo, julio 2025",
    url: "https://www.pulzo.com/vivir-bien/viajes-y-turismo/que-hay-pa-hacer-moniquira-hay-parque-diversiones-natural-es-gratis-PP4665381",
  },
  viaja: {
    label: "Viaja por Colombia",
    url: "https://viajaporcolombia.com/sitios-turisticos/boyaca/moniquira_255/",
  },
  situr: {
    label: "SITUR Boyacá — Portafolio “Moniquirá, naturalmente dulce” (2024)",
    url: "https://situr.boyaca.gov.co/wp-content/uploads/2024/05/PORTAFOLIO-MONIQUIRA.pdf",
  },
  gcatholic: {
    label: "GCatholic — Basílica de Nuestra Señora del Rosario",
    url: "https://gcatholic.org/churches/southamerica/5469",
  },
  wikipedia: { label: "Wikipedia — Moniquirá", url: "https://en.wikipedia.org/wiki/Moniquir%C3%A1" },
} as const;

const osm = (id: string, lat: number, lng: number) => ({ lat, lng, source: `osm:${id}` });

/* ------------------------------------------------------------------ */
/* Album pages                                                         */
/* ------------------------------------------------------------------ */

export const albumPages: AlbumPage[] = [
  {
    slug: "agua",
    colorToken: "rio",
    sort: 1,
    name: { es: "Agua", en: "Water" },
    imperative: { es: "Métete al agua.", en: "Get in the water." },
    description: {
      es: "Cascadas, quebradas y termales. Moniquirá viene del chibcha y significaría “lugar de baño”.",
      en: "Waterfalls, streams and hot springs. The name Moniquirá comes from Chibcha and is said to mean “bathing place”.",
    },
  },
  {
    slug: "alturas",
    colorToken: "bijao",
    sort: 2,
    name: { es: "Alturas", en: "Heights" },
    imperative: { es: "Sube a mirar.", en: "Climb up and look." },
    description: {
      es: "Altos, filos y miradores sobre el cañón del Suárez y las montañas de Ricaurte.",
      en: "Peaks, ridges and lookouts over the Suárez canyon and the Ricaurte mountains.",
    },
  },
  {
    slug: "pueblo",
    colorToken: "guayaba",
    sort: 3,
    name: { es: "Pueblo", en: "Town" },
    imperative: { es: "Camina la plaza.", en: "Walk the plaza." },
    description: {
      es: "La basílica, los parques y las calles del casco urbano.",
      en: "The basilica, the parks and the streets of the town centre.",
    },
  },
  {
    slug: "memoria",
    colorToken: "barro",
    sort: 4,
    name: { es: "Memoria", en: "Memory" },
    imperative: { es: "Escucha lo antiguo.", en: "Listen to the old stories." },
    description: {
      es: "Territorio muisca bajo el cacique de Susa. Cuevas y nombres que guardan esa historia.",
      en: "Muisca territory under the cacique of Susa. Caves and place names that keep that history.",
    },
  },
  {
    slug: "dulce",
    colorToken: "panela",
    sort: 5,
    name: { es: "Dulce", en: "Sweet" },
    imperative: { es: "Prueba el bocadillo.", en: "Taste the bocadillo." },
    description: {
      es: "La Ciudad Dulce de Colombia: guayaba, bocadillo, panela y mute.",
      en: "Colombia’s Sweet City: guava, bocadillo, panela and mute.",
    },
  },
  {
    slug: "descanso",
    colorToken: "pulpa",
    sort: 6,
    name: { es: "Descanso", en: "Rest" },
    imperative: { es: "Quédate un día más.", en: "Stay one more day." },
    description: {
      es: "Piscinas, camping y centros vacacionales para bajar el ritmo.",
      en: "Pools, camping and holiday centres to slow down.",
    },
  },
];

/* ------------------------------------------------------------------ */
/* Places (láminas)                                                    */
/* ------------------------------------------------------------------ */

const verifyNote = {
  es: "Por verificar en campo: acceso, estado del camino y si el baño es seguro. Pregunta en el pueblo antes de ir.",
  en: "Pending field check: access, trail condition and whether swimming is safe. Ask locally before going.",
};

export const places: PlaceInput[] = [
  /* ---------- Agua ---------- */
  {
    slug: "cascada-real",
    albumNumber: 1,
    page: "agua",
    name: { es: "Cascada Real", en: "Cascada Real" },
    summary: {
      es: "Una caída de unos 25 metros, de las más nombradas del municipio.",
      en: "A drop of about 25 metres, one of the best-known falls in the municipality.",
    },
    tips: verifyNote,
    coords: null,
    swimming: null,
    status: "review",
    featured: true,
    media: [],
    sources: [SRC.semana2026, SRC.viaja, SRC.situr],
  },
  {
    slug: "salto-de-pomeca",
    albumNumber: 2,
    page: "agua",
    name: { es: "Salto de Pómeca", en: "Pómeca Falls" },
    summary: {
      es: "Salto al oriente del casco urbano, en el camino hacia Togüí.",
      en: "A waterfall east of town, on the way towards Togüí.",
    },
    tips: verifyNote,
    coords: osm("node/6446002672", 5.89236, -73.53216),
    access: "mixed",
    swimming: null,
    status: "review",
    featured: true,
    media: [],
    sources: [SRC.osm("node/6446002672"), SRC.semana2026, SRC.situr],
  },
  {
    slug: "cascada-el-cajon",
    albumNumber: 3,
    page: "agua",
    name: { es: "Cascada El Cajón", en: "El Cajón Falls" },
    summary: {
      es: "La cascada de baño más querida por los moniquireños, a pocos kilómetros del pueblo.",
      en: "The swimming waterfall locals love most, a few kilometres from town.",
    },
    tips: verifyNote,
    coords: osm("node/8019997450", 5.85652, -73.56225),
    access: "mixed",
    swimming: null,
    status: "review",
    featured: true,
    media: [],
    sources: [SRC.osm("node/8019997450"), SRC.pulzo, SRC.situr],
  },
  {
    slug: "salto-del-zorro",
    albumNumber: 4,
    page: "agua",
    name: { es: "Salto del Zorro", en: "Zorro Falls" },
    summary: {
      es: "Cascada al oriente del municipio, cerca de la vía a Arcabuco.",
      en: "A waterfall in the east of the municipality, near the road to Arcabuco.",
    },
    tips: verifyNote,
    coords: osm("node/625993758", 5.86328, -73.52432),
    swimming: null,
    status: "review",
    media: [],
    sources: [SRC.osm("node/625993758"), SRC.semana2024],
  },
  {
    slug: "cascada-la-honda",
    albumNumber: 5,
    page: "agua",
    name: { es: "Cascada La Honda", en: "La Honda Falls" },
    summary: {
      es: "Cascada en el sur del municipio, hacia los límites con Gachantivá.",
      en: "A waterfall in the south of the municipality, towards Gachantivá.",
    },
    tips: verifyNote,
    coords: osm("node/1989026653", 5.78988, -73.54025),
    swimming: null,
    status: "review",
    media: [],
    sources: [SRC.osm("node/1989026653")],
  },
  {
    slug: "cascada-los-yataros",
    albumNumber: 6,
    page: "agua",
    name: { es: "Cascada Los Yátaros", en: "Los Yátaros Falls" },
    summary: {
      es: "Vecina de La Honda, en la misma zona sur del municipio.",
      en: "La Honda’s neighbour, in the same southern area of the municipality.",
    },
    tips: verifyNote,
    coords: osm("node/1989027227", 5.78929, -73.54788),
    swimming: null,
    status: "review",
    media: [],
    sources: [SRC.osm("node/1989027227")],
  },
  {
    slug: "salto-de-los-micos",
    albumNumber: 7,
    page: "agua",
    name: { es: "Salto de Los Micos", en: "Los Micos Falls" },
    summary: {
      es: "Uno de los saltos que nombra la Alcaldía. No confundir con el Salto del Mico de Barichara.",
      en: "One of the falls listed by the municipality. Not to be confused with Salto del Mico in Barichara.",
    },
    tips: verifyNote,
    coords: null,
    swimming: null,
    status: "review",
    media: [],
    sources: [SRC.semana2026, SRC.pulzo],
  },
  {
    slug: "salto-de-las-golondrinas",
    albumNumber: 8,
    page: "agua",
    name: { es: "Salto de Las Golondrinas", en: "Las Golondrinas Falls" },
    summary: {
      es: "Salto que aparece en las listas de la Alcaldía y de la prensa regional.",
      en: "A waterfall listed by the municipality and regional press.",
    },
    tips: verifyNote,
    coords: null,
    swimming: null,
    status: "review",
    media: [],
    sources: [SRC.semana2026, SRC.pulzo],
  },
  {
    slug: "quebrada-la-sicha",
    albumNumber: 9,
    page: "agua",
    name: { es: "Quebrada La Sicha", en: "La Sicha Stream" },
    summary: {
      es: "Una corriente de unos 12 metros de ancho con pozos y balnearios.",
      en: "A stream about 12 metres wide with pools for bathing.",
    },
    tips: verifyNote,
    coords: null,
    swimming: null,
    status: "review",
    media: [],
    sources: [SRC.semana2026],
  },
  {
    slug: "termales-el-salitre",
    albumNumber: 10,
    page: "agua",
    name: { es: "Termales El Salitre", en: "El Salitre Hot Springs" },
    summary: {
      es: "Aguas termales azufradas al sur del casco urbano.",
      en: "Sulphurous hot springs south of town.",
    },
    tips: {
      es: "Horarios y tarifas por confirmar. Llama o pregunta en el pueblo antes de ir.",
      en: "Opening hours and fees to be confirmed. Ask locally before going.",
    },
    coords: osm("node/11366243769", 5.83586, -73.58097),
    access: "car",
    swimming: null,
    status: "review",
    featured: true,
    media: [],
    sources: [SRC.osm("node/11366243769"), SRC.semana2026, SRC.pulzo],
  },
  {
    slug: "rio-moniquira",
    albumNumber: 11,
    page: "agua",
    name: { es: "Río Moniquirá", en: "Moniquirá River" },
    summary: {
      es: "El río que le da nombre al pueblo baja entre Gachantivá y Santa Sofía hacia el Suárez.",
      en: "The river that gives the town its name runs between Gachantivá and Santa Sofía towards the Suárez.",
    },
    tips: verifyNote,
    coords: null,
    swimming: null,
    status: "review",
    media: [
      {
        file: "rio-moniquira.jpg",
        alt: {
          es: "Río de aguas claras entre montañas cubiertas de bosque",
          en: "A clear river running between forested mountains",
        },
        caption: {
          es: "Río Moniquirá, en el límite entre Gachantivá y Santa Sofía.",
          en: "Moniquirá River, on the border between Gachantivá and Santa Sofía.",
        },
      },
    ],
    sources: [SRC.wikipedia],
  },

  /* ---------- Alturas ---------- */
  {
    slug: "alto-el-granadillo",
    albumNumber: 12,
    page: "alturas",
    name: { es: "Alto del Granadillo", en: "Alto del Granadillo" },
    summary: {
      es: "El mirador más nombrado de Moniquirá, al occidente del pueblo, con vista amplia de la región.",
      en: "Moniquirá’s best-known lookout, west of town, with wide views across the region.",
    },
    tips: {
      es: "Consulta el estado del camino y lleva calzado con buen agarre.",
      en: "Check the trail condition and wear shoes with good grip.",
    },
    coords: osm("node/703521115", 5.87387, -73.60217),
    access: "mixed",
    bestTime: "06:00–09:00",
    status: "review",
    featured: true,
    media: [],
    sources: [SRC.osm("node/703521115"), SRC.semana2026, SRC.viaja],
  },
  {
    slug: "obelisco-alto-del-mazamorral",
    albumNumber: 13,
    page: "alturas",
    name: { es: "Obelisco del Alto del Mazamorral", en: "Alto del Mazamorral Obelisk" },
    summary: {
      es: "Monumento en lo alto del Mazamorral, al suroccidente del municipio.",
      en: "A monument on top of Alto del Mazamorral, in the south-west of the municipality.",
    },
    tips: verifyNote,
    coords: osm("node/6284847140", 5.80254, -73.62547),
    status: "review",
    media: [],
    sources: [SRC.osm("node/6284847140"), SRC.semana2024],
  },
  {
    slug: "capilla-alto-de-la-virgen",
    albumNumber: 14,
    page: "alturas",
    name: { es: "Capilla Alto de la Virgen", en: "Alto de la Virgen Chapel" },
    summary: {
      es: "Capilla en lo alto, al oriente del municipio.",
      en: "A hilltop chapel in the east of the municipality.",
    },
    tips: verifyNote,
    coords: osm("way/1341096548", 5.85731, -73.52026),
    status: "review",
    media: [],
    sources: [SRC.osm("way/1341096548")],
  },
  {
    slug: "serrania-del-peligro",
    albumNumber: 15,
    page: "alturas",
    name: {
      es: "Parque Natural Regional Serranía del Peligro",
      en: "Serranía del Peligro Regional Natural Park",
    },
    summary: {
      es: "Área protegida de bosque andino que aparece en el portafolio turístico oficial.",
      en: "A protected Andean forest area listed in the official tourism portfolio.",
    },
    tips: verifyNote,
    coords: null,
    status: "review",
    media: [],
    sources: [SRC.situr],
  },

  /* ---------- Pueblo ---------- */
  {
    slug: "basilica-nuestra-senora-del-rosario",
    albumNumber: 16,
    page: "pueblo",
    name: {
      es: "Basílica Menor de Nuestra Señora del Rosario",
      en: "Minor Basilica of Our Lady of the Rosary",
    },
    summary: {
      es: "Torres rojas, filetes azules y una base de piedra. Frente al parque principal; basílica menor desde 2010.",
      en: "Red spires, blue trim and a stone base. Facing the main square; a minor basilica since 2010.",
    },
    coords: osm("way/1062415727", 5.87809, -73.57081),
    access: "foot",
    visitMinutes: 30,
    bestTime: "16:00–18:00",
    status: "review",
    featured: true,
    media: [
      {
        file: "basilica-moniquira.jpg",
        alt: {
          es: "Fachada de la basílica con dos torres rojas en punta, detalles azules y base de piedra",
          en: "Basilica facade with two pointed red spires, blue details and a stone base",
        },
      },
      {
        file: "parque-moniquira-4.jpg",
        alt: {
          es: "La iglesia vista desde el parque principal",
          en: "The church seen from the main square",
        },
      },
    ],
    sources: [SRC.osm("way/1062415727"), SRC.gcatholic, SRC.semana2024],
  },
  {
    slug: "parque-principal",
    albumNumber: 17,
    page: "pueblo",
    name: { es: "Parque Principal Simón Bolívar", en: "Simón Bolívar Main Square" },
    summary: {
      es: "Plaza arbolada frente a la basílica, con fuente y caminos de ladrillo. Para caminarlo al llegar o al atardecer.",
      en: "A tree-filled square facing the basilica, with a fountain and brick paths. Walk it on arrival or at sunset.",
    },
    coords: osm("way/91239301", 5.87767, -73.5714),
    access: "foot",
    visitMinutes: 30,
    bestTime: "17:00–18:30",
    status: "review",
    featured: true,
    media: [
      {
        file: "parque-moniquira-3.jpg",
        alt: {
          es: "Senderos de ladrillo bajo árboles grandes en el parque principal",
          en: "Brick paths under large trees in the main square",
        },
      },
      {
        file: "parque-moniquira-2.jpg",
        alt: { es: "Jardines del parque principal", en: "Gardens of the main square" },
      },
      {
        file: "panoramica-parque-moniquira.jpg",
        alt: {
          es: "Panorámica del parque principal de Moniquirá",
          en: "Panorama of Moniquirá’s main square",
        },
      },
    ],
    sources: [SRC.osm("way/91239301"), SRC.viaja],
  },
  {
    slug: "parque-santander",
    albumNumber: 18,
    page: "pueblo",
    name: { es: "Parque Santander", en: "Santander Park" },
    summary: {
      es: "El segundo parque del casco urbano, a dos cuadras de la plaza principal.",
      en: "The town’s second park, two blocks from the main square.",
    },
    coords: osm("way/244237955", 5.87628, -73.57321),
    access: "foot",
    visitMinutes: 15,
    status: "review",
    media: [],
    sources: [SRC.osm("way/244237955")],
  },

  /* ---------- Memoria ---------- */
  {
    slug: "filo-pueblo-viejo",
    albumNumber: 19,
    page: "memoria",
    name: { es: "Filo y Cueva de Pueblo Viejo", en: "Pueblo Viejo Ridge and Cave" },
    summary: {
      es: "Un filo al occidente del pueblo. La prensa menciona allí una cueva, la de Pueblo Viejo.",
      en: "A ridge west of town. Press sources mention a cave there, the Pueblo Viejo cave.",
    },
    tips: {
      es: "Ve con guía local. La ubicación exacta de la cueva está por verificar.",
      en: "Go with a local guide. The cave’s exact location is pending verification.",
    },
    coords: osm("node/703229738", 5.87441, -73.59615),
    status: "review",
    media: [],
    sources: [SRC.osm("node/703229738"), SRC.semana2026, SRC.pulzo],
  },
  {
    slug: "cueva-de-las-momias",
    albumNumber: 26,
    page: "memoria",
    name: { es: "Cueva de las momias", en: "Cave of the Mummies" },
    summary: {
      es: "La prensa habla de una cueva con momias indígenas. Por respeto y conservación, solo con guía.",
      en: "Press sources mention a cave with Indigenous mummies. Out of respect and for conservation, visit only with a guide.",
    },
    tips: {
      es: "No sabemos todavía si es la misma cueva de Pueblo Viejo. Por verificar.",
      en: "We don’t yet know whether this is the same as the Pueblo Viejo cave. Pending verification.",
    },
    coords: null,
    status: "draft",
    media: [],
    sources: [SRC.semana2026, SRC.pulzo],
  },

  /* ---------- Dulce ---------- */
  {
    slug: "fabricas-de-bocadillo",
    albumNumber: 20,
    page: "dulce",
    name: { es: "Fábricas de bocadillo", en: "Bocadillo factories" },
    summary: {
      es: "En el casco urbano hay fábricas de bocadillo de guayaba. Algunas reciben visitantes.",
      en: "Guava bocadillo factories in town. Some welcome visitors.",
    },
    tips: {
      es: "Pregunta cuáles reciben visitas y si hay que reservar.",
      en: "Ask which ones take visitors and whether you need to book.",
    },
    coords: osm("node/4519609439", 5.87753, -73.56935),
    access: "foot",
    visitMinutes: 45,
    status: "review",
    featured: true,
    media: [],
    sources: [SRC.osm("node/4519609439"), SRC.viaja, SRC.semana2026],
  },
  {
    slug: "mute-moniquireno",
    albumNumber: 21,
    page: "dulce",
    name: { es: "Mute moniquireño", en: "Moniquirá mute" },
    summary: {
      es: "Sopa espesa de mazorca, pata de res, papa, guascas y carne de res y cerdo. El plato del pueblo.",
      en: "A hearty soup of corn, cow’s foot, potato, guascas, beef and pork. The town’s signature dish.",
    },
    coords: null,
    status: "review",
    media: [],
    sources: [SRC.semana2026, SRC.pulzo],
  },
  {
    slug: "panela-y-panelitas",
    albumNumber: 22,
    page: "dulce",
    name: { es: "Panela y panelitas de leche", en: "Panela and milk panelitas" },
    summary: {
      es: "Moniquirá está entre los grandes productores de panela del país. Las panelitas de leche acompañan al bocadillo.",
      en: "Moniquirá is one of Colombia’s big panela producers. Milk panelitas sit next to the bocadillo.",
    },
    coords: null,
    status: "review",
    media: [],
    sources: [SRC.semana2024, SRC.wikipedia],
  },

  /* ---------- Descanso ---------- */
  {
    slug: "piscina-municipal-y-camping",
    albumNumber: 23,
    page: "descanso",
    name: { es: "Piscina municipal y camping", en: "Municipal pool and campsite" },
    summary: {
      es: "Piscina pública con zona de camping, a pocas cuadras de la plaza.",
      en: "A public pool with a camping area, a few blocks from the square.",
    },
    tips: {
      es: "Horarios y tarifas por confirmar.",
      en: "Opening hours and fees to be confirmed.",
    },
    coords: osm("node/6191060785", 5.87879, -73.56874),
    access: "foot",
    status: "review",
    media: [],
    sources: [SRC.osm("node/6191060785"), SRC.osm("node/4519603679")],
  },
  {
    slug: "centro-vacacional-chiminigagua",
    albumNumber: 24,
    page: "descanso",
    name: { es: "Centro Vacacional Chiminigagua", en: "Chiminigagua Holiday Centre" },
    summary: {
      es: "Centro vacacional a las afueras del casco urbano.",
      en: "A holiday centre on the edge of town.",
    },
    coords: osm("node/11366845769", 5.88164, -73.578),
    access: "car",
    status: "review",
    media: [],
    sources: [SRC.osm("node/11366845769")],
  },
  {
    slug: "centro-vacacional-comfaboy",
    albumNumber: 25,
    page: "descanso",
    name: { es: "Centro Vacacional Comfaboy", en: "Comfaboy Holiday Centre" },
    summary: {
      es: "Complejo con alojamiento y piscina a las afueras. Las tarifas dependen de la afiliación.",
      en: "A complex with lodging and a pool on the edge of town. Rates depend on membership.",
    },
    coords: null,
    status: "review",
    media: [],
    sources: [SRC.viaja],
  },
];

/* ------------------------------------------------------------------ */
/* Routes                                                              */
/* ------------------------------------------------------------------ */

export const routes: RouteInput[] = [
  {
    slug: "ruta-dulce",
    page: "dulce",
    name: { es: "Ruta Dulce", en: "The Sweet Route" },
    summary: {
      es: "Medio día a pie por el casco urbano: plaza, basílica, bocadillo y mute.",
      en: "Half a day on foot around town: square, basilica, bocadillo and mute.",
    },
    body: {
      es: "Empieza bajo los árboles del parque principal, entra a la basílica y baja a las fábricas de bocadillo. Cierra con un plato de mute.",
      en: "Start under the trees of the main square, step into the basilica and walk down to the bocadillo factories. Finish with a bowl of mute.",
    },
    whatToBring: {
      es: "Zapatos cómodos, efectivo para dulces y hambre.",
      en: "Comfortable shoes, cash for sweets, and an appetite.",
    },
    difficulty: "easy",
    transport: "foot",
    durationMin: 240,
    bestSeason: { es: "Todo el año. En diciembre, Fiestas del Dulce.", en: "Year-round. In December, the Sweet Festival." },
    status: "review",
    featured: true,
    stops: [
      { place: "parque-principal", suggestedTime: "09:00", suggestedMinutes: 30 },
      { place: "basilica-nuestra-senora-del-rosario", suggestedTime: "09:30", suggestedMinutes: 30 },
      { place: "fabricas-de-bocadillo", suggestedTime: "10:15", suggestedMinutes: 60 },
      { place: "parque-santander", suggestedTime: "11:30", suggestedMinutes: 15 },
      {
        place: "mute-moniquireno",
        suggestedTime: "12:15",
        suggestedMinutes: 60,
        note: { es: "Almuerzo en el centro.", en: "Lunch in town." },
      },
    ],
  },
  {
    slug: "ruta-de-las-cascadas",
    page: "agua",
    name: { es: "Ruta de las Cascadas", en: "The Waterfall Route" },
    summary: {
      es: "Día completo entre El Cajón, Pómeca y el Zorro. Caminata y vehículo.",
      en: "A full day between El Cajón, Pómeca and Zorro falls. Walking plus a vehicle.",
    },
    body: {
      es: "Tres cascadas del sur y el oriente del municipio. Las distancias reales por camino y la duración están pendientes de medir con GPS en campo.",
      en: "Three waterfalls in the south and east of the municipality. Real trail distances and duration are pending a GPS field survey.",
    },
    whatToBring: {
      es: "Vestido de baño, calzado que se pueda mojar, agua, bloqueador y ropa seca.",
      en: "Swimsuit, shoes that can get wet, water, sunscreen and dry clothes.",
    },
    difficulty: "medium",
    transport: "mixed",
    durationMin: 420,
    bestSeason: {
      es: "Temporada seca: enero es el mes con menos lluvia; evita mayo.",
      en: "Dry season: January has the least rain; avoid May.",
    },
    status: "review",
    featured: true,
    stops: [
      { place: "cascada-el-cajon", suggestedTime: "08:00", suggestedMinutes: 120 },
      { place: "salto-de-pomeca", suggestedTime: "11:00", suggestedMinutes: 90 },
      { place: "salto-del-zorro", suggestedTime: "14:00", suggestedMinutes: 90 },
    ],
  },
  {
    slug: "miradores-y-memoria",
    page: "alturas",
    name: { es: "Miradores y memoria", en: "Lookouts and memory" },
    summary: {
      es: "Madrugada en el Alto del Granadillo y bajada por el Filo de Pueblo Viejo.",
      en: "Sunrise at Alto del Granadillo, then down along the Pueblo Viejo ridge.",
    },
    body: {
      es: "Al occidente del pueblo, los dos puntos altos más cercanos al casco urbano. Ve con guía local si quieres buscar la cueva.",
      en: "West of town, the two high points closest to the centre. Go with a local guide if you want to find the cave.",
    },
    whatToBring: {
      es: "Chaqueta para la madrugada, linterna, agua y calzado de montaña.",
      en: "A jacket for the early morning, a torch, water and hiking shoes.",
    },
    difficulty: "medium",
    transport: "mixed",
    durationMin: 300,
    bestSeason: { es: "Mañanas despejadas, de diciembre a febrero.", en: "Clear mornings, December to February." },
    status: "review",
    stops: [
      { place: "alto-el-granadillo", suggestedTime: "05:45", suggestedMinutes: 90 },
      { place: "filo-pueblo-viejo", suggestedTime: "08:30", suggestedMinutes: 90 },
    ],
  },
  {
    slug: "agua-tibia-y-descanso",
    page: "descanso",
    name: { es: "Agua tibia y descanso", en: "Warm water and rest" },
    summary: {
      es: "Un día lento: termales El Salitre, piscina y centro vacacional.",
      en: "A slow day: El Salitre hot springs, a pool and a holiday centre.",
    },
    body: {
      es: "Para familias o para el día después de caminar. Confirma horarios antes de salir.",
      en: "For families, or for the day after a long hike. Confirm opening hours before you go.",
    },
    whatToBring: {
      es: "Vestido de baño, toalla, chanclas y efectivo.",
      en: "Swimsuit, towel, sandals and cash.",
    },
    difficulty: "easy",
    transport: "car",
    durationMin: 360,
    bestSeason: { es: "Todo el año.", en: "Year-round." },
    status: "review",
    stops: [
      { place: "termales-el-salitre", suggestedTime: "09:00", suggestedMinutes: 150 },
      { place: "piscina-municipal-y-camping", suggestedTime: "13:00", suggestedMinutes: 90 },
      { place: "centro-vacacional-chiminigagua", suggestedTime: "15:00", suggestedMinutes: 120 },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Festivals                                                           */
/* ------------------------------------------------------------------ */

export const events: FestivalEvent[] = [
  {
    slug: "fiestas-del-dulce-y-el-bocadillo",
    monthHint: 12,
    name: { es: "Ferias y Fiestas del Dulce y el Bocadillo", en: "Sweet and Bocadillo Fair and Festival" },
    description: {
      es: "Una de las fiestas más antiguas del país, con concursos y muestras gastronómicas. Las fechas exactas de cada año las confirma la Alcaldía.",
      en: "One of Colombia’s oldest festivals, with contests and food fairs. The municipality confirms the exact dates each year.",
    },
    source: SRC.viaja,
  },
  {
    slug: "festival-del-mararay",
    monthHint: 6,
    name: { es: "Festival del Mararay", en: "Mararay Festival" },
    description: {
      es: "Juegos tradicionales en el puente festivo de San Pedro: trompo, coca y encostalados.",
      en: "Traditional games over the San Pedro long weekend: spinning tops, cup-and-ball and sack races.",
    },
    source: SRC.viaja,
  },
  {
    slug: "festival-de-verano",
    name: { es: "Festival de Verano", en: "Summer Festival" },
    description: {
      es: "Parte del calendario cultural del municipio. Fechas por confirmar.",
      en: "Part of the municipal cultural calendar. Dates to be confirmed.",
    },
    source: SRC.semana2024,
  },
  {
    slug: "concurso-regional-del-burro",
    name: { es: "Concurso Regional del Burro", en: "Regional Donkey Contest" },
    description: {
      es: "Una tradición rural del calendario local. Fechas por confirmar.",
      en: "A rural tradition on the local calendar. Dates to be confirmed.",
    },
    source: SRC.semana2024,
  },
  {
    slug: "festival-jairo-anibal-nino",
    name: { es: "Festival Jairo Aníbal Niño", en: "Jairo Aníbal Niño Festival" },
    description: {
      es: "Festival cultural en homenaje al escritor nacido en Moniquirá. Fechas por confirmar.",
      en: "A cultural festival honouring the writer born in Moniquirá. Dates to be confirmed.",
    },
    source: SRC.semana2024,
  },
];

export const townFacts = {
  altitudeM: 1669,
  meanTempC: 19.1,
  annualRainMm: 2006,
  driestMonth: 1,
  wettestMonth: 5,
  fromBogota: { es: "3 a 4 horas por carretera", en: "3 to 4 hours by road" },
  fromTunja: { es: "hora y media", en: "an hour and a half" },
  center: { lat: 5.87631, lng: -73.57321 },
  sources: [SRC.wikipedia, SRC.pulzo, SRC.semana2024],
} as const;
