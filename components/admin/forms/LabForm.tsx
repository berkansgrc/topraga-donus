import React from 'react';
import { Ruler, Leaf } from 'lucide-react';

interface LabFormProps {
    formData: any;
    setFormData: (data: any) => void;
}

const LabForm: React.FC<LabFormProps> = ({ formData, setFormData }) => {
    return (
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
};

export default LabForm;
