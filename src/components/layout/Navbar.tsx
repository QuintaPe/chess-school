import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Crown, User, LogIn } from "lucide-react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[hsl(35_90%_45%)] flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
              <Crown className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-serif font-bold text-foreground hidden sm:block">
              Club Reino Ajedrez
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/clases" className="text-muted-foreground hover:text-foreground transition-colors">
              Clases
            </Link>
            <Link to="/problemas" className="text-muted-foreground hover:text-foreground transition-colors">
              Problemas
            </Link>
            <Link to="/cursos" className="text-muted-foreground hover:text-foreground transition-colors">
              Cursos
            </Link>
            <Link to="/profesores" className="text-muted-foreground hover:text-foreground transition-colors">
              Profesores
            </Link>
            <Link to="/precios" className="text-muted-foreground hover:text-foreground transition-colors">
              Precios
            </Link>
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth">
                <LogIn className="w-4 h-4 mr-2" />
                Iniciar Sesión
              </Link>
            </Button>
            <Button variant="hero" size="sm" asChild>
              <Link to="/auth?mode=register">
                Empezar Gratis
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground hover:bg-secondary rounded-lg transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link
                to="/clases"
                className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Clases
              </Link>
              <Link
                to="/problemas"
                className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Problemas
              </Link>
              <Link
                to="/cursos"
                className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Cursos
              </Link>
              <Link
                to="/profesores"
                className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Profesores
              </Link>
              <Link
                to="/precios"
                className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Precios
              </Link>
              <div className="pt-4 border-t border-border flex flex-col gap-2">
                <Button variant="ghost" asChild className="justify-start">
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <LogIn className="w-4 h-4 mr-2" />
                    Iniciar Sesión
                  </Link>
                </Button>
                <Button variant="hero" asChild>
                  <Link to="/auth?mode=register" onClick={() => setIsOpen(false)}>
                    Empezar Gratis
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
