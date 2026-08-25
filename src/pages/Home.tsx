import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import { WorkspacePanels } from '../components/layout/WorkspacePanels';

export function Home() {
  return (
    <div className="flex h-screen min-w-[1180px] flex-col overflow-hidden bg-background-default font-sans text-slate-950">
      <Header />
      <WorkspacePanels />
      <Footer />
    </div>
  );
}
