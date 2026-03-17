import { useState, useEffect } from "react";
import API from "../../api/axiosInstance";
import toast from "react-hot-toast";

export default function AdminManagePage({ mode }) {

  const [admins, setAdmins] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  

  const fetchAdmins = async () => {
    const toastId = toast.loading("Fetching admins...");
    try {
      const res = await API.get("/superadmin/users");
      setAdmins(res.data.data);
      
    } catch (err) {
      toast.error("Failed to fetch admins", { id: toastId });
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // CREATE ADMIN
  const handleCreateAdmin = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Creating admin...");

    try {
      await API.post("/superadmin/users", form);

      toast.success("Admin created successfully", { id: toastId });

      setForm({
        name: "",
        email: "",
        password: ""
      });

      fetchAdmins();

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to create admin",
        { id: toastId }
      );
    }
  };

  // TOGGLE STATUS
  const toggleStatus = async (id) => {
    const toastId = toast.loading("Updating status...");

    try {
      await API.patch(`/superadmin/users/${id}/toggle-status`);
      toast.success("Admin status updated", { id: toastId });
      fetchAdmins();
    } catch {
      toast.error("Failed to update status", { id: toastId });
    }
  };

  // OPEN DELETE MODAL
  const openDeleteModal = (admin) => {
    setSelectedAdmin(admin);
    setDeleteModal(true);
  };

  // DELETE ADMIN
  const deleteAdmin = async () => {
    if (!selectedAdmin) return;

    const toastId = toast.loading("Deleting admin...");

    try {
      await API.delete(`/superadmin/users/${selectedAdmin._id}`);
      toast.success("Admin deleted successfully", { id: toastId });
      setDeleteModal(false);
      fetchAdmins();
    } catch {
      toast.error("Failed to delete admin", { id: toastId });
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">

      {/* ================= CREATE ================= */}
      {mode === "create" && (
        <div className="bg-white shadow rounded-xl p-5 md:p-6 mb-8">

          <h2 className="text-lg md:text-xl font-semibold mb-5">
            Create Admin
          </h2>

          <form
            onSubmit={handleCreateAdmin}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >

            <input
              type="text"
              placeholder="Name"
              value={form.name}
              required
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              required
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              required
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />

            <button
              className="md:col-span-3 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
            >
              Create Admin
            </button>

          </form>

        </div>
      )}

      {/* ================= TOGGLE ================= */}
      {mode === "toggle" && (
        <div>

          <h2 className="text-lg md:text-xl font-semibold mb-4">
            Toggle Admin Status
          </h2>

          {/* MOBILE CARDS */}
          <div className="md:hidden space-y-4">
            {admins.length === 0 && (
              <p className="text-center text-gray-500">No admins found</p>
            )}

            {admins.map((admin) => (
              <div key={admin._id} className="bg-white p-4 rounded-xl shadow">

                <p className="font-semibold">{admin.name}</p>
                <p className="text-sm text-gray-500">{admin.email}</p>

                <div className="flex items-center justify-between mt-3">

                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      admin.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {admin.isActive ? "Active" : "Inactive"}
                  </span>

                  <button
                    onClick={() => toggleStatus(admin._id)}
                    className="text-blue-600 font-medium"
                  >
                    Toggle
                  </button>

                </div>

              </div>
            ))}
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden md:block bg-white shadow rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">

                <thead className="bg-gray-100 text-sm">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {admins.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-6 text-center text-gray-500">
                        No admins found
                      </td>
                    </tr>
                  )}

                  {admins.map((admin) => (
                    <tr key={admin._id} className="border-t hover:bg-gray-50">

                      <td className="p-4">{admin.name}</td>
                      <td className="p-4">{admin.email}</td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            admin.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {admin.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => toggleStatus(admin._id)}
                          className="text-blue-600 font-medium hover:underline"
                        >
                          Toggle
                        </button>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>
            </div>
          </div>

        </div>
      )}

      {/* ================= DELETE ================= */}
      {mode === "delete" && (
        <div>

          <h2 className="text-lg md:text-xl font-semibold mb-4">
            Delete Admin
          </h2>

          <div className="md:hidden space-y-4">
            {admins.map((admin) => (
              <div key={admin._id} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
                <div>
                  <p className="font-semibold">{admin.name}</p>
                  <p className="text-sm text-gray-500">{admin.email}</p>
                </div>

                <button
                  onClick={() => openDeleteModal(admin)}
                  className="text-red-600 font-medium"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <div className="hidden md:block bg-white shadow rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {admins.map((admin) => (
                  <tr key={admin._id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{admin.name}</td>
                    <td className="p-4">{admin.email}</td>
                    <td className="p-4">
                      <button
                        onClick={() => openDeleteModal(admin)}
                        className="text-red-600 font-medium hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ================= MODAL ================= */}
      {deleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-4">

          <div className="bg-white rounded-xl p-5 w-full max-w-sm">

            <h2 className="text-lg font-semibold mb-3">
              Delete Admin
            </h2>

            <p className="text-gray-600 mb-5 text-sm">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {selectedAdmin?.name}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setDeleteModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={deleteAdmin}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}