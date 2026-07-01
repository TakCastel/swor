import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Erreur: NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis dans .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanDescriptions() {
  console.log('🧹 Nettoyage des descriptions (retrait des images Markdown)...');

  const { data: forums, error } = await supabase
    .from('forums')
    .select('id, name, description')
    .ilike('description', '%![%]%'); // Chercher les patterns d'images Markdown

  if (error) {
    console.error('Erreur lors de la récupération:', error);
    return;
  }

  if (!forums || forums.length === 0) {
    console.log('Aucune description à nettoyer.');
    return;
  }

  console.log(`${forums.length} forums à nettoyer.`);

  for (const forum of forums) {
    if (!forum.description) continue;

    // Supprimer le pattern ![Nom](URL) au début ou n'importe où
    const cleanedDescription = forum.description.replace(/!\[.*?\]\(.*?\)\n*/g, '').trim();

    if (cleanedDescription !== forum.description.trim()) {
      console.log(`✅ Nettoyage pour ${forum.name}`);
      const { error: updateError } = await supabase
        .from('forums')
        .update({ description: cleanedDescription })
        .eq('id', forum.id);

      if (updateError) console.error(`Erreur update ${forum.name}:`, updateError);
    }
  }

  console.log('✨ Nettoyage terminé !');
}

cleanDescriptions();


