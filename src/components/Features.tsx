import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  PenTool, 
  Bot, 
  Zap, 
  Link2, 
  Maximize2 
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "PDF Side-by-Side",
    description: "View textbooks and PDFs alongside your notes for seamless reference and learning."
  },
  {
    icon: PenTool,
    title: "Autosave Notes",
    description: "Your notes are automatically saved to the cloud with real-time sync across devices."
  },
  {
    icon: Bot,
    title: "AI Explanations",
    description: "Get instant clarifications on complex concepts with our business-focused AI assistant."
  },
  {
    icon: Zap,
    title: "Smart Summaries",
    description: "Generate chapter summaries, key points, and custom quizzes to test your knowledge."
  },
  {
    icon: Link2,
    title: "Module-Linked Notes",
    description: "Organize notes by business modules with intelligent categorization and search."
  },
  {
    icon: Maximize2,
    title: "Resizable Panes",
    description: "Customize your workspace with flexible, resizable panels for optimal productivity."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Powerful Features for
            <span className="text-primary"> Focused Learning</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to excel in business studies, designed with modern learning principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-card transition-smooth border-border hover:border-primary/20 bg-gradient-card"
              >
                <CardContent className="p-8 text-center">
                  <div className="mb-4 inline-flex p-3 bg-gradient-primary rounded-xl shadow-elegant group-hover:shadow-glow transition-smooth">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;