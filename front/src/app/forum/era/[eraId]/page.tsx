import { notFound } from 'next/navigation';
import EraDetail from '@/features/forum/components/EraDetail';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

async function apiGet<T>(path: string): Promise<T | null> {
  const response = await fetch(`${API_URL}/api/v1${path}`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) return null;
  return response.json() as Promise<T>;
}

function formatLastPost(lp: any) {
  if (!lp) return null;

  return {
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
      minute: '2-digit',
    }),
  };
}

export default async function EraViewPage({ params }: { params: Promise<{ eraId: string }> }) {
  const { eraId: eraIdStr } = await params;
  const eraId = parseInt(eraIdStr);

  const [era, forums] = await Promise.all([
    apiGet<any>(`/forum/categories/${eraId}`),
    apiGet<any[]>(`/forums?category_id=${eraId}`),
  ]);

  if (!era) {
    notFound();
  }

  // Reconstruire la hiérarchie : régions (racines) puis leurs sous-forums
  const allForums = forums || [];
  const regions = allForums.filter(f => !f.parent_id);

  const regionsWithSubs = regions.map(region => ({
    ...region,
    sub_forums: allForums
      .filter(f => f.parent_id === region.id)
      .map(sub => ({ ...sub, lastPost: formatLastPost(sub.last_post) })),
  }));

  const eraWithForums = {
    ...era,
    forums: regionsWithSubs,
  };

  return <EraDetail era={eraWithForums} />;
}
