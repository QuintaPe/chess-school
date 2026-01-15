import { Crown, BookOpen, Target, Users, BarChart3, GraduationCap } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => (
  <div 
    className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
      <div className="text-primary">{icon}</div>
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2 font-serif">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
  </div>
);

export const FeaturesSection = () => {
  const features = [
    {
      icon: <Crown className="w-6 h-6" />,
      title: "Clases en Directo",
      description: "Aprende en tiempo real con tablero interactivo sincronizado y chat integrado.",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Contenido Premium",
      description: "Accede a lecciones grabadas, videos explicativos y material de estudio organizado por nivel.",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Problemas Personalizados",
      description: "Resuelve ejercicios adaptados a tu nivel con feedback instantáneo y análisis de errores.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Grupos de Estudio",
      description: "Participa en clases grupales y aprende junto a otros estudiantes de tu nivel.",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Seguimiento de Progreso",
      description: "Visualiza tu evolución con estadísticas detalladas y recomendaciones personalizadas.",
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Rutas de Aprendizaje",
      description: "Sigue cursos estructurados desde principiante hasta nivel avanzado.",
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-serif gradient-gold-text mb-4">
            Tu camino hacia la maestría
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Una plataforma completa diseñada para llevarte desde los fundamentos hasta el nivel de experto.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} delay={index * 100} />
          ))}
        </div>
      </div>
    </section>
  );
};
