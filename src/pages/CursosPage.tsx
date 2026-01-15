import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star,
  Play,
  CheckCircle,
  Lock,
  ArrowRight
} from "lucide-react";

const CursosPage = () => {
  const courses = [
    {
      id: 1,
      title: "Fundamentos del Ajedrez",
      description: "Aprende las reglas, movimientos y conceptos básicos para empezar a jugar",
      level: "Principiante",
      lessons: 12,
      duration: "4 horas",
      students: 456,
      rating: 4.9,
      progress: 100,
      thumbnail: "♙",
      featured: false,
    },
    {
      id: 2,
      title: "Táctica para Principiantes",
      description: "Descubre los patrones tácticos más comunes: clavadas, horquillas y más",
      level: "Principiante",
      lessons: 15,
      duration: "5 horas",
      students: 389,
      rating: 4.8,
      progress: 65,
      thumbnail: "♘",
      featured: false,
    },
    {
      id: 3,
      title: "Aperturas Esenciales",
      description: "Domina las aperturas más importantes: Italiana, Española, Siciliana",
      level: "Intermedio",
      lessons: 20,
      duration: "8 horas",
      students: 512,
      rating: 4.9,
      progress: 30,
      thumbnail: "♗",
      featured: true,
    },
    {
      id: 4,
      title: "Finales Fundamentales",
      description: "Los finales que todo jugador debe conocer para ganar partidas",
      level: "Intermedio",
      lessons: 18,
      duration: "6 horas",
      students: 287,
      rating: 4.7,
      progress: 0,
      thumbnail: "♖",
      featured: false,
    },
    {
      id: 5,
      title: "Estrategia Posicional",
      description: "Aprende a evaluar posiciones y crear planes a largo plazo",
      level: "Avanzado",
      lessons: 24,
      duration: "10 horas",
      students: 198,
      rating: 4.9,
      progress: 0,
      thumbnail: "♕",
      featured: false,
    },
    {
      id: 6,
      title: "Preparación de Torneos",
      description: "Técnicas de preparación, gestión del tiempo y psicología competitiva",
      level: "Avanzado",
      lessons: 16,
      duration: "7 horas",
      students: 145,
      rating: 4.8,
      progress: 0,
      thumbnail: "♔",
      featured: false,
    },
  ];

  const learningPaths = [
    {
      title: "De Principiante a Club",
      description: "Ruta completa para alcanzar nivel de club en 6 meses",
      courses: 4,
      duration: "20 horas",
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Maestría Táctica",
      description: "Especialízate en cálculo y visión táctica",
      courses: 3,
      duration: "15 horas",
      color: "from-primary to-amber-600",
    },
    {
      title: "Repertorio de Aperturas",
      description: "Construye un repertorio sólido con blancas y negras",
      courses: 5,
      duration: "25 horas",
      color: "from-blue-500 to-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="px-6 mb-16">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
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
            <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
              Rutas de Aprendizaje
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {learningPaths.map((path, index) => (
                <Card 
                  key={index}
                  className="p-6 bg-card border-border hover:border-primary/30 transition-all cursor-pointer group overflow-hidden relative"
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${path.color}`} />
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {path.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {path.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{path.courses} cursos</span>
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
              <h2 className="text-2xl font-serif font-bold text-foreground">
                Todos los Cursos
              </h2>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">Todos</Button>
                <Button variant="ghost" size="sm">Principiante</Button>
                <Button variant="ghost" size="sm">Intermedio</Button>
                <Button variant="ghost" size="sm">Avanzado</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card 
                  key={course.id}
                  className={`overflow-hidden bg-card border-border hover:border-primary/30 transition-all group ${
                    course.featured ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
                  }`}
                >
                  {course.featured && (
                    <div className="bg-primary text-primary-foreground text-xs font-medium text-center py-1">
                      ⭐ Curso Destacado
                    </div>
                  )}
                  
                  <div className="aspect-video bg-secondary flex items-center justify-center relative">
                    <span className="text-7xl opacity-30">{course.thumbnail}</span>
                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="hero">
                        <Play className="w-5 h-5 mr-2" />
                        {course.progress > 0 ? 'Continuar' : 'Empezar'}
                      </Button>
                    </div>
                    {course.progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                        <div 
                          className="h-full bg-accent transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        course.level === 'Principiante' ? 'bg-green-500/10 text-green-500' :
                        course.level === 'Intermedio' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {course.level}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-primary fill-primary" />
                        <span className="text-sm font-medium text-foreground">{course.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {course.lessons} lecciones
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </div>
                      </div>
                      {course.progress === 100 && (
                        <CheckCircle className="w-5 h-5 text-accent" />
                      )}
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

export default CursosPage;
