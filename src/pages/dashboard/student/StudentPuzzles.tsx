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
import { Puzzle, PaginatedResponse, DailyPuzzle, DailyStats, DailyLeaderboard } from "@/types/api";
import { ChevronLeft, ChevronRight as ChevronRightIcon, Clock, Percent, ListOrdered, Calendar } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const StudentPuzzles = () => {
    const [activeTab, setActiveTab] = useState<"daily" | "history">("daily");
    const [solvingPuzzle, setSolvingPuzzle] = useState<any>(null);

    const [page, setPage] = useState(1);
    const limit = 9;

    const queryClient = useQueryClient();

    const { data: dailyPuzzle, isLoading: isLoadingDaily } = useQuery<DailyPuzzle>({
        queryKey: ["daily-puzzle"],
        queryFn: () => api.puzzles.daily(),
    });

    const { data: dailyStats, isLoading: isLoadingStats } = useQuery<DailyStats>({
        queryKey: ["daily-stats"],
        queryFn: () => api.puzzles.dailyStats(),
    });

    const { data: leaderboardData, isLoading: isLoadingLeaderboard } = useQuery<DailyLeaderboard>({
        queryKey: ["daily-leaderboard"],
        queryFn: () => api.puzzles.dailyLeaderboard(),
    });

    const solveMutation = useMutation({
        mutationFn: (data: { dailyPuzzleId: number; moves: string[]; solved: boolean; timeSpent: number }) =>
            api.puzzles.dailyAttempt(data),
        onSuccess: (data) => {
            if (data.solved) {
                toast.success(data.message || "¡Felicidades! Has resuelto el puzzle del día", {
                    description: data.eloGained ? `Has ganado ${data.eloGained} puntos de ELO` : undefined
                });
            }

            if (data.newAchievements && data.newAchievements.length > 0) {
                data.newAchievements.forEach((id: string) => {
                    toast.success("¡Nuevo Logro Desbloqueado! 🏆", {
                        description: `Has obtenido una nueva medalla. Revisa tu perfil.`,
                        duration: 6000,
                    });
                });
                queryClient.invalidateQueries({ queryKey: ["achievements"] });
            }

            queryClient.invalidateQueries({ queryKey: ["daily-puzzle"] });
            queryClient.invalidateQueries({ queryKey: ["daily-stats"] });
            queryClient.invalidateQueries({ queryKey: ["daily-leaderboard"] });
        },
        onError: (error) => {
            toast.error("Error al registrar el intento");
            console.error(error);
        }
    });

    const { data: puzzlesData, isLoading: isLoadingHistory } = useQuery<PaginatedResponse<Puzzle>>({
        queryKey: ["student-puzzles", page],
        queryFn: () => api.puzzles.list({ page, limit, sort: 'rating', order: 'asc' }),
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

    const userRating = statsData?.rating || 1200;

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
                                <p className="text-2xl font-bold text-foreground">{dailyStats?.currentStreak || stats.streak || 0}</p>
                                <p className="text-sm text-muted-foreground">Racha Diaria</p>
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

                    <Card className="p-5 bg-card border-border border-b-yellow-500 border-b-2">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                                <Trophy className="w-6 h-6 text-yellow-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{userRating}</p>
                                <p className="text-sm text-muted-foreground">Rating ELO</p>
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
                    <div className="grid lg:grid-cols-4 gap-6 items-start">
                        <div className="lg:col-span-3 space-y-6">
                            <Card className="p-6 bg-card border-border flex flex-col justify-center items-center min-h-[500px]">
                                {isLoadingDaily ? (
                                    <div className="flex justify-center py-20">
                                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                    </div>
                                ) : dailyPuzzle ? (
                                    <PuzzleSolver
                                        puzzle={dailyPuzzle}
                                        isDaily={true}
                                        onSolve={(result) => {
                                            solveMutation.mutate({
                                                dailyPuzzleId: dailyPuzzle.dailyPuzzleId,
                                                moves: result.moves,
                                                solved: true,
                                                timeSpent: result.timeSpent
                                            });
                                        }}
                                    />
                                ) : (
                                    <div className="text-center py-20 text-muted-foreground">
                                        No hay problema diario disponible.
                                    </div>
                                )}
                            </Card>

                            {/* Leaderboard Section */}
                            <Card className="p-6 bg-card border-border">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <ListOrdered className="w-5 h-5 text-primary" />
                                    Ranking del Día
                                </h3>
                                {isLoadingLeaderboard ? (
                                    <div className="flex justify-center py-10">
                                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                    </div>
                                ) : leaderboardData?.leaderboard.length ? (
                                    <div className="overflow-hidden rounded-lg border border-border">
                                        <table className="w-full text-sm">
                                            <thead className="bg-secondary/30">
                                                <tr>
                                                    <th className="px-4 py-2 text-left font-bold">#</th>
                                                    <th className="px-4 py-2 text-left font-bold">Usuario</th>
                                                    <th className="px-4 py-2 text-right font-bold">Tiempo</th>
                                                    <th className="px-4 py-2 text-right font-bold">Intentos</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {leaderboardData.leaderboard.map((entry) => (
                                                    <tr key={entry.userId} className={cn("hover:bg-primary/5 transition-colors", entry.rank === 1 && "bg-yellow-500/5")}>
                                                        <td className="px-4 py-2 font-mono">
                                                            {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : entry.rank}
                                                        </td>
                                                        <td className="px-4 py-2 font-medium">{entry.userName}</td>
                                                        <td className="px-4 py-2 text-right font-mono">{entry.timeSpent}s</td>
                                                        <td className="px-4 py-2 text-right">{entry.attempts}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-10">
                                        Nadie ha resuelto el puzzle todavía. ¡Sé el primero!
                                    </p>
                                )}
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card className="p-6 bg-primary/5 border-primary/20">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-primary" />
                                    Reto de Hoy
                                </h3>
                                {dailyPuzzle && (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-sm py-2 border-b border-primary/10">
                                            <span className="text-muted-foreground">ID Interno</span>
                                            <span className="font-mono font-bold">#{dailyPuzzle.dailyPuzzleId}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm py-2 border-b border-primary/10">
                                            <span className="text-muted-foreground">Estado</span>
                                            <Badge variant={dailyPuzzle.userAttempt?.solved ? "default" : "secondary"}>
                                                {dailyPuzzle.userAttempt?.solved ? "Resuelto" : "Pendiente"}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between items-center text-sm py-2 border-b border-primary/10">
                                            <span className="text-muted-foreground">Intentos</span>
                                            <span className="font-bold">{dailyPuzzle.userAttempt?.attempts || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm py-2 border-b border-primary/10">
                                            <span className="text-muted-foreground">Dificultad</span>
                                            <Badge className={getDifficultyColor(dailyPuzzle.rating)}>
                                                {getDifficultyLabel(dailyPuzzle.rating)}
                                            </Badge>
                                        </div>
                                    </div>
                                )}
                            </Card>

                            {/* New Stats Card */}
                            <Card className="p-6 bg-card border-border">
                                <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">Tus Estadísticas</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Percent className="w-4 h-4 text-purple-500" />
                                            <span>Tasa Éxito</span>
                                        </div>
                                        <span className="font-bold">{dailyStats?.solveRate || 0}%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock className="w-4 h-4 text-blue-500" />
                                            <span>Tiempo Medio</span>
                                        </div>
                                        <span className="font-bold">{dailyStats?.averageTime || 0}s</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Flame className="w-4 h-4 text-orange-500" />
                                            <span>Max Racha</span>
                                        </div>
                                        <span className="font-bold">{dailyStats?.longestStreak || 0}</span>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6 bg-secondary/20 border-border">
                                <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-3">Recompensas</h4>
                                <ul className="text-xs space-y-2 text-muted-foreground">
                                    <li className="flex justify-between"><span>1er Intento:</span> <span className="text-green-500 font-bold">+5 ELO</span></li>
                                    <li className="flex justify-between"><span>2-3 Intentos:</span> <span className="text-green-500/80 font-bold">+3 ELO</span></li>
                                    <li className="flex justify-between"><span>+3 Intentos:</span> <span className="text-green-500/60 font-bold">+1 ELO</span></li>
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
