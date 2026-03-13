import { Download, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { PublicManual } from '@/types';
import { fetchPublicContent, getDefaultPublicContent } from '@/lib/publicContent';

export default function Manuals() {
  const [manuals, setManuals] = useState<PublicManual[]>(getDefaultPublicContent().manuals);

  useEffect(() => {
    const loadManuals = async () => {
      try {
        const content = await fetchPublicContent();
        setManuals(content.manuals);
      } catch {
        setManuals(getDefaultPublicContent().manuals);
      }
    };

    void loadManuals();
  }, []);

  return (
    <div className="gov-section">
      <div className="gov-container">
        <div className="mb-10 max-w-2xl">
          <h1 className="gov-heading">Manuals & Walkthroughs</h1>
          <p className="text-muted-foreground">Download user manuals and step-by-step guides for using the PARIVESH portal.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {manuals.map((manual, index) => (
            <div key={`${manual.title}-${index}`} className="gov-card p-6 flex flex-col">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <BookOpen size={20} />
              </div>
              <h3 className="font-semibold mb-2">{manual.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1">{manual.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{manual.fileSize} • {manual.category}</span>
                <a href={manual.downloadUrl || '#'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  <Download size={14} /> Download
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
