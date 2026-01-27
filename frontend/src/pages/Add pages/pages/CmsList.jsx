import React, { useEffect, useState } from "react";
import { api } from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Plus } from "lucide-react";

const SYSTEM_PAGES = ["home", "header", "footer"];

/* ================= STATUS PILL (NO SHADOW) ================= */
function statusPill(status) {
    const base =
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold " +
        "border backdrop-blur-sm tracking-wide";

    if (status === "published") {
        return `${base} bg-emerald-50/70 text-emerald-800 border-emerald-300`;
    }

    return `${base} bg-amber-50/70 text-amber-800 border-amber-300`;
}

/* ================= ACTION BUTTON BASE (FLAT) ================= */
const actionBtnBase =
    "px-3 py-1 rounded-full text-xs font-medium " +
    "border backdrop-blur-sm transition";

export default function CmsList() {
    const [pages, setPages] = useState([]);
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
                <p className="mb-4 text-lg">No CMS pages yet.</p>
                <button
                    onClick={() => navigate("/dashboard/cms/new")}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                >
                    <Plus className="w-4 h-4" />
                    Create one ✨
                </button>
            </div>
        );
    }

    return (
        <div className="overflow-hidden backdrop-blur">
            <div className="mb-4 flex justify-end">
                <button
                    onClick={() => navigate("/dashboard/cms/new")}
                    className="flex items-center gap-2 px-4 py-2 text-white rounded-full bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-600 hover:to-orange-400 transition shadow-sm text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    New Event Page
                </button>
            </div>

            <table className="w-full text-sm">
                <thead className="bg-white/70 border-b border-slate-200/70">
                    <tr>
                        <th className="p-3 text-left">Links</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-center">Updated</th>
                        <th className="p-3 text-center">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {sortedPages.map((p) => {
                        const isSystem = SYSTEM_PAGES.includes(p.slug);
                        const isPublished = !p.suspended;

                        return (
                            <tr
                                key={p._id}
                                className="border-t border-slate-200/60 hover:bg-white/50 transition"
                            >
                                {/* SLUG */}
                                <td className="p-3 font-mono text-slate-700">
                                    {p.slug}
                                    {isSystem && (
                                        <span className="ml-2 text-[10px] text-indigo-600 font-semibold">
                                            (system)
                                        </span>
                                    )}
                                </td>

                                {/* STATUS */}
                                <td className="p-3 text-center">
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
                                <td className="p-3 text-center text-slate-600">
                                    {new Date(p.updatedAt).toLocaleDateString()}
                                </td>

                                {/* ACTIONS */}
                                <td className="p-3 flex gap-2 justify-center flex-wrap">
                                    {/* EDIT */}
                                    <button
                                        onClick={() => navigate(`/dashboard/cms/edit/${p.slug}`)}
                                        className={`${actionBtnBase}bg-blue-50/70 text-blue-700 border-blue-300 hover:bg-blue-100`}>
                                        Edit
                                    </button>

                                    {/* PUBLISH / UNPUBLISH */}
                                    <button
                                        onClick={() => toggleStatus(p)}
                                        disabled={isSystem}
                                        className={`${actionBtnBase} ${isSystem
                                            ? "opacity-40 cursor-not-allowed bg-slate-200 border-slate-300"
                                            : isPublished
                                                ? "bg-amber-50/70 text-amber-800 border-amber-300 hover:bg-amber-100"
                                                : "bg-emerald-50/70 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                                            }`}
                                    >
                                        {isPublished ? "Unpublish" : "Publish"}
                                    </button>

                                    {/* DELETE */}
                                    <button
                                        onClick={() => deletePage(p)}
                                        disabled={isSystem}
                                        className={`${actionBtnBase} ${isSystem
                                            ? "opacity-40 cursor-not-allowed bg-slate-200 border-slate-300"
                                            : "bg-rose-50/70 text-rose-800 border-rose-300 hover:bg-rose-100"
                                            }`}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
