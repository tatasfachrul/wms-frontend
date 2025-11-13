"use client";

import React, { useEffect, useMemo, useState } from "react";
import { apiProducts, getRoles } from "@/lib/api/";
import Modal from "@/components/common/Modal";
import Toast from "@/components/common/Toast";
import { Plus, Search, Eye, Trash, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Sort
  const [sortField, setSortField] = useState<keyof Product>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [totalPages, setTotalPage] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    stock: 0,
    shelf_location: "",
    minimum_stock: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, sortField, sortOrder, page, perPage]);

  const fetchProducts = async () => {
    try {
      const data = await apiProducts.getProducts({
        keyword: searchTerm,
        sort: sortField,
        page,
        perPage
      });

      setProducts(data.data);
      setTotalPage(data.meta.totalPages)
    } catch (error: any) {
      setToast({
        message: error.message || "Failed to load products",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sortedProducts = useMemo(() => {
    return products.sort((a, b) => {
       if (!sortField) return 0; // no sorting yet

       const valueA = a[sortField];
       const valueB = b[sortField];

       if (typeof valueA === "number" && typeof valueB === "number") {
         // numeric sort
         return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
       }

       // string sort (case-insensitive)
       return sortOrder === "asc"
         ? String(valueA).localeCompare(String(valueB))
         : String(valueB).localeCompare(String(valueA));
    })
  }, [products]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiProducts.createProduct({
        ...formData,
        stock: formData.stock,
        minimum_stock: formData.minimum_stock,
      });
      setToast({ message: "Product added successfully!", type: "success" });
      setIsModalOpen(false);
      setFormData({
        name: "",
        sku: "",
        stock: 0,
        shelf_location: "",
        minimum_stock: 0,
      });
      fetchProducts();
    } catch (error: any) {
      setToast({
        message: error.message || "Failed to add product",
        type: "error",
      });
    }
  };

  const handleDelete = async (productId: number) => {
    try {
      await apiProducts.deleteProduct(productId);
      setToast({ message: "Product deleted successfully!", type: "success" });
      fetchProducts();
    } catch (error: any) {
      setToast({
        message: error.message || "Failed to delete product",
        type: "error",
      });
    }
  };

  const userRoles = getRoles();

  const handleFieldClick = (field: keyof Product) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1">
              Manage your warehouse inventory
            </p>
          </div>
          {userRoles !== "admin" ? (
            <></>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    onClick={() => handleFieldClick("name")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex gap-1 items-center">
                      Name
                      {sortField === "name" ? (
                        sortOrder === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      ) : (
                        ""
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleFieldClick("sku")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex gap-1 items-center">
                      SKU
                      {sortField === "sku" ? (
                        sortOrder === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      ) : (
                        ""
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleFieldClick("stock")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex gap-1 items-center">
                      Stock{" "}
                      {sortField === "stock" ? (
                        sortOrder === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      ) : (
                        ""
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Min Stock
                  </th>
                  {userRoles !== "admin" ? (
                    <></>
                  ) : (
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : sortedProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No products found
                    </td>
                  </tr>
                ) : (
                  sortedProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.stock <= product.minimum_stock
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {product.shelf_location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {product.minimum_stock}
                      </td>
                      {userRoles !== "admin" ? (
                        <></>
                      ) : (
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() =>
                                router.push(`/products/${product.id}`)
                              }
                              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            |
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
                            >
                              <Trash className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPages > 0 && (
            <div className="flex justify-between items-center p-4 border-t border-gray-200 text-sm">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className={`px-3 py-1 rounded-lg border ${
                  page === 1
                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                    : "text-blue-600 border-gray-300 hover:bg-gray-100"
                }`}
              >
                Prev
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className={`px-3 py-1 rounded-lg border ${
                  page === totalPages
                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                    : "text-blue-600 border-gray-300 hover:bg-gray-100"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Product"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SKU
            </label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) =>
                setFormData({ ...formData, sku: e.target.value })
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: Number(e.target.value) })
              }
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.shelf_location}
              onChange={(e) =>
                setFormData({ ...formData, shelf_location: e.target.value })
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Stock
            </label>
            <input
              type="number"
              value={formData.minimum_stock}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  minimum_stock: Number(e.target.value),
                })
              }
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Add Product
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
