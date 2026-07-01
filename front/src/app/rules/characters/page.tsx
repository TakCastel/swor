import { notFound } from 'next/navigation';
import { RULES_DATA } from '@/features/rules/data/rules-data';
import RulesSectionDetail from '@/features/rules/components/RulesSectionDetail';

export default function CharacterRulesPage() {
  const section = RULES_DATA.find(s => s.id === 'characters');
  if (!section) notFound();
  return <RulesSectionDetail section={section} />;
}
