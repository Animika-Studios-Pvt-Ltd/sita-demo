import React from "react";
import { Plus, Trash2, ExternalLink } from "lucide-react";

export default function LinksForm({ content, onUpdate }) {
  const items = content.items || [];

  const addItem = () => {
    onUpdate("items", [...items, { label: "", href: "" }]);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate("items", updated);
  };

  const deleteItem = (index) => {
    onUpdate("items", items.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 rounded-2xl p-6 space-y-5">
      <h3 className="text-lg font-semibold text-[#7A1F2B] border-b border-white/70 pb-2">
        Links Section
      </h3>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Section Title
        </label>
        <input
          type="text"
          value={content.title || ""}
          onChange={(e) => onUpdate("title", e.target.value)}
          placeholder="Quick Links"
          className="w-full px-4 py-2 bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-white/80 text-sm"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm text-slate-700">Link Items</h4>
          <button
            onClick={addItem}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-br from-white/95 to-slate-50/80 backdrop-blur-xl border border-[#7A1F2B] text-[#7A1F2B] ring-1 ring-black/5 hover:bg-white/90 transition-colors"
          >
            <Plus size={16} />
            Add Link
          </button>
        </div>

        {items.map((item, idx) => (
          <div
            key={idx}
            className="border border-white/70 ring-1 ring-black/5 rounded-xl p-4 bg-white/70 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <ExternalLink size={14} />
                Link #{idx + 1}
              </span>
              <button
                onClick={() => deleteItem(idx)}
                className="p-2 rounded-full bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 text-red-600 hover:bg-white/90 transition ml-2"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={item.label}
                onChange={(e) => updateItem(idx, "label", e.target.value)}
                placeholder="Link Label"
                className="w-full px-4 py-2 bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-white/80 text-sm"
              />
              <input
                type="text"
                value={item.href}
                onChange={(e) => updateItem(idx, "href", e.target.value)}
                placeholder="/path or https://example.com"
                className="w-full px-4 py-2 bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-white/80 text-sm"
              />
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-8 text-slate-500 border-2 border-dashed border-white/70 rounded-xl bg-white/70 backdrop-blur-xl">
            No links yet. Click "Add Link" to create one.
          </div>
        )}
      </div>
    </div>
  );
}
