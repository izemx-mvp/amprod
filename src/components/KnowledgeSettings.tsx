import React, { useState } from 'react';
import { 
  UploadCloud, 
  Trash2, 
  Plus, 
  HelpCircle, 
  CheckCircle2, 
  FileCheck, 
  BookOpen
} from 'lucide-react';
import { BrandConfig } from '../types';
import { AiKnowledgeDoc, FaqItem } from '../data/seoAndSettings';
import { AIDisclaimer } from './FooterAndDisclaimers';

interface KnowledgeSettingsProps {
  brand: BrandConfig;
  docs: AiKnowledgeDoc[];
  onUpdateDocs: (docs: AiKnowledgeDoc[]) => void;
  faqs: FaqItem[];
  onUpdateFaqs: (faqs: FaqItem[]) => void;
}

export const KnowledgeSettings: React.FC<KnowledgeSettingsProps> = ({
  brand,
  docs,
  onUpdateDocs,
  faqs,
  onUpdateFaqs,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newCategory, setNewCategory] = useState('Général');
  const [showAddFaq, setShowAddFaq] = useState(false);
  const [uploadToast, setUploadToast] = useState('');

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const newDoc: AiKnowledgeDoc = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: file.type || 'application/pdf',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedAt: new Date().toISOString().split('T')[0],
        tokensProcessed: Math.floor(Math.random() * 20000) + 5000,
        category: 'Bon de commande'
      };
      onUpdateDocs([newDoc, ...docs]);
      setUploadToast(`Document "${file.name}" vectorisé avec succès dans la base IA !`);
      setTimeout(() => setUploadToast(''), 3000);
    }
  };

  const handleSimulatedUpload = () => {
    const mockFiles = [
      'Modele_Facture_Export_Douane_2026.pdf',
      'Charte_Controle_Qualite_Huiles_Barbarie.docx',
      'Conditions_Generales_Vente_Cosmetique_B2B.pdf',
      'Grille_Tarifaire_Grossiste_Palettes_2026.xlsx'
    ];
    const randomName = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    const newDoc: AiKnowledgeDoc = {
      id: `doc-${Date.now()}`,
      name: randomName,
      type: 'application/pdf',
      size: '2.1 MB',
      uploadedAt: new Date().toISOString().split('T')[0],
      tokensProcessed: 18450,
      category: 'Devis'
    };
    onUpdateDocs([newDoc, ...docs]);
    setUploadToast(`Document "${randomName}" importé et indexé par l'IA !`);
    setTimeout(() => setUploadToast(''), 3000);
  };

  const handleDeleteDoc = (id: string) => {
    onUpdateDocs(docs.filter(d => d.id !== id));
  };

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    const newFaq: FaqItem = {
      id: `faq-${Date.now()}`,
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      category: newCategory,
      hitsCount: 1
    };

    onUpdateFaqs([newFaq, ...faqs]);
    setNewQuestion('');
    setNewAnswer('');
    setShowAddFaq(false);
  };

  const handleDeleteFaq = (id: string) => {
    onUpdateFaqs(faqs.filter(f => f.id !== id));
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Paramètres & Base de Connaissances IA
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Indexation sémantique des documents métiers (Bons de commande, Factures, Devis) et base FAQ pour {brand.name}.
          </p>
        </div>

        <AIDisclaimer variant="badge" />
      </div>

      {/* KPI Vector DB */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90">
          <span className="text-xs font-medium text-slate-400">Documents Indexés</span>
          <p className="text-2xl font-bold text-white mt-3">
            {docs.length} fichiers modèles
          </p>
          <span className="text-[10px] text-emerald-400 mt-1 block">Bons de commande, Factures, Devis</span>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90">
          <span className="text-xs font-medium text-slate-400">Tokens Vectorisés</span>
          <p className="text-2xl font-bold text-indigo-400 mt-3">
            {docs.reduce((acc, d) => acc + d.tokensProcessed, 0).toLocaleString('fr-FR')} tokens
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">Embeddings sémantiques réactifs</span>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90">
          <span className="text-xs font-medium text-slate-400">Questions FAQ Apprises</span>
          <p className="text-2xl font-bold text-amber-400 mt-3">
            {faqs.length} réponses types
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">Restituées par le bot WhatsApp</span>
        </div>
      </div>

      {/* Upload Drag & Drop Area */}
      <div className="w-full p-6 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-brand-orange" />
            Importer des Modèles de Documents Métier
          </h3>
          <span className="text-xs text-slate-400">PDF, DOCX, XLSX (Max 25 MB)</span>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={handleSimulatedUpload}
          className={`cursor-pointer border border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all ${
            isDragging
              ? 'border-brand-orange bg-orange-500/10'
              : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 text-brand-orange flex items-center justify-center mb-2">
            <UploadCloud className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-semibold text-slate-200 mb-1">
            Glissez vos fichiers ici ou cliquez pour importer
          </h4>
          <p className="text-[11px] text-slate-400 max-w-sm">
            Extraction automatique de la structure pour enrichir l'agent IA.
          </p>
        </div>

        {uploadToast && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {uploadToast}
          </div>
        )}

        {/* Existing Documents List */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Documents Métiers Indexés ({docs.length})
          </h4>

          <div className="divide-y divide-slate-800/60 border border-slate-800 rounded-lg overflow-hidden">
            {docs.map((doc) => (
              <div key={doc.id} className="p-3 bg-slate-950/40 flex items-center justify-between gap-3 hover:bg-slate-900/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-slate-200">
                      {doc.name}
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      Catégorie : {doc.category} • {doc.size} • {doc.tokensProcessed.toLocaleString()} tokens
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    Vectorisé
                  </span>
                  <button
                    onClick={() => handleDeleteDoc(doc.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic FAQ Management */}
      <div className="w-full p-6 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-brand-orange" />
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Gestion de la FAQ Dynamique Chatbot
            </h3>
          </div>
          <button
            onClick={() => setShowAddFaq(!showAddFaq)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-brand-orange hover:bg-brand-orange-hover flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Ajouter Question / Réponse
          </button>
        </div>

        {showAddFaq && (
          <form onSubmit={handleAddFaq} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 block mb-1">
                  Question Fréquente
                </label>
                <input
                  type="text"
                  required
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  Catégorie
                </label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Réponse Officielle
              </label>
              <textarea
                rows={3}
                required
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddFaq(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-medium text-white bg-brand-orange hover:bg-brand-orange-hover"
              >
                Enregistrer
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.id} className="p-4 rounded-lg bg-slate-950/50 border border-slate-800 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-semibold text-brand-orange uppercase block mb-0.5">
                    {faq.category}
                  </span>
                  <h4 className="text-xs font-semibold text-slate-200">
                    {faq.question}
                  </h4>
                </div>

                <button
                  onClick={() => handleDeleteFaq(faq.id)}
                  className="p-1 rounded text-slate-400 hover:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/40 p-2.5 rounded-md border border-slate-800/60">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
