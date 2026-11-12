import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Lock, ShieldCheck } from 'lucide-react';
import { BRANDS } from '../data/brands';
import { BRAND_VISUALS } from '../data/images';
import { BrandId } from '../types';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { FooterInstitutional } from '../components/FooterAndDisclaimers';
import { BrandLogo } from '../components/BrandLogo';

const cardMotion = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] },
  }),
};

export const PortalPage: React.FC = () => {
  const brandKeys = Object.keys(BRANDS) as BrandId[];
  const subsidiaryKeys = brandKeys.filter((id) => id !== 'seo');
  const hub = BRANDS.seo;

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between selection:bg-orange-500 selection:text-white bg-slate-950 text-slate-100">
      <AnimatedBackground variant="portal" />

      {/* Top Navbar */}
      <header className="w-full px-6 lg:px-12 py-4 flex items-center justify-between border-b border-slate-800/80 backdrop-blur-md bg-slate-950/70 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-600/40 text-emerald-400 flex items-center justify-center font-bold text-xs tracking-tight shadow-xs">
            AM
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">
              AM PROD GROUP
            </h1>
            <p className="text-[11px] text-slate-400 font-normal">
              Portail Multi-Marques ERP & Agent SEO
            </p>
          </div>
        </div>

        <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium text-slate-300 bg-slate-900/70 border border-slate-800">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          {brandKeys.length} espaces opérationnels
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1500px] mx-auto px-6 lg:px-12 py-10 lg:py-14 flex flex-col justify-center">
        {/* Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-10 lg:mb-12 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            Portail Global Unifié
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
            Plateforme de Gestion &{' '}
            <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-orange-300 bg-clip-text text-transparent">
              Direction Groupe
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Sélectionnez votre espace opérationnel. Chaque filiale dispose de son catalogue dédié, de ses données synchronisées, de ses indicateurs de performance et de l'Agent SEO central.
          </p>
        </motion.div>

        {/* Filiales */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Filiales opérationnelles
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent" />
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {subsidiaryKeys.map((brandId, i) => {
            const brand = BRANDS[brandId];

            return (
              <motion.div
                key={brandId}
                custom={i}
                variants={cardMotion}
                initial="hidden"
                animate="visible"
                className="flex"
              >
                <Link
                  to={`/login/${brandId}`}
                  aria-label={`Entrer dans l'espace ${brand.name}`}
                  className="portal-card group relative w-full rounded-2xl overflow-hidden flex flex-col bg-slate-900/70 border border-slate-800/90 hover-lift focus-ring"
                  style={{
                    ['--glow-color' as any]: `${brand.primaryColor}45`,
                    ['--brand-color' as any]: brand.primaryColor,
                  }}
                >
                  {/* Photo d'activité */}
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    <img
                      src={BRAND_VISUALS[brandId].card}
                      alt=""
                      loading="lazy"
                      className="img-fade absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      onLoad={(e) => e.currentTarget.classList.add('is-loaded')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/25 to-transparent" />
                    <div
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{ backgroundColor: brand.primaryColor }}
                    />
                    <span className="absolute top-3.5 right-3.5 text-[11px] font-semibold px-2.5 py-1 rounded-full text-white bg-slate-950/70 border border-white/15 backdrop-blur-md">
                      {brand.badge}
                    </span>
                  </div>

                  <div className="relative flex-1 flex flex-col px-5 pb-5">
                    <div className="-mt-7 mb-3 w-fit rounded-xl ring-4 ring-slate-900 bg-slate-900">
                      <BrandLogo brandId={brandId} variant="icon" size="lg" />
                    </div>

                    <h3 className="text-base font-bold text-white leading-snug">
                      {brand.name}
                    </h3>
                    <p
                      className="text-xs font-medium mt-1 line-clamp-2"
                      style={{ color: brand.primaryColor, filter: 'brightness(1.45)' }}
                    >
                      {brand.tagline}
                    </p>

                    <p className="text-[13px] text-slate-400 leading-relaxed mt-3 line-clamp-3">
                      {brand.description}
                    </p>

                    <div className="mt-auto pt-5">
                      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-xs text-slate-400 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-emerald-400" /> Démo 1-Click
                        </span>
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white pl-3.5 pr-3 py-1.5 rounded-full transition-all duration-200 group-hover:gap-2.5"
                          style={{ backgroundColor: brand.primaryColor }}
                        >
                          Entrer
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Hub Direction Générale */}
        <div className="flex items-center gap-3 mt-10 mb-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Direction générale
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent" />
        </div>

        <motion.div custom={4} variants={cardMotion} initial="hidden" animate="visible">
          <Link
            to="/login/seo"
            aria-label={`Entrer dans l'espace ${hub.name}`}
            className="portal-card group relative w-full rounded-2xl overflow-hidden flex flex-col md:flex-row bg-gradient-to-br from-indigo-950/70 via-slate-900/80 to-slate-900/70 border border-indigo-500/30 hover-lift focus-ring"
            style={{
              ['--glow-color' as any]: `${hub.primaryColor}45`,
              ['--brand-color' as any]: hub.primaryColor,
            }}
          >
            <div className="flex-1 p-6 lg:p-7 flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="shrink-0">
                <BrandLogo brandId="seo" variant="icon" size="lg" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-lg font-bold text-white">{hub.name}</h3>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full text-indigo-200 bg-indigo-500/15 border border-indigo-400/30">
                    {hub.badge}
                  </span>
                </div>
                <p className="text-[13px] text-slate-300/90 leading-relaxed mt-2 max-w-3xl">
                  {hub.description}
                </p>
                <span className="mt-3 text-xs text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Vue consolidée des 4 filiales • Démo 1-Click
                </span>
              </div>

              <span className="shrink-0 self-start sm:self-center inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-full bg-indigo-500 transition-all duration-200 group-hover:bg-indigo-400 group-hover:gap-3">
                Ouvrir le cockpit
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>

            <div className="relative hidden md:block w-64 lg:w-80 shrink-0">
              <img
                src={BRAND_VISUALS.seo.card}
                alt=""
                loading="lazy"
                className="img-fade absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                onLoad={(e) => e.currentTarget.classList.add('is-loaded')}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-indigo-950/30" />
            </div>
          </Link>
        </motion.div>
      </main>

      <FooterInstitutional />
    </div>
  );
};
