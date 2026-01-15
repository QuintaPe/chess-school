import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import {
    TrendingUp,
    Target,
    Trophy,
    Calendar,
    BarChart3,
    Activity
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
    Legend
} from "recharts";

const StudentProgress = () => {
    const ratingData = [
        { month: "Ene", rating: 1200 },
        { month: "Feb", rating: 1250 },
        { month: "Mar", rating: 1280 },
        { month: "Abr", rating: 1320 },
        { month: "May", rating: 1380 },
        { month: "Jun", rating: 1450 },
    ];

    const activityData = [
        { day: "Lun", puzzles: 5, classes: 1, study: 2 },
        { day: "Mar", puzzles: 8, classes: 0, study: 1 },
        { day: "Mié", puzzles: 6, classes: 2, study: 3 },
        { day: "Jue", puzzles: 10, classes: 1, study: 2 },
        { day: "Vie", puzzles: 7, classes: 0, study: 1 },
        { day: "Sáb", puzzles: 12, classes: 1, study: 4 },
        { day: "Dom", puzzles: 9, classes: 0, study: 2 },
    ];

    const stats = {
        currentRating: 1450,
        ratingChange: +250,
        totalGames: 156,
        winRate: 62,
        puzzlesSolved: 342,
        studyHours: 48,
        classesAttended: 24,
        streak: 12
    };

    const achievements = [
        {
            id: 1,
            title: "Primera Victoria",
            description: "Gana tu primera partida",
            icon: "🏆",
            unlocked: true,
            date: "2025-12-15"
        },
        {
            id: 2,
            title: "Racha de 10 días",
            description: "Mantén una racha de 10 días consecutivos",
            icon: "🔥",
            unlocked: true,
            date: "2026-01-10"
        },
        {
            id: 3,
            title: "100 Problemas",
            description: "Resuelve 100 problemas de táctica",
            icon: "🎯",
            unlocked: true,
            date: "2026-01-05"
        },
        {
            id: 4,
            title: "Maestro Táctico",
            description: "Resuelve 500 problemas de táctica",
            icon: "⚡",
            unlocked: false,
            progress: 68
        },
        {
            id: 5,
            title: "Estudiante Dedicado",
            description: "Completa 50 horas de estudio",
            icon: "📚",
            unlocked: false,
            progress: 96
        },
    ];

    return (
        <DashboardLayout role="student">
            <div className="p-6 lg:p-8 space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">
                        Mi Progreso
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Analiza tu evolución y rendimiento
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-5 bg-card border-border">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                <span className="text-xs text-green-500 font-medium">+{stats.ratingChange}</span>
                            </div>
                            <p className="text-2xl font-bold text-foreground">{stats.currentRating}</p>
                            <p className="text-sm text-muted-foreground">Rating Actual</p>
                        </div>
                    </Card>

                    <Card className="p-5 bg-card border-border">
                        <div className="flex flex-col gap-2">
                            <Target className="w-5 h-5 text-accent" />
                            <p className="text-2xl font-bold text-foreground">{stats.puzzlesSolved}</p>
                            <p className="text-sm text-muted-foreground">Problemas</p>
                        </div>
                    </Card>

                    <Card className="p-5 bg-card border-border">
                        <div className="flex flex-col gap-2">
                            <Trophy className="w-5 h-5 text-blue-500" />
                            <p className="text-2xl font-bold text-foreground">{stats.winRate}%</p>
                            <p className="text-sm text-muted-foreground">Victorias</p>
                        </div>
                    </Card>

                    <Card className="p-5 bg-card border-border">
                        <div className="flex flex-col gap-2">
                            <Calendar className="w-5 h-5 text-purple-500" />
                            <p className="text-2xl font-bold text-foreground">{stats.streak}</p>
                            <p className="text-sm text-muted-foreground">Días racha</p>
                        </div>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Rating Progress */}
                    <Card className="p-6 bg-card border-border">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-serif font-semibold text-foreground">
                                    Evolución de Rating
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Últimos 6 meses
                                </p>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={ratingData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis
                                    dataKey="month"
                                    stroke="hsl(var(--muted-foreground))"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis
                                    stroke="hsl(var(--muted-foreground))"
                                    style={{ fontSize: '12px' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="rating"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={2}
                                    dot={{ fill: 'hsl(var(--primary))' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Activity */}
                    <Card className="p-6 bg-card border-border">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                <Activity className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <h2 className="text-xl font-serif font-semibold text-foreground">
                                    Actividad Semanal
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Última semana
                                </p>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={activityData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis
                                    dataKey="day"
                                    stroke="hsl(var(--muted-foreground))"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis
                                    stroke="hsl(var(--muted-foreground))"
                                    style={{ fontSize: '12px' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="puzzles" fill="hsl(var(--primary))" name="Problemas" />
                                <Bar dataKey="classes" fill="hsl(var(--accent))" name="Clases" />
                                <Bar dataKey="study" fill="#8b5cf6" name="Estudio (h)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                {/* Achievements */}
                <Card className="p-6 bg-card border-border">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-serif font-semibold text-foreground">
                                Logros
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {achievements.filter(a => a.unlocked).length} de {achievements.length} desbloqueados
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {achievements.map((achievement) => (
                            <div
                                key={achievement.id}
                                className={`p-4 rounded-xl border transition-colors ${achievement.unlocked
                                        ? 'bg-primary/5 border-primary/20'
                                        : 'bg-secondary/30 border-border opacity-60'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="text-4xl">{achievement.icon}</div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-foreground mb-1">
                                            {achievement.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            {achievement.description}
                                        </p>
                                        {achievement.unlocked ? (
                                            <p className="text-xs text-primary font-medium">
                                                Desbloqueado el {new Date(achievement.date).toLocaleDateString('es-ES')}
                                            </p>
                                        ) : (
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-muted-foreground">Progreso</span>
                                                    <span className="font-medium text-foreground">{achievement.progress}%</span>
                                                </div>
                                                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary transition-all"
                                                        style={{ width: `${achievement.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Summary Stats */}
                <div className="grid md:grid-cols-3 gap-4">
                    <Card className="p-5 bg-card border-border">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Partidas Jugadas</span>
                            <BarChart3 className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <p className="text-2xl font-bold text-foreground">{stats.totalGames}</p>
                    </Card>

                    <Card className="p-5 bg-card border-border">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Horas de Estudio</span>
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <p className="text-2xl font-bold text-foreground">{stats.studyHours}h</p>
                    </Card>

                    <Card className="p-5 bg-card border-border">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Clases Asistidas</span>
                            <Trophy className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <p className="text-2xl font-bold text-foreground">{stats.classesAttended}</p>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentProgress;
