
import { useState, useEffect, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from './ChessBoard';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    ChevronLeft,
    ChevronRight,
    Play,
    Pause,
    RotateCcw,
    SkipBack,
    SkipForward,
    List
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface PGNViewerProps {
    pgnContent: string;
}

interface ParsedGame {
    index: number;
    white: string;
    black: string;
    result: string;
    pgn: string;
    headers: Record<string, string>;
    title?: string;
}

export const PGNViewer = ({ pgnContent }: PGNViewerProps) => {
    const [games, setGames] = useState<ParsedGame[]>([]);
    const [selectedGameIndex, setSelectedGameIndex] = useState<number>(0);
    const [game, setGame] = useState<Chess>(new Chess());
    const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [history, setHistory] = useState<any[]>([]); // Verbose moves

    const playInterval = useRef<NodeJS.Timeout | null>(null);

    // Helper to split PGNs
    const parsePGNs = (content: string): ParsedGame[] => {
        // Basic splitting by [Event "
        // This is a naive implementation, might need robustness
        const rawGames = content.split(/(?=\[Event ")/g).filter(g => g.trim().length > 0);

        return rawGames.map((raw, idx) => {
            const tempGame = new Chess();
            try {
                tempGame.loadPgn(raw);
                const headers = tempGame.header();
                return {
                    index: idx,
                    white: headers['White'] || '?',
                    black: headers['Black'] || '?',
                    result: headers['Result'] || '*',
                    pgn: raw,
                    headers,
                    title: headers['Event'] && headers['Event'] !== '?' ? headers['Event'] : `Game ${idx + 1}`
                };
            } catch (e) {
                console.error("Error parsing game index", idx, e);
                return {
                    index: idx,
                    white: '?',
                    black: '?',
                    result: '*',
                    pgn: raw,
                    headers: {},
                    title: `Game ${idx + 1} (Error parsing)`
                };
            }
        });
    };

    useEffect(() => {
        if (pgnContent) {
            const parsed = parsePGNs(pgnContent);
            setGames(parsed);
            if (parsed.length > 0) {
                loadGame(parsed[0]);
            }
        }
    }, [pgnContent]);

    const loadGame = (parsedGame: ParsedGame) => {
        const newGame = new Chess();
        try {
            newGame.loadPgn(parsedGame.pgn);
            setGame(newGame);
            setHistory(newGame.history({ verbose: true })); // Load verbose history

            // Reset to start of game for viewing
            // To do this, we re-create the game object at the start position
            // But we need the history. loadPgn loads it to the END.

            // Wait, creating a game with PGN puts it at the end.
            // We want to navigate.
            // So we keep the "full game" state to know moves, 
            // but the "display game" state to show the board.

            // Actually simplest: reset the game instance to start, 
            // and replay moves up to currentMoveIndex.

            // But loadPgn might set up a custom FEN! We must respect that.
            // newGame.header() gives headers.
            // loading PGN sets the FEN to the end position? No, it sets internal history.

            setCurrentMoveIndex(-1); // Start position
            setIsPlaying(false);
        } catch (e) {
            console.error("Failed to load game", e);
        }
    };

    // When selectedGameIndex changes
    useEffect(() => {
        if (games.length > 0 && games[selectedGameIndex]) {
            loadGame(games[selectedGameIndex]);
        }
    }, [selectedGameIndex, games]);

    // Derived state for the board position
    const getCurrentPosition = useCallback(() => {
        // Create a temp game to replay moves
        const tempGame = new Chess();

        // Check if the current game has a custom initial position (FEN) header
        // But 'game' object already has the moves and headers loaded.
        // However, to get the board at move X, we need to replay.

        // Optimization: we could cache this or use the 'game' object's undo/move methods?
        // Using undo/move on the main state object is risky if we want 'history' to be stable.

        // Better: Helper function to get FEN at index
        // If we use the main 'game' instance, we can't easily jump around without mutating it.
        // So we use a temp instance.

        // If the PGN had a SetUp/FEN tag, chess.js loadPgn handles it.
        // We need that initial setup.
        if (games[selectedGameIndex]) {
            const headers = games[selectedGameIndex].headers;
            if (headers['SetUp'] === '1' && headers['FEN']) {
                tempGame.load(headers['FEN']);
            }
        }

        // Apply moves using the verbose history objects
        for (let i = 0; i <= currentMoveIndex; i++) {
            if (history[i]) {
                tempGame.move(history[i]); // chess.js move() accepts the move object from verbose history
            }
        }

        return toBoardBoard(tempGame.board());
    }, [currentMoveIndex, history, selectedGameIndex, games]);

    const getLastMoveSquares = () => {
        if (currentMoveIndex >= 0 && history[currentMoveIndex]) {
            const move = history[currentMoveIndex];
            return [move.from, move.to];
        }
        return [];
    };

    // Convert chess.js board to (string | null)[][]
    const toBoardBoard = (chessBoard: ({ square: any; type: any; color: any } | null)[][]) => {
        return chessBoard.map(row =>
            row.map(pc => {
                if (!pc) return null;
                return pc.color === 'w' ? pc.type.toUpperCase() : pc.type.toLowerCase();
            })
        );
    };

    useEffect(() => {
        if (isPlaying) {
            playInterval.current = setInterval(() => {
                setCurrentMoveIndex(prev => {
                    if (prev < history.length - 1) return prev + 1;
                    setIsPlaying(false);
                    return prev;
                });
            }, 1000); // 1 second per move
        } else {
            if (playInterval.current) clearInterval(playInterval.current);
        }
        return () => {
            if (playInterval.current) clearInterval(playInterval.current);
        };
    }, [isPlaying, history]);

    // Navigation handlers
    const goFirst = () => setCurrentMoveIndex(-1);
    const goPrev = () => setCurrentMoveIndex(p => Math.max(-1, p - 1));
    const goNext = () => setCurrentMoveIndex(p => Math.min(history.length - 1, p + 1));
    const goLast = () => setCurrentMoveIndex(history.length - 1);
    const togglePlay = () => setIsPlaying(p => !p);

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[80vh]">
            {/* Game List Sidebar */}
            <Card className="flex flex-col w-full lg:w-1/4 bg-card/50 backdrop-blur-sm border-white/10">
                <div className="p-4 border-b border-white/10 bg-muted/20">
                    <h3 className="font-bold flex items-center gap-2">
                        <List className="h-4 w-4" />
                        Partidas / Ejemplos
                    </h3>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-1">
                        {games.map((g, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedGameIndex(idx)}
                                className={cn(
                                    "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                                    selectedGameIndex === idx
                                        ? "bg-primary text-primary-foreground font-medium"
                                        : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <div className="flex justify-between">
                                    <span className="truncate">{g.title || `Ejemplo ${idx + 1}`}</span>
                                </div>
                                {(g.white !== '?' || g.black !== '?') && (
                                    <div className="text-xs opacity-70 truncate">
                                        {g.white} vs {g.black}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </Card>

            {/* Main Board Area */}
            <Card className="flex-1 flex flex-col md:flex-row gap-6 p-6 bg-card/50 backdrop-blur-sm border-white/10 items-center justify-center">

                {/* Board */}
                <div className="flex flex-col items-center gap-4">
                    <ChessBoard
                        position={getCurrentPosition()}
                        size="lg" // existing prop
                        interactive={false}
                        highlightSquares={getLastMoveSquares()}
                    />

                    {/* Controls */}
                    <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-full border border-white/5">
                        <Button variant="ghost" size="icon" onClick={goFirst} disabled={currentMoveIndex === -1}>
                            <SkipBack className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={goPrev} disabled={currentMoveIndex === -1}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={togglePlay}>
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={goNext} disabled={currentMoveIndex === history.length - 1}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={goLast} disabled={currentMoveIndex === history.length - 1}>
                            <SkipForward className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Moves / Info Panel */}
                <div className="flex-1 h-full min-h-[300px] flex flex-col gap-4 w-full max-w-sm">
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-foreground">
                            {games[selectedGameIndex]?.title}
                        </h2>
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{games[selectedGameIndex]?.white}</span>
                            <span className="font-mono">{games[selectedGameIndex]?.result}</span>
                            <span>{games[selectedGameIndex]?.black}</span>
                        </div>
                    </div>

                    <Separator className="bg-white/10" />

                    {/* Move List */}
                    <ScrollArea className="flex-1 bg-muted/10 rounded-lg p-4 border border-white/5 h-[300px]">
                        <div className="grid grid-cols-[3rem_1fr_1fr] gap-y-1 text-sm">
                            {(() => {
                                const movesRaw = history;
                                const rows = [];
                                for (let i = 0; i < movesRaw.length; i += 2) {
                                    rows.push(
                                        <div key={i} className="contents group">
                                            <div className="text-muted-foreground p-1 text-right  bg-transparent">
                                                {i / 2 + 1}.
                                            </div>
                                            <button
                                                className={cn(
                                                    "p-1 text-left hover:bg-white/10 rounded px-2 transition-colors",
                                                    currentMoveIndex === i && "bg-primary/20 text-primary font-bold"
                                                )}
                                                onClick={() => setCurrentMoveIndex(i)}
                                            >
                                                {movesRaw[i].san}
                                            </button>
                                            <button
                                                className={cn(
                                                    "p-1 text-left hover:bg-white/10 rounded px-2 transition-colors",
                                                    movesRaw[i + 1] ? "" : "pointer-events-none",
                                                    currentMoveIndex === i + 1 && "bg-primary/20 text-primary font-bold"
                                                )}
                                                onClick={() => movesRaw[i + 1] && setCurrentMoveIndex(i + 1)}
                                            >
                                                {movesRaw[i + 1]?.san || ''}
                                            </button>
                                        </div>
                                    );
                                }
                                return rows;
                            })()}
                        </div>
                    </ScrollArea>
                </div>

            </Card>
        </div>
    );
};
