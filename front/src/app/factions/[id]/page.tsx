import type { Metadata } from 'next';
import FactionDetail from '@/features/factions/components/FactionDetail';

export const metadata: Metadata = {
  title: "Détails de la Faction | Swor",
  description: "Découvrez les membres et l'histoire de cette faction.",
};

export default function FactionDetailPage({ params }: { params: { id: string } }) {
  return <FactionDetail id={params.id} />;
}


