import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useSearchParams } from "react-router-dom";
import { Crown, Mail, Lock, User, ArrowLeft } from "lucide-react";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get("mode") !== "register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement authentication
    console.log({ email, password, name, isLogin });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Back link */}
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-[hsl(35_90%_45%)] flex items-center justify-center shadow-lg shadow-primary/25">
              <Crown className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-serif font-bold text-foreground">
              ChessMaster
            </span>
          </div>

          {/* Header */}
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">
              {isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isLogin 
                ? "Inicia sesión para continuar con tu aprendizaje" 
                : "Comienza tu viaje hacia la maestría del ajedrez"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-12 bg-secondary border-border"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-secondary border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 bg-secondary border-border"
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <a href="#" className="text-sm text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            )}

            <Button type="submit" variant="hero" size="lg" className="w-full">
              {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
            </Button>
          </form>

          {/* Toggle */}
          <div className="text-center">
            <p className="text-muted-foreground">
              {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-primary hover:underline font-medium"
              >
                {isLogin ? "Regístrate" : "Inicia sesión"}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-card border-l border-border relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 text-center p-8 max-w-lg">
          <div className="text-8xl mb-8 animate-float">♔</div>
          <h2 className="text-3xl font-serif font-bold gradient-gold-text mb-4">
            Eleva tu juego
          </h2>
          <p className="text-muted-foreground text-lg">
            Únete a cientos de estudiantes que ya están mejorando su ajedrez con nuestro método profesional.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
