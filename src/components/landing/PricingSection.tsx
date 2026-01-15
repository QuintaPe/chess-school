import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingTierProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  ctaText: string;
}

const PricingTier = ({ name, price, period, description, features, popular, ctaText }: PricingTierProps) => (
  <div className={`relative p-8 rounded-2xl border ${popular ? 'border-primary bg-card shadow-xl shadow-primary/10' : 'border-border bg-card/50'} transition-all duration-300 hover:border-primary/50`}>
    {popular && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
        <span className="px-4 py-1 rounded-full bg-gradient-to-r from-primary to-[hsl(35_90%_45%)] text-primary-foreground text-sm font-medium flex items-center gap-1">
          <Star className="w-4 h-4" />
          Popular
        </span>
      </div>
    )}
    
    <div className="text-center mb-6">
      <h3 className="text-xl font-serif font-semibold text-foreground mb-2">{name}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
    
    <div className="text-center mb-6">
      <span className="text-4xl font-bold text-foreground">{price}</span>
      <span className="text-muted-foreground">/{period}</span>
    </div>
    
    <ul className="space-y-3 mb-8">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-3">
          <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <span className="text-muted-foreground text-sm">{feature}</span>
        </li>
      ))}
    </ul>
    
    <Button variant={popular ? "hero" : "outline"} className="w-full" size="lg">
      {ctaText}
    </Button>
  </div>
);

export const PricingSection = () => {
  const tiers = [
    {
      name: "Gratis",
      price: "0€",
      period: "mes",
      description: "Para empezar a aprender",
      features: [
        "Acceso a lecciones básicas",
        "10 problemas diarios",
        "Seguimiento básico de progreso",
        "Comunidad de estudiantes",
      ],
      ctaText: "Empezar Gratis",
    },
    {
      name: "Estudiante",
      price: "19€",
      period: "mes",
      description: "Para jugadores en desarrollo",
      features: [
        "Todo lo de Gratis",
        "Clases en vivo grupales",
        "Problemas ilimitados",
        "Acceso a todos los cursos",
        "Estadísticas avanzadas",
        "Soporte prioritario",
      ],
      popular: true,
      ctaText: "Comenzar Ahora",
    },
    {
      name: "Premium",
      price: "49€",
      period: "mes",
      description: "Entrenamiento profesional",
      features: [
        "Todo lo de Estudiante",
        "Clases privadas mensuales",
        "Análisis de partidas",
        "Plan de estudio personalizado",
        "Acceso anticipado a contenido",
        "Certificados de nivel",
      ],
      ctaText: "Contactar",
    },
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-background to-card">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-serif gradient-gold-text mb-4">
            Planes para cada nivel
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tus objetivos. Todos incluyen acceso a la plataforma completa.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <PricingTier key={tier.name} {...tier} />
          ))}
        </div>
      </div>
    </section>
  );
};
