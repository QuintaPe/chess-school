import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import {
    User,
    Mail,
    Lock,
    Bell,
    Globe,
    Palette,
    Shield,
    Trash2,
    Save,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const StudentSettings = () => {
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(false);

    // Profile settings
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");

    // Notification settings
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [classReminders, setClassReminders] = useState(true);
    const [weeklyProgress, setWeeklyProgress] = useState(true);

    // Preferences
    const [language, setLanguage] = useState("es");
    const [theme, setTheme] = useState("dark");

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            // TODO: Implement API call to update profile
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success("Perfil actualizado correctamente");
        } catch (error) {
            toast.error("Error al actualizar el perfil");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveNotifications = async () => {
        setLoading(true);
        try {
            // TODO: Implement API call to update notifications
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success("Preferencias de notificaciones guardadas");
        } catch (error) {
            toast.error("Error al guardar las preferencias");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = () => {
        toast.info("Funcionalidad de cambio de contraseña próximamente");
    };

    const handleDeleteAccount = () => {
        toast.error("Esta acción requiere confirmación adicional");
    };

    return (
        <DashboardLayout role="student">
            <div className="p-6 lg:p-8 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">
                        Configuración
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Administra tu cuenta y preferencias
                    </p>
                </div>

                {/* Profile Settings */}
                <Card className="p-6 bg-card border-border">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-serif font-semibold text-foreground">
                                Información Personal
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Actualiza tu información de perfil
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre completo</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Tu nombre"
                                    className="bg-secondary border-border"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tu@email.com"
                                    className="bg-secondary border-border"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Plan actual</Label>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="font-medium text-foreground capitalize">
                                            {user?.subscription_plan || "Free"}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {user?.subscription_plan === "premium"
                                                ? "Acceso completo a todas las funciones"
                                                : "Acceso limitado"}
                                        </p>
                                    </div>
                                </div>
                                {user?.subscription_plan !== "premium" && (
                                    <Button variant="hero" size="sm">
                                        Actualizar a Premium
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                variant="hero"
                                onClick={handleSaveProfile}
                                disabled={loading}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Guardar Cambios
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Security */}
                <Card className="p-6 bg-card border-border">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <h2 className="text-xl font-serif font-semibold text-foreground">
                                Seguridad
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Gestiona tu contraseña y seguridad de la cuenta
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
                            <div>
                                <p className="font-medium text-foreground">Contraseña</p>
                                <p className="text-sm text-muted-foreground">
                                    Última actualización hace 30 días
                                </p>
                            </div>
                            <Button variant="outline" onClick={handleChangePassword}>
                                Cambiar Contraseña
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Notifications */}
                <Card className="p-6 bg-card border-border">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-serif font-semibold text-foreground">
                                Notificaciones
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Configura cómo quieres recibir notificaciones
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium text-foreground">
                                        Notificaciones por email
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Recibe actualizaciones importantes por correo
                                    </p>
                                </div>
                            </div>
                            <Switch
                                checked={emailNotifications}
                                onCheckedChange={setEmailNotifications}
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
                            <div className="flex items-center gap-3">
                                <Bell className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium text-foreground">
                                        Recordatorios de clases
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Recibe avisos antes de tus clases programadas
                                    </p>
                                </div>
                            </div>
                            <Switch
                                checked={classReminders}
                                onCheckedChange={setClassReminders}
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
                            <div className="flex items-center gap-3">
                                <Bell className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium text-foreground">
                                        Resumen semanal de progreso
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Recibe un resumen de tu actividad cada semana
                                    </p>
                                </div>
                            </div>
                            <Switch
                                checked={weeklyProgress}
                                onCheckedChange={setWeeklyProgress}
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button
                                variant="hero"
                                onClick={handleSaveNotifications}
                                disabled={loading}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Guardar Preferencias
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Preferences */}
                <Card className="p-6 bg-card border-border">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                            <Palette className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-serif font-semibold text-foreground">
                                Preferencias
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Personaliza tu experiencia
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="language">Idioma</Label>
                                <Select value={language} onValueChange={setLanguage}>
                                    <SelectTrigger className="bg-secondary border-border">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="es">Español</SelectItem>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="fr">Français</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="theme">Tema</Label>
                                <Select value={theme} onValueChange={setTheme}>
                                    <SelectTrigger className="bg-secondary border-border">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="dark">Oscuro</SelectItem>
                                        <SelectItem value="light">Claro</SelectItem>
                                        <SelectItem value="system">Sistema</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Danger Zone */}
                <Card className="p-6 bg-card border-destructive/50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                            <Trash2 className="w-5 h-5 text-destructive" />
                        </div>
                        <div>
                            <h2 className="text-xl font-serif font-semibold text-foreground">
                                Zona de Peligro
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Acciones irreversibles
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                            <div>
                                <p className="font-medium text-foreground">Eliminar cuenta</p>
                                <p className="text-sm text-muted-foreground">
                                    Esta acción no se puede deshacer
                                </p>
                            </div>
                            <Button variant="destructive" onClick={handleDeleteAccount}>
                                Eliminar Cuenta
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default StudentSettings;
