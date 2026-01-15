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
    CheckCircle2,
    XCircle,
    AlertCircle
} from "lucide-react";
import { useState } from "react";

const StudentClasses = () => {
    const [activeTab, setActiveTab] = useState<"upcoming" | "completed">("upcoming");

    const upcomingClasses = [
        {
            id: 1,
            title: "Finales de Torre",
            teacher: "Maider Quintana",
            date: "2026-01-18",
            time: "18:00",
            duration: "60 min",
            level: "Intermedio",
            type: "live",
            enrolled: 12,
            maxStudents: 20,
            status: "confirmed"
        },
        {
            id: 2,
            title: "Táctica Avanzada",
            teacher: "Maider Quintana",
            date: "2026-01-20",
            time: "17:00",
            duration: "90 min",
            level: "Avanzado",
            type: "live",
            enrolled: 8,
            maxStudents: 15,
            status: "confirmed"
        },
        {
            id: 3,
            title: "Aperturas Clásicas",
            teacher: "Maider Quintana",
            date: "2026-01-22",
            time: "18:00",
            duration: "60 min",
            level: "Intermedio",
            type: "live",
            enrolled: 15,
            maxStudents: 20,
            status: "pending"
        },
    ];

    const completedClasses = [
        {
            id: 4,
            title: "Introducción a las Aperturas",
            teacher: "Maider Quintana",
            date: "2026-01-10",
            duration: "60 min",
            level: "Principiante",
            type: "recorded",
            rating: 5,
            attended: true
        },
        {
            id: 5,
            title: "Táctica Básica",
            teacher: "Maider Quintana",
            date: "2026-01-08",
            duration: "45 min",
            level: "Principiante",
            type: "live",
            rating: 4,
            attended: true
        },
        {
            id: 6,
            title: "Finales Básicos",
            teacher: "Maider Quintana",
            date: "2026-01-05",
            duration: "60 min",
            level: "Intermedio",
            type: "live",
            rating: 5,
            attended: false
        },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "confirmed":
                return <Badge className="bg-green-500/10 text-green-500 border-green-500/20"><CheckCircle2 className="w-3 h-3 mr-1" />Confirmada</Badge>;
            case "pending":
                return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20"><AlertCircle className="w-3 h-3 mr-1" />Pendiente</Badge>;
            default:
                return null;
        }
    };

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
                                <p className="text-2xl font-bold text-foreground">12h</p>
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
                                                    {clase.teacher}
                                                </p>
                                            </div>
                                            {getStatusBadge(clase.status)}
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-foreground">{new Date(clase.date).toLocaleDateString('es-ES')}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-foreground">{clase.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Video className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-foreground">{clase.duration}</span>
                                            </div>
                                            <div>
                                                <Badge variant="outline" className="text-xs">
                                                    {clase.level}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Users className="w-4 h-4" />
                                            <span>{clase.enrolled}/{clase.maxStudents} estudiantes inscritos</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Button variant="hero" className="w-full lg:w-auto">
                                            <Play className="w-4 h-4 mr-2" />
                                            Unirse a la Clase
                                        </Button>
                                        <Button variant="outline" className="w-full lg:w-auto">
                                            Ver Detalles
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
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
                                                    {clase.teacher}
                                                </p>
                                            </div>
                                            {clase.attended ? (
                                                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                    Asistida
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                                                    <XCircle className="w-3 h-3 mr-1" />
                                                    No asistida
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-foreground">{new Date(clase.date).toLocaleDateString('es-ES')}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-foreground">{clase.duration}</span>
                                            </div>
                                            <div>
                                                <Badge variant="outline" className="text-xs">
                                                    {clase.level}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`w-4 h-4 ${i < clase.rating ? 'text-primary fill-primary' : 'text-muted-foreground'}`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {clase.type === "recorded" && (
                                            <Button variant="hero" className="w-full lg:w-auto">
                                                <Play className="w-4 h-4 mr-2" />
                                                Ver Grabación
                                            </Button>
                                        )}
                                        <Button variant="outline" className="w-full lg:w-auto">
                                            Ver Materiales
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default StudentClasses;
