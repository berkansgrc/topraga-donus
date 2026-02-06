import React from 'react';

interface GalleryFormProps {
    formData: any;
    setFormData: (data: any) => void;
}

const GalleryForm: React.FC<GalleryFormProps> = ({ formData, setFormData }) => {
    return (
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
};

export default GalleryForm;
