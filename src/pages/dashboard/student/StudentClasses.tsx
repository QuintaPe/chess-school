import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    Clock,
    Video,
    Users,
    BookOpen,
    Play,
    MessageSquare,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Loader2
} from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const StudentClasses = () => {
    const [activeTab, setActiveTab] = useState<"upcoming" | "completed">("upcoming");
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: classes, isLoading, isError } = useQuery<any[]>({
        queryKey: ["classes"],
        queryFn: () => api.classes.list(),
    });

    const registerMutation = useMutation({
        mutationFn: (id: string | number) => api.classes.register(id),
        onSuccess: () => {
            toast.success("¡Inscrito con éxito!");
            queryClient.invalidateQueries({ queryKey: ["classes"] });
        },
        onError: (error: Error) => {
            toast.error(`Error: ${error.message}`);
        }
    });

    const { user } = useAuth();
    const upcomingClasses = classes?.filter(c => new Date(c.start_time) > new Date()) || [];
    const completedClasses = classes?.filter(c => new Date(c.start_time) <= new Date()) || [];

    const hasAccess = (clase: any) => {
        if (user?.role === 'admin' || user?.role === 'teacher') return true;
        return !!(clase.can_access || clase.is_registered || clase.registered || clase.isRegistered || clase.enrolled);
    };

    const translateLevel = (level: string) => {
        switch (level) {
            case "beginner": return "Principiante";
            case "intermediate": return "Intermedio";
            case "advanced": return "Avanzado";
            default: return level;
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout role="student">
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="student">
            <div className="p-6 lg:p-8 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">
                        Mis Clases
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Gestiona tus clases inscritas y revisa el historial
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-5 bg-card border-border">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{upcomingClasses.length}</p>
                                <p className="text-sm text-muted-foreground">Próximas clases</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5 bg-card border-border">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{completedClasses.length}</p>
                                <p className="text-sm text-muted-foreground">Clases completadas</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5 bg-card border-border">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Clock className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">--</p>
                                <p className="text-sm text-muted-foreground">Horas totales</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-border">
                    <button
                        onClick={() => setActiveTab("upcoming")}
                        className={`px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === "upcoming"
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Próximas Clases
                    </button>
                    <button
                        onClick={() => setActiveTab("completed")}
                        className={`px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === "completed"
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Historial
                    </button>
                </div>

                {/* Upcoming Classes */}
                {activeTab === "upcoming" && (
                    <div className="space-y-4">
                        {upcomingClasses.map((clase) => (
                            <Card key={clase.id} className="p-6 bg-card border-border hover:border-primary/30 transition-colors">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-xl font-semibold text-foreground mb-1">
                                                    {clase.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                    <Users className="w-4 h-4" />
                                                    Profesor: {clase.teacher_name || 'Profesor asignado'}
                                                </p>
                                            </div>
                                            {hasAccess(clase) ? (
                                                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />Inscrito
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-muted-foreground border-border">
                                                    Disponible
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-foreground">{new Date(clase.start_time).toLocaleDateString('es-ES')}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-foreground">
                                                    {new Date(clase.start_time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Video className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-foreground">60 min</span>
                                            </div>
                                            <div>
                                                <Badge variant="outline" className="text-xs uppercase">
                                                    {translateLevel(clase.level)}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Video className="w-4 h-4" />
                                            <span>Clase en Vivo</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {hasAccess(clase) ? (
                                            <Button
                                                variant="hero"
                                                className="w-full lg:w-auto"
                                                onClick={() => {
                                                    const startTime = new Date(clase.start_time).getTime();
                                                    const now = new Date().getTime();
                                                    const diff = startTime - now;
                                                    const platform = (clase.platform || 'zoom').toLowerCase();

                                                    // Allow joining Discord channels anytime if registered, others 30 mins before
                                                    if (platform === 'discord' || diff <= 30 * 60 * 1000) {
                                                        navigate(`/clases/${clase.id}/live`);
                                                    } else {
                                                        toast.info("La clase comenzará pronto. Podrás acceder 30 minutos antes de la hora programada.");
                                                    }
                                                }}
                                            >
                                                {clase.platform === 'discord' ? (
                                                    <MessageSquare className="w-4 h-4 mr-2" />
                                                ) : (
                                                    <Play className="w-4 h-4 mr-2" />
                                                )}
                                                {clase.platform === 'discord' ? 'Unirse a Discord' : 'Unirse a Clase'}
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="hero"
                                                className="w-full lg:w-auto"
                                                onClick={() => registerMutation.mutate(clase.id)}
                                                disabled={registerMutation.isPending}
                                            >
                                                {registerMutation.isPending ? (
                                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                ) : (
                                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                                )}
                                                Inscribirse
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                        {upcomingClasses.length === 0 && (
                            <p className="text-center py-12 text-muted-foreground italic">No hay clases próximas disponibles.</p>
                        )}
                    </div>
                )}

                {/* Completed Classes */}
                {activeTab === "completed" && (
                    <div className="space-y-4">
                        {completedClasses.map((clase) => (
                            <Card key={clase.id} className="p-6 bg-card border-border">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-xl font-semibold text-foreground mb-1">
                                                    {clase.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                    <Users className="w-4 h-4" />
                                                    Profesor: {clase.teacher_id === 1 ? 'Maider Quintana' : 'Admin'}
                                                </p>
                                            </div>
                                            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                Completada
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-foreground">{new Date(clase.start_time).toLocaleDateString('es-ES')}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-foreground">60 min</span>
                                            </div>
                                            <div>
                                                <Badge variant="outline" className="text-xs uppercase">
                                                    {translateLevel(clase.level)}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Button variant="outline" className="w-full lg:w-auto">
                                            Ver Grabación
                                        </Button>
                                        <Button variant="outline" className="w-full lg:w-auto">
                                            Materiales
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                        {completedClasses.length === 0 && (
                            <p className="text-center py-12 text-muted-foreground italic">No hay historial de clases.</p>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default StudentClasses;
