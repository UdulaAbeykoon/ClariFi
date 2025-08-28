import Navbar from "@/components/Navbar";
import ModuleCards from "@/components/ModuleCards";

const GetStarted = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-4">Modules</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose a business module to start your focused learning journey
            </p>
          </div>
          <ModuleCards />
        </div>
      </main>
    </div>
  );
};

export default GetStarted;