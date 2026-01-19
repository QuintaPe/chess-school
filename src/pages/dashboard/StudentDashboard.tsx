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
  Loader2,
  Medal,
  Star
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { DiscordWidget } from "@/components/layout/DiscordWidget";
import { AchievementBadge } from "@/components/chess/AchievementBadge";

import { DailyPuzzle, DailyStats, Achievement } from "@/types/api";

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: dailyPuzzle, isLoading: isLoadingPuzzle } = useQuery<DailyPuzzle>({
    queryKey: ["daily-puzzle"],
    queryFn: () => api.puzzles.daily(),
  });

  const { data: dailyStats } = useQuery<DailyStats>({
    queryKey: ["daily-stats"],
    queryFn: () => api.puzzles.dailyStats(),
  });

  const { data: generalStats } = useQuery({
    queryKey: ["student-stats"],
    queryFn: () => api.users.getStats(),
  });

  const { data: classes, isLoading: isLoadingClasses } = useQuery<any[]>({
    queryKey: ["upcoming-classes"],
    queryFn: () => api.classes.list(),
  });

  const { data: achievements } = useQuery<Achievement[]>({
    queryKey: ["achievements"],
    queryFn: () => api.achievements.list(),
  });

  const upcomingClasses = classes?.filter(c => new Date(c.start_time) > new Date()).slice(0, 3) || [];
  const recentAchievements = achievements?.filter(a => a.isUnlocked).slice(0, 4) || [];

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-card border-border hover:border-primary/30 transition-colors border-b-primary border-b-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Flame className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{dailyStats?.currentStreak || 0}</p>
                <p className="text-sm text-muted-foreground">Días de racha</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-card border-border hover:border-primary/30 transition-colors border-b-accent border-b-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{dailyStats?.totalSolved || generalStats?.totalPuzzles || 0}</p>
                <p className="text-sm text-muted-foreground">Problemas resueltos</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-card border-border hover:border-primary/30 transition-colors border-b-blue-500 border-b-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{generalStats?.completedLessons || 0}</p>
                <p className="text-sm text-muted-foreground">Lecciones completadas</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-card border-border hover:border-primary/30 transition-colors border-b-purple-500 border-b-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{dailyStats?.solveRate || generalStats?.accuracy || 0}%</p>
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
                <div className="shrink-0 relative">
                  <ChessBoard
                    fen={dailyPuzzle.fen}
                    size="md"
                    interactive={false}
                    className="opacity-90 group-hover:opacity-100 transition-opacity"
                    flipped={(dailyPuzzle.turn || dailyPuzzle.fen.split(' ')[1]) === 'w'}
                  />
                  {dailyPuzzle.userAttempt?.solved && (
                    <div className="absolute inset-0 bg-green-500/10 backdrop-blur-[1px] flex items-center justify-center rounded-lg">
                      <Badge className="bg-green-500 text-white border-none shadow-lg scale-110">
                        ¡Resuelto!
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                    <p className="text-foreground font-medium mb-2">Objetivo:</p>
                    <p className="text-muted-foreground">
                      Juegan las {dailyPuzzle.turn === 'w' ? 'Blancas' : 'Negras'}.
                      Encuentra la mejor continuación para ganar ventaja o dar mate.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="hero"
                      className="flex-1"
                      onClick={() => navigate('/dashboard/problemas')}
                    >
                      {dailyPuzzle.userAttempt?.solved ? 'Ver de nuevo' : 'Resolver ahora'}
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
                    className="p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/clases/${clase.id}/live`)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors">{clase.title}</p>
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

          <DiscordWidget />
        </div>

        {/* Achievements Preview */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif font-semibold text-foreground flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Tus Medallas Recientes
            </h2>
            <Link to="/dashboard/logros" className="text-sm text-primary hover:underline flex items-center gap-1">
              Ver todas <Medal className="w-4 h-4" />
            </Link>
          </div>

          {recentAchievements.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recentAchievements.map((achievement) => (
                <div key={achievement.id} className="flex flex-col items-center gap-2">
                  <AchievementBadge achievement={achievement} size="md" />
                  <span className="text-xs font-medium text-center">{achievement.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <Medal className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground italic">
                Aún no has desbloqueado medallas. ¡Resuelve el puzzle de hoy para empezar!
              </p>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout >
  );
};

export default StudentDashboard;
