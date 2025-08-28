import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SplitContainer from "@/components/SplitContainer";

const Module = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const moduleNames: { [key: string]: string } = {
    "business-valuation": "Business Valuation",
    "accounting": "Accounting",
    "marketing": "Marketing"
  };

  const moduleName = moduleNames[slug || ""] || "Unknown Module";

  return (
    <div className="h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 overflow-hidden">
        <div className="h-full">
          <div className="px-6 py-4 border-b border-border">
            <h1 className="text-2xl font-semibold text-foreground">{moduleName}</h1>
          </div>
          <SplitContainer moduleSlug={slug} />
        </div>
      </main>
    </div>
  );
};

export default Module;