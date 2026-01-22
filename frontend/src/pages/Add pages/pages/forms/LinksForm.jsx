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
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Section Title
        </label>
        <input
          type="text"
          value={content.title || ""}
          onChange={(e) => onUpdate("title", e.target.value)}
          placeholder="Quick Links"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm text-gray-700">Link Items</h4>
          <button
            onClick={addItem}
            className="flex items-center gap-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            <Plus size={16} />
            Add Link
          </button>
        </div>

        {items.map((item, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <ExternalLink size={14} />
                Link #{idx + 1}
              </span>
              <button
                onClick={() => deleteItem(idx)}
                className="
          p-1 rounded-full
          bg-rose-50/80 backdrop-blur-sm
          border border-[1.5px] border-rose-300
          ring-1 ring-inset ring-rose-200
          text-rose-700
          hover:bg-rose-100
          transition ml-2
        "
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={item.href}
                onChange={(e) => updateItem(idx, "href", e.target.value)}
                placeholder="/path or https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
            No links yet. Click "Add Link" to create one.
          </div>
        )}
      </div>
    </div>
  );
}
