import React, { useEffect, useState } from "react";
import { api } from "../../../../../utils/api";
import Swal from "sweetalert2";
import {
  Save,
  Plus,
  Trash2,
  Globe,
  Layout,
  Settings,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { clearSiteSettingsCache } from "../../../../../utils/siteSettingsApi";
import { useNavigate } from "react-router-dom";
import DashboardFooter from '@/components/common/DashboardFooter';

/* ================= PAGE ================= */
export default function SiteSettingsForm() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("header");
  const navigate = useNavigate();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await api.get("/api/site-settings");
      setSettings(data);
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      await api.put("/api/site-settings", settings);
      clearSiteSettingsCache();

      await Swal.fire({
        icon: "success",
        title: "Settings Saved!",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/dashboard/manage-pages"); // ✅ REDIRECT HERE
    } catch (err) {
      Swal.fire("Error", "Failed to save settings", "error");
    }
  };


  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-sky-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  /* ================= LAYOUT ================= */
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-sky-50">

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 shadow">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">

            {/* BACK */}
            <button
              onClick={() => navigate(-1)}
              className="
                inline-flex items-center gap-2
                px-3 py-1.5 rounded-full
                bg-white/15 backdrop-blur-sm
                border border-[1.5px] border-white/30
                text-white text-xs sm:text-sm
                hover:bg-white/25 transition
              "
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back</span>
            </button>

            {/* TITLE */}
            <h1 className="flex-1 text-center text-base sm:text-2xl font-bold text-white truncate">
              Site Settings
            </h1>

            {/* SAVE */}
            <button
              onClick={saveSettings}
              className="
                inline-flex items-center gap-2
                px-4 py-2 rounded-full
                bg-white/15 backdrop-blur-sm
                border border-[1.5px] border-white/30
                text-white text-xs sm:text-sm
                hover:bg-white/25 transition
              "
            >
              <Save size={16} />
              Save
            </button>
          </div>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
          <div className="rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-sm">

            {/* TABS */}
            <div className="border-b border-slate-200/60 px-4 py-3 flex gap-2">
              <TabButton icon={Layout} label="Header" active={activeTab === "header"} onClick={() => setActiveTab("header")} />
              <TabButton icon={Layout} label="Footer" active={activeTab === "footer"} onClick={() => setActiveTab("footer")} />
              <TabButton icon={Globe} label="Home Page" active={activeTab === "homepage"} onClick={() => setActiveTab("homepage")} />
            </div>

            {/* BODY */}
            <div className="p-5">
              {activeTab === "header" && <HeaderSettings settings={settings} setSettings={setSettings} />}
              {activeTab === "footer" && <FooterSettings settings={settings} setSettings={setSettings} />}
              {activeTab === "homepage" && <HomePageSettings settings={settings} setSettings={setSettings} />}
            </div>
          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <DashboardFooter />
    </div>
  );
}

/* ================= TAB BUTTON ================= */
function TabButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full text-sm transition
        border border-[1.5px]
        ${active
          ? "bg-indigo-50/80 text-indigo-800 border-indigo-300 ring-1 ring-inset ring-indigo-200"
          : "bg-white/60 text-slate-600 border-slate-300 hover:bg-white"}
      `}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

function NavigationItem({ item, index, updateNavItem, deleteNavItem }) {
  const [expanded, setExpanded] = useState(true); // ✅ Auto-expand by default

  const addSubItem = () => {
    const children = [...(item.children || [])];
    children.push({ label: "Sub Link", href: "/", type: "link" });
    updateNavItem(index, "children", children);
    setExpanded(true);
  };

  const updateSubItem = (subIndex, field, value) => {
    const children = [...item.children];
    children[subIndex][field] = value;
    updateNavItem(index, "children", children);
  };

  const deleteSubItem = (subIndex) => {
    const children = item.children.filter((_, i) => i !== subIndex);
    updateNavItem(index, "children", children);
  };

  const hasChildren = item.children && item.children.length > 0;

  return (
    <div
      className="
      rounded-xl
      border border-[1.5px] border-slate-200/70
      bg-white/70 backdrop-blur-sm
      shadow-sm
      p-4
    "
    >
      {/* ================= PARENT ITEM ================= */}
      <div className="flex gap-2 items-center mb-3">

        {/* Expand / Collapse */}
        {(hasChildren || item.type === "dropdown") && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="
            p-1.5 rounded-full
            bg-white/70 backdrop-blur-sm
            border border-[1.5px] border-slate-300
            ring-1 ring-inset ring-slate-200
            hover:bg-white
            transition
          "
            title={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}

        {/* Label */}
        <input
          type="text"
          value={item.label}
          onChange={(e) => updateNavItem(index, "label", e.target.value)}
          className="
          flex-1 px-3 py-2 rounded-lg
          bg-white/80 backdrop-blur-sm
          border border-[1.5px] border-slate-300
          ring-1 ring-inset ring-slate-200
          font-medium
          focus:outline-none focus:ring-2 focus:ring-indigo-300
        "
          placeholder="Label (e.g., Services)"
        />

        {/* Href */}
        <input
          type="text"
          value={item.href || "#"}
          onChange={(e) => updateNavItem(index, "href", e.target.value)}
          className="
          flex-1 px-3 py-2 rounded-lg
          bg-white/80 backdrop-blur-sm
          border border-[1.5px] border-slate-300
          ring-1 ring-inset ring-slate-200
          focus:outline-none focus:ring-2 focus:ring-indigo-300
        "
          placeholder="/path (use # for dropdown)"
        />

        {/* Type */}
        <select
          value={item.type}
          onChange={(e) => {
            updateNavItem(index, "type", e.target.value);
            if (e.target.value === "dropdown") setExpanded(true);
          }}
          className="
          px-3 py-2 rounded-lg
          bg-white/80 backdrop-blur-sm
          border border-[1.5px] border-slate-300
          ring-1 ring-inset ring-slate-200
          focus:outline-none focus:ring-2 focus:ring-indigo-300
        "
        >
          <option value="link">Link</option>
          <option value="button">Button</option>
          <option value="dropdown">Dropdown</option>
        </select>

        {/* Delete */}
        <button
          onClick={() => deleteNavItem(index)}
          className="
          p-2 rounded-full
          bg-rose-50/80 backdrop-blur-sm
          border border-[1.5px] border-rose-300
          ring-1 ring-inset ring-rose-200
          text-rose-700
          hover:bg-rose-100
          transition
        "
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* ================= SUBMENU ITEMS ================= */}
      {item.type === "dropdown" && expanded && (
        <div className="mt-3 space-y-3">

          {hasChildren && (
            <>
              <p className="text-xs font-semibold text-slate-600 tracking-wide">
                DROPDOWN ITEMS
              </p>

              {item.children.map((subItem, subIdx) => (
                <div
                  key={subIdx}
                  className="
                  flex gap-2 items-center pl-5
                  border-l-2 border-indigo-300
                "
                >
                  <input
                    type="text"
                    value={subItem.label}
                    onChange={(e) =>
                      updateSubItem(subIdx, "label", e.target.value)
                    }
                    className="
                    flex-1 px-3 py-2 rounded-lg text-sm
                    bg-white/80 backdrop-blur-sm
                    border border-[1.5px] border-slate-300
                    ring-1 ring-inset ring-slate-200
                  "
                    placeholder="Submenu Label"
                  />

                  <input
                    type="text"
                    value={subItem.href}
                    onChange={(e) =>
                      updateSubItem(subIdx, "href", e.target.value)
                    }
                    className="
                    flex-1 px-3 py-2 rounded-lg text-sm
                    bg-white/80 backdrop-blur-sm
                    border border-[1.5px] border-slate-300
                    ring-1 ring-inset ring-slate-200
                  "
                    placeholder="/subpage"
                  />

                  <button
                    onClick={() => deleteSubItem(subIdx)}
                    className="
                    p-2 rounded-full
                    bg-rose-50/80 backdrop-blur-sm
                    border border-[1.5px] border-rose-300
                    ring-1 ring-inset ring-rose-200
                    text-rose-700
                    hover:bg-rose-100
                    transition
                  "
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </>
          )}

          {/* ADD SUB ITEM */}
          <button
            onClick={addSubItem}
            className="
            w-full flex items-center justify-center gap-1
            px-3 py-2 rounded-lg text-sm
            bg-white/70 backdrop-blur-sm
            border border-[1.5px] border-slate-300
            ring-1 ring-inset ring-slate-200
            hover:bg-white
            transition
          "
          >
            <Plus size={14} />
            Add Dropdown Item
          </button>
        </div>
      )}

      {/* ================= INFO ================= */}
      {item.type === "dropdown" && !hasChildren && expanded && (
        <p
          className="
          mt-3 text-xs
          bg-indigo-50/80 text-indigo-700
          border border-[1.5px] border-indigo-300
          ring-1 ring-inset ring-indigo-200
          rounded-lg p-2
        "
        >
          ℹ️ Click “Add Dropdown Item” to create submenu links
        </p>
      )}
    </div>
  );

}

function HeaderSettings({ settings, setSettings }) {
  const updateHeader = (field, value) => {
    setSettings({
      ...settings,
      header: { ...settings.header, [field]: value },
    });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/api/site-settings/upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "x-tenant-id": localStorage.getItem("tenantId") || "default-tenant",
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        updateHeader("logo", data.url);
        Swal.fire("Success", "Logo uploaded!", "success");
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error("Upload error:", err);
      Swal.fire("Error", "Failed to upload logo", "error");
    }
  };

  const addNavItem = () => {
    const nav = [...(settings.header.navigation || [])];
    nav.push({ label: "New Link", href: "/", type: "link", children: [] });
    updateHeader("navigation", nav);
  };

  const updateNavItem = (index, field, value) => {
    const nav = [...settings.header.navigation];
    nav[index][field] = value;
    updateHeader("navigation", nav);
  };

  const deleteNavItem = (index) => {
    const nav = settings.header.navigation.filter((_, i) => i !== index);
    updateHeader("navigation", nav);
  };

  return (
    <div className="space-y-6">
      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={settings.header.useCustom || false}
          onChange={(e) =>
            setSettings({
              ...settings,
              header: {
                ...settings.header,
                useCustom: e.target.checked
              }
            })
          }
        />
        <span className="font-medium">Enable Custom Header</span>
      </label>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Logo Link (Click Destination)
        </label>
        <input
          type="text"
          value={settings.header.logoLink || ""}
          onChange={(e) => updateHeader("logoLink", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="/ (home page)"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Navigation Links
          </label>
          <button
            onClick={addNavItem}
            className="flex items-center gap-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            <Plus size={16} />
            Add Navigation Item
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-xs text-blue-800">
            <strong>💡 Tip:</strong> Select "Dropdown" type to create menus with sub-items (like Services → Consulting, Development, Support)
          </p>
        </div>

        <div className="space-y-4">
          {settings.header.navigation?.map((item, i) => (
            <NavigationItem
              key={i}
              item={item}
              index={i}
              updateNavItem={updateNavItem}
              deleteNavItem={deleteNavItem}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Color
          </label>
          <input
            type="color"
            value={settings.header.style?.backgroundColor || "#ffffff"}
            onChange={(e) =>
              updateHeader("style", {
                ...settings.header.style,
                backgroundColor: e.target.value,
              })
            }
            className="w-full h-10 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Text Color
          </label>
          <input
            type="color"
            value={settings.header.style?.textColor || "#000000"}
            onChange={(e) =>
              updateHeader("style", {
                ...settings.header.style,
                textColor: e.target.value,
              })
            }
            className="w-full h-10 border rounded"
          />
        </div>
      </div>
    </div>
  );
}

// Footer and HomePage settings remain exactly the same...
function FooterSettings({ settings, setSettings }) {
  const updateFooter = (field, value) => {
    setSettings({
      ...settings,
      footer: { ...settings.footer, [field]: value },
    });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/api/site-settings/upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "x-tenant-id": localStorage.getItem("tenantId") || "default-tenant",
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        updateFooter("logo", data.url);
        Swal.fire("Success", "Footer logo uploaded!", "success");
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error("Upload error:", err);
      Swal.fire("Error", "Failed to upload logo", "error");
    }
  };

  const addColumn = () => {
    const columns = [...(settings.footer.columns || [])];
    columns.push({ title: "New Section", links: [] });
    updateFooter("columns", columns);
  };

  const updateColumn = (index, field, value) => {
    const columns = [...settings.footer.columns];
    columns[index][field] = value;
    updateFooter("columns", columns);
  };

  const deleteColumn = (index) => {
    const columns = settings.footer.columns.filter((_, i) => i !== index);
    updateFooter("columns", columns);
  };

  const addLink = (columnIndex) => {
    const columns = [...settings.footer.columns];
    columns[columnIndex].links.push({ label: "New Link", href: "/", external: false });
    updateFooter("columns", columns);
  };

  const updateLink = (columnIndex, linkIndex, field, value) => {
    const columns = [...settings.footer.columns];
    columns[columnIndex].links[linkIndex][field] = value;
    updateFooter("columns", columns);
  };

  const deleteLink = (columnIndex, linkIndex) => {
    const columns = [...settings.footer.columns];
    columns[columnIndex].links = columns[columnIndex].links.filter((_, i) => i !== linkIndex);
    updateFooter("columns", columns);
  };

  return (
    <div className="space-y-6">
      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={settings.footer.useCustom || false}
          onChange={(e) =>
            setSettings({
              ...settings,
              footer: {
                ...settings.footer,
                useCustom: e.target.checked
              }
            })
          }
        />
        <span className="font-medium">Enable Custom Footer</span>
      </label>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Footer Logo Link
        </label>
        <input
          type="text"
          value={settings.footer.logoLink || ""}
          onChange={(e) => updateFooter("logoLink", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="/ (home page)"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Footer Columns
          </label>
          <button
            onClick={addColumn}
            className="flex items-center gap-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            <Plus size={14} />
            Add Column
          </button>
        </div>

        <div className="space-y-6">
          {settings.footer.columns?.map((column, colIdx) => (
            <div key={colIdx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <input
                  type="text"
                  value={column.title}
                  onChange={(e) => updateColumn(colIdx, "title", e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg font-semibold"
                  placeholder="Column Title"
                />
                <button
                  onClick={() => deleteColumn(colIdx)}
                  className="
          p-2 rounded-full
          bg-rose-50/80 backdrop-blur-sm
          border border-[1.5px] border-rose-300
          ring-1 ring-inset ring-rose-200
          text-rose-700
          hover:bg-rose-100
          transition ml-2
        "
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-2 mb-3">
                {column.links?.map((link, linkIdx) => (
                  <div key={linkIdx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updateLink(colIdx, linkIdx, "label", e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg bg-white"
                      placeholder="Link Label"
                    />
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) => updateLink(colIdx, linkIdx, "href", e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg bg-white"
                      placeholder="/path or https://..."
                    />
                    <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={link.external || false}
                        onChange={(e) => updateLink(colIdx, linkIdx, "external", e.target.checked)}
                      />
                      External
                    </label>
                    <button
                      onClick={() => deleteLink(colIdx, linkIdx)}
                      className="
          p-1 rounded-full
          bg-rose-50/80 backdrop-blur-sm
          border border-[1.5px] border-rose-300
          ring-1 ring-inset ring-rose-200
          text-rose-700
          hover:bg-rose-100
          transition
        "
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => addLink(colIdx)}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-white border border-blue-700 rounded-full hover:bg-blue-100"
              >

                <Plus size={14} />
                Add Link
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Color
          </label>
          <input
            type="color"
            value={settings.footer.style?.backgroundColor || "#1f2937"}
            onChange={(e) =>
              updateFooter("style", {
                ...settings.footer.style,
                backgroundColor: e.target.value,
              })
            }
            className="w-full h-10 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Text Color
          </label>
          <input
            type="color"
            value={settings.footer.style?.textColor || "#ffffff"}
            onChange={(e) =>
              updateFooter("style", {
                ...settings.footer.style,
                textColor: e.target.value,
              })
            }
            className="w-full h-10 border rounded"
          />
        </div>
      </div>
    </div>
  );
}

function HomePageSettings({ settings, setSettings }) {
  const homePage = {
    useCustom: false,
    mode: "cms",
    cmsSlug: "",
    sections: [],
    ...settings.homePage,
  };

  const updateHome = (updates) => {
    setSettings({
      ...settings,
      homePage: { ...homePage, ...updates },
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> Choose how your home page is built.
        </p>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={homePage.useCustom}
          onChange={(e) =>
            updateHome({ useCustom: e.target.checked })
          }
        />
        <span className="text-sm font-medium">
          Use Custom Home Page
        </span>
      </label>

      {!homePage.useCustom && (
        <p className="text-sm text-gray-500">
          Default home page will be used.
        </p>
      )}

      {homePage.useCustom && (
        <>
          <div className="space-y-2">
            <label className="flex gap-2 items-center">
              <input
                type="radio"
                checked={homePage.mode === "cms"}
                onChange={() => updateHome({ mode: "cms" })}
              />
              <span className="font-medium">CMS Page</span>
            </label>

            <label className="flex gap-2 items-center">
              <input
                type="radio"
                checked={homePage.mode === "builder"}
                onChange={() => updateHome({ mode: "builder" })}
              />
              <span className="font-medium">Built-in Page Builder</span>
            </label>
          </div>

          {homePage.mode === "cms" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CMS Page Slug
              </label>
              <input
                type="text"
                value={homePage.cmsSlug}
                onChange={(e) =>
                  updateHome({ cmsSlug: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="home"
              />
              <p className="text-xs text-gray-500 mt-1">
                Example: home, landing, index
              </p>
            </div>
          )}

          {homePage.mode === "builder" && (
            <div className="border border-dashed rounded-lg p-4 text-sm text-gray-600">
              🚧 Home Page Builder UI goes here
              (Hero, HTML, CTA sections — next step)
            </div>
          )}
        </>
      )}
    </div>
  );
}
