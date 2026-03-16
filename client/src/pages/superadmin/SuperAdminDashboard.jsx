import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";
import toast from "react-hot-toast";

export default function SuperAdminDashboard() {

  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const fetchAdmins = async () => {
    try {

      const res = await API.get("/superadmin");

      setAdmins(res.data.data);

    } catch (err) {

      toast.error("Failed to fetch admins");

    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (e) => {

    e.preventDefault();

    try {

      await API.post("/superadmin", form);

      toast.success("Admin created");

      setForm({ name: "", email: "", password: "" });

      fetchAdmins();

    } catch (err) {

      toast.error(err.response?.data?.message || "Failed");

    }
  };

  const toggleStatus = async (id) => {

    try {

      await API.patch(`/superadmin/${id}/toggle-status`);

      toast.success("Status updated");

      fetchAdmins();

    } catch (err) {

      toast.error("Failed to update");

    }

  };

  const deleteAdmin = async (id) => {

    if (!confirm("Delete this admin?")) return;

    try {

      await API.delete(`/superadmin/${id}`);

      toast.success("Admin deleted");

      fetchAdmins();

    } catch (err) {

      toast.error("Delete failed");

    }

  };

  return (

    <div className="min-h-screen bg-gray-50 p-8">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-6 text-green-700">
          SuperAdmin Dashboard
        </h1>


        {/* CREATE ADMIN FORM */}

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


        {/* ADMIN TABLE */}

        <div className="bg-white shadow rounded-lg overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>

              </tr>

            </thead>

            <tbody>

              {admins.map((admin) => (

                <tr
                  key={admin._id}
                  className="border-t"
                >

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

                  <td className="p-4 flex gap-3">

                    <button
                      onClick={() => toggleStatus(admin._id)}
                      className="text-blue-600 hover:underline"
                    >
                      Toggle
                    </button>

                    <button
                      onClick={() => deleteAdmin(admin._id)}
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

      </div>

    </div>

  );

}