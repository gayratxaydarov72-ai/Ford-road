import React, { useState } from 'react';
import { X, ExternalLink, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { SAMPLE_PROJECTS } from '../services/constants';
import { Project } from '../types';

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLetsTalk?: () => void;
}

export const ProjectsModal: React.FC<ProjectsModalProps> = ({
  isOpen,
  onClose,
  onOpenLetsTalk
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  if (!isOpen) return null;

  const allTags = ['All', 'Spatial UI', 'Generative AI', 'WebGL', 'Kinetic Art', 'Brand Design'];

  const filtered = selectedTag === 'All'
    ? SAMPLE_PROJECTS
    : SAMPLE_PROJECTS.filter(p => p.tags.includes(selectedTag));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-[#09090b] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#0e0e12]">
          <div>
            <span className="text-xs text-amber-400 font-semibold tracking-wider uppercase">Foldcraft Archive</span>
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">Selected Works & Case Studies</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-6 py-3 border-b border-white/10 bg-black/40 flex items-center gap-2 overflow-x-auto custom-scrollbar">
          <Filter className="w-3.5 h-3.5 text-white/40 flex-shrink-0" />
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0 ${
                selectedTag === tag
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Grid of Projects */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(project => (
            <div
              key={project.id}
              onClick={() => setActiveProject(project)}
              className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:border-white/30 transition-all cursor-pointer flex flex-col"
            >
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono text-white/80">
                  {project.year}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-amber-300 font-medium">{project.category}</span>
                  <h3 className="text-lg font-semibold text-white mt-1 group-hover:text-amber-200 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/60 mt-2 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/70">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-white font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA bar */}
        <div className="p-4 border-t border-white/10 bg-[#0e0e12] flex items-center justify-between">
          <span className="text-xs text-white/50">Ready to initiate your custom visual architecture?</span>
          <button
            onClick={() => {
              onClose();
              if (onOpenLetsTalk) onOpenLetsTalk();
            }}
            className="rounded-xl bg-white px-5 py-2 text-xs font-semibold text-black hover:scale-105 active:scale-95 transition-all shadow-md"
          >
            Start a Project
          </button>
        </div>
      </div>

      {/* Deep Dive Case Study Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-3xl">
          <div className="relative w-full max-w-4xl bg-[#0d0d10] border border-white/20 rounded-3xl p-6 sm:p-8 overflow-y-auto max-h-[85vh] custom-scrollbar">
            <button
              onClick={() => setActiveProject(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={activeProject.image}
              alt={activeProject.title}
              className="w-full h-72 object-cover rounded-2xl mb-6 border border-white/15"
            />

            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">{activeProject.category} · {activeProject.year}</span>
            <h2 className="text-2xl sm:text-4xl font-semibold text-white mt-1 mb-4">{activeProject.title}</h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-6">
              {activeProject.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
              <div>
                <span className="text-[11px] text-white/40 block">Deliverables</span>
                <span className="text-xs text-white font-medium">Design System, Shader Pipeline, WebGL</span>
              </div>
              <div>
                <span className="text-[11px] text-white/40 block">Client Industry</span>
                <span className="text-xs text-white font-medium">Spatial Computing & Autonomous AI</span>
              </div>
              <div>
                <span className="text-[11px] text-white/40 block">Impact</span>
                <span className="text-xs text-white font-medium">+340% User Immersion & Retention</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setActiveProject(null);
                  onClose();
                  if (onOpenLetsTalk) onOpenLetsTalk();
                }}
                className="px-6 py-3 bg-white text-black font-semibold text-sm rounded-xl hover:scale-105 transition-all shadow-lg"
              >
                Inquire Similar Architecture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
