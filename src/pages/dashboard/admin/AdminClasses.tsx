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
    Loader2,
    Edit,
    AlertCircle,
    Shield
} from "lucide-react";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

const AdminClasses = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<any>(null);
    const [selectedTeacher, setSelectedTeacher] = useState<string>("");
    const [selectedGroup, setSelectedGroup] = useState<string>("");

    useEffect(() => {
        if (!isCreateOpen) {
            setSelectedTeacher("");
            setSelectedGroup("");
        }
    }, [isCreateOpen]);

    useEffect(() => {
        if (isEditOpen && editingClass) {
            setSelectedTeacher(editingClass.teacher_id?.toString() || "");
            setSelectedGroup(editingClass.group_id?.toString() || "");
        } else if (!isEditOpen) {
            setSelectedTeacher("");
            setSelectedGroup("");
        }
    }, [isEditOpen, editingClass]);

    const queryClient = useQueryClient();

    const { data: classes, isLoading } = useQuery<any[]>({
        queryKey: ["admin-classes"],
        queryFn: () => api.classes.list(),
    });

    const { data: groups } = useQuery<any[]>({
        queryKey: ["admin-groups"],
        queryFn: () => api.studentGroups.list(),
    });

    const { data: teachers } = useQuery<any[]>({
        queryKey: ["admin-teachers"],
        queryFn: () => api.admin.getUsers({ role: "teacher" }),
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => api.classes.create(data),
        onSuccess: () => {
            toast.success("Clase programada con éxito");
            setIsCreateOpen(false);
            queryClient.invalidateQueries({ queryKey: ["admin-classes"] });
        },
        onError: (error: Error) => {
            toast.error(`Error: ${error.message}`);
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: any }) => api.classes.update(id, data),
        onSuccess: () => {
            toast.success("Clase actualizada con éxito");
            setIsEditOpen(false);
            setEditingClass(null);
            queryClient.invalidateQueries({ queryKey: ["admin-classes"] });
        },
        onError: (error: Error) => {
            toast.error(`Error: ${error.message}`);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.classes.delete(id),
        onSuccess: () => {
            toast.success("Clase eliminada");
            queryClient.invalidateQueries({ queryKey: ["admin-classes"] });
        },
        onError: (error: Error) => {
            toast.error(`Error al eliminar: ${error.message}`);
        }
    });

    const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const recurringDays = formData.getAll("recurring_days").map(d => parseInt(d as string));
        const groupId = formData.get("group_id") as string;

        const data: any = {
            title: formData.get("title"),
            level: formData.get("level"),
            start_time: formData.get("start_time"),
            video_url: formData.get("video_url") || "",
            meeting_link: formData.get("meeting_link") || "",
            status: "scheduled",
            recurring_days: recurringDays.length > 0 ? recurringDays : undefined
        };

        if (groupId && groupId !== "") {
            data.group_id = groupId;
            data.teacher_id = null;
        } else {
            const teacherId = formData.get("teacher_id") as string;
            if (teacherId) {
                data.teacher_id = teacherId;
            }
            data.group_id = null;
        }

        createMutation.mutate(data);
    };

    const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const groupId = formData.get("group_id") as string;
        const recurringDays = formData.getAll("recurring_days").map(d => parseInt(d as string));

        const data: any = {
            title: formData.get("title"),
            level: formData.get("level"),
            start_time: formData.get("start_time"),
            video_url: formData.get("video_url"),
            meeting_link: formData.get("meeting_link"),
            status: formData.get("status") || "scheduled",
            recurring_days: recurringDays.length > 0 ? recurringDays : undefined
        };

        if (groupId && groupId !== "") {
            data.group_id = groupId;
            data.teacher_id = null;
        } else {
            const teacherId = formData.get("teacher_id") as string;
            if (teacherId) {
                data.teacher_id = teacherId;
            }
            data.group_id = null;
        }

        updateMutation.mutate({ id: (editingClass as any).id, data });
    };

    const translateLevel = (level: string) => {
        switch (level) {
            case "beginner": return "Principiante";
            case "intermediate": return "Intermedio";
            case "advanced": return "Avanzado";
            default: return level;
        }
    };

    const upcomingClasses = classes?.filter(c => new Date(c.start_time) > new Date()) || [];
    const pastClasses = classes?.filter(c => new Date(c.start_time) <= new Date()) || [];

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
                            Gestión de Clases
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Programa y supervisa las clases en vivo y grabadas
                        </p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button variant="hero">
                                <Plus className="w-4 h-4 mr-2" />
                                Programar Clase
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-border sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="font-serif text-2xl">Nueva Clase</DialogTitle>
                                <DialogDescription>
                                    Configura los detalles de la nueva sesión en vivo.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Título de la clase</Label>
                                    <Input id="title" name="title" placeholder="Ej: Fundamentos de Apertura" required className="bg-secondary" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="level">Nivel</Label>
                                        <select id="level" name="level" className="w-full h-10 px-3 rounded-md border border-input bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary" required>
                                            <option value="beginner">Principiante</option>
                                            <option value="intermediate">Intermedio</option>
                                            <option value="advanced">Avanzado</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="start_time">Fecha y Hora</Label>
                                        <Input id="start_time" name="start_time" type="datetime-local" required className="bg-secondary" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="meeting_link">Enlace de la Reunión (Zoom/Meet/etc)</Label>
                                    <Input id="meeting_link" name="meeting_link" placeholder="https://..." className="bg-secondary" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="video_url">URL de Grabación (Opcional)</Label>
                                    <Input id="video_url" name="video_url" placeholder="https://..." className="bg-secondary" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="group_id">Restringir a Grupo (Opcional)</Label>
                                    <select
                                        name="group_id"
                                        id="group_id"
                                        className="w-full h-10 px-3 rounded-md border border-input bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={selectedGroup}
                                        onChange={(e) => setSelectedGroup(e.target.value)}
                                    >
                                        <option value="">Clase pública (Abierta a todos)</option>
                                        {groups?.map((group) => (
                                            <option key={group.id} value={group.id}>
                                                {group.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {!selectedGroup && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <Label htmlFor="teacher_id">Asignar Profesor</Label>
                                        <select
                                            name="teacher_id"
                                            id="teacher_id"
                                            className="w-full h-10 px-3 rounded-md border border-input bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                            value={selectedTeacher}
                                            onChange={(e) => setSelectedTeacher(e.target.value)}
                                        >
                                            <option value="">Ninguno (Sin profesor asignado)</option>
                                            {teachers?.map((teacher) => (
                                                <option key={teacher.id} value={teacher.id}>
                                                    {teacher.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="space-y-3 pt-4 border-t border-border mt-2">
                                    <Label>Días de Repetición (Opcional)</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day, i) => (
                                            <label key={i} className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md cursor-pointer hover:bg-secondary transition-colors">
                                                <input type="checkbox" name="recurring_days" value={i} className="w-3 h-3" />
                                                <span className="text-xs">{day}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={createMutation.isPending}>
                                    {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Confirmar Programación"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Edit Dialog */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="bg-card border-border sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="font-serif text-2xl">Editar Clase</DialogTitle>
                            <DialogDescription>
                                Modifica los detalles de la sesión.
                            </DialogDescription>
                        </DialogHeader>
                        {editingClass && (
                            <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-title">Título de la clase</Label>
                                    <Input id="edit-title" name="title" defaultValue={editingClass.title} required className="bg-secondary" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-level">Nivel</Label>
                                        <select id="edit-level" name="level" defaultValue={editingClass.level} className="w-full h-10 px-3 rounded-md border border-input bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary" required>
                                            <option value="beginner">Principiante</option>
                                            <option value="intermediate">Intermedio</option>
                                            <option value="advanced">Avanzado</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-start_time">Fecha y Hora</Label>
                                        <Input
                                            id="edit-start_time"
                                            name="start_time"
                                            type="datetime-local"
                                            defaultValue={new Date(editingClass.start_time).toISOString().slice(0, 16)}
                                            required
                                            className="bg-secondary"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-meeting_link">Enlace de la Reunión</Label>
                                    <Input id="edit-meeting_link" name="meeting_link" defaultValue={editingClass.meeting_link} placeholder="https://..." className="bg-secondary" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-video_url">URL de Grabación</Label>
                                    <Input id="edit-video_url" name="video_url" defaultValue={editingClass.video_url} placeholder="https://..." className="bg-secondary" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-status">Estado</Label>
                                    <select id="edit-status" name="status" defaultValue={editingClass.status || "scheduled"} className="w-full h-10 px-3 rounded-md border border-input bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                                        <option value="scheduled">Programada</option>
                                        <option value="live">En Vivo</option>
                                        <option value="completed">Completada</option>
                                        <option value="canceled">Cancelada</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-teacher" className={selectedGroup ? "opacity-50" : ""}>Profesor</Label>
                                    <select
                                        name="teacher_id"
                                        id="edit-teacher"
                                        className="w-full h-10 px-3 rounded-md border border-input bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                                        value={selectedTeacher}
                                        onChange={(e) => setSelectedTeacher(e.target.value)}
                                        disabled={!!selectedGroup}
                                    >
                                        <option value="">Ninguno</option>
                                        {teachers?.map((teacher) => (
                                            <option key={teacher.id} value={teacher.id}>
                                                {teacher.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-group_id" className={selectedTeacher ? "opacity-50" : ""}>Grupo (Opcional)</Label>
                                    <select
                                        name="group_id"
                                        id="edit-group_id"
                                        className="w-full h-10 px-3 rounded-md border border-input bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                                        value={selectedGroup}
                                        onChange={(e) => setSelectedGroup(e.target.value)}
                                        disabled={!!selectedTeacher}
                                    >
                                        <option value="">Ninguno (Público)</option>
                                        {groups?.map((group) => (
                                            <option key={group.id} value={group.id}>
                                                {group.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-border">
                                    <Label>Días de Repetición</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day, i) => (
                                            <label key={i} className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md cursor-pointer hover:bg-secondary transition-colors">
                                                <input
                                                    type="checkbox"
                                                    name="recurring_days"
                                                    value={i}
                                                    defaultChecked={editingClass.recurring_days?.includes(i)}
                                                    className="w-3 h-3"
                                                />
                                                <span className="text-xs">{day}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={updateMutation.isPending}>
                                    {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Guardar Cambios"}
                                </Button>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>

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
                                <p className="text-xl font-bold text-foreground">{classes?.length || 0}</p>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Clases</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-5 bg-card border-border">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Video className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-foreground">Live</p>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Modalidad</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-5 bg-card border-border">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-foreground">{pastClasses.length}</p>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Completadas</p>
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
                        {upcomingClasses.length > 0 ? (
                            upcomingClasses.map((clase) => (
                                <Card key={clase.id} className="p-5 bg-card border-border hover:border-primary/30 transition-colors">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-foreground text-lg">{clase.title}</h3>
                                                <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px] h-5 uppercase">
                                                    {translateLevel(clase.level)}
                                                </Badge>
                                            </div>
                                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(clase.start_time).toLocaleDateString("es-ES")}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(clase.start_time).toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                {clase.group_name ? (
                                                    <div className="flex items-center gap-2 text-sm text-accent font-medium">
                                                        <Users className="w-4 h-4" />
                                                        Grupo: {clase.group_name}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-sm text-blue-500 font-medium">
                                                        <Shield className="w-4 h-4" />
                                                        Clase Pública
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => {
                                                setEditingClass(clase);
                                                setIsEditOpen(true);
                                            }}>
                                                <Edit className="w-4 h-4 mr-2" />
                                                Editar
                                            </Button>
                                            <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => {
                                                if (window.confirm("¿Estás seguro de que quieres eliminar esta clase?")) {
                                                    deleteMutation.mutate(clase.id);
                                                }
                                            }}>Eliminar</Button>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <p className="text-muted-foreground italic text-center py-8">No hay clases próximas programadas.</p>
                        )}
                    </div>
                </div>

                {/* Past Classes */}
                <div className="space-y-4">
                    <h2 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
                        Historial de Clases
                    </h2>
                    <div className="bg-card border border-border rounded-xl overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-secondary/50">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-foreground">Clase</th>
                                    <th className="p-4 text-sm font-semibold text-foreground">Fecha</th>
                                    <th className="p-4 text-sm font-semibold text-foreground">Nivel</th>
                                    <th className="p-4 text-sm font-semibold text-foreground text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {pastClasses.length > 0 ? (
                                    pastClasses.map((clase) => (
                                        <tr key={clase.id} className="hover:bg-secondary/20 transition-colors">
                                            <td className="p-4 text-sm font-medium text-foreground">{clase.title}</td>
                                            <td className="p-4 text-sm text-muted-foreground">{new Date(clase.start_time).toLocaleDateString("es-ES")}</td>
                                            <td className="p-4 text-sm text-muted-foreground uppercase">{translateLevel(clase.level)}</td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => {
                                                        setEditingClass(clase);
                                                        setIsEditOpen(true);
                                                    }}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-muted-foreground italic">No hay historial de clases.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminClasses;
