import { readFile } from 'node:fs/promises'
import https from 'node:https'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const TURKISH_FALLBACK_TRANSLATIONS = {
  abi: ['brother'],
  abla: ['sister'],
  ac: ['open'],
  aciktim: ['hungry', 'hambre'],
  agac: ['tree', 'arbol'],
  aksam: ['evening', 'noche'],
  amca: ['uncle', 'tio'],
  anne: ['mother', 'madre'],
  araba: ['car', 'coche'],
  ayran: ['drink'],
  ayakkabi: ['shoe', 'zapato'],
  ayagim: ['foot', 'pie'],
  bahce: ['garden', 'jardin'],
  bak: ['look', 'mirar'],
  balon: ['balloon', 'globo'],
  balık: ['fish', 'pez'],
  bardak: ['glass', 'cup', 'vaso'],
  baskim: ['head'],
  basim: ['head', 'cabeza'],
  banyo: ['bathroom', 'shower', 'ducha'],
  baska: ['other'],
  battaniye: ['blanket', 'manta'],
  baba: ['father', 'padre'],
  bekle: ['wait', 'esperar'],
  bebek: ['doll', 'baby', 'muneca', 'bebe'],
  bilgisayar: ['computer', 'ordenador'],
  bir: ['one', 'uno'],
  'bir daha': ['again', 'otra vez'],
  biskuvi: ['cookie', 'biscuit', 'galleta'],
  boya: ['paint', 'pintura'],
  bogazim: ['throat', 'garganta'],
  bugun: ['today', 'hoy'],
  buyukanne: ['grandmother', 'abuela'],
  buyukbaba: ['grandfather', 'abuelo'],
  canta: ['bag', 'backpack', 'mochila'],
  cay: ['tea', 'te'],
  cetvel: ['ruler', 'regla'],
  cicek: ['flower', 'flor'],
  cilek: ['strawberry', 'fresa'],
  cis: ['pee', 'toilet'],
  corap: ['sock', 'calcetin'],
  corba: ['soup', 'sopa'],
  defter: ['notebook', 'cuaderno'],
  deniz: ['sea', 'mar'],
  ders: ['lesson', 'class', 'leccion'],
  diş: ['tooth', 'diente'],
  dis: ['tooth', 'diente'],
  dinle: ['listen', 'escuchar'],
  disari: ['outside', 'afuera'],
  domates: ['tomato', 'tomate'],
  dort: ['four', 'cuatro'],
  dur: ['stop', 'parar'],
  dus: ['shower', 'ducha'],
  'dus al': ['shower', 'ducha'],
  ekmek: ['bread', 'pan'],
  el: ['hand', 'mano'],
  elbise: ['dress', 'vestido'],
  elma: ['apple', 'manzana'],
  ev: ['house', 'home', 'casa'],
  evet: ['yes', 'si'],
  fare: ['mouse'],
  firin: ['oven', 'horno'],
  gecе: ['night'],
  gece: ['night', 'noche'],
  gazoz: ['soda', 'bebida'],
  'geri dur': ['stop', 'back'],
  gozum: ['eye', 'ojo'],
  golge: ['shadow', 'shade', 'sombra'],
  galatasaray: ['lion', 'football', 'red yellow'],
  gunesli: ['sunny', 'sol'],
  gun: ['day', 'dia'],
  gunaydin: ['good morning', 'buenos dias'],
  gunler: ['days', 'dias'],
  hayir: ['no'],
  havlu: ['towel', 'toalla'],
  hoparlor: ['speaker', 'altavoz'],
  'hosca kal': ['goodbye', 'adios'],
  isik: ['light', 'luz'],
  istemiyorum: ['no', 'dont want'],
  istiyorum: ['want', 'quiero'],
  icmek: ['drink', 'beber'],
  icecek: ['drink', 'bebida'],
  kapi: ['door', 'puerta'],
  kalabalik: ['crowd', 'crowded', 'multitud'],
  kalem: ['pencil', 'lapiz'],
  kalk: ['stand', 'get up'],
  kakao: ['cocoa', 'chocolate'],
  kaka: ['poop', 'toilet'],
  karnim: ['belly', 'stomach', 'barriga'],
  karanlik: ['dark', 'oscuro'],
  kitap: ['book', 'libro'],
  kiyafetler: ['clothes', 'ropa'],
  kedi: ['cat', 'gato'],
  kemer: ['seat belt', 'belt', 'cinturon'],
  kukla: ['puppet', 'marioneta'],
  kulagim: ['ear', 'oreja'],
  kulaklik: ['headphones', 'auriculares'],
  kus: ['bird', 'pajaro'],
  kutuphane: ['library', 'biblioteca'],
  kofte: ['meatball'],
  kopek: ['dog', 'perro'],
  kos: ['run', 'correr'],
  kayboldum: ['lost', 'perdido'],
  kaydirak: ['slide'],
  kirmizi: ['red', 'rojo'],
  lamba: ['light', 'lamp', 'luz'],
  lego: ['lego', 'blocks', 'bloques'],
  limonata: ['lemonade', 'limonada'],
  makarna: ['pasta'],
  market: ['supermarket', 'mercado'],
  masa: ['table', 'mesa'],
  mavi: ['blue', 'azul'],
  merhaba: ['hello', 'hola'],
  'meyve suyu': ['juice', 'zumo'],
  mont: ['coat', 'jacket', 'abrigo'],
  mor: ['purple', 'morado'],
  muz: ['banana', 'platano'],
  mutfak: ['kitchen', 'cocina'],
  okul: ['school', 'escuela'],
  'okula git': ['school'],
  oku: ['read', 'leer'],
  ogle: ['noon', 'mediodia'],
  ogretmen: ['teacher', 'maestro'],
  oyun: ['play', 'game', 'juego'],
  'oyuncak araba': ['toy car', 'coche de juguete'],
  'oyun alani': ['playground'],
  oyna: ['play', 'jugar'],
  'ozur dilerim': ['sorry', 'lo siento'],
  park: ['park', 'parque'],
  'parlak isik': ['bright light'],
  patates: ['potato', 'patata'],
  pencere: ['window', 'ventana'],
  peynir: ['cheese', 'queso'],
  pilav: ['rice', 'arroz'],
  pijama: ['pajama', 'pijama'],
  portakal: ['orange', 'naranja'],
  sabah: ['morning', 'manana'],
  sabun: ['soap', 'jabon'],
  sali: ['tuesday', 'martes'],
  'sac tara': ['comb hair', 'peinar'],
  sari: ['yellow', 'amarillo'],
  saril: ['hug', 'abrazar'],
  'sarilmak istemiyorum': ['no hug'],
  sallan: ['swing', 'balance'],
  salatalik: ['cucumber', 'pepino'],
  salincak: ['swing', 'columpio'],
  sayilar: ['numbers', 'numeros'],
  sessiz: ['quiet', 'silencio'],
  silgi: ['eraser', 'goma'],
  simdi: ['now', 'ahora'],
  sinif: ['classroom', 'class', 'aula'],
  soguk: ['cold', 'frio'],
  sonra: ['later', 'despues'],
  su: ['water', 'agua'],
  susadim: ['thirsty', 'water', 'agua'],
  sut: ['milk', 'leche'],
  sicak: ['hot', 'caliente'],
  'sıkıldım': ['bored'],
  'spor ilgi': ['sports', 'interests', 'deporte', 'intereses'],
  tarak: ['comb', 'peine'],
  tavsan: ['rabbit', 'conejo'],
  tavuk: ['chicken', 'pollo'],
  teknoloji: ['technology', 'tecnologia'],
  telefon: ['phone', 'telefono'],
  teneffus: ['break', 'recess', 'recreo'],
  'tesekkur ederim': ['thanks', 'gracias'],
  top: ['ball', 'pelota'],
  forma: ['jersey', 'uniform', 'camiseta'],
  futbol: ['football', 'soccer', 'futbol'],
  gol: ['goal', 'gol'],
  'iyi geceler': ['good night', 'buenas noches'],
  aslan: ['lion', 'leon'],
  mac: ['match', 'game', 'partido'],
  pazartesi: ['monday', 'lunes'],
  persembe: ['thursday', 'jueves'],
  carsamba: ['wednesday', 'miercoles'],
  cuma: ['friday', 'viernes'],
  cumartesi: ['saturday', 'sabado'],
  pazar: ['sunday', 'domingo'],
  dun: ['yesterday', 'ayer'],
  yarin: ['tomorrow', 'manana'],
  traktör: ['tractor'],
  tuvalet: ['toilet', 'bano', 'aseo'],
  'tuvalet kagidi': ['toilet paper', 'papel higienico'],
  turuncu: ['orange'],
  uc: ['three', 'tres'],
  ucak: ['plane', 'avion'],
  usuyorum: ['cold', 'frio'],
  uyku: ['sleep', 'dormir'],
  uyu: ['sleep', 'dormir'],
  uyan: ['wake up', 'despertar'],
  uzgun: ['sad', 'triste'],
  'uzaktan kumanda': ['remote control'],
  yagmurlu: ['rainy', 'lluvia'],
  yastik: ['pillow', 'almohada'],
  yaz: ['write', 'escribir'],
  yat: ['go to bed', 'bed'],
  yemek: ['food', 'comida'],
  yesil: ['green', 'verde'],
  yogurt: ['yogurt'],
  yol: ['road', 'camino'],
  yorgunum: ['tired', 'cansado'],
  yuruyus: ['walk', 'paseo'],
  yuru: ['walk', 'caminar'],
  'yuksek ses': ['loud sound', 'noise'],
  zipla: ['jump', 'saltar'],
}

function normalizeText(value) {
  return value
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

export async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if ((response.statusCode ?? 500) >= 400) {
          reject(new Error(`HTTP ${response.statusCode ?? 'unknown'} for ${url}`))
          response.resume()
          return
        }

        let body = ''
        response.setEncoding('utf8')
        response.on('data', (chunk) => {
          body += chunk
        })
        response.on('end', () => {
          try {
            resolve(JSON.parse(body))
          } catch (error) {
            reject(error)
          }
        })
      })
      .on('error', reject)
  })
}

export function parseCards(source) {
  const cardPattern =
    /\{\s*id: '([^']+)',\s*label: '([^']+)',\s*category: '([^']+)',\s*emoji: '([^']+)',\s*textToSpeak: '([^']+)'(?:,\s*searchTerms: \[([^\]]*)\])?\s*\}/g
  const searchTermPattern = /'([^']+)'/g
  const cards = []

  for (const match of source.matchAll(cardPattern)) {
    const [, id, label, category, emoji, textToSpeak, rawSearchTerms] = match
    const searchTerms = []

    if (rawSearchTerms) {
      for (const termMatch of rawSearchTerms.matchAll(searchTermPattern)) {
        searchTerms.push(termMatch[1])
      }
    }

    cards.push({
      id,
      label,
      category,
      emoji,
      textToSpeak,
      searchTerms,
    })
  }

  return cards
}

export function parseCategories(source) {
  const categoryPattern =
    /\{\s*id: '([^']+)',\s*label: '([^']+)',\s*emoji: '([^']+)'\s*\}/g
  const categories = []

  for (const match of source.matchAll(categoryPattern)) {
    const [, id, label, emoji] = match
    categories.push({
      id,
      label,
      emoji,
    })
  }

  return categories
}

export async function readCards() {
  const filePath = path.join(projectRoot, 'src', 'data', 'cards.ts')
  return parseCards(await readFile(filePath, 'utf8'))
}

export async function readCategories() {
  const filePath = path.join(projectRoot, 'src', 'data', 'categories.ts')
  return parseCategories(await readFile(filePath, 'utf8'))
}

export function buildQueries(label, searchTerms = []) {
  const baseTerms = unique([label, ...searchTerms])
  const normalizedTerms = baseTerms.flatMap((term) => {
    const normalized = normalizeText(term)
    return normalized.length > 0 ? [normalized] : []
  })
  const translatedTerms = normalizedTerms.flatMap(
    (term) => TURKISH_FALLBACK_TRANSLATIONS[term] ?? [],
  )

  return unique([...normalizedTerms, ...translatedTerms]).slice(0, 8)
}

export function normalizeKeywords(keywords) {
  return unique(
    (keywords ?? [])
      .map((keyword) =>
        typeof keyword === 'string' ? keyword : keyword?.keyword ?? '',
      )
      .map((keyword) => normalizeText(keyword))
      .filter(Boolean),
  )
}

export function scoreCandidate(queries, keywords) {
  const querySet = new Set(queries.map((query) => normalizeText(query)))
  const keywordSet = new Set(keywords.map((keyword) => normalizeText(keyword)))

  let overlap = 0
  let prefixMatches = 0

  for (const query of querySet) {
    for (const keyword of keywordSet) {
      if (keyword === query) {
        overlap += 1
        break
      }

      if (keyword.includes(query) || query.includes(keyword)) {
        prefixMatches += 1
        break
      }
    }
  }

  const exactRatio = querySet.size === 0 ? 0 : overlap / querySet.size
  const fuzzyRatio = querySet.size === 0 ? 0 : prefixMatches / querySet.size
  const keywordCoverage =
    keywordSet.size === 0 ? 0 : overlap / Math.min(keywordSet.size, querySet.size || 1)

  return Number((exactRatio * 0.7 + fuzzyRatio * 0.2 + keywordCoverage * 0.1).toFixed(2))
}

export { __dirname, projectRoot, normalizeText, path, readFile }
