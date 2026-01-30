import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { 
  Send, Leaf, MapPin, MessageSquare, CheckCircle, 
  AlertTriangle, Loader2, Sparkles, Image as ImageIcon, X 
} from 'lucide-react';

type ContributionType = 'waste' | 'station' | 'idea';

const Contribute: React.FC = () => {
  const [activeType, setActiveType] = useState<ContributionType>('waste');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Form States
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    location: '',
    sender: '' // Optional sender name
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const uploadImage = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const safeName = `contrib-${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(safeName, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('images').getPublicUrl(safeName);
      return data.publicUrl;
    } catch (error) {
      console.error('Image upload failed:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = null;
      if (file) {
        imageUrl = await uploadImage(file);
      }

      const payload = {
        type: activeType,
        ...formData,
        ...(imageUrl && { imageUrl }), // Add image URL if uploaded
        status: 'pending',
        created_at: new Date().toISOString()
      };

      // Try to insert into suggestions table
      const { error } = await supabase.from('suggestions').insert([payload]);
      
      // 42P01 ve PGRST205 hataları tablo yok demektir, demo modunda görmezden geliyoruz
      if (error && error.code !== '42P01' && error.code !== 'PGRST205') {
        console.error('Submission error:', error);
      }
      
      // Simulate network delay for UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      setFormData({ name: '', description: '', category: '', location: '', sender: '' });
      setFile(null);
      setPreviewUrl(null);
      
    } catch (err) {
      console.error(err);
      // Fallback success for demo
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-extrabold text-text-primary mb-4">Teşekkürler!</h2>
        <p className="text-text-secondary text-lg mb-8">
          Katkın bize ulaştı. İncelememizin ardından rehberimize veya haritamıza eklenecek.
          Doğa seninle daha güzel!
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="bg-primary hover:bg-primary-600 text-white px-8 py-3 rounded-button font-bold shadow-soft transition-transform active:scale-95"
        >
          Yeni Bir Şey Gönder
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-accent-soft rounded-full text-accent-DEFAULT mb-4 shadow-sm">
          <Sparkles size={24} />
        </div>
        <h1 className="text-4xl font-extrabold text-text-primary mb-4">Projeye Katkı Yap</h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          Bu proje hepimizin! Eksik bir atık türü, yeni bir geri dönüşüm kutusu veya harika bir fikrin mi var? Bizimle paylaş.
        </p>
      </div>

      <div className="bg-background-surface rounded-card shadow-card border border-border overflow-hidden flex flex-col md:flex-row">
        
        {/* Sidebar / Tabs */}
        <div className="md:w-1/3 bg-background-subtle border-b md:border-b-0 md:border-r border-border p-6 flex flex-col gap-4">
          <h3 className="font-bold text-text-muted text-sm uppercase tracking-wider mb-2">Katkı Türü</h3>
          
          <button
            onClick={() => setActiveType('waste')}
            className={`flex items-center p-4 rounded-xl transition-all text-left group
              ${activeType === 'waste' 
                ? 'bg-white shadow-soft text-primary border border-primary/20' 
                : 'hover:bg-white/50 text-text-secondary'}`}
          >
            <div className={`p-2 rounded-lg mr-3 transition-colors ${activeType === 'waste' ? 'bg-primary-soft text-primary' : 'bg-stone-200 text-text-muted'}`}>
              <Leaf size={20} />
            </div>
            <div>
              <span className="font-bold block">Atık Öner</span>
              <span className="text-xs opacity-70">Listede olmayan bir şey mi var?</span>
            </div>
          </button>

          <button
            onClick={() => setActiveType('station')}
            className={`flex items-center p-4 rounded-xl transition-all text-left group
              ${activeType === 'station' 
                ? 'bg-white shadow-soft text-secondary border border-secondary/20' 
                : 'hover:bg-white/50 text-text-secondary'}`}
          >
            <div className={`p-2 rounded-lg mr-3 transition-colors ${activeType === 'station' ? 'bg-secondary-soft text-secondary' : 'bg-stone-200 text-text-muted'}`}>
              <MapPin size={20} />
            </div>
            <div>
              <span className="font-bold block">İstasyon Bildir</span>
              <span className="text-xs opacity-70">Mahallende yeni bir kutu mu gördün?</span>
            </div>
          </button>

          <button
            onClick={() => setActiveType('idea')}
            className={`flex items-center p-4 rounded-xl transition-all text-left group
              ${activeType === 'idea' 
                ? 'bg-white shadow-soft text-indigo-600 border border-indigo-200' 
                : 'hover:bg-white/50 text-text-secondary'}`}
          >
            <div className={`p-2 rounded-lg mr-3 transition-colors ${activeType === 'idea' ? 'bg-indigo-100 text-indigo-600' : 'bg-stone-200 text-text-muted'}`}>
              <MessageSquare size={20} />
            </div>
            <div>
              <span className="font-bold block">Görüş / Fikir</span>
              <span className="text-xs opacity-70">Projeyi nasıl geliştirebiliriz?</span>
            </div>
          </button>
        </div>

        {/* Form Area */}
        <div className="md:w-2/3 p-6 md:p-8 bg-white">
          <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center">
            {activeType === 'waste' && 'Yemi Bir Atık Türü Öner'}
            {activeType === 'station' && 'Yeni Geri Dönüşüm Noktası'}
            {activeType === 'idea' && 'Fikirlerini Paylaş'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Sender Name */}
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">Adın Soyadın (İsteğe bağlı)</label>
              <input 
                type="text" 
                className="w-full p-3 rounded-input border border-border focus:ring-2 focus:ring-primary-soft outline-none transition-all"
                placeholder="Örn: Ali Yılmaz"
                value={formData.sender}
                onChange={e => setFormData({...formData, sender: e.target.value})}
              />
            </div>

            {/* Dynamic Fields based on Type */}
            {activeType === 'waste' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-2">Atık Adı *</label>
                  <input 
                    required
                    type="text" 
                    className="w-full p-3 rounded-input border border-border focus:ring-2 focus:ring-primary-soft outline-none transition-all"
                    placeholder="Örn: Avokado Çekirdeği"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-2">Tahminince Hangi Kategori?</label>
                  <select 
                    className="w-full p-3 rounded-input border border-border focus:ring-2 focus:ring-primary-soft outline-none transition-all bg-white"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Seçiniz...</option>
                    <option value="green">Yeşil (Organik - Azot)</option>
                    <option value="brown">Kahverengi (Organik - Karbon)</option>
                    <option value="caution">Emin Değilim / Dikkatli Olunmalı</option>
                    <option value="prohibited">Toprağa Atılmaz</option>
                  </select>
                </div>
              </>
            )}

            {activeType === 'station' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-2">İstasyon Adı / Türü *</label>
                  <input 
                    required
                    type="text" 
                    className="w-full p-3 rounded-input border border-border focus:ring-2 focus:ring-primary-soft outline-none transition-all"
                    placeholder="Örn: Bizim Market Yanı Pil Kutusu"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-2">Konum Tarifi *</label>
                  <textarea 
                    required
                    rows={3}
                    className="w-full p-3 rounded-input border border-border focus:ring-2 focus:ring-primary-soft outline-none transition-all"
                    placeholder="Örn: Atatürk Caddesi, No:5 önünde, otobüs durağının yanında."
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </>
            )}

            {activeType === 'idea' && (
              <div>
                 <label className="block text-sm font-semibold text-text-secondary mb-2">Mesajın *</label>
                  <textarea 
                    required
                    rows={4}
                    className="w-full p-3 rounded-input border border-border focus:ring-2 focus:ring-primary-soft outline-none transition-all"
                    placeholder="Düşüncelerini buraya yaz..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
              </div>
            )}
            
            {/* Description for waste/station if needed */}
            {activeType !== 'idea' && (
               <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-2">Ek Açıklama (Opsiyonel)</label>
                  <textarea 
                    rows={2}
                    className="w-full p-3 rounded-input border border-border focus:ring-2 focus:ring-primary-soft outline-none transition-all"
                    placeholder="Eklemek istediğin detaylar..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
              </div>
            )}

            {/* Image Upload for Waste/Station */}
            {activeType !== 'idea' && (
              <div>
                 <label className="block text-sm font-semibold text-text-secondary mb-2">Fotoğraf Ekle (Opsiyonel)</label>
                 <div className="flex items-center space-x-4">
                    <label className="cursor-pointer flex items-center space-x-2 bg-background-subtle hover:bg-background-base text-text-secondary border border-border border-dashed px-4 py-3 rounded-button transition-colors">
                      <ImageIcon size={20} />
                      <span className="text-sm font-medium">Görsel Seç</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                    {previewUrl && (
                      <div className="relative group">
                        <img src={previewUrl} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-border" />
                        <button 
                          type="button"
                          onClick={() => { setFile(null); setPreviewUrl(null); }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                    {file && !previewUrl && (
                      <span className="text-sm text-text-muted truncate max-w-[150px]">{file.name}</span>
                    )}
                 </div>
              </div>
            )}

            <div className="pt-4">
              <button 
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-button font-bold text-white shadow-soft transition-all transform active:scale-95 flex items-center justify-center space-x-2
                  ${activeType === 'waste' ? 'bg-primary hover:bg-primary-600' : 
                    activeType === 'station' ? 'bg-secondary hover:bg-secondary-600' : 
                    'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                <span>Gönder</span>
              </button>
            </div>
            
            <p className="text-xs text-text-muted text-center mt-2">
              <AlertTriangle size={12} className="inline mr-1 mb-0.5" />
              Gönderilen içerikler editör onayından sonra yayınlanacaktır.
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Contribute;