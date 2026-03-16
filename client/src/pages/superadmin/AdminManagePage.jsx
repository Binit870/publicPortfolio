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

  // FETCH ADMINS
  const fetchAdmins = async () => {

    const toastId = toast.loading("Fetching admins...");

    try {

      const res = await API.get("/superadmin/users");

      setAdmins(res.data.data || []);

      toast.success("Admins loaded", { id: toastId });

    } catch {

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

    <>

      {/* CREATE ADMIN */}

      {mode === "create" && (

        <div className="bg-white shadow rounded-lg p-6 mb-8">

          <h2 className="text-xl font-semibold mb-4">
            Create Admin
          </h2>

          <form
            onSubmit={handleCreateAdmin}
            className="grid md:grid-cols-3 gap-4"
          >

            <input
              type="text"
              placeholder="Name"
              value={form.name}
              required
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="border p-3 rounded"
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              required
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="border p-3 rounded"
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              required
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="border p-3 rounded"
            />

            <button
              className="md:col-span-3 bg-green-600 text-white py-3 rounded hover:bg-green-700"
            >
              Create Admin
            </button>

          </form>

        </div>

      )}

      {/* TOGGLE STATUS */}

      {mode === "toggle" && (

        <div className="bg-white shadow rounded-lg overflow-x-auto">

          <h2 className="text-xl font-semibold p-6">
            Toggle Admin Status
          </h2>

          <table className="w-full text-left">

            <thead className="bg-gray-100">

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
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No admins found
                  </td>
                </tr>
              )}

              {admins.map((admin) => (

                <tr key={admin._id} className="border-t">

                  <td className="p-4">{admin.name}</td>
                  <td className="p-4">{admin.email}</td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded text-sm ${
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
                      className="text-blue-600 hover:underline"
                    >
                      Toggle
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

      {/* DELETE ADMIN */}

      {mode === "delete" && (

        <div className="bg-white shadow rounded-lg overflow-x-auto">

          <h2 className="text-xl font-semibold p-6">
            Delete Admin
          </h2>

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

                <tr key={admin._id} className="border-t">

                  <td className="p-4">{admin.name}</td>
                  <td className="p-4">{admin.email}</td>

                  <td className="p-4">

                    <button
                      onClick={() => openDeleteModal(admin)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

      {/* DELETE MODAL */}

      {deleteModal && (

        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

          <div className="bg-white rounded-lg p-6 w-96">

            <h2 className="text-lg font-semibold mb-4">
              Delete Admin
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {selectedAdmin?.name}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setDeleteModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={deleteAdmin}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </>

  );

}