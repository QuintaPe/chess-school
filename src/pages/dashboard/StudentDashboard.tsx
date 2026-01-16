import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChessBoard } from "@/components/chess/ChessBoard";
import {
  Target,
  BookOpen,
  Clock,
  TrendingUp,
  Play,
  Trophy,
  Flame,
  Loader2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const { user } = useAuth();

  const { data: dailyPuzzle, isLoading: isLoadingPuzzle } = useQuery({
    queryKey: ["daily-puzzle"],
    queryFn: () => api.puzzles.daily(),
  });

  const { data: classes, isLoading: isLoadingClasses } = useQuery<any[]>({
    queryKey: ["upcoming-classes"],
    queryFn: () => api.classes.list(),
  });

  const upcomingClasses = classes?.filter(c => new Date(c.start_time) > new Date()).slice(0, 3) || [];

  return (
    <DashboardLayout role="student">
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">
              ¡Hola, {user?.name || 'Estudiante'}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Continúa tu entrenamiento de hoy
            </p>
          </div>
          <Link to="/dashboard/clases">
            <Button variant="hero">
              <Play className="w-4 h-4 mr-2" />
              Ver Clases en Vivo
            </Button>
          </Link>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-card border-border hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Flame className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">--</p>
                <p className="text-sm text-muted-foreground">Días de racha</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-card border-border hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">--</p>
                <p className="text-sm text-muted-foreground">Problemas resueltos</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-card border-border hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">--</p>
                <p className="text-sm text-muted-foreground">Lecciones completadas</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-card border-border hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">--%</p>
                <p className="text-sm text-muted-foreground">Precisión media</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily challenge */}
          <Card className="p-6 bg-card border-border lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-serif font-semibold text-foreground">
                  Problema del Día
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isLoadingPuzzle ? "Cargando..." : dailyPuzzle ? `Rating: ${dailyPuzzle.rating}` : "No disponible"}
                </p>
              </div>
              {dailyPuzzle && (
                <div className="flex items-center gap-2 text-primary">
                  <Trophy className="w-5 h-5" />
                  <span className="font-medium">+{dailyPuzzle.rating > 1500 ? 50 : 25} puntos</span>
                </div>
              )}
            </div>

            {isLoadingPuzzle ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : dailyPuzzle ? (
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <ChessBoard
                  fen={dailyPuzzle.fen}
                  size="md"
                  interactive={true}
                  className="shrink-0"
                />
                <div className="flex-1 space-y-4">
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                    <p className="text-foreground font-medium mb-2">Objetivo:</p>
                    <p className="text-muted-foreground">
                      Juegan las {dailyPuzzle.turn === 'w' ? 'Blancas' : 'Negras'}.
                      Encuentra la mejor continuación para ganar ventaja o dar mate.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="hero" className="flex-1">
                      Resolver
                    </Button>
                    <Button variant="outline">
                      Ver Pista
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-muted-foreground">
                No hay problema diario disponible en este momento.
              </div>
            )}
          </Card>

          {/* Upcoming classes */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-serif font-semibold text-foreground">
                Próximas Clases
              </h2>
              <Link to="/dashboard/clases" className="text-xs text-primary hover:underline">Ver todas</Link>
            </div>
            <div className="space-y-4">
              {isLoadingClasses ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : upcomingClasses.length > 0 ? (
                upcomingClasses.map((clase) => (
                  <div
                    key={clase.id}
                    className="p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">{clase.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(clase.start_time).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}, {new Date(clase.start_time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] uppercase">
                        {clase.level}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-muted-foreground italic text-sm">No hay clases próximas.</p>
              )}
            </div>
            <Link to="/dashboard/clases">
              <Button variant="ghost" className="w-full mt-4">
                Ver todas las clases
              </Button>
            </Link>
          </Card>
        </div>

        {/* Recent activity placeholder */}
        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-serif font-semibold text-foreground mb-4">
            Tu Actividad Reciente
          </h2>
          <div className="flex items-center justify-center h-24 text-muted-foreground italic">
            Próximamente: Registraremos tu progreso aquí
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
