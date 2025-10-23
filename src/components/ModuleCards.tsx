import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calculator, Megaphone, ArrowRight } from "lucide-react";

const modules = [
  {
    id: "business-valuation",
    title: "Business Valuation",
    icon: TrendingUp,
    description: "Master the art of valuing companies using DCF models, comparable analysis, and precedent transactions. Learn essential techniques used by investment professionals.",
    topics: ["DCF Analysis", "Comparable Companies", "Precedent Transactions", "LBO Models"],
    color: "from-[#174978] to-[#2F5F8A]"
  },
  {
    id: "accounting",
    title: "Accounting",
    icon: Calculator,
    description: "Build a solid foundation in financial accounting principles, statements analysis, and managerial accounting for strategic decision making.",
    topics: ["Financial Statements", "Ratio Analysis", "Cost Accounting", "Budgeting"],
    color: "from-[#46798B] to-[#5E8CAD]"
  },
  {
    id: "marketing",
    title: "Marketing",
    icon: Megaphone,
    description: "Explore modern marketing strategies, consumer behavior, digital marketing, and brand management in today's competitive landscape.",
    topics: ["Consumer Behavior", "Digital Marketing", "Brand Strategy", "Market Research"],
    color: "from-[#5E8CAD] to-[#75A2BF]"
  }
];

const ModuleCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {modules.map((module) => {
        const Icon = module.icon;

        return (
          <Card
            key={module.id}
            className="group border-border bg-gradient-card overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <CardContent className="p-0">
              {/* Header with gradient */}
              <div className={`bg-gradient-to-r ${module.color} p-6 text-white`}>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">{module.title}</h3>
                </div>
                <p className="text-white/90 text-sm leading-relaxed">
                  {module.description}
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                    Key Topics
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {module.topics.map((topic, index) => (
                      <div
                        key={index}
                        className="text-sm text-foreground bg-muted/50 rounded-md px-3 py-2 text-center"
                      >
                        {topic}
                      </div>
                    ))}
                  </div>
                </div>

                <Link to={`/module/${module.id}`} className="block">
                  <Button
                    className="w-full group-hover:shadow-glow transition-smooth bg-gradient-primary"
                    size="lg"
                  >
                    Open Module
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-smooth" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ModuleCards;