import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, BookOpen, TrendingUp } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            About <span className="text-primary">ClariFi</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We believe that mastering business concepts shouldn't be overwhelming. ClariFi transforms 
            traditional textbook learning into an interactive, efficient experience that helps students 
            succeed in their business education.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-3xl font-bold text-foreground mb-6">
              Our Mission
            </h3>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              To revolutionize how business students learn by providing intelligent tools that make 
              studying more effective, engaging, and accessible. We combine the power of AI with 
              proven pedagogical principles to create a learning environment that adapts to each student's needs.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent rounded-lg">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <span className="text-foreground font-medium">Focus on comprehension over memorization</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary rounded-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-foreground font-medium">Seamless integration with existing curricula</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-study-accent rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="text-foreground font-medium">Data-driven insights for better learning</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-card border-border shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-primary rounded-xl">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground">Student-Centered Design</h4>
                    <p className="text-muted-foreground">Built by students, for students, with real academic needs in mind.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-accent rounded-xl">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground">Academic Excellence</h4>
                    <p className="text-muted-foreground">Helping thousands of students achieve better grades and deeper understanding.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-study-accent rounded-xl">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground">Future-Ready</h4>
                    <p className="text-muted-foreground">Preparing students for the digital business world with modern tools.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;