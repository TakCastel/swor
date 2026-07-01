import ProfileContent from '@/features/profile/components/ProfileContent';

export default async function GuestProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProfileContent userId={id} />;
}



