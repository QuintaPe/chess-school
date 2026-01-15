import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Trophy, 
  Star, 
  Users, 
  BookOpen,
  Target,
  GraduationCap,
  Calendar,
  MessageSquare,
  ChevronRight
} from "lucide-react";

const ProfesoresPage = () => {
  const mainTeacher = {
    name: "Maestro Carlos Fernández",
    title: "Maestro FIDE • Fundador de ChessMaster",
    rating: 2350,
    experience: "15+ años enseñando",
    students: "500+",
    image: "♔",
    bio: `Apasionado del ajedrez desde los 6 años, obtuve el título de Maestro FIDE a los 22. 
    He dedicado los últimos 15 años a la enseñanza del ajedrez, desarrollando un método único 
    que combina la teoría clásica con las técnicas modernas de entrenamiento.
    
    Mi filosofía es simple: el ajedrez debe ser accesible, divertido y efectivo. 
    Cada alumno tiene su propio ritmo y estilo de aprendizaje, y mi trabajo es 
    encontrar la mejor manera de ayudarte a alcanzar tus objetivos.`,
    achievements: [
      "Campeón Regional 2015, 2018, 2021",
      "Top 100 Nacional España",
      "Entrenador certificado FIDE",
      "Autor del libro 'Táctica Moderna'",
      "Más de 5000 horas de clase impartidas",
    ],
    specialties: [
      "Táctica y Cálculo",
      "Finales",
      "Preparación de Torneos",
      "Ajedrez para Principiantes",
    ],
  };

  const stats = [
    { icon: Users, value: "500+", label: "Alumnos formados" },
    { icon: Trophy, value: "15+", label: "Años de experiencia" },
    { icon: Star, value: "4.9", label: "Valoración media" },
    { icon: BookOpen, value: "50+", label: "Cursos creados" },
  ];

  const testimonials = [
    {
      name: "María García",
      level: "De 1200 a 1650 ELO",
      text: "El método del profesor Carlos es increíble. En solo 6 meses mejoré 450 puntos de rating. Las clases son claras, prácticas y muy motivadoras.",
      avatar: "M",
    },
    {
      name: "Juan Martínez",
      level: "Principiante a Intermedio",
      text: "Empecé sin saber nada y ahora compito en torneos locales. La paciencia y dedicación del profesor hacen toda la diferencia.",
      avatar: "J",
    },
    {
      name: "Ana López",
      level: "Nivel Club",
      text: "Las clases privadas de preparación de torneos me ayudaron a ganar mi primer torneo. Altamente recomendado.",
      avatar: "A",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="px-6 mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Image/Avatar */}
              <div className="flex justify-center lg:justify-start order-2 lg:order-1">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-xl" />
                  <Card className="relative w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-card to-secondary flex items-center justify-center border-primary/20 glow-gold">
                    <span className="text-[12rem] opacity-80">{mainTeacher.image}</span>
                  </Card>
                  <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-semibold shadow-lg">
                    ELO {mainTeacher.rating}
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="order-1 lg:order-2 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <GraduationCap className="w-4 h-4" />
                  Tu Profesor
                </div>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
                  {mainTeacher.name}
                </h1>
                <p className="text-xl text-primary font-medium mb-6">
                  {mainTeacher.title}
                </p>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line mb-8">
                  {mainTeacher.bio}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button variant="hero" size="lg">
                    <Calendar className="w-5 h-5 mr-2" />
                    Reservar Clase Privada
                  </Button>
                  <Button variant="outline" size="lg">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Contactar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="px-6 mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="p-6 bg-card border-border text-center">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements & Specialties */}
        <section className="px-6 mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Achievements */}
              <Card className="p-6 bg-card border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-foreground">
                    Logros y Reconocimientos
                  </h2>
                </div>
                <ul className="space-y-3">
                  {mainTeacher.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Star className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Specialties */}
              <Card className="p-6 bg-card border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-foreground">
                    Especialidades
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {mainTeacher.specialties.map((specialty, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-colors"
                    >
                      <span className="text-foreground font-medium">{specialty}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-6 mb-16 py-16 bg-card">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
                Lo que dicen mis <span className="gradient-gold-text">alumnos</span>
              </h2>
              <p className="text-muted-foreground">
                Historias reales de estudiantes que han mejorado su juego
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-6 bg-background border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-[hsl(35_90%_45%)] flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-primary">{testimonial.level}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                  <div className="flex gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 md:p-12 bg-gradient-to-br from-card to-secondary/30 border-primary/20 text-center">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
                ¿Listo para mejorar tu ajedrez?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Únete a la comunidad ChessMaster y comienza tu camino hacia la maestría del ajedrez.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="xl">
                  Empezar Gratis
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="glass" size="xl">
                  Ver Planes
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProfesoresPage;
