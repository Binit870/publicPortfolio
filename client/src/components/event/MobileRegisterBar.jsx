import { Button } from "@/components/ui/button";

const MobileRegisterBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card border-t border-border px-4 py-3 shadow-lg">
      <Button variant="saffron" className="w-full" size="lg">
        Register Now
      </Button>
    </div>
  );
};

export default MobileRegisterBar;