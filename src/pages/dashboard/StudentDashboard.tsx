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
  Calendar,
  Trophy,
  Flame
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const StudentDashboard = () => {
  const { user } = useAuth();

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
          <Button variant="hero">
            <Play className="w-4 h-4 mr-2" />
            Clase en Vivo
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-card border-border hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Flame className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">12</p>
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
                <p className="text-2xl font-bold text-foreground">156</p>
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
                <p className="text-2xl font-bold text-foreground">8</p>
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
                <p className="text-2xl font-bold text-foreground">78%</p>
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
                <p className="text-sm text-muted-foreground">Mate en 2 - Nivel Intermedio</p>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <Trophy className="w-5 h-5" />
                <span className="font-medium">+25 puntos</span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-6">
              <ChessBoard
                size="md"
                interactive={true}
                className="shrink-0"
              />
              <div className="flex-1 space-y-4">
                <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                  <p className="text-foreground font-medium mb-2">Objetivo:</p>
                  <p className="text-muted-foreground">
                    Las blancas juegan y dan mate en 2 movimientos.
                    Encuentra la secuencia ganadora.
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
          </Card>

          {/* Upcoming classes */}
          <Card className="p-6 bg-card border-border">
            <h2 className="text-xl font-serif font-semibold text-foreground mb-4">
              Próximas Clases
            </h2>
            <div className="space-y-4">
              {[
                { title: "Finales de Torre", time: "Hoy, 18:00", level: "Intermedio" },
                { title: "Táctica Avanzada", time: "Mañana, 17:00", level: "Avanzado" },
                { title: "Aperturas Clásicas", time: "Viernes, 18:00", level: "Intermedio" },
              ].map((clase, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">{clase.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{clase.time}</span>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                      {clase.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              Ver todas las clases
            </Button>
          </Card>
        </div>

        {/* Recent activity */}
        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-serif font-semibold text-foreground mb-4">
            Tu Actividad Reciente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { type: "Problema", title: "Mate en 3", result: "Correcto", time: "Hace 2h", icon: Target },
              { type: "Lección", title: "Finales básicos", result: "Completada", time: "Hace 1 día", icon: BookOpen },
              { type: "Clase", title: "Táctica media", result: "Asistida", time: "Hace 2 días", icon: Calendar },
              { type: "Problema", title: "Defensa material", result: "Incorrecto", time: "Hace 3 días", icon: Target },
            ].map((activity, index) => (
              <div key={index} className="p-4 rounded-xl bg-secondary/30 border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <activity.icon className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">{activity.type}</span>
                </div>
                <p className="font-medium text-foreground mb-1">{activity.title}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${activity.result === 'Correcto' || activity.result === 'Completada' || activity.result === 'Asistida' ? 'text-accent' : 'text-destructive'}`}>
                    {activity.result}
                  </span>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
