import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, 
  Package, 
  Grid, 
  FileText, 
  MessageSquare, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2,
  Save,
  Image as ImageIcon,
  Upload,
  User,
  ExternalLink,
  Check,
  XCircle
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { Product, Category, SectionContent, SiteSettings, ContactMessage, AboutFeature } from '../types';

const FileUpload = ({ onUpload, currentImage }: { onUpload: (base64: string) => void, currentImage?: string }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(currentImage);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onUpload(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <div 
        onClick={() => inputRef.current?.click()}
        className="h-40 w-full rounded-custom overflow-hidden bg-background-off border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-brand-navy transition-all"
      >
        {preview ? (
          <img src={preview} className="w-full h-full object-cover" />
        ) : (
          <>
            <Upload className="text-gray-300 mb-2" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cliquez pour uploader (PC)</span>
          </>
        )}
      </div>
      <input 
        ref={inputRef}
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleFile} 
      />
      {preview && (
        <button onClick={() => { setPreview(''); onUpload(''); }} className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Supprimer l'image</button>
      )}
    </div>
  );
};

const Sidebar = ({ active, setActive }: { active: string, setActive: (s: string) => void }) => {
  const items = [
    { id: 'content', label: 'Contenu', icon: <FileText size={20} /> },
    { id: 'products', label: 'Produits', icon: <Package size={20} /> },
    { id: 'offers', label: 'Offres', icon: <Package size={20} /> },
    { id: 'categories', label: 'Catégories', icon: <Grid size={20} /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare size={20} /> },
    { id: 'settings', label: 'Paramètres', icon: <Settings size={20} /> },
  ];

  return (
    <div className="w-64 bg-brand-navy text-white h-screen fixed left-0 top-0 p-6 flex flex-col">
      <h2 className="text-2xl font-bold mb-12 tracking-tight">ADMIN PANEL</h2>
      <nav className="flex-grow space-y-2">
        {items.map(item => (
          <button 
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`w-full flex items-center space-x-3 p-3 rounded-custom transition-all ${active === item.id ? 'bg-brand-accent' : 'hover:bg-navy-lighter'}`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <button onClick={() => window.location.href = '/'} className="flex items-center space-x-3 p-3 text-red-400 hover:text-red-300 mt-auto">
        <LogOut size={20} />
        <span>Quitter l'Admin</span>
      </button>
    </div>
  );
};

const ContentManager = () => {
  const [sections, setSections] = useState<{id: string, data: SectionContent}[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<Record<string, 'idle' | 'saving' | 'success' | 'error'>>({});

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await window.fetch('/api/content');
        let data = await res.json();
        if (!data.find((d: any) => d.id === 'categories')) {
          data.push({ id: 'categories', title: 'DANS CHAQUE CATÉGORIE', description: 'Découvrez notre vaste sélection de pièces par catégorie.' });
        }
        setSections(data.map((d: any) => ({ id: d.id, data: d })));
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleUpdate = async (id: string, data: Partial<SectionContent>) => {
    setSaveStatus(prev => ({ ...prev, [id]: 'saving' }));
    try {
      await dataService.updateContent(id, data);
      setSaveStatus(prev => ({ ...prev, [id]: 'success' }));
      setTimeout(() => setSaveStatus(prev => ({ ...prev, [id]: 'idle' })), 2000);
    } catch (err) {
      console.error(err);
      setSaveStatus(prev => ({ ...prev, [id]: 'error' }));
      setTimeout(() => setSaveStatus(prev => ({ ...prev, [id]: 'idle' })), 3000);
    }
  };

  const updateFeature = (sectionId: string, featureIndex: number, field: keyof AboutFeature, value: string) => {
    const newSections = [...sections];
    const sIdx = newSections.findIndex(s => s.id === sectionId);
    if (!newSections[sIdx].data.features) newSections[sIdx].data.features = [];
    newSections[sIdx].data.features![featureIndex] = { ...newSections[sIdx].data.features![featureIndex], [field]: value };
    setSections(newSections);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-navy"></div></div>;

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black tracking-widest">ÉDITION DU CATALOGUE & SECTIONS</h1>
      </div>

      {sections.map(section => (
        <div key={section.id} className="bg-white p-8 rounded-custom shadow-sm border border-gray-100 space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h3 className="text-sm font-black uppercase tracking-[3px] text-brand-navy">Section: {section.id}</h3>
            <button 
              onClick={() => handleUpdate(section.id, section.data)} 
              disabled={saveStatus[section.id] === 'saving'}
              className={`flex items-center space-x-2 px-4 py-2 rounded-custom text-[10px] font-black uppercase tracking-widest transition-colors ${
                saveStatus[section.id] === 'success' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 
                saveStatus[section.id] === 'error' ? 'bg-rose-600 text-white hover:bg-rose-700' : 
                'bg-brand-navy text-white hover:bg-brand-navy-light'
              }`}
            >
              {saveStatus[section.id] === 'saving' ? (
                 <>Enregistrement...</>
              ) : saveStatus[section.id] === 'success' ? (
                 <><Check size={14} /> <span>Enregistré</span></>
              ) : saveStatus[section.id] === 'error' ? (
                 <><XCircle size={14} /> <span>Échec</span></>
              ) : (
                 <><Save size={14} /> <span>Enregistrer</span></>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase block mb-2">Titre de la section</label>
                <input 
                  className="w-full p-4 bg-background-off border-none rounded-custom font-bold text-xs outline-none focus:ring-1 ring-brand-navy"
                  value={section.data.title} 
                  onChange={e => {
                    const newSections = [...sections];
                    const idx = newSections.findIndex(s => s.id === section.id);
                    newSections[idx].data.title = e.target.value;
                    setSections(newSections);
                  }}
                />
              </div>
              <div>
                <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase block mb-2">Description</label>
                <textarea 
                  rows={4}
                  className="w-full p-4 bg-background-off border-none rounded-custom font-bold text-xs outline-none focus:ring-1 ring-brand-navy resize-none"
                  value={section.data.description} 
                  onChange={e => {
                    const newSections = [...sections];
                    const idx = newSections.findIndex(s => s.id === section.id);
                    newSections[idx].data.description = e.target.value;
                    setSections(newSections);
                  }}
                />
              </div>

              {section.id === 'about' && (
                <div className="space-y-4 pt-4">
                   <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase block">Caractéristiques (3 Icons)</label>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[0, 1, 2].map(i => {
                        const feature = (section.data.features || [])[i] || { icon: 'CheckCircle', title: '', description: '' };
                        return (
                          <div key={i} className="p-4 bg-background-off rounded-custom space-y-2 border border-gray-100">
                             <input 
                               placeholder="Icon (ShieldCheck, Clock, Settings...)" 
                               className="w-full bg-white p-2 rounded text-[10px] font-black border"
                               value={feature.icon}
                               onChange={(e) => updateFeature(section.id, i, 'icon', e.target.value)}
                             />
                             <input 
                               placeholder="Titre" 
                               className="w-full bg-white p-2 rounded text-[10px] font-black border"
                               value={feature.title}
                               onChange={(e) => updateFeature(section.id, i, 'title', e.target.value)}
                             />
                             <textarea 
                               placeholder="Desc" 
                               className="w-full bg-white p-2 rounded text-[9px] font-bold border h-16"
                               value={feature.description}
                               onChange={(e) => updateFeature(section.id, i, 'description', e.target.value)}
                             />
                          </div>
                        )
                      })}
                   </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase block">Image de la section</label>
              <FileUpload 
                currentImage={section.data.imageUrl}
                onUpload={(base64) => {
                  const newSections = [...sections];
                  const idx = newSections.findIndex(s => s.id === section.id);
                  newSections[idx].data.imageUrl = base64;
                  setSections(newSections);
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ProductManager = ({ filter }: { filter?: 'all' | 'offers' }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const fetch = async () => {
    try {
      const resP = await window.fetch('/api/products');
      let data = await resP.json();
      if (filter === 'offers') {
        data = data.filter((p: any) => p.isOffer);
      }
      setProducts(data);
      
      const resC = await window.fetch('/api/categories');
      const catsData = await resC.json();
      setCategories(catsData);
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => { fetch(); }, [filter]);

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer ce produit ?')) {
      await window.fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetch();
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaveStatus('saving');
    try {
      const { id, ...dataToSave } = editing;
      const cleanData = {
        name: dataToSave.name || '',
        description: dataToSave.description || '',
        price: dataToSave.price || '',
        imageUrl: dataToSave.imageUrl || '',
        isMostNeeded: !!dataToSave.isMostNeeded,
        isOffer: !!dataToSave.isOffer,
        category: dataToSave.category || ''
      };

      if (id) {
        const res = await window.fetch(`/api/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cleanData)
        });
        if (!res.ok) throw new Error('Failed to update');
      } else {
        const res = await window.fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cleanData)
        });
        if (!res.ok) throw new Error('Failed to create');
      }
      setSaveStatus('success');
      setTimeout(() => {
        setSaveStatus('idle');
        setEditing(null);
        fetch();
      }, 1500);
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{filter === 'offers' ? 'Offres' : 'Produits'}</h1>
        <button onClick={() => setEditing({ name: '', description: '', price: '', imageUrl: '', isMostNeeded: false, isOffer: filter === 'offers', category: '' })} className="flex items-center space-x-2 px-4 py-2 bg-brand-accent text-white rounded-custom hover:opacity-90">
          <Plus size={20} />
          <span>Nouveau {filter === 'offers' ? 'Offre' : 'Produit'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white p-4 rounded-custom shadow-sm border border-gray-100">
            <img src={p.imageUrl} className="w-full h-40 object-cover rounded-custom mb-4" />
            <h3 className="font-bold text-lg">{p.name}</h3>
            <p className="text-gray-500 text-sm mb-4 line-clamp-1">{p.description}</p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-brand-accent">{p.price}</span>
              <div className="flex space-x-2">
                <button onClick={() => setEditing(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-custom"><Edit size={18} /></button>
                <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-custom"><Trash2 size={18} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-[100]">
          <div className="bg-white p-8 rounded-custom w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">{editing.id ? 'Modifier' : 'Nouveau'} Produit</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nom du produit</label>
                <input placeholder="Ex: Disque de frein" className="w-full p-3 bg-background-off border-none rounded-custom font-bold text-xs" value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Description</label>
                <textarea rows={3} placeholder="Détails techniques..." className="w-full p-3 bg-background-off border-none rounded-custom font-bold text-xs resize-none" value={editing.description} onChange={e => setEditing({...editing, description: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Prix</label>
                  <input placeholder="Prix (ex: 45 €)" className="w-full p-3 bg-background-off border-none rounded-custom font-bold text-xs" value={editing.price} onChange={e => setEditing({...editing, price: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Catégorie</label>
                   <select className="w-full p-3 bg-background-off border-none rounded-custom font-bold text-xs outline-none" value={editing.category} onChange={e => setEditing({...editing, category: e.target.value})}>
                     <option value="">Sélectionnez une catégorie</option>
                     {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                   </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Image du produit</label>
                <FileUpload 
                  currentImage={editing.imageUrl}
                  onUpload={(base64) => setEditing({...editing, imageUrl: base64})}
                />
              </div>

              <div className="flex space-x-6 p-4 bg-background-off rounded-custom">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded text-brand-navy focus:ring-brand-navy" checked={editing.isOffer} onChange={e => setEditing({...editing, isOffer: e.target.checked})} />
                  <span className="text-[10px] font-black uppercase tracking-widest">En offre</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded text-brand-navy focus:ring-brand-navy" checked={editing.isMostNeeded} onChange={e => setEditing({...editing, isMostNeeded: e.target.checked})} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Le plus demandé</span>
                </label>
              </div>
              
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                <button onClick={() => setEditing(null)} className="px-8 py-3 rounded-custom text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors">Annuler</button>
                <button 
                  onClick={handleSave} 
                  disabled={saveStatus === 'saving'}
                  className={`flex items-center space-x-2 px-8 py-3 rounded-custom text-[10px] font-black uppercase tracking-widest transition-colors ${
                    saveStatus === 'success' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 
                    saveStatus === 'error' ? 'bg-rose-600 text-white hover:bg-rose-700' : 
                    'editorial-btn'
                  }`}
                >
                  {saveStatus === 'saving' ? (
                     <>Enregistrement...</>
                  ) : saveStatus === 'success' ? (
                     <><Check size={14} /> <span>Enregistré</span></>
                  ) : saveStatus === 'error' ? (
                     <><XCircle size={14} /> <span>Échec</span></>
                  ) : (
                     <><Save size={14} /> <span>Enregistrer</span></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ... Similar components for Categories, Messages, and Settings

const MessagesManager = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await window.fetch('/api/messages');
      const data = await res.json();
      setMessages(data);
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-8">Messages Reçus</h1>
      <div className="space-y-4">
        {messages.map(m => (
          <div key={m.id} className="bg-white p-6 rounded-custom shadow-sm border border-gray-100">
            <div className="flex justify-between mb-4">
              <div>
                <h4 className="font-bold text-lg">{m.name}</h4>
                <p className="text-sm text-gray-500">{m.email}</p>
              </div>
              <p className="text-xs text-gray-400">
                {m.createdAt?.toDate ? m.createdAt.toDate().toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <p className="text-gray-700 italic border-l-4 border-brand-accent pl-4 py-1 bg-background-off rounded-r-custom">{m.message}</p>
          </div>
        ))}
        {messages.length === 0 && <p className="text-center text-gray-500 py-12">Aucun message pour le moment.</p>}
      </div>
    </div>
  );
};

const SettingsManager = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetch = async () => {
      const s = await dataService.getSettings();
      setSettings(s || { phone: '', email: '', address: '', facebook: '', instagram: '', twitter: '', mapUrl: '' });
    };
    fetch();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaveStatus('saving');
    try {
      await dataService.updateSettings(settings);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch(err) {
      console.error(err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const seedData = async () => {
    if (!confirm('Voulez-vous charger les données de démonstration ? Cela peut écraser certaines données.')) return;
    
    // Seed Content
    await dataService.updateContent('hero', {
      title: 'PIÈCES CERTIFIÉES D\'ORIGINE',
      description: 'Performance et sécurité pour votre véhicule commercial et particulier.',
      imageUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2672&auto=format&fit=crop'
    });
    await dataService.updateContent('about', {
      title: 'NOTRE EXPERTISE TECHNIQUE',
      description: 'MotoParts s\'appuie sur un réseau mondial pour dénicher les composants les plus rares. Notre logistique automatisée vous garantit une pièce livrée juste à temps.',
      imageUrl: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?q=80&w=2666&auto=format&fit=crop',
      features: [
        { id: '1', icon: 'ShieldCheck', title: 'Qualité Certifiée', description: 'Toutes nos pièces sont testées et garanties d\'origine.' },
        { id: '2', icon: 'Clock', title: 'Service Rapide', description: 'Livraison express en 24/48h sur tout le territoire.' },
        { id: '3', icon: 'Settings', title: 'Support Expert', description: 'Assistance par des techniciens qualifiés 6j/7.' }
      ]
    });
    await dataService.updateContent('parallax', {
      title: 'SERVICE PROFESSIONNEL',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1966&auto=format&fit=crop'
    });
    await dataService.updateContent('categories', {
      title: 'DANS CHAQUE CATÉGORIE',
      description: 'Découvrez notre vaste sélection de pièces par catégorie.'
    });

    // Seed Products
    const products = [
      { name: 'Disques de Frein V3', description: 'Brembo Pro Series', price: '189.00€', imageUrl: 'https://images.unsplash.com/photo-1549438992-03914a1e9447?q=80&w=2000&auto=format&fit=crop', isMostNeeded: true, isOffer: true, category: 'Freinage' },
      { name: 'Kit Distribution Premium', description: 'Kit complet avec pompe à eau', price: '124 €', imageUrl: 'https://images.unsplash.com/photo-1635773054018-20da57329a39?q=80&w=2000&auto=format&fit=crop', isMostNeeded: false, isOffer: true, category: 'Moteur' },
      { name: 'Amortisseurs Gas-Pro', description: 'Kit complet suspension', price: '75 €', imageUrl: 'https://images.unsplash.com/photo-1621259182978-fbf9312269b8?q=80&w=2000&auto=format&fit=crop', isMostNeeded: true, isOffer: false, category: 'Suspension' },
      { name: 'Huile Synthétique 5W30', description: 'Castrol Edge Performance', price: '59.90€', imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=2000&auto=format&fit=crop', isMostNeeded: true, isOffer: false, category: 'Entretien' },
      { name: 'Filtre à Air Sport', description: 'K&N Performances', price: '45.50€', imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=2000&auto=format&fit=crop', isMostNeeded: false, isOffer: true, category: 'Admission' },
      { name: 'Plaquettes de Frein', description: 'EBC YellowStuff', price: '95.00€', imageUrl: 'https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?q=80&w=2000&auto=format&fit=crop', isMostNeeded: true, isOffer: false, category: 'Freinage' },
      { name: 'Bougies NGK Iridium', description: 'Optimisation de combustion', price: '32.00€', imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=2000&auto=format&fit=crop', isMostNeeded: true, isOffer: true, category: 'Moteur' },
    ];

    for (const p of products) {
      await window.fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
    }

    // Seed Categories
    const categories = [
      { name: 'Moteur', slug: 'moteur', imageUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=500&auto=format&fit=crop' },
      { name: 'Freinage', slug: 'freinage', imageUrl: 'https://images.unsplash.com/photo-1549438992-03914a1e9447?q=80&w=500&auto=format&fit=crop' },
      { name: 'Éclairage', slug: 'eclairage', imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=500&auto=format&fit=crop' },
      { name: 'Électronique', slug: 'electronique', imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=500&auto=format&fit=crop' },
    ];

    for (const c of categories) {
      await window.fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(c)
      });
    }

    alert('Données de démonstration chargées !');
    window.location.reload();
  };

  if (!settings) return <div>Chargement...</div>;

  return (
    <div className="max-w-2xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Paramètres du Site</h1>
        <button onClick={seedData} className="px-4 py-2 border border-brand-navy rounded-custom hover:bg-brand-navy hover:text-white transition-all text-xs font-bold">
          INITIALISER DEMO
        </button>
      </div>
      <div className="space-y-6 bg-white p-8 rounded-custom shadow-sm border border-gray-100">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Téléphone</label>
            <input className="w-full p-2 border rounded-custom" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Email de contact</label>
            <input className="w-full p-2 border rounded-custom" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Adresse</label>
            <input className="w-full p-2 border rounded-custom" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Lien Google Maps (Embed URL)</label>
            <input className="w-full p-2 border rounded-custom" value={settings.mapUrl} onChange={e => setSettings({...settings, mapUrl: e.target.value})} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Facebook</label>
              <input className="w-full p-2 border rounded-custom" value={settings.facebook} onChange={e => setSettings({...settings, facebook: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Instagram</label>
              <input className="w-full p-2 border rounded-custom" value={settings.instagram} onChange={e => setSettings({...settings, instagram: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Twitter</label>
              <input className="w-full p-2 border rounded-custom" value={settings.twitter} onChange={e => setSettings({...settings, twitter: e.target.value})} />
            </div>
          </div>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saveStatus === 'saving'}
          className={`w-full py-3 font-bold rounded-custom transition-all flex justify-center items-center space-x-2 ${
            saveStatus === 'success' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 
            saveStatus === 'error' ? 'bg-rose-600 text-white hover:bg-rose-700' : 
            'bg-brand-navy text-white hover:bg-brand-navy-light'
          }`}
        >
          {saveStatus === 'saving' ? (
             <>Enregistrement...</>
          ) : saveStatus === 'success' ? (
             <><Check size={20} /> <span>Enregistré</span></>
          ) : saveStatus === 'error' ? (
             <><XCircle size={20} /> <span>Échec</span></>
          ) : (
             <><Save size={20} /> <span>Enregistrer les modifications</span></>
          )}
        </button>
      </div>
    </div>
  );
};

const CategoriesManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Partial<Category> | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const fetch = async () => {
    const res = await window.fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cette catégorie ?')) {
      await window.fetch(`/api/categories/${id}`, { method: 'DELETE' });
      fetch();
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaveStatus('saving');
    try {
      const { id, ...dataToSave } = editing;
      const cleanData = {
        name: dataToSave.name || '',
        description: dataToSave.description || '',
        imageUrl: dataToSave.imageUrl || '',
        slug: dataToSave.slug || ''
      };

      if (id) {
        const res = await window.fetch(`/api/categories/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cleanData)
        });
        if (!res.ok) throw new Error('Failed to update');
      } else {
        const res = await window.fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cleanData)
        });
        if (!res.ok) throw new Error('Failed to create');
      }
      setSaveStatus('success');
      setTimeout(() => {
        setSaveStatus('idle');
        setEditing(null);
        fetch();
      }, 1500);
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Catégories</h1>
        <button onClick={() => setEditing({ name: '', slug: '', imageUrl: '' })} className="flex items-center space-x-2 px-4 py-2 bg-brand-accent text-white rounded-custom hover:opacity-90">
          <Plus size={20} />
          <span>Nouvelle Catégorie</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map(c => (
          <div key={c.id} className="bg-white p-4 rounded-custom shadow-sm border border-gray-100 flex flex-col">
            <div className="h-24 w-full bg-background-off rounded-custom mb-4 overflow-hidden">
               {c.imageUrl && <img src={c.imageUrl} className="w-full h-full object-cover" />}
            </div>
            <h3 className="font-bold text-lg mb-2">{c.name}</h3>
            <p className="text-xs text-gray-500 mb-4 tracking-widest uppercase">{c.slug}</p>
            <div className="mt-auto flex justify-end space-x-2">
              <button onClick={() => setEditing(c)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-custom"><Edit size={18} /></button>
              <button onClick={() => handleDelete(c.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-custom"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-[100]">
          <div className="bg-white p-8 rounded-custom w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6">{editing.id ? 'Modifier' : 'Nouvelle'} Catégorie</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nom</label>
                <input placeholder="Nom (Ex: Moteur)" className="w-full p-3 bg-background-off border-none rounded-custom font-bold text-xs" value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Slug (URL)</label>
                <input placeholder="slug-category" className="w-full p-3 bg-background-off border-none rounded-custom font-bold text-xs" value={editing.slug} onChange={e => setEditing({...editing, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Description</label>
                <textarea rows={2} placeholder="Description courte..." className="w-full p-3 bg-background-off border-none rounded-custom font-bold text-xs resize-none" value={editing.description} onChange={e => setEditing({...editing, description: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Image de la Catégorie</label>
                <FileUpload 
                  currentImage={editing.imageUrl}
                  onUpload={(base64) => setEditing({...editing, imageUrl: base64})}
                />
              </div>
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                <button onClick={() => setEditing(null)} className="px-8 py-3 rounded-custom text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors">Annuler</button>
                <button 
                  onClick={handleSave} 
                  disabled={saveStatus === 'saving'}
                  className={`flex items-center space-x-2 px-8 py-3 rounded-custom text-[10px] font-black uppercase tracking-widest transition-colors ${
                    saveStatus === 'success' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 
                    saveStatus === 'error' ? 'bg-rose-600 text-white hover:bg-rose-700' : 
                    'editorial-btn'
                  }`}
                >
                  {saveStatus === 'saving' ? (
                     <>Enregistrement...</>
                  ) : saveStatus === 'success' ? (
                     <><Check size={14} /> <span>Enregistré</span></>
                  ) : saveStatus === 'error' ? (
                     <><XCircle size={14} /> <span>Échec</span></>
                  ) : (
                     <><Save size={14} /> <span>Enregistrer</span></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function AdminDashboard() {
  const [active, setActive] = useState('content');

  const renderContent = () => {
    switch (active) {
      case 'content': return <ContentManager />;
      case 'products': return <ProductManager filter="all" />;
      case 'offers': return <ProductManager filter="offers" />;
      case 'categories': return <CategoriesManager />;
      case 'messages': return <MessagesManager />;
      case 'settings': return <SettingsManager />;
      default: return <div>Coming Soon...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background-off pl-64">
      <Sidebar active={active} setActive={setActive} />
      <main className="p-12 pb-24">
        {renderContent()}
      </main>
    </div>
  );
}
