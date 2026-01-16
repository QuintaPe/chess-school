import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    Video,
    Clock,
    MoreVertical,
    Loader2,
    Save,
    Trash2,
    MoveUp,
    MoveDown,
    ArrowLeft,
    Edit
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Course, Lesson } from "@/types/api";
import { toast } from "sonner";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const AdminCourseDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const courseId = Number(id);

    const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
    const [isEditLessonOpen, setIsEditLessonOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

    const [newLesson, setNewLesson] = useState({
        title: "",
        description: "",
        video_url: "",
        duration: 0,
        is_free_preview: false,
        order_index: 0
    });

    const { data: course, isLoading, isError } = useQuery<Course>({
        queryKey: ["admin-course", courseId],
        queryFn: () => api.courses.get(courseId),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: any }) => api.courses.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-course", courseId] });
            toast.success("Curso actualizado");
        },
        onError: (error: any) => {
            toast.error(`Error al actualizar el curso: ${error.message}`);
        }
    });

    const addLessonMutation = useMutation({
        mutationFn: (data: any) => api.courses.addLesson(courseId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-course", courseId] });
            toast.success("Lección añadida con éxito");
            setIsAddLessonOpen(false);
            setNewLesson({
                title: "",
                description: "",
                video_url: "",
                duration: 0,
                is_free_preview: false,
                order_index: (course?.lessons?.length || 0) + 1
            });
        },
        onError: (error: any) => {
            toast.error(`Error al añadir lección: ${error.message}`);
        }
    });

    const updateLessonMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: any }) => api.courses.updateLesson(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-course", courseId] });
            toast.success("Lección actualizada");
            setIsEditLessonOpen(false);
            setEditingLesson(null);
        },
        onError: (error: any) => {
            toast.error(`Error al actualizar lección: ${error.message}`);
        }
    });

    const deleteLessonMutation = useMutation({
        mutationFn: (lessonId: number) => api.courses.deleteLesson(lessonId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-course", courseId] });
            toast.success("Lección eliminada");
        },
        onError: (error: any) => {
            toast.error(`Error al eliminar lección: ${error.message}`);
        }
    });

    const deleteCourseMutation = useMutation({
        mutationFn: (id: number) => api.courses.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
            toast.success("Curso eliminado");
            navigate("/admin/contenido");
        },
        onError: (error: any) => {
            toast.error(`Error al eliminar el curso: ${error.message}`);
        }
    });

    const handleAddLesson = (e: React.FormEvent) => {
        e.preventDefault();
        addLessonMutation.mutate({
            ...newLesson,
            order_index: (course?.lessons?.length || 0) + 1
        });
    };

    const handleEditLesson = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingLesson) {
            const data = {
                title: editingLesson.title,
                description: editingLesson.description,
                video_url: editingLesson.video_url,
                duration: editingLesson.duration,
                is_free_preview: editingLesson.is_free_preview,
                order_index: editingLesson.order_index
            };
            updateLessonMutation.mutate({ id: editingLesson.id, data });
        }
    };

    const handleMoveLesson = async (index: number, direction: 'up' | 'down') => {
        if (!course?.lessons) return;

        const sortedLessons = [...course.lessons].sort((a, b) => a.order_index - b.order_index);
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= sortedLessons.length) return;

        const currentLesson = sortedLessons[index];
        const targetLesson = sortedLessons[targetIndex];

        // Swap order_index
        const currentOrder = currentLesson.order_index;
        const targetOrder = targetLesson.order_index;

        try {
            await Promise.all([
                updateLessonMutation.mutateAsync({
                    id: currentLesson.id,
                    data: { order_index: targetOrder }
                }),
                updateLessonMutation.mutateAsync({
                    id: targetLesson.id,
                    data: { order_index: currentOrder }
                })
            ]);
            queryClient.invalidateQueries({ queryKey: ["admin-course", courseId] });
            toast.success("Orden actualizado");
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout role="admin">
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    if (isError || !course) {
        return (
            <DashboardLayout role="admin">
                <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold text-destructive">Error al cargar el curso</h1>
                    <Button variant="outline" className="mt-4" onClick={() => navigate("/admin/contenido")}>
                        Volver a la lista
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="admin">
            <div className="p-6 lg:p-8 space-y-8">
                {/* Breadcrumbs / Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/admin/contenido")}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-serif font-bold text-foreground">
                                {course.title}
                            </h1>
                            <Badge variant="outline">{course.level}</Badge>
                        </div>
                        <p className="text-muted-foreground mt-1">Gestiona las lecciones y el contenido del curso</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Lessons List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-serif font-bold text-foreground">Lecciones</h2>
                            <Dialog open={isAddLessonOpen} onOpenChange={setIsAddLessonOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="hero" size="sm">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Añadir Lección
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px] bg-card border-border">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-serif">Nueva Lección</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleAddLesson} className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="l-title">Título de la lección</Label>
                                            <Input
                                                id="l-title"
                                                value={newLesson.title}
                                                onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                                                placeholder="Ej: Movimiento del Peón"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="l-video">URL del Video (Youtube/Vimeo)</Label>
                                            <Input
                                                id="l-video"
                                                value={newLesson.video_url}
                                                onChange={(e) => setNewLesson({ ...newLesson, video_url: e.target.value })}
                                                placeholder="https://..."
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="l-duration">Duración (minutos)</Label>
                                                <Input
                                                    id="l-duration"
                                                    type="number"
                                                    value={newLesson.duration}
                                                    onChange={(e) => setNewLesson({ ...newLesson, duration: Number(e.target.value) })}
                                                    min="0"
                                                />
                                            </div>
                                            <div className="flex items-center space-x-2 pt-8">
                                                <input
                                                    type="checkbox"
                                                    id="l-preview"
                                                    checked={newLesson.is_free_preview}
                                                    onChange={(e) => setNewLesson({ ...newLesson, is_free_preview: e.target.checked })}
                                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                />
                                                <Label htmlFor="l-preview" className="text-sm font-medium">Contenido gratuito (Vista previa)</Label>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="ghost" onClick={() => setIsAddLessonOpen(false)}>
                                                Cancelar
                                            </Button>
                                            <Button type="submit" variant="hero" disabled={addLessonMutation.isPending}>
                                                {addLessonMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar Lección"}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* Edit Lesson Dialog */}
                        <Dialog open={isEditLessonOpen} onOpenChange={setIsEditLessonOpen}>
                            <DialogContent className="sm:max-w-[500px] bg-card border-border">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-serif">Editar Lección</DialogTitle>
                                </DialogHeader>
                                {editingLesson && (
                                    <form onSubmit={handleEditLesson} className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-l-title">Título de la lección</Label>
                                            <Input
                                                id="edit-l-title"
                                                value={editingLesson.title}
                                                onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-l-video">URL del Video</Label>
                                            <Input
                                                id="edit-l-video"
                                                value={editingLesson.video_url}
                                                onChange={(e) => setEditingLesson({ ...editingLesson, video_url: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="edit-l-duration">Duración (minutos)</Label>
                                                <Input
                                                    id="edit-l-duration"
                                                    type="number"
                                                    value={editingLesson.duration}
                                                    onChange={(e) => setEditingLesson({ ...editingLesson, duration: Number(e.target.value) })}
                                                    min="0"
                                                />
                                            </div>
                                            <div className="flex items-center space-x-2 pt-8">
                                                <input
                                                    type="checkbox"
                                                    id="edit-l-preview"
                                                    checked={editingLesson.is_free_preview}
                                                    onChange={(e) => setEditingLesson({ ...editingLesson, is_free_preview: e.target.checked })}
                                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                />
                                                <Label htmlFor="edit-l-preview" className="text-sm font-medium">Contenido gratuito</Label>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="ghost" onClick={() => setIsEditLessonOpen(false)}>
                                                Cancelar
                                            </Button>
                                            <Button type="submit" variant="hero" disabled={updateLessonMutation.isPending}>
                                                {updateLessonMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Actualizar Lección"}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                )}
                            </DialogContent>
                        </Dialog>

                        <div className="space-y-3">
                            {course.lessons && course.lessons.length > 0 ? (
                                course.lessons.sort((a, b) => a.order_index - b.order_index).map((lesson, index) => (
                                    <Card key={lesson.id} className="p-4 bg-card border-border hover:border-primary/20 transition-colors group">
                                        <div className="flex items-start gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 font-bold text-xs text-muted-foreground">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-medium text-foreground">{lesson.title}</h3>
                                                    <div className="flex items-center gap-1">
                                                        {lesson.is_free_preview && (
                                                            <Badge variant="outline" className="text-[10px] h-4 bg-green-500/10 text-green-500 border-green-500/20">Gratuita</Badge>
                                                        )}
                                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0"
                                                                onClick={() => {
                                                                    setEditingLesson(lesson);
                                                                    setIsEditLessonOpen(true);
                                                                }}
                                                            >
                                                                <Edit className="w-4 h-4 text-muted-foreground" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                                                onClick={() => {
                                                                    if (window.confirm("¿Borrar lección?")) {
                                                                        deleteLessonMutation.mutate(lesson.id);
                                                                    }
                                                                }}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Video className="w-3 h-3" />
                                                        Video
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {lesson.duration} min
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 hover:bg-secondary"
                                                    disabled={index === 0 || updateLessonMutation.isPending}
                                                    onClick={() => handleMoveLesson(index, 'up')}
                                                >
                                                    <MoveUp className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 hover:bg-secondary"
                                                    disabled={index === (course.lessons?.length || 0) - 1 || updateLessonMutation.isPending}
                                                    onClick={() => handleMoveLesson(index, 'down')}
                                                >
                                                    <MoveDown className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                                    <Video className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                                    <p className="text-muted-foreground italic">No hay lecciones añadidas todavía.</p>
                                    <Button variant="ghost" className="mt-2 text-primary text-sm" onClick={() => setIsAddLessonOpen(true)}>
                                        Añade tu primera lección
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Course Summary/Stats Sidebar */}
                    <div className="space-y-6">
                        <Card className="p-6 bg-card border-border">
                            <h3 className="text-lg font-serif font-bold mb-4">Detalles del Curso</h3>
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Descripción</Label>
                                    <p className="text-sm mt-1">{course.description}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                                    <div>
                                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Precio</Label>
                                        <p className="text-sm font-bold">{course.price === 0 ? "Gratis" : `${course.price}€`}</p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Estado</Label>
                                        <p className="text-sm">
                                            {course.is_published ? (
                                                <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px] h-5">Publicado</Badge>
                                            ) : (
                                                <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-[10px] h-5">Borrador</Badge>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <Button className="w-full mt-4" variant="outline" onClick={() => navigate("/admin/contenido")}>
                                    Editar Información General
                                </Button>
                            </div>
                        </Card>

                        <Card className="p-6 bg-primary/5 border-primary/20">
                            <h3 className="text-lg font-serif font-bold mb-4 text-foreground">Visibilidad</h3>
                            <p className="text-xs text-muted-foreground mb-4">Controla quién puede ver y acceder a este curso en la tienda.</p>
                            <div className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                                <span className="text-sm font-medium">Curso Público</span>
                                <input type="checkbox" checked={course.is_published} readOnly className="w-4 h-4" />
                            </div>
                        </Card>

                        <Button
                            variant="hero"
                            className="w-full h-12"
                            disabled={updateMutation.isPending}
                            onClick={() => {
                                updateMutation.mutate({
                                    id: course.id,
                                    data: { is_published: !course.is_published }
                                });
                            }}
                        >
                            {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            {course.is_published ? "Mover a Borrador" : "Publicar Curso"}
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full text-destructive hover:bg-destructive/10"
                            disabled={deleteCourseMutation.isPending}
                            onClick={() => {
                                if (window.confirm("¿Seguro que quieres borrar todo el curso?")) {
                                    deleteCourseMutation.mutate(course.id);
                                }
                            }}
                        >
                            {deleteCourseMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                            Eliminar Curso
                        </Button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminCourseDetail;
