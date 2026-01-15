import { Link } from "react-router-dom";
import { Crown, Mail, Twitter, Youtube, Github } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[hsl(35_90%_45%)] flex items-center justify-center">
                <Crown className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-serif font-bold text-foreground">
                Club Reino Ajedrez
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6">
              La escuela online de ajedrez donde aprenderás con métodos profesionales,
              clases interactivas y seguimiento personalizado.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Plataforma</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/clases" className="text-muted-foreground hover:text-primary transition-colors">
                  Clases en Vivo
                </Link>
              </li>
              <li>
                <Link to="/problemas" className="text-muted-foreground hover:text-primary transition-colors">
                  Problemas
                </Link>
              </li>
              <li>
                <Link to="/cursos" className="text-muted-foreground hover:text-primary transition-colors">
                  Cursos
                </Link>
              </li>
              <li>
                <Link to="/precios" className="text-muted-foreground hover:text-primary transition-colors">
                  Precios
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Soporte</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Centro de Ayuda
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Contacto
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Términos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacidad
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Club Reino Ajedrez. Todos los derechos reservados.
          </p>
          <p className="text-sm text-muted-foreground">
            Hecho con ♔ para apasionados del ajedrez
          </p>
        </div>
      </div>
    </footer>
  );
};
