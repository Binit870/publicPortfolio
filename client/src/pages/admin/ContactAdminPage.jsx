import { useState, useEffect } from "react";
import { Save, Plus, Trash2, Eye, EyeOff, RefreshCw } from "lucide-react";
import { getContactPageAdminApi, updateContactPageAdminApi } from "../../api/contact.api";
import toast, { Toaster } from "react-hot-toast";

const SectionCard = ({ title, children }) => (
  <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-sm">
    <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-5">
      {title}
    </h3>
    {children}
  </div>
);

const InputField = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-primary tracking-[0.15em] uppercase">
      {label}
    </label>
    <input
      type={type}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 rounded-lg border border-border text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
    />
  </div>
);

const ContactAdminPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getContactPageAdminApi();
      setPageData(res.data);
    } catch {
      toast.error("Failed to load contact page data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateContactPageAdminApi(pageData);
      toast.success("Contact page updated successfully");
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (path, value) => {
    setPageData((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let obj = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const addFeature = () => {
    setPageData((prev) => ({
      ...prev,
      features: [
        ...(prev.features || []),
        { icon: "⭐", title: "", description: "" },
      ],
    }));
  };

  const removeFeature = (i) => {
    setPageData((prev) => ({
      ...prev,
      features: prev.features.filter((_, idx) => idx !== i),
    }));
  };

  const updateFeature = (i, field, value) => {
    setPageData((prev) => {
      const features = [...prev.features];
      features[i] = { ...features[i], [field]: value };
      return { ...prev, features };
    });
  };

  const addLink = () => {
    setPageData((prev) => ({
      ...prev,
      popularLinksSection: {
        ...prev.popularLinksSection,
        links: [
          ...(prev.popularLinksSection?.links || []),
          { icon: "🔗", title: "", description: "", link: "" },
        ],
      },
    }));
  };

  const removeLink = (i) => {
    setPageData((prev) => ({
      ...prev,
      popularLinksSection: {
        ...prev.popularLinksSection,
        links: prev.popularLinksSection.links.filter((_, idx) => idx !== i),
      },
    }));
  };

  const updateLink = (i, field, value) => {
    setPageData((prev) => {
      const links = [...prev.popularLinksSection.links];
      links[i] = { ...links[i], [field]: value };
      return {
        ...prev,
        popularLinksSection: { ...prev.popularLinksSection, links },
      };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">
              Admin
            </span>
            <h1 className="text-xl sm:text-2xl font-bold font-poppins text-foreground mt-1">
              Contact Page
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Edit everything visible on the public contact page.
            </p>
          </div>
          <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={fetchData}
              className="btn-outline-primary flex items-center justify-center gap-2 text-sm py-2 w-full sm:w-auto"
            >
              <RefreshCw size={14} /> Refresh
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center justify-center gap-2 text-sm py-2 w-full sm:w-auto"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Save size={14} />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">

          {/* Page Header */}
          <SectionCard title="Page Header">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Title"
                value={pageData?.pageHeader?.title}
                onChange={(e) => updateField("pageHeader.title", e.target.value)}
                placeholder="Contact Us"
              />
              <InputField
                label="Subtitle"
                value={pageData?.pageHeader?.subtitle}
                onChange={(e) => updateField("pageHeader.subtitle", e.target.value)}
                placeholder="We'd love to hear from you"
              />
            </div>
          </SectionCard>

          {/* Form Fields */}
          <SectionCard title="Contact Form Fields">
            <div className="space-y-4">
              {["firstName", "lastName", "workEmail", "company", "message"].map((field) => (
                <div key={field} className="p-3 sm:p-4 bg-background rounded-xl border border-border">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                    {field}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Label"
                      value={pageData?.contactForm?.fields?.[field]?.label}
                      onChange={(e) => updateField(`contactForm.fields.${field}.label`, e.target.value)}
                      placeholder="Field label"
                    />
                    <InputField
                      label="Placeholder"
                      value={pageData?.contactForm?.fields?.[field]?.placeholder}
                      onChange={(e) => updateField(`contactForm.fields.${field}.placeholder`, e.target.value)}
                      placeholder="Field placeholder"
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Form Settings */}
          <SectionCard title="Form Settings">
            <div className="space-y-4">
              <InputField
                label="Submit Button Text"
                value={pageData?.contactForm?.submitButtonText}
                onChange={(e) => updateField("contactForm.submitButtonText", e.target.value)}
                placeholder="Send Message"
              />
              <InputField
                label="Newsletter Checkbox Label"
                value={pageData?.contactForm?.newsletterCheckbox?.label}
                onChange={(e) => updateField("contactForm.newsletterCheckbox.label", e.target.value)}
                placeholder="Yes, I'd like to receive updates"
              />
              <InputField
                label="Privacy Policy Text"
                value={pageData?.contactForm?.privacyPolicyText}
                onChange={(e) => updateField("contactForm.privacyPolicyText", e.target.value)}
                placeholder="By submitting this form you agree with our"
              />
              <InputField
                label="Privacy Policy Link"
                value={pageData?.contactForm?.privacyPolicyLink}
                onChange={(e) => updateField("contactForm.privacyPolicyLink", e.target.value)}
                placeholder="/privacy-policy"
              />
            </div>
          </SectionCard>

          {/* General Contact */}
          <SectionCard title="General Contact Info">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Email"
                value={pageData?.generalContact?.email}
                onChange={(e) => updateField("generalContact.email", e.target.value)}
                placeholder="hello@example.com"
                type="email"
              />
              <InputField
                label="Support Portal URL"
                value={pageData?.generalContact?.supportPortal}
                onChange={(e) => updateField("generalContact.supportPortal", e.target.value)}
                placeholder="https://support.example.com"
              />
            </div>
          </SectionCard>

          {/* Features */}
          <SectionCard title="Feature Highlights">
            <div className="space-y-3 mb-4">
              {(pageData?.features || []).map((feature, i) => (
                <div
                  key={i}
                  className="p-3 sm:p-4 bg-background rounded-xl border border-border"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-muted-foreground uppercase">
                      Feature {i + 1}
                    </span>
                    <button
                      onClick={() => removeFeature(i)}
                      className="text-destructive hover:text-destructive/80 transition-colors p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <InputField
                      label="Icon (emoji)"
                      value={feature.icon}
                      onChange={(e) => updateFeature(i, "icon", e.target.value)}
                      placeholder="⚡"
                    />
                    <InputField
                      label="Title"
                      value={feature.title}
                      onChange={(e) => updateFeature(i, "title", e.target.value)}
                      placeholder="Feature title"
                    />
                    <div className="sm:col-span-2 md:col-span-1">
                      <InputField
                        label="Description"
                        value={feature.description}
                        onChange={(e) => updateFeature(i, "description", e.target.value)}
                        placeholder="Short description"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={addFeature}
              className="btn-outline-primary flex items-center gap-2 text-sm py-2 w-full sm:w-auto justify-center sm:justify-start"
            >
              <Plus size={14} /> Add Feature
            </button>
          </SectionCard>

          {/* Popular Links */}
          <SectionCard title="Popular Links Section">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <InputField
                label="Section Title"
                value={pageData?.popularLinksSection?.title}
                onChange={(e) => updateField("popularLinksSection.title", e.target.value)}
                placeholder="Looking for something else?"
              />
              <InputField
                label="Section Description"
                value={pageData?.popularLinksSection?.description}
                onChange={(e) => updateField("popularLinksSection.description", e.target.value)}
                placeholder="Explore more options"
              />
            </div>

            <div className="space-y-3 mb-4">
              {(pageData?.popularLinksSection?.links || []).map((link, i) => (
                <div
                  key={i}
                  className="p-3 sm:p-4 bg-background rounded-xl border border-border"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-muted-foreground uppercase">
                      Link {i + 1}
                    </span>
                    <button
                      onClick={() => removeLink(i)}
                      className="text-destructive hover:text-destructive/80 transition-colors p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InputField
                      label="Icon (emoji)"
                      value={link.icon}
                      onChange={(e) => updateLink(i, "icon", e.target.value)}
                      placeholder="📚"
                    />
                    <InputField
                      label="Title"
                      value={link.title}
                      onChange={(e) => updateLink(i, "title", e.target.value)}
                      placeholder="Documentation"
                    />
                    <InputField
                      label="Description"
                      value={link.description}
                      onChange={(e) => updateLink(i, "description", e.target.value)}
                      placeholder="Short description"
                    />
                    <InputField
                      label="URL"
                      value={link.link}
                      onChange={(e) => updateLink(i, "link", e.target.value)}
                      placeholder="/docs"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={addLink}
              className="btn-outline-primary flex items-center gap-2 text-sm py-2 w-full sm:w-auto justify-center sm:justify-start"
            >
              <Plus size={14} /> Add Link
            </button>
          </SectionCard>

          {/* Page Status */}
          <SectionCard title="Page Status">
            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Contact Page Active
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  When disabled the contact page will not be accessible to public
                </p>
              </div>
              <button
                onClick={() => updateField("isActive", !pageData?.isActive)}
                className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full transition-colors shrink-0 ${
                  pageData?.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {pageData?.isActive ? (
                  <><Eye size={14} /> Active</>
                ) : (
                  <><EyeOff size={14} /> Inactive</>
                )}
              </button>
            </div>
          </SectionCard>

          {/* Save button at bottom */}
          <div className="flex justify-end pt-2 pb-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {saving ? "Saving..." : "Save All Changes"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default ContactAdminPage;
