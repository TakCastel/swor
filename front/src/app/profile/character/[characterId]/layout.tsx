import ProfileLayout from '@/features/profile/components/ProfileLayout';

export default function CharacterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProfileLayout>{children}</ProfileLayout>;
}



