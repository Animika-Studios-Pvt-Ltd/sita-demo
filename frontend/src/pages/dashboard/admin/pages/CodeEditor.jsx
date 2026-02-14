import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { api } from "../../../../utils/api";
import { Save, AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";

export default function CodeEditor() {
    const { fileKey } = useParams();
    const navigate = useNavigate();
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (fileKey) {
            fetchCode();
        }
    }, [fileKey]);

    const fetchCode = async () => {
        setLoading(true);
        try {
            // Corrected endpoint path based on admin.routes.js: /api/admin/files/:fileKey
            const res = await api.get(`/api/admin/files/${fileKey}`);
            setCode(res.content || "");
        } catch (err) {
            console.error("Failed to load code:", err);
            Swal.fire("Error", "Failed to load file content", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        // Safety Check
        const result = await Swal.fire({
            title: "⚠️ Advanced Feature",
            text: `You are editing ${fileKey}.jsx directly. A syntax error could crash the page. Are you sure?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, Save Changes",
        });

        if (!result.isConfirmed) return;

        setSaving(true);
        try {
            await api.post(`/api/admin/files/${fileKey}`, { content: code });
            Swal.fire({
                icon: "success",
                title: "Saved!",
                text: "Changes applied. You may need to refresh the page.",
                timer: 1500,
            });
        } catch (err) {
            console.error("Failed to save:", err);
            Swal.fire("Error", "Failed to save changes", "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7A1F2B]"></div>
            </div>
        );
    }

    return (
        <div className="font-montserrat">
            {/* Header */}
            <div className="bg-white/70 backdrop-blur-xl border-b border-white/70 p-4 sticky top-0 z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/dashboard/manage-pages")}
                        className="p-2 hover:bg-slate-100 rounded-full transition"
                        title="Back to Manage Pages"
                    >
                        <ArrowLeft size={20} className="text-slate-600" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <span className="text-[#7A1F2B]">&lt;/&gt;</span> {fileKey?.charAt(0).toUpperCase() + fileKey?.slice(1)} Editor
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Editing: <code>{fileKey}.jsx</code>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchCode}
                        className="p-2 text-slate-500 hover:text-[#7A1F2B] transition-colors"
                        title="Reload File"
                    >
                        <RefreshCw size={20} />
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white shadow-lg transition-all ${saving
                            ? "bg-slate-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-[#7A1F2B] to-[#9d2b3a] hover:shadow-xl hover:-translate-y-0.5"
                            }`}
                    >
                        <Save size={18} />
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            {/* Editor */}
            <div className="h-[calc(100vh-140px)] w-full border-t border-slate-200">
                <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    value={code}
                    onChange={(value) => setCode(value)}
                    theme="vs-dark"
                    options={{
                        minimap: { enabled: true },
                        fontSize: 14,
                        wordWrap: "on",
                        automaticLayout: true,
                        tabSize: 2,
                    }}
                />
            </div>
        </div>
    );
}
