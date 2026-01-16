import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChessBoard } from "@/components/chess/ChessBoard";
import {
    Target,
    Trophy,
    CheckCircle2,
    XCircle,
    Lightbulb,
    TrendingUp,
    Flame,
    Loader2
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const StudentPuzzles = () => {
    const [activeTab, setActiveTab] = useState<"daily" | "history">("daily");

    const { data: dailyPuzzle, isLoading: isLoadingDaily } = useQuery({
        queryKey: ["daily-puzzle"],
        queryFn: () => api.puzzles.daily(),
    });

    const { data: puzzleHistory, isLoading: isLoadingHistory } = useQuery<any[]>({
        queryKey: ["puzzles"],
        queryFn: () => api.puzzles.list(),
    });

    const getDifficultyColor = (rating: number) => {
        if (rating < 1200) return "bg-green-500/10 text-green-500 border-green-500/20";
        if (rating < 1800) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
        return "bg-red-500/10 text-red-500 border-red-500/20";
    };

    const getDifficultyLabel = (rating: number) => {
        if (rating < 1200) return "Principiante";
        if (rating < 1800) return "Intermedio";
        return "Avanzado";
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
                                <p className="text-2xl font-bold text-foreground">--</p>
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
                                <p className="text-2xl font-bold text-foreground">--</p>
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
                                <p className="text-2xl font-bold text-foreground">--%</p>
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
                                <p className="text-2xl font-bold text-foreground">--</p>
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
                        {isLoadingDaily ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                            </div>
                        ) : dailyPuzzle ? (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-2xl font-serif font-semibold text-foreground mb-1">
                                            Problema #{dailyPuzzle.id}
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            Juegan las {dailyPuzzle.turn === 'w' ? 'Blancas' : 'Negras'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 text-primary">
                                        <Trophy className="w-5 h-5" />
                                        <span className="font-medium">+{dailyPuzzle.rating > 1500 ? 50 : 25} puntos</span>
                                    </div>
                                </div>

                                <div className="grid lg:grid-cols-2 gap-6">
                                    {/* Chess Board */}
                                    <div className="flex justify-center">
                                        <ChessBoard
                                            fen={dailyPuzzle.fen}
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
                                                <span className="text-foreground font-medium">Rating</span>
                                                <Badge className={getDifficultyColor(dailyPuzzle.rating)}>
                                                    {dailyPuzzle.rating} ({getDifficultyLabel(dailyPuzzle.rating)})
                                                </Badge>
                                            </div>

                                            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
                                                <span className="text-foreground font-medium">Solución</span>
                                                <span className="text-muted-foreground">{dailyPuzzle.solution?.length} movimientos</span>
                                            </div>

                                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                                                <div className="flex items-start gap-3">
                                                    <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="font-medium text-foreground mb-1">Pista</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Observa la posición de los reyes y las piezas mayores.
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
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-20 text-muted-foreground">
                                No hay problema diario disponible.
                            </div>
                        )}
                    </Card>
                )}

                {/* History */}
                {activeTab === "history" && (
                    <div className="space-y-4">
                        {isLoadingHistory ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                            </div>
                        ) : puzzleHistory && puzzleHistory.length > 0 ? (
                            puzzleHistory.map((puzzle) => (
                                <Card key={puzzle.id} className="p-6 bg-card border-border hover:border-primary/30 transition-colors">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-foreground mb-1">
                                                        Problema #{puzzle.id}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Rating: {puzzle.rating}
                                                    </p>
                                                </div>
                                                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                    Disponible
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-muted-foreground">Dificultad</span>
                                                    <Badge className={`${getDifficultyColor(puzzle.rating)} text-xs mt-1 w-fit`}>
                                                        {getDifficultyLabel(puzzle.rating)}
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-muted-foreground">Turno</span>
                                                    <span className="text-sm font-medium text-foreground mt-1">
                                                        {puzzle.turn === 'w' ? 'Blancas' : 'Negras'}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-muted-foreground">Solución</span>
                                                    <span className="text-sm font-medium text-foreground mt-1">
                                                        {puzzle.solution?.length} movs
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Button variant="outline" className="w-full md:w-auto">
                                                Resolver
                                            </Button>
                                            <Button variant="ghost" className="w-full md:w-auto">
                                                Ver Detalles
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-20 text-muted-foreground italic">
                                No hay historial de problemas.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default StudentPuzzles;
