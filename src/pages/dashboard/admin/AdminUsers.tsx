import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
    Search,
    UserPlus,
    MoreVertical,
    Mail,
    Calendar,
    Shield,
    Filter,
    ArrowUpDown,
    Loader2,
    Users,
    GraduationCap,
    ShieldAlert,
    MessageSquare,
    Trash2,
    CheckCircle2,
    XCircle,
    Plus,
    UserPlus as UserPlusIcon
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { StudentGroup } from "@/types/api";

const AdminUsers = () => {
    return (
        <DashboardLayout role="admin">
            <div className="p-6 lg:p-8 space-y-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">
                        Gestión Académica
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Administra usuarios, roles y grupos de estudio
                    </p>
                </div>

                <Tabs defaultValue="users" className="space-y-6">
                    <TabsList className="bg-secondary/50 border border-border p-1">
                        <TabsTrigger value="users" className="data-[state=active]:bg-card flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Usuarios
                        </TabsTrigger>
                        <TabsTrigger value="groups" className="data-[state=active]:bg-card flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Grupos de Alumnos
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="users">
                        <UserManagementTab />
                    </TabsContent>

                    <TabsContent value="groups">
                        <GroupManagementTab />
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
};

/* --- TAB: USUARIOS --- */
const UserManagementTab = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const { data: users, isLoading } = useQuery<any[]>({
        queryKey: ["admin-users", roleFilter, searchTerm],
        queryFn: () => api.admin.getUsers({
            role: roleFilter === "all" ? undefined : roleFilter,
            search: searchTerm || undefined
        }),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => api.admin.updateUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            toast.success("Usuario actualizado correctamente");
            setIsEditOpen(false);
        },
        onError: (error: Error) => toast.error(error.message)
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.admin.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            toast.success("Usuario eliminado");
            setIsDeleteOpen(false);
        },
        onError: (error: Error) => toast.error(error.message)
    });

    const handleUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate({
            id: selectedUser.id,
            data: {
                role: selectedUser.role,
                subscription_plan: selectedUser.subscription_plan,
                status: selectedUser.status
            }
        });
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "admin":
                return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Admin</Badge>;
            case "teacher":
                return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Profesor</Badge>;
            default:
                return <Badge className="bg-primary/10 text-primary border-primary/20">Alumno</Badge>;
        }
    };

    const getPlanBadge = (plan: string) => {
        if (plan === "premium") {
            return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Premium</Badge>;
        }
        return <Badge variant="outline" className="text-muted-foreground">Free</Badge>;
    };

    const getStatusBadge = (status: string) => {
        if (status === "active") {
            return (
                <div className="flex items-center gap-1.5 text-green-500">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Activo</span>
                </div>
            );
        }
        return (
            <div className="flex items-center gap-1.5 text-muted-foreground">
                <XCircle className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Inactivo</span>
            </div>
        );
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case "admin": return <ShieldAlert className="w-4 h-4" />;
            case "teacher": return <GraduationCap className="w-4 h-4" />;
            default: return <Users className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-6">
            <Card className="p-4 bg-card border-border">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre o email..."
                            className="pl-9 bg-secondary border-border"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        {(['all', 'student', 'teacher', 'admin'] as const).map((role) => (
                            <Button
                                key={role}
                                variant={roleFilter === role ? "hero" : "outline"}
                                size="sm"
                                onClick={() => setRoleFilter(role)}
                                className="capitalize"
                            >
                                {role === 'all' ? 'Todos' : role === 'student' ? 'Alumnos' : role === 'teacher' ? 'Profesores' : 'Admin'}
                            </Button>
                        ))}
                    </div>
                </div>
            </Card>

            <Card className="bg-card border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-secondary/50 border-border">
                            <TableHead className="w-[300px] font-semibold text-foreground">Usuario</TableHead>
                            <TableHead className="font-semibold text-foreground">Rol</TableHead>
                            <TableHead className="font-semibold text-foreground">Plan</TableHead>
                            <TableHead className="font-semibold text-foreground">Estado</TableHead>
                            <TableHead className="font-semibold text-foreground">Discord</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-48 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                        <p className="text-sm text-muted-foreground">Cargando usuarios...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : users?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                                    No se encontraron usuarios
                                </TableCell>
                            </TableRow>
                        ) : (
                            users?.map((user) => (
                                <TableRow key={user.id} className="border-border hover:bg-secondary/30 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner border border-primary/10">
                                                {user.avatar_url ? (
                                                    <img src={user.avatar_url} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                                ) : (
                                                    user.name?.charAt(0).toUpperCase() || "U"
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-foreground">{user.name}</span>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Mail className="w-3 h-3 text-primary/60" />
                                                    {user.email}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground">{getRoleIcon(user.role)}</span>
                                            {getRoleBadge(user.role)}
                                        </div>
                                    </TableCell>
                                    <TableCell>{getPlanBadge(user.subscription_plan)}</TableCell>
                                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                                    <TableCell>
                                        {user.discord_id ? (
                                            <div className="flex items-center gap-1.5 text-[#5865F2] font-medium text-xs bg-[#5865F2]/10 px-2 py-1 rounded-full border border-[#5865F2]/20">
                                                <MessageSquare className="w-3 h-3" />
                                                Vinculado
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">Sin vincular</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-card border-border">
                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => {
                                                    setSelectedUser({ ...user });
                                                    setIsEditOpen(true);
                                                }}>
                                                    Editar usuario
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setIsDeleteOpen(true);
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Dialogs */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px] bg-card border-border">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-serif font-bold">Editar Usuario</DialogTitle>
                        <DialogDescription>
                            Modifica el rol y plan de suscripción de {selectedUser?.name}.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedUser && (
                        <form onSubmit={handleUpdateSubmit} className="space-y-6 py-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-role">Rol de Usuario</Label>
                                    <Select
                                        value={selectedUser.role}
                                        onValueChange={(val) => setSelectedUser({ ...selectedUser, role: val })}
                                    >
                                        <SelectTrigger className="bg-secondary border-border">
                                            <SelectValue placeholder="Selecciona un rol" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border-border">
                                            <SelectItem value="student">Alumno</SelectItem>
                                            <SelectItem value="teacher">Profesor</SelectItem>
                                            <SelectItem value="admin">Administrador</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-plan">Plan de Suscripción</Label>
                                    <Select
                                        value={selectedUser.subscription_plan}
                                        onValueChange={(val) => setSelectedUser({ ...selectedUser, subscription_plan: val })}
                                    >
                                        <SelectTrigger className="bg-secondary border-border">
                                            <SelectValue placeholder="Selecciona un plan" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border-border">
                                            <SelectItem value="free">Free (Gratis)</SelectItem>
                                            <SelectItem value="premium">Premium</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-status">Estado de la Cuenta</Label>
                                    <Select
                                        value={selectedUser.status}
                                        onValueChange={(val) => setSelectedUser({ ...selectedUser, status: val })}
                                    >
                                        <SelectTrigger className="bg-secondary border-border">
                                            <SelectValue placeholder="Selecciona un estado" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border-border">
                                            <SelectItem value="active">Activo</SelectItem>
                                            <SelectItem value="inactive">Inactivo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
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

            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[400px] bg-card border-border">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2 text-destructive">
                            <Trash2 className="w-5 h-5" />
                            Confirmar Eliminación
                        </DialogTitle>
                        <DialogDescription className="pt-2">
                            ¿Estás seguro que deseas eliminar permanentemente a <strong>{selectedUser?.name}</strong>?
                            <br /><br />
                            Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => deleteMutation.mutate(selectedUser.id)}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Eliminar Usuario"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

/* --- TAB: GRUPOS --- */
const GroupManagementTab = () => {
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
        onError: (error: Error) => toast.error(`Error: ${error.message}`)
    });

    const addMemberMutation = useMutation({
        mutationFn: ({ groupId, userId }: { groupId: string, userId: string | number }) =>
            api.studentGroups.addMember(groupId, userId),
        onSuccess: () => {
            toast.success("Alumno añadido al grupo");
            queryClient.invalidateQueries({ queryKey: ["admin-groups"] });
            queryClient.invalidateQueries({ queryKey: ["group-members"] });
        },
        onError: (error: Error) => toast.error(`Error: ${error.message}`)
    });

    const removeMemberMutation = useMutation({
        mutationFn: ({ groupId, userId }: { groupId: string, userId: string | number }) =>
            api.studentGroups.removeMember(groupId, userId),
        onSuccess: () => {
            toast.success("Alumno eliminado del grupo");
            queryClient.invalidateQueries({ queryKey: ["admin-groups"] });
            queryClient.invalidateQueries({ queryKey: ["group-members"] });
        },
        onError: (error: Error) => toast.error(`Error: ${error.message}`)
    });

    const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const data = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            teacher_id: formData.get("teacher_id")?.toString() || null
        };
        createMutation.mutate(data);
    };

    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button variant="hero">
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Grupo
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-border sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="font-serif text-2xl">Crear Grupo</DialogTitle>
                            <DialogDescription>Crea un nuevo grupo de alumnos.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input id="name" name="name" required className="bg-secondary" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción</Label>
                                <textarea id="description" name="description" className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                                {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Crear Grupo"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups?.map((group) => (
                    <Card key={group.id} className="p-6 bg-card border-border hover:border-primary/30 transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Users className="w-6 h-6 text-primary" />
                            </div>
                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                {group.student_count || 0} alumnos
                            </Badge>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-1">{group.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">{group.description}</p>
                        <div className="flex items-center gap-2 mb-6 p-2 rounded-lg bg-secondary/50 border border-border">
                            <Shield className="w-4 h-4 text-accent" />
                            <div className="text-xs">
                                <p className="text-muted-foreground">Profesor Tutor</p>
                                <p className="font-bold text-foreground">{group.teacher_name}</p>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-all" onClick={() => { setSelectedGroup(group); setIsManageOpen(true); }}>
                            <UserPlusIcon className="w-4 h-4 mr-2" /> Gestionar Alumnos
                        </Button>
                    </Card>
                ))}
            </div>

            <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
                <DialogContent className="bg-card border-border sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-2xl">Alumnos: {selectedGroup?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="space-y-3">
                            <Label className="flex items-center gap-2">Miembros Actuales</Label>
                            <div className="max-h-[300px] overflow-y-auto border border-border rounded-lg bg-secondary/20">
                                <MembersList
                                    groupId={selectedGroup?.id}
                                    onRemove={(uid) => removeMemberMutation.mutate({ groupId: selectedGroup!.id, userId: uid })}
                                />
                            </div>
                        </div>
                        <div className="space-y-3 pt-4 border-t border-border">
                            <Label>Añadir Alumno</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar..."
                                    className="pl-10 bg-secondary"
                                    value={searchStudent}
                                    onChange={(e) => setSearchStudent(e.target.value)}
                                />
                            </div>
                            <div className="max-h-[200px] overflow-y-auto border border-border rounded-lg divide-y divide-border bg-background">
                                {allStudents?.map((s) => (
                                    <div key={s.id} className="p-3 flex items-center justify-between hover:bg-secondary/30 transition-colors">
                                        <div>
                                            <p className="text-sm font-bold text-foreground">{s.name}</p>
                                            <p className="text-xs text-muted-foreground">{s.email}</p>
                                        </div>
                                        <Button size="sm" variant="ghost" className="text-primary" onClick={() => addMemberMutation.mutate({ groupId: selectedGroup!.id, userId: s.id })}>
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const MembersList = ({ groupId, onRemove }: { groupId?: string, onRemove: (id: string | number) => void }) => {
    const { data: members, isLoading } = useQuery<any[]>({
        queryKey: ["group-members", groupId],
        queryFn: () => api.studentGroups.getMembers(groupId!),
        enabled: !!groupId
    });

    if (isLoading) return <div className="p-4 text-center"><Loader2 className="w-4 h-4 animate-spin mx-auto" /></div>;

    return (
        <div className="divide-y divide-border">
            {members?.map((member) => (
                <div key={member.id} className="p-3 flex items-center justify-between group/item">
                    <div>
                        <p className="text-sm font-medium text-foreground">{member.name}</p>
                        <p className="text-[10px] text-muted-foreground">{member.email}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="opacity-0 group-hover/item:opacity-100 text-destructive" onClick={() => onRemove(member.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ))}
            {(!members || members.length === 0) && <p className="p-8 text-center text-sm text-muted-foreground italic">Vacío</p>}
        </div>
    );
};

export default AdminUsers;
