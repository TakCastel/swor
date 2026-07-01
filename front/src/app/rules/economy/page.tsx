import { notFound } from 'next/navigation';
import { RULES_DATA } from '@/features/rules/data/rules-data';
import RulesSectionDetail from '@/features/rules/components/RulesSectionDetail';

export default function EconomyRulesPage() {
  const section = RULES_DATA.find(s => s.id === 'economy');
  if (!section) notFound();
  return <RulesSectionDetail section={section} />;
}
