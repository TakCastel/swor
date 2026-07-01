import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/shared/utils/supabase-server';
import EraDetail from '@/features/forum/components/EraDetail';

export default async function EraViewPage({ params }: { params: Promise<{ eraId: string }> }) {
  const { eraId: eraIdStr } = await params;
  const eraId = parseInt(eraIdStr);
  const supabase = await createServerSupabaseClient();

  // 1. Récupérer la catégorie
  const { data: era, error: eraError } = await supabase
    .from('forum_categories')
    .select('*')
    .eq('id', eraId)
    .single();

  if (eraError || !era) {
    console.error(`[EraViewPage] Erreur ou catégorie non trouvée pour ID ${eraId}:`, JSON.stringify(eraError, null, 2));
    notFound();
  }

  // 2. Récupérer les forums (régions)
  const { data: regions, error: regionsError } = await supabase
    .from('forums')
    .select('*')
    .eq('category_id', eraId)
    .is('parent_id', null)
    .order('display_order', { ascending: true });

  if (regionsError) {
    console.error('Erreur fetch regions:', regionsError);
    return <div>Erreur lors du chargement de l'ère.</div>;
  }

  // 3. Récupérer les sous-forums (secteurs/planètes) pour chaque région avec les infos du dernier message agrégé
  const regionsWithSubs = await Promise.all((regions || []).map(async (region) => {
    const { data: subs, error: subsError } = await supabase
      .from('forums')
      .select(`
        *,
        last_post:last_post_id (
          id,
          created_at,
          topic:topics (id, title),
          author:profiles (username),
          character:characters (
            name,
            main_group:groups (color)
          )
        )
      `)
      .eq('parent_id', region.id)
      .order('display_order', { ascending: true });
    
    if (subsError) console.error('Erreur fetch subs détaillée:', JSON.stringify(subsError, null, 2));
    
    // Formatter les sous-forums
    const formattedSubs = (subs || []).map(sub => {
      const lp = sub.last_post;
      let lastPost = null;

      if (lp) {
        lastPost = {
          id: lp.id,
          topicId: lp.topic?.id,
          title: lp.topic?.title,
          authorName: lp.character?.name || lp.author?.username || 'Anonyme',
          authorColor: lp.character?.main_group?.color,
          date: new Date(lp.created_at).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        };
      }
      return { ...sub, lastPost };
    });

    return {
      ...region,
      sub_forums: formattedSubs
    };
  }));

  const eraWithForums = {
    ...era,
    forums: regionsWithSubs
  };

  return <EraDetail era={eraWithForums} />;
}
