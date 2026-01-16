import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Clock,
  Users,
  Star,
  Play,
  CheckCircle,
  Lock,
  ArrowRight,
  Loader2
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Course } from "@/types/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const CursosPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["public-courses"],
    queryFn: () => api.courses.list(),
  });

  const enrollMutation = useMutation({
    mutationFn: (id: number) => api.courses.enroll(id),
    onSuccess: () => {
      toast.success("¡Inscrito con éxito! Redirigiendo a tu panel...");
      queryClient.invalidateQueries({ queryKey: ["public-courses"] });
      setTimeout(() => navigate("/dashboard/cursos"), 1500);
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
    }
  });

  const handleEnroll = (courseId: number) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    enrollMutation.mutate(courseId);
  };

  const translateLevel = (level: string) => {
    switch (level) {
      case "beginner": return "Principiante";
      case "intermediate": return "Intermedio";
      case "advanced": return "Avanzado";
      default: return level;
    }
  };

  const learningPaths = [
    {
      title: "De Principiante a Club",
      description: "Ruta completa para alcanzar nivel de club en 6 meses",
      coursesCount: 4,
      duration: "20 horas",
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Maestría Táctica",
      description: "Especialízate en cálculo y visión táctica",
      coursesCount: 3,
      duration: "15 horas",
      color: "from-primary to-amber-600",
    },
    {
      title: "Repertorio de Aperturas",
      description: "Construye un repertorio sólido con blancas y negras",
      coursesCount: 5,
      duration: "25 horas",
      color: "from-blue-500 to-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="px-6 mb-16 text-center">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Cursos de <span className="gradient-gold-text">Ajedrez</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Aprende de forma estructurada con nuestros cursos diseñados por expertos.
              Desde los fundamentos hasta técnicas avanzadas.
            </p>
          </div>
        </section>

        {/* Learning Paths */}
        <section className="px-6 mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-serif font-bold mb-6">Rutas de Aprendizaje</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {learningPaths.map((path, index) => (
                <Card
                  key={index}
                  className="p-6 bg-card border-border hover:border-primary/30 transition-all cursor-pointer group overflow-hidden relative"
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${path.color}`} />
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{path.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{path.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{path.coursesCount} cursos</span>
                    <span>•</span>
                    <span>{path.duration}</span>
                  </div>
                  <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif font-bold">Todos los Cursos</h2>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses?.map((course) => (
                  <Card
                    key={course.id}
                    className="overflow-hidden bg-card border-border hover:border-primary/30 transition-all group"
                  >
                    <div className="aspect-video bg-secondary flex items-center justify-center relative overflow-hidden">
                      {course.thumbnail_url ? (
                        <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-7xl opacity-30">♙</span>
                      )}
                      <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          variant="hero"
                          onClick={() => handleEnroll(course.id)}
                          disabled={enrollMutation.isPending}
                        >
                          {enrollMutation.isPending && enrollMutation.variables === course.id ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : course.isEnrolled ? (
                            <CheckCircle className="w-4 h-4 mr-2" />
                          ) : (
                            <Play className="w-4 h-4 mr-2" />
                          )}
                          {course.isEnrolled ? "Ver Mi Progreso" : "Empezar Ahora"}
                        </Button>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="uppercase text-[10px]">
                          {translateLevel(course.level)}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-primary fill-primary" />
                          <span className="text-sm font-medium">4.9</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {course.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {course.category}
                          </span>
                        </div>
                        <span className="font-bold text-foreground">
                          {course.price === 0 ? "GRATIS" : `${course.price}€`}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CursosPage;
