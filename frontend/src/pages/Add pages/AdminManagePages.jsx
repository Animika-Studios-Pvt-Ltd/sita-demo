import React from "react";
import CmsList from "./pages/CmsList";

const AdminManagePages = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Pages</h1>
        <p className="text-gray-500">Organize and manage your website content.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <CmsList />
      </div>
    </div>
  );
};

export default AdminManagePages;
