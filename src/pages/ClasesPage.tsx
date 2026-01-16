import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Calendar,
  Clock,
  Users,
  Video,
  BookOpen,
  ArrowRight,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const ClasesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: classes, isLoading } = useQuery<any[]>({
    queryKey: ["public-classes"],
    queryFn: () => api.classes.list(),
  });

  const registerMutation = useMutation({
    mutationFn: (id: number) => api.classes.register(id),
    onSuccess: () => {
      toast.success("¡Clase reservada con éxito! Redirigiendo a tu panel...");
      queryClient.invalidateQueries({ queryKey: ["public-classes"] });
      setTimeout(() => navigate("/dashboard/clases"), 1500);
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
    }
  });

  const handleRegister = (id: number) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    registerMutation.mutate(id);
  };

  const translateLevel = (level: string) => {
    switch (level) {
      case "beginner": return "Principiante";
      case "intermediate": return "Intermedio";
      case "advanced": return "Avanzado";
      default: return level;
    }
  };

  const liveClasses = classes?.filter(c => new Date(c.start_time) > new Date()).slice(0, 4) || [];

  const recordedClasses = [
    {
      id: 1,
      title: "Mates Básicos: Rey y Dama",
      duration: "45 min",
      views: 234,
      level: "Principiante",
      thumbnail: "♕",
    },
    {
      id: 2,
      title: "La Apertura Italiana",
      duration: "60 min",
      views: 189,
      level: "Principiante",
      thumbnail: "♗",
    },
    {
      id: 3,
      title: "Finales de Peones",
      duration: "55 min",
      views: 156,
      level: "Intermedio",
      thumbnail: "♙",
    },
    {
      id: 4,
      title: "Sacrificios en el Enroque",
      duration: "70 min",
      views: 298,
      level: "Avanzado",
      thumbnail: "♔",
    },
    {
      id: 5,
      title: "Estructuras de Peones",
      duration: "65 min",
      views: 167,
      level: "Intermedio",
      thumbnail: "♙",
    },
    {
      id: 6,
      title: "Ataques al Rey",
      duration: "80 min",
      views: 321,
      level: "Avanzado",
      thumbnail: "♚",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="px-6 mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
                Clases de <span className="gradient-gold-text">Ajedrez</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Aprende en vivo con clases interactivas o accede a nuestro catálogo
                de lecciones grabadas cuando quieras.
              </p>
            </div>
          </div>
        </section>

        {/* Live Classes */}
        <section className="px-6 mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-serif font-bold text-foreground">
                  Próximas Clases en Vivo
                </h2>
                <p className="text-muted-foreground mt-1">
                  Reserva tu plaza y aprende en tiempo real
                </p>
              </div>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Ver Calendario
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {liveClasses.length > 0 ? liveClasses.map((clase) => (
                  <Card
                    key={clase.id}
                    className="p-6 bg-card border-border hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Video className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium lowercase">
                              {new Date(clase.start_time).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono">
                              {new Date(clase.start_time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs uppercase">
                        {translateLevel(clase.level)}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {clase.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {clase.description || "Sin descripción disponible."}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          60 min
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {clase.capacity || 20} máx
                        </div>
                      </div>
                      <Button
                        variant="hero"
                        size="sm"
                        onClick={() => handleRegister(clase.id)}
                        disabled={registerMutation.isPending && registerMutation.variables === clase.id}
                      >
                        {registerMutation.isPending && registerMutation.variables === clase.id ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : clase.isRegistered ? (
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                        ) : null}
                        {clase.isRegistered ? "Reservada" : "Reservar"}
                      </Button>
                    </div>
                  </Card>
                )) : (
                  <div className="col-span-full py-10 text-center text-muted-foreground bg-secondary/10 rounded-xl border border-dashed border-border">
                    No hay clases programadas por ahora.
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Recorded Classes */}
        <section className="px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-serif font-bold text-foreground">
                  Clases Grabadas
                </h2>
                <p className="text-muted-foreground mt-1">
                  Aprende a tu ritmo con nuestro catálogo de lecciones
                </p>
              </div>
              <Button variant="ghost">
                Ver todas
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recordedClasses.map((clase) => (
                <Card
                  key={clase.id}
                  className="overflow-hidden bg-card border-border hover:border-primary/30 transition-all duration-300 cursor-pointer group"
                >
                  <div className="aspect-video bg-secondary flex items-center justify-center relative">
                    <span className="text-6xl opacity-20">{clase.thumbnail}</span>
                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 scale-90 group-hover:scale-100 transition-transform">
                        <Play className="w-8 h-8 text-primary-foreground ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-[10px] uppercase">
                        {clase.level}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {clase.duration}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {clase.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                      <BookOpen className="w-4 h-4" />
                      {clase.views} visualizaciones
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ClasesPage;
