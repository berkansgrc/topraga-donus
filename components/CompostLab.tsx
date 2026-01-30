import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CompostLog } from '../types';
import { FlaskConical, Database, Copy, AlertCircle, Sprout, Ruler, Leaf, Info, Loader2 } from 'lucide-react';

const CompostLab: React.FC = () => {
  const [logs, setLogs] = useState<CompostLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableError, setTableError] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('compost_logs')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        if (error.code === '42P01' || error.code === 'PGRST205') {
          setTableError(true);
        } else {
          console.error('Veri çekme hatası:', error);
        }
      } else if (data) {
        setLogs(data);
        processChartData(data);
      }
    } catch (err) {
      console.error('Beklenmeyen hata:', err);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (data: CompostLog[]) => {
    // Verileri tarihe göre grupla ve her tarih için normal/kompost değerlerini eşleştir
    const grouped: Record<string, any> = {};

    data.forEach(log => {
      if (!grouped[log.date]) {
        grouped[log.date] = { date: log.date };
      }
      
      if (log.experiment_type === 'normal') {
        grouped[log.date].normalHeight = log.plant_height;
        grouped[log.date].normalLeaves = log.leaf_count;
      } else {
        grouped[log.date].compostHeight = log.plant_height;
        grouped[log.date].compostLeaves = log.leaf_count;
      }
    });

    // Object to Array, sort by date
    const processed = Object.values(grouped).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    setChartData(processed);
  };

  const copySQL = () => {
    const sql = `
-- Deney/Lab Tablosu (GÜNCELLENMİŞ)
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

alter table compost_logs enable row level security;
create policy "Public Read Logs" on compost_logs for select using (true);
create policy "Admin Manage Logs" on compost_logs for all to authenticated using (true);
    `;
    navigator.clipboard.writeText(sql);
    alert('SQL kodu kopyalandı! Supabase SQL Editor\'e yapıştırıp çalıştırın.');
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <div className="mb-10">
        <div className="flex items-center space-x-3 mb-4">
           <div className="bg-amber-100 p-2.5 rounded-xl text-amber-700">
             <FlaskConical size={32} />
           </div>
           <div>
              <h2 className="text-3xl font-extrabold text-text-primary">Bitki Gelişim Laboratuvarı</h2>
              <p className="text-text-secondary">
                Kontrol grubu (Normal Toprak) ile Deney grubu (Kompostlu Toprak) arasındaki farkı bilimsel verilerle inceliyoruz.
              </p>
           </div>
        </div>
      </div>

      {tableError && (
        <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-card flex flex-col md:flex-row items-start gap-4 shadow-sm">
           <div className="bg-white p-3 rounded-full text-red-500 shadow-sm shrink-0">
              <Database size={24} />
           </div>
           <div className="flex-1">
              <h4 className="font-bold text-lg text-red-800 mb-2">Veri Tablosu Eksik veya Eski</h4>
              <p className="text-red-700 mb-4 leading-relaxed">
                 Lab deneyi formatı değiştirildi. Yeni veri yapısını oluşturmak için SQL kodunu çalıştırın.
                 (Eski 'compost_logs' tablosunu silmeniz gerekebilir).
              </p>
              <button onClick={copySQL} className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold shadow-soft">
                <Copy size={16} /> <span>SQL Kodunu Kopyala</span>
              </button>
           </div>
        </div>
      )}

      {/* Hipotez Kartları */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-card border border-border shadow-soft flex items-start space-x-4 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-24 h-24 bg-gray-100 rounded-full -mr-8 -mt-8 opacity-50"></div>
           <div className="bg-gray-100 p-3 rounded-full text-gray-600 relative z-10">
             <Sprout size={24} />
           </div>
           <div className="relative z-10">
             <h3 className="font-bold text-lg text-gray-800 mb-1">Kontrol Grubu (A)</h3>
             <p className="text-sm text-gray-600">Sıradan bahçe toprağına ekilen bitki. Hiçbir ek besin verilmemiştir.</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-card border border-green-200 shadow-soft flex items-start space-x-4 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-24 h-24 bg-green-100 rounded-full -mr-8 -mt-8 opacity-50"></div>
           <div className="bg-green-100 p-3 rounded-full text-green-700 relative z-10">
             <Sprout size={24} />
           </div>
           <div className="relative z-10">
             <h3 className="font-bold text-lg text-green-800 mb-1">Deney Grubu (B)</h3>
             <p className="text-sm text-green-700">Evsel atıklardan ürettiğimiz kompost ile zenginleştirilmiş toprağa ekilen bitki.</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* GRAFİK 1: BOY UZAMASI */}
        <div className="bg-white p-6 rounded-card shadow-card border border-border">
          <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center">
             <Ruler className="mr-2 text-blue-500" size={20} />
             Bitki Boyu Karşılaştırması (cm)
          </h3>
          <div className="h-72 w-full">
             {loading ? <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div> : (
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={chartData}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                   <XAxis dataKey="date" tickFormatter={formatDate} stroke="#888" fontSize={12} />
                   <YAxis stroke="#888" fontSize={12} unit=" cm" />
                   <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      labelFormatter={(label) => new Date(label).toLocaleDateString('tr-TR')}
                   />
                   <Legend />
                   <Line type="monotone" dataKey="normalHeight" name="Normal Toprak" stroke="#94a3b8" strokeWidth={3} dot={{r:4}} />
                   <Line type="monotone" dataKey="compostHeight" name="Kompostlu Toprak" stroke="#22c55e" strokeWidth={3} dot={{r:4}} />
                 </LineChart>
               </ResponsiveContainer>
             )}
          </div>
        </div>

        {/* GRAFİK 2: YAPRAK SAYISI */}
        <div className="bg-white p-6 rounded-card shadow-card border border-border">
          <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center">
             <Leaf className="mr-2 text-green-600" size={20} />
             Yaprak Sayısı Gelişimi (Adet)
          </h3>
          <div className="h-72 w-full">
             {loading ? <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div> : (
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={chartData}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                   <XAxis dataKey="date" tickFormatter={formatDate} stroke="#888" fontSize={12} />
                   <YAxis stroke="#888" fontSize={12} />
                   <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      labelFormatter={(label) => new Date(label).toLocaleDateString('tr-TR')}
                   />
                   <Legend />
                   <Line type="monotone" dataKey="normalLeaves" name="Normal Toprak" stroke="#94a3b8" strokeWidth={3} strokeDasharray="5 5" />
                   <Line type="monotone" dataKey="compostLeaves" name="Kompostlu Toprak" stroke="#16a34a" strokeWidth={3} />
                 </LineChart>
               </ResponsiveContainer>
             )}
          </div>
        </div>
      </div>

      {/* ANALİZ TABLOSU */}
      <div className="mt-8 bg-white rounded-card shadow-card border border-border overflow-hidden">
         <div className="p-4 bg-background-subtle border-b border-border flex justify-between items-center">
            <h4 className="font-bold text-text-primary flex items-center">
               <Database className="mr-2" size={16} /> Detaylı Ölçüm Verileri
            </h4>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
               <thead className="bg-gray-50 text-text-secondary border-b border-gray-100">
                  <tr>
                     <th className="p-4 font-semibold">Tarih</th>
                     <th className="p-4 font-semibold text-gray-500">Normal Boy</th>
                     <th className="p-4 font-semibold text-green-600">Kompostlu Boy</th>
                     <th className="p-4 font-semibold text-gray-500">Normal Yaprak</th>
                     <th className="p-4 font-semibold text-green-600">Kompostlu Yaprak</th>
                     <th className="p-4 font-semibold text-right">Fark (Boy)</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {[...chartData].reverse().map((row, idx) => {
                     const diff = (row.compostHeight || 0) - (row.normalHeight || 0);
                     return (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                           <td className="p-4 font-medium">{new Date(row.date).toLocaleDateString('tr-TR')}</td>
                           <td className="p-4 text-gray-600">{row.normalHeight ? `${row.normalHeight} cm` : '-'}</td>
                           <td className="p-4 font-bold text-green-700">{row.compostHeight ? `${row.compostHeight} cm` : '-'}</td>
                           <td className="p-4 text-gray-600">{row.normalLeaves || '-'}</td>
                           <td className="p-4 font-bold text-green-700">{row.compostLeaves || '-'}</td>
                           <td className="p-4 text-right">
                              {diff > 0 ? (
                                 <span className="text-green-600 font-bold">+{diff.toFixed(1)} cm</span>
                              ) : (
                                 <span className="text-gray-400">{diff.toFixed(1)} cm</span>
                              )}
                           </td>
                        </tr>
                     );
                  })}
                  {chartData.length === 0 && (
                     <tr>
                        <td colSpan={6} className="p-8 text-center text-text-muted">
                           Henüz veri girişi yapılmamış. Yönetici panelinden deney verilerini ekleyin.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-100 p-6 rounded-card flex items-start space-x-4">
         <Info className="text-blue-600 shrink-0 mt-1" size={24} />
         <div>
            <h4 className="font-bold text-blue-800 text-lg mb-2">Harezmi Modeli: Veriden Sonuca</h4>
            <p className="text-blue-700/80 leading-relaxed">
               Bu laboratuvar bölümünde, algoritmik düşünce yapısıyla hareket ediyoruz. Girdi (Kompost) değişikliğinin, Çıktı (Bitki Boyu/Sağlığı) üzerindeki etkisini sayısal verilerle kanıtlıyoruz. Grafikler, kompostun toprağı nasıl "süper güçlendirdiğini" somut olarak gösterir.
            </p>
         </div>
      </div>
    </div>
  );
};

export default CompostLab;