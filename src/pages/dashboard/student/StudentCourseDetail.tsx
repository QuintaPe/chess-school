import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Play,
    Clock,
    CheckCircle2,
    ArrowLeft,
    Video,
    BookOpen,
    Loader2,
    ChevronRight,
    Award,
    Check,
    Share2
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Course, Lesson } from "@/types/api";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import "@justinribeiro/lite-youtube";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'lite-youtube': any;
        }
    }
}

const StudentCourseDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const courseId = Number(id);

    const [activeLessonId, setActiveLessonId] = useState<number | null>(null);

    const { data: course, isLoading, isError } = useQuery<Course>({
        queryKey: ["course", courseId],
        queryFn: () => api.courses.get(courseId),
    });

    const completeMutation = useMutation({
        mutationFn: (lessonId: number) => api.courses.completeLesson(lessonId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["course", courseId] });
            toast.success("¡Lección completada!");
        },
        onError: (error: any) => {
            toast.error(`Error: ${error.message}`);
        }
    });

    const sortedLessons = useMemo(() => {
        if (!course?.lessons) return [];
        return [...course.lessons].sort((a, b) => a.order_index - b.order_index);
    }, [course?.lessons]);

    const activeLesson = useMemo(() => {
        if (activeLessonId) return sortedLessons.find(l => l.id === activeLessonId);
        return sortedLessons[0];
    }, [activeLessonId, sortedLessons]);

    // Initial setting of active lesson
    if (!activeLessonId && sortedLessons.length > 0) {
        setActiveLessonId(sortedLessons[0].id);
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError || !course) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold text-destructive">Error al cargar el curso</h1>
                    <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard/cursos")}>
                        Volver a mis cursos
                    </Button>
                </div>
            </div>
        );
    }


    const progressValue = course.progress_percentage || 0;

    const isYouTube = (url: string) => url && (url.includes("youtube.com") || url.includes("youtu.be"));

    const getYouTubeId = (url: string) => {
        if (!url) return "";
        const id = url.includes("v=") ? url.split("v=")[1].split("&")[0] : url.split("/").pop();
        return id || "";
    };

    // Support for YouTube and Vimeo embeds
    const getEmbedUrl = (url: string) => {
        if (!url) return "";
        if (isYouTube(url)) {
            return `https://www.youtube.com/embed/${getYouTubeId(url)}?autoplay=0&rel=0`;
        }
        if (url.includes("vimeo.com")) {
            const id = url.split("/").pop();
            return `https://player.vimeo.com/video/${id}`;
        }
        return url;
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <div className="h-[100dvh] flex flex-col overflow-hidden bg-background">
                {/* Top bar */}
                <div className="bg-card border-b border-border p-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate("/dashboard/cursos")}
                            className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-bold text-foreground leading-none">{course.title}</h1>
                                <Badge variant="secondary" className="px-1.5 h-5 text-[10px] bg-primary/10 text-primary border-primary/20">
                                    CURSO
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {activeLesson?.title || "Selecciona una lección"} • {sortedLessons.length} lecciones
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="hidden md:flex items-center gap-3 mr-4 px-4 py-2 bg-primary/5 rounded-full border border-primary/20">
                            <div className="flex flex-col gap-1 min-w-[120px]">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Progreso</span>
                                    <span className="text-xs font-bold text-primary">{progressValue}%</span>
                                </div>
                                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-1000 rounded-full"
                                        style={{ width: `${progressValue}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Share2 className="w-4 h-4" />
                            Compartir
                        </Button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                    {/* Left Sidebar: Lesson Navigation */}
                    <div className="w-full lg:w-80 2xl:w-96 bg-card/80 flex flex-col overflow-hidden border-r border-border">
                        <div className="p-4 border-b border-border bg-secondary/20">
                            <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Contenido del curso</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                {sortedLessons.length} lecciones • {sortedLessons.reduce((acc, curr) => acc + (curr.duration || 0), 0)} min total
                            </p>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                            {sortedLessons.map((lesson, index) => (
                                <button
                                    key={lesson.id}
                                    onClick={() => setActiveLessonId(lesson.id)}
                                    className={cn(
                                        "w-full flex items-start gap-3 p-3 rounded-lg transition-all text-left group",
                                        activeLessonId === lesson.id
                                            ? "bg-primary/10 text-primary border border-primary/20"
                                            : "hover:bg-secondary text-foreground border border-transparent"
                                    )}
                                >
                                    <div className={cn(
                                        "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold transition-colors",
                                        activeLessonId === lesson.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground group-hover:bg-primary/20"
                                    )}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-xs line-clamp-2 leading-tight">{lesson.title}</h4>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                                                <Clock className="w-3 h-3" />
                                                {lesson.duration} min
                                            </span>
                                        </div>
                                    </div>
                                    {activeLessonId === lesson.id ? (
                                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                            <Play className="w-3 h-3 fill-primary text-primary" />
                                        </div>
                                    ) : lesson.is_completed ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                    ) : (
                                        <CheckCircle2 className="w-5 h-5 text-muted-foreground/30 shrink-0" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Center - Video and Content Area */}
                    <div className="flex-1 bg-background relative flex flex-col items-center justify-start p-4 lg:p-8 overflow-y-auto custom-scrollbar">
                        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
                            {/* Video Player Section */}
                            <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative border border-white/5 group">
                                {activeLesson ? (
                                    isYouTube(activeLesson.video_url) ? (
                                        <lite-youtube
                                            videoid={getYouTubeId(activeLesson.video_url)}
                                            playlabel={activeLesson.title}
                                            className="w-full h-full max-w-full"
                                        />
                                    ) : (
                                        <iframe
                                            src={getEmbedUrl(activeLesson.video_url)}
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    )
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-3">
                                        <Video className="w-12 h-12 opacity-20" />
                                        <p className="text-sm">Selecciona una lección para comenzar</p>
                                    </div>
                                )}
                            </div>

                            {/* Lesson Info Card */}
                            <Card className="p-6 bg-card border-border">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                                    Lección {sortedLessons.findIndex(l => l.id === activeLesson?.id) + 1} de {sortedLessons.length}
                                                </Badge>
                                                <Badge variant="outline" className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {activeLesson?.duration} min
                                                </Badge>
                                            </div>
                                            <h2 className="text-xl font-bold">{activeLesson?.title}</h2>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {activeLesson?.description || "En esta lección profundizaremos en los conceptos clave de este módulo para mejorar tu comprensión del juego."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-border">
                                        {activeLesson?.is_completed ? (
                                            <div className="flex items-center gap-2 text-green-500 font-bold bg-green-500/10 w-fit px-4 py-2 rounded-xl border border-green-500/20">
                                                <CheckCircle2 className="w-5 h-5" />
                                                Lección Completada
                                            </div>
                                        ) : (
                                            <Button
                                                variant="hero"
                                                className="rounded-xl px-8"
                                                onClick={() => activeLesson && completeMutation.mutate(activeLesson.id)}
                                                disabled={completeMutation.isPending}
                                            >
                                                {completeMutation.isPending ? (
                                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                ) : (
                                                    <Check className="w-4 h-4 mr-2" />
                                                )}
                                                Marcar como Completada
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>

                            {/* Additional Resources */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <Card className="p-4 bg-card border-border hover:border-primary/20 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                                            <BookOpen className="w-5 h-5 text-orange-500" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-sm text-foreground">Material de Estudio</h3>
                                            <p className="text-xs text-muted-foreground">Descarga archivos PDF y PGN</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Card>
                                <Card className="p-4 bg-card border-border hover:border-primary/20 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                                            <Award className="w-5 h-5 text-green-500" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-sm text-foreground">Poner a Prueba</h3>
                                            <p className="text-xs text-muted-foreground">Resuelve problemas del módulo</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentCourseDetail;
