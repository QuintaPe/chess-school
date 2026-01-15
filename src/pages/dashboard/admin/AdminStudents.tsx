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

const AdminStudents = () => {
    const students = [
        {
            id: 1,
            name: "Juan Pérez",
            email: "juan.perez@example.com",
            role: "student",
            plan: "Premium",
            joinedDate: "2025-10-15",
            status: "active",
            lastLogin: "2h atrás",
        },
        {
            id: 2,
            name: "María García",
            email: "maria.garcia@example.com",
            role: "student",
            plan: "Free",
            joinedDate: "2025-11-20",
            status: "active",
            lastLogin: "1d atrás",
        },
        {
            id: 3,
            name: "Carlos Rodríguez",
            email: "carlos.r@example.com",
            role: "student",
            plan: "Premium",
            joinedDate: "2025-12-05",
            status: "inactive",
            lastLogin: "1 semana atrás",
        },
        {
            id: 4,
            name: "Ana Martínez",
            email: "ana.mtz@example.com",
            role: "student",
            plan: "Free",
            joinedDate: "2026-01-10",
            status: "active",
            lastLogin: "Recién",
        },
        {
            id: 5,
            name: "Luis Sánchez",
            email: "luis.s@example.com",
            role: "student",
            plan: "Premium",
            joinedDate: "2025-09-28",
            status: "active",
            lastLogin: "5h atrás",
        },
    ];

    const getPlanBadge = (plan: string) => {
        switch (plan.toLowerCase()) {
            case "premium":
                return <Badge className="bg-primary/10 text-primary border-primary/20">Premium</Badge>;
            case "free":
                return <Badge variant="outline" className="text-muted-foreground">Free</Badge>;
            default:
                return null;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case "active":
                return (
                    <div className="flex items-center gap-1.5 text-green-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-xs font-medium">Activo</span>
                    </div>
                );
            case "inactive":
                return (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                        <span className="text-xs font-medium">Inactivo</span>
                    </div>
                );
            default:
                return null;
        }
    };

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
                                <TableHead className="font-semibold text-foreground">Última sesión</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.map((student) => (
                                <TableRow key={student.id} className="border-border hover:bg-secondary/30 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                                                {student.name.charAt(0)}
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
                                    <TableCell>{getPlanBadge(student.plan)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 text-sm text-foreground">
                                            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                            {new Date(student.joinedDate).toLocaleDateString('es-ES')}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{student.lastLogin}</TableCell>
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
                        </TableBody>
                    </Table>
                </Card>

                {/* Pagination Placeholder */}
                <div className="flex items-center justify-between px-2">
                    <p className="text-sm text-muted-foreground">
                        Mostrando 5 de 128 alumnos
                    </p>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled>Anterior</Button>
                        <Button variant="outline" size="sm">Siguiente</Button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminStudents;
