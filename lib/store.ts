import { promises as fs } from 'node:fs'
const path = './data/db.json'
export type Registration={id:string;name:string;email:string;phone:string;adults:number;children:number;status:'PENDENTE'|'APROVADO'|'REJEITADO';createdAt:string}
export type Db={settings:any;registrations:Registration[]}
const defaults={coupleNames:'Paulo Silva + Mória Neto',venueName:'Quinta das Oliveiras',venueAddress:'Óbidos',mapUrl:'https://maps.google.com',dressCode:'Leve e elegante',groupLink:'https://chat.whatsapp.com/SEU_LINK_AQUI'}
export async function readDb():Promise<Db>{try{return JSON.parse(await fs.readFile(path,'utf8'))}catch{const d={settings:defaults,registrations:[]};await fs.mkdir('./data',{recursive:true});await fs.writeFile(path,JSON.stringify(d,null,2));return d}}
export async function writeDb(db:Db){await fs.writeFile(path,JSON.stringify(db,null,2))}
