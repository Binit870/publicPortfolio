import ContactHeader from "@/components/contact/ContactHeader";
import ContactForm from "@/components/contact/ContactForm";
import FeatureHighlights from "@/components/contact/ContactFeatures";
import PopularLinks from "@/components/contact/PopularLinks";

const ContactPage = () => (
  <div className="min-h-screen bg-background overflow-x-hidden selection:bg-primary/20">
    
    {/* Floating background shapes */}
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute top-[10%] -left-20 w-96 h-96 rounded-full bg-saffron-soft blur-3xl" />
      <div className="absolute bottom-[20%] -right-20 w-[500px] h-[500px] rounded-full bg-green-badge-soft blur-3xl" />
    </div>

    <div className="relative z-10">
      <ContactHeader />

      {/* Section 2: Two Column Layout */}
      <section className="max-w-[1100px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <ContactForm />
        </div>

        <div className="lg:col-span-5">
          <FeatureHighlights />
        </div>
      </section>

      <PopularLinks />
    </div>
  </div>
);

export default ContactPage;