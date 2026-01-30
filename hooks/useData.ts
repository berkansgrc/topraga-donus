import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { MOCK_WASTE_ITEMS, MOCK_STATIONS, MOCK_PROJECT_IMAGES } from '../constants';
import { WasteItem, Station, ProjectImage } from '../types';

export const useWasteItems = () => {
  const [items, setItems] = useState<WasteItem[]>(MOCK_WASTE_ITEMS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data, error } = await supabase
          .from('waste_items')
          .select('*');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Normalize imageUrl
          const normalized = data.map((item: any) => ({
            ...item,
            imageUrl: item.imageUrl || item.imageurl || item.image_url || item.imgUrl
          }));
          setItems(normalized as WasteItem[]);
        } else {
          setItems(MOCK_WASTE_ITEMS);
        }
      } catch (err) {
        setItems(MOCK_WASTE_ITEMS);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return { items, loading };
};

export const useStations = () => {
  const [stations, setStations] = useState<Station[]>(MOCK_STATIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const { data, error } = await supabase
          .from('stations')
          .select('*');
        
        if (error) throw error;

        if (data && data.length > 0) {
          setStations(data as Station[]);
        } else {
          setStations(MOCK_STATIONS);
        }
      } catch (err) {
        setStations(MOCK_STATIONS);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  return { stations, loading };
};

export const useProjectImages = () => {
  const [images, setImages] = useState<ProjectImage[]>(MOCK_PROJECT_IMAGES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data, error } = await supabase
          .from('project_images')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // GÜNCELLEME: Sütun isimlerini normalize et (imageUrl, imageurl, image_url, imgUrl hepsini kabul et)
          // Ayrıca kategori boşsa varsayılan olarak 'poster' ata.
          const normalizedImages = data.map((img: any) => ({
            ...img,
            category: img.category || 'poster', 
            imageUrl: img.imageUrl || img.imageurl || img.image_url || img.imgUrl || 'https://placehold.co/600x400?text=Görsel+Yok'
          }));
          setImages(normalizedImages as ProjectImage[]);
        } else {
          console.log("Veri bulunamadı, örnek veriler gösteriliyor.");
          setImages(MOCK_PROJECT_IMAGES); 
        }
      } catch (err: any) {
        console.warn('Galeri verisi çekilemedi, örnek veriler kullanılıyor.');
        setImages(MOCK_PROJECT_IMAGES);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return { images, loading };
};