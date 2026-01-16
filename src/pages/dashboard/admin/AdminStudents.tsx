import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const AdminStudents = () => {
    const { data: students, isLoading, isError } = useQuery<any[]>({
        queryKey: ["admin-students"],
        queryFn: () => api.users.list("student"),
    });

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
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-10">
                                <Filter className="w-4 h-4 mr-2" />
                                Filtros
                            </Button>
                            <Button variant="outline" size="sm" className="h-10">
                                <ArrowUpDown className="w-4 h-4 mr-2" />
                                Ordenar
                            </Button>
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
                            {students?.map((student) => (
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
                                                <DropdownMenuItem onClick={() => { }}>Editar alumno</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => { }}>Ver progreso</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => { }}>Cambiar plan</DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-border" />
                                                <DropdownMenuItem className="text-destructive">
                                                    Dar de baja
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!students || students.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No se encontraron alumnos.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>

                {/* Pagination Placeholder */}
                <div className="flex items-center justify-between px-2">
                    <p className="text-sm text-muted-foreground">
                        Mostrando {students?.length || 0} alumnos
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminStudents;
