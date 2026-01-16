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
    Loader2
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
} from "@/components/ui/dialog";
import { toast } from "sonner";

const AdminStudents = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<any>(null);

    const { data: students, isLoading } = useQuery<any[]>({
        queryKey: ["admin-students"],
        queryFn: () => api.users.list("student"),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => api.users.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-students"] });
            toast.success("Alumno actualizado");
            setIsEditOpen(false);
        },
        onError: (error: Error) => toast.error(error.message)
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.users.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-students"] });
            toast.success("Alumno dado de baja");
        },
        onError: (error: Error) => toast.error(error.message)
    });

    const filteredStudents = students?.filter(s =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate({
            id: editingStudent.id,
            data: {
                name: editingStudent.name,
                subscription_plan: editingStudent.subscription_plan,
                status: editingStudent.status
            }
        });
    };

    const getPlanBadge = (plan: string) => {
        if (!plan) return <Badge variant="outline" className="text-muted-foreground">Free</Badge>;
        switch (plan.toLowerCase()) {
            case "premium":
                return <Badge className="bg-primary/10 text-primary border-primary/20">Premium</Badge>;
            case "free":
                return <Badge variant="outline" className="text-muted-foreground">Free</Badge>;
            default:
                return <Badge variant="outline">{plan}</Badge>;
        }
    };

    const getStatusBadge = (status: string) => {
        const isActive = status === "active" || status === "confirmed";
        if (isActive) {
            return (
                <div className="flex items-center gap-1.5 text-green-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-xs font-medium">Activo</span>
                </div>
            );
        }
        return (
            <div className="flex items-center gap-1.5 text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                <span className="text-xs font-medium">Inactivo</span>
            </div>
        );
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
            <div className="p-6 lg:p-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-foreground">
                            Gestión de Alumnos
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Administra las cuentas y el acceso de los estudiantes
                        </p>
                    </div>
                    <Button variant="hero">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Nuevo Alumno
                    </Button>
                </div>

                {/* Filters/Search */}
                <Card className="p-4 bg-card border-border">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nombre, email..."
                                className="pl-9 bg-secondary border-border h-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </Card>

                {/* Table */}
                <Card className="bg-card border-border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-secondary/50 border-border">
                                <TableHead className="w-[250px] font-semibold text-foreground">Alumno</TableHead>
                                <TableHead className="font-semibold text-foreground">Estado</TableHead>
                                <TableHead className="font-semibold text-foreground">Plan</TableHead>
                                <TableHead className="font-semibold text-foreground">Fecha registro</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents?.map((student) => (
                                <TableRow key={student.id} className="border-border hover:bg-secondary/30 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                                                {student.name?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">{student.name}</p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {student.email}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(student.status)}</TableCell>
                                    <TableCell>{getPlanBadge(student.subscription_plan)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 text-sm text-foreground">
                                            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                            {student.created_at ? new Date(student.created_at).toLocaleDateString('es-ES') : 'N/A'}
                                        </div>
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
                                                    setEditingStudent(student);
                                                    setIsEditOpen(true);
                                                }}>
                                                    Editar alumno
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onClick={() => {
                                                    if (window.confirm("¿Seguro que quieres dar de baja a este alumno?")) {
                                                        deleteMutation.mutate(student.id);
                                                    }
                                                }}>
                                                    Dar de baja
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                {/* Edit Dialog */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Editar Alumno</DialogTitle>
                        </DialogHeader>
                        {editingStudent && (
                            <form onSubmit={handleUpdateSubmit} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-name">Nombre</Label>
                                    <Input
                                        id="edit-name"
                                        value={editingStudent.name}
                                        onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-plan">Plan de Suscripción</Label>
                                    <select
                                        id="edit-plan"
                                        className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm"
                                        value={editingStudent.subscription_plan}
                                        onChange={(e) => setEditingStudent({ ...editingStudent, subscription_plan: e.target.value })}
                                    >
                                        <option value="free">Gratis</option>
                                        <option value="premium">Premium</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-status">Estado</Label>
                                    <select
                                        id="edit-status"
                                        className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm"
                                        value={editingStudent.status}
                                        onChange={(e) => setEditingStudent({ ...editingStudent, status: e.target.value })}
                                    >
                                        <option value="active">Activo</option>
                                        <option value="inactive">Inactivo</option>
                                    </select>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" variant="hero" disabled={updateMutation.isPending}>
                                        {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar Cambios"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
};

export default AdminStudents;
