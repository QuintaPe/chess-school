import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChessBoard } from "@/components/chess/ChessBoard";
import {
    Target,
    Trophy,
    Clock,
    CheckCircle2,
    XCircle,
    Lightbulb,
    TrendingUp,
    Flame
} from "lucide-react";
import { useState } from "react";

const StudentPuzzles = () => {
    const [activeTab, setActiveTab] = useState<"daily" | "history">("daily");

    const dailyPuzzle = {
        id: 1,
        title: "Mate en 2",
        difficulty: "Intermedio",
        points: 25,
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        description: "Las blancas juegan y dan mate en 2 movimientos",
        attempts: 0,
        solved: false
    };

    const puzzleHistory = [
        {
            id: 2,
            title: "Táctica de Horquilla",
            difficulty: "Principiante",
            date: "2026-01-15",
            solved: true,
            attempts: 2,
            points: 15,
            time: "2:34"
        },
        {
            id: 3,
            title: "Defensa Material",
            difficulty: "Intermedio",
            date: "2026-01-14",
            solved: true,
            attempts: 1,
            points: 25,
            time: "1:45"
        },
        {
            id: 4,
            title: "Mate en 3",
            difficulty: "Avanzado",
            date: "2026-01-13",
            solved: false,
            attempts: 5,
            points: 0,
            time: "8:20"
        },
        {
            id: 5,
            title: "Clavada Absoluta",
            difficulty: "Intermedio",
            date: "2026-01-12",
            solved: true,
            attempts: 1,
            points: 25,
            time: "1:12"
        },
    ];

    const stats = {
        totalSolved: 156,
        streak: 12,
        accuracy: 78,
        totalPoints: 3420
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "Principiante":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            case "Intermedio":
                return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "Avanzado":
                return "bg-red-500/10 text-red-500 border-red-500/20";
            default:
                return "bg-gray-500/10 text-gray-500 border-gray-500/20";
        }
    };

    return (
        <DashboardLayout role="student">
            <div className="p-6 lg:p-8 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">
                        Problemas de Ajedrez
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Mejora tu táctica resolviendo problemas diarios
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-5 bg-card border-border">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Target className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{stats.totalSolved}</p>
                                <p className="text-sm text-muted-foreground">Resueltos</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5 bg-card border-border">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                                <Flame className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{stats.streak}</p>
                                <p className="text-sm text-muted-foreground">Días racha</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5 bg-card border-border">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{stats.accuracy}%</p>
                                <p className="text-sm text-muted-foreground">Precisión</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5 bg-card border-border">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Trophy className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{stats.totalPoints}</p>
                                <p className="text-sm text-muted-foreground">Puntos</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-border">
                    <button
                        onClick={() => setActiveTab("daily")}
                        className={`px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === "daily"
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Problema del Día
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === "history"
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Historial
                    </button>
                </div>

                {/* Daily Puzzle */}
                {activeTab === "daily" && (
                    <Card className="p-6 bg-card border-border">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-serif font-semibold text-foreground mb-1">
                                    {dailyPuzzle.title}
                                </h2>
                                <p className="text-sm text-muted-foreground">{dailyPuzzle.description}</p>
                            </div>
                            <div className="flex items-center gap-2 text-primary">
                                <Trophy className="w-5 h-5" />
                                <span className="font-medium">+{dailyPuzzle.points} puntos</span>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* Chess Board */}
                            <div className="flex justify-center">
                                <ChessBoard
                                    size="md"
                                    interactive={true}
                                    showCoordinates={true}
                                    className="glow-gold"
                                />
                            </div>

                            {/* Info & Actions */}
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
                                        <span className="text-foreground font-medium">Dificultad</span>
                                        <Badge className={getDifficultyColor(dailyPuzzle.difficulty)}>
                                            {dailyPuzzle.difficulty}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
                                        <span className="text-foreground font-medium">Intentos</span>
                                        <span className="text-muted-foreground">{dailyPuzzle.attempts}</span>
                                    </div>

                                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                                        <div className="flex items-start gap-3">
                                            <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-foreground mb-1">Pista</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Busca una jugada forzante que limite las opciones del rey negro.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Button variant="hero" size="lg" className="w-full">
                                        Verificar Solución
                                    </Button>
                                    <Button variant="outline" size="lg" className="w-full">
                                        <Lightbulb className="w-4 h-4 mr-2" />
                                        Mostrar Pista
                                    </Button>
                                    <Button variant="ghost" size="lg" className="w-full">
                                        Rendirse
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* History */}
                {activeTab === "history" && (
                    <div className="space-y-4">
                        {puzzleHistory.map((puzzle) => (
                            <Card key={puzzle.id} className="p-6 bg-card border-border hover:border-primary/30 transition-colors">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-lg font-semibold text-foreground mb-1">
                                                    {puzzle.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(puzzle.date).toLocaleDateString('es-ES', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            {puzzle.solved ? (
                                                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                    Resuelto
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                                                    <XCircle className="w-3 h-3 mr-1" />
                                                    No resuelto
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-muted-foreground">Dificultad</span>
                                                <Badge className={`${getDifficultyColor(puzzle.difficulty)} text-xs mt-1 w-fit`}>
                                                    {puzzle.difficulty}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-muted-foreground">Intentos</span>
                                                <span className="text-sm font-medium text-foreground mt-1">{puzzle.attempts}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-muted-foreground">Tiempo</span>
                                                <span className="text-sm font-medium text-foreground mt-1">{puzzle.time}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-muted-foreground">Puntos</span>
                                                <span className="text-sm font-medium text-foreground mt-1">
                                                    {puzzle.solved ? `+${puzzle.points}` : '0'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Button variant="outline" className="w-full md:w-auto">
                                            Reintentar
                                        </Button>
                                        <Button variant="ghost" className="w-full md:w-auto">
                                            Ver Solución
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default StudentPuzzles;
