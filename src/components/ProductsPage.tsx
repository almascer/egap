import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ArrowRight, Search } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Product, Category } from '../types';

export default function ProductsPage() {
  const { categoryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [allCats, allProds] = await Promise.all([
          dataService.getCategories(),
          dataService.getProducts()
        ]);

        setCategories(allCats);
        
        // Handle search query
        const searchParams = new URLSearchParams(location.search);
        const searchQuery = searchParams.get('search')?.toLowerCase();

        let filteredProds = allProds;

        if (categoryId) {
          setCategory(allCats.find(c => c.id === categoryId) || null);
          filteredProds = filteredProds.filter(p => p.category === categoryId);
        } else {
          setCategory(null);
        }

        if (searchQuery) {
          filteredProds = filteredProds.filter(p => 
            p.name.toLowerCase().includes(searchQuery) || 
            p.description.toLowerCase().includes(searchQuery)
          );
        }

        setProducts(filteredProds);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [categoryId, location.search]);

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-background-off"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy"></div></div>;

  return (
    <div className="min-h-screen bg-background-off flex flex-col">
      <nav className="bg-brand-navy text-white sticky top-0 z-50 shadow-sm border-b border-white/5 px-6 lg:px-12 h-16 flex justify-between items-center">
        <Link to="/" className="text-xl font-black tracking-widest flex items-center">
          MOTO<span className="text-brand-accent">PARTS</span>
        </Link>
        <Link to="/" className="flex items-center text-xs font-bold uppercase tracking-widest hover:text-brand-accent transition-colors">
          <ChevronLeft size={16} className="mr-1" /> Retour
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="max-w-1440 px-6 lg:px-12 mt-8 w-full mx-auto">
        <div className="relative w-full h-[220px] overflow-hidden rounded-custom shadow-xl border border-black/5">
          <img
            src={category?.imageUrl || "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2672&auto=format&fit=crop"}
            alt="Category"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-navy/60 flex flex-col justify-center items-center text-center p-8">
            <h1 className="text-white text-3xl md:text-5xl font-black max-w-3xl leading-tight tracking-[4px] uppercase">
              {category?.name || "TOUS LES PRODUITS"}
            </h1>
          </div>
        </div>
      </section>

      {/* Search Result Info */}
      {new URLSearchParams(location.search).get('search') && (
        <section className="max-w-1440 px-6 lg:px-12 mt-8 w-full mx-auto">
          <div className="flex items-center justify-between bg-brand-navy-light/50 p-4 rounded-custom border border-brand-navy/5">
            <div className="flex items-center text-brand-navy font-bold text-xs uppercase tracking-widest">
              <Search size={16} className="mr-2 text-brand-accent" />
              Résultats pour : <span className="text-brand-accent ml-2">"{new URLSearchParams(location.search).get('search')}"</span>
              <span className="ml-4 text-gray-400 font-medium">({products.length} produits trouvés)</span>
            </div>
            <button 
              onClick={() => navigate('/products')}
              className="text-[10px] font-black uppercase tracking-widest text-brand-navy hover:text-brand-accent transition-colors underline decoration-brand-accent/30 underline-offset-4"
            >
              Effacer la recherche
            </button>
          </div>
        </section>
      )}

      <section className="max-w-1440 px-6 lg:px-12 mt-6 w-full mx-auto text-center">
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-[10px] font-black uppercase tracking-[3px]">
          {categories.map((cat, idx) => (
            <React.Fragment key={cat.id}>
              <Link 
                to={`/category/${cat.id}`} 
                className={`hover:opacity-70 transition-opacity ${cat.id === categoryId ? 'text-brand-navy' : 'text-brand-accent'}`}
              >
                {cat.name}
              </Link>
              {idx < categories.length - 1 && <span className="text-gray-300">|</span>}
            </React.Fragment>
          ))}
          {categoryId && (
            <>
              <span className="text-gray-300">|</span>
              <Link to="/products" className="text-brand-accent hover:opacity-70">Tous</Link>
            </>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-1440 px-6 lg:px-12 mt-12 mb-20 w-full mx-auto flex-grow">
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-bold tracking-widest uppercase">
            Aucun produit trouvé dans cette catégorie.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="flex flex-col h-full group">
                <div className="h-56 relative overflow-hidden rounded-custom mb-6 bg-white border border-black/5 shadow-sm group-hover:shadow-md transition-all">
                  {product.imageUrl ? (
                    <img src={product.imageUrl || "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?q=70&w=600&fit=crop"} alt={product.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">Sans image</div>
                  )}
                  {product.isOffer && (
                    <div className="absolute top-3 left-3 bg-brand-accent text-white px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm">
                      Offre Spéciale
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-grow px-2">
                  <h3 className="font-black text-sm tracking-[2px] mb-2 uppercase text-brand-navy group-hover:text-brand-accent transition-colors">{product.name}</h3>
                  <p className="text-gray-500 text-[10px] font-medium leading-relaxed mb-6 line-clamp-3 opacity-80">{product.description}</p>
                  <div className="mt-auto flex justify-between items-center pt-4 border-t border-brand-navy/5">
                    <span className="font-black text-brand-accent text-xl tracking-tight">{product.price}</span>
                    <button className="flex items-center text-brand-navy font-black text-[9px] uppercase tracking-widest hover:text-brand-accent group/btn">
                      Détails <ArrowRight size={14} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="bg-brand-navy text-white mt-auto rounded-t-custom w-full">
        <div className="py-6 border-t border-white/5 text-center text-[9px] font-bold uppercase tracking-[3px] opacity-40">
          &copy; {new Date().getFullYear()} MOTOPARTS SA - TOUS DROITS RÉSERVÉS
        </div>
      </footer>
    </div>
  );
}
