import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const DB_PATH = process.env.DB_PATH || './data/db.json';

function ensureDb() {
  if (!existsSync(DB_PATH)) {
    mkdirSync(dirname(DB_PATH), { recursive: true });
    writeFileSync(DB_PATH, JSON.stringify({ settings: defaultSettings(), registrations: [] }, null, 2));
  }
}

function defaultSettings() {
  return {
    coupleNames: 'Paulo Silva + Mória Neto',
    welcomeTitle: 'Convite para a festa que nos aconteceu',
    venueName: 'Quinta das Oliveiras',
    venueAddress: 'Estrada do Sol, 123, 2500-123 Óbidos',
    mapUrl: 'https://maps.google.com',
    dressCode: 'Leve, elegante e com alma mediterrânica.',
    timeline: [
      { time: '16:30', label: 'Cerimónia de renovação de votos' },
      { time: '19:00', label: 'Jantar e discursos' }
    ],
    hotels: [
      { name: 'The Literary Man Óbidos Hotel', distance: '1,2 km' }
    ]
  };
}

export function readDb() { ensureDb(); return JSON.parse(readFileSync(DB_PATH, 'utf8')); }
export function writeDb(data) { writeFileSync(DB_PATH, JSON.stringify(data, null, 2)); }
export function getDefaultSettings(){return defaultSettings();}
