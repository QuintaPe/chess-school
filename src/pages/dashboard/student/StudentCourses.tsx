import { DashboardLayout } from "@/components/layout/DashboardLayout";
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
    Lock,
    TrendingUp
} from "lucide-react";

const StudentCourses = () => {
    const enrolledCourses = [
        {
            id: 1,
            title: "Fundamentos del Ajedrez",
            description: "Aprende los conceptos básicos del ajedrez desde cero",
            instructor: "Maider Quintana",
            progress: 75,
            totalLessons: 20,
            completedLessons: 15,
            duration: "8 horas",
            level: "Principiante",
            thumbnail: "📚",
            nextLesson: "Lección 16: Finales de Peones"
        },
        {
            id: 2,
            title: "Táctica Intermedia",
            description: "Mejora tu visión táctica con patrones avanzados",
            instructor: "Maider Quintana",
            progress: 40,
            totalLessons: 15,
            completedLessons: 6,
            duration: "6 horas",
            level: "Intermedio",
            thumbnail: "🎯",
            nextLesson: "Lección 7: Clavadas y Enfiladas"
        },
    ];

    const availableCourses = [
        {
            id: 3,
            title: "Aperturas Clásicas",
            description: "Domina las aperturas más importantes del ajedrez",
            instructor: "Maider Quintana",
            totalLessons: 25,
            duration: "10 horas",
            level: "Intermedio",
            thumbnail: "♟️",
            price: "Premium",
            rating: 4.8,
            students: 234
        },
        {
            id: 4,
            title: "Estrategia Avanzada",
            description: "Desarrolla tu comprensión posicional del juego",
            instructor: "Maider Quintana",
            totalLessons: 18,
            duration: "9 horas",
            level: "Avanzado",
            thumbnail: "♔",
            price: "Premium",
            rating: 4.9,
            students: 156
        },
    ];

    const getLevelColor = (level: string) => {
        switch (level) {
            case "Principiante":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            case "Intermedio":
                return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "Avanzado":
                return "bg-red-500/10 text-red-500 border-red-500/20";
            default:
                return "bg-gray-500/10 text-gray-500 border-gray-500/20";
        }
    };

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
                                <p className="text-2xl font-bold text-foreground">{enrolledCourses.length}</p>
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
                                <p className="text-2xl font-bold text-foreground">21</p>
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
                                <p className="text-2xl font-bold text-foreground">14h</p>
                                <p className="text-sm text-muted-foreground">Tiempo de estudio</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Enrolled Courses */}
                <div>
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                        Cursos en Progreso
                    </h2>
                    <div className="grid gap-6">
                        {enrolledCourses.map((course) => (
                            <Card key={course.id} className="p-6 bg-card border-border hover:border-primary/30 transition-colors">
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Thumbnail */}
                                    <div className="w-full lg:w-48 h-48 rounded-xl bg-gradient-to-br from-card to-secondary flex items-center justify-center text-7xl shrink-0">
                                        {course.thumbnail}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className="text-xl font-semibold text-foreground mb-1">
                                                        {course.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {course.description}
                                                    </p>
                                                </div>
                                                <Badge className={getLevelColor(course.level)}>
                                                    {course.level}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                                                <BookOpen className="w-4 h-4" />
                                                {course.instructor}
                                            </p>
                                        </div>

                                        {/* Progress */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Progreso</span>
                                                <span className="font-medium text-foreground">
                                                    {course.completedLessons}/{course.totalLessons} lecciones
                                                </span>
                                            </div>
                                            <Progress value={course.progress} className="h-2" />
                                            <p className="text-sm text-primary font-medium">
                                                {course.progress}% completado
                                            </p>
                                        </div>

                                        {/* Next Lesson */}
                                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                                            <p className="text-sm text-muted-foreground mb-1">Siguiente lección:</p>
                                            <p className="font-medium text-foreground">{course.nextLesson}</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <Button variant="hero" className="flex-1">
                                                <Play className="w-4 h-4 mr-2" />
                                                Continuar Curso
                                            </Button>
                                            <Button variant="outline" className="flex-1">
                                                Ver Contenido
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Available Courses */}
                <div>
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                        Cursos Disponibles
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {availableCourses.map((course) => (
                            <Card key={course.id} className="p-6 bg-card border-border hover:border-primary/30 transition-colors">
                                <div className="space-y-4">
                                    {/* Thumbnail */}
                                    <div className="w-full h-48 rounded-xl bg-gradient-to-br from-card to-secondary flex items-center justify-center text-7xl relative overflow-hidden">
                                        {course.thumbnail}
                                        <div className="absolute top-3 right-3">
                                            <Badge className="bg-primary/90 text-primary-foreground">
                                                <Lock className="w-3 h-3 mr-1" />
                                                {course.price}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="text-xl font-semibold text-foreground">
                                                {course.title}
                                            </h3>
                                            <Badge className={getLevelColor(course.level)}>
                                                {course.level}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            {course.description}
                                        </p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                                            <BookOpen className="w-4 h-4" />
                                            {course.instructor}
                                        </p>
                                    </div>

                                    {/* Info */}
                                    <div className="grid grid-cols-3 gap-3 py-3 border-t border-border">
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-foreground">{course.totalLessons}</p>
                                            <p className="text-xs text-muted-foreground">Lecciones</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-foreground">{course.duration}</p>
                                            <p className="text-xs text-muted-foreground">Duración</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-foreground flex items-center justify-center gap-1">
                                                <Award className="w-3 h-3 text-primary" />
                                                {course.rating}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{course.students} estudiantes</p>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <Button variant="hero" className="w-full">
                                        Inscribirse al Curso
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentCourses;
