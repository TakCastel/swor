import type { Metadata } from 'next';
import FactionsIndex from '@/features/factions/components/FactionsIndex';

export const metadata: Metadata = {
  title: "Factions | Swor",
  description: "Explorez les factions et organisations de la galaxie Star Wars sur Swor.",
};

export default function FactionsPage() {
  return <FactionsIndex />;
}


