import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    Clock,
    Plus,
    Video,
    Users,
    Search,
    MoreHorizontal,
    CheckCircle2,
    XCircle,
    BarChart3,
} from "lucide-react";

const AdminClasses = () => {
    const upcomingClasses = [
        {
            id: 1,
            name: "Táctica para Principiantes",
            instructor: "Maider Quintana",
            date: "2026-01-18",
            time: "18:00",
            students: 12,
            maxStudents: 20,
            status: "confirmed",
            type: "Live",
        },
        {
            id: 2,
            name: "Finales de Torre",
            instructor: "Maider Quintana",
            date: "2026-01-20",
            time: "17:00",
            students: 8,
            maxStudents: 15,
            status: "pending",
            type: "Live",
        },
        {
            id: 3,
            name: "Aperturas: Siciliana",
            instructor: "Maider Quintana",
            date: "2026-01-21",
            time: "19:00",
            students: 15,
            maxStudents: 20,
            status: "confirmed",
            type: "Live",
        },
    ];

    const pastClasses = [
        {
            id: 4,
            name: "Introducción al Ajedrez",
            instructor: "Maider Quintana",
            date: "2026-01-10",
            students: 20,
            attended: 18,
            status: "completed",
        },
        {
            id: 5,
            name: "Estrategia Posicional",
            instructor: "Maider Quintana",
            date: "2026-01-05",
            students: 15,
            attended: 14,
            status: "completed",
        },
    ];

    return (
        <DashboardLayout role="admin">
            <div className="p-6 lg:p-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-foreground">
                            Gestión de Clases
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Programa y supervisa las clases en vivo y grabadas
                        </p>
                    </div>
                    <Button variant="hero">
                        <Plus className="w-4 h-4 mr-2" />
                        Programar Clase
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="p-5 bg-card border-border">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-foreground">{upcomingClasses.length}</p>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Programadas</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-5 bg-card border-border">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                <Users className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-foreground">35</p>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Alumnos Inscritos</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-5 bg-card border-border">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Video className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-foreground">42</p>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Horas en Directo</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-5 bg-card border-border">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-foreground">92%</p>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Asistencia Media</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Upcoming Classes */}
                <div className="space-y-4">
                    <h2 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
                        Próximas Sesiones
                    </h2>
                    <div className="grid gap-4">
                        {upcomingClasses.map((clase) => (
                            <Card key={clase.id} className="p-5 bg-card border-border hover:border-primary/30 transition-colors">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-foreground text-lg">{clase.name}</h3>
                                            {clase.status === "confirmed" ? (
                                                <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px] h-5">Confirmada</Badge>
                                            ) : (
                                                <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-[10px] h-5">Pendiente</Badge>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(clase.date).toLocaleDateString("es-ES")}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Clock className="w-4 h-4" />
                                                {clase.time}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Users className="w-4 h-4" />
                                                {clase.students}/{clase.maxStudents} alumnos
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Video className="w-4 h-4" />
                                                {clase.type}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">Editar</Button>
                                        <Button variant="hero" size="sm">Ver Enlace</Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Past Classes */}
                <div className="space-y-4">
                    <h2 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
                        Historial Reciente
                    </h2>
                    <div className="bg-card border border-border rounded-xl overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-secondary/50">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-foreground">Clase</th>
                                    <th className="p-4 text-sm font-semibold text-foreground">Fecha</th>
                                    <th className="p-4 text-sm font-semibold text-foreground">Inscritos</th>
                                    <th className="p-4 text-sm font-semibold text-foreground">Asistencia</th>
                                    <th className="p-4 text-sm font-semibold text-foreground text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {pastClasses.map((clase) => (
                                    <tr key={clase.id} className="hover:bg-secondary/20 transition-colors">
                                        <td className="p-4 text-sm font-medium text-foreground">{clase.name}</td>
                                        <td className="p-4 text-sm text-muted-foreground">{new Date(clase.date).toLocaleDateString("es-ES")}</td>
                                        <td className="p-4 text-sm text-muted-foreground">{clase.students}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-sm text-foreground">
                                                <div className="flex-1 w-16 bg-secondary h-1.5 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary"
                                                        style={{ width: `${(clase.attended / clase.students) * 100}%` }}
                                                    />
                                                </div>
                                                {Math.round((clase.attended / clase.students) * 100)}%
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminClasses;
