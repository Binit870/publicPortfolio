import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";
import toast from "react-hot-toast";

export default function AdminPermissionPage() {

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAdmins = async () => {
    const toastId = toast.loading("Loading admins...");
    try {
      const res = await API.get("/superadmin/users");
      setAdmins(res.data.data);
      toast.success("Admins loaded", { id: toastId });
    } catch (err) {
      toast.error("Failed to load admins", { id: toastId });
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleTogglePermission = async (adminId, key, value) => {
    setLoading(true);

    try {
      const admin = admins.find((a) => a._id === adminId);

      const updatedPermissions = {
        ...admin.permissions,
        [key]: !value,
      };

      await API.patch(`/superadmin/users/${adminId}/permissions`, {
        permissions: updatedPermissions,
      });

      setAdmins((prev) =>
        prev.map((a) =>
          a._id === adminId
            ? { ...a, permissions: updatedPermissions }
            : a
        )
      );

      toast.success("Permission updated");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">

      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-indigo-700">
        Admin Permissions
      </h1>

      <div className="space-y-4">

        {admins.length === 0 && (
          <p className="text-center text-gray-500">No admins found</p>
        )}

        {admins.map((admin) => (
          <div
            key={admin._id}
            className="bg-white shadow rounded-xl p-4 md:p-5"
          >
            <div className="mb-3">
              <h2 className="font-semibold">{admin.name}</h2>
              <p className="text-sm text-gray-500">{admin.email}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Object.entries(admin.permissions).map(
                ([key, value]) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 text-sm cursor-pointer bg-gray-50 px-2 py-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={value}
                      disabled={loading}
                      onChange={() =>
                        handleTogglePermission(
                          admin._id,
                          key,
                          value
                        )
                      }
                    />
                    {key}
                  </label>
                )
              )}
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}