import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  ArrowRight,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Award,
  CheckCircle,
  Truck,
  ShieldCheck,
  Clock,
  Settings,
  Search
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { dataService } from '../services/dataService';
import { Product, Category, SectionContent, SiteSettings } from '../types';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="bg-brand-navy text-white sticky top-0 z-50 shadow-sm border-b border-white/5">
      <div className="max-w-1440 px-6 lg:px-12 h-16 flex justify-between items-center">
        <div className="text-xl font-black tracking-widest flex items-center">
          MOTO<span className="text-brand-accent">PARTS</span>
        </div>

        <div className="hidden md:flex space-x-8 font-bold text-[11px] uppercase tracking-[2px] items-center">
          <a href="#" className="hover:text-brand-accent transition-colors">Accueil</a>
          <a href="#categories" className="hover:text-brand-accent transition-colors">Nos Produits</a>
          <a href="#about" className="hover:text-brand-accent transition-colors">À Propos</a>
          <a href="#contact" className="editorial-btn">Contact</a>
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-brand-navy p-6 flex flex-col space-y-4 border-t border-white/10 uppercase text-xs font-bold tracking-widest"
        >
          <a href="#" onClick={() => setIsOpen(false)}>Accueil</a>
          <a href="#offres" onClick={() => setIsOpen(false)}>Nos Offres</a>
          <a href="#about" onClick={() => setIsOpen(false)}>À Propos</a>
          <a href="#categories" onClick={() => setIsOpen(false)}>Catégories</a>
          <a href="#contact" onClick={() => setIsOpen(false)} className="text-brand-accent">Contact</a>
        </motion.div>
      )}
    </nav>
  );
};

const Hero = ({ content }: { content: SectionContent | null }) => (
  <section className="max-w-1440 px-6 lg:px-12 mt-6 lg:mt-12">
    <div className="relative w-full h-[320px] overflow-hidden rounded-custom shadow-xl border border-black/5">
      <img
        src={content?.imageUrl || "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=70&w=1200&fit=crop"}
        alt="Hero image"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-brand-navy/60 flex flex-col justify-center items-center text-center p-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white text-3xl md:text-5xl font-black max-w-3xl leading-tight tracking-[4px]"
        >
          {content?.title || "PIÈCES CERTIFIÉES D'ORIGINE"}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/80 text-xs md:text-sm font-bold mt-4 uppercase tracking-[3px]"
        >
          {content?.description || "Performance et sécurité pour votre véhicule"}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <a href="#categories" className="editorial-btn px-10 py-4 tracking-[3px]">
            Explorer nos produits
          </a>
        </motion.div>
      </div>
    </div>
  </section>
);

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="max-w-1440 px-6 lg:px-12 mt-8">
      <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto group">
        <input
          type="text"
          placeholder="RECHERCHER UNE PIÈCE (EX: FILTRE, DISQUE...)"
          className="w-full h-14 pl-14 pr-32 bg-white border border-black/5 rounded-custom shadow-sm outline-none font-bold text-[10px] tracking-widest uppercase focus:ring-1 ring-brand-accent transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-accent transition-colors" size={20} />
        <button
          type="submit"
          className="absolute right-2 top-2 bottom-2 bg-brand-navy text-white px-6 rounded-custom text-[10px] font-black uppercase tracking-widest hover:bg-brand-accent transition-all active:scale-95"
        >
          Rechercher
        </button>
      </form>
    </div>
  );
};

const ProductCarousel = ({ title, description, products }: { title: string, description: string, products: Product[] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps'
  });

  const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      const timer = setInterval(() => {
        if (emblaApi.canScrollNext()) {
          emblaApi.scrollNext();
        } else {
          emblaApi.scrollTo(0);
        }
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [emblaApi]);

  return (
    <section id="offres" className="max-w-1440 px-6 lg:px-12 mt-40">
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-2xl font-black text-brand-navy tracking-widest text-center">{title}</h2>
        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-2">{description}</p>
      </div>

      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {products.map((product) => (
            <div key={product.id} className="embla__slide pr-4 w-full md:w-1/2 lg:w-1/3">
              <div className="relative h-48 overflow-hidden rounded-custom shadow-lg group border border-black/5">
            <img src={product.imageUrl || "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?q=70&w=600&fit=crop"} loading="lazy" alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-brand-navy/40 group-hover:bg-brand-navy/60 transition-colors flex flex-col items-center justify-center p-6 text-center">
                  <div className="mb-2 bg-brand-accent text-white px-3 py-1 text-[9px] font-black uppercase tracking-[2px] rounded-full">
                    Offre Spéciale
                  </div>
                  <h3 className="text-white font-black text-sm md:text-base tracking-[3px] uppercase leading-tight">
                    {product.name}
                  </h3>
                  <div className="mt-4 font-black text-brand-accent text-lg tracking-widest">
                    {product.price}
                  </div>
                  <button className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-[9px] uppercase tracking-widest rounded-custom backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                    Découvrir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutUs = ({ content }: { content: SectionContent | null }) => {
  // Hardcoded features for UI if not in DB yet
  const defaultFeatures = [
    { id: '1', icon: 'ShieldCheck', title: 'Qualité Certifiée', description: 'Toutes nos pièces sont testées et garanties d\'origine.' },
    { id: '2', icon: 'Clock', title: 'Service Rapide', description: 'Livraison express en 24/48h sur tout le territoire.' },
    { id: '3', icon: 'Settings', title: 'Expertise Technique', description: 'Un support technique dédié pour vos montages complexes.' }
  ];

  const features = content?.features || defaultFeatures;

  return (
    <section id="about" className="max-w-1440 px-6 lg:px-12 mt-40">
      <div className="flex flex-col md:flex-row items-stretch gap-12">
        <div className="md:w-1/2 flex flex-col justify-center py-4">
          <h2 className="text-2xl font-black leading-tight mb-4 border-l-4 border-brand-accent pl-6">{content?.title || "À PROPOS DE NOUS"}</h2>
          <p className="text-gray-600 text-sm leading-[1.8] font-medium mt-8">
            {content?.description || "Depuis plus de 20 ans, nous sommes le partenaire de confiance des professionnels et particuliers pour l'approvisionnement en pièces détachées. Notre expertise nous permet de vous proposer uniquement le meilleur pour votre sécurité et performance."}
          </p>
        </div>
        <div className="md:w-1/2 flex gap-6 md:py-4">
          <div className="w-2/3 bg-brand-navy-light rounded-custom overflow-hidden border border-black/5 shadow-inner">
            <img src={content?.imageUrl || "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?q=70&w=1000&fit=crop"} alt="About" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>

          <div className="w-1/3 flex flex-col justify-between py-2">
            {features.map((feature: any) => (
              <div key={feature.id} className="flex flex-col items-center text-center group hover:-translate-y-1 transition-transform">
                <div className="mb-2 group-hover:scale-110 transition-transform">
                  {feature.icon === 'ShieldCheck' && <ShieldCheck size={28} className="text-brand-accent" />}
                  {feature.icon === 'Clock' && <Clock size={28} className="text-brand-accent" />}
                  {feature.icon === 'Settings' && <Settings size={28} className="text-brand-accent" />}
                  {feature.icon === 'Award' && <Award size={28} className="text-brand-accent" />}
                  {feature.icon === 'Truck' && <Truck size={28} className="text-brand-accent" />}
                  {!['ShieldCheck', 'Clock', 'Settings', 'Award', 'Truck'].includes(feature.icon) && <CheckCircle size={28} className="text-brand-accent" />}
                </div>
                <h4 className="font-black text-[9px] tracking-widest mb-1 uppercase">{feature.title}</h4>
                <p className="text-gray-500 text-[8px] font-bold uppercase tracking-wider leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Categories = ({ categories, content }: { categories: Category[], content: SectionContent | null }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
    dragFree: true,
    loop: true
  });

  const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <section id="categories" className="max-w-1440 px-6 lg:px-12 mt-40">
      <div className="flex flex-col mb-12 items-center text-center">
        <h2 className="text-2xl font-black text-brand-navy tracking-widest uppercase">{content?.title || "DANS CHAQUE CATÉGORIE"}</h2>
        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-2 max-w-2xl">{content?.description || "Découvrez notre vaste sélection de pièces par catégorie."}</p>
      </div>

      <div className="relative group/carousel">
        <div
          className="embla overflow-hidden lg:mask-fade"
          ref={emblaRef}
        >
          <div className="embla__container flex px-6 lg:px-0">
            {categories.map((category) => (
              <div key={category.id} className="embla__slide w-[320px] min-w-[320px] flex-shrink-0 pr-6">
                <Link
                  to={`/category/${category.id}`}
                  className="group flex flex-col"
                >
                  <div className="relative h-40 w-full overflow-hidden rounded-custom shadow-lg border border-black/5 bg-white mb-4">
                    {category.imageUrl && (
                      <img 
                        src={`${category.imageUrl}${category.imageUrl.includes('?') ? '' : '?q=70&w=400&fit=crop'}`} 
                        loading="lazy" 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-brand-navy font-black text-xs tracking-[2px] uppercase mb-1 group-hover:text-brand-accent transition-colors">{category.name}</h3>
                    <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest line-clamp-2">
                      {category.description || "Découvrez notre gamme de pièces haute performance."}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows - Desktop Only */}
        {categories.length > 4 && (
          <div className="hidden lg:block">
            <button
              onClick={scrollPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2.5 rounded-full shadow-xl border border-gray-100 text-brand-navy hover:bg-brand-navy hover:text-white transition-all z-20 opacity-0 group-hover/carousel:opacity-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2.5 rounded-full shadow-xl border border-gray-100 text-brand-navy hover:bg-brand-navy hover:text-white transition-all z-20 opacity-0 group-hover/carousel:opacity-100"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

const ParallaxSection = ({ content }: { content: SectionContent | null }) => (
  <section className="mt-40 h-20 parallax-bg relative" style={{ backgroundImage: `url(${content?.imageUrl || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=70&w=1200&fit=crop'})` }}>
    <div className="absolute inset-0 bg-brand-navy/60 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-white text-xs font-black tracking-[8px] uppercase">{content?.title || "SERVICE PROFESSIONNEL"}</h2>
      </div>
    </div>
  </section>
);

const MostNeeded = ({ products }: { products: Product[] }) => (
  <section className="max-w-1440 px-6 lg:px-12 mt-40">
    <h2 className="text-2xl font-black mb-10 tracking-widest">Produits les plus demandés</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="flex gap-4 items-center bg-white p-4 rounded-custom border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-custom overflow-hidden">
            <img src={`${product.imageUrl}${product.imageUrl.includes('?') ? '' : '?q=70&w=200&fit=crop'}`} loading="lazy" alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-grow">
            <h3 className="font-black text-brand-navy text-xs tracking-widest uppercase group-hover:text-brand-accent transition-colors">{product.name}</h3>
            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Premium quality</p>
            <div className="mt-2 text-sm font-black text-brand-accent">{product.price}</div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const Contact = ({ settings }: { settings: SiteSettings | null }) => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dataService.sendMessage(form);
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <section id="contact" className="max-w-1440 px-6 lg:px-12 mt-40 mb-12">
      <h2 className="text-2xl font-black leading-tight mb-8 border-l-4 border-brand-accent pl-6 uppercase">Où nous trouver ?</h2>
      <div className="bg-white rounded-custom border border-gray-100 shadow-2xl overflow-hidden flex flex-col">
        {/* Header Strip */}
        <div className="bg-brand-navy text-white px-6 py-4 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-[2px]">
          <div className="flex items-center space-x-6">
            <span className="flex items-center"><Phone size={12} className="mr-2 text-brand-accent" /> {settings?.phone || "+33 1 45 67 89 00"}</span>
            <span className="flex items-center"><Mail size={12} className="mr-2 text-brand-accent" /> {settings?.email || "contact@motoparts.fr"}</span>
          </div>
          <div className="flex items-center space-x-4 mt-2 md:mt-0 opacity-70">
            <Facebook size={12} /> <Instagram size={12} /> <Twitter size={12} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row h-auto md:h-[400px]">
          {/* Map Section */}
          <div className="w-full md:w-[350px] bg-gray-100 flex shrink-0">
            <iframe
              src={settings?.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d167998.1080337305!2d2.2069770643680578!3d48.858774103123785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e1f06e2b70f%3A0x40b82c3688c9460!2sParis!5e0!3m2!1sen!2sfr!4v1715000000000!5m2!1sen!2sfr"}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale contrast-125"
            />
          </div>

          {/* Form Section */}
          <div className="flex-grow p-8 flex flex-col justify-center">
            <h3 className="text-xl font-black mb-6 tracking-widest border-l-4 border-brand-accent pl-4">ENVOYEZ UN MESSAGE</h3>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="NOM COMPLET"
                className="w-full p-3 bg-background-off border-none outline-none font-bold text-[10px] tracking-widest uppercase focus:bg-white focus:ring-1 ring-brand-navy transition-all"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="VOTRE EMAIL"
                className="w-full p-3 bg-background-off border-none outline-none font-bold text-[10px] tracking-widest uppercase focus:bg-white focus:ring-1 ring-brand-navy transition-all"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
              <textarea
                rows={3}
                placeholder="MESSAGE..."
                className="w-full md:col-span-2 p-3 bg-background-off border-none outline-none font-bold text-[10px] tracking-widest uppercase resize-none focus:bg-white focus:ring-1 ring-brand-navy transition-all"
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                required
              />
              <button className="md:col-span-2 editorial-btn py-4 tracking-[4px]">
                {sent ? "TRANSMIS AVEC SUCCÈS" : "ENVOYER LA DEMANDE"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = ({ settings }: { settings: SiteSettings | null }) => (
  <footer className="bg-brand-navy text-white mt-40 rounded-t-custom w-full">
    <div className="max-w-1440 px-6 lg:px-12 py-12 grid grid-cols-1 md:grid-cols-4 gap-12 mx-auto">
      <div className="space-y-4">
        <h3 className="text-lg font-black tracking-widest flex items-center">
          MOTO<span className="text-brand-accent">PARTS</span>
        </h3>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Expert en pièces détachées automobiles de haute qualité pour toutes les marques européennes.</p>
        <div className="flex space-x-6 opacity-50">
          <Facebook size={16} /> <Instagram size={16} /> <Twitter size={16} />
        </div>
      </div>
      <div>
        <h4 className="text-[10px] font-black tracking-widest uppercase mb-6 text-brand-accent">Menu</h4>
        <ul className="space-y-3 text-[10px] font-bold uppercase tracking-widest">
          <li><a href="#" className="hover:text-brand-accent transition-colors">Accueil</a></li>
          <li><a href="#offres" className="hover:text-brand-accent transition-colors">Nos Offres</a></li>
          <li><a href="#about" className="hover:text-brand-accent transition-colors">Notre expertise</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-[10px] font-black tracking-widest uppercase mb-6 text-brand-accent">Client</h4>
        <ul className="space-y-3 text-[10px] font-bold uppercase tracking-widest">
          <li><a href="#" className="hover:text-brand-accent transition-colors">Livraison</a></li>
          <li><a href="#" className="hover:text-brand-accent transition-colors">Garanties</a></li>
          <li><a href="#" className="hover:text-brand-accent transition-colors">FAQ</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-[10px] font-black tracking-widest uppercase mb-6 text-brand-accent">Newsletter</h4>
        <div className="flex border-b border-white/20 pb-2">
          <input type="email" placeholder="VOTRE EMAIL" className="bg-transparent text-[10px] font-bold uppercase tracking-widest flex-grow outline-none" />
          <button className="text-brand-accent"><ArrowRight size={16} /></button>
        </div>
      </div>
    </div>
    <div className="py-6 border-t border-white/5 text-center text-[9px] font-bold uppercase tracking-[3px] opacity-40">
      &copy; {new Date().getFullYear()} MOTOPARTS SA - TOUS DROITS RÉSERVÉS
    </div>
  </footer>
);

export default function LandingPage() {
  const [heroContent, setHeroContent] = useState<SectionContent | null>(null);
  const [aboutContent, setAboutContent] = useState<SectionContent | null>(null);
  const [parallaxContent, setParallaxContent] = useState<SectionContent | null>(null);
  const [categoriesContent, setCategoriesContent] = useState<SectionContent | null>(null);
  const [offers, setOffers] = useState<Product[]>([]);
  const [mostNeeded, setMostNeeded] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Try to load from cache first for instant feel
      const cached = localStorage.getItem('egap_home_data');
      if (cached) {
        try {
          const p = JSON.parse(cached);
          setHeroContent(p.heroContent);
          setAboutContent(p.aboutContent);
          setParallaxContent(p.parallaxContent);
          setCategoriesContent(p.categoriesContent);
          setOffers(p.offers || []);
          setMostNeeded(p.mostNeeded || []);
          setCategories(p.categories || []);
          setSettings(p.settings);
          setLoading(false); // UI is now ready from cache
        } catch (e) {
          console.error("Cache error", e);
        }
      }

      try {
        const [h, a, p, catContent, o, m, c, s] = await Promise.all([
          dataService.getContent('hero'),
          dataService.getContent('about'),
          dataService.getContent('parallax'),
          dataService.getContent('categories'),
          dataService.getOffers(),
          dataService.getMostNeeded(),
          dataService.getCategories(),
          dataService.getSettings()
        ]);
        setHeroContent(h);
        setAboutContent(a);
        setParallaxContent(p);
        setCategoriesContent(catContent);
        setOffers(o);
        setMostNeeded(m);
        setCategories(c);
        setSettings(s);

        // Save to cache for next time
        localStorage.setItem('egap_home_data', JSON.stringify({
          heroContent: h,
          aboutContent: a,
          parallaxContent: p,
          categoriesContent: catContent,
          offers: o,
          mostNeeded: m,
          categories: c,
          settings: s
        }));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-background-off"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy"></div></div>;

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero content={heroContent} />
      <SearchBar />
      <ProductCarousel
        title="Nos offres du moment"
        description="Les meilleures opportunités pour votre maintenance."
        products={offers}
      />
      <AboutUs content={aboutContent} />
      <Categories categories={categories} content={categoriesContent} />
      <ParallaxSection content={parallaxContent} />
      <MostNeeded products={mostNeeded} />
      <Contact settings={settings} />
      <Footer settings={settings} />
    </div>
  );
}
