import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function Settings({ theme, setTheme }) {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [logoPreview, setLogoPreview] = useState(null);

  const fetchSettings = useCallback(async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/settings");

    setSettings(res.data);

    if (res.data.appearance) {
      setTheme(res.data.appearance);
    }

    if (res.data.logo_path) {
      setLogoPreview(`http://localhost:5000/${res.data.logo_path}`);
    }

    setLoading(false);
  } catch (err) {
    console.log("Error fetching settings:", err);
  }
}, [setTheme]);


  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      setSettings({ ...settings, logo: files[0] });
      setLogoPreview(URL.createObjectURL(files[0]));
      return;
    }

    setSettings({ ...settings, [name]: value });

    if (name === "appearance") {
      setTheme(value);
      localStorage.setItem("theme", value);
    }
  };

  const handleSave = async () => {
    const data = new FormData();

    Object.keys(settings).forEach((key) => {
      if (key !== "logo") data.append(key, settings[key]);
    });

    if (settings.logo) data.append("logo", settings.logo);

    try {
      await axios.put("http://localhost:5000/api/settings", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Settings updated successfully!");
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  if (loading) return <p className="text-light">Loading...</p>;

  const isDark = theme === "dark";

  const inputClass =
    "form-control border-0 " +
    (isDark ? "bg-secondary text-light" : "bg-white text-dark");

  const cardClass =
    "p-4 rounded-4 shadow-lg settings-card " +
    (isDark ? "bg-dark border border-secondary" : "bg-light border border-dark");

  return (
    <div className={"container py-4 " + (isDark ? "text-light" : "text-dark bg-white")}>

      <div className={cardClass} style={{ transition: "0.25s" }}>

        <div className="d-flex justify-content-between align-items-center mb-4">

          <button
            className="btn btn-outline-success"
            onClick={() => {
              const newTheme = isDark ? "light" : "dark";
              setTheme(newTheme);
              handleChange({ target: { name: "appearance", value: newTheme } });
            }}
          >
            {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          <button
            className="btn btn-success px-5 d-flex align-items-center gap-2"
            onClick={handleSave}
          >
            <i className="bi bi-check-circle fs-5"></i> Save Changes
          </button>
        </div>


        <h3 className="fw-bold mb-4">
          <i className="bi bi-building me-2 text-success"></i>
          Business Settings
        </h3>
        <div className="mb-4">
          <label className="form-label">Business Name</label>
          <input
            type="text"
            name="business_name"
            value={settings.business_name}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <label className="form-label">Logo</label>
        <div className="d-flex align-items-center gap-3 mb-4">
          <div
            style={{ width: "80px", height: "80px" }}
            className={
              "rounded d-flex align-items-center justify-content-center border " +
              (isDark
                ? "bg-success bg-opacity-25 border-success"
                : "bg-success bg-opacity-50 border-success")
            }
          >
            {logoPreview ? (
              <img
                src={logoPreview}
                className="rounded"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <i className="bi bi-check-circle text-success fs-1"></i>
            )}
          </div>

          <input
            type="file"
            name="logo"
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="row mb-4">
          <div className="col-md-6 mb-3">
            <label className="form-label">Contact Email</label>
            <input
              type="text"
              name="contact_email"
              value={settings.contact_email}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Contact Phone</label>
            <input
              type="text"
              name="contact_phone"
              value={settings.contact_phone}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        <h3 className="fw-bold mt-5 mb-3">
          <i className="bi bi-sliders me-2 text-info"></i>
          Preferences
        </h3>

        <div className="row mb-4">
          <div className="col-md-6 mb-3">
            <label className="form-label">Default Tax Rate</label>
            <div className="d-flex align-items-center gap-2">
              <input
                type="number"
                name="tax_rate"
                value={settings.tax_rate}
                onChange={handleChange}
                className={inputClass}
              />
              <span>%</span>
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Currency</label>
            <select
              name="currency"
              value={settings.currency}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
}
