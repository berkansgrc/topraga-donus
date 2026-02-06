import React from 'react';

interface WasteFormProps {
    formData: any;
    setFormData: (data: any) => void;
}

const WasteForm: React.FC<WasteFormProps> = ({ formData, setFormData }) => {
    return (
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
};

export default WasteForm;
