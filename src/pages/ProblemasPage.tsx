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
  XCircle,
  Loader2
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

const ProblemasPage = () => {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const levels = ["Principiante", "Intermedio", "Avanzado", "Experto"];
  const themes = ["Mate", "Táctica", "Finales", "Aperturas", "Estrategia"];

  const { data: puzzles, isLoading } = useQuery<any[]>({
    queryKey: ["public-puzzles"],
    queryFn: () => api.puzzles.list(),
  });

  const { data: dailyPuzzle, isLoading: isLoadingDaily } = useQuery({
    queryKey: ["daily-puzzle"],
    queryFn: () => api.puzzles.daily(),
  });

  const filteredProblems = puzzles?.filter(p => {
    if (selectedLevel) {
      // Simple mapping if needed, or just exact match
      if (p.rating < 1200 && selectedLevel !== "Principiante") return false;
      if (p.rating >= 1200 && p.rating < 1800 && selectedLevel !== "Intermedio") return false;
      if (p.rating >= 1800 && p.rating < 2200 && selectedLevel !== "Avanzado") return false;
      if (p.rating >= 2200 && selectedLevel !== "Experto") return false;
    }
    // Theme filtering is not yet supported by API but we can simulate or filter by solution length etc.
    return true;
  }) || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
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
                <div className="text-3xl font-bold text-primary">--</div>
                <div className="text-sm text-muted-foreground">Resueltos</div>
              </Card>
              <Card className="p-4 bg-card border-border text-center">
                <div className="text-3xl font-bold text-accent">--%</div>
                <div className="text-sm text-muted-foreground">Precisión</div>
              </Card>
              <Card className="p-4 bg-card border-border text-center">
                <div className="text-3xl font-bold text-foreground flex items-center justify-center gap-1">
                  <Flame className="w-6 h-6 text-orange-500" />
                  --
                </div>
                <div className="text-sm text-muted-foreground">Racha</div>
              </Card>
              <Card className="p-4 bg-card border-border text-center">
                <div className="text-3xl font-bold text-foreground">--</div>
                <div className="text-sm text-muted-foreground">Puntos</div>
              </Card>
            </div>
          </div>
        </section>

        {/* Daily Problem */}
        <section className="px-6 mb-12">
          <div className="max-w-6xl mx-auto">
            {isLoadingDaily ? (
              <Card className="p-20 flex justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </Card>
            ) : dailyPuzzle ? (
              <Card className="p-6 md:p-8 bg-gradient-to-br from-card to-secondary/30 border-primary/20">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="shrink-0">
                    <ChessBoard fen={dailyPuzzle.fen} size="md" interactive className="glow-gold" />
                  </div>
                  <div className="flex-1 text-center lg:text-left">
                    <div className="flex items-center gap-3 justify-center lg:justify-start mb-4">
                      <Trophy className="w-6 h-6 text-primary" />
                      <h2 className="text-2xl font-serif font-bold text-foreground">
                        Problema del Día
                      </h2>
                    </div>
                    <p className="text-lg text-muted-foreground mb-2">
                      Turno de las {dailyPuzzle.turn === 'w' ? 'Blancas' : 'Negras'} • Rating: {dailyPuzzle.rating}
                    </p>
                    <div className="flex items-center gap-4 justify-center lg:justify-start text-sm text-muted-foreground mb-6">
                      <span>Solución: {dailyPuzzle.solution?.length} movimientos</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                      <Button variant="hero" size="lg">
                        <Target className="w-5 h-5 mr-2" />
                        Resolver Ahora
                      </Button>
                      <Button variant="outline" size="lg">
                        Ver Pista
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ) : null}
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
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedLevel === level
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredProblems.map((problem) => (
                  <Card
                    key={problem.id}
                    className="p-4 bg-card border-border hover:border-primary/30 transition-all cursor-pointer group"
                  >
                    <div className="aspect-square bg-secondary rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                      <span className="text-4xl opacity-10 font-serif">
                        {problem.turn === 'w' ? '♔' : '♚'}
                      </span>
                      <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="hero" size="sm">
                          Resolver
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-[10px] uppercase">
                        {problem.rating < 1200 ? 'Principiante' : problem.rating < 1800 ? 'Intermedio' : 'Avanzado'}
                      </Badge>
                      <span className="text-xs text-primary font-medium">
                        Rating: {problem.rating}
                      </span>
                    </div>
                    <p className="font-medium text-foreground text-sm line-clamp-1">
                      Problema #{problem.id}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {problem.solution?.length} movimientos
                    </p>
                  </Card>
                ))}
                {filteredProblems.length === 0 && (
                  <div className="col-span-full py-12 text-center text-muted-foreground italic">
                    No se encontraron problemas con los criterios seleccionados.
                  </div>
                )}
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
