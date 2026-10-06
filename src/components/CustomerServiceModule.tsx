import React, { useState } from 'react';
import { 
  Bot, 
  MessageSquare, 
  Send, 
  Settings, 
  Sparkles, 
  CheckCircle2, 
  UserCheck, 
  Zap, 
  TrendingUp, 
  Search, 
  Check,
  Instagram,
  Facebook,
  Globe,
  Video,
  Clock,
  Radio,
  Sliders,
  Share2
} from 'lucide-react';
import { BrandConfig, ChatbotConfig, WhatsAppConversation, ChatMessage, OmnichannelChannel, ChannelSettings } from '../types';
import { AIDisclaimer } from './FooterAndDisclaimers';
import { formatDateTime } from '../utils/cn';

interface CustomerServiceModuleProps {
  brand: BrandConfig;
  chatbotConfig: ChatbotConfig;
  onUpdateChatbotConfig: (updated: ChatbotConfig) => void;
  conversations: WhatsAppConversation[];
  onUpdateConversations: (updated: WhatsAppConversation[]) => void;
  initialTab?: 'assistant' | 'conversations';
  onTabChange?: (tab: 'assistant' | 'conversations') => void;
}

interface ChannelVisualConfig {
  id: OmnichannelChannel;
  label: string;
  badgeClass: string;
  borderClass: string;
  dotClass: string;
  previewHeaderBg: string;
  previewBubbleUser: string;
  previewBubbleBot: string;
  previewInputPlaceholder: string;
}

const CHANNELS_CONFIG: Record<OmnichannelChannel, ChannelVisualConfig> = {
  WhatsApp: {
    id: 'WhatsApp',
    label: 'WhatsApp',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    borderClass: 'border-emerald-500/30',
    dotClass: 'bg-emerald-400',
    previewHeaderBg: 'bg-[#128c7e]/20 border-b border-emerald-800/40 text-emerald-300',
    previewBubbleUser: 'bg-[#005c4b] text-white',
    previewBubbleBot: 'bg-[#202c33] text-slate-100 border border-slate-700/60',
    previewInputPlaceholder: 'Tester le bot WhatsApp...'
  },
  Instagram: {
    id: 'Instagram',
    label: 'Instagram',
    badgeClass: 'bg-fuchsia-500/10 text-pink-400 border-pink-500/20',
    borderClass: 'border-pink-500/30',
    dotClass: 'bg-pink-400',
    previewHeaderBg: 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-b border-pink-800/40 text-pink-300',
    previewBubbleUser: 'bg-gradient-to-r from-purple-600 to-pink-500 text-white',
    previewBubbleBot: 'bg-slate-800 text-slate-100 border border-slate-700/60',
    previewInputPlaceholder: 'Tester le bot Instagram Direct...'
  },
  Facebook: {
    id: 'Facebook',
    label: 'Facebook',
    badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    borderClass: 'border-blue-500/30',
    dotClass: 'bg-blue-400',
    previewHeaderBg: 'bg-blue-950/40 border-b border-blue-800/40 text-blue-300',
    previewBubbleUser: 'bg-blue-600 text-white',
    previewBubbleBot: 'bg-slate-800 text-slate-100 border border-slate-700/60',
    previewInputPlaceholder: 'Tester Messenger Facebook...'
  },
  TikTok: {
    id: 'TikTok',
    label: 'TikTok',
    badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    borderClass: 'border-cyan-500/30',
    dotClass: 'bg-cyan-400',
    previewHeaderBg: 'bg-slate-950 border-b border-cyan-800/40 text-cyan-300',
    previewBubbleUser: 'bg-slate-900 border border-cyan-500/50 text-white',
    previewBubbleBot: 'bg-slate-800 text-slate-100 border border-slate-700/60',
    previewInputPlaceholder: 'Tester les messages TikTok...'
  },
  'Site Web': {
    id: 'Site Web',
    label: 'Site Web',
    badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    borderClass: 'border-indigo-500/30',
    dotClass: 'bg-indigo-400',
    previewHeaderBg: 'bg-indigo-950/40 border-b border-indigo-800/40 text-indigo-300',
    previewBubbleUser: 'bg-indigo-600 text-white',
    previewBubbleBot: 'bg-slate-900 text-slate-100 border border-slate-800',
    previewInputPlaceholder: 'Tester le chat du Site Web...'
  }
};

export const CustomerServiceModule: React.FC<CustomerServiceModuleProps> = ({
  brand,
  chatbotConfig,
  onUpdateChatbotConfig,
  conversations,
  onUpdateConversations,
  initialTab = 'assistant',
  onTabChange,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'assistant' | 'conversations'>(initialTab);

  // Sync state whenever initialTab prop changes from external navigation (e.g. sidebar)
  React.useEffect(() => {
    if (initialTab) {
      setActiveSubTab(initialTab);
    }
  }, [initialTab]);

  const handleTabSwitch = (tab: 'assistant' | 'conversations') => {
    setActiveSubTab(tab);
    onTabChange?.(tab);
  };
  
  // Selected Channel for Assistant Administration
  const [activeChannel, setActiveChannel] = useState<OmnichannelChannel>('WhatsApp');

  // Initialize or retrieve per-channel settings
  const getInitialChannelSettings = (channel: OmnichannelChannel): ChannelSettings => {
    if (chatbotConfig.channelSettings && chatbotConfig.channelSettings[channel]) {
      return chatbotConfig.channelSettings[channel];
    }
    // Channel-adapted default values
    switch (channel) {
      case 'Instagram':
        return {
          botName: `${chatbotConfig.botName.split('—')[0].trim()} • Insta Direct`,
          welcomeMessage: `Hey ! Ravi de vous accueillir sur notre Instagram ${brand.name} ✨ Posez-moi vos questions sur nos soins ou vos commandes en cours !`,
          tone: 'Chaleureux & Bienveillant',
          supportedLanguages: ['FR', 'EN'],
          businessHours: { start: '09:00', end: '22:00', days: '7j/7' },
          humanTransferRules: { maxAIFailures: 2, keywords: ['humain', 'devis', 'collaboration'], transferOnAngrySentiment: true }
        };
      case 'Facebook':
        return {
          botName: `${chatbotConfig.botName.split('—')[0].trim()} • Messenger`,
          welcomeMessage: `Bonjour ! Bienvenue sur la messagerie officielle Facebook de ${brand.name}. Comment notre équipe peut-elle vous renseigner aujourd'hui ?`,
          tone: 'Professionnel & Rassurant',
          supportedLanguages: ['FR', 'AR', 'EN'],
          businessHours: { start: '08:30', end: '19:00', days: 'Lun - Sam' },
          humanTransferRules: { maxAIFailures: 2, keywords: ['conseiller', 'commande', 'sav'], transferOnAngrySentiment: true }
        };
      case 'TikTok':
        return {
          botName: `${chatbotConfig.botName.split('—')[0].trim()} • TikTok Live & DMs`,
          welcomeMessage: `Bienvenue sur le TikTok de ${brand.name} 🎬 Vous voulez en savoir plus sur une vidéo, un ingrédient ou nos partenariats B2B ? Dites-moi tout !`,
          tone: 'Direct & Efficace',
          supportedLanguages: ['FR', 'AR'],
          businessHours: { start: '10:00', end: '23:00', days: '7j/7' },
          humanTransferRules: { maxAIFailures: 2, keywords: ['partenariat', 'presse', 'urgent'], transferOnAngrySentiment: true }
        };
      case 'Site Web':
        return {
          botName: `${chatbotConfig.botName.split('—')[0].trim()} • Live Chat B2B`,
          welcomeMessage: `Bonjour et bienvenue sur le site officiel de ${brand.name}. Je suis disponible pour répondre instantanément à vos demandes de catalogue et de devis.`,
          tone: chatbotConfig.tone,
          supportedLanguages: chatbotConfig.supportedLanguages,
          businessHours: chatbotConfig.businessHours,
          humanTransferRules: chatbotConfig.humanTransferRules
        };
      case 'WhatsApp':
      default:
        return {
          botName: chatbotConfig.botName,
          welcomeMessage: chatbotConfig.welcomeMessage,
          tone: chatbotConfig.tone,
          supportedLanguages: chatbotConfig.supportedLanguages,
          businessHours: chatbotConfig.businessHours,
          humanTransferRules: chatbotConfig.humanTransferRules
        };
    }
  };

  const [channelConfigs, setChannelConfigs] = useState<Record<OmnichannelChannel, ChannelSettings>>({
    WhatsApp: getInitialChannelSettings('WhatsApp'),
    Instagram: getInitialChannelSettings('Instagram'),
    Facebook: getInitialChannelSettings('Facebook'),
    TikTok: getInitialChannelSettings('TikTok'),
    'Site Web': getInitialChannelSettings('Site Web')
  });

  const currentChannelSettings = channelConfigs[activeChannel];

  const [configSavedToast, setConfigSavedToast] = useState(false);

  // Live Test Messages for Preview
  const [testMessages, setTestMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: currentChannelSettings.welcomeMessage,
      time: '12:00'
    }
  ]);
  const [testInput, setTestInput] = useState('');

  // Conversations Tab State
  const [channelFilter, setChannelFilter] = useState<'TOUS' | OmnichannelChannel>('TOUS');
  const [searchFilter, setSearchFilter] = useState('');

  const brandConversations = conversations.filter(c => c.brandId === brand.id);
  const [selectedConvId, setSelectedConvId] = useState<string>(
    brandConversations[0]?.id || conversations[0]?.id || ''
  );

  React.useEffect(() => {
    const brandConvs = conversations.filter(c => c.brandId === brand.id);
    if (brandConvs.length > 0 && !brandConvs.some(c => c.id === selectedConvId)) {
      setSelectedConvId(brandConvs[0].id);
    } else if (brandConvs.length === 0 && conversations.length > 0) {
      setSelectedConvId(conversations[0].id);
    }
  }, [brand.id, conversations, selectedConvId]);

  const [replyInput, setReplyInput] = useState('');

  const currentConv = conversations.find(c => c.id === selectedConvId) || brandConversations[0] || conversations[0];

  // Helper for rendering channel icons
  const renderChannelIcon = (ch: string, className = "w-3.5 h-3.5") => {
    switch (ch) {
      case 'WhatsApp':
        return <MessageSquare className={`${className} text-emerald-400`} />;
      case 'Instagram':
        return <Instagram className={`${className} text-pink-400`} />;
      case 'Facebook':
        return <Facebook className={`${className} text-blue-400`} />;
      case 'TikTok':
        return <Video className={`${className} text-cyan-400`} />;
      case 'Site Web':
      case 'WebChat':
      default:
        return <Globe className={`${className} text-indigo-400`} />;
    }
  };

  // Switch active channel in Assistant tab
  const handleSelectChannel = (channel: OmnichannelChannel) => {
    setActiveChannel(channel);
    setTestMessages([
      {
        sender: 'bot',
        text: channelConfigs[channel].welcomeMessage,
        time: 'À l\'instant'
      }
    ]);
  };

  const handleUpdateCurrentChannelSettings = (updated: Partial<ChannelSettings>) => {
    setChannelConfigs(prev => ({
      ...prev,
      [activeChannel]: {
        ...prev[activeChannel],
        ...updated
      }
    }));
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFullConfig: ChatbotConfig = {
      ...chatbotConfig,
      channelSettings: channelConfigs,
      // If saving WhatsApp, sync top-level attributes for backwards-compat
      ...(activeChannel === 'WhatsApp' ? {
        botName: currentChannelSettings.botName,
        welcomeMessage: currentChannelSettings.welcomeMessage,
        tone: currentChannelSettings.tone,
        supportedLanguages: currentChannelSettings.supportedLanguages,
        businessHours: currentChannelSettings.businessHours,
        humanTransferRules: currentChannelSettings.humanTransferRules,
      } : {})
    };

    onUpdateChatbotConfig(updatedFullConfig);
    setConfigSavedToast(true);
    setTestMessages([
      { sender: 'bot', text: currentChannelSettings.welcomeMessage, time: 'À l\'instant' }
    ]);
    setTimeout(() => setConfigSavedToast(false), 2500);
  };

  const handleSendTestMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim()) return;

    const userMsg = testInput.trim();
    setTestMessages(prev => [...prev, { sender: 'user', text: userMsg, time: 'À l\'instant' }]);
    setTestInput('');

    setTimeout(() => {
      let botResponse = `Bonjour ! Je suis ${currentChannelSettings.botName} sur ${activeChannel}. J'ai bien pris en compte votre message relatif à "${userMsg}".`;
      
      if (userMsg.toLowerCase().includes('prix') || userMsg.toLowerCase().includes('tarif')) {
        botResponse = `Nos tarifs et conditions pour ${brand.name} sont calculés selon le volume. Souhaitez-vous recevoir un devis formel ou être contacté par notre équipe commerciale ?`;
      } else if (userMsg.toLowerCase().includes('stock') || userMsg.toLowerCase().includes('dispo')) {
        botResponse = `Nos références sont en stock et expédiées sous 24-48h depuis notre plateforme logistique sécurisée.`;
      } else if (userMsg.toLowerCase().includes('humain') || userMsg.toLowerCase().includes('conseiller')) {
        botResponse = `Bien noté. Selon vos règles d'escalade définies sur ${activeChannel}, je transfère immédiatement la discussion à un conseiller humain !`;
      }

      setTestMessages(prev => [...prev, { sender: 'bot', text: botResponse, time: 'À l\'instant' }]);
    }, 600);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim() || !currentConv) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'agent',
      text: replyInput.trim(),
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    const updatedConvs = conversations.map(c => {
      if (c.id === currentConv.id) {
        return {
          ...c,
          status: 'Transféré Humain' as const,
          lastMessage: replyInput.trim(),
          lastTimestamp: new Date().toISOString(),
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    });

    onUpdateConversations(updatedConvs);
    setReplyInput('');
  };

  // Filter conversations
  const filteredConversations = brandConversations
    .filter(c => {
      const matchSearch = c.clientName.toLowerCase().includes(searchFilter.toLowerCase()) || 
                          c.phone.includes(searchFilter) ||
                          c.lastMessage.toLowerCase().includes(searchFilter.toLowerCase());
      
      const matchChannel = channelFilter === 'TOUS' || 
        (channelFilter === 'Site Web' ? (c.channel === 'Site Web' || c.channel === 'WebChat') : c.channel === channelFilter);

      return matchSearch && matchChannel;
    });

  const activeVisual = CHANNELS_CONFIG[activeChannel];

  return (
    <div className="w-full space-y-6">
      
      {/* Top Bar Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Service Client Omnicanal & IA
            </h1>
            <span className="text-[11px] px-2.5 py-0.5 rounded-md font-medium border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
              5 Canaux Connectés
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Supervision de l'assistant IA et boîte de réception unifiée (WhatsApp, Instagram, Facebook, TikTok, Site Web) pour {brand.name}.
          </p>
        </div>

        <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => handleTabSwitch('assistant')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'assistant'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-brand-orange" />
            1. Assistant IA
          </button>
          <button
            onClick={() => handleTabSwitch('conversations')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'conversations'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            2. Conversations ({brandConversations.length})
          </button>
        </div>
      </div>

      {/* SUB-MODULE 1: ASSISTANT IA OMNICANAL */}
      {activeSubTab === 'assistant' && (
        <div className="w-full space-y-6">
          
          {/* KPI Dashboard Grid */}
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90">
              <span className="text-xs font-medium text-slate-400">Conversations Aujourd'hui</span>
              <p className="text-2xl font-bold text-white mt-3">
                {chatbotConfig.totalConversationsToday}
              </p>
              <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> +14% vs hier
              </span>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90">
              <span className="text-xs font-medium text-slate-400">Taux Résolution Autonome</span>
              <p className="text-2xl font-bold text-emerald-400 mt-3">
                {chatbotConfig.resolutionRatePercent}%
              </p>
              <span className="text-[10px] text-slate-400 mt-1 block">Sans intervention humaine</span>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90">
              <span className="text-xs font-medium text-slate-400">Temps Moyen de Réponse</span>
              <p className="text-2xl font-bold text-white mt-3">
                {chatbotConfig.avgResponseTimeSeconds}s
              </p>
              <span className="text-[10px] text-emerald-400 mt-1 block">Disponibilité 24/7</span>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90">
              <span className="text-xs font-medium text-slate-400">Moteur IA Omnicanal</span>
              <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5 mt-3">
                <Zap className="w-4 h-4 fill-emerald-400 text-emerald-400" /> Connecté
              </p>
              <AIDisclaimer variant="subtle" className="mt-2 text-[10px] py-1" />
            </div>
          </div>

          {/* CHANNEL SELECTOR TABS (5 Canaux) */}
          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 pl-1">
                <Radio className="w-3.5 h-3.5 text-brand-orange" />
                Sélection du canal à administrer :
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(['WhatsApp', 'Instagram', 'Facebook', 'TikTok', 'Site Web'] as OmnichannelChannel[]).map((chan) => {
                const conf = CHANNELS_CONFIG[chan];
                const isActive = activeChannel === chan;
                return (
                  <button
                    key={chan}
                    type="button"
                    onClick={() => handleSelectChannel(chan)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all border ${
                      isActive
                        ? `${conf.badgeClass} shadow-sm border-current`
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    {renderChannelIcon(chan, "w-4 h-4")}
                    <span>{conf.label}</span>
                    {isActive && (
                      <span className={`w-1.5 h-1.5 rounded-full ${conf.dotClass}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form on Left, Dynamic Channel-Adapted Live Preview on Right */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Form */}
            <form onSubmit={handleSaveConfig} className="lg:col-span-7 p-6 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  {renderChannelIcon(activeChannel, "w-4 h-4")}
                  <h3 className="text-sm font-semibold text-white tracking-wide">
                    Paramétrage de l'Agent — Canal {activeChannel}
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Sauvegardé en localStorage</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Nom Public de l'Assistant ({activeChannel})
                  </label>
                  <input
                    type="text"
                    value={currentChannelSettings.botName}
                    onChange={(e) => handleUpdateCurrentChannelSettings({ botName: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950/60 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Tonalité & Style de Réponse
                  </label>
                  <select
                    value={currentChannelSettings.tone}
                    onChange={(e) => handleUpdateCurrentChannelSettings({ tone: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950/60 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                  >
                    <option value="Professionnel & Rassurant">Professionnel & Rassurant</option>
                    <option value="Chaleureux & Bienveillant">Chaleureux & Bienveillant</option>
                    <option value="Direct & Efficace">Direct & Efficace</option>
                    <option value="Prestige & Luxe">Prestige & Luxe</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Message d'Accueil Automatique ({activeChannel})
                </label>
                <textarea
                  rows={3}
                  value={currentChannelSettings.welcomeMessage}
                  onChange={(e) => handleUpdateCurrentChannelSettings({ welcomeMessage: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950/60 border border-slate-800 text-white focus:outline-none focus:border-slate-700 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Langues Prises en Charge
                  </label>
                  <div className="flex gap-2 pt-1">
                    {(['FR', 'AR', 'EN'] as const).map(lang => (
                      <button
                        type="button"
                        key={lang}
                        onClick={() => {
                          const langs = currentChannelSettings.supportedLanguages.includes(lang)
                            ? currentChannelSettings.supportedLanguages.filter(l => l !== lang)
                            : [...currentChannelSettings.supportedLanguages, lang];
                          if (langs.length > 0) handleUpdateCurrentChannelSettings({ supportedLanguages: langs });
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          currentChannelSettings.supportedLanguages.includes(lang)
                            ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                            : 'bg-slate-950/40 text-slate-400 border-slate-800'
                        }`}
                      >
                        {lang === 'FR' ? 'Français' : lang === 'AR' ? 'Arabe' : 'Anglais'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Plages Horaires de Traitement
                  </label>
                  <div className="flex items-center gap-2 text-xs">
                    <input
                      type="text"
                      value={currentChannelSettings.businessHours.start}
                      onChange={(e) => handleUpdateCurrentChannelSettings({
                        businessHours: { ...currentChannelSettings.businessHours, start: e.target.value }
                      })}
                      className="w-16 px-2 py-1.5 text-center rounded bg-slate-950/60 border border-slate-800 text-white"
                    />
                    <span className="text-slate-400">à</span>
                    <input
                      type="text"
                      value={currentChannelSettings.businessHours.end}
                      onChange={(e) => handleUpdateCurrentChannelSettings({
                        businessHours: { ...currentChannelSettings.businessHours, end: e.target.value }
                      })}
                      className="w-16 px-2 py-1.5 text-center rounded bg-slate-950/60 border border-slate-800 text-white"
                    />
                    <input
                      type="text"
                      value={currentChannelSettings.businessHours.days}
                      onChange={(e) => handleUpdateCurrentChannelSettings({
                        businessHours: { ...currentChannelSettings.businessHours, days: e.target.value }
                      })}
                      className="w-24 px-2 py-1.5 text-center rounded bg-slate-950/60 border border-slate-800 text-white text-[11px]"
                      placeholder="Lun - Sam"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-brand-orange" />
                    Règles d'Escalade & Transfert Humain ({activeChannel})
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
                    <input
                      type="checkbox"
                      checked={currentChannelSettings.humanTransferRules.transferOnAngrySentiment}
                      onChange={(e) => handleUpdateCurrentChannelSettings({
                        humanTransferRules: {
                          ...currentChannelSettings.humanTransferRules,
                          transferOnAngrySentiment: e.target.checked
                        }
                      })}
                      className="rounded bg-slate-900 border-slate-700 text-brand-orange"
                    />
                    Escalade auto si insatisfaction
                  </label>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    Mots-clés déclencheurs d'escalade :
                  </label>
                  <input
                    type="text"
                    value={currentChannelSettings.humanTransferRules.keywords.join(', ')}
                    onChange={(e) => handleUpdateCurrentChannelSettings({
                      humanTransferRules: {
                        ...currentChannelSettings.humanTransferRules,
                        keywords: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      }
                    })}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none"
                    placeholder="humain, devis urgent, conseiller, réclamation..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-medium text-white bg-brand-orange hover:bg-brand-orange-hover transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  Sauvegarder pour {activeChannel}
                </button>

                {configSavedToast && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    Enregistré dans localStorage pour {activeChannel}
                  </span>
                )}
              </div>
            </form>

            {/* Live Preview dynamically tailored to active channel */}
            <div className="lg:col-span-5 flex flex-col h-[520px] bg-slate-950 rounded-2xl p-2.5 border border-slate-800 shadow-xl">
              <div className="w-full h-full rounded-xl bg-slate-900/90 flex flex-col overflow-hidden text-white border border-slate-800/80">
                
                {/* Header tailored to active channel */}
                <div className={`px-4 py-3 flex items-center justify-between ${activeVisual.previewHeaderBg}`}>
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-xs shrink-0"
                      style={{ backgroundColor: brand.primaryColor }}
                    >
                      {brand.logo}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold leading-tight text-white flex items-center gap-1.5">
                        {currentChannelSettings.botName}
                      </h4>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        {renderChannelIcon(activeChannel, "w-3 h-3")}
                        <span>Canal {activeChannel} • En ligne</span>
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${activeVisual.badgeClass}`}>
                    APERÇU DIRECT
                  </span>
                </div>

                {/* Messages list */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/60">
                  {testMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-xl px-3.5 py-2 text-xs leading-relaxed ${
                          msg.sender === 'user'
                            ? activeVisual.previewBubbleUser
                            : activeVisual.previewBubbleBot
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-slate-500 mt-0.5 px-1 font-mono">
                        {msg.time}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Test message input */}
                <form onSubmit={handleSendTestMessage} className="p-2.5 flex items-center gap-2 bg-slate-950 border-t border-slate-800">
                  <input
                    type="text"
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    placeholder={activeVisual.previewInputPlaceholder}
                    className="flex-1 bg-slate-900 text-xs px-3 py-2 rounded-lg text-white placeholder-slate-400 border border-slate-800 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-lg bg-brand-orange text-white hover:bg-brand-orange-hover transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* SUB-MODULE 2: CONVERSATIONS (AVEC FILTRAGE PAR CANAL & BADGES VISUELS) */}
      {activeSubTab === 'conversations' && (
        <div className="w-full space-y-3">
          
          {/* Channel Filter Pills for Conversations */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-300 mr-2">
                Filtrer par canal :
              </span>
              {(['TOUS', 'WhatsApp', 'Instagram', 'Facebook', 'TikTok', 'Site Web'] as const).map(tab => {
                const isSelected = channelFilter === tab;
                const count = tab === 'TOUS' 
                  ? brandConversations.length 
                  : brandConversations.filter(c => tab === 'Site Web' ? (c.channel === 'Site Web' || c.channel === 'WebChat') : c.channel === tab).length;

                return (
                  <button
                    key={tab}
                    onClick={() => setChannelFilter(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all border ${
                      isSelected
                        ? 'bg-slate-800 text-white border-slate-600 shadow-xs'
                        : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    {tab !== 'TOUS' && renderChannelIcon(tab, "w-3 h-3")}
                    <span>{tab}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700/60 text-slate-300 font-mono">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-slate-400 font-mono">
              {filteredConversations.length} conversation(s) affichée(s)
            </div>
          </div>

          {/* Conversations Layout */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 h-[640px] rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            
            {/* Left: Contacts List */}
            <div className="lg:col-span-4 border-r border-slate-800 flex flex-col h-full bg-slate-950/40">
              <div className="p-3 border-b border-slate-800">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Rechercher par nom, téléphone, message..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    Aucune conversation ne correspond à ce filtre.
                  </div>
                ) : (
                  filteredConversations.map((conv) => {
                    const isSelected = conv.id === currentConv?.id;
                    const visual = CHANNELS_CONFIG[conv.channel === 'WebChat' ? 'Site Web' : conv.channel];

                    return (
                      <div
                        key={conv.id}
                        onClick={() => setSelectedConvId(conv.id)}
                        className={`p-3.5 cursor-pointer transition-colors flex items-start gap-3 ${
                          isSelected
                            ? 'bg-slate-800/80 border-l-2 border-brand-orange'
                            : 'hover:bg-slate-900/60'
                        }`}
                      >
                        <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-xs shrink-0 overflow-hidden relative shadow-xs">
                          <span className="select-none text-slate-300 font-semibold">{conv.clientName.charAt(0)}</span>
                          {conv.avatar && (
                            <img
                              src={conv.avatar}
                              alt={conv.clientName}
                              className="w-full h-full object-cover absolute inset-0"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                              }}
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-xs font-semibold text-slate-200 truncate">
                              {conv.clientName}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {formatDateTime(conv.lastTimestamp)}
                            </span>
                          </div>

                          <p className="text-xs text-slate-400 truncate mb-1.5">
                            {conv.lastMessage}
                          </p>

                          {/* Channel Badge + Priority Badge */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-semibold border flex items-center gap-1 ${visual?.badgeClass || 'bg-slate-800 text-slate-300'}`}>
                              {renderChannelIcon(conv.channel, "w-2.5 h-2.5")}
                              {conv.channel}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                              conv.status === 'Transféré Humain' 
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                                : 'bg-slate-800/80 text-slate-400 border border-slate-700/60'
                            }`}>
                              {conv.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right: Active Chat */}
            <div className="lg:col-span-8 flex flex-col h-full bg-slate-900/40">
              {currentConv ? (
                <>
                  <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-xs shrink-0 overflow-hidden relative shadow-xs">
                        <span className="select-none text-slate-300 font-semibold">{currentConv.clientName.charAt(0)}</span>
                        {currentConv.avatar && (
                          <img
                            src={currentConv.avatar}
                            alt={currentConv.clientName}
                            className="w-full h-full object-cover absolute inset-0"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-semibold text-white">
                            {currentConv.clientName}
                          </h3>
                          {/* Channel Badge in Header */}
                          <span className={`text-[10px] px-2 py-0.5 rounded font-medium border flex items-center gap-1 ${
                            CHANNELS_CONFIG[currentConv.channel === 'WebChat' ? 'Site Web' : currentConv.channel]?.badgeClass || 'bg-slate-800 text-slate-300'
                          }`}>
                            {renderChannelIcon(currentConv.channel, "w-3 h-3")}
                            {currentConv.channel}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {currentConv.phone} • Priorité : <span className="text-slate-300 font-semibold">{currentConv.priority}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
                        currentConv.status === 'Transféré Humain'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {currentConv.status}
                      </span>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-slate-950/40">
                    {(currentConv?.messages || []).map((m) => (
                      <div
                        key={m.id}
                        className={`flex flex-col ${m.sender === 'agent' ? 'items-end' : 'items-start'}`}
                      >
                        <div className="text-[10px] text-slate-400 mb-1">
                          {m.sender === 'agent' ? 'Vous (Conseiller Humain)' : m.sender === 'ai' ? 'Assistant IA' : currentConv.clientName}
                        </div>
                        <div
                          className={`max-w-[80%] rounded-xl px-4 py-2.5 text-xs leading-relaxed ${
                            m.sender === 'agent'
                              ? 'bg-brand-orange text-white'
                              : m.sender === 'ai'
                              ? 'bg-slate-900 text-slate-200 border border-slate-800'
                              : 'bg-slate-950 text-slate-300 border border-slate-800'
                          }`}
                        >
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reply Form */}
                  <form onSubmit={handleSendReply} className="p-3 border-t border-slate-800 flex items-center gap-2 bg-slate-950">
                    <input
                      type="text"
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                      placeholder={`Répondre à ${currentConv.clientName} sur ${currentConv.channel}...`}
                      className="flex-1 text-xs px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-brand-orange hover:bg-brand-orange-hover transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Envoyer
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
                  Sélectionnez une discussion.
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
