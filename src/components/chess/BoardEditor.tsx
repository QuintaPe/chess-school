import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PieceMap } from "./ChessPieces";
import { Trash2, RotateCcw, Play, History, ChevronRight, ChevronLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chess, Square, Move } from "chess.js";
import { motion, AnimatePresence } from "framer-motion";

interface Arrow {
    from: Square;
    to: Square;
}

interface BoardEditorProps {
    initialFen?: string;
    initialSolution?: string;
    initialRating?: number;
    onChange: (data: { fen: string; solution: string; rating: number }) => void;
    onSave?: () => void;
    isSaving?: boolean;
    saveLabel?: string;
}

export const BoardEditor = ({
    initialFen = "8/8/8/8/8/8/8/8 w - - 0 1",
    initialSolution = "",
    initialRating = 1500,
    onChange,
    onSave,
    isSaving = false,
    saveLabel = "Publicar Problema"
}: BoardEditorProps) => {
    const [step, setStep] = useState<1 | 2>(1);
    const [fen, setFen] = useState(initialFen);
    const [board, setBoard] = useState<(string | null)[][]>(() => parseFen(initialFen));
    const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
    const [turn, setTurn] = useState<'w' | 'b'>(initialFen.split(' ')[1] as 'w' | 'b' || 'w');
    const [flipped, setFlipped] = useState(initialFen.split(' ')[1] !== 'b');
    const [rating, setRating] = useState(initialRating);

    // Solution recording state
    const [recordedMoves, setRecordedMoves] = useState<string[]>(initialSolution ? initialSolution.split(',').map(s => s.trim()).filter(s => s) : []);
    const [solutionGame, setSolutionGame] = useState<Chess>(new Chess(initialFen));
    const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

    // Marking state
    const [markedSquares, setMarkedSquares] = useState<Set<Square>>(new Set());
    const [arrows, setArrows] = useState<Arrow[]>([]);
    const [rightClickStart, setRightClickStart] = useState<Square | null>(null);
    const boardRef = useRef<HTMLDivElement>(null);

    // Derived last move for highlighting
    const lastMove = useMemo(() => {
        const history = solutionGame.history({ verbose: true });
        return history.length > 0 ? history[history.length - 1] as Move : null;
    }, [solutionGame]);

    function parseFen(fenStr: string): (string | null)[][] {
        const [boardPart] = fenStr.split(' ');
        const rows = boardPart.split('/');
        const position: (string | null)[][] = [];

        for (const row of rows) {
            const boardRow: (string | null)[] = [];
            for (const char of row) {
                if (isNaN(parseInt(char))) {
                    boardRow.push(char);
                } else {
                    const emptyCount = parseInt(char);
                    for (let i = 0; i < emptyCount; i++) boardRow.push(null);
                }
            }
            position.push(boardRow);
        }
        return position;
    }

    function generateFen(boardState: (string | null)[][], turnColor: string) {
        let fenStr = "";
        for (let r = 0; r < 8; r++) {
            let empty = 0;
            for (let c = 0; c < 8; c++) {
                const piece = boardState[r][c];
                if (!piece) {
                    empty++;
                } else {
                    if (empty > 0) {
                        fenStr += empty;
                        empty = 0;
                    }
                    fenStr += piece;
                }
            }
            if (empty > 0) fenStr += empty;
            if (r < 7) fenStr += "/";
        }
        fenStr += ` ${turnColor} - - 0 1`;
        return fenStr;
    }

    // Effect to update parent
    useEffect(() => {
        const currentFen = step === 1 ? generateFen(board, turn) : fen;
        onChange({
            fen: currentFen,
            solution: recordedMoves.join(', '),
            rating
        });
    }, [board, turn, recordedMoves, rating, step, fen, onChange]);

    const handleSquareClick = (r: number, c: number) => {
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
        const sq = (files[c] + ranks[r]) as Square;

        // Clear markings on left click
        if (markedSquares.size > 0 || arrows.length > 0) {
            setMarkedSquares(new Set());
            setArrows([]);
        }

        if (step === 1) {
            const newBoard = board.map((row, ri) =>
                row.map((piece, ci) => {
                    if (ri === r && ci === c) {
                        if (!selectedPiece) return null;
                        return selectedPiece === piece ? null : selectedPiece;
                    }
                    return piece;
                })
            );
            setBoard(newBoard);
        } else {
            if (selectedSquare) {
                try {
                    const tempGame = new Chess(solutionGame.fen());
                    const move = tempGame.move({
                        from: selectedSquare,
                        to: sq,
                        promotion: 'q'
                    });

                    if (move) {
                        const newGame = new Chess(solutionGame.fen());
                        newGame.move({ from: selectedSquare, to: sq, promotion: 'q' });
                        setSolutionGame(newGame);
                        setRecordedMoves([...recordedMoves, move.san]);
                        setBoard(parseFen(newGame.fen().split(' ')[0]));
                        setSelectedSquare(null);
                    } else {
                        const piece = solutionGame.get(sq);
                        if (piece) setSelectedSquare(sq);
                        else setSelectedSquare(null);
                    }
                } catch (e) {
                    setSelectedSquare(null);
                }
            } else {
                const piece = solutionGame.get(sq);
                if (piece) setSelectedSquare(sq);
            }
        }
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    const handleRightMouseDown = (sq: Square) => {
        setRightClickStart(sq);
    };

    const handleRightMouseUp = (endSq: Square) => {
        if (!rightClickStart) return;

        if (rightClickStart === endSq) {
            // Toggle square highlight
            setMarkedSquares(prev => {
                const next = new Set(prev);
                if (next.has(endSq)) next.delete(endSq);
                else next.add(endSq);
                return next;
            });
        } else {
            // Toggle arrow
            setArrows(prev => {
                const exists = prev.findIndex(a => a.from === rightClickStart && a.to === endSq);
                if (exists !== -1) {
                    return prev.filter((_, i) => i !== exists);
                } else {
                    return [...prev, { from: rightClickStart, to: endSq }];
                }
            });
        }
        setRightClickStart(null);
    };

    const clearBoard = () => {
        setBoard(Array(8).fill(null).map(() => Array(8).fill(null)));
        setRecordedMoves([]);
        setMarkedSquares(new Set());
        setArrows([]);
    };

    const resetBoard = () => {
        const start = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        setBoard(parseFen(start));
        setRecordedMoves([]);
        setMarkedSquares(new Set());
        setArrows([]);
    };

    const undoMove = () => {
        if (recordedMoves.length > 0) {
            const tempGame = new Chess(solutionGame.fen());
            tempGame.undo();
            setSolutionGame(tempGame);
            setRecordedMoves(recordedMoves.slice(0, -1));
            setBoard(parseFen(tempGame.fen().split(' ')[0]));
        }
    };

    const goToStep2 = () => {
        const currentFen = generateFen(board, turn);
        setFen(currentFen);
        setSolutionGame(new Chess(currentFen));
        setStep(2);
        setMarkedSquares(new Set());
        setArrows([]);
    };

    const handleImportFen = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const content = event.target?.result as string;
            if (content && content.trim()) {
                const fenStr = content.trim();
                try {
                    const response = await api.puzzles.importFen(fenStr);
                    const finalFen = response.fen || fenStr;

                    setBoard(parseFen(finalFen));
                    setTurn(finalFen.split(' ')[1] as 'w' | 'b' || 'w');
                    setFen(finalFen);
                    setRecordedMoves([]);
                    toast.success("FEN importado correctamente desde el backend");
                } catch (e) {
                    try {
                        const chess = new Chess();
                        chess.load(fenStr);
                        setBoard(parseFen(fenStr));
                        setTurn(fenStr.split(' ')[1] as 'w' | 'b' || 'w');
                        setFen(fenStr);
                        setRecordedMoves([]);
                        toast.info("Importado localmente (Backend no disponible)");
                    } catch (err) {
                        toast.error("El formato del FEN no es válido");
                    }
                }
            }
        };
        reader.readAsText(file);
    };

    const triggerImport = () => {
        document.getElementById('fen-import-input')?.click();
    };

    const filesArr = useMemo(() => flipped ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], [flipped]);
    const ranksArr = useMemo(() => flipped ? ['1', '2', '3', '4', '5', '6', '7', '8'] : ['8', '7', '6', '5', '4', '3', '2', '1'], [flipped]);

    const screenRows = useMemo(() => {
        const rows = [0, 1, 2, 3, 4, 5, 6, 7];
        return flipped ? [...rows].reverse() : rows;
    }, [flipped]);

    const screenCols = useMemo(() => {
        const cols = [0, 1, 2, 3, 4, 5, 6, 7];
        return flipped ? [...cols].reverse() : cols;
    }, [flipped]);

    // Helper to get coordinates for arrows
    const getSqCoords = useCallback((sq: string) => {
        let col = sq.charCodeAt(0) - 97; // a=0, b=1...
        let row = 8 - parseInt(sq[1]); // 8=0, 7=1...

        if (flipped) {
            col = 7 - col;
            row = 7 - row;
        }

        return { x: col * 12.5 + 6.25, y: row * 12.5 + 6.25 };
    }, [flipped]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row gap-4 items-start">
                    {/* Chess Board */}
                    <div
                        className="flex-1 w-full aspect-square bg-[#312e2b] p-1.5 rounded-lg shadow-2xl relative min-h-[300px]"
                        onContextMenu={handleContextMenu}
                        ref={boardRef}
                    >
                        <div className="grid grid-cols-8 grid-rows-8 w-full h-full border border-[#403d39] overflow-hidden rounded-sm relative">
                            {screenRows.map((actualRow, screenY) =>
                                screenCols.map((actualCol, screenX) => {
                                    const isLight = (screenY + screenX) % 2 === 0;
                                    const piece = board[actualRow][actualCol];
                                    const PieceComponent = piece ? PieceMap[piece] : null;
                                    const sq = (filesArr[screenX] + ranksArr[screenY]) as Square;
                                    const isSelected = selectedSquare === sq;
                                    const isMarked = markedSquares.has(sq);

                                    // Highlight last move squares
                                    const isLastMoveSquare = lastMove && (lastMove.from === sq || lastMove.to === sq);

                                    return (
                                        <div
                                            key={`${screenY}-${screenX}`}
                                            onClick={() => handleSquareClick(actualRow, actualCol)}
                                            onMouseDown={(e) => e.button === 2 && handleRightMouseDown(sq)}
                                            onMouseUp={(e) => e.button === 2 && handleRightMouseUp(sq)}
                                            className={cn(
                                                "aspect-square flex items-center justify-center cursor-pointer transition-all relative",
                                                isLight ? "bg-[#ebecd0]" : "bg-[#779556]",
                                                isSelected && "bg-[#f5f682]/80 z-20",
                                                isLastMoveSquare && !isSelected && "bg-[#f5f682]/40",
                                                step === 2 && "hover:bg-[#f5f682]/20"
                                            )}
                                        >
                                            {/* Right-click highlight */}
                                            {isMarked && (
                                                <div className="absolute inset-0 bg-orange-500/50 z-0 ring-4 ring-orange-500/30 ring-inset" />
                                            )}

                                            <AnimatePresence mode="popLayout">
                                                {PieceComponent && (
                                                    <motion.div
                                                        key={`${piece}-${actualRow}-${actualCol}`}
                                                        initial={{ scale: 0.5, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        exit={{ scale: 0.5, opacity: 0 }}
                                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                                        className={cn(
                                                            "w-[90%] h-[90%] select-none filter drop-shadow-md z-10",
                                                            "cursor-grab active:cursor-grabbing"
                                                        )}
                                                        drag
                                                        dragSnapToOrigin
                                                        dragElastic={0.1}
                                                        onDragStart={() => {
                                                            if (selectedSquare !== sq) {
                                                                handleSquareClick(actualRow, actualCol);
                                                            }
                                                        }}
                                                        onDragEnd={(_, info) => {
                                                            const boardEl = boardRef.current;
                                                            if (!boardEl) return;
                                                            const rect = boardEl.getBoundingClientRect();
                                                            const squareSize = rect.width / 8;
                                                            const dx = Math.round(info.offset.x / squareSize);
                                                            const dy = Math.round(info.offset.y / squareSize);

                                                            if (dx !== 0 || dy !== 0) {
                                                                const targetScreenX = screenX + dx;
                                                                const targetScreenY = screenY + dy;
                                                                if (targetScreenX >= 0 && targetScreenX < 8 && targetScreenY >= 0 && targetScreenY < 8) {
                                                                    const tr = screenRows[targetScreenY];
                                                                    const tc = screenCols[targetScreenX];

                                                                    if (step === 1) {
                                                                        const movingPiece = board[actualRow][actualCol];
                                                                        const newBoard = board.map(row => [...row]);
                                                                        newBoard[actualRow][actualCol] = null;
                                                                        newBoard[tr][tc] = movingPiece;
                                                                        setBoard(newBoard);
                                                                    } else {
                                                                        handleSquareClick(tr, tc);
                                                                    }
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <PieceComponent />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Coordinate labels */}
                                            {screenX === 0 && (
                                                <span className={cn(
                                                    "absolute top-0.5 left-0.5 text-[8px] font-bold select-none",
                                                    isLight ? "text-[#779556]" : "text-[#ebecd0]"
                                                )}>
                                                    {ranksArr[screenY]}
                                                </span>
                                            )}
                                            {screenY === 7 && (
                                                <span className={cn(
                                                    "absolute bottom-0.5 right-0.5 text-[8px] font-bold select-none",
                                                    isLight ? "text-[#779556]" : "text-[#ebecd0]"
                                                )}>
                                                    {filesArr[screenX]}
                                                </span>
                                            )}

                                            {isSelected && !PieceComponent && (
                                                <motion.div
                                                    layoutId="selection-ring"
                                                    className="absolute inset-0 border-4 border-primary/50 z-0"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                />
                                            )}
                                        </div>
                                    );
                                })
                            )}

                            {/* Arrows Overlay */}
                            <svg
                                className="absolute inset-0 pointer-events-none w-full h-full z-30"
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                            >
                                <defs>
                                    <marker
                                        id="arrowhead"
                                        markerWidth="4"
                                        markerHeight="4"
                                        refX="2"
                                        refY="2"
                                        orient="auto"
                                    >
                                        <polygon points="0 0, 4 2, 0 4" fill="rgba(249, 115, 22, 0.8)" />
                                    </marker>
                                </defs>
                                {arrows.map((arrow, i) => {
                                    const from = getSqCoords(arrow.from);
                                    const to = getSqCoords(arrow.to);

                                    // Adjust 'to' point slightly to not hide under arrowhead
                                    const dx = to.x - from.x;
                                    const dy = to.y - from.y;
                                    const angle = Math.atan2(dy, dx);
                                    const length = Math.sqrt(dx * dx + dy * dy);
                                    const shorten = 3;
                                    const endX = from.x + (dx * (length - shorten) / length || 0);
                                    const endY = from.y + (dy * (length - shorten) / length || 0);

                                    return (
                                        <line
                                            key={i}
                                            x1={from.x}
                                            y1={from.y}
                                            x2={endX}
                                            y2={endY}
                                            stroke="rgba(249, 115, 22, 0.8)"
                                            strokeWidth="1.5"
                                            markerEnd="url(#arrowhead)"
                                        />
                                    );
                                })}
                            </svg>
                        </div>
                    </div>

                    {/* Right Sidebar: Pieces or Notation */}
                    <div className="w-full md:w-32 shrink-0 flex flex-col">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                /* Step 1: Pieces Selector */
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="grid grid-cols-6 md:grid-cols-2 gap-2"
                                >
                                    {[
                                        { type: 'P', side: 'w' }, { type: 'p', side: 'b' },
                                        { type: 'N', side: 'w' }, { type: 'n', side: 'b' },
                                        { type: 'B', side: 'w' }, { type: 'b', side: 'b' },
                                        { type: 'R', side: 'w' }, { type: 'r', side: 'b' },
                                        { type: 'Q', side: 'w' }, { type: 'q', side: 'b' },
                                        { type: 'K', side: 'w' }, { type: 'k', side: 'b' },
                                    ].map((p) => {
                                        const PC = PieceMap[p.type];
                                        const isSelected = selectedPiece === p.type;
                                        return (
                                            <motion.button
                                                key={p.type}
                                                type="button"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setSelectedPiece(p.type)}
                                                className={cn(
                                                    "aspect-square flex items-center justify-center rounded-lg border-2 transition-all duration-200 relative group overflow-hidden shadow-sm",
                                                    isSelected
                                                        ? "border-primary bg-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.2)]"
                                                        : "border-border/30 bg-secondary/10 hover:border-primary/40 hover:bg-secondary/20"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-[80%] h-[80%] transition-transform duration-300 group-hover:drop-shadow-lg",
                                                    isSelected && "drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]"
                                                )}>
                                                    <PC className="w-full h-full" />
                                                </div>
                                                {isSelected && (
                                                    <motion.div
                                                        layoutId="active-indicator"
                                                        className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-primary"
                                                    />
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                    <button
                                        type="button"
                                        onClick={() => setSelectedPiece(null)}
                                        className={cn(
                                            "col-span-2 md:col-span-2 aspect-auto h-9 md:h-10 flex items-center justify-center rounded-lg border-2 transition-all duration-200 gap-2 mt-1",
                                            selectedPiece === null
                                                ? "border-destructive/60 bg-destructive/10"
                                                : "border-border/30 bg-secondary/10 hover:border-destructive/30 hover:bg-destructive/5"
                                        )}
                                        title="Borrador"
                                    >
                                        <Trash2 className={cn("w-4 h-4", selectedPiece === null ? "text-destructive" : "text-muted-foreground")} />
                                        <span className={cn("text-[10px] font-bold uppercase tracking-tight", selectedPiece === null ? "text-destructive" : "text-muted-foreground")}>BORRAR</span>
                                    </button>
                                </motion.div>
                            ) : (
                                /* Step 2: NOTATION Sidebar */
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex-1 flex flex-col space-y-4 min-h-[300px]"
                                >
                                    <div className="flex items-center justify-between border-b border-border/50 pb-2">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                            <History className="w-4 h-4 text-primary" /> NOTACIÓN
                                        </h4>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 px-2 text-[9px] font-bold text-destructive hover:bg-destructive/10"
                                            onClick={undoMove}
                                            disabled={recordedMoves.length === 0}
                                        >
                                            DESHACER
                                        </Button>
                                    </div>

                                    <div className="flex-1 bg-[#1a1917] border border-border/40 rounded-xl p-3 overflow-y-auto font-mono text-[11px] max-h-[320px] shadow-inner custom-scrollbar">
                                        {recordedMoves.length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-8">
                                                <div className="w-12 h-12 rounded-full border-2 border-dashed border-muted-foreground mb-3 flex items-center justify-center animate-pulse">
                                                    <Play className="w-5 h-5 ml-1" />
                                                </div>
                                                <p className="text-[10px] italic leading-tight">Mueve las piezas para grabar la solución</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-y-1">
                                                {Array.from({ length: Math.ceil(recordedMoves.length / 2) }).map((_, i) => (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        key={i}
                                                        className="flex items-center justify-between border-b border-white/5 py-1.5 px-2 hover:bg-white/5 transition-colors rounded-md"
                                                    >
                                                        <span className="text-muted-foreground w-4 text-[9px]">{i + 1}.</span>
                                                        <span className="font-bold flex-1 text-center text-primary">{recordedMoves[i * 2]}</span>
                                                        <span className="font-medium text-muted-foreground flex-1 text-center">{recordedMoves[i * 2 + 1] || "..."}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* DOWN: SETTINGS & BUTTONS */}
                <div className="w-full border-t border-border/50 pt-6">
                    {step === 1 ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block ml-1">Turno</span>
                                    <div className="flex bg-secondary/30 p-1 rounded-xl border border-border/50 relative">
                                        <button
                                            type="button"
                                            onClick={() => { setTurn('w'); setFlipped(true); }}
                                            className={cn("flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all relative z-10", turn === 'w' ? "text-primary" : "text-muted-foreground")}
                                        >
                                            BLANCAS
                                            {turn === 'w' && <motion.div layoutId="turn-pill" className="absolute inset-0 bg-background rounded-lg -z-10 shadow-sm" />}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setTurn('b'); setFlipped(false); }}
                                            className={cn("flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all relative z-10", turn === 'b' ? "text-primary" : "text-muted-foreground")}
                                        >
                                            NEGRAS
                                            {turn === 'b' && <motion.div layoutId="turn-pill" className="absolute inset-0 bg-background rounded-lg -z-10 shadow-sm" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="step-rating" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Rating Estimado</Label>
                                    <Input
                                        id="step-rating"
                                        type="number"
                                        value={rating}
                                        onChange={(e) => setRating(parseInt(e.target.value) || 0)}
                                        className="h-10 text-xs bg-background/50 border-border/50 rounded-xl"
                                    />
                                </div>
                                <Button type="button" variant="outline" size="sm" onClick={resetBoard} className="h-10 text-[10px] font-bold border-border/50 rounded-xl hover:bg-secondary/50">
                                    <RotateCcw className="w-4 h-4 mr-2" /> REINICIAR
                                </Button>
                                <Button type="button" variant="outline" size="sm" onClick={clearBoard} className="h-10 text-[10px] font-bold border-border/50 rounded-xl text-destructive hover:bg-destructive/10">
                                    <Trash2 className="w-4 h-4 mr-2" /> VACIAR
                                </Button>
                                <Button type="button" variant="hero" size="sm" onClick={triggerImport} className="h-10 text-[10px] font-bold md:col-span-2 rounded-xl">
                                    <Play className="w-3 h-3 mr-2 rotate-90" /> IMPORTAR FEN
                                </Button>
                            </div>

                            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                                <Button type="button" variant="hero" className="w-full h-12 text-sm group rounded-xl shadow-lg shadow-primary/10 overflow-hidden relative" onClick={goToStep2}>
                                    <span className="relative z-10 flex items-center">
                                        Siguiente: Grabar Solución
                                        <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                                    </span>
                                    <motion.div
                                        className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"
                                        initial={false}
                                    />
                                </Button>
                            </motion.div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <motion.div className="md:col-span-3" whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }}>
                                <Button
                                    type="button"
                                    variant="hero"
                                    className="w-full h-14 text-base flex items-center justify-center gap-3 rounded-xl shadow-xl shadow-primary/15"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onSave?.();
                                    }}
                                    disabled={isSaving || recordedMoves.length === 0}
                                >
                                    {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                                    {saveLabel}
                                </Button>
                            </motion.div>

                            <Button type="button" variant="outline" className="h-14 text-xs group rounded-xl border-border/50" onClick={() => setStep(1)}>
                                <ChevronLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                                VOLVER
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <input
                id="fen-import-input"
                type="file"
                accept=".fen"
                onChange={handleImportFen}
                className="hidden"
            />
        </div>
    );
};
