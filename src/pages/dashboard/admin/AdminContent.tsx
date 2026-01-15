import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    BookOpen,
    Plus,
    Search,
    MoreVertical,
    Layers,
    FileText,
    Video,
    Eye,
    Settings,
    Archive,
} from "lucide-react";

const AdminContent = () => {
    const courses = [
        {
            id: 1,
            title: "Fundamentos del Ajedrez",
            category: "Básico",
            lessons: 20,
            students: 85,
            lastUpdated: "hace 2 días",
            status: "published",
            type: "Course",
            progress: 100,
        },
        {
            id: 2,
            title: "Táctica Intermedia",
            category: "Táctica",
            lessons: 15,
            students: 42,
            lastUpdated: "hace 5 días",
            status: "published",
            type: "Course",
            progress: 65,
        },
        {
            id: 3,
            title: "Finales Avanzados",
            category: "Estrategia",
            lessons: 12,
            students: 0,
            lastUpdated: "Hoy",
            status: "draft",
            type: "Course",
            progress: 30,
        },
    ];

    const materials = [
        { id: 1, name: "Guía de Aperturas.pdf", type: "PDF", size: "2.4 MB" },
        { id: 2, name: "Plan de Entrenamiento.docx", type: "Doc", size: "1.1 MB" },
    ];

    return (
        <DashboardLayout role="admin">
            <div className="p-6 lg:p-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-foreground">
                            Gestión de Contenido
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Organiza cursos, lecciones y materiales de estudio
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Material
                        </Button>
                        <Button variant="hero">
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Curso
                        </Button>
                    </div>
                </div>

                {/* Content Inventory */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-serif font-bold text-foreground">Cursos</h2>
                            <div className="flex items-center gap-2">
                                <Search className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">8 cursos en total</span>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {courses.map((course) => (
                                <Card key={course.id} className="p-5 bg-card border-border hover:border-primary/40 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                                            <BookOpen className="w-6 h-6 text-primary" />
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-foreground">{course.title}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="outline" className="text-[10px] h-4 uppercase tracking-wider">{course.category}</Badge>
                                                        <span className="text-xs text-muted-foreground">• Actualizado {course.lastUpdated}</span>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            <div className="space-y-1.5">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-muted-foreground">Estado de desarrollo</span>
                                                    <span className="text-foreground font-medium">{course.progress}%</span>
                                                </div>
                                                <Progress value={course.progress} className="h-1.5" />
                                            </div>

                                            <div className="flex items-center justify-between pt-2">
                                                <div className="flex gap-4">
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <Layers className="w-3.5 h-3.5" />
                                                        {course.lessons} lecciones
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <Eye className="w-3.5 h-3.5" />
                                                        {course.students} alumnos
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="sm" className="h-8 text-xs underline">Gestionar</Button>
                                                    <Button variant="hero" size="sm" className="h-8 text-xs">Ver Contenido</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-8">
                        {/* Quick Actions */}
                        <Card className="p-6 bg-card border-border">
                            <h2 className="text-lg font-serif font-bold text-foreground mb-4">Herramientas</h2>
                            <div className="space-y-2">
                                <Button variant="outline" className="w-full justify-start h-10">
                                    <Archive className="w-4 h-4 mr-3 text-muted-foreground" />
                                    Archivo de Contenido
                                </Button>
                                <Button variant="outline" className="w-full justify-start h-10">
                                    <Settings className="w-4 h-4 mr-3 text-muted-foreground" />
                                    Configurar Categorías
                                </Button>
                                <Button variant="outline" className="w-full justify-start h-10">
                                    <FileText className="w-4 h-4 mr-3 text-muted-foreground" />
                                    Exportar Reportes
                                </Button>
                            </div>
                        </Card>

                        {/* Recent Uploads */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-serif font-bold text-foreground">Materiales Recientes</h2>
                            <div className="space-y-3">
                                {materials.map((file) => (
                                    <Card key={file.id} className="p-3 bg-secondary/30 border-border hover:bg-secondary/50 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-[10px] font-bold text-primary border border-border">
                                                {file.type}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                                                <p className="text-[10px] text-muted-foreground">{file.size}</p>
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                                <Button variant="ghost" className="w-full text-xs text-primary h-8 hover:bg-transparent hover:underline">
                                    Ver todos los materiales
                                </Button>
                            </div>
                        </div>

                        {/* Content Stats */}
                        <Card className="p-6 bg-primary/5 border-primary/20">
                            <h2 className="text-lg font-serif font-bold text-foreground mb-4">Métricas Globales</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Video className="w-4 h-4" />
                                        Video Tutoriales
                                    </span>
                                    <span className="text-sm font-bold">124</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        PDFs / Guías
                                    </span>
                                    <span className="text-sm font-bold">48</span>
                                </div>
                                <div className="pt-2 border-t border-primary/10">
                                    <p className="text-[11px] text-muted-foreground italic text-center">
                                        Capacidad de almacenamiento: 78% utilizada
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminContent;
