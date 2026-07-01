import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Configuration de dotenv pour charger .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseServiceKey || !openaiApiKey) {
  console.error('Erreur: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY et OPENAI_API_KEY doivent être définis dans .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const openai = new OpenAI({
  apiKey: openaiApiKey,
});

/**
 * Nettoie le nom de la planète pour la recherche Wookieepedia
 */
function cleanPlanetName(name: string): string {
  return name
    .split(' - ')[0] // Enlever les sous-lieux comme "Coruscant - Palais Impérial"
    .split(' (')[0] // Enlever les précisions comme "Alderaan (Cimetière)"
    .trim()
    .replace(/ /g, '_'); // Remplacer les espaces par des underscores pour l'URL
}

/**
 * Utilise l'IA pour choisir les meilleures images parmi une liste extraite
 */
async function getBestImagesWithAI(planetName: string, candidates: any[]) {
  if (candidates.length === 0) return { icon: null, header: null };

  const prompt = `
    Je travaille sur un forum Roleplay Star Wars. Pour la planète "${planetName}", je dois choisir deux images parfaites parmi cette liste issue de différentes sources (Wookieepedia Canon, Legends et Holonet).
    
    CANDIDATS :
    ${JSON.stringify(candidates.slice(0, 40))}
    
    MISSION :
    1. "icon" : Trouve l'image qui montre le GLOBE COMPLET de la planète (sa forme ronde) seule dans l'espace. C'est l'image d'identité. On veut voir la planète en entier, pas juste une partie de sa surface depuis l'orbite.
    2. "header" : Trouve l'image la plus "CONCEPT ART" ou "ARTWORK" possible. 
       - On veut un paysage immersif, une vue de cité, ou un panorama magnifique qui symbolise ce monde.
       - IMPORTANT : Évite les photos de figurines, les captures d'écran de jeux vidéo de basse qualité, ou les simples schémas techniques.
       - On veut quelque chose de large, artistique et cinématographique.
       - Si l'image semble être une peinture numérique ou un matte painting officiel de Lucasfilm/Disney, privilégie-la.
    
    Réponds UNIQUEMENT en JSON : {"icon": "url", "header": "url"}
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Tu es un expert en art Star Wars. Tu analyses les contextes et URLs pour trouver les meilleures illustrations JdR." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const responseText = response.choices[0].message.content?.trim() || "{}";
    return JSON.parse(responseText);
  } catch (e) {
    return { icon: candidates[0]?.url, header: candidates[1]?.url };
  }
}

/**
 * Télécharge une image et l'upload sur Supabase Storage
 */
async function uploadToSupabase(imageUrl: string, prefix: string, fileName: string): Promise<string | null> {
  try {
    // Gérer les URLs relatives au protocole (//static.wikia...)
    let fullUrl = imageUrl.trim();
    if (fullUrl.startsWith('//')) {
      fullUrl = `https:${fullUrl}`;
    }

    // Vérifier si c'est une URL valide
    if (!fullUrl.startsWith('http')) {
      console.error(`❌ URL ignorée car invalide pour ${fileName} (${prefix}): "${fullUrl}"`);
      return null;
    }

    console.log(`📥 Téléchargement (${prefix}) : ${fullUrl}`);
    const response = await axios.get(fullUrl, { 
      responseType: 'arraybuffer',
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const buffer = Buffer.from(response.data, 'binary');
    const extension = imageUrl.split('.').pop()?.split('/')[0] || 'jpg';
    const storagePath = `planets/${prefix}_${fileName}.${extension}`;

    const { error } = await supabase.storage
      .from('forum')
      .upload(storagePath, buffer, {
        contentType: `image/${extension === 'png' ? 'png' : 'jpeg'}`,
        upsert: true
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('forum')
      .getPublicUrl(storagePath);

    return publicUrl;
  } catch (error: any) {
    console.error(`Erreur lors de l'upload de ${fileName} (${prefix}):`, error.message);
    return null;
  }
}

/**
 * Récupère le HTML d'une page
 */
async function getPageHtml(url: string): Promise<string> {
  try {
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    const response = await axios.get(url, { headers: { 'User-Agent': userAgent }, timeout: 10000 });
    return response.data;
  } catch (e) {
    return "";
  }
}

/**
 * Scrape les images d'un HTML
 */
function scrapeImagesFromHtml(html: string, sourceName: string): any[] {
  const $ = cheerio.load(html);
  const found: any[] = [];
  
  $('img').each((i, el) => {
    const src = $(el).attr('data-src') || $(el).attr('src') || $(el).attr('data-original');
    if (!src || src.startsWith('data:')) return;

    const cleanUrl = src.split('/revision/')[0].split('?')[0];
    if (cleanUrl.includes('static.wikia') || cleanUrl.includes('fandom.com') || cleanUrl.includes('holonet') || cleanUrl.includes('nocookie')) {
      const parent = $(el).closest('figure, .thumb, .pi-image, .image, td, div');
      const context = parent.text().trim().substring(0, 300) || $(el).attr('alt') || "Image de " + sourceName;
      
      if (!found.find(img => img.url === cleanUrl)) {
        found.push({ url: cleanUrl, context, source: sourceName });
      }
    }
  });
  return found;
}

async function updatePlanetImages() {
  console.log('🚀 Début de la recherche GALACTIQUE (Wookieepedia + Holonet)...');

  // Récupérer dynamiquement toutes les catégories qui ont une ère définie
  const { data: categories } = await supabase
    .from('forum_categories')
    .select('id, name, era')
    .not('era', 'is', null);

  const validCategoryIds = categories?.map(c => c.id) || [];
  
  if (validCategoryIds.length === 0) {
    console.log('⚠️ Aucune catégorie avec une ère trouvée.');
    return;
  }

  console.log(`📁 Catégories détectées : ${categories?.map(c => `${c.name} (${c.id})`).join(', ')}`);

  const { data: planets, error } = await supabase
    .from('forums')
    .select('*')
    .eq('type', 'planet')
    .in('category_id', validCategoryIds)
    .order('category_id', { ascending: true });

  if (error || !planets) {
    console.error('❌ Erreur lors de la récupération des planètes:', error);
    return;
  }

  console.log(`🪐 ${planets.length} planètes trouvées au total.`);
  categories?.forEach(cat => {
    const count = planets.filter(p => p.category_id === cat.id).length;
    console.log(`   - ${cat.name} : ${count} planètes`);
  });

  const cache = new Map<string, { icon: string | null, header: string | null }>();

  for (const planet of planets) {
    const cleanedName = cleanPlanetName(planet.name);
    const cacheKey = cleanedName.toLowerCase();
    
    if (cache.has(cacheKey)) {
      const urls = cache.get(cacheKey)!;
      await supabase.from('forums').update({
        image_url: urls.icon,
        header_image_url: urls.header
      }).eq('id', planet.id);
      continue;
    }

    console.log(`\n🌌 Exploration pour : ${planet.name}...`);
    
    // 1. Collecter les sources
    const sources = [
      { name: "Wookiee Canon", url: `https://starwars.fandom.com/wiki/${cleanedName}` },
      { name: "Wookiee Legends", url: `https://starwars.fandom.com/wiki/${cleanedName}/Legends` },
      { name: "Holonet", url: `https://www.starwars-holonet.com/encyclopedie/planete-${cleanedName.toLowerCase()}.html` },
      { name: "Wookiee Gallery", url: `https://starwars.fandom.com/wiki/${cleanedName}/Gallery` }
    ];

    let allCandidates: any[] = [];
    for (const source of sources) {
      const html = await getPageHtml(source.url);
      if (html) {
        const imgs = scrapeImagesFromHtml(html, source.name);
        console.log(`   - ${source.name} : ${imgs.length} images trouvées`);
        allCandidates = [...allCandidates, ...imgs];
      }
    }

    if (allCandidates.length > 0) {
      // 2. L'IA choisit parmi TOUTES les sources
      const best = await getBestImagesWithAI(planet.name, allCandidates);
      
      let publicUrls = { icon: null as string | null, header: null as string | null };

      if (best.icon) {
        publicUrls.icon = await uploadToSupabase(best.icon, 'icon', cacheKey);
      }
      if (best.header) {
        publicUrls.header = await uploadToSupabase(best.header, 'header', cacheKey);
      }

      cache.set(cacheKey, publicUrls);

      await supabase.from('forums').update({
        image_url: publicUrls.icon || planet.image_url,
        header_image_url: publicUrls.header || planet.header_image_url
      }).eq('id', planet.id);

      console.log(`   ✅ Terminé pour ${planet.name}`);
    }

    await new Promise(r => setTimeout(r, 1000));
  }
}

updatePlanetImages();
