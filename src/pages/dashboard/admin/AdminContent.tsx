import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Link, useNavigate } from "react-router-dom";
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
    Loader2,
    Trash2,
    Edit
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Course } from "@/types/api";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const AdminContent = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);

    const [newCourse, setNewCourse] = useState({
        title: "",
        description: "",
        level: "beginner",
        category: "General",
        price: 0,
        thumbnail_url: "",
        is_published: true
    });

    const { data: courses, isLoading, isError } = useQuery<Course[]>({
        queryKey: ["admin-courses"],
        queryFn: () => api.courses.list(),
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => api.courses.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
            toast.success("Curso creado con éxito");
            setIsCreateDialogOpen(false);
            setNewCourse({
                title: "",
                description: "",
                level: "beginner",
                category: "General",
                price: 0,
                thumbnail_url: "",
                is_published: true
            });
        },
        onError: (error: any) => {
            toast.error(`Error al crear el curso: ${error.message}`);
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: any }) => api.courses.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
            toast.success("Curso actualizado con éxito");
            setIsEditDialogOpen(false);
            setEditingCourse(null);
        },
        onError: (error: any) => {
            toast.error(`Error al actualizar el curso: ${error.message}`);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.courses.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
            toast.success("Curso eliminado");
        },
        onError: (error: any) => {
            toast.error(`Error al eliminar el curso: ${error.message}`);
        }
    });

    const handleCreateCourse = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(newCourse);
    };

    const handleEditCourse = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCourse) {
            const data = {
                title: editingCourse.title,
                description: editingCourse.description,
                level: editingCourse.level,
                price: editingCourse.price,
                category: editingCourse.category
            };
            updateMutation.mutate({ id: editingCourse.id, data });
        }
    };

    const materials = [
        { id: 1, name: "Guía de Aperturas.pdf", type: "PDF", size: "2.4 MB" },
        { id: 2, name: "Plan de Entrenamiento.docx", type: "Doc", size: "1.1 MB" },
    ];

    if (isLoading) {
        return (
            <DashboardLayout role="admin">
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

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
                        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="hero">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nuevo Curso
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] bg-card border-border">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-serif">Crear Nuevo Curso</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleCreateCourse} className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Título</Label>
                                        <Input
                                            id="title"
                                            value={newCourse.title}
                                            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                                            placeholder="Ej: Fundamentos del Ajedrez"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Descripción</Label>
                                        <Textarea
                                            id="description"
                                            value={newCourse.description}
                                            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                                            placeholder="Breve descripción del curso..."
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="level">Nivel</Label>
                                            <Select
                                                value={newCourse.level}
                                                onValueChange={(value) => setNewCourse({ ...newCourse, level: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar nivel" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="beginner">Principiante</SelectItem>
                                                    <SelectItem value="intermediate">Intermedio</SelectItem>
                                                    <SelectItem value="advanced">Avanzado</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="price">Precio (€)</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                value={newCourse.price}
                                                onChange={(e) => setNewCourse({ ...newCourse, price: Number(e.target.value) })}
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="ghost" onClick={() => setIsCreateDialogOpen(false)}>
                                            Cancelar
                                        </Button>
                                        <Button type="submit" variant="hero" disabled={createMutation.isPending}>
                                            {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Crear Curso"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="sm:max-w-[500px] bg-card border-border">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-serif">Editar Curso</DialogTitle>
                        </DialogHeader>
                        {editingCourse && (
                            <form onSubmit={handleEditCourse} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-title">Título</Label>
                                    <Input
                                        id="edit-title"
                                        value={editingCourse.title}
                                        onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-description">Descripción</Label>
                                    <Textarea
                                        id="edit-description"
                                        value={editingCourse.description}
                                        onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-level">Nivel</Label>
                                        <Select
                                            value={editingCourse.level}
                                            onValueChange={(value) => setEditingCourse({ ...editingCourse, level: value as any })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar nivel" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="beginner">Principiante</SelectItem>
                                                <SelectItem value="intermediate">Intermedio</SelectItem>
                                                <SelectItem value="advanced">Avanzado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-price">Precio (€)</Label>
                                        <Input
                                            id="edit-price"
                                            type="number"
                                            value={editingCourse.price}
                                            onChange={(e) => setEditingCourse({ ...editingCourse, price: Number(e.target.value) })}
                                            min="0"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="ghost" onClick={() => setIsEditDialogOpen(false)}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit" variant="hero" disabled={updateMutation.isPending}>
                                        {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar Cambios"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Content Inventory */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-serif font-bold text-foreground">Cursos</h2>
                            <div className="flex items-center gap-2">
                                <Search className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{courses?.length || 0} cursos en total</span>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {courses?.map((course) => (
                                <Card key={course.id} className="p-5 bg-card border-border hover:border-primary/40 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
                                            {course.thumbnail_url ? (
                                                <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <BookOpen className="w-6 h-6 text-primary" />
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-foreground">{course.title}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="outline" className="text-[10px] h-4 uppercase tracking-wider">{course.category}</Badge>
                                                        <Badge variant="outline" className="text-[10px] h-4 uppercase">
                                                            {course.level === "beginner" ? "Principiante" : course.level === "intermediate" ? "Intermedio" : "Avanzado"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 hover:bg-secondary"
                                                        onClick={() => {
                                                            setEditingCourse(course);
                                                            setIsEditDialogOpen(true);
                                                        }}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => {
                                                            if (window.confirm("¿Estás seguro de que quieres eliminar este curso?")) {
                                                                deleteMutation.mutate(course.id);
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-2">
                                                <div className="flex gap-4">
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <Layers className="w-3.5 h-3.5" />
                                                        {course.lessons?.length || 0} lecciones
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <span className="font-medium text-foreground">{course.price === 0 ? "Gratis" : `${course.price}€`}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 text-xs underline"
                                                        onClick={() => navigate(`/admin/contenido/${course.id}`)}
                                                    >
                                                        Gestionar Lecciones
                                                    </Button>
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
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminContent;
