import ForumDetail from '@/features/forum/components/ForumDetail';

export default async function ForumViewPage({ params }: { params: Promise<{ forumId: string }> }) {
  const { forumId } = await params;
  return <ForumDetail forumId={parseInt(forumId)} />;
}
