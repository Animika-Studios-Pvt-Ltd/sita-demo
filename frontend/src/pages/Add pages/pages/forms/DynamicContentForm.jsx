import React from "react";

export default function DynamicContentForm({ content, onUpdate, type }) {
    const handleChange = (field, value) => {
        onUpdate(field, value);
    };

    return (
        <div className="space-y-4">
            <div className="bg-white/70 backdrop-blur-xl p-4 rounded-lg border border-white/70 ring-1 ring-black/5 mb-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-1 capitalize">
                    {type} Settings
                </h4>
                <p className="text-sm text-slate-600">
                    This section will automatically display the 3 latest {type}.
                </p>
            </div>

            {/* Section Title */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Section Title
                </label>
                <input
                    type="text"
                    value={content.title || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full px-3 py-2 bg-white/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder={`Latest ${type}...`}
                />
            </div>

            {/* Item Count */}
            {/* <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Number of Items to Display
                </label>
                <select
                    value={content.count || 3}
                    onChange={(e) => handleChange("count", parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-white/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                    {[3, 4, 6, 8, 9, 12].map((num) => (
                        <option key={num} value={num}>
                            {num} Items
                        </option>
                    ))}
                </select>
            </div> */}
        </div>
    );
}
