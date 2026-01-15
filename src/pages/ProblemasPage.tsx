import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChessBoard } from "@/components/chess/ChessBoard";
import { 
  Target, 
  Clock, 
  Trophy,
  Filter,
  ChevronRight,
  Flame,
  CheckCircle2,
  XCircle
} from "lucide-react";

const ProblemasPage = () => {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const levels = ["Principiante", "Intermedio", "Avanzado", "Experto"];
  const themes = ["Mate", "Táctica", "Finales", "Aperturas", "Estrategia"];

  const dailyProblem = {
    title: "Problema del Día",
    objective: "Mate en 2",
    level: "Intermedio",
    points: 25,
    attempts: 1243,
    successRate: 68,
  };

  const problems = [
    { id: 1, objective: "Mate en 1", level: "Principiante", theme: "Mate", points: 10, solved: true },
    { id: 2, objective: "Gana la Dama", level: "Principiante", theme: "Táctica", points: 15, solved: true },
    { id: 3, objective: "Mate en 2", level: "Intermedio", theme: "Mate", points: 20, solved: false },
    { id: 4, objective: "Clavada ganadora", level: "Intermedio", theme: "Táctica", points: 20, solved: false },
    { id: 5, objective: "Final de Rey y Peón", level: "Intermedio", theme: "Finales", points: 25, solved: false },
    { id: 6, objective: "Mate en 3", level: "Avanzado", theme: "Mate", points: 30, solved: false },
    { id: 7, objective: "Sacrificio decisivo", level: "Avanzado", theme: "Táctica", points: 35, solved: false },
    { id: 8, objective: "Mate en 4", level: "Experto", theme: "Mate", points: 50, solved: false },
  ];

  const filteredProblems = problems.filter(p => {
    if (selectedLevel && p.level !== selectedLevel) return false;
    if (selectedTheme && p.theme !== selectedTheme) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="px-6 mb-12">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Problemas de <span className="gradient-gold-text">Ajedrez</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Mejora tu visión táctica con cientos de problemas personalizados. 
              Cada ejercicio está diseñado para fortalecer tu juego.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="px-6 mb-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-card border-border text-center">
                <div className="text-3xl font-bold text-primary">156</div>
                <div className="text-sm text-muted-foreground">Resueltos</div>
              </Card>
              <Card className="p-4 bg-card border-border text-center">
                <div className="text-3xl font-bold text-accent">78%</div>
                <div className="text-sm text-muted-foreground">Precisión</div>
              </Card>
              <Card className="p-4 bg-card border-border text-center">
                <div className="text-3xl font-bold text-foreground flex items-center justify-center gap-1">
                  <Flame className="w-6 h-6 text-orange-500" />
                  12
                </div>
                <div className="text-sm text-muted-foreground">Racha</div>
              </Card>
              <Card className="p-4 bg-card border-border text-center">
                <div className="text-3xl font-bold text-foreground">2,450</div>
                <div className="text-sm text-muted-foreground">Puntos</div>
              </Card>
            </div>
          </div>
        </section>

        {/* Daily Problem */}
        <section className="px-6 mb-12">
          <div className="max-w-6xl mx-auto">
            <Card className="p-6 md:p-8 bg-gradient-to-br from-card to-secondary/30 border-primary/20">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="shrink-0">
                  <ChessBoard size="md" interactive className="glow-gold" />
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex items-center gap-3 justify-center lg:justify-start mb-4">
                    <Trophy className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-serif font-bold text-foreground">
                      {dailyProblem.title}
                    </h2>
                  </div>
                  <p className="text-lg text-muted-foreground mb-2">
                    {dailyProblem.objective} • {dailyProblem.level}
                  </p>
                  <div className="flex items-center gap-4 justify-center lg:justify-start text-sm text-muted-foreground mb-6">
                    <span>{dailyProblem.attempts.toLocaleString()} intentos</span>
                    <span>•</span>
                    <span>{dailyProblem.successRate}% de éxito</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                    <Button variant="hero" size="lg">
                      <Target className="w-5 h-5 mr-2" />
                      Resolver (+{dailyProblem.points} pts)
                    </Button>
                    <Button variant="outline" size="lg">
                      Ver Pista
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Filters & Problems */}
        <section className="px-6">
          <div className="max-w-6xl mx-auto">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Filtrar:</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedLevel === level
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>

              <div className="w-px h-6 bg-border hidden md:block" />

              <div className="flex flex-wrap gap-2">
                {themes.map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setSelectedTheme(selectedTheme === theme ? null : theme)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedTheme === theme
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

            {/* Problems Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredProblems.map((problem) => (
                <Card 
                  key={problem.id}
                  className={`p-4 bg-card border-border hover:border-primary/30 transition-all cursor-pointer group ${
                    problem.solved ? 'opacity-60' : ''
                  }`}
                >
                  <div className="aspect-square bg-secondary rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                    <span className="text-4xl opacity-30">♔</span>
                    {problem.solved && (
                      <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                        <CheckCircle2 className="w-12 h-12 text-accent" />
                      </div>
                    )}
                    {!problem.solved && (
                      <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="hero" size="sm">
                          Resolver
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      problem.level === 'Principiante' ? 'bg-green-500/10 text-green-500' :
                      problem.level === 'Intermedio' ? 'bg-yellow-500/10 text-yellow-500' :
                      problem.level === 'Avanzado' ? 'bg-orange-500/10 text-orange-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {problem.level}
                    </span>
                    <span className="text-xs text-primary font-medium">
                      +{problem.points} pts
                    </span>
                  </div>
                  <p className="font-medium text-foreground text-sm">{problem.objective}</p>
                  <p className="text-xs text-muted-foreground mt-1">{problem.theme}</p>
                </Card>
              ))}
            </div>

            {filteredProblems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No hay problemas con estos filtros</p>
              </div>
            )}

            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Cargar más problemas
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProblemasPage;
