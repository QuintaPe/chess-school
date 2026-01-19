import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChessBoard } from "@/components/chess/ChessBoard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import {
    Users,
    MessageSquare,
    Video,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Clock,
    RotateCcw,
    Mic,
    MicOff,
    VideoOff,
    Settings,
    Share2,
    Loader2,
    Brain,
    Crown,
    UserCircle,
    Hand
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";
import { Chess, Square } from "chess.js";
import { useStockfish } from "@/hooks/useStockfish";
import { EvaluationBar } from "@/components/chess/EvaluationBar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Participant {
    socketId: string;
    userId: string;
    name: string;
    role: string;
    hasControl: boolean;
}

const LiveClassSession = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    const [moves, setMoves] = useState<{ num: number; white: string; black: string }[]>([]);
    const [history, setHistory] = useState<string[]>(["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [isEngineEnabled, setIsEngineEnabled] = useState(false);
    const initializationRef = useRef(false);
    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);

    const { data: clase, isLoading } = useQuery({
        queryKey: ["class-detail", id],
        queryFn: () => api.classes.get(id!),
        enabled: !!id,
        staleTime: Infinity
    });

    const isTeacher = user?.role === 'teacher' || user?.role === 'admin' || user?.id === clase?.teacher_id;
    const engineResult = useStockfish(history[historyIndex] || fen, isEngineEnabled && isTeacher);

    // Derived state: Do I have control?
    const myParticipantInfo = participants.find(p => p.socketId === socketRef.current?.id);
    const iHaveControl = isTeacher || myParticipantInfo?.hasControl;

    useEffect(() => {
        if (clase && !initializationRef.current) {
            const initialFen = (clase.platform === 'discord' && clase.video_url && !clase.video_url.startsWith('http'))
                ? clase.video_url
                : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

            setFen(initialFen);
            setHistory([initialFen]);
            setHistoryIndex(0);
            initializationRef.current = true;
        }
    }, [clase]);

    useEffect(() => {
        if (!id || !user) return;

        console.log('Iniciando conexión Socket.io en:', API_URL);
        const socket = io(API_URL, {
            auth: { token: localStorage.getItem('token') }
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Socket conectado con ID:', socket.id);
            const token = localStorage.getItem('token');
            socket.emit('join-class', { classId: id, token });
        });

        socket.on('move', (data: { move: string, fen: string, turn: string, fromIndex: number, newMoves?: any[] }) => {
            console.log('Recibido movimiento:', data);
            setFen(data.fen);
            setHistory(prev => {
                const truncatedHistory = prev.slice(0, data.fromIndex + 1);
                const newHistory = [...truncatedHistory, data.fen];
                setHistoryIndex(newHistory.length - 1);
                return newHistory;
            });

            if (data.newMoves) {
                setMoves(data.newMoves);
            } else {
                setMoves(prev => {
                    const last = prev[prev.length - 1];
                    if (last && !last.black) {
                        return [...prev.slice(0, -1), { ...last, black: data.move }];
                    } else {
                        return [...prev, { num: prev.length + 1, white: data.move, black: "" }];
                    }
                });
            }
        });

        socket.on('nav-change', (data: { index: number }) => {
            console.log('Recibido cambio de navegación:', data.index);
            setHistoryIndex(data.index);
        });

        socket.on('participants-update', (data: Participant[]) => {
            console.log('Participantes actualizados:', data);
            setParticipants(data);
        });

        socket.on('initial-state', (state: { fen: string, turn: string, moves: any[], history: string[] }) => {
            console.log('Estado inicial recibido:', state);
            if (state.fen) setFen(state.fen);
            if (state.history) {
                setHistory(state.history);
                setHistoryIndex(state.history.length - 1);
            }
            if (state.moves) setMoves(state.moves);
        });

        return () => {
            console.log('Desconectando socket');
            socket.disconnect();
        };
    }, [id, user]);

    const handleNavigation = (index: number) => {
        if (!isTeacher) return;
        const newIndex = Math.max(0, Math.min(history.length - 1, index));
        console.log('Profesor navegando a:', newIndex);
        setHistoryIndex(newIndex);
        socketRef.current?.emit('nav-change', { classId: id, index: newIndex });
    };

    const handleGrantControl = (targetSocketId: string) => {
        if (!isTeacher) return;
        socketRef.current?.emit('grant-control', { classId: id, targetSocketId });
        toast.success("Control otorgado al alumno");
    };

    const handleRevokeControl = (targetSocketId: string) => {
        if (!isTeacher) return;
        socketRef.current?.emit('revoke-control', { classId: id, targetSocketId });
        toast.info("Control revocado");
    };

    const handleSquareClick = (square: string) => {
        // Allow move if I am teacher OR I have control
        if (!iHaveControl) return;

        if (!selectedSquare) {
            setSelectedSquare(square);
        } else {
            const currentFen = history[historyIndex];
            const game = new Chess(currentFen);
            try {
                const move = game.move({
                    from: selectedSquare as Square,
                    to: square as Square,
                    promotion: 'q'
                });

                if (move) {
                    const newFen = game.fen();
                    console.log('Movimiento realizado:', move.san, 'desde índice:', historyIndex);

                    // Truncar historial y movimientos si estamos en una rama
                    const nextHistory = [...history.slice(0, historyIndex + 1), newFen];
                    const nextIndex = nextHistory.length - 1;

                    let nextMoves: any[] = [];
                    setMoves(prev => {
                        const baseMoves = prev.slice(0, Math.floor((historyIndex + 1) / 2));
                        if ((historyIndex) % 2 === 0) {
                            nextMoves = [...baseMoves, { num: baseMoves.length + 1, white: move.san, black: "" }];
                        } else {
                            const lastPair = baseMoves[baseMoves.length - 1];
                            nextMoves = [...baseMoves.slice(0, -1), { ...lastPair, black: move.san }];
                        }
                        return nextMoves;
                    });

                    setHistory(nextHistory);
                    setHistoryIndex(nextIndex);
                    setFen(newFen);

                    socketRef.current?.emit('move', {
                        classId: id,
                        move: move.san,
                        fen: newFen,
                        turn: game.turn(),
                        fromIndex: historyIndex,
                        newMoves: nextMoves
                    });

                    // Only teacher sets navigation for everyone usually, but if student takes control, 
                    // ideally they should also navigation-sync everyone to follow their move.
                    socketRef.current?.emit('nav-change', { classId: id, index: nextIndex });
                }
            } catch (e) {
                if (selectedSquare !== square) {
                    setSelectedSquare(square);
                    return;
                }
            }
            setSelectedSquare(null);
        }
    };

    const handleExit = () => {
        // Stop any playing audio/stream if necessary
        if (user?.role === 'admin' || user?.role === 'teacher') {
            navigate("/admin");
        } else {
            navigate("/dashboard/clases");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!clase) return null;

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <div className="h-[100dvh] flex flex-col overflow-hidden bg-background">
                {/* Top bar */}
                <div className="bg-card border-b border-border p-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={handleExit} className="hover:bg-destructive/10 hover:text-destructive transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-bold text-foreground leading-none">{clase.title}</h1>
                                <Badge variant="destructive" className="animate-pulse px-1.5 h-5 text-[10px]">
                                    EN VIVO
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Profesor: {clase.teacher_name || 'Admin'} • {clase.level}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="hidden md:flex items-center gap-2 mr-4 px-3 py-1.5 bg-secondary/50 rounded-full border border-border">
                            <Users className="w-4 h-4 text-green-500" />
                            <span className="text-xs font-medium">{participants.length} Conectados</span>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Share2 className="w-4 h-4" />
                            Compartir
                        </Button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                    {/* Left Sidebar */}
                    <div className="hidden xl:flex w-80 border-r border-border bg-card/50 flex-col overflow-hidden">
                        <Tabs defaultValue="notation" className="flex-1 flex flex-col">
                            <div className="p-2 border-b border-border">
                                <TabsList className="w-full grid grid-cols-2">
                                    <TabsTrigger value="notation">Notación</TabsTrigger>
                                    <TabsTrigger value="participants">Participantes</TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="notation" className="flex-1 flex flex-col m-0 overflow-hidden">
                                <div className="p-4 border-b border-border">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Historial</h3>
                                    <div className="space-y-1 max-h-60 overflow-y-auto custom-scrollbar">
                                        {moves.map((m) => (
                                            <div key={m.num} className="grid grid-cols-3 text-sm py-1 hover:bg-secondary/50 rounded px-2 transition-colors cursor-pointer">
                                                <span className="text-muted-foreground font-mono">{m.num}.</span>
                                                <span className="font-bold text-foreground">{m.white}</span>
                                                <span className="font-medium text-foreground/80">{m.black}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <ScrollArea className="flex-1 p-4">
                                    {isTeacher && (
                                        <div className="space-y-4 mb-6">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Análisis Stockfish</h3>
                                                <Button
                                                    variant={isEngineEnabled ? "hero" : "outline"}
                                                    size="sm"
                                                    className="h-7 text-[10px] gap-1 px-2"
                                                    onClick={() => setIsEngineEnabled(!isEngineEnabled)}
                                                >
                                                    <Brain className="w-3 h-3" />
                                                    {isEngineEnabled ? "ON" : "OFF"}
                                                </Button>
                                            </div>

                                            {isEngineEnabled && engineResult && (
                                                <Card className="p-3 bg-primary/5 border-primary/20 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Evaluación</span>
                                                        <Badge variant={engineResult.evaluation >= 0 ? "secondary" : "destructive"} className="text-[10px] h-4">
                                                            {engineResult.evaluation > 0 ? `+${engineResult.evaluation.toFixed(2)}` : engineResult.evaluation.toFixed(2)}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Mejor jugada</span>
                                                        <span className="text-xs font-mono font-bold text-primary">{engineResult.bestMove}</span>
                                                    </div>
                                                    <div className="space-y-1 border-t border-border/50 pt-2">
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Línea sugerida</span>
                                                        <div className="flex flex-wrap gap-1">
                                                            {engineResult.bestLine.slice(0, 5).map((m, i) => (
                                                                <Badge key={i} variant="outline" className="text-[8px] px-1 py-0 h-4 font-mono">{m}</Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </Card>
                                            )}
                                        </div>
                                    )}
                                </ScrollArea>
                            </TabsContent>

                            <TabsContent value="participants" className="flex-1 overflow-hidden m-0">
                                <ScrollArea className="h-full p-4">
                                    <div className="space-y-3">
                                        {participants.map((p) => (
                                            <div key={p.socketId} className="flex items-center justify-between p-2 rounded-lg bg-card border border-border hover:bg-accent/50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                                        {p.role === 'teacher' ? <Crown className="w-4 h-4 text-yellow-500" /> : <UserCircle className="w-4 h-4 text-primary" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold leading-none">{p.name || `Usuario ${p.userId}`}</p>
                                                        <p className="text-[10px] text-muted-foreground">{p.role === 'teacher' ? 'Profesor' : 'Alumno'}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {p.hasControl && (
                                                        <Badge variant="outline" className="border-green-500/50 text-green-500 text-[10px] px-1 h-5 gap-1">
                                                            <Hand className="w-3 h-3" /> Control
                                                        </Badge>
                                                    )}

                                                    {isTeacher && p.role !== 'teacher' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7"
                                                            title={p.hasControl ? "Quitar control" : "Dar control"}
                                                            onClick={() => p.hasControl ? handleRevokeControl(p.socketId) : handleGrantControl(p.socketId)}
                                                        >
                                                            <Hand className={`w-4 h-4 ${p.hasControl ? 'text-green-500 fill-green-500/20' : 'text-muted-foreground'}`} />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {participants.length === 0 && (
                                            <div className="text-center py-8 text-muted-foreground text-xs">
                                                Esperando participantes...
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Center - Board Area */}
                    <div className="flex-1 bg-background relative flex flex-col items-center justify-center p-4 lg:p-8 overflow-y-auto custom-scrollbar border-r border-border">
                        <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center font-bold text-primary border border-border text-xs">
                                        {clase.teacher_name?.substring(0, 2).toUpperCase() || "P"}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{clase.teacher_name || 'Profesor'}</p>
                                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Transmitiendo clase
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-black/40 px-3 py-1 rounded font-mono text-xl border border-white/10">15:00</div>
                            </div>

                            <div className="flex items-center gap-4">
                                {isTeacher && isEngineEnabled && engineResult && (
                                    <div className="h-[400px] lg:h-[500px] py-2">
                                        <EvaluationBar evaluation={engineResult.evaluation} />
                                    </div>
                                )}

                                <div className="flex-1 flex flex-col items-center">
                                    <ChessBoard
                                        size="lg"
                                        interactive={iHaveControl}
                                        className="shadow-[0_0_50px_rgba(var(--primary-rgb),0.2)]"
                                        fen={history[historyIndex]}
                                        onSquareClick={handleSquareClick}
                                        selectedSquare={selectedSquare as Square}
                                    />

                                    {/* Control UI */}
                                    {isTeacher ? (
                                        <div className="mt-6 flex items-center gap-2">
                                            <Button variant="outline" size="icon" className="w-10 h-10" onClick={() => handleNavigation(0)} disabled={historyIndex <= 0}>
                                                <ChevronsLeft className="w-5 h-5" />
                                            </Button>
                                            <Button variant="outline" size="icon" className="w-10 h-10" onClick={() => handleNavigation(historyIndex - 1)} disabled={historyIndex <= 0}>
                                                <ChevronLeft className="w-5 h-5" />
                                            </Button>
                                            <div className="px-5 py-2 bg-secondary/50 rounded-lg border border-border min-w-[120px] text-center">
                                                {historyIndex === history.length - 1 ? (
                                                    <span className="text-primary font-bold text-xs flex items-center justify-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" /> LIVE
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Paso {historyIndex}</span>
                                                )}
                                            </div>
                                            <Button variant="outline" size="icon" className="w-10 h-10" onClick={() => handleNavigation(historyIndex + 1)} disabled={historyIndex >= history.length - 1}>
                                                <ChevronRight className="w-5 h-5" />
                                            </Button>
                                            <Button variant="outline" size="icon" className="w-10 h-10" onClick={() => handleNavigation(history.length - 1)} disabled={historyIndex >= history.length - 1}>
                                                <ChevronsRight className="w-5 h-5" />
                                            </Button>
                                            <div className="w-px h-6 bg-border mx-2" />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="w-10 h-10 text-muted-foreground hover:text-primary"
                                                onClick={() => {
                                                    const startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
                                                    setFen(startFen);
                                                    setHistory([startFen]);
                                                    setHistoryIndex(0);
                                                    setMoves([]);
                                                    socketRef.current?.emit('move', { classId: id, move: "RESET", fen: startFen, turn: "w", fromIndex: -1, newMoves: [] });
                                                    socketRef.current?.emit('nav-change', { classId: id, index: 0 });
                                                }}
                                            >
                                                <RotateCcw className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <>
                                            {iHaveControl ? (
                                                <div className="mt-6 px-6 py-2 bg-green-500/10 rounded-full border border-green-500/50 text-[10px] text-green-500 font-bold uppercase tracking-widest flex items-center gap-2 animate-pulse">
                                                    <Hand className="w-4 h-4" />
                                                    ¡Tienes el control del tablero!
                                                </div>
                                            ) : (
                                                <div className="mt-6 px-6 py-2 bg-primary/5 rounded-full border border-primary/20 text-[10px] text-primary font-bold uppercase tracking-widest flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                                    Sincronizado con el profesor - Esperando turno
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded bg-primary flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20 text-xs">
                                        {user?.name?.substring(0, 2).toUpperCase() || "TU"}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Tú ({user?.role === 'teacher' ? 'Profesor' : 'Alumno'})</p>
                                        <p className="text-[10px] text-muted-foreground">{iHaveControl ? 'Controlando tablero' : 'Observando sesión'}</p>
                                    </div>
                                </div>
                                <div className="bg-black/40 px-3 py-1 rounded font-mono text-xl border border-white/10 text-muted-foreground">15:00</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Discord */}
                    <div className="w-full lg:w-80 2xl:w-96 bg-card/80 flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-border bg-[#5865F2]/10 flex items-center gap-2 text-[#5865F2]">
                            <MessageSquare className="w-5 h-5 fill-current" />
                            <span className="font-bold text-xs uppercase tracking-widest">Chat de Discord</span>
                        </div>
                        <div className="flex-1 relative">
                            <iframe
                                src={`https://e.widgetbot.io/channels/1462031975043960864/1462031975773896801?username=${encodeURIComponent(user?.name || 'Estudiante')}`}
                                className="w-full h-full border-0"
                                title="Discord Chat"
                                allow="clipboard-write; camera; microphone; geolocation"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveClassSession;
