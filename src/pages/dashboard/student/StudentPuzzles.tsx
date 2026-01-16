import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PuzzleSolver } from "@/components/chess/PuzzleSolver";
import { cn } from "@/lib/utils";
import {
    Target,
    Trophy,
    CheckCircle2,
    TrendingUp,
    Flame,
    Loader2
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { ChessBoard } from "@/components/chess/ChessBoard";
import { Puzzle, PaginatedResponse } from "@/types/api";
import { ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";

const StudentPuzzles = () => {
    const [activeTab, setActiveTab] = useState<"daily" | "history">("daily");
    const [solvingPuzzle, setSolvingPuzzle] = useState<any>(null);

    const [page, setPage] = useState(1);
    const limit = 9;

    const { data: dailyPuzzle, isLoading: isLoadingDaily } = useQuery({
        queryKey: ["daily-puzzle"],
        queryFn: () => api.puzzles.daily(),
    });

    const { data: puzzlesData, isLoading: isLoadingHistory } = useQuery<PaginatedResponse<Puzzle>>({
        queryKey: ["student-puzzles", page],
        queryFn: () => api.puzzles.list({ page, limit }),
    });

    const puzzleHistory = puzzlesData?.data || [];
    const meta = puzzlesData?.meta;

    const { data: statsData } = useQuery({
        queryKey: ["student-stats"],
        queryFn: () => api.users.getStats(),
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

    const stats = statsData?.summary || {
        puzzlesSolved: 0,
        streak: 0,
        accuracy: 0,
        points: 0
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
                        Interactúa con el tablero para encontrar la mejor jugada
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-5 bg-card border-border border-b-primary border-b-2">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Target className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{stats.puzzlesSolved || statsData?.totalPuzzles || 0}</p>
                                <p className="text-sm text-muted-foreground">Resueltos</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5 bg-card border-border border-b-accent border-b-2">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                                <Flame className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{stats.streak || 0}</p>
                                <p className="text-sm text-muted-foreground">Días racha</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5 bg-card border-border border-b-purple-500 border-b-2">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{stats.accuracy || 0}%</p>
                                <p className="text-sm text-muted-foreground">Precisión</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5 bg-card border-border border-b-blue-500 border-b-2">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Trophy className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{stats.points || 0}</p>
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
                    <div className="grid lg:grid-cols-3 gap-6 items-start">
                        <Card className="lg:col-span-2 p-6 bg-card border-border h-full flex flex-col justify-center items-center">
                            {isLoadingDaily ? (
                                <div className="flex justify-center py-20">
                                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                </div>
                            ) : dailyPuzzle ? (
                                <PuzzleSolver puzzle={dailyPuzzle} />
                            ) : (
                                <div className="text-center py-20 text-muted-foreground">
                                    No hay problema diario disponible.
                                </div>
                            )}
                        </Card>

                        <div className="space-y-6">
                            <Card className="p-6 bg-primary/5 border-primary/20">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-primary" />
                                    Detalles del Reto
                                </h3>
                                {dailyPuzzle && (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-sm py-2 border-b border-primary/10">
                                            <span className="text-muted-foreground">ID del Problema</span>
                                            <span className="font-mono font-bold">#{dailyPuzzle.id}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm py-2 border-b border-primary/10">
                                            <span className="text-muted-foreground">Juegan</span>
                                            <Badge variant="secondary">{dailyPuzzle.turn === 'w' ? 'Blancas' : 'Negras'}</Badge>
                                        </div>
                                        <div className="flex justify-between items-center text-sm py-2 border-b border-primary/10">
                                            <span className="text-muted-foreground">Dificultad</span>
                                            <Badge className={getDifficultyColor(dailyPuzzle.rating)}>
                                                {dailyPuzzle.rating} ({getDifficultyLabel(dailyPuzzle.rating)})
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between items-center text-sm py-2 border-b border-primary/10">
                                            <span className="text-muted-foreground">Recompensa</span>
                                            <span className="text-green-500 font-bold">+{dailyPuzzle.rating > 1500 ? 50 : 25} pts</span>
                                        </div>
                                    </div>
                                )}
                            </Card>

                            <Card className="p-6 bg-secondary/20 border-border">
                                <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-3">Instrucciones</h4>
                                <ul className="text-sm space-y-2 text-muted-foreground list-disc pl-4">
                                    <li>Selecciona una pieza y elige su destino.</li>
                                    <li>Si la jugada es correcta, el oponente responderá.</li>
                                    <li>Encuentra la secuencia completa para ganar los puntos.</li>
                                    <li>Usa la pista si te quedas atascado.</li>
                                </ul>
                            </Card>
                        </div>
                    </div>
                )}

                {/* History */}
                {activeTab === "history" && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {isLoadingHistory ? (
                            <div className="col-span-full flex justify-center py-20">
                                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                            </div>
                        ) : puzzleHistory && puzzleHistory.length > 0 ? (
                            puzzleHistory.map((puzzle) => (
                                <Card key={puzzle.id} className="bg-card border-border overflow-hidden hover:border-primary/40 transition-all group flex flex-col">
                                    <div className="aspect-square bg-secondary/50 flex items-center justify-center p-4 relative overflow-hidden">
                                        <ChessBoard
                                            fen={puzzle.fen}
                                            className="w-full h-full"
                                            flipped={(puzzle.turn || puzzle.fen.split(' ')[1]) === 'w'}
                                        />
                                    </div>
                                    <div className="p-4 flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-foreground">Problema #{puzzle.id}</h3>
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                                                    Juegan {puzzle.turn === 'w' ? 'Blancas' : 'Negras'}
                                                </p>
                                            </div>
                                            <Badge className={cn("text-[10px]", getDifficultyColor(puzzle.rating))}>
                                                {puzzle.rating}
                                            </Badge>
                                        </div>

                                        <Button
                                            variant="hero"
                                            size="sm"
                                            className="w-full h-9 mt-2"
                                            onClick={() => setSolvingPuzzle(puzzle)}
                                        >
                                            Resolver
                                        </Button>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 text-muted-foreground italic">
                                No hay historial de problemas.
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {activeTab === "history" && meta && meta.totalPages > 1 && (
                            <div className="col-span-full flex items-center justify-center gap-4 pt-4 pb-8">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setPage(p => Math.max(1, p - 1));
                                        window.scrollTo(0, 0);
                                    }}
                                    disabled={page === 1}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
                                </Button>
                                <span className="text-sm font-medium">
                                    Página {page} de {meta.totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setPage(p => Math.min(meta.totalPages, p + 1));
                                        window.scrollTo(0, 0);
                                    }}
                                    disabled={page === meta.totalPages}
                                >
                                    Siguiente <ChevronRightIcon className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Solver Dialog for History Puzzles */}
                <Dialog open={!!solvingPuzzle} onOpenChange={(open) => !open && setSolvingPuzzle(null)}>
                    <DialogContent className="sm:max-w-[500px] bg-card border-border">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-serif">Resolviendo Problema #{solvingPuzzle?.id}</DialogTitle>
                        </DialogHeader>
                        <div className="py-4 flex justify-center">
                            {solvingPuzzle && (
                                <PuzzleSolver
                                    puzzle={solvingPuzzle}
                                    onSolve={() => setTimeout(() => setSolvingPuzzle(null), 2000)}
                                />
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
};

export default StudentPuzzles;
