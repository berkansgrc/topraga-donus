import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../services/supabaseClient';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CompostLog } from '../types';
import { FlaskConical, Database, Copy, AlertCircle, Sprout, Ruler, Leaf, Info, Loader2, TrendingUp, Droplets, Calendar, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

// SVG Bitki Bileşeni
const PlantSVG: React.FC<{ height: number; leafCount: number; isCompost: boolean; maxHeight: number }> = ({
  height, leafCount, isCompost, maxHeight
}) => {
  const scale = maxHeight > 0 ? Math.max(0.2, height / maxHeight) : 0.2;
  const stemColor = isCompost ? '#22c55e' : '#9ca3af';
  const leafColor = isCompost ? '#16a34a' : '#6b7280';
  const potColor = isCompost ? '#7A4E2D' : '#78716c';

  return (
    <motion.svg
      viewBox="0 0 100 150"
      className="w-full h-48"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Saksı */}
      <path
        d={`M25,120 L30,145 L70,145 L75,120 Z`}
        fill={potColor}
        stroke={isCompost ? '#5c3d22' : '#57534e'}
        strokeWidth="2"
      />
      <ellipse cx="50" cy="120" rx="27" ry="6" fill={potColor} />

      {/* Toprak */}
      <ellipse cx="50" cy="120" rx="22" ry="4" fill={isCompost ? '#3d2314' : '#44403c'} />

      {/* Gövde - Dinamik yükseklik */}
      <motion.line
        x1="50" y1="120" x2="50"
        initial={{ y2: 120 }}
        animate={{ y2: 120 - (60 * scale) }}
        transition={{ duration: 0.8, type: "spring" }}
        stroke={stemColor}
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Yapraklar - Dinamik sayı */}
      {Array.from({ length: Math.min(leafCount, 8) }).map((_, i) => {
        const y = 120 - (60 * scale * ((i + 1) / (leafCount + 1)));
        const side = i % 2 === 0 ? 1 : -1;
        const leafSize = 12 + (i * 1.5);
        return (
          <motion.ellipse
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            cx={50 + (side * leafSize)}
            cy={y}
            rx={leafSize * 0.8}
            ry={leafSize * 0.4}
            fill={leafColor}
            transform={`rotate(${side * 30} ${50 + (side * leafSize)} ${y})`}
          />
        );
      })}

      {/* Üst yaprak */}
      <motion.ellipse
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        cx="50"
        cy={120 - (60 * scale) - 8}
        rx="10"
        ry="6"
        fill={leafColor}
      />
    </motion.svg>
  );
};

const CompostLab: React.FC = () => {
  const [logs, setLogs] = useState<CompostLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableError, setTableError] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  // Auto-play için timer
  useEffect(() => {
    if (isPlaying && chartData.length > 0) {
      const timer = setInterval(() => {
        setSelectedDateIndex(prev => {
          if (prev >= chartData.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPlaying, chartData.length]);

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

      {/* 🌱 GÖRSEL BİTKİ SİMÜLASYONU */}
      {chartData.length > 0 && (
        <div className="mb-10 bg-gradient-to-br from-green-50 to-amber-50 rounded-card border border-green-200 shadow-card overflow-hidden">
          <div className="p-6 border-b border-green-200 bg-white/50">
            <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <Sprout className="text-primary" size={24} />
              Canlı Gelişim Simülasyonu
            </h3>
            <p className="text-sm text-text-muted mt-1">
              Zaman çizelgesini kaydırarak bitkilerin büyümesini izleyin
            </p>
          </div>

          {/* Bitki Görselleri */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              {/* Normal Toprak Bitkisi */}
              <div className="text-center">
                <div className="bg-white rounded-2xl p-4 shadow-soft border border-gray-200 mb-3">
                  <PlantSVG
                    height={chartData[selectedDateIndex]?.normalHeight || 0}
                    leafCount={chartData[selectedDateIndex]?.normalLeaves || 0}
                    isCompost={false}
                    maxHeight={Math.max(...chartData.map(d => Math.max(d.normalHeight || 0, d.compostHeight || 0)))}
                  />
                </div>
                <div className="bg-gray-100 rounded-lg px-4 py-2 inline-block">
                  <span className="text-gray-600 font-medium">Normal Toprak</span>
                  <div className="flex items-center justify-center gap-4 mt-1 text-sm">
                    <span className="flex items-center gap-1">
                      <Ruler size={14} className="text-gray-500" />
                      {chartData[selectedDateIndex]?.normalHeight || 0} cm
                    </span>
                    <span className="flex items-center gap-1">
                      <Leaf size={14} className="text-gray-500" />
                      {chartData[selectedDateIndex]?.normalLeaves || 0} yaprak
                    </span>
                  </div>
                </div>
              </div>

              {/* Kompostlu Toprak Bitkisi */}
              <div className="text-center">
                <div className="bg-white rounded-2xl p-4 shadow-soft border border-green-200 mb-3">
                  <PlantSVG
                    height={chartData[selectedDateIndex]?.compostHeight || 0}
                    leafCount={chartData[selectedDateIndex]?.compostLeaves || 0}
                    isCompost={true}
                    maxHeight={Math.max(...chartData.map(d => Math.max(d.normalHeight || 0, d.compostHeight || 0)))}
                  />
                </div>
                <div className="bg-green-100 rounded-lg px-4 py-2 inline-block">
                  <span className="text-green-700 font-medium">Kompostlu Toprak</span>
                  <div className="flex items-center justify-center gap-4 mt-1 text-sm">
                    <span className="flex items-center gap-1 text-green-600">
                      <Ruler size={14} />
                      {chartData[selectedDateIndex]?.compostHeight || 0} cm
                    </span>
                    <span className="flex items-center gap-1 text-green-600">
                      <Leaf size={14} />
                      {chartData[selectedDateIndex]?.compostLeaves || 0} yaprak
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Zaman Çizelgesi Slider */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-primary" />
                  <span className="font-medium text-text-primary">
                    {chartData[selectedDateIndex]?.date ? new Date(chartData[selectedDateIndex].date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Tarih Yok'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedDateIndex(Math.max(0, selectedDateIndex - 1))}
                    disabled={selectedDateIndex === 0}
                    className="p-2 rounded-lg bg-background-subtle hover:bg-primary-soft disabled:opacity-30 transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`p-2 rounded-lg transition-all ${isPlaying ? 'bg-primary text-white' : 'bg-primary-soft text-primary'}`}
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  <button
                    onClick={() => setSelectedDateIndex(Math.min(chartData.length - 1, selectedDateIndex + 1))}
                    disabled={selectedDateIndex === chartData.length - 1}
                    className="p-2 rounded-lg bg-background-subtle hover:bg-primary-soft disabled:opacity-30 transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="0"
                max={chartData.length - 1}
                value={selectedDateIndex}
                onChange={(e) => setSelectedDateIndex(parseInt(e.target.value))}
                className="w-full h-2 bg-primary-soft rounded-lg appearance-none cursor-pointer accent-primary"
              />

              <div className="flex justify-between text-xs text-text-muted mt-2">
                <span>Gün 1</span>
                <span>Gün {chartData.length}</span>
              </div>
            </div>
          </div>

          {/* Karşılaştırma İstatistikleri */}
          {chartData.length > 0 && (() => {
            const lastData = chartData[chartData.length - 1];
            const heightDiff = (lastData?.compostHeight || 0) - (lastData?.normalHeight || 0);
            const heightPercent = lastData?.normalHeight > 0 ? Math.round((heightDiff / lastData.normalHeight) * 100) : 0;
            const leafDiff = (lastData?.compostLeaves || 0) - (lastData?.normalLeaves || 0);

            return (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white/70 border-t border-green-200">
                <div className="text-center p-4 bg-gradient-to-br from-primary-soft to-green-100 rounded-xl">
                  <TrendingUp className="mx-auto text-primary mb-2" size={24} />
                  <div className="text-2xl font-bold text-primary">+{heightPercent}%</div>
                  <div className="text-xs text-primary-700">Daha Hızlı Büyüme</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <Ruler className="mx-auto text-green-600 mb-2" size={24} />
                  <div className="text-2xl font-bold text-green-700">+{heightDiff.toFixed(1)} cm</div>
                  <div className="text-xs text-green-600">Boy Farkı</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                  <Leaf className="mx-auto text-emerald-600 mb-2" size={24} />
                  <div className="text-2xl font-bold text-emerald-700">+{leafDiff}</div>
                  <div className="text-xs text-emerald-600">Yaprak Farkı</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <Droplets className="mx-auto text-blue-600 mb-2" size={24} />
                  <div className="text-2xl font-bold text-blue-700">~%30</div>
                  <div className="text-xs text-blue-600">Su Tasarrufu*</div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

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
                  <Line type="monotone" dataKey="normalHeight" name="Normal Toprak" stroke="#94a3b8" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="compostHeight" name="Kompostlu Toprak" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} />
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