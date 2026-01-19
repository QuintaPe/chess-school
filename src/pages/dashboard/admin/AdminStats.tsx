import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import {
    TrendingUp,
    TrendingDown,
    Users,
    CreditCard,
    Target,
    Clock,
    ChevronDown,
    Loader2,
} from "lucide-react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const AdminStats = () => {
    const { data: students, isLoading: loadingStudents } = useQuery<any[]>({
        queryKey: ["admin-students"],
        queryFn: () => api.admin.getUsers({ role: "student" }),
    });

    const { data: courses, isLoading: loadingCourses } = useQuery<any[]>({
        queryKey: ["admin-courses"],
        queryFn: () => api.courses.list(),
    });

    const isLoading = loadingStudents || loadingCourses;

    const revenueData = [
        { month: "Ene", revenue: 4500, students: 120 },
        { month: "Feb", revenue: 5200, students: 135 },
        { month: "Mar", revenue: 4800, students: 142 },
        { month: "Abr", revenue: 6100, students: 168 },
        { month: "May", revenue: 5900, students: 185 },
        { month: "Jun", revenue: 7500, students: 231 },
    ];

    const popularCourses = courses?.slice(0, 5).map(c => ({
        name: c.title,
        students: Math.floor(Math.random() * 100) + 20 // Simulated as we don't have enrollments counts easily
    })) || [
            { name: "Sinfonía de Piezas", students: 45 },
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
                            Estadísticas Globales
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Análisis detallado del rendimiento del club
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-10">
                            Últimos 6 meses
                            <ChevronDown className="ml-2 w-4 h-4" />
                        </Button>
                        <Button variant="hero" size="sm" className="h-10">
                            Descargar Informe
                        </Button>
                    </div>
                </div>

                {/* Primary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="p-6 bg-card border-border border-b-primary border-b-2">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-primary" />
                            </div>
                            <Badge className="bg-green-500/10 text-green-500 border-green-500/10 text-[10px]">+0%</Badge>
                        </div>
                        <p className="text-2xl font-bold text-foreground">0€</p>
                        <p className="text-sm text-muted-foreground">Ingresos Mensuales</p>
                    </Card>

                    <Card className="p-6 bg-card border-border border-b-accent border-b-2">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                <Users className="w-5 h-5 text-accent" />
                            </div>
                            <Badge className="bg-green-500/10 text-green-500 border-green-500/10 text-[10px]">+0%</Badge>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{students?.length || 0}</p>
                        <p className="text-sm text-muted-foreground">Alumnos Activos</p>
                    </Card>

                    <Card className="p-6 bg-card border-border border-b-blue-500 border-b-2">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Target className="w-5 h-5 text-blue-500" />
                            </div>
                            <Badge className="bg-green-500/10 text-green-500 border-green-500/10 text-[10px]">+0%</Badge>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{courses?.length || 0}</p>
                        <p className="text-sm text-muted-foreground">Cursos Totales</p>
                    </Card>

                    <Card className="p-6 bg-card border-border border-b-purple-500 border-b-2">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-purple-500" />
                            </div>
                            <Badge className="bg-green-500/10 text-green-500 border-green-500/10 text-[10px]">0%</Badge>
                        </div>
                        <p className="text-2xl font-bold text-foreground">--</p>
                        <p className="text-sm text-muted-foreground">Sesión Media</p>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Revenue Over Time */}
                    <Card className="p-6 bg-card border-border">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-serif font-bold text-foreground">Recaudación</h2>
                                <p className="text-sm text-muted-foreground text-green-500 flex items-center mt-1">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    +25% vs año anterior
                                </p>
                            </div>
                        </div>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}€`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Popular Courses */}
                    <Card className="p-6 bg-card border-border">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-serif font-bold text-foreground">Cursos Populares</h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Alumnos inscritos por curso
                                </p>
                            </div>
                        </div>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={popularCourses} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" stroke="hsl(var(--foreground))" fontSize={12} width={100} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'hsl(var(--secondary))', opacity: 0.4 }}
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                                    />
                                    <Bar dataKey="students" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} barSize={24} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Secondary Charts */}
                <div className="grid lg:grid-cols-3 gap-6">
                    <Card className="p-6 bg-card border-border lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-serif font-bold text-foreground">Crecimiento de Usuarios</h2>
                        </div>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                    <Tooltip />
                                    <Line type="stepAfter" dataKey="students" stroke="hsl(var(--blue-500))" strokeWidth={3} dot={{ strokeWidth: 2, r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card className="p-6 bg-card border-border">
                        <h2 className="text-lg font-serif font-bold text-foreground mb-4">Desglose de Planes</h2>
                        <div className="space-y-6 mt-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm items-center">
                                    <span className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-primary" />
                                        Premium Plus
                                    </span>
                                    <span className="font-bold">42%</span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: '42%' }} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm items-center">
                                    <span className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-accent" />
                                        Básico
                                    </span>
                                    <span className="font-bold">38%</span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-accent" style={{ width: '38%' }} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm items-center">
                                    <span className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                                        Free Trial
                                    </span>
                                    <span className="font-bold">20%</span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-muted-foreground" style={{ width: '20%' }} />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminStats;

const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold border", className)}>
        {children}
    </span>
);

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
