import type { Metadata } from 'next';
import PortalContent from '@/features/portal/components/PortalContent';

export const metadata: Metadata = {
  title: "Accueil | Swor",
  description: "Bienvenue sur Swor, le portail vers vos aventures Star Wars Roleplay.",
};

export default function PortalPage() {
  return <PortalContent />;
}
