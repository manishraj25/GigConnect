import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ArrowBigLeft } from "lucide-react";

const ClientProfile =() => {
  const { user } = useContext(AuthContext);
  return (
    <div className="p-6">
        <div>
            <button><ArrowBigLeft/></button>
            <h2 className="text-2xl font-bold mb-4">Client Profile</h2>
        </div>
      <div className="bg-white p-6 rounded shadow">
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>
    </div>
  );
};
export default ClientProfile;
