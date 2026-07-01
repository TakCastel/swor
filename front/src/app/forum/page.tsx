import type { Metadata } from 'next';
import ForumIndex from '@/features/forum/components/ForumIndex';

export const metadata: Metadata = {
  title: "Forum Galactique",
  description: "Explorez les différents secteurs de la galaxie et participez aux discussions de la communauté Swor.",
};

export default function ForumIndexPage() {
  return <ForumIndex />;
}
