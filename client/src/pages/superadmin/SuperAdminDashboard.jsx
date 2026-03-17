import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";
import toast from "react-hot-toast";

export default function SuperAdminDashboard() {

  const [admins, setAdmins] = useState([]);

  const fetchAdmins = async () => {

    const toastId = toast.loading("Fetching admins...");

    try {

      const res = await API.get("/superadmin/users");

      setAdmins(res.data.data);

      toast.success("Admins loaded", { id: toastId });

    } catch (err) {

      toast.error("Failed to fetch admins", { id: toastId });

    }

  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (

    <div className="max-w-6xl mx-auto">

      <h1 className="text-3xl font-bold mb-6 text-green-700">
        SuperAdmin Dashboard
      </h1>

      <div className="bg-white shadow rounded-lg overflow-x-auto">

        <table className="w-full text-left">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Status</th>
            </tr>

          </thead>

          <tbody>

            {admins.length === 0 && (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
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

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}