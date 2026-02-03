import { TeamList } from '@/components/settings/team-list';

export default function TeamSettingsPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Gerenciamento de Equipe</h1>
      <TeamList />
    </div>
  );
}
