import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Play, 
  Calendar, 
  Clock, 
  Users, 
  Video,
  BookOpen,
  Star,
  ArrowRight
} from "lucide-react";

const ClasesPage = () => {
  const liveClasses = [
    {
      id: 1,
      title: "Finales de Torre Avanzados",
      description: "Domina los finales más comunes y decisivos del ajedrez",
      date: "Hoy",
      time: "18:00",
      duration: "90 min",
      level: "Avanzado",
      students: 8,
      maxStudents: 12,
      isLive: true,
    },
    {
      id: 2,
      title: "Táctica: Clavadas y Descubiertas",
      description: "Aprende a identificar y ejecutar estas poderosas tácticas",
      date: "Mañana",
      time: "17:00",
      duration: "60 min",
      level: "Intermedio",
      students: 10,
      maxStudents: 15,
    },
    {
      id: 3,
      title: "Introducción a la Defensa Siciliana",
      description: "Los conceptos fundamentales de la apertura más popular",
      date: "Viernes",
      time: "18:00",
      duration: "75 min",
      level: "Intermedio",
      students: 12,
      maxStudents: 15,
    },
    {
      id: 4,
      title: "Estrategia: Control del Centro",
      description: "Por qué el centro es tan importante y cómo dominarlo",
      date: "Sábado",
      time: "11:00",
      duration: "60 min",
      level: "Principiante",
      students: 5,
      maxStudents: 20,
    },
  ];

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
    <div className="min-h-screen bg-background">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {liveClasses.map((clase) => (
                <Card 
                  key={clase.id} 
                  className={`p-6 bg-card border-border hover:border-primary/30 transition-all duration-300 ${
                    clase.isLive ? 'ring-2 ring-accent ring-offset-2 ring-offset-background' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {clase.isLive ? (
                        <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                          <Play className="w-5 h-5 text-accent" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Video className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            clase.isLive 
                              ? 'bg-accent/20 text-accent animate-pulse' 
                              : 'bg-primary/10 text-primary'
                          }`}>
                            {clase.isLive ? '● En Vivo' : clase.date}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {clase.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      clase.level === 'Principiante' ? 'bg-green-500/10 text-green-500' :
                      clase.level === 'Intermedio' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {clase.level}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {clase.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {clase.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {clase.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {clase.students}/{clase.maxStudents}
                      </div>
                    </div>
                    <Button variant={clase.isLive ? "success" : "hero"} size="sm">
                      {clase.isLive ? 'Unirse Ahora' : 'Reservar'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
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
                    <span className="text-6xl opacity-50">{clase.thumbnail}</span>
                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                        <Play className="w-8 h-8 text-primary-foreground ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                        clase.level === 'Principiante' ? 'bg-green-500/10 text-green-500' :
                        clase.level === 'Intermedio' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {clase.level}
                      </span>
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
