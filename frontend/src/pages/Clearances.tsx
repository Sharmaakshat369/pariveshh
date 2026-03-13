import { useEffect, useState } from 'react';
import { Home, ChevronRight, FileText, FileDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { PublicClearanceCategory } from '@/types';
import { fetchPublicContent, getDefaultPublicContent } from '@/lib/publicContent';

export default function Clearances() {
  const defaultContent = getDefaultPublicContent();
  const [sidebarLinks, setSidebarLinks] = useState<string[]>(defaultContent.clearanceSidebarLinks);
  const [clearanceCategories, setClearanceCategories] = useState<PublicClearanceCategory[]>(defaultContent.clearances);
  const [activeSidebar, setActiveSidebar] = useState('Know Your Application Forms');
  const [activeCategory, setActiveCategory] = useState('CRZ');

  useEffect(() => {
    const loadClearanceContent = async () => {
      try {
        const content = await fetchPublicContent();
        setSidebarLinks(content.clearanceSidebarLinks);
        setClearanceCategories(content.clearances);

        if (content.clearances.length > 0) {
          setActiveCategory(content.clearances[0].category);
        }
      } catch {
        setSidebarLinks(defaultContent.clearanceSidebarLinks);
        setClearanceCategories(defaultContent.clearances);
      }
    };

    void loadClearanceContent();
  }, []);

  const categories = clearanceCategories.map((category) => category.category);
  const selectedCategory = clearanceCategories.find((category) => category.category === activeCategory);
  const currentForms = selectedCategory?.forms || [];

  return (
    <div className="min-h-screen bg-stone-50/50 flex flex-col font-sans">
      
      {/* 4 Category Tabs (Top) */}
      <div className="bg-white border-b border-border">
        <div className="gov-container px-4 md:px-6">
          <div className="flex overflow-x-auto no-scrollbar gap-1 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 text-sm font-bold uppercase tracking-wide border-b-4 transition-colors whitespace-nowrap ${
                  activeCategory === cat
                    ? 'border-emerald-600 text-emerald-800'
                    : 'border-transparent text-foreground/60 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-t-lg'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="gov-container px-4 md:px-6 py-8 md:py-10 flex-grow relative">
        
        {/* Subtle background pattern/leaf image could go here, for now using css */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 relative z-10">
          
          {/* Left Sidebar Menu */}
          <div className="md:col-span-4 lg:col-span-3">
             <div className="bg-white rounded-xl shadow-sm border border-border/50 overflow-hidden flex flex-col pb-2">
              {sidebarLinks.map((link) => (
                <button
                  key={link}
                  onClick={() => setActiveSidebar(link)}
                  className={`flex items-center justify-between px-5 py-4 text-sm font-medium transition-colors text-left ${
                    activeSidebar === link
                      ? 'bg-emerald-50 text-emerald-800 font-semibold border-l-4 border-emerald-600'
                      : 'text-foreground/80 hover:bg-stone-50 border-l-4 border-transparent'
                  } border-b border-border/40 last:border-0`}
                >
                  {link}
                  <ChevronRight size={16} className={activeSidebar === link ? 'text-emerald-600' : 'text-muted-foreground/50'} />
                </button>
              ))}
            </div>
          </div>

          {/* Right Content */}
          <div className="md:col-span-8 lg:col-span-9">
            <h2 className="text-2xl font-semibold text-foreground mb-6">{activeSidebar}</h2>
            
            {activeSidebar === 'Know Your Application Forms' ? (
              <div className="bg-white rounded-xl shadow-sm border border-emerald-100/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-[#0f951e] text-white">
                      <tr>
                        <th className="px-4 py-4 font-semibold text-center w-16">S. No.</th>
                        <th className="px-6 py-4 font-semibold border-l border-emerald-500/30">Form Name</th>
                        <th className="px-4 py-4 font-semibold text-center border-l border-emerald-500/30 w-24">View</th>
                        <th className="px-6 py-4 font-semibold border-l border-emerald-500/30 w-[30%]">Form Description</th>
                        <th className="px-6 py-4 font-semibold border-l border-emerald-500/30 w-[25%]">Form Sequence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {currentForms.map((item, idx) => (
                        <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/30'} hover:bg-emerald-50/30 transition-colors`}>
                          <td className="px-4 py-4 text-center font-medium text-foreground/80">{idx + 1}</td>
                          <td className="px-6 py-4 text-foreground/80">{item.name}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <a href={item.docUrl || '#'} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700 hover:scale-110 transition-transform flex flex-col items-center group" title="Download DOC">
                                <FileText size={18} />
                                <span className="text-[9px] font-bold group-hover:underline">DOC</span>
                              </a>
                              <a href={item.pdfUrl || '#'} target="_blank" rel="noreferrer" className="text-red-500 hover:text-red-700 hover:scale-110 transition-transform flex flex-col items-center group" title="Download PDF">
                                <FileDown size={18} />
                                <span className="text-[9px] font-bold group-hover:underline">PDF</span>
                              </a>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-foreground/70">{item.desc}</td>
                          <td className="px-6 py-4 text-foreground/70">{item.seq}</td>
                        </tr>
                      ))}
                      {currentForms.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                            No forms available for this category yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-border/50 p-12 text-center text-muted-foreground">
                    Content for {activeSidebar} goes here. Select "Know Your Application Forms" to view the table.
                </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
