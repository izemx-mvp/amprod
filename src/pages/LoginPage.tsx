import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Sun, 
  Moon, 
  ArrowLeft,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { BRANDS } from '../data/brands';
import { BrandId } from '../types';
import { BrandLogo } from '../components/BrandLogo';
import { FooterInstitutional } from '../components/FooterAndDisclaimers';
import { useTheme } from '../hooks/useTheme';

export const LoginPage: React.FC = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const validBrandId = (brandId && brandId in BRANDS ? brandId : 'cosmetics') as BrandId;
  const brand = BRANDS[validBrandId];

  const [email, setEmail] = useState(brand.loginEmail);
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    localStorage.setItem('am_active_brand', brand.id);
    localStorage.setItem('am_user_authenticated', 'true');

    setTimeout(() => {
      setIsLoading(false);
      if (brand.id === 'seo') {
        navigate('/seo');
      } else {
        navigate(`/erp/${brand.id}/dashboard`);
      }
    }, 350);
  };

  // High-resolution contextual imagery and descriptions
  const getBrandVisuals = () => {
    switch (brand.id) {
      case 'cosmetics':
        return {
          bgImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1600&q=80',
          title: 'Matières Premières Cosmétiques & R&D Formulatoire',
          description: 'Plateforme ERP centrale pour l\'approvisionnement B2B de matières premières pures, suivi des stocks de gros, conformité technique et relation clients industriels.',
        };
      case 'rehab':
        return {
          bgImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=80',
          title: 'Cosmétique Biologique, Soins Capillaires & Visage',
          description: 'Gestion intégrée de la marque cosmétique bio : formulations naturelles, shampooings solides, crèmes visage bio, traçabilité des lots et distribution.',
        };
      case 'huiles':
        return {
          bgImage: 'https://images.unsplash.com/photo-1608248597359-52e85e054696?auto=format&fit=crop&w=1600&q=80',
          title: 'Pressage à Froid & Élixirs Purs Sélectionnés',
          description: 'Système ERP spécialisé dans l\'extraction noble : Argan, Pépins de Figue de Barbarie, Jojoba et Nigelle en conditionnement gros et détail.',
        };
      case 'formations':
        return {
          bgImage: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=1600&q=80',
          title: 'Académie Supérieure des Métiers de la Beauté',
          description: 'Portail pédagogique et administratif : gestion des promotions, planification de sessions interactives, paiements fractionnés et suivi Sofia IA.',
        };
      case 'seo':
      default:
        return {
          bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
          title: 'Agent SEO Central & Supervision Groupe',
          description: 'Hub centralisé d\'analyse de visibilité Google, détection des anomalies de trafic best-sellers et assistant stratégique cross-marques.',
        };
    }
  };

  const visuals = getBrandVisuals();

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between selection:bg-orange-500 selection:text-white bg-slate-950 text-slate-100">
      
      {/* Top Navigation Bar */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Retour au Portail
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span>Espace :</span>
            <span 
              className="font-semibold px-2 py-0.5 rounded text-[11px] border"
              style={{
                borderColor: `${brand.primaryColor}40`,
                color: brand.primaryColor,
                backgroundColor: `${brand.primaryColor}10`
              }}
            >
              {brand.name}
            </span>
          </div>
        </div>
      </header>

      {/* SPLIT-SCREEN MAIN SECTION */}
      <main className="flex-1 w-full grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-120px)]">
        
        {/* COLONNE GAUCHE (Visuel Immersif, Brand Logo, Description) */}
        <div className="relative lg:col-span-7 flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden">
          {/* Contextual HD Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
            style={{ backgroundImage: `url(${visuals.bgImage})` }}
          />

          {/* Dark luxury gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/70" />
          <div 
            className="absolute inset-0 opacity-20 mix-blend-multiply"
            style={{ backgroundColor: brand.primaryColor }}
          />

          {/* Subtle grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Top content on Left Column: Custom Brand Logo */}
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/80 border border-slate-700/80 text-white backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Système ERP Institutionnel Privé</span>
            </div>

            <div className="pt-2">
              <BrandLogo brandId={validBrandId} variant="full" size="xl" />
            </div>
          </div>

          {/* Middle Content: Title and Institutional Description */}
          <div className="relative z-10 space-y-4 my-auto py-10 max-w-xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {visuals.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              {visuals.description}
            </p>
          </div>

          {/* Bottom accreditation note on Left Column (No color name mentions) */}
          <div className="relative z-10 pt-6 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>AM PROD Holding • Division Opérationnelle</span>
            <span className="font-medium text-slate-300">
              {brand.sector}
            </span>
          </div>
        </div>

        {/* COLONNE DROITE (Formulaire de connexion Administrateur standard) */}
        <div className="lg:col-span-5 bg-slate-950 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-14 border-t lg:border-t-0 lg:border-l border-slate-800/80">
          
          <div className="w-full max-w-md space-y-6">
            
            {/* Form Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span 
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: brand.primaryColor }}
                />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Accès Sécurisé
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tight">
                Connexion Administrateur
              </h2>
              <p className="text-xs text-slate-400">
                Espace de gestion réservé à l'administration de <strong className="text-slate-200">{brand.name}</strong>.
              </p>
            </div>

            {/* Standard Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Identifiant Administrateur
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 text-xs font-medium rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-slate-700 shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Mot de Passe
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 text-xs font-medium rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-slate-700 shadow-inner"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-orange-500/20 hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Zap className="w-4 h-4 animate-spin" />
                      Connexion en cours...
                    </span>
                  ) : (
                    <>
                      <span>Connexion Administrateur</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Brand Switcher Footer */}
            <div className="pt-6 border-t border-slate-800 text-center space-y-2.5">
              <span className="text-[11px] font-medium text-slate-400 block">
                Basculer vers un autre espace :
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {(Object.keys(BRANDS) as BrandId[])
                  .filter(id => id !== brand.id)
                  .map(otherId => {
                    const otherBrand = BRANDS[otherId];
                    return (
                      <button
                        key={otherId}
                        type="button"
                        onClick={() => navigate(`/login/${otherId}`)}
                        className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
                      >
                        <span 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: otherBrand.primaryColor }}
                        />
                        {otherBrand.name.replace('AM PROD ', '')}
                      </button>
                    );
                  })}
              </div>
            </div>

          </div>

        </div>

      </main>

      <FooterInstitutional />
    </div>
  );
};
