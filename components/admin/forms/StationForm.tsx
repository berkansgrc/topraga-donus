import React from 'react';
import { Map } from 'lucide-react';

interface StationFormProps {
    formData: any;
    setFormData: (data: any) => void;
    onOpenMapPicker: () => void;
}

const StationForm: React.FC<StationFormProps> = ({ formData, setFormData, onOpenMapPicker }) => {
    return (
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
                        onClick={onOpenMapPicker}
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
};

export default StationForm;
