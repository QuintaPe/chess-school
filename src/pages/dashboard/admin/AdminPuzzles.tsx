import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Target,
    Plus,
    Search,
    Filter,
    CheckCircle2,
    Clock,
    LayoutGrid,
    List,
    Flame,
    TrendingUp,
    Brain,
    Loader2,
    Trash2,
    Edit3
} from "lucide-react";
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
import { ChessBoard } from "@/components/chess/ChessBoard";
import { BoardEditor } from "@/components/chess/BoardEditor";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Puzzle, PaginatedResponse } from "@/types/api";
import { ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";

const AdminPuzzles = () => {
    const queryClient = useQueryClient();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingPuzzle, setEditingPuzzle] = useState<any>(null);
    const [newPuzzle, setNewPuzzle] = useState({
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        solution: '',
        rating: 1500,
        turn: 'w'
    });

    const [page, setPage] = useState(1);
    const limit = 12;

    const { data: puzzlesData, isLoading } = useQuery<PaginatedResponse<Puzzle>>({
        queryKey: ["admin-puzzles", page],
        queryFn: () => api.puzzles.list({ page, limit }),
    });

    const puzzles = puzzlesData?.data || [];
    const meta = puzzlesData?.meta;

    const createMutation = useMutation({
        mutationFn: (data: any) => api.puzzles.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-puzzles"] });
            toast.success("Problema creado");
            setIsCreateOpen(false);
            setNewPuzzle({
                fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                solution: '',
                rating: 1500,
                turn: 'w'
            });
        },
        onError: (error: Error) => toast.error(error.message)
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => api.puzzles.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-puzzles"] });
            toast.success("Problema actualizado");
            setIsEditOpen(false);
        },
        onError: (error: Error) => toast.error(error.message)
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.puzzles.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-puzzles"] });
            toast.success("Problema eliminado");
        },
        onError: (error: Error) => toast.error(error.message)
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            ...newPuzzle,
            solution: newPuzzle.solution.split(',').map(s => s.trim())
        };
        createMutation.mutate(data);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            ...editingPuzzle,
            solution: typeof editingPuzzle.solution === 'string'
                ? editingPuzzle.solution.split(',').map((s: string) => s.trim())
                : editingPuzzle.solution
        };
        updateMutation.mutate({ id: editingPuzzle.id, data });
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
            <div className="p-6 lg:p-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-foreground">
                            Gestión de Problemas
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Crea y administra los desafíos tácticos
                        </p>
                    </div>
                    <Button variant="hero" onClick={() => setIsCreateOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Nuevo Problema
                    </Button>
                </div>

                {/* Filters/Search Component Placeholder */}

                {/* Puzzle Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {puzzles.map((puzzle) => (
                        <Card key={puzzle.id} className="bg-card border-border overflow-hidden hover:border-primary/40 transition-all group">
                            <div className="aspect-square bg-secondary/50 flex items-center justify-center p-4 relative overflow-hidden">
                                <ChessBoard
                                    fen={puzzle.fen}
                                    className="w-full h-full"
                                    flipped={(puzzle.turn || puzzle.fen.split(' ')[1]) === 'w'}
                                />
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => {
                                            setEditingPuzzle({
                                                ...puzzle,
                                                solution: Array.isArray(puzzle.solution) ? puzzle.solution.join(', ') : puzzle.solution
                                            });
                                            setIsEditOpen(true);
                                        }}
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => {
                                            if (window.confirm("¿Seguro que quieres eliminar este problema?")) {
                                                deleteMutation.mutate(puzzle.id);
                                            }
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="p-4 space-y-3 text-sm flex-1 flex flex-col">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-1">
                                        {puzzle.externalId && <span className="text-[10px] text-muted-foreground font-mono">{puzzle.externalId}</span>}
                                    </div>
                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                                        {puzzle.rating || 1500}
                                    </Badge>
                                </div>

                                {puzzle.tags && puzzle.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {puzzle.tags.slice(0, 3).map(tag => (
                                            <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-secondary text-muted-foreground rounded border border-border/50">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-auto pt-2 flex items-center justify-between border-t border-border/30 text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3 h-3" />
                                        <span>{puzzle.nbPlays || 0} Jugadas</span>
                                    </div>
                                    {puzzle.popularity !== undefined && (
                                        <div className="flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3 text-primary" />
                                            <span>{puzzle.popularity}%</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Pagination Controls */}
                {meta && meta.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 py-4">
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

                {/* Create Dialog */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Nuevo Problema</DialogTitle>
                            <DialogDescription>
                                Configura la posición arrastrando piezas y define la solución.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-6 py-4">
                            <BoardEditor
                                initialFen={newPuzzle.fen}
                                initialSolution={newPuzzle.solution}
                                initialRating={newPuzzle.rating}
                                onChange={({ fen, solution, rating }) => {
                                    const turn = (fen.split(' ')[1] || 'w') as 'w' | 'b';
                                    setNewPuzzle({ ...newPuzzle, fen, turn, solution, rating });
                                }}
                                onSave={() => handleCreate({ preventDefault: () => { } } as any)}
                                isSaving={createMutation.isPending}
                                saveLabel="Publicar Problema"
                            />
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Editar Problema</DialogTitle>
                        </DialogHeader>
                        {editingPuzzle && (
                            <form onSubmit={(e) => e.preventDefault()} className="space-y-6 py-4">
                                <BoardEditor
                                    initialFen={editingPuzzle.fen}
                                    initialSolution={editingPuzzle.solution}
                                    initialRating={editingPuzzle.rating}
                                    onChange={({ fen, solution, rating }) => {
                                        const turn = (fen.split(' ')[1] || 'w') as 'w' | 'b';
                                        setEditingPuzzle({ ...editingPuzzle, fen, turn, solution, rating });
                                    }}
                                    onSave={() => handleUpdate({ preventDefault: () => { } } as any)}
                                    isSaving={updateMutation.isPending}
                                    saveLabel="Guardar Cambios"
                                />
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
};

export default AdminPuzzles;
