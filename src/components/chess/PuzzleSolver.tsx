import { useState, useEffect } from "react";
import { Chess, Square, Move } from "chess.js";
import { ChessBoard } from "./ChessBoard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lightbulb, RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

import { Puzzle, DailyPuzzle } from "@/types/api";

interface PuzzleSolverProps {
    puzzle: Puzzle | DailyPuzzle;
    onSolve?: (result: { moves: string[], timeSpent: number }) => void;
    isDaily?: boolean;
}

interface SolveResult {
    ratingDelta: number;
    newRating: number;
    eloGained?: number;
}

export const PuzzleSolver = ({ puzzle, onSolve, isDaily }: PuzzleSolverProps) => {
    const [game, setGame] = useState(new Chess(puzzle.fen));
    const [moveIndex, setMoveIndex] = useState(0);
    const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
    const [status, setStatus] = useState<'playing' | 'failed' | 'solved'>('playing');
    const [lastMove, setLastMove] = useState<Move | null>(null);
    const [solveResult, setSolveResult] = useState<SolveResult | null>(null);
    const [startTime] = useState(Date.now());

    const playOpponentMove = (currentGame: Chess, nextIdx: number) => {
        if (nextIdx >= puzzle.solution.length) return;

        setTimeout(() => {
            const opponentMoveStr = puzzle.solution[nextIdx];
            const move = currentGame.move(opponentMoveStr);
            if (move) {
                setGame(new Chess(currentGame.fen()));
                setLastMove(move);
                setMoveIndex(nextIdx + 1);

                if (nextIdx + 1 >= puzzle.solution.length) {
                    setStatus('solved');
                    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
                    onSolve?.({ moves: puzzle.solution, timeSpent });
                }
            }
        }, 600);
    };

    // Start with the opponent's first move
    useEffect(() => {
        const initialGame = new Chess(puzzle.fen);
        setGame(initialGame);
        setMoveIndex(0);
        setSelectedSquare(null);
        setStatus('playing');
        setLastMove(null);
        setSolveResult(null);

        if (puzzle.solution.length > 0) {
            playOpponentMove(initialGame, 0);
        }
    }, [puzzle]);

    const studentColor = puzzle.turn === 'w' ? 'b' : 'w';

    const handleSquareClick = async (square: string) => {
        if (status !== 'playing') return;
        const sq = square as Square;

        if (selectedSquare) {
            try {
                const moveAttempt = {
                    from: selectedSquare,
                    to: sq,
                    promotion: 'q'
                };

                const expectedMoveStr = puzzle.solution[moveIndex];
                const tempGame = new Chess(game.fen());
                const move = tempGame.move(moveAttempt);

                if (move) {
                    const moveUci = move.from + move.to;
                    const expectedUci = expectedMoveStr.replace(/[^a-z0-9]/g, '');

                    if (moveUci === expectedUci || move.san === expectedMoveStr) {
                        const newGame = new Chess(game.fen());
                        newGame.move(moveAttempt);
                        setGame(newGame);
                        setLastMove(move);
                        const nextIdx = moveIndex + 1;
                        setMoveIndex(nextIdx);
                        setSelectedSquare(null);

                        if (nextIdx >= puzzle.solution.length) {
                            setStatus('solved');
                            const timeSpent = Math.floor((Date.now() - startTime) / 1000);

                            if (!isDaily) {
                                try {
                                    const result = await api.puzzles.solve(puzzle.id, puzzle.solution.join(' '));
                                    setSolveResult({
                                        ratingDelta: result.ratingDelta,
                                        newRating: result.newRating
                                    });
                                    toast.success(`¡Problema resuelto! ${result.ratingDelta >= 0 ? '+' : ''}${result.ratingDelta} pts`);
                                } catch (error) {
                                    console.error('Error saving progress:', error);
                                    toast.success("¡Excelente! Problema resuelto.");
                                }
                            }

                            onSolve?.({ moves: puzzle.solution, timeSpent });
                        } else {
                            playOpponentMove(newGame, nextIdx);
                        }
                    } else {
                        setStatus('failed');
                        toast.error("Movimiento incorrecto. Inténtalo de nuevo.");
                        setSelectedSquare(null);

                        if (isDaily) {
                            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
                            const dailyPuzzle = puzzle as DailyPuzzle;
                            try {
                                await api.puzzles.dailyAttempt({
                                    dailyPuzzleId: dailyPuzzle.dailyPuzzleId,
                                    moves: puzzle.solution.slice(0, moveIndex),
                                    solved: false,
                                    timeSpent
                                });
                            } catch (error) {
                                console.error('Error reporting attempt:', error);
                            }
                        }
                    }
                } else {
                    const piece = game.get(sq);
                    if (piece && piece.color === studentColor) {
                        setSelectedSquare(sq);
                    } else {
                        setSelectedSquare(null);
                    }
                }
            } catch (e) {
                setSelectedSquare(null);
            }
        } else {
            const piece = game.get(sq);
            if (piece && piece.color === studentColor) {
                setSelectedSquare(sq);
            }
        }
    };

    const resetPuzzle = () => {
        const initialGame = new Chess(puzzle.fen);
        setGame(initialGame);
        setMoveIndex(0);
        setSelectedSquare(null);
        setStatus('playing');
        setLastMove(null);
        if (puzzle.solution.length > 0) {
            playOpponentMove(initialGame, 0);
        }
    };

    const showHint = () => {
        if (status !== 'playing') return;
        const nextMove = puzzle.solution[moveIndex];
        const fromSq = nextMove.substring(0, 2) as Square;
        setSelectedSquare(fromSq);
        toast.info("Pista: Fíjate en la pieza resaltada.");
    };

    const boardData = game.board().map(row =>
        row.map(pc => pc ? (pc.color === 'w' ? pc.type.toUpperCase() : pc.type.toLowerCase()) : null)
    );

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="relative group">
                <ChessBoard
                    position={boardData}
                    size="lg"
                    selectedSquare={selectedSquare}
                    lastMove={lastMove ? { from: lastMove.from, to: lastMove.to } : null}
                    flipped={studentColor === 'b'}
                    className={cn(
                        "transition-all duration-300",
                        status === 'solved' && "shadow-[0_0_50px_rgba(34,197,94,0.3)] border-green-500/50",
                        status === 'failed' && "shadow-[0_0_50px_rgba(239,68,68,0.3)] border-red-500/50"
                    )}
                    interactive={status === 'playing'}
                    onSquareClick={handleSquareClick}
                />

                {status === 'solved' && (
                    <div className="absolute inset-0 z-40 bg-green-500/20 backdrop-blur-[2px] flex items-center justify-center rounded-lg animate-fade-in">
                        <div className="bg-background/90 p-4 rounded-2xl shadow-2xl border border-green-500/50 flex flex-col items-center gap-2 min-w-[200px]">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                            <span className="font-bold text-lg text-foreground">¡Completado!</span>
                            {solveResult && (
                                <div className="flex flex-col items-center animate-in slide-in-from-bottom-2 fade-in duration-500">
                                    <span className={cn("text-2xl font-black", solveResult.ratingDelta >= 0 ? "text-green-500" : "text-red-500")}>
                                        {solveResult.ratingDelta > 0 ? '+' : ''}{solveResult.ratingDelta}
                                    </span>
                                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                                        Nuevo ELO: {solveResult.newRating}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="absolute inset-0 z-40 bg-red-500/10 backdrop-blur-[1px] flex items-center justify-center rounded-lg animate-fade-in">
                        <div className="bg-background/90 p-4 rounded-2xl shadow-2xl border border-red-500/50 flex flex-col items-center gap-2">
                            <XCircle className="w-12 h-12 text-red-500" />
                            <Button variant="outline" size="sm" onClick={resetPuzzle}>Reintentar</Button>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-4 w-full max-w-md">
                <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={resetPuzzle} disabled={status === 'playing' && moveIndex <= 1}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reiniciar
                </Button>
                <Button variant="secondary" className="flex-1 h-12 rounded-xl" onClick={showHint} disabled={status !== 'playing'}>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Pista
                </Button>
            </div>

            <div className="w-full max-w-md space-y-4">
                <div className="p-4 rounded-xl bg-secondary/30 border border-border flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Progreso</span>
                        <span className="text-lg font-bold text-foreground">
                            {Math.floor((moveIndex / puzzle.solution.length) * 100)}%
                        </span>
                    </div>
                    <div className="flex gap-1">
                        {puzzle.solution.map((_, i) => (
                            <div key={i} className={cn("w-3 h-3 rounded-full border border-border", i < moveIndex ? "bg-primary border-primary" : "bg-transparent")} />
                        ))}
                    </div>
                </div>

                {(puzzle.tags?.length > 0 || puzzle.openingTags?.length > 0) && (
                    <div className="flex flex-wrap gap-2 justify-center">
                        {puzzle.tags?.slice(0, 5).map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-tight border border-primary/20">{tag}</span>
                        ))}
                        {puzzle.openingTags?.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-accent/10 text-accent rounded-full text-[10px] font-bold uppercase tracking-tight border border-accent/20">{tag}</span>
                        ))}
                    </div>
                )}

                {(puzzle.nbPlays || puzzle.popularity) && (
                    <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold tracking-widest px-1">
                        {puzzle.nbPlays && <span>Jugadas: {puzzle.nbPlays.toLocaleString()}</span>}
                        {puzzle.popularity !== undefined && <span>Popularidad: {puzzle.popularity}%</span>}
                    </div>
                )}
            </div>
        </div>
    );
};
