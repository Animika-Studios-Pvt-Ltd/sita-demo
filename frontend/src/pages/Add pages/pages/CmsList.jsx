import React, { useEffect, useState } from "react";
import { api } from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Plus } from "lucide-react";

const SYSTEM_PAGES = ["home", "header", "footer"];

/* ================= ACTION BUTTON BASE (GLASS) ================= */
const actionBtnBase =
    "px-3 py-1 rounded-full text-xs font-medium " +
    "bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 shadow-sm " +
    "hover:bg-white/90 transition-colors duration-200 ";

export default function CmsList() {
    const [pages, setPages] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/api/cms/pages").then((res) => {
            setPages(Array.isArray(res) ? res : []);
        });
    }, []);

    /* ---------- SORT: Draft first, then latest ---------- */
    const sortedPages = [...pages].sort((a, b) => {
        // status="draft" should come before "published"
        if (a.suspended !== b.suspended) {
            return a.suspended ? -1 : 1; // drafts first
        }

        return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    /* ---------- TOGGLE STATUS ---------- */
    const toggleStatus = async (page) => {
        if (SYSTEM_PAGES.includes(page.slug)) {
            Swal.fire(
                "Action not allowed",
                `"${page.slug}" is a system page and cannot be unpublished.`,
                "info"
            );
            return;
        }

        const nextSuspended = !page.suspended;

        const res = await Swal.fire({
            title: nextSuspended ? "Unpublish this page?" : "Publish this page?",
            text: nextSuspended
                ? "This page will no longer be visible to users."
                : "This page will go live immediately.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: nextSuspended ? "Unpublish" : "Publish",
        });

        if (!res.isConfirmed) return;

        try {
            await api.put(`/api/cms/pages/${page._id}/suspend`, {
                suspended: nextSuspended,
            });

            setPages((prev) =>
                prev.map((p) =>
                    p._id === page._id
                        ? {
                            ...p,
                            suspended: nextSuspended,
                            status: nextSuspended ? "draft" : "published",
                        }
                        : p
                )
            );

            Swal.fire("Updated!", "Page status updated.", "success");
        } catch (err) {
            console.error(err);
            Swal.fire("Error!", "Failed to update status", "error");
        }
    };


    /* ---------- DELETE ---------- */
    const deletePage = async (page) => {
        if (SYSTEM_PAGES.includes(page.slug)) {
            Swal.fire(
                "Action not allowed",
                `"${page.slug}" is a system page and cannot be deleted.`,
                "info"
            );
            return;
        }

        const res = await Swal.fire({
            title: "Delete this page?",
            html: `<b>${page.slug}</b><br/>This action cannot be undone.`,
            icon: "error",
            showCancelButton: true,
            confirmButtonText: "Delete",
        });

        if (!res.isConfirmed) return;

        try {
            await api.delete(`/api/cms/pages/${page.slug}`);
            setPages((prev) => prev.filter((p) => p._id !== page._id));
            Swal.fire("Deleted!", "Page has been removed.", "success");
        } catch (err) {
            console.error(err);
            Swal.fire("Error!", "Failed to delete page", "error");
        }
    };

    if (!sortedPages.length) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <p className="mb-4 text-lg font-medium">No CMS pages yet.</p>
                <button
                    onClick={() => navigate("/dashboard/cms/new")}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-br from-white/95 to-slate-50/80 backdrop-blur-xl border border-[#7A1F2B] ring-1 ring-black/5 text-[#7A1F2B] font-semibold shadow-[0_12px_20px_-16px_rgba(15,23,42,0.45)] hover:shadow-[0_14px_22px_-16px_rgba(15,23,42,0.5)] transition-colors duration-200"
                >
                    <Plus className="w-4 h-4" />
                    Create one
                </button>
            </div>
        );
    }

    const query = searchTerm.trim().toLowerCase();
    const filteredPages = sortedPages.filter((p) => {
        if (!query) return true;
        return [p.slug, p.title, p.name]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(query));
    });

    return (
        <div className="overflow-hidden backdrop-blur">
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="w-full md:w-auto">
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search events..."
                        className="w-full sm:w-64 bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 rounded-full px-4 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-white/80"
                    />
                </div>
                <div className="w-full md:w-auto flex md:justify-end">
                    <button
                        onClick={() => navigate("/dashboard/cms/new")}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-br from-white/95 to-slate-50/80 backdrop-blur-xl border-1 border-[#7A1F2B] ring-1 ring-black/5 text-[#7A1F2B] font-semibold shadow-[0_12px_20px_-16px_rgba(15,23,42,0.45)] hover:shadow-[0_14px_22px_-16px_rgba(15,23,42,0.5)] transition-colors duration-200 text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        New Page
                    </button>
                </div>
            </div>

            <div className="hidden md:block overflow-x-auto">
                <table className="w-full table-auto border-collapse text-sm">
                    <thead>
                        <tr className="bg-gradient-to-br from-[#7A1F2B]/10 via-white/90 to-white/80 text-slate-500 uppercase text-xs font-semibold border border-white/70">
                            <th className="px-6 py-3 text-left">#</th>
                            <th className="px-6 py-3 text-left">Links</th>
                            <th className="px-6 py-3 text-center">Status</th>
                            <th className="px-6 py-3 text-center">Updated</th>
                            <th className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredPages.length > 0 ? filteredPages.map((p, index) => {
                            const isSystem = SYSTEM_PAGES.includes(p.slug);
                            const isPublished = !p.suspended;

                            return (
                                <tr
                                    key={p._id}
                                    className="border-b hover:bg-white/70 transition-colors duration-200"
                                >
                                    {/* SLUG */}
                                    <td className="px-6 py-4 text-sm">{index + 1}</td>
                                    <td className="px-6 py-4 font-mono text-slate-700">
                                        {p.slug}
                                        {isSystem && (
                                            <span className="ml-2 text-[10px] text-[#7A1F2B] font-semibold">
                                                (system)
                                            </span>
                                        )}
                                    </td>

                                    {/* STATUS */}
                                    <td className="px-6 py-4 text-center">
                                        <span
                                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-[1.5px]
                                            ${isPublished
                                                    ? "bg-emerald-50/80 text-emerald-800 border-emerald-300"
                                                    : "bg-amber-50/80 text-amber-800 border-amber-300"
                                                }`}>

                                            <span
                                                className={`h-2 w-2 rounded-full ${isPublished
                                                    ? "bg-emerald-600"
                                                    : "bg-amber-600"
                                                    }`}
                                            />

                                            {/* LABEL */}
                                            {isPublished ? "Published" : "Unpublished"}
                                        </span>
                                    </td>



                                    {/* UPDATED */}
                                    <td className="px-6 py-4 text-center text-slate-600">
                                        {new Date(p.updatedAt).toLocaleDateString()}
                                    </td>

                                    {/* ACTIONS */}
                                    <td className="px-6 py-4 flex gap-2 justify-center flex-wrap">
                                        {/* EDIT */}
                                        <button
                                            onClick={() => navigate(`/dashboard/cms/edit/${p.slug}`)}
                                            className={`${actionBtnBase} text-blue-700`}
                                        >
                                            Edit
                                        </button>

                                        {/* PUBLISH / UNPUBLISH */}
                                        <button
                                            onClick={() => toggleStatus(p)}
                                            disabled={isSystem}
                                            className={`${actionBtnBase} ${isSystem
                                                ? "opacity-40 cursor-not-allowed bg-white/60 border-white/60"
                                                : isPublished
                                                    ? "text-amber-700"
                                                    : "text-emerald-700"
                                                }`}
                                        >
                                            {isPublished ? "Unpublish" : "Publish"}
                                        </button>

                                        {/* DELETE */}
                                        <button
                                            onClick={() => deletePage(p)}
                                            disabled={isSystem}
                                            className={`${actionBtnBase} ${isSystem
                                                ? "opacity-40 cursor-not-allowed bg-white/60 border-white/60"
                                                : "text-red-600"
                                                }`}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan="5" className="text-center py-6 text-slate-500">
                                    No matching pages found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="md:hidden space-y-4">
                {filteredPages.length > 0 ? (
                    filteredPages.map((p, index) => {
                        const isSystem = SYSTEM_PAGES.includes(p.slug);
                        const isPublished = !p.suspended;

                        return (
                            <div
                                key={p._id}
                                className="bg-white/70 backdrop-blur-xl p-4 rounded-2xl border border-white/70 ring-1 ring-black/5 shadow-sm flex flex-col space-y-3"
                            >
                                <div className="font-semibold text-sm text-slate-800">
                                    {index + 1}. {p.slug}
                                    {isSystem && (
                                        <span className="ml-2 text-[10px] text-[#7A1F2B] font-semibold">
                                            (system)
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm text-slate-600">
                                    Updated: {new Date(p.updatedAt).toLocaleDateString()}
                                </div>
                                <div>
                                    <span
                                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border
                                            ${isPublished
                                                ? "bg-emerald-50/70 text-emerald-800 border-emerald-300"
                                                : "bg-amber-50/70 text-amber-800 border-amber-300"
                                            }`}
                                    >
                                        <span
                                            className={`h-2 w-2 rounded-full ${isPublished
                                                ? "bg-emerald-600"
                                                : "bg-amber-600"
                                                }`}
                                        />
                                        {isPublished ? "Published" : "Unpublished"}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => navigate(`/dashboard/cms/edit/${p.slug}`)}
                                        className={`${actionBtnBase} text-blue-700`}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => toggleStatus(p)}
                                        disabled={isSystem}
                                        className={`${actionBtnBase} ${isSystem
                                            ? "opacity-40 cursor-not-allowed bg-white/60 border-white/60"
                                            : isPublished
                                                ? "text-amber-700"
                                                : "text-emerald-700"
                                            }`}
                                    >
                                        {isPublished ? "Unpublish" : "Publish"}
                                    </button>
                                    <button
                                        onClick={() => deletePage(p)}
                                        disabled={isSystem}
                                        className={`${actionBtnBase} ${isSystem
                                            ? "opacity-40 cursor-not-allowed bg-white/60 border-white/60"
                                            : "text-red-600"
                                            }`}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-6 text-slate-500">No matching pages found.</div>
                )}
            </div>
        </div>
    );
}
