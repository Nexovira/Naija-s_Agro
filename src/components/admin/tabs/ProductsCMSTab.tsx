import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { Product, ProductSpec } from '../../../types';
import { ImageUploadField } from '../../common/ImageUploadField';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Eye, 
  Package, 
  Droplet, 
  Sparkles, 
  Scale, 
  FileText, 
  Search, 
  AlertCircle 
} from 'lucide-react';

const EMPTY_PRODUCT: Product = {
  id: '',
  name: '',
  botanicalName: '',
  category: 'spices',
  tagline: '',
  description: 'Premium Nigerian export-grade agricultural commodity harvested from verified contract farming clusters.',
  image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=1000&auto=format&fit=crop',
  gallery: [],
  active: true,
  featured: false,
  certifications: ['NAFDAC', 'NEPC', 'FDA', 'SGS'],
  specs: {
    moisture: '< 9%',
    purity: '> 98%',
    moq: '14 Metric Tons (1 x 20ft FCL)',
    origin: 'Kaduna / Niger State, Nigeria',
    cropYear: '2026 / 2027 Main Crop',
    packaging: '40kg New Jute / PP Bags with Inner Liner',
    grade: 'Grade A Export Quality',
    shelfLife: '24 Months',
    hsCode: '0910.11',
    oilContent: 'Min 2.0% Volatile Oil',
    aflatoxin: '< 4 ppb (EU Standard Compliant)',
    admixture: '< 1.5% Max'
  },
  keyFeatures: [
    'Cleaned and sorted with automated optical color sorters',
    'Low moisture content preventing mold propagation during ocean freight',
    'Free from live weevils, stone particles, and rodent contamination'
  ],
  applications: [
    'Culinary and spice formulation',
    'Essential oil and oleoresin extraction',
    'Pharmaceutical and nutraceutical infusions'
  ],
  certificationsIncluded: ['NAFDAC Export Certificate', 'Phytosanitary Certificate', 'SGS Pre-Shipment Certificate']
};

export const ProductsCMSTab: React.FC = () => {
  const { data, addProduct, updateProduct, deleteProduct } = useCMS();
  const { products, categories } = data;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saveNotification, setSaveNotification] = useState(false);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.botanicalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.specs?.hsCode?.includes(searchTerm);
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleStartCreate = () => {
    setEditingProduct({ ...EMPTY_PRODUCT, id: `prod-${Date.now()}` });
    setIsCreating(true);
  };

  const handleStartEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsCreating(false);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (isCreating) {
      await addProduct(editingProduct);
    } else {
      await updateProduct(editingProduct.id, editingProduct);
    }

    setEditingProduct(null);
    setIsCreating(false);
    setSaveNotification(true);
    setTimeout(() => setSaveNotification(false), 3000);
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    setDeleteConfirmId(null);
  };

  const handleSpecChange = (key: keyof ProductSpec, value: string) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      specs: {
        ...editingProduct.specs,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E0D8C8]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B3B24] tracking-tight">
            Commodity Catalog CMS
          </h1>
          <p className="text-xs text-[#718096] mt-0.5">
            Create, edit, and manage export agricultural products, lab specifications, packaging options, and photos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveNotification && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <Check className="w-4 h-4" />
              <span>Catalog Updated</span>
            </span>
          )}
          <button
            onClick={handleStartCreate}
            className="px-4 py-2.5 rounded-xl bg-[#0B3B24] text-white text-xs font-bold hover:bg-[#072818] transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#E6C687]" />
            <span>Add New Commodity</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E0D8C8] shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#718096] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search commodity name, botanical, HS code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white focus:ring-2 focus:ring-[#0B3B24]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedCategory === 'all' ? 'bg-[#0B3B24] text-white' : 'bg-[#FAF8F5] text-[#4A5568] hover:bg-[#EFE9DF]'
            }`}
          >
            All ({products.length})
          </button>
          {(categories || []).map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                selectedCategory === cat.id ? 'bg-[#0B3B24] text-white' : 'bg-[#FAF8F5] text-[#4A5568] hover:bg-[#EFE9DF]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#E0D8C8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] text-[#718096] border-b border-[#E0D8C8]">
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Product</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Category</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Lab Specs (Moisture / Purity / MOQ)</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Origin &amp; HS Code</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-right font-bold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE9DF]">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    
                    {/* Commodity Name & Image */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#0B3B24] shrink-0 border border-[#D9D0BE]">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-[#0B3B24] text-sm">{product.name}</div>
                          <div className="text-[11px] font-mono italic text-[#718096]">{product.botanicalName}</div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#D9D0BE] text-[#0B3B24] font-semibold text-[11px] uppercase">
                        {product.category}
                      </span>
                    </td>

                    {/* Specs */}
                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[#718096]">Moisture:</span>
                          <span className="font-bold text-[#0B3B24]">{product.specs?.moisture}</span>
                          <span className="text-[#718096]">| Purity:</span>
                          <span className="font-bold text-[#0B3B24]">{product.specs?.purity}</span>
                        </div>
                        <div className="text-[11px] text-[#4A5568]">
                          MOQ: <strong className="text-[#0B3B24]">{product.specs?.moq}</strong>
                        </div>
                      </div>
                    </td>

                    {/* Origin & HS Code */}
                    <td className="py-4 px-4">
                      <div className="text-[#1E232A] font-semibold">{product.specs?.origin}</div>
                      <div className="text-[11px] font-mono text-[#8C7A5B]">HS: {product.specs?.hsCode}</div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <button
                        onClick={async () => {
                          await updateProduct(product.id, { active: product.active === false ? true : false });
                        }}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                          product.active !== false
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {product.active !== false ? 'Live Active' : 'Draft / Hidden'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleStartEdit(product)}
                          className="p-2 rounded-lg bg-[#FAF8F5] border border-[#D9D0BE] text-[#0B3B24] hover:bg-[#0B3B24] hover:text-white transition-colors cursor-pointer"
                          title="Edit Commodity"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(product.id)}
                          className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                          title="Delete Commodity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#718096]">
                    No commodities match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-[#E0D8C8] shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-[#1E232A]">Delete Commodity?</h3>
              <p className="text-xs text-[#718096]">
                This will remove the product from the public export catalog and RFQ selector.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#D9D0BE] text-xs font-semibold text-[#4A5568] hover:bg-[#FAF8F5]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Edit / Create Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full border border-[#E0D8C8] shadow-2xl overflow-hidden my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#EFE9DF] bg-[#FAF8F5]">
              <div>
                <h3 className="text-lg font-bold text-[#0B3B24]">
                  {isCreating ? 'Add New Export Commodity' : `Edit: ${editingProduct.name}`}
                </h3>
                <p className="text-xs text-[#718096]">Configure technical export specifications and lab tolerances</p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 rounded-lg text-[#718096] hover:bg-[#EFE9DF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveProduct} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#0B3B24]">
                  General Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A5568] mb-1">Commodity Name *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      placeholder="e.g. Premium Dried Split Ginger"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-sm text-[#1E232A] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A5568] mb-1">Botanical / Scientific Name</label>
                    <input
                      type="text"
                      value={editingProduct.botanicalName}
                      onChange={(e) => setEditingProduct({ ...editingProduct, botanicalName: e.target.value })}
                      placeholder="e.g. Zingiber officinale"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-sm text-[#1E232A] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A5568] mb-1">Category</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-sm text-[#1E232A] focus:bg-white"
                    >
                      <option value="spices">Spices &amp; Botanicals</option>
                      <option value="oilseeds">Oilseeds &amp; Kernels</option>
                      <option value="flours">Processed Flours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A5568] mb-1">Grade Designation</label>
                    <input
                      type="text"
                      value={editingProduct.specs?.grade || 'Grade A'}
                      onChange={(e) => handleSpecChange('grade', e.target.value)}
                      placeholder="e.g. Grade A Export Quality"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-sm text-[#1E232A] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A5568] mb-1">Tagline / Short Summary</label>
                  <input
                    type="text"
                    value={editingProduct.tagline}
                    onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                    placeholder="e.g. Sun-dried split ginger rhizomes with pungent aroma and high gingerol content."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-sm text-[#1E232A] focus:bg-white"
                  />
                </div>

                <div className="pt-1">
                  <ImageUploadField
                    label="Primary Commodity Image"
                    value={editingProduct.image}
                    onChange={(url) => setEditingProduct({ ...editingProduct, image: url })}
                    placeholder="Upload product photograph (click to browse or drag & drop)"
                    aspectRatio="video"
                    helperText="Upload clean commodity photography (PNG, JPG, WEBP)"
                  />
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div className="pt-4 border-t border-[#EFE9DF] space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#0B3B24]">
                  Key Technical Specifications
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A5568] mb-1">Moisture Level *</label>
                    <input
                      type="text"
                      value={editingProduct.specs?.moisture || ''}
                      onChange={(e) => handleSpecChange('moisture', e.target.value)}
                      placeholder="< 9%"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs font-bold text-[#0B3B24] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A5568] mb-1">Purity *</label>
                    <input
                      type="text"
                      value={editingProduct.specs?.purity || ''}
                      onChange={(e) => handleSpecChange('purity', e.target.value)}
                      placeholder="> 98%"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs font-bold text-[#0B3B24] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A5568] mb-1">MOQ *</label>
                    <input
                      type="text"
                      value={editingProduct.specs?.moq || ''}
                      onChange={(e) => handleSpecChange('moq', e.target.value)}
                      placeholder="14 MT (1 x 20ft FCL)"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs font-bold text-[#0B3B24] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A5568] mb-1">Origin Cluster</label>
                    <input
                      type="text"
                      value={editingProduct.specs?.origin || ''}
                      onChange={(e) => handleSpecChange('origin', e.target.value)}
                      placeholder="Kaduna State, Nigeria"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A5568] mb-1">HS Code</label>
                    <input
                      type="text"
                      value={editingProduct.specs?.hsCode || ''}
                      onChange={(e) => handleSpecChange('hsCode', e.target.value)}
                      placeholder="0910.11"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs font-mono text-[#1E232A] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A5568] mb-1">Packaging Standard</label>
                    <input
                      type="text"
                      value={editingProduct.specs?.packaging || ''}
                      onChange={(e) => handleSpecChange('packaging', e.target.value)}
                      placeholder="40kg New Jute Bags"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A5568] mb-1">Crop Harvest Year</label>
                    <input
                      type="text"
                      value={editingProduct.specs?.cropYear || ''}
                      onChange={(e) => handleSpecChange('cropYear', e.target.value)}
                      placeholder="2026/2027 Main Crop"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A5568] mb-1">Oil Content / Assay</label>
                    <input
                      type="text"
                      value={editingProduct.specs?.oilContent || ''}
                      onChange={(e) => handleSpecChange('oilContent', e.target.value)}
                      placeholder="Min 2.0% Volatile Oil"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A5568] mb-1">Aflatoxin Threshold</label>
                    <input
                      type="text"
                      value={editingProduct.specs?.aflatoxin || ''}
                      onChange={(e) => handleSpecChange('aflatoxin', e.target.value)}
                      placeholder="< 4 ppb (EU standard)"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Status Switch */}
              <div className="pt-4 border-t border-[#EFE9DF] flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#0B3B24]">
                  <input
                    type="checkbox"
                    checked={editingProduct.active !== false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, active: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0B3B24] focus:ring-[#0B3B24]"
                  />
                  <span>Publish to Live Public Catalog</span>
                </label>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 rounded-xl border border-[#D9D0BE] text-xs font-semibold text-[#4A5568] hover:bg-[#FAF8F5]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#0B3B24] text-white text-xs font-bold hover:bg-[#072818] shadow-sm"
                  >
                    Save Commodity
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
