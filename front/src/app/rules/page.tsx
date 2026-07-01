import type { Metadata } from 'next';
import RulesOverview from '@/features/rules/components/RulesOverview';

export const metadata: Metadata = {
  title: "Règlement",
  description: "Lisez le règlement officiel de Swor pour garantir une expérience de jeu de qualité à tous les membres.",
};

export default function RulesOverviewPage() {
  return <RulesOverview />;
}
