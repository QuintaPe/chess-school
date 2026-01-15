import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Crown, Mail, Lock, User, ArrowLeft, Loader2, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [isLogin, setIsLogin] = useState(searchParams.get("mode") !== "register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login({ email, password });
        toast.success("¡Bienvenido de nuevo!");
        navigate("/dashboard");
      } else {
        await register({
          email,
          password,
          name,
          role: 'student', // Default role
          subscription_plan: 'free' // Default plan
        });
        toast.success("¡Cuenta creada exitosamente!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error(error);
      const message = error.message || "Ocurrió un error inesperado";
      toast.error(message.includes("Failed to fetch") ? "Error de conexión con el servidor" : message);
    } finally {
      setLoading(false);
    }
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
            <img
              src="/logo.png"
              alt="Club Reino Ajedrez"
              className="w-12 h-12 rounded-xl object-cover shadow-lg shadow-primary/25"
            />
            <span className="text-2xl font-serif font-bold text-foreground">
              Club Reino Ajedrez
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
                    required
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
                  required
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
                  required
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

            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                isLogin ? "Iniciar Sesión" : "Crear Cuenta"
              )}
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

          {/* Demo Login Section */}
          {isLogin && (
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Modo Demo (Sin Backend)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    // Simulate student login
                    const mockStudentData = {
                      token: "demo-student-token",
                      user: {
                        id: 1,
                        email: "estudiante@demo.com",
                        name: "Estudiante Demo",
                        role: "student" as const,
                        subscription_plan: "free" as const
                      }
                    };
                    localStorage.setItem("token", mockStudentData.token);
                    localStorage.setItem("user", JSON.stringify(mockStudentData.user));
                    toast.success("¡Sesión de estudiante iniciada!");
                    // Force page reload to trigger AuthContext
                    window.location.href = "/dashboard";
                  }}
                  disabled={loading}
                  className="h-12"
                >
                  <User className="w-4 h-4 mr-2" />
                  Estudiante
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    // Simulate admin login
                    const mockAdminData = {
                      token: "demo-admin-token",
                      user: {
                        id: 2,
                        email: "admin@demo.com",
                        name: "Admin Demo",
                        role: "admin" as const,
                        subscription_plan: "premium" as const
                      }
                    };
                    localStorage.setItem("token", mockAdminData.token);
                    localStorage.setItem("user", JSON.stringify(mockAdminData.user));
                    toast.success("¡Sesión de admin iniciada!");
                    // Force page reload to trigger AuthContext
                    window.location.href = "/admin";
                  }}
                  disabled={loading}
                  className="h-12"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              </div>
            </div>
          )}
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
