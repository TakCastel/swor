import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

// Initialisation de l'IA (priorité à OpenAI, sinon Gemini)
let aiProvider: 'openai' | 'gemini' | 'mock' = 'mock';
let openai: OpenAI | null = null;
let gemini: any = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  aiProvider = 'openai';
} else if (process.env.GEMINI_API_KEY) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  gemini = genAI.getGenerativeModel({ model: 'gemini-pro' });
  aiProvider = 'gemini';
}

// Configuration des ères et catégories
const ERA_MAPPING: Record<string, string> = {
  'CLONE_WARS': 'Old Republic',
  'GDC': 'Old Republic',
  'GCG': 'Galactic Empire',
  'NEW_REPUBLIC': 'New Republic',
  'NR': 'New Republic'
};

const HRP_CATEGORY_IDS = [1, 5]; // Holonews et Social

const AI_MEMBERS_IDS = [
  'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e01',
  'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e02',
  'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e03',
  'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e04',
  'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e05',
  'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e06'
];

// Types de forums autorisés pour le RP
const RP_FORUM_TYPES = ['region', 'sector', 'planet', 'location', 'forum'];

const AI_MEMBER_PERSONALITIES: Record<string, string> = {
  'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e01': 'Tu es un vétéran du RP (depuis 2002). Ton style est littéraire, avec beaucoup de vocabulaire. Tu détestes le "SMS", les fautes et le manque de cohérence. Tu es souvent sur le forum Holonews pour critiquer ou valider les annonces du staff.',
  'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e02': 'Tu es un joueur "action-first". Tu aimes les combats spatiaux et les duels. En HRP, tu es très sympa mais tu ne lis jamais les longs pavés. Tu réponds souvent par des phrases courtes et encourageantes.',
  'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e03': 'Tu es une fan inconditionnelle de Padmé et de la politique galactique. Tu adores débattre des heures sur le lore et tu es très active dans le forum "Suggestions" pour proposer des idées de scénarios complexes.',
  'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e04': 'Tu joues exclusivement des Sith ou des impériaux cruels. En HRP, tu es très respectueux mais un peu distant. Tu aimes corriger les autres sur les points de lore technique (modèles de vaisseaux, grades impériaux).',
  'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e05': 'Tu es l\'âme du forum Social. Tu lances souvent des jeux débiles ou des sondages sur les films. En RP, tu joues des personnages marginaux (contrebandiers, ferrailleurs) avec beaucoup d\'humour.',
  'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e06': 'Tu es un passionné de l\'ère Clone Wars. Tu connais tous les numéros de matricule des clones. Ton style est direct, efficace, et tu es très protecteur envers les nouveaux joueurs qui débarquent.'
};

async function generateContent(prompt: string, memberId: string, isHRP: boolean = false): Promise<string> {
  const personality = AI_MEMBER_PERSONALITIES[memberId] || '';
  const systemPrompt = isHRP 
    ? `Tu es un membre d'une communauté Star Wars en 2005. ${personality} Tu as un comportement très humain : tu n'utilises quasiment JAMAIS d'emojis, tu peux faire quelques fautes de frappe légères, et tu as un ton typique des anciens forums. Tu écris en français.`
    : `Tu es un rôliste de Star Wars en 2005 (style Forumactif/phpBB). ${personality} Ton style est narratif et immersif. Tu ne mets JAMAIS d'emojis dans tes messages RP. Tu écris en français.`;

  if (aiProvider === 'openai' && openai) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }],
    });
    return response.choices[0].message.content || '';
  } else if (aiProvider === 'gemini' && gemini) {
    const result = await gemini.generateContent(`${systemPrompt}\n\n${prompt}`);
    const response = await result.response;
    return response.text();
  }
  return isHRP ? "Salut, content d'être là." : "Contenu simulé. [RP intensif]";
}

async function handleNewTopic(character: any, forum: any, isRP: boolean, memberId: string) {
  // Récupérer les sujets existants pour éviter les doublons
  const { data: existingTopics } = await supabase
    .from('topics')
    .select('title')
    .eq('forum_id', forum.id)
    .limit(10);

  const existingTitles = existingTopics?.map(t => t.title).join(', ') || 'aucun';

  // Détection automatique du type de contenu basé sur le forum
  let effectiveIsRP = isRP;
  const forumNameLower = forum.name.toLowerCase();
  const isIntroForum = forumNameLower.includes('présentation');
  const isSuggestionForum = forumNameLower.includes('suggestion');
  const isNewsForum = forumNameLower.includes('annonce') || forumNameLower.includes('holonews');
  const isDiscussionForum = forumNameLower.includes('discussions') || forumNameLower.includes('social');

  if (isIntroForum || isSuggestionForum || isNewsForum || isDiscussionForum) {
    effectiveIsRP = false;
  }

  let prompt = '';
  if (effectiveIsRP) {
    prompt = `Tu es en train d'ouvrir un nouveau sujet de RP (Roleplay).
    Lieu : ${forum.name} (${forum.description}).
    Ère : ${character.era} (${ERA_MAPPING[character.era] || character.era}).
    Personnage : ${character.name}, un ${character.species} ${character.class} de la faction ${character.faction}.
    Sujets déjà présents ici : ${existingTitles}.
    
    CONSIGNES DE RÉCIT (STYLE 2005) :
    1. Ne copie pas les sujets existants. Trouve une raison unique pour laquelle ton personnage est ici.
    2. Décris l'arrivée de ton personnage, l'ambiance, les sons, les odeurs. Sois immersif.
    3. Ton message doit se terminer par une "ouverture" (ton perso attend quelqu'un, observe la foule, ou s'apprête à faire quelque chose).
    4. Pas d'emojis. Pas de gras/italique excessif.
    5. Titre : Doit être poétique ou intrigant (ex: "L'ombre des sables", "Un verre de trop à Mos Eisley").
    Format de réponse: "TITRE: [Le titre]\nCONTENU: [Le récit]"`;
  } else {
    let contextSpecific = '';
    if (isIntroForum) contextSpecific = "C'est ta présentation. Parle de comment tu as découvert le forum, ton passif de rôliste, et ton amour pour Star Wars. Ne parle pas de ton perso en tant que tel, mais de toi le joueur.";
    else if (isSuggestionForum) contextSpecific = "Propose une idée concrète (nouveau système de combat, ajout d'une planète, changement de design). Sois passionné mais constructif.";
    else if (isDiscussionForum) contextSpecific = "Lance un débat sur un point précis : ton perso préféré dans la prélogie, ton avis sur le dernier jeu sorti, ou une question sur le lore.";
    else contextSpecific = "Discute de l'actualité du forum ou de Star Wars en général.";

    prompt = `Tu ouvres un nouveau sujet HRP (Hors-RP).
    Forum : ${forum.name} (${forum.description}).
    Sujets déjà présents : ${existingTitles}.
    
    CONTEXTE : ${contextSpecific}

    CONSIGNES D'UTILISATEUR (STYLE 2005) :
    1. Titre accrocheur, typique d'un forum (ex: "[News] Votre avis ?", "Hello la compagnie !", "Idée pour le système de dés").
    2. Comporte-toi comme un membre qui veut lancer une vraie discussion.
    3. Utilise un ton de "pote de forum". Pas de politesse d'IA.
    4. Un seul emoji maximum :)
    Format de réponse: "TITRE: [Le titre]\nCONTENU: [Le message]"`;
  }

  console.log(`Génération du contenu (${effectiveIsRP ? 'RP' : 'HRP'} nouveau sujet sur ${forum.name})...`);
  const rawContent = await generateContent(prompt, memberId, !effectiveIsRP);
  const title = rawContent.match(/TITRE: (.*)/)?.[1] || `Sujet de ${character.name}`;
  const content = rawContent.split('CONTENU:')[1]?.trim() || rawContent;

  const { data: topic, error: topicError } = await supabase
    .from('topics')
    .insert({
      forum_id: forum.id,
      author_id: memberId,
      character_id: effectiveIsRP ? character.id : null,
      title: title
    })
    .select()
    .single();

  if (topicError) throw topicError;

  await supabase.from('posts').insert({
    topic_id: topic.id,
    author_id: memberId,
    character_id: effectiveIsRP ? character.id : null,
    content: content
  });

  console.log(`Succès: Nouveau sujet "${title}" créé sur ${forum.name}`);
}

async function simulateOne() {
  try {
    // 1. Choisir un membre AI aléatoire avec des poids d'activité
    const memberWeights: Record<string, number> = {
      'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e01': 1,
      'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e02': 2, // Plus actif
      'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e03': 1,
      'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e04': 0.5, // Moins actif
      'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e05': 1.5,
      'e1e57c6a-6f1e-4b9e-9e1e-1e1e1e1e1e06': 1
    };
    
    const weightedMembers = AI_MEMBERS_IDS.flatMap(id => Array(Math.ceil((memberWeights[id] || 1) * 2)).fill(id));
    const memberId = weightedMembers[Math.floor(Math.random() * weightedMembers.length)];

    const { data: characters, error: charError } = await supabase
      .from('characters')
      .select('*')
      .eq('user_id', memberId);

    if (charError) throw charError;
    if (!characters || characters.length === 0) return;

    const character = characters[Math.floor(Math.random() * characters.length)];
    
    // 2. Décider RP vs HRP (70% RP, 30% HRP)
    const isRP = Math.random() < 0.7;

    // 3. Décider de l'action : 15% nouveau sujet, 75% réponse, 10% chat
    const actionRand = Math.random();
    const actionType = actionRand < 0.15 ? 'NEW_TOPIC' : actionRand < 0.90 ? 'REPLY' : 'CHAT';

    if (actionType === 'CHAT') {
      const prompt = `Poste un message très court dans la chatbox (HRP).
      Utilisateur : ${character.name}.
      
      CONTEXTE (STYLE 2005) :
      - Tu viens de te connecter ou tu traînes sur le forum.
      - Tu peux saluer tout le monde, demander si quelqu'un veut RP, commenter une news Star Wars récente, ou juste faire une remarque de "pote".
      - Exemples : "Yop tout le monde !", "Quelqu'un pour un RP sur Coruscant ?", "Vous avez vu le trailer de la saison 3 ?", "Je go manger, à toute".
      
      CONSIGNES :
      1. TRÈS COURT (une phrase max).
      2. Pas de majuscules excessives, pas d'emojis complexes.
      3. Ton de chat : rapide, spontané.
      Génère uniquement le message.`;

      console.log(`Génération d'un message de chat pour ${character.name}...`);
      const text = await generateContent(prompt, memberId, true);
      
      await supabase.from('chat_messages').insert({
        user_id: memberId,
        character_id: character.id,
        text: text
      });
      console.log(`Chat posté: "${text.substring(0, 50)}..."`);
      return;
    }

    if (actionType === 'NEW_TOPIC') {
      let forum;
      if (isRP) {
        const targetEra = ERA_MAPPING[character.era] || character.era;
        const { data: forums } = await supabase
          .from('forums')
          .select('id, name, description, forum_categories!inner(era)')
          .eq('forum_categories.era', targetEra)
          .in('type', RP_FORUM_TYPES)
          .limit(20);
        forum = forums?.[Math.floor(Math.random() * (forums?.length || 0))];
      } else {
        const { data: forums } = await supabase
          .from('forums')
          .select('id, name, description')
          .in('category_id', HRP_CATEGORY_IDS)
          .limit(10);
        forum = forums?.[Math.floor(Math.random() * (forums?.length || 0))];
      }

      if (forum) await handleNewTopic(character, forum, isRP, memberId);

    } else {
      let query = supabase.from('topics').select('id, title, forum_id, forums!inner(category_id, forum_categories!inner(id, era))');
      if (isRP) {
        const targetEra = ERA_MAPPING[character.era] || character.era;
        query = query.eq('forums.forum_categories.era', targetEra);
      } else {
        query = query.in('forums.forum_categories.id', HRP_CATEGORY_IDS);
      }

      const { data: topics } = await query.order('updated_at', { ascending: false }).limit(20);

      if (!topics || topics.length === 0) {
        console.log(`Aucun sujet trouvé pour répondre (${isRP ? 'RP' : 'HRP'}). Repli sur la création...`);
        let forum;
        if (isRP) {
          const targetEra = ERA_MAPPING[character.era] || character.era;
          const { data: forums, error: fallbackError } = await supabase
            .from('forums')
            .select('id, name, description, forum_categories!inner(era)')
            .eq('forum_categories.era', targetEra)
            .limit(50);
          
          if (fallbackError) console.error('Erreur fallback RP:', fallbackError);
          if (forums && forums.length > 0) {
            forum = forums[Math.floor(Math.random() * forums.length)];
          } else {
            console.log(`Aucun forum trouvé pour l'ère ${targetEra}`);
          }
        } else {
          const { data: forums, error: fallbackError } = await supabase
            .from('forums')
            .select('id, name, description')
            .in('category_id', HRP_CATEGORY_IDS)
            .limit(10);
          
          if (fallbackError) console.error('Erreur fallback HRP:', fallbackError);
          if (forums && forums.length > 0) {
            forum = forums[Math.floor(Math.random() * forums.length)];
          }
        }
        if (forum) {
          await handleNewTopic(character, forum, isRP, memberId);
        } else {
          console.log('Échec du repli : aucun forum approprié trouvé.');
        }
        return;
      }

      const topic = topics[Math.floor(Math.random() * topics.length)];
      console.log(`Réponse pour ${character.name} (${isRP ? 'RP' : 'HRP'}) sur le sujet "${topic.title}"`);

      const { data: lastPosts } = await supabase
        .from('posts')
        .select('content, author_id, characters(name)')
        .eq('topic_id', topic.id)
        .order('created_at', { ascending: false })
        .limit(10);

      // Vérifier si le dernier message est déjà de ce membre
      if (lastPosts && lastPosts.length > 0 && lastPosts[0].author_id === memberId) {
        console.log(`Le membre ${memberId} a déjà posté le dernier message dans "${topic.title}". Passage.`);
        return;
      }

      const context = (lastPosts || []).slice().reverse().map(p => `${(p as any).characters?.name || 'Inconnu'}: ${p.content}`).join('\n\n') || '';

      const prompt = isRP
        ? `Tu réponds à un sujet de RP (Roleplay) en cours.
        Sujet : ${topic.title}
        Ton Personnage : ${character.name} (${character.species}, ${character.class}, ${character.faction}).
        
        DERNIERS MESSAGES (Lis attentivement pour réagir) :
        ${context}

        CONSIGNES DE RÉPONSE (STYLE 2005) :
        1. Ta réponse DOIT être la suite directe de la situation. Si quelqu'un a parlé à ton personnage, réponds-lui.
        2. Mentionne le nom des autres personnages présents si ton personnage interagit avec eux.
        3. Décris tes actions physiques, tes dialogues et tes pensées.
        4. Garde la cohérence : ne te téléporte pas, ne fais pas de "Powerplay" (agir à la place des autres).
        5. Pas d'emojis. Pas de "hors-sujet".
        Génère uniquement le contenu du message de réponse.`
        : `Tu réponds à une discussion HRP (Hors-RP).
        Sujet : ${topic.title}
        Ton pseudonyme : (celui lié à ta personnalité).
        
        HISTORIQUE DE LA DISCUSSION :
        ${context}

        CONSIGNES D'UTILISATEUR (STYLE 2005) :
        1. Rebondis sur ce qui a été dit. Si quelqu'un a posé une question, essaie d'y répondre ou donne ton avis.
        2. Utilise un ton de forum : "Je suis d'accord avec [Nom du perso]", "Perso je pense que...", "Mdr non c'est pas ça".
        3. Ne sois pas une IA : sois passionné, parfois un peu têtu, ou très enthousiaste.
        4. Un seul emoji :) ou ;) maximum.
        Génère uniquement le contenu du message.`;

      console.log(`Génération d'une réponse pour le sujet "${topic.title}"...`);
      const content = await generateContent(prompt, memberId, !isRP);
      const { error: postError } = await supabase.from('posts').insert({
        topic_id: topic.id,
        author_id: memberId,
        character_id: isRP ? character.id : null,
        content: content
      });

      if (postError) throw postError;
      console.log(`Succès: Réponse postée dans "${topic.title}"`);
    }
  } catch (err) {
    console.error('Erreur lors de la simulation:', err);
  }
}

async function simulate() {
  console.log('--- Démarrage de la simulation d\'interaction AI ---');
  const args = process.argv.slice(2);
  let count = 1;
  if (args.includes('--count')) {
    const idx = args.indexOf('--count');
    count = parseInt(args[idx + 1]) || 1;
  } else if (args.includes('--all-members')) {
    count = AI_MEMBERS_IDS.length;
  }

  console.log(`Exécution de ${count} interaction(s)...`);
  for (let i = 0; i < count; i++) {
    console.log(`\n--- Interaction ${i + 1}/${count} ---`);
    await simulateOne();
  }
  console.log('\n--- Simulation terminée avec succès ---');
}

simulate().catch(console.error);
