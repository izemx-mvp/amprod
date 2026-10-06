import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ShoppingBag, 
  TrendingUp, 
  Plus
} from 'lucide-react';
import { LeadOrClient, BrandConfig } from '../types';
import { AIDisclaimer } from './FooterAndDisclaimers';
import { formatCurrency, formatDateTime } from '../utils/cn';

interface Lead360ModalProps {
  lead: LeadOrClient | null;
  brand: BrandConfig;
  isOpen: boolean;
  onClose: () => void;
  onUpdateLead: (updated: LeadOrClient) => void;
}

export const Lead360Modal: React.FC<Lead360ModalProps> = ({
  lead,
  brand,
  isOpen,
  onClose,
  onUpdateLead,
}) => {
  if (!isOpen || !lead) return null;

  const [activeTab, setActiveTab] = useState<'timeline' | 'notes'>('timeline');
  const [newNoteText, setNewNoteText] = useState('');
  const [currentStatus, setCurrentStatus] = useState(lead.status);

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus);
    const updatedLead: LeadOrClient = {
      ...lead,
      status: newStatus,
      timeline: [
        {
          id: `t-${Date.now()}`,
          date: new Date().toISOString(),
          title: `Statut modifié en "${newStatus}"`,
          description: `Mise à jour directe du statut commercial.`,
          type: 'note',
          author: brand.loginRole,
          badge: 'Statut'
        },
        ...lead.timeline
      ]
    };
    onUpdateLead(updatedLead);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newTimelineItem = {
      id: `t-${Date.now()}`,
      date: new Date().toISOString(),
      title: 'Note interne ajoutée',
      description: newNoteText.trim(),
      type: 'note' as const,
      author: brand.loginRole,
      badge: 'Note Interne'
    };

    const updatedLead: LeadOrClient = {
      ...lead,
      notes: lead.notes ? `${lead.notes}\n• ${newNoteText.trim()}` : newNoteText.trim(),
      timeline: [newTimelineItem, ...lead.timeline]
    };

    onUpdateLead(updatedLead);
    setNewNoteText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative my-auto w-full max-w-5xl bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base border border-slate-700"
              style={{ backgroundColor: `${brand.primaryColor}25`, color: brand.primaryColor }}
            >
              {lead.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  {lead.name}
                </h2>
                <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium border ${
                  lead.isClient 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                }`}>
                  {lead.isClient ? 'Client' : 'Prospect'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  {lead.id}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                {lead.company && <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {lead.company}</span>}
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {lead.city}, {lead.country}</span>
                <span>• Source : {lead.source}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Qualifier Banner */}
        <div className="px-6 py-2.5 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Score IA : {lead.aiScore}%
            </div>
            <p className="text-xs text-slate-300 italic">
              « {lead.aiRationale} »
            </p>
          </div>
          <AIDisclaimer variant="compact" />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          
          {/* Main Area: Timeline */}
          <div className="lg:col-span-2 p-6 flex flex-col gap-5">
            
            {/* Quick Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-300">
                  Statut :
                </span>
                <select
                  value={currentStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="text-xs font-medium bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none"
                >
                  <option value="Nouveau">Nouveau</option>
                  <option value="Qualifié">Qualifié</option>
                  <option value="Proposition envoyée">Proposition envoyée</option>
                  <option value="Négociation Grand Compte">Négociation Grand Compte</option>
                  <option value="Inscrit">Inscrit</option>
                  <option value="Payé une avance">Payé une avance</option>
                  <option value="Confirmé">Confirmé</option>
                  <option value="Absent le jour J">Absent le jour J</option>
                  <option value="Client Actif">Client Actif</option>
                  <option value="Client Fidèle VIP">Client Fidèle VIP</option>
                  <option value="Perdu">Perdu</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${lead.phone}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  {lead.phone}
                </a>
                <a
                  href={`mailto:${lead.email}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
                >
                  <Mail className="w-3.5 h-3.5 text-sky-400" />
                  Email
                </a>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-slate-800 flex gap-4">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`pb-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'timeline'
                    ? 'border-brand-orange text-brand-orange'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Journal d'Activité ({lead.timeline.length})
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`pb-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'notes'
                    ? 'border-brand-orange text-brand-orange'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Notes & Stratégie
              </button>
            </div>

            {/* Content */}
            {activeTab === 'timeline' && (
              <div className="flex flex-col gap-4">
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Ajouter une action, note d'appel ou compte-rendu..."
                    className="flex-1 text-xs px-3 py-2 rounded-lg bg-slate-950/60 border border-slate-800 text-white placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-brand-orange hover:bg-brand-orange-hover flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Ajouter
                  </button>
                </form>

                <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
                  {lead.timeline.map((item) => (
                    <div key={item.id} className="relative">
                      <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border border-slate-900 bg-brand-orange" />
                      <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-semibold text-slate-200">
                            {item.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {formatDateTime(item.date)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          {item.description}
                        </p>
                        <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                          <span>Auteur : {item.author}</span>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-800 text-xs leading-relaxed text-slate-300 whitespace-pre-line">
                {lead.notes || 'Aucune note enregistrée.'}
              </div>
            )}
          </div>

          {/* Right Panel: Synthèse 360° */}
          <div className="p-6 bg-slate-950/40 flex flex-col gap-4">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-brand-orange" />
              Panneau Résumé 360°
            </h3>

            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Valeur Engagée</span>
                <p className="text-lg font-bold text-white mt-0.5">
                  {formatCurrency(lead.totalOrdersValue)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-emerald-400 uppercase block">Payé</span>
                  <p className="text-xs font-bold text-emerald-400 mt-0.5">
                    {formatCurrency(lead.totalPaid)}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-amber-400 uppercase block">Reste Dû</span>
                  <p className="text-xs font-bold text-amber-400 mt-0.5">
                    {formatCurrency(lead.remainingDue || 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-300 block">
                Statuts Directs
              </span>

              <div className="p-2 rounded bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-2">
                  <ShoppingBag className="w-3.5 h-3.5 text-sky-400" /> Commandes
                </span>
                <span className="font-semibold text-white">{lead.activeOrdersCount}</span>
              </div>

              <div className="p-2 rounded bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-amber-400" /> Devis
                </span>
                <span className="font-semibold text-white">{lead.pendingQuotesCount}</span>
              </div>

              <div className="p-2 rounded bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" /> Réclamations
                </span>
                <span className={`font-semibold ${lead.openClaimsCount > 0 ? 'text-rose-400' : 'text-white'}`}>
                  {lead.openClaimsCount}
                </span>
              </div>

              {lead.trainingRegisteredCount !== undefined && (
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" /> Formations
                  </span>
                  <span className="font-semibold text-white">{lead.trainingRegisteredCount}</span>
                </div>
              )}
            </div>

            <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
              <span className="block text-[10px] text-slate-400 uppercase">Gestionnaire</span>
              <span className="text-slate-200 font-medium">{lead.assignedTo}</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
