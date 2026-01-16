import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
    Loader2
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const AdminPuzzles = () => {
    const { data: puzzles, isLoading, isError } = useQuery<any[]>({
        queryKey: ["admin-puzzles"],
        queryFn: () => api.puzzles.list(),
    });

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
                            Crea y administra los desafíos diarios de táctica
                        </p>
                    </div>
                    <Button variant="hero">
                        <Plus className="w-4 h-4 mr-2" />
                        Nuevo Problema
                    </Button>
                </div>

                {/* Puzzle Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="p-5 bg-card border-border">
                        <div className="flex flex-col gap-2">
                            <Brain className="w-5 h-5 text-primary" />
                            <p className="text-2xl font-bold text-foreground">{puzzles?.length || 0}</p>
                            <p className="text-xs text-muted-foreground font-medium uppercase">Total Problemas</p>
                        </div>
                    </Card>
                    <Card className="p-5 bg-card border-border">
                        <div className="flex flex-col gap-2">
                            <Flame className="w-5 h-5 text-accent" />
                            <p className="text-2xl font-bold text-foreground">0</p>
                            <p className="text-xs text-muted-foreground font-medium uppercase">Resoluciones Hoy</p>
                        </div>
                    </Card>
                    <Card className="p-5 bg-card border-border">
                        <div className="flex flex-col gap-2">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            <p className="text-2xl font-bold text-foreground">--%</p>
                            <p className="text-xs text-muted-foreground font-medium uppercase">Tasa de Éxito</p>
                        </div>
                    </Card>
                    <Card className="p-5 bg-card border-border">
                        <div className="flex flex-col gap-2">
                            <Clock className="w-5 h-5 text-blue-500" />
                            <p className="text-2xl font-bold text-foreground">--</p>
                            <p className="text-xs text-muted-foreground font-medium uppercase">Tiempo Medio</p>
                        </div>
                    </Card>
                </div>

                {/* Filters/Search */}
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por título o FEN..."
                            className="pl-9 bg-secondary border-border h-10"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                            <Filter className="w-4 h-4 mr-2" />
                            Filtrar
                        </Button>
                        <Button variant="outline" size="icon" className="h-10 w-10">
                            <LayoutGrid className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-10 w-10">
                            <List className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Puzzle Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {puzzles?.map((puzzle) => (
                        <Card key={puzzle.id} className="bg-card border-border overflow-hidden hover:border-primary/40 transition-all group">
                            <div className="aspect-square bg-secondary/50 flex items-center justify-center p-8 relative">
                                <Target className="w-20 h-20 text-muted-foreground/20 group-hover:scale-110 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-4">
                                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                                        Publicado
                                    </Badge>
                                </div>
                            </div>
                            <div className="p-4 space-y-4">
                                <div>
                                    <h3 className="font-semibold text-foreground line-clamp-1">Problema #{puzzle.id}</h3>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 truncate">
                                        FEN: {puzzle.fen}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="p-2 rounded-lg bg-secondary/50 text-center">
                                        <p className="text-xs text-muted-foreground">Rating</p>
                                        <p className="text-sm font-medium text-foreground">{puzzle.rating || 1500}</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-secondary/50 text-center">
                                        <p className="text-xs text-muted-foreground">Turno</p>
                                        <p className="text-sm font-medium text-foreground">{puzzle.turn === 'w' ? 'Blancas' : 'Negras'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-border">
                                    <div className="text-xs text-muted-foreground">
                                        Solución: {puzzle.solution?.join(', ')}
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-8">Editar</Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {(!puzzles || puzzles.length === 0) && (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            No se encontraron problemas.
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminPuzzles;
