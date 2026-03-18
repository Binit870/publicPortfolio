import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, RefreshCw, Image } from "lucide-react";
import {
  getGalleryItemsApi,
  deleteGalleryItemApi,
  getGalleriesApi,
  deleteGalleryApi,
} from "../../api/gallery.api";
import toast, { Toaster } from "react-hot-toast";

const mediaTypeStyle = (type) => {
  if (type === "gif") return "bg-purple-100 text-purple-700";
  return "bg-green-100 text-green-700";
};

const GalleryAdminPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("items");
  const [items, setItems] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [itemsRes, galleriesRes] = await Promise.all([
        getGalleryItemsApi({ limit: 100 }),
        getGalleriesApi(),
      ]);
      setItems(itemsRes.data.data || []);
      setGalleries(galleriesRes.data || []);
    } catch {
      toast.error("Failed to load gallery data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = (id) => {
    setDeleteConfirm({ id, type: "item" });
  };

  const handleDeleteGallery = (id) => {
    setDeleteConfirm({ id, type: "gallery" });
  };

  const confirmDelete = async () => {
    try {
      if (deleteConfirm.type === "item") {
        await deleteGalleryItemApi(deleteConfirm.id);
        setItems((prev) => prev.filter((i) => i._id !== deleteConfirm.id));
        toast.success("Item deleted");
      } else {
        await deleteGalleryApi(deleteConfirm.id);
        setGalleries((prev) => prev.filter((g) => g._id !== deleteConfirm.id));
        toast.success("Gallery deleted");
      }
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const categories = ["All", ...new Set(items.map((i) => i.category).filter(Boolean))];
  const filteredItems = filter === "All" ? items : items.filter((i) => i.category === filter);

  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Admin</span>
            <h1 className="text-2xl font-bold font-poppins text-foreground mt-1">Gallery</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {items.length} items · {galleries.length} galleries
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchData} className="btn-outline-primary flex items-center gap-2 text-sm py-2">
              <RefreshCw size={14} /> Refresh
            </button>
            <button
              onClick={() => navigate("/admin/gallery/items/new")}
              className="btn-primary flex items-center gap-2 text-sm py-2"
            >
              <Plus size={14} /> Add Item
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border">
          {["items", "galleries"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-medium capitalize transition-smooth ${
                activeTab === tab
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        ) : (
          <>
            {/* ITEMS TAB */}
            {activeTab === "items" && (
              <>
                <div className="flex gap-2 mb-6 flex-wrap">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-smooth ${
                        filter === cat
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredItems.map((item) => (
                    <div key={item._id} className="bg-card border border-border rounded-2xl overflow-hidden group">
                      <div className="relative aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                        {item.mediaUrl ? (
                          <img
                            src={item.thumbnail || item.mediaUrl}
                            alt={item.altText || item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image size={32} className="text-muted-foreground" />
                        )}
                        <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${mediaTypeStyle(item.mediaType)}`}>
                          {item.mediaType}
                        </span>
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-semibold text-primary uppercase mb-0.5">{item.category}</p>
                        <h4 className="text-sm font-bold text-foreground truncate">{item.title}</h4>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                          <span>👁 {item.stats?.views || 0}</span>
                          <span>❤️ {item.stats?.likes || 0}</span>
                        </div>
                      </div>
                      <div className="px-3 pb-3 flex gap-2">
                        <button
                          onClick={() => navigate(`/admin/gallery/items/${item._id}/edit`)}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-border text-xs font-medium hover:border-primary hover:text-primary transition-smooth"
                        >
                          <Pencil size={12} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item._id)}
                          className="flex items-center justify-center p-1.5 rounded-lg border border-border hover:border-red-300 hover:text-red-600 transition-smooth"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredItems.length === 0 && (
                  <div className="text-center py-20">
                    <div className="text-5xl mb-4">🖼️</div>
                    <p className="text-muted-foreground">No items found.</p>
                    <button
                      onClick={() => navigate("/admin/gallery/items/new")}
                      className="btn-primary mt-4"
                    >
                      Add First Item
                    </button>
                  </div>
                )}
              </>
            )}

            {/* GALLERIES TAB */}
            {activeTab === "galleries" && (
              <>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => navigate("/admin/gallery/new")}
                    className="btn-primary flex items-center gap-2 text-sm py-2"
                  >
                    <Plus size={14} /> New Gallery
                  </button>
                </div>
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-section-alt">
                        <th className="text-left p-4 font-semibold text-muted-foreground">Gallery</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground">Layout</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground">Items</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground">Status</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {galleries.map((g) => (
                        <tr key={g._id} className="border-b border-border hover:bg-section-alt transition-colors">
                          <td className="p-4">
                            <p className="font-semibold text-foreground">{g.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{g.subtitle}</p>
                          </td>
                          <td className="p-4">
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary/40 text-secondary-foreground capitalize">
                              {g.layoutType}
                            </span>
                          </td>
                          <td className="p-4 text-muted-foreground">{g.items?.length || 0} items</td>
                          <td className="p-4">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${g.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {g.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => navigate(`/admin/gallery/${g._id}/edit`)}
                                className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                onClick={() => handleDeleteGallery(g._id)}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {galleries.length === 0 && (
                    <div className="text-center py-20">
                      <div className="text-5xl mb-4">🗂️</div>
                      <p className="text-muted-foreground">No galleries found.</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-foreground text-lg mb-2">Confirm Delete</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete this{" "}
              {deleteConfirm.type === "item" ? "gallery item" : "gallery"}?
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn-outline-primary text-sm py-2 px-4"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-smooth"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryAdminPage;