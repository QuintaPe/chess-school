import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PricingSection } from "@/components/landing/PricingSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, HelpCircle } from "lucide-react";

const PreciosPage = () => {
  const faqs = [
    {
      question: "¿Puedo cambiar de plan en cualquier momento?",
      answer: "Sí, puedes actualizar o cambiar tu plan cuando quieras. Los cambios se aplican inmediatamente y se ajusta el cobro de forma proporcional."
    },
    {
      question: "¿Hay compromiso de permanencia?",
      answer: "No, todos nuestros planes son mensuales sin permanencia. Puedes cancelar cuando lo desees sin penalizaciones."
    },
    {
      question: "¿Qué métodos de pago aceptan?",
      answer: "Aceptamos todas las tarjetas de crédito/débito principales, PayPal y transferencia bancaria para planes anuales."
    },
    {
      question: "¿Ofrecen descuentos para estudiantes?",
      answer: "Sí, ofrecemos un 30% de descuento para estudiantes con email universitario válido. Contáctanos para más información."
    },
    {
      question: "¿Puedo probar antes de pagar?",
      answer: "Por supuesto. Nuestro plan Gratis te permite explorar la plataforma sin compromiso. Además, todos los planes de pago tienen 14 días de garantía."
    },
  ];

  const comparison = [
    { feature: "Lecciones básicas", free: true, student: true, premium: true },
    { feature: "Problemas diarios", free: "10/día", student: "Ilimitados", premium: "Ilimitados" },
    { feature: "Clases en vivo grupales", free: false, student: true, premium: true },
    { feature: "Clases privadas", free: false, student: false, premium: "2/mes" },
    { feature: "Acceso a cursos", free: "Básicos", student: "Todos", premium: "Todos + Anticipado" },
    { feature: "Estadísticas avanzadas", free: false, student: true, premium: true },
    { feature: "Análisis de partidas", free: false, student: false, premium: true },
    { feature: "Plan personalizado", free: false, student: false, premium: true },
    { feature: "Soporte prioritario", free: false, student: true, premium: true },
    { feature: "Certificados", free: false, student: false, premium: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="px-6 mb-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Planes y <span className="gradient-gold-text">Precios</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Elige el plan que mejor se adapte a tu nivel y objetivos. 
              Todos incluyen acceso a la comunidad y soporte.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <PricingSection />

        {/* Comparison Table */}
        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-serif font-bold text-foreground text-center mb-8">
              Comparación de Planes
            </h2>
            <Card className="overflow-hidden bg-card border-border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-semibold text-foreground">Característica</th>
                      <th className="text-center p-4 font-semibold text-foreground">Gratis</th>
                      <th className="text-center p-4 font-semibold text-primary">Estudiante</th>
                      <th className="text-center p-4 font-semibold text-foreground">Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.map((row, index) => (
                      <tr key={index} className="border-b border-border last:border-0">
                        <td className="p-4 text-muted-foreground">{row.feature}</td>
                        <td className="p-4 text-center">
                          {typeof row.free === 'boolean' ? (
                            row.free ? (
                              <Check className="w-5 h-5 text-accent mx-auto" />
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )
                          ) : (
                            <span className="text-sm text-muted-foreground">{row.free}</span>
                          )}
                        </td>
                        <td className="p-4 text-center bg-primary/5">
                          {typeof row.student === 'boolean' ? (
                            row.student ? (
                              <Check className="w-5 h-5 text-accent mx-auto" />
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )
                          ) : (
                            <span className="text-sm text-foreground">{row.student}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {typeof row.premium === 'boolean' ? (
                            row.premium ? (
                              <Check className="w-5 h-5 text-accent mx-auto" />
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )
                          ) : (
                            <span className="text-sm text-foreground">{row.premium}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </section>

        {/* FAQs */}
        <section className="px-6 py-16 bg-card">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
                Preguntas Frecuentes
              </h2>
              <p className="text-muted-foreground">
                ¿Tienes dudas? Aquí encontrarás las respuestas más comunes.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="p-5 bg-background border-border">
                  <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-muted-foreground mb-4">
                ¿No encuentras lo que buscas?
              </p>
              <Button variant="outline">
                Contactar Soporte
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PreciosPage;
