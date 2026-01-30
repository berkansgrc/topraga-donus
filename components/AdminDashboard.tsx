import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { ViewState } from '../types';
import {
  LogOut, Plus, Trash2, LayoutDashboard, MapPin,
  Recycle, Loader2, Image as ImageIcon, X, Palette, Database, Copy, Inbox, FlaskConical, Sprout, Ruler, Leaf, Lightbulb, Map
} from 'lucide-react';
import LocationPicker from './LocationPicker';

interface AdminDashboardProps {
  setView: (view: ViewState) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ setView }) => {
  const [activeTab, setActiveTab] = useState<'waste' | 'stations' | 'gallery' | 'suggestions' | 'lab'>('waste');
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState<any[]>([]);
  const [tableError, setTableError] = useState<string | null>(null);

  // Form States
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [file, setFile] = useState<File | null>(null);
  const [showMapPicker, setShowMapPicker] = useState(false);

  useEffect(() => {
    // Tab değiştiğinde listeyi sıfırla ki eski veriler görünmesin
    setListData([]);
    setTableError(null);

    // GÜVENLİK KONTROLÜ: Oturum açık mı?
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setView(ViewState.ADMIN_LOGIN);
        return;
      }
      fetchData();
    };
    checkSession();
  }, [activeTab]);

  const getTableName = () => {
    switch (activeTab) {
      case 'waste': return 'waste_items';
      case 'stations': return 'stations';
      case 'gallery': return 'project_images';
      case 'suggestions': return 'suggestions';
      case 'lab': return 'compost_logs';
      default: return 'waste_items';
    }
  };

  // YARDIMCI: Resim URL'ini farklı sütun isimlerinden yakala
  const getImageUrl = (item: any) => {
    return item.imageUrl || item.imageurl || item.image_url || item.imgUrl || null;
  };

  const fetchData = async () => {
    setLoading(true);
    const tableName = getTableName();

    try {
      const { data, error } = await supabase.from(tableName).select('*').order(activeTab === 'lab' ? 'date' : 'created_at', { ascending: false });

      if (error) {
        // Hata kodlarını kontrol et: 42P01 (Postgres) veya PGRST205 (PostgREST) tablo yok demektir.
        if (error.code === '42P01' || error.code === 'PGRST205') {
          setTableError(tableName);
        } else {
          console.error("Veri çekme hatası:", error);
        }
      } else if (data) {
        setListData(data);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView(ViewState.HOME);
  };

  const uploadImage = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const safeName = `img-${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(safeName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('images').getPublicUrl(safeName);
      return data.publicUrl;
    } catch (error) {
      console.error("Upload Error:", error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu öğeyi silmek istediğinize emin misiniz?')) return;

    const tableName = getTableName();
    await supabase.from(tableName).delete().eq('id', id);
    fetchData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.imageUrl;

      if (file) {
        imageUrl = await uploadImage(file);
      }

      const tableName = getTableName();

      // Default values for dropdowns if not touched
      const finalData = { ...formData };

      if (activeTab === 'gallery' && !finalData.category) finalData.category = 'poster';
      if (activeTab === 'waste') {
        if (!finalData.category) finalData.category = 'green';
        if (finalData.goes_to_soil === undefined) finalData.goes_to_soil = true;
      }
      if (activeTab === 'stations' && !finalData.type) finalData.type = 'recycling_center';
      if (activeTab === 'lab') {
        if (!finalData.experiment_type) finalData.experiment_type = 'normal';
        if (!finalData.date) finalData.date = new Date().toISOString().split('T')[0];
      }

      const payload = { ...finalData, ...(imageUrl && { imageUrl }) };

      if (!payload.id) delete payload.id;

      const { error } = await supabase.from(tableName).insert([payload]);

      if (error) {
        console.error("Insert Error:", error);
        alert('Kayıt eklenirken hata oluştu: ' + error.message);
        throw error;
      }

      setShowModal(false);
      setFormData({});
      setFile(null);
      fetchData();
    } catch (err: any) {
      // Error is handled above
    } finally {
      setLoading(false);
    }
  };

  const copySQL = () => {
    // Tüm tabloları içeren SQL (Lab tablosu güncellendi)
    const sql = `
-- Galeri Tablosu
create table if not exists project_images (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text check (category in ('poster', 'project')),
  "imageUrl" text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Öneriler/Katkılar Tablosu
create table if not exists suggestions (
  id uuid default gen_random_uuid() primary key,
  type text not null, -- 'waste', 'station', 'idea'
  name text,
  description text,
  category text,
  location text,
  sender text,
  "imageUrl" text,
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Deney/Lab Tablosu (GÜNCELLENDİ)
-- Eğer eski tablo varsa önce onu silmeniz önerilir: DROP TABLE compost_logs;
create table if not exists compost_logs (
  id uuid default gen_random_uuid() primary key,
  date date not null,
  experiment_type text check (experiment_type in ('normal', 'compost')) not null,
  plant_height numeric not null,
  leaf_count integer not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Politikaları
alter table project_images enable row level security;
alter table suggestions enable row level security;
alter table compost_logs enable row level security;

-- Herkes okuyabilir / Admin yazabilir
create policy "Public Read All" on project_images for select using (true);
create policy "Admin Write All" on project_images for all to authenticated using (true);

create policy "Public Read Suggestions" on suggestions for select using (true);
create policy "Public Insert Suggestions" on suggestions for insert with check (true);
create policy "Admin Manage Suggestions" on suggestions for all to authenticated using (true);

create policy "Public Read Logs" on compost_logs for select using (true);
create policy "Admin Manage Logs" on compost_logs for all to authenticated using (true);
    `;
    navigator.clipboard.writeText(sql);
    alert('SQL kodları kopyalandı! Supabase SQL Editor\'e yapıştırıp çalıştırın. Eğer eski "compost_logs" tablosu varsa önce onu silin.');
  };

  const renderWasteForm = () => (
    <>
      <div>
        <label className="block text-sm font-semibold mb-1">Atık Adı</label>
        <input
          className="w-full p-2 border rounded-lg"
          value={formData.name || ''}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Kategori</label>
        <select
          className="w-full p-2 border rounded-lg"
          value={formData.category || 'green'}
          onChange={e => setFormData({ ...formData, category: e.target.value })}
        >
          <option value="green">Yeşil (Azot)</option>
          <option value="brown">Kahverengi (Karbon)</option>
          <option value="caution">Dikkat</option>
          <option value="prohibited">Yasaklı</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Toprağa Gider mi?</label>
        <select
          className="w-full p-2 border rounded-lg"
          value={formData.goes_to_soil ? 'true' : 'false'}
          onChange={e => setFormData({ ...formData, goes_to_soil: e.target.value === 'true' })}
        >
          <option value="true">Evet</option>
          <option value="false">Hayır</option>
        </select>
      </div>
    </>
  );

  const renderStationForm = () => (
    <>
      <div>
        <label className="block text-sm font-semibold mb-1">İstasyon Adı</label>
        <input
          className="w-full p-2 border rounded-lg"
          value={formData.name || ''}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Tür</label>
        <select
          className="w-full p-2 border rounded-lg"
          value={formData.type || 'recycling_center'}
          onChange={e => setFormData({ ...formData, type: e.target.value })}
        >
          <option value="recycling_center">Atık Merkezi</option>
          <option value="battery">Pil Kutusu</option>
          <option value="glass">Cam Kumbarası</option>
          <option value="e-waste">E-Atık</option>
          <option value="plastic">Plastik</option>
          <option value="paper">Kağıt</option>
          <option value="metal">Metal</option>
          <option value="oil">Atık Yağ</option>
          <option value="clothing">Tekstil</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-semibold mb-1">Konum</label>
          <button
            type="button"
            onClick={() => setShowMapPicker(true)}
            className="w-full py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg font-bold hover:bg-indigo-100 flex items-center justify-center transition-colors"
          >
            <Map size={18} className="mr-2" /> Haritadan Konum Seç
          </button>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Enlem (Lat)</label>
          <input
            type="number" step="any"
            className="w-full p-2 border rounded-lg bg-gray-50"
            value={formData.lat || ''}
            onChange={e => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
            required
            placeholder="41.000"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Boylam (Lng)</label>
          <input
            type="number" step="any"
            className="w-full p-2 border rounded-lg bg-gray-50"
            value={formData.lng || ''}
            onChange={e => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
            required
            placeholder="28.000"
          />
        </div>
      </div>
    </>
  );

  const renderGalleryForm = () => (
    <>
      <div>
        <label className="block text-sm font-semibold mb-1">Görsel Başlığı</label>
        <input
          className="w-full p-2 border rounded-lg"
          value={formData.title || ''}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Kategori</label>
        <select
          className="w-full p-2 border rounded-lg"
          value={formData.category || 'poster'}
          onChange={e => setFormData({ ...formData, category: e.target.value })}
        >
          <option value="poster">Öğrenci Afişi</option>
          <option value="project">Proje Resmi</option>
        </select>
      </div>
    </>
  );

  const renderLabForm = () => (
    <>
      <div>
        <label className="block text-sm font-semibold mb-1">Ölçüm Tarihi</label>
        <input
          type="date"
          className="w-full p-2 border rounded-lg"
          value={formData.date || new Date().toISOString().split('T')[0]}
          onChange={e => setFormData({ ...formData, date: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Bitki Örneği (Grup)</label>
        <select
          className="w-full p-2 border rounded-lg"
          value={formData.experiment_type || 'normal'}
          onChange={e => setFormData({ ...formData, experiment_type: e.target.value })}
        >
          <option value="normal">Kontrol Grubu (Normal Toprak)</option>
          <option value="compost">Deney Grubu (Kompostlu Toprak)</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Bitki Boyu (cm)</label>
          <div className="relative">
            <input
              type="number" step="0.1"
              className="w-full p-2 border rounded-lg pl-8"
              value={formData.plant_height || ''}
              onChange={e => setFormData({ ...formData, plant_height: parseFloat(e.target.value) })}
              required
              placeholder="0.0"
            />
            <Ruler size={16} className="absolute left-2.5 top-3 text-text-muted" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Yaprak Sayısı</label>
          <div className="relative">
            <input
              type="number"
              className="w-full p-2 border rounded-lg pl-8"
              value={formData.leaf_count || ''}
              onChange={e => setFormData({ ...formData, leaf_count: parseInt(e.target.value) })}
              required
              placeholder="0"
            />
            <Leaf size={16} className="absolute left-2.5 top-3 text-text-muted" />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Gözlem Notları</label>
        <textarea
          className="w-full p-2 border rounded-lg"
          value={formData.notes || ''}
          onChange={e => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Yaprak rengi, gövde kalınlığı vb..."
          rows={2}
        />
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background-base">
      <header className="bg-white border-b border-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary text-white p-1.5 rounded-lg">
              <LayoutDashboard size={20} />
            </div>
            <span className="font-bold text-lg text-text-primary">Yönetim Paneli</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium flex items-center transition-colors"
          >
            <LogOut size={16} className="mr-2" />
            Çıkış Yap
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setActiveTab('waste')}
            className={`px-6 py-3 rounded-card font-bold flex items-center transition-all ${activeTab === 'waste' ? 'bg-primary text-white shadow-card' : 'bg-white text-text-secondary hover:bg-background-subtle'}`}
          >
            <Recycle className="mr-2" size={20} /> Atık Rehberi
          </button>
          <button
            onClick={() => setActiveTab('stations')}
            className={`px-6 py-3 rounded-card font-bold flex items-center transition-all ${activeTab === 'stations' ? 'bg-secondary text-white shadow-card' : 'bg-white text-text-secondary hover:bg-background-subtle'}`}
          >
            <MapPin className="mr-2" size={20} /> İstasyonlar
          </button>
          <button
            onClick={() => setActiveTab('lab')}
            className={`px-6 py-3 rounded-card font-bold flex items-center transition-all ${activeTab === 'lab' ? 'bg-amber-600 text-white shadow-card' : 'bg-white text-text-secondary hover:bg-background-subtle'}`}
          >
            <FlaskConical className="mr-2" size={20} /> Deney / Lab
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-6 py-3 rounded-card font-bold flex items-center transition-all ${activeTab === 'gallery' ? 'bg-purple-600 text-white shadow-card' : 'bg-white text-text-secondary hover:bg-background-subtle'}`}
          >
            <Palette className="mr-2" size={20} /> Galeri
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`px-6 py-3 rounded-card font-bold flex items-center transition-all ${activeTab === 'suggestions' ? 'bg-indigo-600 text-white shadow-card' : 'bg-white text-text-secondary hover:bg-background-subtle'}`}
          >
            <Inbox className="mr-2" size={20} /> Gelen Kutusu
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text-primary">
            {activeTab === 'waste' ? 'Atık Listesi' :
              activeTab === 'stations' ? 'İstasyon Listesi' :
                activeTab === 'lab' ? 'Bitki Deney Verileri' :
                  activeTab === 'suggestions' ? 'Kullanıcı Katkıları' :
                    'Görsel Galerisi'}
          </h2>
          {activeTab !== 'suggestions' && (
            <button
              onClick={() => { setFormData({}); setShowModal(true); }}
              className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-button font-bold flex items-center shadow-soft"
            >
              <Plus size={20} className="mr-2" /> Yeni Ekle
            </button>
          )}
        </div>

        {tableError && (
          <div className="mb-6 p-6 bg-red-50 border border-red-200 rounded-card flex flex-col md:flex-row items-start gap-4 shadow-sm animate-in fade-in slide-in-from-top-4">
            <div className="bg-white p-3 rounded-full text-red-500 shadow-sm shrink-0">
              <Database size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg text-red-800 mb-2">Veritabanı Tablosu Eksik: "{tableError}"</h4>
              <p className="text-red-700 mb-4 leading-relaxed">
                Supabase'de <strong>{tableError}</strong> tablosu bulunamadı.
                Aşağıdaki butona tıklayarak gerekli SQL kodunu kopyalayın ve Supabase SQL Editöründe çalıştırın.
              </p>
              <button
                onClick={copySQL}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold shadow-soft transition-colors"
              >
                <Copy size={16} />
                <span>Tablo Oluşturma Kodunu Kopyala</span>
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-card shadow-card border border-border overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center text-primary"><Loader2 className="animate-spin" size={32} /></div>
          ) : listData.length === 0 && !tableError ? (
            <div className="p-12 text-center text-text-muted">
              {activeTab === 'suggestions'
                ? 'Henüz bir kullanıcı katkısı gelmemiş. "Katkı Yap" sayfasından gönderilenler burada görünür.'
                : 'Kayıt bulunamadı. Lütfen "Yeni Ekle" butonunu kullanarak kayıt oluşturun.'}
            </div>
          ) : listData.length === 0 && tableError ? (
            <div className="p-12 text-center text-red-400">
              Veritabanı tablosu eksik olduğu için liste yüklenemedi.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-background-subtle text-text-secondary border-b border-border">
                  {/* BAŞLIKLARI AYRIŞTIRIYORUZ */}
                  {activeTab === 'lab' ? (
                    <tr>
                      <th className="p-4 font-bold w-32">Tarih</th>
                      <th className="p-4 font-bold">Bitki Grubu</th>
                      <th className="p-4 font-bold">Boy (cm)</th>
                      <th className="p-4 font-bold">Yaprak</th>
                      <th className="p-4 font-bold">Not</th>
                      <th className="p-4 font-bold text-right">İşlemler</th>
                    </tr>
                  ) : activeTab === 'suggestions' ? (
                    <tr>
                      <th className="p-4 font-bold w-24">Tür</th>
                      <th className="p-4 font-bold w-48">Tarih / Gönderen</th>
                      <th className="p-4 font-bold">Detaylar</th>
                      <th className="p-4 font-bold text-right">İşlemler</th>
                    </tr>
                  ) : (
                    <tr>
                      <th className="p-4 font-bold w-24">Görsel</th>
                      <th className="p-4 font-bold">Ad / Başlık</th>
                      <th className="p-4 font-bold">Tür / Kategori</th>
                      <th className="p-4 font-bold text-right">İşlemler</th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {listData.map((item) => {
                    const imgUrl = getImageUrl(item);
                    return (
                      <tr key={item.id} className="border-b border-border hover:bg-background-base transition-colors">

                        {activeTab === 'lab' ? (
                          <>
                            <td className="p-4">{new Date(item.date).toLocaleDateString('tr-TR')}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-md text-sm font-bold border
                                  ${item.experiment_type === 'compost' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}
                                `}>
                                {item.experiment_type === 'compost' ? 'Kompostlu' : 'Normal (Kontrol)'}
                              </span>
                            </td>
                            <td className="p-4 font-medium">{item.plant_height} cm</td>
                            <td className="p-4 font-medium">{item.leaf_count} adet</td>
                            <td className="p-4 text-text-muted text-sm truncate max-w-xs">{item.notes}</td>
                          </>
                        ) : activeTab === 'suggestions' ? (
                          <>
                            {/* 1. SÜTUN: TÜR İKONU */}
                            <td className="p-4 align-top">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center border shadow-sm
                                  ${item.type === 'waste' ? 'bg-green-100 text-green-600 border-green-200' :
                                  item.type === 'station' ? 'bg-amber-100 text-amber-600 border-amber-200' :
                                    'bg-indigo-100 text-indigo-600 border-indigo-200'}
                               `}>
                                {item.type === 'waste' && <Leaf size={20} />}
                                {item.type === 'station' && <MapPin size={20} />}
                                {item.type === 'idea' && <Lightbulb size={20} />}
                              </div>
                            </td>

                            {/* 2. SÜTUN: TARİH VE GÖNDEREN */}
                            <td className="p-4 align-top">
                              <div className="font-bold text-text-primary text-sm">
                                {new Date(item.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                              </div>
                              <div className="text-xs text-text-secondary mt-1 flex items-center">
                                <span className="bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">{item.sender || 'Anonim'}</span>
                              </div>
                            </td>

                            {/* 3. SÜTUN: İÇERİK DETAYLARI + VARSA RESİM */}
                            <td className="p-4 align-top">
                              <div className="space-y-2">
                                {/* Başlık / Konu */}
                                {item.type === 'idea' ? (
                                  <div className="font-medium text-text-primary italic border-l-4 border-indigo-300 pl-3 py-1 bg-indigo-50/50 rounded-r">
                                    "{item.description}"
                                  </div>
                                ) : (
                                  <>
                                    <div className="font-bold text-lg text-text-primary">{item.name}</div>
                                    {item.type === 'station' && item.location && (
                                      <div className="flex items-start space-x-1 text-sm text-text-secondary">
                                        <MapPin size={16} className="mt-0.5 shrink-0 text-amber-600" />
                                        <span>{item.location}</span>
                                      </div>
                                    )}
                                    {item.category && (
                                      <div className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                                        Kategori: {item.category}
                                      </div>
                                    )}
                                    {item.description && (
                                      <p className="text-sm text-text-muted">{item.description}</p>
                                    )}
                                  </>
                                )}

                                {/* EK RESİM VARSA BURADA GÖSTER */}
                                {imgUrl && (
                                  <div className="mt-3">
                                    <span className="text-xs font-bold text-text-muted uppercase mb-1 block">Ekli Görsel:</span>
                                    <a href={imgUrl} target="_blank" rel="noopener noreferrer" className="inline-block group relative">
                                      <img
                                        src={imgUrl}
                                        alt="Katkı görseli"
                                        className="h-24 w-auto rounded-lg border border-border shadow-sm group-hover:opacity-90 transition-opacity"
                                      />
                                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 rounded-lg transition-opacity">
                                        <ImageIcon className="text-white" size={20} />
                                      </div>
                                    </a>
                                  </div>
                                )}
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            {/* DİĞER SEKMELER İÇİN STANDART GÖRÜNÜM */}
                            <td className="p-4 align-top">
                              {imgUrl ? (
                                <img
                                  src={imgUrl}
                                  alt={item.name || item.title}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Hata';
                                  }}
                                  className="w-16 h-16 rounded-lg object-cover shadow-sm border border-border"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-lg bg-background-subtle flex items-center justify-center text-text-muted">
                                  <ImageIcon size={24} />
                                </div>
                              )}
                            </td>
                            <td className="p-4 font-medium text-text-primary align-middle">
                              {activeTab === 'gallery' ? item.title : item.name}
                            </td>
                            <td className="p-4 align-middle">
                              <span className={`px-2 py-1 rounded-md text-sm border border-border font-medium
                                ${item.category === 'poster' ? 'bg-purple-100 text-purple-700' :
                                  item.category === 'project' ? 'bg-blue-100 text-blue-700' : 'bg-background-base'}
                              `}>
                                {activeTab === 'waste' ? item.category :
                                  activeTab === 'stations' ? item.type :
                                    item.category === 'poster' ? 'Afiş' : 'Proje'}
                              </span>
                            </td>
                          </>
                        )}

                        <td className="p-4 text-right align-middle">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                            title="Sil"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-card shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-border flex justify-between items-center bg-background-subtle">
              <h3 className="font-bold text-lg text-text-primary">
                {activeTab === 'gallery' ? 'Yeni Görsel Ekle' :
                  activeTab === 'lab' ? 'Yeni Deney Verisi Ekle' :
                    'Yeni Kayıt Ekle'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-text-primary">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {activeTab === 'waste' ? renderWasteForm() :
                activeTab === 'stations' ? renderStationForm() :
                  activeTab === 'lab' ? renderLabForm() :
                    renderGalleryForm()}

              {activeTab !== 'lab' && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Görsel Yükle (Supabase)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-soft file:text-primary hover:file:bg-primary/20"
                  />
                </div>
              )}

              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-border rounded-button font-bold text-text-secondary hover:bg-background-subtle"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-primary hover:bg-primary-600 text-white rounded-button font-bold shadow-soft flex justify-center items-center"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MAPPICKER MODAL */}
      {showMapPicker && (
        <LocationPicker
          initialLat={formData.lat}
          initialLng={formData.lng}
          onSelect={(lat, lng) => {
            setFormData({ ...formData, lat, lng });
          }}
          onClose={() => setShowMapPicker(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
