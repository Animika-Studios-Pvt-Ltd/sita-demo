// frontend/src/components/Dashboard/admin/pages/forms/HtmlForm.jsx

import React, { useState, useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import {
  HeadingNode,
  QuoteNode,
  $createHeadingNode,
} from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { CodeNode } from "@lexical/code";
import {
  $getRoot,
  $getSelection,
  $createTextNode,
  $createParagraphNode,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $isRangeSelection,
  $getNodeByKey,
} from "lexical";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Upload,
  Link as LinkIcon,
  Plus,
  Trash2,
  Layout,
  Grid3x3,
  Move,
  Type,
} from "lucide-react";
import { api } from "../../../../utils/api";
import { ImageNode, $createImageNode } from "./nodes/ImageNode";

// Lexical theme configuration
const theme = {
  paragraph: "mb-2 text-slate-700",
  heading: {
    h1: "text-3xl md:text-4xl font-semibold mb-4 mt-6 font-montserrat text-slate-800",
    h2: "text-2xl md:text-3xl font-semibold mb-3 mt-5 font-montserrat text-slate-800",
    h3: "text-xl md:text-2xl font-semibold mb-2 mt-4 font-montserrat text-slate-800",
  },
  list: {
    ul: "list-disc ml-6 mb-2",
    ol: "list-decimal ml-6 mb-2",
    listitem: "mb-1",
  },
  link: "text-[#7A1F2B] underline hover:text-[#5d1620] cursor-pointer",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
  },
  quote: "border-l-4 border-[#7A1F2B]/30 pl-4 italic text-slate-700 my-4",
  code: "bg-white/80 border border-white/70 rounded px-1 py-0.5 font-mono text-sm text-[#7A1F2B]",
};

// Bootstrap-style grid templates
const GRID_TEMPLATES = [
  { id: "col-12", label: "1 Column (Full Width)", icon: "▮", cols: [12] },
  { id: "col-6-6", label: "2 Equal Columns", icon: "▮▮", cols: [6, 6] },
  { id: "col-4-4-4", label: "3 Equal Columns", icon: "▮▮▮", cols: [4, 4, 4] },
  { id: "col-3-3-3-3", label: "4 Equal Columns", icon: "▮▮▮▮", cols: [3, 3, 3, 3] },
  { id: "col-8-4", label: "2/3 + 1/3", icon: "▮▮▯", cols: [8, 4] },
  { id: "col-4-8", label: "1/3 + 2/3", icon: "▯▮▮", cols: [4, 8] },
  { id: "col-3-6-3", label: "1/4 + 1/2 + 1/4", icon: "▯▮▯", cols: [3, 6, 3] },
  { id: "col-2-8-2", label: "Sidebar Layout", icon: "▯▮▮▯", cols: [2, 8, 2] },
];

// Font size options
const FONT_SIZES = [
  { label: "Small", value: "12px" },
  { label: "Normal", value: "16px" },
  { label: "Medium", value: "18px" },
  { label: "Large", value: "24px" },
  { label: "X-Large", value: "32px" },
  { label: "XX-Large", value: "48px" },
];

// Toolbar component
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [uploading, setUploading] = useState(false);
  const [fontSize, setFontSize] = useState("16px");

  const formatText = (format) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatAlignment = (alignment) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
  };

  const insertHeading = (level) => {
    editor.update(() => {
      const selection = $getSelection();
      if (selection) {
        const headingNode = $createHeadingNode(`h${level}`);
        const textNode = $createTextNode("");
        headingNode.append(textNode);
        selection.insertNodes([headingNode]);
      }
    });
  };

  const insertLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.update(() => {
        const selection = $getSelection();
        if (selection) {
          const linkText = window.prompt("Link text:", url);
          const textNode = $createTextNode(linkText || url);
          const linkNode = new LinkNode(url);
          linkNode.append(textNode);
          selection.insertNodes([linkNode]);
        }
      });
    }
  };

  // ✅ Apply font size to selected text
  const applyFontSize = (size) => {
    setFontSize(size);
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // Apply inline style to selected text
        selection.getNodes().forEach((node) => {
          const parent = node.getParent();
          if (parent) {
            parent.setStyle(`font-size: ${size}`);
          }
        });
      }
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      console.log("📤 Uploading image:", file.name);
      const response = await api.upload("/api/cms/upload", formData);
      console.log("✅ Upload response:", response);

      if (response.url) {
        editor.update(() => {
          const selection = $getSelection();
          const imageNode = $createImageNode({
            src: response.url,
            altText: file.name,
            width: 'auto', // ✅ Don't set fixed width
            height: 'auto', // ✅ Don't set fixed height
          });

          if (selection) {
            selection.insertNodes([imageNode]);
          } else {
            const root = $getRoot();
            root.append(imageNode);
          }
        });
      }
    } catch (error) {
      console.error("❌ Upload failed:", error);
      alert("❌ Upload failed: " + error.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="border-b border-white/70 bg-white/70 backdrop-blur-xl p-2 flex flex-wrap gap-1 sticky top-0 z-10 rounded-t-lg">
      <button
        onClick={() => formatText("bold")}
        className="p-2 rounded-lg text-slate-600 hover:text-[#7A1F2B] hover:bg-white/90 transition"
        title="Bold (Ctrl+B)"
        type="button"
      >
        <Bold size={18} />
      </button>

      <button
        onClick={() => formatText("italic")}
        className="p-2 rounded-lg text-slate-600 hover:text-[#7A1F2B] hover:bg-white/90 transition"
        title="Italic (Ctrl+I)"
        type="button"
      >
        <Italic size={18} />
      </button>

      <button
        onClick={() => formatText("underline")}
        className="p-2 rounded-lg text-slate-600 hover:text-[#7A1F2B] hover:bg-white/90 transition"
        title="Underline (Ctrl+U)"
        type="button"
      >
        <Underline size={18} />
      </button>

      <div className="w-px bg-slate-200/70 mx-1" />

      {/* ✅ Font Size Selector */}
      <div className="flex items-center gap-1">
        <Type size={18} className="text-slate-500" />
        <select
          value={fontSize}
          onChange={(e) => applyFontSize(e.target.value)}
          className="text-xs px-2 py-1 border border-white/70 bg-white/70 rounded hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-slate-200 text-slate-700"
          title="Font Size"
        >
          {FONT_SIZES.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
      </div>

      <div className="w-px bg-slate-200/70 mx-1" />

      <button
        onClick={() => insertHeading(1)}
        className="p-2 rounded-lg text-slate-600 hover:text-[#7A1F2B] hover:bg-white/90 transition"
        title="Heading 1"
        type="button"
      >
        <Heading1 size={18} />
      </button>

      <button
        onClick={() => insertHeading(2)}
        className="p-2 rounded-lg text-slate-600 hover:text-[#7A1F2B] hover:bg-white/90 transition"
        title="Heading 2"
        type="button"
      >
        <Heading2 size={18} />
      </button>

      <div className="w-px bg-slate-200/70 mx-1" />

      <button
        onClick={() => formatAlignment("left")}
        className="p-2 rounded-lg text-slate-600 hover:text-[#7A1F2B] hover:bg-white/90 transition"
        title="Align Left"
        type="button"
      >
        <AlignLeft size={18} />
      </button>

      <button
        onClick={() => formatAlignment("center")}
        className="p-2 rounded-lg text-slate-600 hover:text-[#7A1F2B] hover:bg-white/90 transition"
        title="Align Center"
        type="button"
      >
        <AlignCenter size={18} />
      </button>

      <button
        onClick={() => formatAlignment("right")}
        className="p-2 rounded-lg text-slate-600 hover:text-[#7A1F2B] hover:bg-white/90 transition"
        title="Align Right"
        type="button"
      >
        <AlignRight size={18} />
      </button>

      <div className="w-px bg-slate-200/70 mx-1" />

      <button
        onClick={insertLink}
        className="p-2 rounded-lg text-slate-600 hover:text-[#7A1F2B] hover:bg-white/90 transition"
        title="Insert Link"
        type="button"
      >
        <LinkIcon size={18} />
      </button>

      <label
        className="p-2 rounded-lg text-slate-600 hover:text-[#7A1F2B] hover:bg-white/90 cursor-pointer transition"
        title="Upload Image"
      >
        <Upload size={18} className={uploading ? "animate-pulse" : ""} />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          disabled={uploading}
        />
      </label>

      {uploading && (
        <span className="p-2 text-sm text-[#7A1F2B] font-medium">
          📤 Uploading...
        </span>
      )}
    </div>
  );
}

// Plugin to initialize editor with existing HTML content
function InitializeContentPlugin({ initialHtml }) {
  const [editor] = useLexicalComposerContext();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialHtml || initialized) return;

    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(initialHtml, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      root.clear();
      root.append(...nodes);
    });

    setInitialized(true);
  }, [editor, initialHtml, initialized]);

  return null;
}

// Plugin to convert Lexical state to HTML
function OnChangePluginWrapper({ onChange }) {
  const [editor] = useLexicalComposerContext();

  const handleChange = (editorState) => {
    editorState.read(() => {
      const htmlString = $generateHtmlFromNodes(editor);
      onChange(htmlString);
    });
  };

  return <OnChangePlugin onChange={handleChange} />;
}

// Bootstrap Grid Template Selector Component
function GridTemplateSelector({ onSelect, currentCols }) {
  const [showCustom, setShowCustom] = useState(false);
  const [customInput, setCustomInput] = useState("");

  const handleCustomSubmit = () => {
    const cols = customInput
      .split(",")
      .map((c) => parseInt(c.trim()))
      .filter((c) => !isNaN(c) && c > 0 && c <= 12);

    if (cols.length > 0 && cols.reduce((a, b) => a + b, 0) <= 12) {
      onSelect(cols);
      setShowCustom(false);
      setCustomInput("");
    } else {
      alert("Invalid grid. Sum must be ≤ 12 and each value 1-12");
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {GRID_TEMPLATES.map((template) => {
        const isActive =
          JSON.stringify(currentCols) === JSON.stringify(template.cols);
        return (
          <button
            key={template.id}
            onClick={() => onSelect(template.cols)}
            className={`p-4 border rounded-lg transition-all ring-1 ring-black/5 ${isActive
              ? "border-[#7A1F2B] bg-[#7A1F2B]/10 text-[#7A1F2B]"
              : "border-white/70 bg-white/70 text-slate-700 hover:border-[#7A1F2B]/40 hover:bg-white/90"
              }`}
            type="button"
          >
            <div className="text-2xl mb-2">{template.icon}</div>
            <div className="text-xs font-medium">{template.label}</div>
            <div className="text-xs text-slate-500 mt-1">
              {template.cols.join("-")}
            </div>
          </button>
        );
      })}

      {!showCustom ? (
        <button
          onClick={() => setShowCustom(true)}
          className="p-4 border border-dashed border-white/70 rounded-lg bg-white/70 hover:bg-white/90 hover:border-[#7A1F2B]/40 transition ring-1 ring-black/5 text-slate-700"
          type="button"
        >
          <Grid3x3 size={32} className="mx-auto mb-2 text-slate-500" />
          <div className="text-xs font-medium">Custom Grid</div>
        </button>
      ) : (
        <div className="col-span-2 md:col-span-4 p-4 border border-white/70 rounded-lg bg-white/70 ring-1 ring-black/5">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Enter column sizes (comma-separated, max 12 total):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g., 3,6,3 or 2,5,5"
              className="flex-1 px-3 py-2 bg-white/70 border border-white/70 ring-1 ring-black/5 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
            <button
              onClick={handleCustomSubmit}
              className="px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-br from-white/95 to-slate-50/80 backdrop-blur-xl border border-[#7A1F2B] text-[#7A1F2B] ring-1 ring-black/5 hover:bg-white/90"
              type="button"
            >
              Apply
            </button>
            <button
              onClick={() => {
                setShowCustom(false);
                setCustomInput("");
              }}
              className="px-4 py-2 rounded-full text-sm bg-white/70 border border-white/70 text-slate-700 ring-1 ring-black/5 hover:bg-white/90"
              type="button"
            >
              Cancel
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            💡 Example: "3,6,3" creates 1/4 + 1/2 + 1/4 layout
          </p>
        </div>
      )}
    </div>
  );
}

export default function HtmlForm({ content, onUpdate }) {
  const columns =
    content.columns && content.columns.length > 0
      ? content.columns.map((col) => ({
        ...col,
        colSize: col.colSize || 12,
      }))
      : [{ id: "col-1", content: "", colSize: 12 }];

  const applyGridTemplate = (colSizes) => {
    const newColumns = colSizes.map((size, index) => ({
      id: `col-${Date.now()}-${index}`,
      content: columns[index]?.content || "",
      colSize: size,
    }));
    onUpdate("columns", newColumns);
  };

  const addColumn = () => {
    const currentTotal = columns.reduce((sum, col) => sum + (col.colSize || 12), 0);
    const remainingSpace = 12 - currentTotal;

    if (remainingSpace <= 0) {
      alert("Grid is full (12 columns). Remove a column or adjust sizes first.");
      return;
    }

    const newColumns = [
      ...columns,
      {
        id: `col-${Date.now()}`,
        content: "",
        colSize: Math.min(remainingSpace, 6),
      },
    ];
    onUpdate("columns", newColumns);
  };

  const removeColumn = (index) => {
    if (columns.length <= 1) {
      alert("You must have at least one column");
      return;
    }
    const newColumns = columns.filter((_, i) => i !== index);
    onUpdate("columns", newColumns);
  };

  const updateColumnSize = (index, newSize) => {
    const size = parseInt(newSize);
    if (isNaN(size) || size < 1 || size > 12) return;

    const newColumns = [...columns];
    newColumns[index] = { ...newColumns[index], colSize: size };
    onUpdate("columns", newColumns);
  };

  const updateColumnContent = (index, html) => {
    const newColumns = [...columns];
    newColumns[index] = { ...newColumns[index], content: html };
    onUpdate("columns", newColumns);
  };

  const getColClass = (colSize) => {
    const size = colSize || 12;
    const sizeMap = {
      1: "md:col-span-1",
      2: "md:col-span-2",
      3: "md:col-span-3",
      4: "md:col-span-4",
      5: "md:col-span-5",
      6: "md:col-span-6",
      7: "md:col-span-7",
      8: "md:col-span-8",
      9: "md:col-span-9",
      10: "md:col-span-10",
      11: "md:col-span-11",
      12: "col-span-12",
    };
    return `col-span-12 ${sizeMap[size] || "md:col-span-6"}`;
  };

  const totalCols = columns.reduce((sum, col) => sum + (col.colSize || 12), 0);
  const currentColSizes = columns.map((col) => col.colSize || 12);

  return (
    <div className="space-y-6">
      {/* Section Title */}
      {/* <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-lg border border-purple-200">
        <h4 className="font-semibold text-purple-800 flex items-center gap-2">
          <Layout size={20} />
          Bootstrap-Style Grid Section
          <span className="text-xs font-normal text-purple-600">
            (12-column grid system)
          </span>
        </h4>
      </div> */}

      {/* Grid Template Selector */}
      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-white/70 ring-1 ring-black/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-semibold text-lg text-slate-800 flex items-center gap-2">
              <Grid3x3 size={20} className="text-[#7A1F2B]" />
              Choose Grid Layout
            </h4>
            <p className="text-sm text-slate-600 mt-1">
              Current: {totalCols}/12 columns used
              {totalCols > 12 && (
                <span className="text-rose-600 font-semibold ml-2">
                  ⚠️ Exceeds 12!
                </span>
              )}
            </p>
          </div>
          <button
            onClick={addColumn}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-br from-white/95 to-slate-50/80 backdrop-blur-xl border border-[#7A1F2B] text-[#7A1F2B] ring-1 ring-black/5 hover:bg-white/90 disabled:opacity-60 disabled:cursor-not-allowed"
            type="button"
            disabled={totalCols >= 12}
          >
            <Plus size={16} />
            Add Column
          </button>
        </div>

        <GridTemplateSelector
          onSelect={applyGridTemplate}
          currentCols={currentColSizes}
        />
      </div>

      {/* Style Settings */}
      <div className="bg-white/70 backdrop-blur-xl p-4 rounded-2xl border border-white/70 ring-1 ring-black/5">
        <h4 className="font-semibold text-sm text-[#7A1F2B] mb-4">
          📐 Section Style
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Background Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={content.style?.backgroundColor || "#ffffff"}
                onChange={(e) =>
                  onUpdate("style.backgroundColor", e.target.value)
                }
                className="h-10 w-16 border border-white/70 ring-1 ring-black/5 rounded cursor-pointer bg-white/70"
              />
              <input
                type="text"
                value={content.style?.backgroundColor || "#ffffff"}
                onChange={(e) =>
                  onUpdate("style.backgroundColor", e.target.value)
                }
                className="flex-1 px-3 py-2 bg-white/70 border border-white/70 ring-1 ring-black/5 rounded-lg text-sm font-mono text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="#ffffff"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Padding (Top/Bottom)
            </label>
            <select
              value={content.style?.padding || "py-12"}
              onChange={(e) => onUpdate("style.padding", e.target.value)}
              className="w-full px-3 py-2 bg-white/70 border border-white/70 ring-1 ring-black/5 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="py-4">Extra Small (16px)</option>
              <option value="py-6">Small (24px)</option>
              <option value="py-8">Small-Medium (32px)</option>
              <option value="py-12">Medium (48px)</option>
              <option value="py-16">Large (64px)</option>
              <option value="py-20">Extra Large (80px)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Column Gap
            </label>
            <select
              value={content.columnGap || "gap-6"}
              onChange={(e) => onUpdate("columnGap", e.target.value)}
              className="w-full px-3 py-2 bg-white/70 border border-white/70 ring-1 ring-black/5 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="gap-2">Small (8px)</option>
              <option value="gap-4">Medium (16px)</option>
              <option value="gap-6">Large (24px)</option>
              <option value="gap-8">Extra Large (32px)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Column Editors */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          📝 Column Content Editors
        </label>

        <div className={`grid grid-cols-12 ${content.columnGap || "gap-6"}`}>
          {columns.map((column, index) => {
            const editorConfig = {
              namespace: `HtmlColumn-${column.id}`,
              theme,
              onError: (error) => {
                console.error(`Lexical error in column ${index + 1}:`, error);
              },
              nodes: [
                HeadingNode,
                QuoteNode,
                ListNode,
                ListItemNode,
                LinkNode,
                CodeNode,
                ImageNode,
              ],
            };

            return (
              <div
                key={column.id}
                className={`${getColClass(column.colSize)} border-2 ${totalCols > 12 ? "border-rose-300" : "border-white/70"
                  } border-dashed rounded-2xl p-4 bg-white/70 backdrop-blur-xl ring-1 ring-black/5`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Move size={16} className="text-slate-400 cursor-move" />
                    <h5 className="text-sm font-semibold text-slate-700">
                      Column {index + 1}
                    </h5>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={column.colSize || 12}
                      onChange={(e) => updateColumnSize(index, e.target.value)}
                      className="text-xs px-2 py-1 border border-white/70 bg-white/70 rounded focus:outline-none focus:ring-2 focus:ring-slate-200 text-slate-700"
                      title="Column size (out of 12)"
                    >
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}/12
                        </option>
                      ))}
                    </select>
                    {columns.length > 1 && (
                      <button
                        onClick={() => removeColumn(index)}
                        className="p-2 rounded-full bg-white/70 border border-white/70 text-red-600 hover:bg-white/90 transition"
                        title="Remove column"
                        type="button"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="border border-white/70 ring-1 ring-black/5 rounded-xl overflow-hidden bg-white/70">
                  <LexicalComposer initialConfig={editorConfig}>
                    <ToolbarPlugin />
                    <div className="relative">
                      <RichTextPlugin
                        contentEditable={
                          <ContentEditable className="min-h-[200px] max-h-[400px] overflow-y-auto p-3 outline-none focus:ring-2 focus:ring-slate-200 focus:ring-inset text-sm text-slate-700" />
                        }
                        placeholder={
                          <div className="absolute top-3 left-3 text-slate-400 pointer-events-none text-sm">
                            Column {index + 1} content...
                          </div>
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                      />
                    </div>
                    <HistoryPlugin />
                    <ListPlugin />
                    <LinkPlugin />
                    <InitializeContentPlugin initialHtml={column.content || ""} />
                    <OnChangePluginWrapper
                      onChange={(html) => updateColumnContent(index, html)}
                    />
                  </LexicalComposer>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
