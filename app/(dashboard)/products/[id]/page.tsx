'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Toast from '@/components/common/Toast';
import { ArrowLeft, Package, History as HistoryIcon } from 'lucide-react';

interface Product {
  id: string;
  nama_barang: string;
  sku: string;
  stok: number;
  lokasi_rak: string;
  minimum_stok: number;
}

interface Transaction {
  id: string;
  type: string;
  quantity: number;
  created_at: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');
  const [product, setProduct] = useState<Product | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    nama_barang: '',
    sku: '',
    stok: '',
    lokasi_rak: '',
    minimum_stok: '',
  });

  useEffect(() => {
    fetchProduct();
    fetchTransactions();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const data = await api.getProductById(params.id as string);
      setProduct(data);
      setFormData({
        nama_barang: data.nama_barang,
        sku: data.sku,
        stok: data.stok.toString(),
        lokasi_rak: data.lokasi_rak,
        minimum_stok: data.minimum_stok.toString(),
      });
    } catch (error: any) {
      setToast({ message: error.message || 'Failed to load product', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const data = await api.getTransactions({ product_id: params.id as string });
      setTransactions(data);
    } catch (error: any) {
      console.error('Failed to load transactions:', error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateProduct(params.id as string, {
        ...formData,
        stok: parseInt(formData.stok),
        minimum_stok: parseInt(formData.minimum_stok),
      });
      setToast({ message: 'Product updated successfully!', type: 'success' });
      setIsEditing(false);
      fetchProduct();
    } catch (error: any) {
      setToast({ message: error.message || 'Failed to update product', type: 'error' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Product not found</div>
      </div>
    );
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onClose={() => setToast(null)}
        />
      )}

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/products')}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.nama_barang}</h1>
            <p className="text-gray-600 mt-1">SKU: {product.sku}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition ${
                  activeTab === 'details'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Package className="w-4 h-4" />
                Details
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition ${
                  activeTab === 'history'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <HistoryIcon className="w-4 h-4" />
                History
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'details' ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={formData.nama_barang}
                      onChange={(e) => setFormData({ ...formData, nama_barang: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      type="number"
                      value={formData.stok}
                      onChange={(e) => setFormData({ ...formData, stok: e.target.value })}
                      disabled={!isEditing}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={formData.lokasi_rak}
                      onChange={(e) => setFormData({ ...formData, lokasi_rak: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Stock
                    </label>
                    <input
                      type="number"
                      value={formData.minimum_stok}
                      onChange={(e) => setFormData({ ...formData, minimum_stok: e.target.value })}
                      disabled={!isEditing}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      Edit Product
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            nama_barang: product.nama_barang,
                            sku: product.sku,
                            stok: product.stok.toString(),
                            lokasi_rak: product.lokasi_rak,
                            minimum_stok: product.minimum_stok.toString(),
                          });
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                      >
                        Save Changes
                      </button>
                    </>
                  )}
                </div>
              </form>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {transactions.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                            No transactions found
                          </td>
                        </tr>
                      ) : (
                        transactions.map((transaction) => (
                          <tr key={transaction.id}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  transaction.type === 'IN'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {transaction.type}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {transaction.quantity}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                              {new Date(transaction.created_at).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
