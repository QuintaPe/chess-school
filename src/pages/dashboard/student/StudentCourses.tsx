import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    BookOpen,
    Play,
    CheckCircle2,
    Clock,
    Award,
    TrendingUp,
    Loader2,
    CheckCircle
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Course } from "@/types/api";
import { toast } from "sonner";

const StudentCourses = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { data: courses, isLoading, isError } = useQuery<Course[]>({
        queryKey: ["courses"],
        queryFn: () => api.courses.list(),
    });

    const enrollMutation = useMutation({
        mutationFn: (id: number) => api.courses.enroll(id),
        onSuccess: () => {
            toast.success("¡Inscrito en el curso con éxito!");
            queryClient.invalidateQueries({ queryKey: ["courses"] });
        },
        onError: (error: Error) => {
            toast.error(`Error: ${error.message}`);
        }
    });

    const enrolledCourses = courses?.filter(c =>
        c.isEnrolled ||
        (c.progress_percentage !== undefined && c.progress_percentage !== null)
    ) || [];
    const inProgressCourses = enrolledCourses.filter(c => Math.floor(c.progress_percentage || 0) < 100);
    const completedCourses = enrolledCourses.filter(c => Math.floor(c.progress_percentage || 0) >= 100);
    const availableCourses = courses?.filter(c =>
        !c.isEnrolled &&
        (c.progress_percentage === undefined || c.progress_percentage === null)
    ) || [];

    const getLevelColor = (level: string) => {
        switch (level) {
            case "beginner": return "bg-green-500/10 text-green-500 border-green-500/20";
            case "intermediate": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "advanced": return "bg-red-500/10 text-red-500 border-red-500/20";
            default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
        }
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

    if (isError) {
        return (
            <DashboardLayout role="student">
                <div className="p-8 text-center">
                    <h2 className="text-xl font-bold text-destructive">Error al cargar los cursos</h2>
                    <p className="text-muted-foreground mt-2">Por favor, intenta de nuevo más tarde.</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="student">
            <div className="p-6 lg:p-8 space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">
                        Mis Cursos
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Continúa tu aprendizaje con nuestros cursos estructurados
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-5 bg-card border-border">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{inProgressCourses.length}</p>
                                <p className="text-sm text-muted-foreground">Cursos activos</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5 bg-card border-border">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">
                                    {enrolledCourses.reduce((acc, course) => acc + (course.lessons?.filter(l => l.is_completed).length || 0), 0)}
                                </p>
                                <p className="text-sm text-muted-foreground">Lecciones completadas</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5 bg-card border-border">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Clock className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">
                                    {Math.round(enrolledCourses.reduce((acc, course) =>
                                        acc + (course.lessons?.filter(l => l.is_completed).reduce((sum, l) => sum + (l.duration || 0), 0) || 0), 0) / 60)}h
                                </p>
                                <p className="text-sm text-muted-foreground">Tiempo de estudio</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* My Courses Section */}
                {enrolledCourses.length > 0 ? (
                    <div className="space-y-12">
                        {/* In Progress */}
                        {inProgressCourses.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-serif font-bold text-foreground flex items-center gap-2">
                                    <TrendingUp className="w-6 h-6 text-primary" />
                                    Cursos en Progreso
                                </h2>
                                <div className="grid gap-6">
                                    {inProgressCourses.map((course) => (
                                        <Card key={course.id} className="p-6 bg-card border-border hover:border-primary/30 transition-colors">
                                            <div className="flex flex-col lg:flex-row gap-6">
                                                <div className="w-full lg:w-48 h-48 rounded-xl bg-secondary flex items-center justify-center shrink-0 overflow-hidden relative border border-border/50">
                                                    {course.thumbnail_url ? (
                                                        <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <BookOpen className="w-12 h-12 text-primary/20" />
                                                    )}
                                                </div>

                                                <div className="flex-1 space-y-4">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="text-xl font-semibold text-foreground mb-1">
                                                                {course.title}
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground line-clamp-1 italic mb-1">
                                                                {course.category}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground line-clamp-1">
                                                                {course.description}
                                                            </p>
                                                        </div>
                                                        <Badge className={getLevelColor(course.level)}>
                                                            {translateLevel(course.level)}
                                                        </Badge>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-muted-foreground">Progreso</span>
                                                            <span className="font-medium text-foreground">
                                                                {course.lessons?.filter(l => l.is_completed).length || 0} de {course.lessons?.length || 0} lecciones
                                                            </span>
                                                        </div>
                                                        <Progress value={course.progress_percentage || 0} className="h-2" />
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row gap-3">
                                                        <Button
                                                            variant="hero"
                                                            className="flex-1"
                                                            onClick={() => navigate(`/cursos/${course.id}`)}
                                                        >
                                                            <Play className="w-4 h-4 mr-2" />
                                                            Continuar Curso
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            className="flex-1"
                                                            onClick={() => navigate(`/cursos/${course.id}`)}
                                                        >
                                                            Ver Contenido
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Completed */}
                        {completedCourses.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-serif font-bold text-foreground flex items-center gap-2 text-green-500">
                                    <Award className="w-6 h-6" />
                                    Cursos Completados
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {completedCourses.map((course) => (
                                        <Card key={course.id} className="p-5 bg-card/50 border-green-500/20 hover:border-green-500/40 transition-all group overflow-hidden relative">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                                <Award className="w-16 h-16 text-green-500" />
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="w-24 h-24 rounded-lg bg-secondary shrink-0 overflow-hidden border border-border/50">
                                                    {course.thumbnail_url ? (
                                                        <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <BookOpen className="w-8 h-8 text-primary/20" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0 py-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-bold text-foreground truncate">{course.title}</h3>
                                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                                    </div>
                                                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                                                        {course.description}
                                                    </p>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 text-xs hover:bg-green-500/10 hover:text-green-500 border border-transparent hover:border-green-500/20 transition-all"
                                                        onClick={() => navigate(`/cursos/${course.id}`)}
                                                    >
                                                        Repasar Contenido
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-primary/5 rounded-3xl border border-dashed border-primary/20">
                        <BookOpen className="w-12 h-12 text-primary/40 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">No tienes cursos todavía</h3>
                        <p className="text-muted-foreground mb-6">¡Explora nuestro catálogo y empieza a aprender hoy mismo!</p>
                        <Button variant="hero" onClick={() => {
                            const explorer = document.getElementById('explorar-cursos');
                            explorer?.scrollIntoView({ behavior: 'smooth' });
                        }}>
                            Ver Catálogo
                        </Button>
                    </div>
                )}

                {/* Available Courses Section */}
                {availableCourses.length > 0 && (
                    <div id="explorar-cursos" className="pt-8 border-t border-border/50">
                        <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                            Explorar Cursos
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {availableCourses.map((course) => (
                                <Card key={course.id} className="flex flex-col bg-card border-border hover:border-primary/30 transition-all overflow-hidden group">
                                    <div className="aspect-video relative overflow-hidden">
                                        {course.thumbnail_url ? (
                                            <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full bg-secondary flex items-center justify-center">
                                                <BookOpen className="w-12 h-12 text-primary/20" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3">
                                            <Badge className="bg-primary/90 text-primary-foreground border-none">
                                                {course.price === 0 ? "Gratis" : `${course.price}€`}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="mb-4">
                                            <div className="flex items-start justify-between mb-2 gap-2">
                                                <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{course.title}</h3>
                                                <Badge className={getLevelColor(course.level)} variant="outline">
                                                    {translateLevel(course.level)}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2 italic mb-3">
                                                {course.category}
                                            </p>
                                            <p className="text-sm text-foreground line-clamp-3">
                                                {course.description}
                                            </p>
                                        </div>
                                        <div className="mt-auto pt-4 border-t border-border/50">
                                            <Button
                                                variant="hero"
                                                className="w-full"
                                                onClick={() => enrollMutation.mutate(course.id)}
                                                disabled={enrollMutation.isPending}
                                            >
                                                {enrollMutation.isPending ? (
                                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                ) : (
                                                    <BookOpen className="w-4 h-4 mr-2" />
                                                )}
                                                Inscribirse al Curso
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default StudentCourses;
