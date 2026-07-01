import RulesLayoutComponent from '@/features/rules/components/RulesLayout';

export default function RulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RulesLayoutComponent>{children}</RulesLayoutComponent>;
}
