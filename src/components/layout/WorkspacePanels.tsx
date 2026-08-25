import { ImageList } from '../image/ImageList';
import { ImagePreview } from '../image/ImagePreview';
import { SettingsPanel } from '../settings/SettingsPanel';

function LeftPanel() {
  return (
    <aside className="flex w-[292px] shrink-0 flex-col border-r border-border-default bg-background-panel">
      <ImageList />
    </aside>
  );
}

function PreviewPanel() {
  return (
    <section className="flex min-w-0 flex-1 flex-col bg-editor-canvas">
      <ImagePreview />
    </section>
  );
}

export function WorkspacePanels() {
  return (
    <main className="flex min-h-0 flex-1 overflow-hidden bg-background-default">
      <LeftPanel />
      <PreviewPanel />
      <SettingsPanel />
    </main>
  );
}
