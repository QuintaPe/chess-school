import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    BookOpen,
    Plus,
    Search,
    Layers,
    FileText,
    Video,
    Loader2,
    Trash2,
    Edit,
    Download
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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

const AdminContent = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isMaterialDialogOpen, setIsMaterialDialogOpen] = useState(false);
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

    const [newMaterial, setNewMaterial] = useState({
        name: "",
        type: "PDF",
        url: ""
    });

    const { data: courses, isLoading: loadingCourses } = useQuery<Course[]>({
        queryKey: ["admin-courses"],
        queryFn: () => api.courses.list(),
    });

    const { data: materials, isLoading: loadingMaterials } = useQuery<any[]>({
        queryKey: ["admin-materials"],
        queryFn: () => api.materials.list(),
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => api.courses.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
            toast.success("Curso creado con éxito");
            setIsCreateDialogOpen(false);
        },
        onError: (error: any) => toast.error(`Error: ${error.message}`)
    });

    const materialMutation = useMutation({
        mutationFn: (data: any) => api.materials.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-materials"] });
            toast.success("Material añadido");
            setIsMaterialDialogOpen(false);
        },
        onError: (error: any) => toast.error(`Error: ${error.message}`)
    });

    const deleteCourseMutation = useMutation({
        mutationFn: (id: number) => api.courses.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
            toast.success("Curso eliminado");
        }
    });

    const deleteMaterialMutation = useMutation({
        mutationFn: (id: number) => api.materials.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-materials"] });
            toast.success("Material eliminado");
        }
    });

    if (loadingCourses || loadingMaterials) {
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
                        <h1 className="text-3xl font-serif font-bold text-foreground">Gestión de Contenido</h1>
                        <p className="text-muted-foreground mt-1">Organiza cursos, lecciones y materiales</p>
                    </div>
                </div>

                <Tabs defaultValue="courses" className="space-y-6">
                    <TabsList className="bg-secondary/50 p-1">
                        <TabsTrigger value="courses" className="px-8">Cursos</TabsTrigger>
                        <TabsTrigger value="materials" className="px-8">Materiales</TabsTrigger>
                    </TabsList>

                    <TabsContent value="courses" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-serif font-bold">Mis Cursos ({courses?.length})</h2>
                            <Button variant="hero" onClick={() => setIsCreateDialogOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" /> Nuevo Curso
                            </Button>
                        </div>

                        <div className="grid gap-4">
                            {courses?.map((course) => (
                                <Card key={course.id} className="p-5 bg-card border-border hover:border-primary/40 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-4">
                                            <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                                                <BookOpen className="w-8 h-8 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">{course.title}</h3>
                                                <div className="flex gap-2 mt-1">
                                                    <Badge variant="outline">{course.level}</Badge>
                                                    <Badge variant="outline" className="text-primary border-primary/20">{course.price === 0 ? "Gratis" : `${course.price}€`}</Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/contenido/${course.id}`)}>
                                                <Layers className="w-4 h-4 mr-2" /> Lecciones
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                                                if (window.confirm("¿Eliminar curso?")) deleteCourseMutation.mutate(course.id);
                                            }}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="materials" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-serif font-bold">Biblioteca de Materiales ({materials?.length})</h2>
                            <Button variant="hero" onClick={() => setIsMaterialDialogOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" /> Subir Material
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {materials?.map((material) => (
                                <Card key={material.id} className="p-4 bg-card border-border hover:border-primary/40 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                                            <FileText className="w-6 h-6 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-foreground truncate">{material.name}</p>
                                            <p className="text-xs text-muted-foreground">{material.type} • {material.size || "1.2 MB"}</p>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(material.url)}>
                                                <Download className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteMaterialMutation.mutate(material.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                            {(!materials || materials.length === 0) && (
                                <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
                                    No hay materiales subidos todavía.
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Dialogs for Course and Material creation */}
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Nuevo Curso</DialogTitle></DialogHeader>
                        <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(newCourse); }} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Título</Label>
                                <Input value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Descripción</Label>
                                <Textarea value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} required />
                            </div>
                            <Button type="submit" variant="hero" className="w-full" disabled={createMutation.isPending}>Crear Curso</Button>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog open={isMaterialDialogOpen} onOpenChange={setIsMaterialDialogOpen}>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Subir Material</DialogTitle></DialogHeader>
                        <form onSubmit={(e) => { e.preventDefault(); materialMutation.mutate(newMaterial); }} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Nombre del archivo</Label>
                                <Input value={newMaterial.name} onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })} placeholder="Ej: Guía de aperturas" required />
                            </div>
                            <div className="space-y-2">
                                <Label>URL del archivo (Google Drive/Dropbox)</Label>
                                <Input value={newMaterial.url} onChange={(e) => setNewMaterial({ ...newMaterial, url: e.target.value })} placeholder="https://..." required />
                            </div>
                            <div className="space-y-2">
                                <Label>Tipo</Label>
                                <Select value={newMaterial.type} onValueChange={(v) => setNewMaterial({ ...newMaterial, type: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PDF">PDF</SelectItem>
                                        <SelectItem value="Doc">Documento</SelectItem>
                                        <SelectItem value="Video">Video</SelectItem>
                                        <SelectItem value="Otro">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" variant="hero" className="w-full" disabled={materialMutation.isPending}>Guardar Material</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
};

export default AdminContent;
