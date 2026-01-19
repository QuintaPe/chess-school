import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    Plus,
    Search,
    MoreVertical,
    Trash2,
    UserPlus,
    Loader2,
    Shield,
    GraduationCap
} from "lucide-react";
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
import { StudentGroup } from "@/types/api";

const AdminGroups = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<StudentGroup | null>(null);
    const [isManageOpen, setIsManageOpen] = useState(false);
    const [searchStudent, setSearchStudent] = useState("");

    const queryClient = useQueryClient();

    const { data: groups, isLoading } = useQuery<StudentGroup[]>({
        queryKey: ["admin-groups"],
        queryFn: () => api.studentGroups.list(),
    });

    const { data: teachers } = useQuery<any[]>({
        queryKey: ["admin-teachers"],
        queryFn: () => api.admin.getUsers({ role: "teacher" }),
    });

    const { data: allStudents } = useQuery<any[]>({
        queryKey: ["admin-students-search", searchStudent],
        queryFn: () => api.admin.getUsers({ role: "student", search: searchStudent }),
        enabled: isManageOpen
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => api.studentGroups.create(data),
        onSuccess: () => {
            toast.success("Grupo creado con éxito");
            setIsCreateOpen(false);
            queryClient.invalidateQueries({ queryKey: ["admin-groups"] });
        },
        onError: (error: Error) => {
            toast.error(`Error: ${error.message}`);
        }
    });

    const addMemberMutation = useMutation({
        mutationFn: ({ groupId, userId }: { groupId: number, userId: number }) =>
            api.studentGroups.addMember(groupId, userId),
        onSuccess: () => {
            toast.success("Alumno añadido al grupo");
            queryClient.invalidateQueries({ queryKey: ["admin-groups"] });
        },
        onError: (error: Error) => {
            toast.error(`Error: ${error.message}`);
        }
    });

    const removeMemberMutation = useMutation({
        mutationFn: ({ groupId, userId }: { groupId: number, userId: number }) =>
            api.studentGroups.removeMember(groupId, userId),
        onSuccess: () => {
            toast.success("Alumno eliminado del grupo");
            queryClient.invalidateQueries({ queryKey: ["admin-groups"] });
        },
        onError: (error: Error) => {
            toast.error(`Error: ${error.message}`);
        }
    });

    const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            teacher_id: parseInt(formData.get("teacher_id") as string)
        };
        createMutation.mutate(data);
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

    return (
        <DashboardLayout role="admin">
            <div className="p-6 lg:p-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-foreground">
                            Grupos de Alumnos
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Gestiona clases académicas estables y sus profesores
                        </p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button variant="hero">
                                <Plus className="w-4 h-4 mr-2" />
                                Crear Grupo
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-border sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="font-serif text-2xl">Nuevo Grupo</DialogTitle>
                                <DialogDescription>
                                    Crea un grupo para organizar alumnos y asignarles un tutor.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre del grupo</Label>
                                    <Input id="name" name="name" placeholder="Ej: Tecnificación Sub-14" required className="bg-secondary" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Descripción</Label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Objetivos del grupo..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="teacher_id">Profesor Tutor</Label>
                                    <select
                                        name="teacher_id"
                                        id="teacher_id"
                                        className="w-full h-10 px-3 rounded-md border border-input bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    >
                                        <option value="">Seleccionar profesor</option>
                                        {teachers?.map((teacher) => (
                                            <option key={teacher.id} value={teacher.id}>
                                                {teacher.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={createMutation.isPending}>
                                    {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Crear Grupo"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Groups Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups?.map((group) => (
                        <Card key={group.id} className="p-6 bg-card border-border hover:border-primary/30 transition-all group relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <Users className="w-6 h-6 text-primary" />
                                </div>
                                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                    {group.member_count || 0} alumnos
                                </Badge>
                            </div>

                            <h3 className="text-xl font-bold text-foreground mb-1">{group.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                                {group.description || "Sin descripción"}
                            </p>

                            <div className="flex items-center gap-2 mb-6 p-2 rounded-lg bg-secondary/50 border border-border">
                                <Shield className="w-4 h-4 text-accent" />
                                <div className="text-xs">
                                    <p className="text-muted-foreground">Profesor Tutor</p>
                                    <p className="font-bold text-foreground">{group.teacher_name || "No asignado"}</p>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full group-hover:bg-primary group-hover:text-white transition-all"
                                onClick={() => {
                                    setSelectedGroup(group);
                                    setIsManageOpen(true);
                                }}
                            >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Gestionar Alumnos
                            </Button>
                        </Card>
                    ))}

                    {groups?.length === 0 && (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-2xl">
                            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <p className="text-muted-foreground italic">No hay grupos creados todavía.</p>
                            <Button variant="link" onClick={() => setIsCreateOpen(true)}>Crea el primero</Button>
                        </div>
                    )}
                </div>

                {/* Manage Members Dialog */}
                <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
                    <DialogContent className="bg-card border-border sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="font-serif text-2xl">
                                Alumnos: {selectedGroup?.name}
                            </DialogTitle>
                            <DialogDescription>
                                Añade o quita alumnos de este grupo académico.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            {/* Current Members */}
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-primary" />
                                    Miembros Actuales ({selectedGroup?.member_count || 0})
                                </Label>
                                <div className="max-h-[300px] overflow-y-auto border border-border rounded-lg bg-secondary/20">
                                    <MembersList
                                        groupId={selectedGroup?.id}
                                        onRemove={(userId) => removeMemberMutation.mutate({
                                            groupId: selectedGroup!.id,
                                            userId
                                        })}
                                    />
                                </div>
                            </div>

                            {/* Search and Add */}
                            <div className="space-y-3 pt-4 border-t border-border">
                                <Label>Añadir Nuevo Alumno</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar por nombre o email..."
                                        className="pl-10 bg-secondary"
                                        value={searchStudent}
                                        onChange={(e) => setSearchStudent(e.target.value)}
                                    />
                                </div>

                                <div className="max-h-[200px] overflow-y-auto border border-border rounded-lg divide-y divide-border bg-background">
                                    {allStudents?.map((student) => (
                                        <div key={student.id} className="p-3 flex items-center justify-between hover:bg-secondary/30 transition-colors">
                                            <div>
                                                <p className="text-sm font-bold text-foreground">{student.name}</p>
                                                <p className="text-xs text-muted-foreground">{student.email}</p>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-primary hover:bg-primary/10"
                                                onClick={() => addMemberMutation.mutate({
                                                    groupId: selectedGroup!.id,
                                                    userId: student.id
                                                })}
                                                disabled={addMemberMutation.isPending}
                                            >
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    {searchStudent && allStudents?.length === 0 && (
                                        <p className="p-4 text-center text-xs text-muted-foreground">No se encontraron alumnos.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
};

const MembersList = ({ groupId, onRemove }: { groupId?: number, onRemove: (id: number) => void }) => {
    const { data: members, isLoading } = useQuery<any[]>({
        queryKey: ["group-members", groupId],
        queryFn: () => api.studentGroups.getMembers(groupId!),
        enabled: !!groupId
    });

    if (isLoading) return <div className="p-4 text-center"><Loader2 className="w-4 h-4 animate-spin mx-auto" /></div>;

    if (!members || members.length === 0) {
        return <p className="p-8 text-center text-sm text-muted-foreground italic">No hay alumnos en este grupo.</p>;
    }

    return (
        <div className="divide-y divide-border">
            {members.map((member) => (
                <div key={member.user_id} className="p-3 flex items-center justify-between group/item">
                    <div>
                        <p className="text-sm font-medium text-foreground">{member.user_name}</p>
                        <p className="text-[10px] text-muted-foreground">{member.user_email}</p>
                    </div>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover/item:opacity-100 text-destructive hover:bg-destructive/10 transition-all"
                        onClick={() => onRemove(member.user_id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ))}
        </div>
    );
};

export default AdminGroups;
