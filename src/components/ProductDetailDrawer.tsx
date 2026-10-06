import React, { useState } from 'react';
import { 
  X, 
  Package, 
  BarChart3, 
  Layers, 
  Check, 
  Sparkles
} from 'lucide-react';
import { Product, BrandConfig } from '../types';
import { formatCurrency } from '../utils/cn';

interface ProductDetailDrawerProps {
  product: Product | null;
  brand: BrandConfig;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStock: (productId: string, newStock: number) => void;
}

export const ProductDetailDrawer: React.FC<ProductDetailDrawerProps> = ({
  product,
  brand,
  isOpen,
  onClose,
  onUpdateStock,
}) => {
  if (!isOpen || !product) return null;

  const [stockInput, setStockInput] = useState(product.stock);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleStockSave = () => {
    onUpdateStock(product.id, Number(stockInput));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-md animate-fade-in flex justify-end">
      <div 
        className="w-full max-w-xl bg-slate-900/90 backdrop-blur-md border-l border-slate-800 h-full shadow-2xl flex flex-col overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] px-2.5 py-0.5 rounded font-medium bg-slate-800 text-slate-300">
              {product.category}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {product.sku}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-1">
          {/* HD Image Banner */}
          <div className="relative h-60 rounded-xl overflow-hidden border border-slate-800 group">
            <img 
              src={product.image} 
              alt={product.name}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80';
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex items-end p-4">
              <div>
                <span className={`inline-block text-[10px] px-2 py-0.5 rounded font-semibold mb-1 text-white ${
                  product.stock === 0 ? 'bg-rose-600' : product.stock <= product.minStock ? 'bg-amber-600' : 'bg-emerald-600'
                }`}>
                  {product.status}
                </span>
                <h3 className="text-base font-bold text-white">
                  {product.name}
                </h3>
              </div>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Prix Vente HT</span>
              <p className="text-sm font-bold text-white mt-0.5">
                {formatCurrency(product.price)}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Coût Formule</span>
              <p className="text-sm font-bold text-slate-300 mt-0.5">
                {formatCurrency(product.cost)}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[10px] text-emerald-400 uppercase block">Marge</span>
              <p className="text-sm font-bold text-emerald-400 mt-0.5">
                {Math.round(((product.price - product.cost) / product.price) * 100)}%
              </p>
            </div>
          </div>

          {/* Sales Performance */}
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-brand-orange" />
                Performances Commerciales (30J)
              </h4>
              <span className="text-xs font-semibold text-brand-orange">
                ★ {product.rating} / 5
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div>
                <span className="text-slate-400">Unités vendues :</span>
                <p className="text-sm font-bold text-white mt-0.5">
                  {product.salesLast30Days} unités
                </p>
              </div>
              <div>
                <span className="text-slate-400">Chiffre d'Affaires :</span>
                <p className="text-sm font-bold text-emerald-400 mt-0.5">
                  {formatCurrency(product.revenueGenerated)}
                </p>
              </div>
            </div>
          </div>

          {/* Stock Input */}
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-4 h-4 text-emerald-400" />
              Inventaire en Temps Réel
            </h4>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-[11px] text-slate-400 block mb-1">
                  Unités disponibles (Alerte si &le; {product.minStock})
                </label>
                <input
                  type="number"
                  value={stockInput}
                  onChange={(e) => setStockInput(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none"
                />
              </div>
              <div className="pt-4">
                <button
                  onClick={handleStockSave}
                  className="px-4 py-2 text-xs font-medium text-white rounded-lg bg-brand-orange hover:bg-brand-orange-hover transition-colors"
                >
                  {saveSuccess ? <Check className="w-4 h-4" /> : 'Mettre à jour'}
                </button>
              </div>
            </div>
          </div>

          {/* Description & INCI */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
              Description Formule R&D
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800">
              {product.description}
            </p>
          </div>

          {product.composition && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                Liste INCI
              </h4>
              <p className="text-[11px] text-slate-400 font-mono bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                {product.composition}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
