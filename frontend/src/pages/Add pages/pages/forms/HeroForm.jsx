// frontend/src/components/Admin/Cms/PageEditor/SectionForms/HeroForm.jsx

import React, { useState } from "react";
import { Upload, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { api } from "../../../../utils/api";

export default function HeroForm({ content, onUpdate }) {
  const [uploadingBg, setUploadingBg] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    content: true,
    background: false,
    cta: false,
    layout: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Upload background image
  const handleBgUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingBg(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await api.upload("/api/cms/upload", formData);
      if (response.url) {
        onUpdate("backgroundImage", response.url);
      }
    } catch (error) {
      alert("❌ Upload failed: " + error.message);
    } finally {
      setUploadingBg(false);
    }
  };

  return (
    <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
      {/* Hero Content Section */}
      <AccordionSection
        title="📝 Hero Content"
        isExpanded={expandedSections.content}
        onToggle={() => toggleSection("content")}
      >
        <div className="space-y-4">
          <FormField
            label="Main Title"
            value={content.title || ""}
            onChange={(val) => onUpdate("title", val)}
            placeholder="Welcome to Our Hospital"
            helpText="Large, bold text that grabs attention"
          />

          <FormField
            label="Subtitle / Description"
            value={content.subtitle || ""}
            onChange={(val) => onUpdate("subtitle", val)}
            placeholder="Providing quality healthcare with compassion"
            multiline
            rows={3}
            helpText="Supporting text that explains your value proposition"
          />

          <FormField
            label="Additional Text (Optional)"
            value={content.description || ""}
            onChange={(val) => onUpdate("description", val)}
            placeholder="Any additional information..."
            multiline
            rows={2}
          />
        </div>
      </AccordionSection>

      {/* Background Styling Section */}
      <AccordionSection
        title="🎨 Background Style"
        isExpanded={expandedSections.background}
        onToggle={() => toggleSection("background")}
      >
        <div className="space-y-4">
          {/* Background Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onUpdate("backgroundType", "color")}
                className={`px-3 py-2 rounded-lg border-2 text-sm transition-all ${(content.backgroundType || "color") === "color"
                    ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                    : "border-gray-300 hover:border-gray-400"
                  }`}
              >
                🎨 Color
              </button>
              <button
                type="button"
                onClick={() => onUpdate("backgroundType", "gradient")}
                className={`px-3 py-2 rounded-lg border-2 text-sm transition-all ${content.backgroundType === "gradient"
                    ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                    : "border-gray-300 hover:border-gray-400"
                  }`}
              >
                🌈 Gradient
              </button>
              <button
                type="button"
                onClick={() => onUpdate("backgroundType", "image")}
                className={`px-3 py-2 rounded-lg border-2 text-sm transition-all ${content.backgroundType === "image"
                    ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                    : "border-gray-300 hover:border-gray-400"
                  }`}
              >
                🖼️ Image
              </button>
            </div>
          </div>

          {/* Conditional Rendering Based on Type */}
          {(content.backgroundType || "color") === "color" && (
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker
                label="Background"
                value={content.backgroundColor || "#ffffff"}
                onChange={(val) => onUpdate("backgroundColor", val)}
              />
              <ColorPicker
                label="Text Color"
                value={content.textColor || "#000000"}
                onChange={(val) => onUpdate("textColor", val)}
              />
            </div>
          )}

          {content.backgroundType === "gradient" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <ColorPicker
                  label="Start"
                  value={content.gradientStart || "#3b82f6"}
                  onChange={(val) => onUpdate("gradientStart", val)}
                />
                <ColorPicker
                  label="End"
                  value={content.gradientEnd || "#8b5cf6"}
                  onChange={(val) => onUpdate("gradientEnd", val)}
                />
              </div>
              <ColorPicker
                label="Text Color"
                value={content.textColor || "#ffffff"}
                onChange={(val) => onUpdate("textColor", val)}
              />
            </div>
          )}

          {content.backgroundType === "image" && (
            <div className="space-y-3">
              {/* Image Upload */}
              <div>
                {content.backgroundImage ? (
                  <div className="relative">
                    <img
                      src={content.backgroundImage}
                      alt="Background"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => onUpdate("backgroundImage", "")}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-gray-50">
                    <Upload className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">
                      {uploadingBg ? "Uploading..." : "Upload Background"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBgUpload}
                      className="hidden"
                      disabled={uploadingBg}
                    />
                  </label>
                )}
              </div>

              {/* Overlay */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={content.overlayEnabled || false}
                  onChange={(e) => onUpdate("overlayEnabled", e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Dark Overlay</span>
                {content.overlayEnabled && (
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={content.overlayOpacity || 50}
                    onChange={(e) => onUpdate("overlayOpacity", parseInt(e.target.value))}
                    className="flex-1 ml-2"
                  />
                )}
              </label>

              <ColorPicker
                label="Text Color"
                value={content.textColor || "#ffffff"}
                onChange={(val) => onUpdate("textColor", val)}
              />
            </div>
          )}
        </div>
      </AccordionSection>

      {/* Call-to-Action Buttons */}
      <AccordionSection
        title="🎯 CTA Buttons"
        isExpanded={expandedSections.cta}
        onToggle={() => toggleSection("cta")}
      >
        <div className="space-y-4">
          {/* Primary CTA */}
          <div className="border rounded-lg p-3 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-sm text-blue-800">Primary Button</h4>
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={content.primaryCta?.enabled !== false}
                  onChange={(e) => onUpdate("primaryCta.enabled", e.target.checked)}
                  className="w-3.5 h-3.5"
                />
                <span className="text-blue-700">Show</span>
              </label>
            </div>

            {content.primaryCta?.enabled !== false && (
              <div className="space-y-2">
                <FormField
                  label="Text"
                  value={content.primaryCta?.label || ""}
                  onChange={(val) => onUpdate("primaryCta.label", val)}
                  placeholder="Get Started"
                  compact
                />
                <FormField
                  label="Link"
                  value={content.primaryCta?.href || ""}
                  onChange={(val) => onUpdate("primaryCta.href", val)}
                  placeholder="/signup"
                  compact
                />
                <div className="grid grid-cols-2 gap-2">
                  <ColorPicker
                    label="Button"
                    value={content.primaryCta?.bgColor || "#3b82f6"}
                    onChange={(val) => onUpdate("primaryCta.bgColor", val)}
                    compact
                  />
                  <ColorPicker
                    label="Text"
                    value={content.primaryCta?.textColor || "#ffffff"}
                    onChange={(val) => onUpdate("primaryCta.textColor", val)}
                    compact
                  />
                </div>
              </div>
            )}
          </div>

          {/* Secondary CTA */}
          <div className="border rounded-lg p-3 bg-gray-50 border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-sm text-gray-800">Secondary Button</h4>
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={content.secondaryCta?.enabled !== false}
                  onChange={(e) => onUpdate("secondaryCta.enabled", e.target.checked)}
                  className="w-3.5 h-3.5"
                />
                <span className="text-gray-700">Show</span>
              </label>
            </div>

            {content.secondaryCta?.enabled !== false && (
              <div className="space-y-2">
                <FormField
                  label="Text"
                  value={content.secondaryCta?.label || ""}
                  onChange={(val) => onUpdate("secondaryCta.label", val)}
                  placeholder="Learn More"
                  compact
                />
                <FormField
                  label="Link/Action"
                  value={content.secondaryCta?.href || content.secondaryCta?.action || ""}
                  onChange={(val) => onUpdate("secondaryCta.href", val)}
                  placeholder="/about or hospitalLogin"
                  compact
                />
                <div className="grid grid-cols-2 gap-2">
                  <ColorPicker
                    label="Button"
                    value={content.secondaryCta?.bgColor || "#6b7280"}
                    onChange={(val) => onUpdate("secondaryCta.bgColor", val)}
                    compact
                  />
                  <ColorPicker
                    label="Text"
                    value={content.secondaryCta?.textColor || "#ffffff"}
                    onChange={(val) => onUpdate("secondaryCta.textColor", val)}
                    compact
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-800">
            <strong>💡 Tip:</strong> Use "hospitalLogin" as action for login button
          </div>
        </div>
      </AccordionSection>

      {/* Layout Options */}
      <AccordionSection
        title="📐 Layout"
        isExpanded={expandedSections.layout}
        onToggle={() => toggleSection("layout")}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Alignment
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["left", "center", "right"].map((align) => (
                <button
                  key={align}
                  type="button"
                  onClick={() => onUpdate("textAlign", align)}
                  className={`px-3 py-2 rounded-lg border text-sm capitalize transition-all ${(content.textAlign || "center") === align
                      ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                      : "border-gray-300 hover:border-gray-400"
                    }`}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hero Height
            </label>
            <select
              value={content.height || "medium"}
              onChange={(e) => onUpdate("height", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="small">Small (400px)</option>
              <option value="medium">Medium (600px)</option>
              <option value="large">Large (800px)</option>
              <option value="fullscreen">Full Screen</option>
            </select>
          </div>
        </div>
      </AccordionSection>
    </div>
  );
}

// Accordion Section Component
function AccordionSection({ title, isExpanded, onToggle, children }) {
  return (
    <div className="border-b last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <h3 className="font-semibold text-base text-gray-800">{title}</h3>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isExpanded && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
}

// Reusable Form Field Component
function FormField({ label, value, onChange, placeholder, multiline = false, rows = 3, helpText, compact = false }) {
  return (
    <div>
      <label className={`block font-medium text-gray-700 mb-1 ${compact ? 'text-xs' : 'text-sm'}`}>
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${compact ? 'text-sm' : ''}`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${compact ? 'text-sm' : ''}`}
        />
      )}
      {helpText && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
}

// Color Picker Component
function ColorPicker({ label, value, onChange, compact = false }) {
  return (
    <div>
      <label className={`block font-medium text-gray-700 mb-1 ${compact ? 'text-xs' : 'text-sm'}`}>
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`rounded cursor-pointer border border-gray-300 ${compact ? 'h-8 w-16' : 'h-10 w-20'}`}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className={`flex-1 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono ${compact ? 'text-xs' : 'text-sm'}`}
        />
      </div>
    </div>
  );
}
