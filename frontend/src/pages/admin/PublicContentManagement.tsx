import { useEffect, useState } from 'react';
import type { PublicContent } from '@/types';
import { fetchPublicContent, getDefaultPublicContent, updatePublicContent } from '@/lib/publicContent';

const formatJson = (value: unknown) => JSON.stringify(value, null, 2);

export default function PublicContentManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  const [topUpdatesText, setTopUpdatesText] = useState('');
  const [sidebarLinksText, setSidebarLinksText] = useState('');
  const [manualsJson, setManualsJson] = useState('');
  const [clearancesJson, setClearancesJson] = useState('');

  const hydrateForm = (content: PublicContent) => {
    setTopUpdatesText(content.homeTopUpdates.join('\n'));
    setSidebarLinksText(content.clearanceSidebarLinks.join('\n'));
    setManualsJson(formatJson(content.manuals));
    setClearancesJson(formatJson(content.clearances));
  };

  const loadContent = async () => {
    setIsLoading(true);
    setLoadError('');

    try {
      const content = await fetchPublicContent();
      hydrateForm(content);
    } catch (error) {
      const fallback = getDefaultPublicContent();
      hydrateForm(fallback);
      setLoadError(error instanceof Error ? error.message : 'Failed to load content from server. Showing defaults.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadContent();
  }, []);

  const onSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaveError('');
    setSaveSuccess('');

    let parsedManuals: PublicContent['manuals'];
    let parsedClearances: PublicContent['clearances'];

    try {
      parsedManuals = JSON.parse(manualsJson) as PublicContent['manuals'];
      if (!Array.isArray(parsedManuals)) {
        setSaveError('Manuals JSON must be an array.');
        return;
      }
    } catch {
      setSaveError('Manuals JSON is invalid. Please fix format.');
      return;
    }

    try {
      parsedClearances = JSON.parse(clearancesJson) as PublicContent['clearances'];
      if (!Array.isArray(parsedClearances)) {
        setSaveError('Clearances JSON must be an array.');
        return;
      }
    } catch {
      setSaveError('Clearances JSON is invalid. Please fix format.');
      return;
    }

    const payload: PublicContent = {
      homeTopUpdates: topUpdatesText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      clearanceSidebarLinks: sidebarLinksText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      manuals: parsedManuals,
      clearances: parsedClearances,
    };

    setIsSaving(true);
    try {
      const updatedContent = await updatePublicContent(payload);
      hydrateForm(updatedContent);
      setSaveSuccess('Public website content updated successfully.');
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-serif font-bold text-foreground">Public Content Management</h2>
        <p className="text-sm text-muted-foreground mt-1">Edit home page top updates, manuals, and clearance page data shown on the public portal.</p>
      </div>

      <form onSubmit={onSave} className="space-y-6">
        <div className="gov-card p-6 space-y-3">
          <h3 className="text-base font-semibold">Top Updates (Home Page)</h3>
          <p className="text-xs text-muted-foreground">One update per line. These appear at the top of the home page.</p>
          <textarea
            value={topUpdatesText}
            onChange={(event) => setTopUpdatesText(event.target.value)}
            className="gov-input min-h-32"
            placeholder="Enter one update per line"
          />
        </div>

        <div className="gov-card p-6 space-y-3">
          <h3 className="text-base font-semibold">Clearance Sidebar Links</h3>
          <p className="text-xs text-muted-foreground">One link label per line for the left menu on the clearances page.</p>
          <textarea
            value={sidebarLinksText}
            onChange={(event) => setSidebarLinksText(event.target.value)}
            className="gov-input min-h-28"
            placeholder="Enter one sidebar item per line"
          />
        </div>

        <div className="gov-card p-6 space-y-3">
          <h3 className="text-base font-semibold">Manuals (JSON)</h3>
          <p className="text-xs text-muted-foreground">Array of manuals with keys: title, description, category, fileSize, downloadUrl.</p>
          <textarea
            value={manualsJson}
            onChange={(event) => setManualsJson(event.target.value)}
            className="gov-input min-h-64 font-mono text-xs"
            placeholder="[]"
          />
        </div>

        <div className="gov-card p-6 space-y-3">
          <h3 className="text-base font-semibold">Clearance Forms (JSON)</h3>
          <p className="text-xs text-muted-foreground">Array of categories. Each category: category + forms[]. Each form: name, desc, seq, docUrl, pdfUrl.</p>
          <textarea
            value={clearancesJson}
            onChange={(event) => setClearancesJson(event.target.value)}
            className="gov-input min-h-80 font-mono text-xs"
            placeholder="[]"
          />
        </div>

        {(loadError || saveError || saveSuccess) && (
          <div className="space-y-1 text-xs">
            {loadError && <p className="text-destructive">{loadError}</p>}
            {saveError && <p className="text-destructive">{saveError}</p>}
            {saveSuccess && <p className="text-accent">{saveSuccess}</p>}
          </div>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={isLoading || isSaving} className="gov-btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
            {isSaving ? 'Saving...' : 'Save Public Content'}
          </button>
          <button
            type="button"
            onClick={() => void loadContent()}
            disabled={isLoading || isSaving}
            className="gov-btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reload
          </button>
        </div>
      </form>
    </div>
  );
}
