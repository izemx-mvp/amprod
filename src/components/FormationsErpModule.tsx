import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  Calendar as CalendarIcon, 
  RotateCcw, 
  CreditCard, 
  BarChart2, 
  Search, 
  Eye, 
  Plus, 
  Trash2, 
  Edit2, 
  Copy, 
  CheckCircle2, 
  X, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  MessageSquare, 
  FileText, 
  Mail, 
  Send, 
  Sparkles, 
  Award, 
  BookOpen, 
  DollarSign, 
  Clock, 
  MapPin, 
  HelpCircle, 
  ThumbsUp, 
  Filter, 
  Check, 
  CalendarDays,
  PhoneCall,
  AlertCircle,
  Download,
  Printer
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { 
  TrainingCourse, 
  TrainingSession, 
  LeadOrClient, 
  BrandConfig, 
  Invoice, 
  TrainingReview, 
  EmailTemplate, 
  WhatsAppConversation, 
  ChatMessage 
} from '../types';
import { AIDisclaimer } from './FooterAndDisclaimers';
import { formatCurrency, formatDate, formatDateTime } from '../utils/cn';

interface FormationsErpModuleProps {
  brand: BrandConfig;
  courses: TrainingCourse[];
  onUpdateCourses: (courses: TrainingCourse[]) => void;
  leads: LeadOrClient[];
  onUpdateLeads: (leads: LeadOrClient[]) => void;
  invoices: Invoice[];
  onUpdateInvoices?: (invoices: Invoice[]) => void;
  onOpenLead: (lead: LeadOrClient) => void;
  activeSubView: 'dashboard' | 'leads' | 'formations' | 'calendrier' | 'relance' | 'paiements' | 'analytics' | 'avis' | 'conversations' | 'settings_ia';
  reviews?: TrainingReview[];
  onUpdateReviews?: (reviews: TrainingReview[]) => void;
  emailTemplates?: EmailTemplate[];
  onUpdateEmailTemplates?: (templates: EmailTemplate[]) => void;
  conversations?: WhatsAppConversation[];
  onUpdateConversations?: (conversations: WhatsAppConversation[]) => void;
}

export const FormationsErpModule: React.FC<FormationsErpModuleProps> = ({
  brand,
  courses,
  onUpdateCourses,
  leads,
  onUpdateLeads,
  invoices,
  onOpenLead,
  activeSubView,
  reviews = [],
  onUpdateReviews,
  emailTemplates = [],
  onUpdateEmailTemplates,
  conversations = [],
  onUpdateConversations,
}) => {
  const formationLeads = leads.filter(l => l.brandId === 'formations');
  const formationInvoices = invoices.filter(i => i.brandId === 'formations');

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // 1. LEADS MODAL & EDIT STATE
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<LeadOrClient | null>(null);
  const [leadFormData, setLeadFormData] = useState({
    name: '',
    phone: '',
    city: '',
    email: '',
    trainingCourse: courses[0]?.title || 'Masterclass Formulation Émulsions, Sérums & Soins Actifs',
    status: 'Inscrit',
    totalAmount: 12000,
    paidAmount: 0,
  });

  // 2. FORMATIONS MODAL & EDIT & PAGINATION
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<TrainingCourse | null>(null);
  const [courseFormData, setCourseFormData] = useState({
    title: '',
    code: '',
    level: 'Avancé' as 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Masterclass',
    durationDays: 3,
    priceTotal: 8500,
    minDeposit: 3000,
    instructor: 'Dr. Leila Zerouali',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    description: '',
  });
  const [coursePage, setCoursePage] = useState(1);
  const coursesPerPage = 6; // STRICT PAGINATION OF 6 CARDS PER PAGE

  // 3. CALENDRIER INTERACTIF (Jour / Mois / Année) & SESSION MODAL
  const [calendarViewMode, setCalendarViewMode] = useState<'day' | 'month' | 'year'>('month');
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date(2026, 10, 1)); // Nov 2026
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<{ courseId: string; session: TrainingSession } | null>(null);
  const [sessionFormData, setSessionFormData] = useState({
    courseId: courses[0]?.id || '',
    startDate: '2026-11-15',
    endDate: '2026-11-18',
    location: 'Campus AM PROD Laboratoires — Casablanca',
    maxAttendees: 12,
    enrolledCount: 1,
    status: 'Planifiée' as 'Planifiée' | 'En cours' | 'Clôturée' | 'Complète'
  });

  // 4. PAIEMENTS FRACTIONNÉS DRAWER / MODAL
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // 6. WHATSAPP WEB CONVERSATIONS STATE
  const [activeWhatsAppLeadId, setActiveWhatsAppLeadId] = useState<string>(formationLeads[0]?.id || '');
  const [whatsAppInput, setWhatsAppInput] = useState('');
  const [internalMessages, setInternalMessages] = useState<Record<string, Array<{ id: string; sender: 'lead' | 'ai' | 'agent'; text: string; time: string }>>>({
    'form-lead-1': [
      { id: '1', sender: 'lead', text: 'Bonjour Sofia, est-il possible de payer en 2 fois pour la Masterclass Formulation ?', time: '16:50' },
      { id: '2', sender: 'ai', text: 'Bonjour Houda ! Absolument. Vous pouvez régler une avance de réservation de 4 000 MAD en ligne aujourd\'hui, et le solde de 8 000 MAD le premier jour en début de session.', time: '16:51' },
      { id: '3', sender: 'lead', text: 'Parfait, le virement de l\'acompte de 4 000 MAD est effectué. À quelle heure débute le premier jour ?', time: '17:15' },
      { id: '4', sender: 'agent', text: 'Bonjour Houda, acompte bien réceptionné ! L\'accueil café démarre à 08h30 pour un début des travaux à 09h00.', time: '17:20' }
    ],
    'form-lead-2': [
      { id: '1', sender: 'lead', text: 'Bonjour, convention pour 2 collaborateurs transmise signée ce matin.', time: '10:00' },
      { id: '2', sender: 'agent', text: 'Bien reçu Karim ! Les accès à la plateforme documentaire et le programme détaillé sont envoyés.', time: '10:05' }
    ]
  });

  // 7. PARAMETRES IA TABS (FAQ / Documents / Emails)
  const [knowledgeTab, setKnowledgeTab] = useState<'faq' | 'documents' | 'emails'>('faq');

  // 8. RELANCES CANDIDATS & ANALYTICS STATE
  const [relanceStatuses, setRelanceStatuses] = useState<Record<string, 'À relancer' | 'Relance WhatsApp envoyée' | 'Relance Email planifiée' | 'Converti'>>({
    'form-lead-1': 'Converti',
    'form-lead-2': 'Converti',
    'form-lead-3': 'À relancer',
    'form-lead-4': 'À relancer',
    'form-lead-5': 'Relance WhatsApp envoyée',
    'form-lead-6': 'Relance Email planifiée',
  });
  const [relanceToast, setRelanceToast] = useState<string | null>(null);
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'30j' | 'trimestre' | 'annee'>('annee');

  const handleTriggerRelance = (leadId: string, leadName: string, channel: 'WhatsApp' | 'Email' | 'Converti') => {
    if (channel === 'WhatsApp') {
      setRelanceStatuses(prev => ({ ...prev, [leadId]: 'Relance WhatsApp envoyée' }));
      setRelanceToast(`Relance WhatsApp officielle transmise avec succès à ${leadName} !`);
    } else if (channel === 'Email') {
      setRelanceStatuses(prev => ({ ...prev, [leadId]: 'Relance Email planifiée' }));
      setRelanceToast(`Modèle d'email d'inscription préparé et envoyé pour ${leadName}.`);
    } else {
      setRelanceStatuses(prev => ({ ...prev, [leadId]: 'Converti' }));
      setRelanceToast(`Félicitations ! Le candidat ${leadName} est validé et marqué comme Converti.`);
    }
    setTimeout(() => setRelanceToast(null), 3500);
  };

  // ---------- HANDLERS: LEADS ----------
  const handleOpenNewLeadModal = () => {
    setEditingLead(null);
    setLeadFormData({
      name: '',
      phone: '',
      city: '',
      email: '',
      trainingCourse: courses[0]?.title || 'Masterclass Formulation Émulsions, Sérums & Soins Actifs',
      status: 'Inscrit',
      totalAmount: 12000,
      paidAmount: 0,
    });
    setIsLeadModalOpen(true);
  };

  const handleEditLead = (lead: LeadOrClient) => {
    setEditingLead(lead);
    setLeadFormData({
      name: lead.name,
      phone: lead.phone,
      city: lead.city,
      email: lead.email,
      trainingCourse: courses[0]?.title || '',
      status: lead.status,
      totalAmount: lead.totalOrdersValue || 12000,
      paidAmount: lead.totalPaid || 0,
    });
    setIsLeadModalOpen(true);
  };

  const handleDeleteLead = (leadId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce candidat ?")) {
      const updated = leads.filter(l => l.id !== leadId);
      onUpdateLeads(updated);
    }
  };

  const handleDuplicateLead = (cand: LeadOrClient) => {
    const duplicated: LeadOrClient = {
      ...cand,
      id: `form-lead-${Date.now()}`,
      name: `${cand.name} (Copie)`,
      email: `copie.${cand.email}`,
    };
    onUpdateLeads([duplicated, ...leads]);
  };

  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    const remaining = Math.max(0, leadFormData.totalAmount - leadFormData.paidAmount);

    if (editingLead) {
      const updated = leads.map(l => {
        if (l.id === editingLead.id) {
          return {
            ...l,
            name: leadFormData.name,
            phone: leadFormData.phone,
            city: leadFormData.city,
            email: leadFormData.email,
            status: leadFormData.status,
            totalOrdersValue: Number(leadFormData.totalAmount),
            totalPaid: Number(leadFormData.paidAmount),
            remainingDue: remaining,
          };
        }
        return l;
      });
      onUpdateLeads(updated);
    } else {
      const newLead: LeadOrClient = {
        id: `form-lead-${Date.now()}`,
        brandId: 'formations',
        isClient: false,
        name: leadFormData.name,
        company: 'Porteur de projet',
        email: leadFormData.email || `${leadFormData.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
        phone: leadFormData.phone,
        city: leadFormData.city,
        country: 'Maroc',
        source: 'WhatsApp',
        status: leadFormData.status,
        aiScore: 85,
        aiRationale: 'Dossier créé manuellement par la direction pédagogique.',
        lastContact: new Date().toISOString(),
        assignedTo: 'Salma Cherkaoui (Conseillère Admission)',
        totalOrdersValue: Number(leadFormData.totalAmount),
        totalPaid: Number(leadFormData.paidAmount),
        remainingDue: remaining,
        activeOrdersCount: 0,
        pendingQuotesCount: 0,
        openClaimsCount: 0,
        trainingRegisteredCount: 1,
        notes: `Inscrit au parcours : ${leadFormData.trainingCourse}`,
        timeline: [
          {
            id: `t-${Date.now()}`,
            date: new Date().toISOString(),
            title: `Candidat créé avec statut "${leadFormData.status}"`,
            description: `Parcours sélectionné : ${leadFormData.trainingCourse}.`,
            type: 'training',
            author: brand.loginRole,
            badge: 'Admissions'
          }
        ]
      };
      onUpdateLeads([newLead, ...leads]);
    }
    setIsLeadModalOpen(false);
  };

  // ---------- HANDLERS: COURSES ----------
  const handleOpenNewCourseModal = () => {
    setEditingCourse(null);
    setCourseFormData({
      title: '',
      code: `FORM-${Date.now().toString().slice(-4)}`,
      level: 'Intermédiaire',
      durationDays: 3,
      priceTotal: 8500,
      minDeposit: 3000,
      instructor: 'Dr. Leila Zerouali',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
      description: '',
    });
    setIsCourseModalOpen(true);
  };

  const handleEditCourse = (course: TrainingCourse) => {
    setEditingCourse(course);
    setCourseFormData({
      title: course.title,
      code: course.code,
      level: course.level,
      durationDays: course.durationDays,
      priceTotal: course.priceTotal,
      minDeposit: course.minDeposit,
      instructor: course.instructor,
      image: course.image,
      description: course.description,
    });
    setIsCourseModalOpen(true);
  };

  const handleDeleteCourse = (courseId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")) {
      const updated = courses.filter(c => c.id !== courseId);
      onUpdateCourses(updated);
    }
  };

  const handleDuplicateCourse = (course: TrainingCourse) => {
    const duplicated: TrainingCourse = {
      ...course,
      id: `train-${Date.now()}`,
      code: `${course.code}-CPY`,
      title: `${course.title} (Copie)`,
    };
    onUpdateCourses([duplicated, ...courses]);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse) {
      const updated = courses.map(c => {
        if (c.id === editingCourse.id) {
          return {
            ...c,
            title: courseFormData.title,
            code: courseFormData.code,
            level: courseFormData.level,
            durationDays: Number(courseFormData.durationDays),
            priceTotal: Number(courseFormData.priceTotal),
            minDeposit: Number(courseFormData.minDeposit),
            instructor: courseFormData.instructor,
            image: courseFormData.image,
            description: courseFormData.description,
          };
        }
        return c;
      });
      onUpdateCourses(updated);
    } else {
      const newCourse: TrainingCourse = {
        id: `tr-${Date.now()}`,
        title: courseFormData.title,
        code: courseFormData.code,
        level: courseFormData.level,
        durationDays: Number(courseFormData.durationDays),
        priceTotal: Number(courseFormData.priceTotal),
        minDeposit: Number(courseFormData.minDeposit),
        totalEnrolled: 0,
        completionRate: 100,
        rating: 5.0,
        image: courseFormData.image,
        instructor: courseFormData.instructor,
        description: courseFormData.description,
        syllabus: ['Jour 1 : Théorie fondamentale', 'Jour 2 : Atelier pratique en laboratoire'],
        sessions: []
      };
      onUpdateCourses([newCourse, ...courses]);
    }
    setIsCourseModalOpen(false);
  };

  // ---------- HANDLERS: CALENDRIER & SESSIONS ----------
  const handleOpenNewSessionModal = () => {
    setEditingSession(null);
    setSessionFormData({
      courseId: courses[0]?.id || '',
      startDate: '2026-11-15',
      endDate: '2026-11-18',
      location: 'Campus AM PROD Laboratoires — Casablanca',
      maxAttendees: 12,
      enrolledCount: 1,
      status: 'Planifiée'
    });
    setIsSessionModalOpen(true);
  };

  const handleEditSession = (courseId: string, session: TrainingSession) => {
    setEditingSession({ courseId, session });
    setSessionFormData({
      courseId,
      startDate: session.startDate,
      endDate: session.endDate,
      location: session.location,
      maxAttendees: session.maxAttendees,
      enrolledCount: session.enrolledCount,
      status: session.status
    });
    setIsSessionModalOpen(true);
  };

  const handleDeleteSession = (courseId: string, sessionId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette session planifiée ?")) {
      const updated = courses.map(c => {
        if (c.id === courseId) {
          return {
            ...c,
            sessions: c.sessions.filter(s => s.id !== sessionId)
          };
        }
        return c;
      });
      onUpdateCourses(updated);
    }
  };

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSession) {
      const updated = courses.map(c => {
        if (c.id === editingSession.courseId) {
          return {
            ...c,
            sessions: c.sessions.map(s => {
              if (s.id === editingSession.session.id) {
                return {
                  ...s,
                  startDate: sessionFormData.startDate,
                  endDate: sessionFormData.endDate,
                  location: sessionFormData.location,
                  maxAttendees: Number(sessionFormData.maxAttendees),
                  enrolledCount: Number(sessionFormData.enrolledCount),
                  status: sessionFormData.status,
                };
              }
              return s;
            })
          };
        }
        return c;
      });
      onUpdateCourses(updated);
    } else {
      const newSession: TrainingSession = {
        id: `sess-${Date.now()}`,
        trainingId: sessionFormData.courseId,
        startDate: sessionFormData.startDate,
        endDate: sessionFormData.endDate,
        location: sessionFormData.location,
        maxAttendees: Number(sessionFormData.maxAttendees),
        enrolledCount: Number(sessionFormData.enrolledCount),
        status: sessionFormData.status,
      };
      const updated = courses.map(c => {
        if (c.id === sessionFormData.courseId) {
          return {
            ...c,
            sessions: [...c.sessions, newSession]
          };
        }
        return c;
      });
      onUpdateCourses(updated);
    }
    setIsSessionModalOpen(false);
  };

  // ---------- HANDLER: WHATSAPP WEB MESSAGE ----------
  const handleSendWhatsAppMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsAppInput.trim()) return;

    const currentMsgs = internalMessages[activeWhatsAppLeadId] || [];
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'agent' as const,
      text: whatsAppInput.trim(),
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setInternalMessages(prev => ({
      ...prev,
      [activeWhatsAppLeadId]: [...currentMsgs, newMsg]
    }));
    setWhatsAppInput('');

    // Simulated immediate WhatsApp AI reply if appropriate
    setTimeout(() => {
      const replyMsg = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai' as const,
        text: "Message synchronisé avec l'application WhatsApp du candidat. Notification de confirmation transmise.",
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      setInternalMessages(prev => ({
        ...prev,
        [activeWhatsAppLeadId]: [...(prev[activeWhatsAppLeadId] || []), replyMsg]
      }));
    }, 800);
  };

  // Pagination slice for courses (strict 6 per page)
  const totalPages = Math.ceil(courses.length / coursesPerPage);
  const displayedCourses = courses.slice((coursePage - 1) * coursesPerPage, coursePage * coursesPerPage);

  // All planned sessions flattened
  const allSessions = courses.flatMap(c => c.sessions.map(s => ({ ...s, courseTitle: c.title, courseCode: c.code })));

  return (
    <div className="w-full space-y-6">
      
      {/* 5. DASHBOARD STATISTIQUES ENRICHIES & LES 2 FORMATIONS LES PLUS DEMANDÉES */}
      {activeSubView === 'dashboard' && (
        <div className="w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Tableau de Bord — AM PROD Formations
                </h1>
                <span className="text-[11px] px-2.5 py-0.5 rounded-md font-medium border border-sky-500/20 bg-sky-500/10 text-sky-400">
                  Académie Agréée ISO 22716 BPF
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Supervision des cohortes, des encaissements d'acomptes et de la performance des parcours certifiants.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenNewLeadModal}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-brand-orange hover:bg-brand-orange-hover transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                + Nouveau lead
              </button>
            </div>
          </div>

          {/* KPI Cards Grid */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90 flex flex-col justify-between">
              <span className="text-xs font-medium text-slate-400">Total Candidats & Inscrits</span>
              <p className="text-2xl font-bold text-white mt-3">{formationLeads.length + 196} stagiaires</p>
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> +18.4% ce semestre
              </span>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90 flex flex-col justify-between">
              <span className="text-xs font-medium text-slate-400">Taux de Remplissage Ateliers</span>
              <p className="text-2xl font-bold text-sky-400 mt-3">94.8%</p>
              <span className="text-[11px] text-slate-400 mt-1">Capacité labo 12 pers / session</span>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90 flex flex-col justify-between">
              <span className="text-xs font-medium text-slate-400">Acomptes Sécurisés</span>
              <p className="text-2xl font-bold text-emerald-400 mt-3">
                {formatCurrency(formationLeads.reduce((acc, l) => acc + (l.totalPaid || 0), 0) + 184000)}
              </p>
              <span className="text-[11px] text-slate-400 mt-1">Encaissement CMI & Virements</span>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90 flex flex-col justify-between">
              <span className="text-xs font-medium text-slate-400">Satisfaction Moyenne Avis</span>
              <p className="text-2xl font-bold text-amber-400 mt-3 flex items-center gap-1.5">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" /> 4.93 / 5
              </p>
              <span className="text-[11px] text-slate-400 mt-1">{reviews.length + 58} évaluations certifiées</span>
            </div>
          </div>

          {/* SECTION DÉDIÉE : LES 2 FORMATIONS LES PLUS DEMANDÉES DU MOIS (Exigence spécifique) */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-orange-500/10 text-brand-orange border border-orange-500/20">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white tracking-wide">
                    Les 2 Formations les Plus Demandées du Mois
                  </h2>
                  <p className="text-xs text-slate-400">
                    Calculé en temps réel selon le volume des pré-inscriptions et le taux de remplissage des sessions.
                  </p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                Top Ventes Académie
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Top 1 */}
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start gap-4">
                <img
                  src={courses[0]?.image || 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80'}
                  alt={courses[0]?.title}
                  className="w-24 h-24 rounded-lg object-cover border border-slate-800 shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-orange-500/10 text-brand-orange border border-orange-500/20">
                      N°1 DES INSCRIPTIONS
                    </span>
                    <span className="text-xs font-semibold text-amber-400">★ {courses[0]?.rating || 4.95} / 5</span>
                  </div>
                  <h3 className="text-xs font-semibold text-white truncate">
                    {courses[0]?.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {courses[0]?.description}
                  </p>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                    <span className="text-emerald-400 font-semibold">{formatCurrency(courses[0]?.priceTotal || 12000)}</span>
                    <span className="text-[11px] text-slate-400">48 stagiaires inscrits ce mois</span>
                  </div>
                </div>
              </div>

              {/* Top 2 */}
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start gap-4">
                <img
                  src={courses[1]?.image || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80'}
                  alt={courses[1]?.title}
                  className="w-24 h-24 rounded-lg object-cover border border-slate-800 shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      N°2 DES INSCRIPTIONS
                    </span>
                    <span className="text-xs font-semibold text-amber-400">★ {courses[1]?.rating || 4.88} / 5</span>
                  </div>
                  <h3 className="text-xs font-semibold text-white truncate">
                    {courses[1]?.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {courses[1]?.description}
                  </p>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                    <span className="text-emerald-400 font-semibold">{formatCurrency(courses[1]?.priceTotal || 8500)}</span>
                    <span className="text-[11px] text-slate-400">64 professionnels certifiés</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ANALYTICS & PILOTAGE PÉDAGOGIQUE */}
      {activeSubView === 'analytics' && (
        <div className="w-full space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <BarChart2 className="w-6 h-6 text-brand-orange" />
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Analytics & Performance Pédagogique
                </h1>
                <span className="text-[11px] px-2.5 py-0.5 rounded-md font-medium border border-sky-500/20 bg-sky-500/10 text-sky-400">
                  Data-Driven ERP
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Métriques prédictives : Taux de remplissage des cohortes, conversion des leads et ventilation du chiffre d'affaires des cursus.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-medium">
                {(['30j', 'trimestre', 'annee'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setAnalyticsPeriod(p)}
                    className={`px-3 py-1 rounded-md transition-colors ${analyticsPeriod === p ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
                  >
                    {p === '30j' ? '30 Jours' : p === 'trimestre' ? 'Trimestre T3' : 'Année 2026'}
                  </button>
                ))}
              </div>
              <AIDisclaimer variant="badge" />
            </div>
          </div>

          {/* 4 CARTES KPI CLÉS */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-2 hover-lift">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Taux de Remplissage Global</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">+6.2%</span>
              </div>
              <p className="text-2xl font-bold text-white tracking-tight">89.4%</p>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '89.4%' }} />
              </div>
              <p className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Capacité totale : 170 places</span>
                <span className="text-emerald-400 font-medium">152 inscrits</span>
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-2 hover-lift">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Revenu Moyen / Apprenant</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/20 font-semibold">+14.3%</span>
              </div>
              <p className="text-2xl font-bold text-white tracking-tight">8 420 MAD</p>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-brand-orange h-full rounded-full" style={{ width: '78%' }} />
              </div>
              <p className="text-[11px] text-slate-400">
                Impact direct des Masterclasses Avancées
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-2 hover-lift">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Complétion des Certifications</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold">Excellence</span>
              </div>
              <p className="text-2xl font-bold text-sky-400 tracking-tight">97.1%</p>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-sky-500 h-full rounded-full" style={{ width: '97.1%' }} />
              </div>
              <p className="text-[11px] text-slate-400">
                148 diplômés validés sur 152 admis
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-2 hover-lift">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Satisfaction Apprenants</span>
                <span className="text-amber-400 font-bold flex items-center gap-0.5 text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.93 / 5
                </span>
              </div>
              <p className="text-2xl font-bold text-amber-400 tracking-tight">98.6% Avis 5★</p>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: '98.6%' }} />
              </div>
              <p className="text-[11px] text-slate-400">
                Basé sur 64 avis post-formation certifiés
              </p>
            </div>
          </div>

          {/* GRAPHIQUES DE PERFORMANCE (2x2 GRID AVEC RECHARTS) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Graphique 1 : Évolution Mensuelle des Inscriptions & Remplissage */}
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Inscriptions & Taux de Remplissage par Mois
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Évolution de la capacité et des inscriptions effectives
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  Moy. 89.4%
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { month: 'Mai', inscrits: 28, capacite: 32, tauxRemplissage: 87.5 },
                      { month: 'Juin', inscrits: 30, capacite: 32, tauxRemplissage: 93.7 },
                      { month: 'Juil', inscrits: 22, capacite: 24, tauxRemplissage: 91.6 },
                      { month: 'Août', inscrits: 16, capacite: 20, tauxRemplissage: 80.0 },
                      { month: 'Sept', inscrits: 36, capacite: 40, tauxRemplissage: 90.0 },
                      { month: 'Octobre', inscrits: 42, capacite: 45, tauxRemplissage: 93.3 },
                      { month: 'Novembre', inscrits: 38, capacite: 40, tauxRemplissage: 95.0 },
                      { month: 'Décembre', inscrits: 34, capacite: 36, tauxRemplissage: 94.4 },
                    ]}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorInscrits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCapacite" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '11px', color: '#fff' }}
                      itemStyle={{ color: '#e2e8f0' }}
                    />
                    <Area type="monotone" dataKey="capacite" name="Capacité max" stroke="#0284c7" strokeDasharray="4 4" fillOpacity={1} fill="url(#colorCapacite)" />
                    <Area type="monotone" dataKey="inscrits" name="Apprenants inscrits" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorInscrits)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graphique 2 : Répartition du CA par Formation */}
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-brand-orange" />
                    Chiffre d'Affaires par Cursus (MAD)
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Ventilation des ventes de sessions par thématique
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 font-mono">
                  1 263 000 MAD
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Émulsions', ca: 485000, inscrits: 57 },
                      { name: 'Savonnerie', ca: 312000, inscrits: 52 },
                      { name: 'DIP & ISO', ca: 248000, inscrits: 26 },
                      { name: 'Distillation', ca: 142000, inscrits: 28 },
                      { name: 'Marketing', ca: 76000, inscrits: 19 },
                    ]}
                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis 
                      stroke="#64748b" 
                      tick={{ fontSize: 10 }}
                      tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(val: any) => [`${Number(val).toLocaleString()} MAD`, 'Chiffre d\'Affaires']}
                      contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '11px', color: '#fff' }}
                    />
                    <Bar dataKey="ca" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graphique 3 : Entonnoir de Conversion des Candidats */}
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Filter className="w-4 h-4 text-sky-400" />
                    Entonnoir de Conversion des Candidats
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    De la demande d'information initiale à la certification officielle
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">
                  Tx Global : 29.5%
                </span>
              </div>

              <div className="space-y-3 pt-1">
                {[
                  { step: '1. Candidats & Demandes d\'Information', count: 480, pct: '100%', barWidth: 'w-full', color: 'bg-blue-500' },
                  { step: '2. Qualification IA & Entretien Sofia', count: 288, pct: '60.0%', barWidth: 'w-[60%]', color: 'bg-sky-500' },
                  { step: '3. Devis & Conventions Transmis', count: 182, pct: '37.9%', barWidth: 'w-[38%]', color: 'bg-amber-500' },
                  { step: '4. Acomptes Versés (Inscrits Confirmés)', count: 144, pct: '30.0%', barWidth: 'w-[30%]', color: 'bg-emerald-500' },
                  { step: '5. Présents le Jour J & Certifiés', count: 139, pct: '28.9%', barWidth: 'w-[29%]', color: 'bg-purple-500' },
                ].map((s, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">{s.step}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-white font-bold">{s.count}</span>
                        <span className="text-slate-400 text-[10px]">({s.pct})</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${s.color} ${s.barWidth}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Graphique 4 : Assiduité & Statut Pédagogique */}
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-400" />
                    Répartition de l'Assiduité Pédagogique
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Contrôle de présence sur les ateliers pratiques en laboratoire
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
                  BPF Qualité
                </span>
              </div>

              <div className="h-44 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Assiduité 100%', value: 84, color: '#10b981' },
                        { name: 'Assiduité >90%', value: 12, color: '#0284c7' },
                        { name: 'Reports justifiés', value: 3, color: '#f59e0b' },
                        { name: 'Absences', value: 1, color: '#f43f5e' },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {[
                        { color: '#10b981' },
                        { color: '#0284c7' },
                        { color: '#f59e0b' },
                        { color: '#f43f5e' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: any) => [`${val}%`, 'Proportion']}
                      contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '11px', color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-300">Présence 100% (84%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  <span className="text-slate-300">Présence &gt;90% (12%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-300">Reports justifiés (3%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-slate-300">Absences (1%)</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 1. LEADS & CANDIDATS (AVEC BOUTON + NOUVEAU LEAD, MODIFIER, SUPPRIMER) */}
      {activeSubView === 'leads' && (
        <div className="w-full p-6 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-orange" />
                Liste des Candidats & Prospects Formations
              </h2>
              <p className="text-xs text-slate-400">
                Gestion des inscriptions, statuts avancés et intégration directe WhatsApp.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher candidat, ville, statut..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-950/60 border border-slate-800 text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              {/* Bouton "+ Nouveau lead" requis */}
              <button
                onClick={handleOpenNewLeadModal}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-brand-orange hover:bg-brand-orange-hover transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                + Nouveau lead
              </button>
            </div>
          </div>

          <AIDisclaimer variant="subtle" />

          {/* Table */}
          <div className="w-full overflow-x-auto rounded-lg border border-slate-800/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Candidat</th>
                  <th className="p-3.5">Statut</th>
                  <th className="p-3.5">Montant Formation</th>
                  <th className="p-3.5">Avance Versée</th>
                  <th className="p-3.5">Reste à Payer</th>
                  <th className="p-3.5">Score IA</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {formationLeads
                  .filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase()) || l.city.toLowerCase().includes(searchTerm.toLowerCase()) || l.status.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((cand) => (
                    <tr 
                      key={cand.id} 
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-3.5 cursor-pointer" onClick={() => onOpenLead(cand)}>
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          {cand.name}
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                            {cand.id}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">{cand.phone} • {cand.city}</div>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                          cand.status === 'Payé une avance' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          cand.status === 'Confirmé' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          cand.status === 'Absent le jour J' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          cand.status === 'Perdu' ? 'bg-slate-800 text-slate-400 border-slate-700' :
                          'bg-sky-500/10 text-sky-400 border-sky-500/20'
                        }`}>
                          {cand.status}
                        </span>
                      </td>
                      <td className="p-3.5 font-semibold text-white">
                        {formatCurrency(cand.totalOrdersValue)}
                      </td>
                      <td className="p-3.5 font-semibold text-emerald-400">
                        {formatCurrency(cand.totalPaid)}
                      </td>
                      <td className="p-3.5 font-semibold text-amber-400">
                        {formatCurrency(cand.remainingDue || 0)}
                      </td>
                      <td className="p-3.5 font-semibold text-brand-orange">
                        ★ {cand.aiScore}%
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenLead(cand)}
                            title="Fiche 360°"
                            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDuplicateLead(cand)}
                            title="Dupliquer"
                            className="p-1.5 rounded-md text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleEditLead(cand)}
                            title="Modifier"
                            className="p-1.5 rounded-md text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteLead(cand.id)}
                            title="Supprimer"
                            className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. FORMATIONS (AFFICHAGE DES IMAGES CORRIGÉ, + NOUVELLE FORMATION, PAGINATION 6 CARTES, MODIF/SUPPR) */}
      {activeSubView === 'formations' && (
        <div className="w-full space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-brand-orange" />
                Catalogue des Formations ({courses.length} Références)
              </h2>
              <p className="text-xs text-slate-400">
                Affichage normalisé avec pagination stricte de 6 cartes par page et aperçus d'images HD certifiés.
              </p>
            </div>

            <button
              onClick={handleOpenNewCourseModal}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-brand-orange hover:bg-brand-orange-hover transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              + Nouvelle formation
            </button>
          </div>

          {/* Grille de 6 cartes maximum */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCourses.map((c) => (
              <div 
                key={c.id} 
                className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
              >
                <div>
                  {/* Image HD avec Fallback robuste */}
                  <div className="relative h-48 rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                    <img 
                      src={c.image} 
                      alt={c.title} 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80';
                      }}
                      className="object-cover w-full h-48 rounded-lg" 
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-slate-950/80 text-sky-400 border border-slate-800">
                        {c.level}
                      </span>
                    </div>
                    <div className="absolute top-2.5 right-2.5">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950/80 text-white font-mono font-bold border border-slate-800">
                        {c.code}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold text-white line-clamp-1">
                        {c.title}
                      </h3>
                      <span className="text-xs font-semibold text-brand-orange shrink-0">
                        ★ {c.rating} / 5
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>
                    
                    <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 text-xs space-y-1.5 mt-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Durée :</span>
                        <span className="font-semibold text-slate-200">{c.durationDays} jours intensifs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Tarif Session :</span>
                        <span className="font-semibold text-emerald-400">{formatCurrency(c.priceTotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Acompte requis :</span>
                        <span className="font-semibold text-amber-400">{formatCurrency(c.minDeposit)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 truncate max-w-[150px]">{c.instructor}</span>
                  
                  {/* Actions Modifier & Supprimer */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDuplicateCourse(c)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition-colors"
                      title="Dupliquer la formation"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleEditCourse(c)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                      title="Modifier formation"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(c.id)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Supprimer formation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination stricte (6 cartes par page) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
              <span className="text-xs text-slate-400">
                Page {coursePage} sur {totalPages} ({courses.length} formations)
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={coursePage === 1}
                  onClick={() => setCoursePage(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 rounded-lg text-xs bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800"
                >
                  <ChevronLeft className="w-3.5 h-3.5 inline mr-1" /> Précédent
                </button>
                <button
                  disabled={coursePage === totalPages}
                  onClick={() => setCoursePage(prev => Math.min(totalPages, prev + 1))}
                  className="px-3 py-1.5 rounded-lg text-xs bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800"
                >
                  Suivant <ChevronRight className="w-3.5 h-3.5 inline ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. CALENDRIER & PLANIFICATION INTERACTIF (VRAI CALENDRIER JOUR / MOIS / ANNÉE) */}
      {activeSubView === 'calendrier' && (
        <div className="w-full p-6 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-brand-orange" />
                Calendrier Interactif des Sessions
              </h2>
              <p className="text-xs text-slate-400">
                Planifiez, modifiez et supprimez vos sessions d'ateliers en laboratoire certifié.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Toggles Jour / Mois / Année */}
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setCalendarViewMode('day')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors ${calendarViewMode === 'day' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Jour
                </button>
                <button
                  onClick={() => setCalendarViewMode('month')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors ${calendarViewMode === 'month' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Mois
                </button>
                <button
                  onClick={() => setCalendarViewMode('year')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors ${calendarViewMode === 'year' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Année
                </button>
              </div>

              <button
                onClick={handleOpenNewSessionModal}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand-orange hover:bg-brand-orange-hover transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                + Planifier une session
              </button>
            </div>
          </div>

          {/* VUE MOIS INTERACTIVE */}
          {calendarViewMode === 'month' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-sky-400" />
                  Novembre 2026 — Planning des Sessions
                </h3>
                <span className="text-xs text-slate-400">
                  {allSessions.length} sessions programmées
                </span>
              </div>

              {/* Calendrier Grid (30 jours de Nov) */}
              <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => (
                  <div key={d} className="p-2 font-bold text-slate-400 uppercase text-[10px] bg-slate-950/60 rounded-md">
                    {d}
                  </div>
                ))}
                {Array.from({ length: 30 }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateStr = `2026-11-${dayNum < 10 ? '0' + dayNum : dayNum}`;
                  const matchingSessions = allSessions.filter(s => s.startDate <= dateStr && s.endDate >= dateStr);

                  return (
                    <div 
                      key={dayNum} 
                      className={`min-h-[85px] p-2 rounded-lg border text-left transition-colors flex flex-col justify-between ${
                        matchingSessions.length > 0 
                          ? 'bg-slate-900 border-sky-500/30' 
                          : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <span className={`text-[11px] font-bold ${matchingSessions.length > 0 ? 'text-sky-400' : 'text-slate-500'}`}>
                        {dayNum}
                      </span>
                      {matchingSessions.map(s => (
                        <div 
                          key={s.id} 
                          className="mt-1 p-1 rounded bg-sky-500/10 border border-sky-500/20 text-[10px] text-sky-300 font-medium truncate"
                          title={`${s.courseTitle} (${s.enrolledCount}/${s.maxAttendees})`}
                        >
                          {s.courseCode}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VUE JOUR */}
          {calendarViewMode === 'day' && (
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Planning Quotidien — 15 Novembre 2026
              </h3>
              <div className="divide-y divide-slate-800/80 text-xs">
                <div className="py-2.5 flex justify-between items-center">
                  <span className="font-mono text-slate-400">09h00 - 12h30</span>
                  <span className="text-white font-medium">Session Pratique Formulation Émulsions (Dr. Leila Zerouali)</span>
                  <span className="text-emerald-400">10 participants</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="font-mono text-slate-400">14h00 - 17h00</span>
                  <span className="text-white font-medium">Tests de stabilité thermique & Centrifugation</span>
                  <span className="text-sky-400">Laboratoire 2</span>
                </div>
              </div>
            </div>
          )}

          {/* VUE ANNEE */}
          {calendarViewMode === 'year' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {['Janv 2026', 'Févr 2026', 'Mars 2026', 'Avr 2026', 'Mai 2026', 'Juin 2026', 'Juil 2026', 'Août 2026', 'Sept 2026', 'Oct 2026', 'Nov 2026', 'Déc 2026'].map(m => (
                <div key={m} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-center">
                  <span className="font-bold text-white block mb-1">{m}</span>
                  <span className="text-[11px] text-sky-400">2 à 4 sessions / mois</span>
                </div>
              ))}
            </div>
          )}

          {/* Liste détaillée des sessions avec Options Modifier & Supprimer */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Sessions Actives ({allSessions.length})
            </h3>

            <div className="space-y-2">
              {allSessions.map(sess => (
                <div key={sess.id} className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-semibold text-sky-400 uppercase tracking-wider block">
                      Du {formatDate(sess.startDate)} au {formatDate(sess.endDate)}
                    </span>
                    <h4 className="text-xs font-semibold text-white mt-0.5">{sess.courseTitle}</h4>
                    <p className="text-[11px] text-slate-400">{sess.location}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-semibold text-white">{sess.enrolledCount} / {sess.maxAttendees} inscrits</span>
                      <span className="text-[10px] text-emerald-400 block">{Math.round((sess.enrolledCount / sess.maxAttendees) * 100)}% de capacité</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                      sess.status === 'Complète' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {sess.status}
                    </span>

                    {/* Actions Modifier & Supprimer la session */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditSession(sess.trainingId, sess)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                        title="Modifier session"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSession(sess.trainingId, sess.id)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Supprimer session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. RELANCE CANDIDATS & SUIVI DES ACOMPTES */}
      {activeSubView === 'relance' && (
        <div className="w-full space-y-6">
          
          {/* TOAST CONFIRMATION NOTIFICATION */}
          {relanceToast && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">{relanceToast}</span>
              </div>
              <button
                onClick={() => setRelanceToast(null)}
                className="text-emerald-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-brand-orange" />
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Relance Candidats & Suivi des Acomptes
                </h1>
                <span className="text-[11px] px-2.5 py-0.5 rounded-md font-medium border border-amber-500/20 bg-amber-500/10 text-amber-400">
                  Pipeline Admissions
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Suivi des candidats pré-inscrits en attente d'acompte, rappels J-3 avant démarrage de session et actions de conversion rapide.
              </p>
            </div>

            <button
              onClick={() => {
                setRelanceStatuses(prev => ({
                  ...prev,
                  'form-lead-3': 'Relance WhatsApp envoyée',
                  'form-lead-4': 'Relance WhatsApp envoyée',
                }));
                setRelanceToast("Campagne de relance WhatsApp groupée envoyée aux 2 candidats prioritaires !");
                setTimeout(() => setRelanceToast(null), 4000);
              }}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center gap-2 shadow-sm self-start sm:self-auto"
            >
              <Send className="w-4 h-4" />
              Relancer les Urgents (WhatsApp)
            </button>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/90">
              <span className="text-xs text-slate-400 font-medium">Candidats à Relancer</span>
              <p className="text-2xl font-bold text-amber-400 mt-2">
                {Object.values(relanceStatuses).filter(s => s === 'À relancer').length}
              </p>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Pré-inscriptions sans acompte</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/90">
              <span className="text-xs text-slate-400 font-medium">Acomptes en Attente</span>
              <p className="text-2xl font-bold text-white mt-2">
                18 500 MAD
              </p>
              <span className="text-[10px] text-amber-400 mt-0.5 block">À sécuriser avant clôture</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/90">
              <span className="text-xs text-slate-400 font-medium">Relances Traitées</span>
              <p className="text-2xl font-bold text-emerald-400 mt-2">
                {Object.values(relanceStatuses).filter(s => s === 'Relance WhatsApp envoyée' || s === 'Relance Email planifiée').length}
              </p>
              <span className="text-[10px] text-emerald-400 mt-0.5 block">Canaux WhatsApp & Email</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/90">
              <span className="text-xs text-slate-400 font-medium">Candidats Convertis</span>
              <p className="text-2xl font-bold text-purple-400 mt-2">
                {Object.values(relanceStatuses).filter(s => s === 'Converti').length}
              </p>
              <span className="text-[10px] text-purple-400 mt-0.5 block">Inscriptions confirmées</span>
            </div>
          </div>

          {/* TABLEAU DES RELANCES CANDIDATS */}
          <div className="w-full p-5 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-orange" />
                Tableau de Suivi des Relances & Acomptes
              </h3>
              <span className="text-xs text-slate-400">
                Action en 1 clic avec mise à jour immédiate
              </span>
            </div>

            <div className="w-full overflow-x-auto rounded-lg border border-slate-800/80">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Candidat</th>
                    <th className="p-3.5">Formation Visée</th>
                    <th className="p-3.5">Date Contact</th>
                    <th className="p-3.5">Acompte Requis / Reste</th>
                    <th className="p-3.5">Motif de Relance</th>
                    <th className="p-3.5">Statut Relance</th>
                    <th className="p-3.5 text-right">Actions Rapides</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {[
                    {
                      id: 'form-lead-3',
                      name: 'Samira Touimi',
                      phone: '+212 6 62 98 76 54',
                      city: 'Fès',
                      course: 'Savonnerie Saponifiée à Froid & Solides',
                      contactDate: '2026-10-03',
                      depositRequired: 3000,
                      remainingTotal: 8500,
                      reason: 'Pré-inscription sans acompte (>72h)',
                      defaultStatus: 'À relancer' as const
                    },
                    {
                      id: 'form-lead-4',
                      name: 'Younes Mansour',
                      phone: '+212 6 77 11 22 33',
                      city: 'Tanger',
                      course: 'Distillation & Eaux Florales Bio',
                      contactDate: '2026-09-28',
                      depositRequired: 2000,
                      remainingTotal: 4000,
                      reason: 'Désistement précédent — Proposition cohorte Nov',
                      defaultStatus: 'À relancer' as const
                    },
                    {
                      id: 'form-lead-5',
                      name: 'Nadia Cherkaoui',
                      phone: '+212 6 61 77 88 99',
                      city: 'Casablanca',
                      course: 'Masterclass Formulation Émulsions & Sérums',
                      contactDate: '2026-10-04',
                      depositRequired: 4000,
                      remainingTotal: 12000,
                      reason: 'Rappel J-3 démarrage de session (2 places restantes)',
                      defaultStatus: 'Relance WhatsApp envoyée' as const
                    },
                    {
                      id: 'form-lead-6',
                      name: 'Yassine Belkacem',
                      phone: '+212 6 55 44 33 22',
                      city: 'Rabat',
                      course: 'Réglementation DIP & Norme ISO 22716 BPF',
                      contactDate: '2026-10-05',
                      depositRequired: 4000,
                      remainingTotal: 12000,
                      reason: 'Devis entreprise en attente de bon pour accord',
                      defaultStatus: 'Relance Email planifiée' as const
                    },
                    {
                      id: 'form-lead-1',
                      name: 'Houda Bennani',
                      phone: '+212 6 71 45 89 12',
                      city: 'Casablanca',
                      course: 'Masterclass Formulation Émulsions & Sérums',
                      contactDate: '2026-10-05',
                      depositRequired: 4000,
                      remainingTotal: 8000,
                      reason: 'Acompte 4 000 MAD réglé, solde à la rentrée',
                      defaultStatus: 'Converti' as const
                    },
                    {
                      id: 'form-lead-2',
                      name: 'Karim Guessous',
                      phone: '+212 6 60 12 34 56',
                      city: 'Casablanca',
                      course: 'Réglementation DIP (2 collaborateurs)',
                      contactDate: '2026-10-06',
                      depositRequired: 24000,
                      remainingTotal: 0,
                      reason: 'Financement entreprise soldé à 100%',
                      defaultStatus: 'Converti' as const
                    }
                  ].map(candidate => {
                    const currentStatus = relanceStatuses[candidate.id] || candidate.defaultStatus;

                    return (
                      <tr key={candidate.id} className="hover:bg-slate-800/40 transition-colors">
                        {/* Candidat */}
                        <td className="p-3.5">
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            {candidate.name}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {candidate.phone} • {candidate.city}
                          </div>
                        </td>

                        {/* Formation */}
                        <td className="p-3.5">
                          <span className="text-slate-200 font-medium block max-w-xs truncate">
                            {candidate.course}
                          </span>
                        </td>

                        {/* Date contact */}
                        <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                          {formatDate(candidate.contactDate)}
                        </td>

                        {/* Acompte / Reste */}
                        <td className="p-3.5 font-mono">
                          <span className="text-brand-orange font-bold block">
                            {formatCurrency(candidate.depositRequired)}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Total : {formatCurrency(candidate.remainingTotal)}
                          </span>
                        </td>

                        {/* Motif */}
                        <td className="p-3.5 text-slate-300 text-[11px]">
                          <span className="px-2 py-1 rounded bg-slate-950/80 border border-slate-800 block text-slate-300 max-w-xs">
                            {candidate.reason}
                          </span>
                        </td>

                        {/* Statut Relance */}
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-semibold border inline-flex items-center gap-1.5 ${
                            currentStatus === 'À relancer'
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                              : currentStatus === 'Relance WhatsApp envoyée'
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                              : currentStatus === 'Relance Email planifiée'
                              ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                              : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              currentStatus === 'À relancer'
                                ? 'bg-amber-400'
                                : currentStatus === 'Relance WhatsApp envoyée'
                                ? 'bg-emerald-400'
                                : currentStatus === 'Relance Email planifiée'
                                ? 'bg-sky-400'
                                : 'bg-purple-400'
                            }`} />
                            {currentStatus}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleTriggerRelance(candidate.id, candidate.name, 'WhatsApp')}
                              className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition-colors"
                              title="Envoyer un modèle de relance WhatsApp"
                            >
                              WhatsApp
                            </button>
                            <button
                              onClick={() => handleTriggerRelance(candidate.id, candidate.name, 'Email')}
                              className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-sky-600/20 text-sky-300 border border-sky-500/30 hover:bg-sky-600 hover:text-white transition-colors"
                              title="Planifier un email de relance officiel"
                            >
                              Email
                            </button>
                            <button
                              onClick={() => handleTriggerRelance(candidate.id, candidate.name, 'Converti')}
                              className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600 hover:text-white transition-colors"
                              title="Valider l'inscription comme convertie"
                            >
                              Valider
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. PAIEMENTS FRACTIONNÉS (CHAQUE LIGNE CLIQUABLE -> TIROIR / MODALE DÉTAILLÉE) */}
      {activeSubView === 'paiements' && (
        <div className="w-full p-6 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-brand-orange" />
                Paiements Fractionnés & Acomptes Formations
              </h2>
              <p className="text-xs text-slate-400">
                Cliquez sur n'importe quelle ligne pour ouvrir le tiroir financier détaillé avec calcul automatique du reste à payer.
              </p>
            </div>
          </div>

          <div className="w-full overflow-x-auto rounded-lg border border-slate-800/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5">N° Reçu</th>
                  <th className="p-3.5">Stagiaire</th>
                  <th className="p-3.5">Montant Total</th>
                  <th className="p-3.5">Avance Versée</th>
                  <th className="p-3.5">Reste à Payer (Auto)</th>
                  <th className="p-3.5">Mode</th>
                  <th className="p-3.5">Statut</th>
                  <th className="p-3.5 text-right">Détail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {formationInvoices.map((inv) => (
                  <tr 
                    key={inv.id} 
                    onClick={() => setSelectedInvoice(inv)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="p-3.5 font-semibold font-mono text-white">{inv.invoiceNumber}</td>
                    <td className="p-3.5 font-medium">{inv.clientName}</td>
                    <td className="p-3.5 font-semibold text-white">{formatCurrency(inv.amountTotal)}</td>
                    <td className="p-3.5 font-semibold text-emerald-400">{formatCurrency(inv.amountPaid)}</td>
                    <td className="p-3.5 font-semibold text-amber-400">{formatCurrency(inv.remainingDue)}</td>
                    <td className="p-3.5 text-slate-400">{inv.paymentMethod}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                        inv.status === 'Payée' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInvoice(inv);
                        }}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-teal-600 hover:text-white hover:border-teal-500 transition-colors inline-flex items-center gap-1 shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Aperçu PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. NOUVEAU SOUS-MODULE : AVIS APRÈS FORMATIONS (Placé en dessous de Paiements) */}
      {activeSubView === 'avis' && (
        <div className="w-full p-6 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                Avis & Évaluations Post-Formations
              </h2>
              <p className="text-xs text-slate-400">
                Notes et retours d'expérience des stagiaires pour détecter les formations populaires ou celles nécessitant des ajustements.
              </p>
            </div>

            <span className="text-xs px-3 py-1 rounded-full font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Note Globale : 4.93 / 5
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map(rev => (
              <div key={rev.id} className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-white">{rev.candidateName}</h4>
                    <p className="text-[11px] text-sky-400 mt-0.5">{rev.courseTitle}</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                  « {rev.comment} »
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                  <span>{formatDate(rev.date)}</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ThumbsUp className="w-3 h-3" /> Recommande cette formation
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. CONVERSATIONS : DESIGN IDENTIQUE À WHATSAPP WEB */}
      {activeSubView === 'conversations' && (
        <div className="w-full h-[720px] rounded-xl border border-slate-800 bg-[#111b21] grid grid-cols-1 lg:grid-cols-12 overflow-hidden shadow-2xl">
          
          {/* Colonne Gauche : Liste des leads (style WhatsApp Web) */}
          <div className="lg:col-span-4 border-r border-[#202c33] flex flex-col h-full bg-[#111b21]">
            {/* Header WhatsApp Bar */}
            <div className="p-3 bg-[#202c33] flex items-center justify-between border-b border-[#2a3942]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                  WA
                </div>
                <span className="text-xs font-bold text-white">Discussions WhatsApp</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                ONLINE
              </span>
            </div>

            {/* Barre de recherche */}
            <div className="p-2 border-b border-[#202c33] bg-[#111b21]">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher une discussion..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-[#202c33] text-white placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Feed des contacts */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#202c33]">
              {formationLeads.map(lead => {
                const isSelected = activeWhatsAppLeadId === lead.id;
                const lastMsg = internalMessages[lead.id]?.slice(-1)[0]?.text || "Pré-inscription reçue.";

                return (
                  <div
                    key={lead.id}
                    onClick={() => setActiveWhatsAppLeadId(lead.id)}
                    className={`p-3 cursor-pointer flex items-start gap-3 transition-colors ${
                      isSelected ? 'bg-[#2a3942]' : 'hover:bg-[#202c33]/50'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {lead.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-xs font-semibold text-white truncate">{lead.name}</h4>
                        <span className="text-[10px] text-slate-400">17:20</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{lastMsg}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Colonne Droite : Fenêtre de Chat (style WhatsApp Web) */}
          <div className="lg:col-span-8 flex flex-col h-full bg-[#0b141a]">
            {/* Header du Chat */}
            <div className="p-3 bg-[#202c33] border-b border-[#2a3942] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-xs">
                  {formationLeads.find(l => l.id === activeWhatsAppLeadId)?.name.charAt(0) || 'C'}
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white">
                    {formationLeads.find(l => l.id === activeWhatsAppLeadId)?.name || 'Candidat'}
                  </h3>
                  <p className="text-[10px] text-emerald-400">En ligne sur WhatsApp</p>
                </div>
              </div>

              <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                Assistant IA & Conseiller Connectés
              </span>
            </div>

            {/* Zone de Messages avec Fond WhatsApp texturé */}
            <div 
              className="flex-1 p-5 overflow-y-auto space-y-3"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
              }}
            >
              {(internalMessages[activeWhatsAppLeadId] || []).map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'agent' ? 'items-end' : m.sender === 'ai' ? 'items-start' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-3.5 py-2 text-xs leading-relaxed shadow-sm ${
                      m.sender === 'agent'
                        ? 'bg-[#005c4b] text-white rounded-tr-none'
                        : m.sender === 'ai'
                        ? 'bg-[#202c33] text-slate-100 border border-[#2a3942] rounded-tl-none'
                        : 'bg-[#202c33] text-white rounded-tl-none'
                    }`}
                  >
                    <div className="text-[10px] text-slate-400 mb-0.5 font-medium">
                      {m.sender === 'agent' ? 'Vous (Conseiller)' : m.sender === 'ai' ? 'Sofia (IA WhatsApp)' : 'Candidat'}
                    </div>
                    {m.text}
                    <span className="block text-[9px] text-right mt-1 opacity-60">
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Saisie WhatsApp */}
            <form onSubmit={handleSendWhatsAppMessage} className="p-3 bg-[#202c33] border-t border-[#2a3942] flex items-center gap-2">
              <input
                type="text"
                value={whatsAppInput}
                onChange={(e) => setWhatsAppInput(e.target.value)}
                placeholder="Écrire un message WhatsApp officiel..."
                className="flex-1 bg-[#2a3942] text-xs px-4 py-2.5 rounded-lg text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="p-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

        </div>
      )}

      {/* 7. PARAMETRES IA : 3 FENETRES DISTINCTES (FAQ, DOCUMENTS, EMAILS) */}
      {activeSubView === 'settings_ia' && (
        <div className="w-full p-6 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-orange" />
                Base de Connaissances & Modèles Pédagogiques
              </h2>
              <p className="text-xs text-slate-400">
                Structure vectorisée en 3 fenêtres distinctes : FAQ, Documents métiers et Modèles d'Emails de relance.
              </p>
            </div>

            {/* Navigation 3 Fenêtres Distinctes */}
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setKnowledgeTab('faq')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${knowledgeTab === 'faq' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                1. FAQ Chatbot
              </button>
              <button
                onClick={() => setKnowledgeTab('documents')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${knowledgeTab === 'documents' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                2. Documents & Modèles
              </button>
              <button
                onClick={() => setKnowledgeTab('emails')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${knowledgeTab === 'emails' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                3. Modèles d'Emails
              </button>
            </div>
          </div>

          {/* FENÊTRE 1 : FAQ */}
          {knowledgeTab === 'faq' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Questions / Réponses Indexées
              </h3>
              <div className="space-y-2">
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-brand-orange uppercase">Admissions</span>
                  <h4 className="text-xs font-semibold text-white">Quelles sont les modalités de paiement fractionné ?</h4>
                  <p className="text-xs text-slate-400">Un acompte de 30% à 40% est réglé en ligne à la réservation, et le solde peut être versé le premier jour de formation ou par convention d'entreprise.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-sky-400 uppercase">Matériel</span>
                  <h4 className="text-xs font-semibold text-white">Le matériel de laboratoire et matières premières sont-ils inclus ?</h4>
                  <p className="text-xs text-slate-400">Oui, 100% du matériel (béchers, balances de précision, agitateurs) et actifs cosmétiques purs sont mis à disposition des apprenants.</p>
                </div>
              </div>
            </div>
          )}

          {/* FENÊTRE 2 : DOCUMENTS */}
          {knowledgeTab === 'documents' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Modèles de Factures & Documents Post-Formation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start gap-3">
                  <FileText className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-white">Trame_Attestation_Reussite_BPF.pdf</h4>
                    <p className="text-[11px] text-slate-400">Document officiel remis aux stagiaires avec mention des heures pratiques.</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start gap-3">
                  <FileText className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-white">Convention_Formation_Professionnelle_Entreprise.docx</h4>
                    <p className="text-[11px] text-slate-400">Contrat tripartite pour prise en charge OPCA / Entreprises partenaires.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FENÊTRE 3 : EMAILS */}
          {knowledgeTab === 'emails' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Modèles d'Emails de Relance & Convocations
              </h3>
              <div className="space-y-3">
                {emailTemplates.map(tmpl => (
                  <div key={tmpl.id} className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-white">{tmpl.title}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-medium">
                        {tmpl.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">Objet : {tmpl.subject}</p>
                    <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 whitespace-pre-line font-mono text-[11px]">
                      {tmpl.body}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* MODALE CRÉATION / MODIFICATION LEAD */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="my-auto w-full max-w-md bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">
                {editingLead ? 'Modifier le Candidat' : '+ Nouveau Lead / Candidat'}
              </h3>
              <button onClick={() => setIsLeadModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLead} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Nom complet</label>
                <input
                  type="text"
                  required
                  value={leadFormData.name}
                  onChange={(e) => setLeadFormData({ ...leadFormData, name: e.target.value })}
                  placeholder="Ex : Houda Bennani"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Téléphone WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={leadFormData.phone}
                    onChange={(e) => setLeadFormData({ ...leadFormData, phone: e.target.value })}
                    placeholder="+212 6..."
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Ville</label>
                  <input
                    type="text"
                    required
                    value={leadFormData.city}
                    onChange={(e) => setLeadFormData({ ...leadFormData, city: e.target.value })}
                    placeholder="Casablanca, Rabat..."
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Formation Souhaitée</label>
                <select
                  value={leadFormData.trainingCourse}
                  onChange={(e) => setLeadFormData({ ...leadFormData, trainingCourse: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.title}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Statut Candidat (Requis)</label>
                <select
                  value={leadFormData.status}
                  onChange={(e) => setLeadFormData({ ...leadFormData, status: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                >
                  <option value="Inscrit">Inscrit</option>
                  <option value="Payé">Payé</option>
                  <option value="Payé une avance">Payé une avance</option>
                  <option value="Confirmé">Confirmé</option>
                  <option value="Perdu">Perdu</option>
                  <option value="Absent le jour J">Absent le jour J</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Tarif Total (MAD)</label>
                  <input
                    type="number"
                    value={leadFormData.totalAmount}
                    onChange={(e) => setLeadFormData({ ...leadFormData, totalAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Acompte Versé (MAD)</label>
                  <input
                    type="number"
                    value={leadFormData.paidAmount}
                    onChange={(e) => setLeadFormData({ ...leadFormData, paidAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsLeadModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand-orange hover:bg-brand-orange-hover"
                >
                  {editingLead ? 'Mettre à jour' : 'Enregistrer le lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE CRÉATION / MODIFICATION FORMATION */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="my-auto w-full max-w-lg bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">
                {editingCourse ? 'Modifier la Formation' : '+ Nouvelle Formation'}
              </h3>
              <button onClick={() => setIsCourseModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Titre de la Formation</label>
                <input
                  type="text"
                  required
                  value={courseFormData.title}
                  onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                  placeholder="Ex : Masterclass Formulation Émulsions..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Code / Réf</label>
                  <input
                    type="text"
                    required
                    value={courseFormData.code}
                    onChange={(e) => setCourseFormData({ ...courseFormData, code: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Niveau</label>
                  <select
                    value={courseFormData.level}
                    onChange={(e) => setCourseFormData({ ...courseFormData, level: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="Débutant">Débutant</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Avancé">Avancé</option>
                    <option value="Masterclass">Masterclass</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Durée (Jours)</label>
                  <input
                    type="number"
                    value={courseFormData.durationDays}
                    onChange={(e) => setCourseFormData({ ...courseFormData, durationDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Tarif Total (MAD)</label>
                  <input
                    type="number"
                    value={courseFormData.priceTotal}
                    onChange={(e) => setCourseFormData({ ...courseFormData, priceTotal: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Acompte Requis</label>
                  <input
                    type="number"
                    value={courseFormData.minDeposit}
                    onChange={(e) => setCourseFormData({ ...courseFormData, minDeposit: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">URL de l'image (Aperçu garanti)</label>
                <input
                  type="url"
                  required
                  value={courseFormData.image}
                  onChange={(e) => setCourseFormData({ ...courseFormData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Description pédagogique</label>
                <textarea
                  rows={2}
                  required
                  value={courseFormData.description}
                  onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand-orange hover:bg-brand-orange-hover"
                >
                  {editingCourse ? 'Mettre à jour' : 'Créer la formation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE CRÉATION / MODIFICATION SESSION CALENDRIER */}
      {isSessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="my-auto w-full max-w-md bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">
                {editingSession ? 'Modifier la Session' : '+ Planifier une Session'}
              </h3>
              <button onClick={() => setIsSessionModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSession} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Formation Concernée</label>
                <select
                  value={sessionFormData.courseId}
                  onChange={(e) => setSessionFormData({ ...sessionFormData, courseId: e.target.value })}
                  disabled={!!editingSession}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none disabled:opacity-60"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Date Début</label>
                  <input
                    type="date"
                    required
                    value={sessionFormData.startDate}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Date Fin</label>
                  <input
                    type="date"
                    required
                    value={sessionFormData.endDate}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, endDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Lieu de la session</label>
                <input
                  type="text"
                  required
                  value={sessionFormData.location}
                  onChange={(e) => setSessionFormData({ ...sessionFormData, location: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Capacité Max</label>
                  <input
                    type="number"
                    value={sessionFormData.maxAttendees}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, maxAttendees: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Statut</label>
                  <select
                    value={sessionFormData.status}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="Planifiée">Planifiée</option>
                    <option value="En cours">En cours</option>
                    <option value="Complète">Complète</option>
                    <option value="Clôturée">Clôturée</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsSessionModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand-orange hover:bg-brand-orange-hover"
                >
                  {editingSession ? 'Mettre à jour' : 'Planifier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MODALE / APERÇU PDF OFFICIEL DE FACTURE ET REÇU DE FORMATION */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="my-auto w-full max-w-3xl bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header Bar with Actions */}
            <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-orange" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Aperçu Document & Facture — {selectedInvoice.invoiceNumber}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-1.5 border border-slate-700"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimer</span>
                </button>
                <button
                  onClick={() => {
                    alert(`Téléchargement du PDF ${selectedInvoice.invoiceNumber} généré avec succès !`);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-orange text-white hover:bg-brand-orange-hover transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger PDF</span>
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable A4 PDF Paper Sheet */}
            <div className="p-6 sm:p-10 bg-white text-slate-800 max-h-[78vh] overflow-y-auto print:max-h-none print:p-0">
              {/* Header with Legal Details */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-sm bg-orange-600">
                      AF
                    </span>
                    <div>
                      <h2 className="text-base font-black text-slate-900 tracking-tight">
                        AM PROD FORMATIONS
                      </h2>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Académie & Centre de Certification Professionnelle
                      </p>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-3 space-y-0.5">
                    <p>Groupe AM PROD SARL AU • Académie BPF Cosmétiques</p>
                    <p>Angle Bd Zerktouni & Bd d'Anfa, Casablanca, Maroc</p>
                    <p>R.C. 54219 Casablanca • I.F. 45892104 • Patente 36981205</p>
                    <p>ICE : 002938491000088 • Agrément Professionnel Qualité BPF</p>
                  </div>
                </div>

                <div className="sm:text-right">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white mb-2 shadow-xs bg-orange-600">
                    FACTURE / REÇU DE FORMATION
                  </span>
                  <p className="text-xl font-mono font-bold text-slate-900">
                    {selectedInvoice.invoiceNumber}
                  </p>
                  <div className="text-xs text-slate-500 space-y-0.5 mt-2">
                    <p><strong className="text-slate-700">Date d'émission :</strong> {formatDate(selectedInvoice.date)}</p>
                    <p><strong className="text-slate-700">Échéance de solde :</strong> {formatDate(selectedInvoice.dueDate)}</p>
                    <p><strong className="text-slate-700">Règlement :</strong> {selectedInvoice.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Trainee / Client Billing Info Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 my-6">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                    Stagiaire / Candidat Facturé :
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">
                    {selectedInvoice.clientName}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">Inscription Certifiante Laboratoire & Formulation</p>
                  <p className="text-xs text-slate-600">Casablanca & Régions, Maroc</p>
                </div>
                <div className="sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                    Statut de Règlement :
                  </span>
                  <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold border ${
                    selectedInvoice.status === 'Payée'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-amber-50 text-amber-700 border-amber-300'
                  }`}>
                    {selectedInvoice.status === 'Payée' ? '✓ RÉGLÉE EN TOTALITÉ' : '⏳ ACOMPTE REÇU / PAIEMENT FRACTIONNÉ'}
                  </span>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="overflow-hidden rounded-xl border border-slate-200 mb-6">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Désignation du Module de Formation</th>
                      <th className="p-3 text-center">Sessions</th>
                      <th className="p-3 text-right">P.U. HT</th>
                      <th className="p-3 text-right">Total HT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="p-3">
                        <span className="font-semibold text-slate-900 block">
                          Formation Professionnelle Certifiante & Travaux Pratiques Labo
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Accès laboratoire certifié, matières premières nobles, kits pédagogiques et examen final
                        </span>
                      </td>
                      <td className="p-3 text-center font-mono">1</td>
                      <td className="p-3 text-right font-mono font-medium">
                        {formatCurrency(selectedInvoice.amountTotal / 1.2)}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(selectedInvoice.amountTotal / 1.2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation Summary */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
                <div className="text-xs text-slate-500 max-w-xs space-y-1">
                  <p className="font-semibold text-slate-700">Modalités d'échelonnement :</p>
                  <p>Acompte requis à l'inscription pour réservation de place au laboratoire. Solde payable avant le début des ateliers pratiques.</p>
                  <p className="text-[11px] text-slate-400">Banque : Attijariwafa Bank Casablanca • RIB : 007 780 0001234567890123 45</p>
                </div>

                <div className="w-full sm:w-64 space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Formation HT :</span>
                    <span className="font-mono font-medium">{formatCurrency(selectedInvoice.amountTotal / 1.2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>TVA (20%) :</span>
                    <span className="font-mono font-medium">{formatCurrency(selectedInvoice.amountTotal - (selectedInvoice.amountTotal / 1.2))}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                    <span>Total TTC :</span>
                    <span className="font-mono text-orange-600">
                      {formatCurrency(selectedInvoice.amountTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-semibold pt-1">
                    <span>Avance / Acompte Versé :</span>
                    <span className="font-mono">{formatCurrency(selectedInvoice.amountPaid)}</span>
                  </div>
                  <div className="flex justify-between text-amber-700 font-bold border-t border-slate-200 pt-1">
                    <span>Reste à Payer (Auto) :</span>
                    <span className="font-mono">{formatCurrency(selectedInvoice.remainingDue)}</span>
                  </div>
                </div>
              </div>

              {/* Official Stamp & Signature Block */}
              <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-end">
                <div className="text-[11px] text-slate-400">
                  <p>Document officiel généré électroniquement par l'Académie AM PROD.</p>
                  <p>Certifié conforme aux normes de formation professionnelle en vigueur.</p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-600 block mb-3">
                    Pour l'Académie AM PROD FORMATIONS
                  </span>
                  <div className="inline-block p-3 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-center">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      CACHET & VISA ACADÉMIQUE
                    </p>
                    <p className="text-[9px] text-slate-400 mt-1">
                      AM PROD SARL AU • DÉPARTEMENT FORMATIONS
                    </p>
                    <p className="text-[9px] font-mono text-emerald-600 font-bold mt-0.5">
                      ✓ ENREGISTRÉ AU REGISTRE CENTRAL
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
