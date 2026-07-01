import { notFound } from 'next/navigation';
import { RULES_DATA } from '@/features/rules/data/rules-data';
import RulesSectionDetail from '@/features/rules/components/RulesSectionDetail';

export default function RoleplayRulesPage() {
  const section = RULES_DATA.find(s => s.id === 'roleplay');
  if (!section) notFound();
  return <RulesSectionDetail section={section} />;
}
