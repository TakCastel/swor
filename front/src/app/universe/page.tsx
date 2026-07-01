import type { Metadata } from 'next';
import UniverseContent from '@/features/universe/components/UniverseContent';

export const metadata: Metadata = {
  title: "Encyclopédie",
  description: "Consultez les archives galactiques de Swor : histoire, géographie, sociétés et sciences de l'univers Star Wars.",
};

export default function UniversePage() {
  return <UniverseContent />;
}
