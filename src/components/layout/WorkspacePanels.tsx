import { ImageList } from '../image/ImageList';
import { ImagePreview } from '../image/ImagePreview';
import { LogoUploader } from '../logo/LogoUploader';

function LeftPanel() {
  return (
    <aside className="flex w-[280px] shrink-0 flex-col border-r border-border-default bg-background-panel">
      <div className="border-b border-border-default px-5 py-4">
        <h2 className="text-lg font-semibold">Image List</h2>
      </div>
      <ImageList />
    </aside>
  );
}

function PreviewPanel() {
  return (
    <section className="flex min-w-0 flex-1 flex-col bg-[#F5F5F5]">
      <div className="border-b border-border-default bg-background-panel px-6 py-4">
        <h2 className="text-lg font-semibold">Preview</h2>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <ImagePreview />
      </div>
    </section>
  );
}

function SettingsPanel() {
  return (
    <aside className="flex w-[360px] shrink-0 flex-col border-l border-border-default bg-background-panel">
      <div className="border-b border-border-default px-5 py-4">
        <h2 className="text-lg font-semibold">Settings</h2>
      </div>
      <div className="space-y-4 p-5">
        <LogoUploader position="left" />
        <LogoUploader position="right" />
      </div>
    </aside>
  );
}

export function WorkspacePanels() {
  return (
    <main className="flex min-h-0 flex-1 overflow-hidden">
      <LeftPanel />
      <PreviewPanel />
      <SettingsPanel />
    </main>
  );
}
