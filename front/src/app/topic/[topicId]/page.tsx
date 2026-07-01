import TopicDetail from '@/features/forum/components/TopicDetail';

export default async function TopicViewPage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params;
  return <TopicDetail topicId={parseInt(topicId)} />;
}
