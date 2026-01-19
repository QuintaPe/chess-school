import { useState, useCallback, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { PieceMap } from "./ChessPieces";
import { motion, AnimatePresence } from "framer-motion";
import { Square } from "chess.js";

interface Arrow {
  from: Square;
  to: Square;
}

interface ChessPiece {
  type: 'K' | 'Q' | 'R' | 'B' | 'N' | 'P' | 'k' | 'q' | 'r' | 'b' | 'n' | 'p' | null;
}

const initialPosition: (string | null)[][] = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
];

interface ChessBoardProps {
  position?: (string | null)[][];
  fen?: string;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showCoordinates?: boolean;
  className?: string;
  selectedSquare?: Square | null;
  lastMove?: { from: string; to: string } | null;
  flipped?: boolean;
  onSquareClick?: (square: Square) => void;
}

const parseFen = (fen: string): (string | null)[][] => {
  if (!fen) return initialPosition;
  const [boardPart] = fen.split(' ');
  if (!boardPart) return initialPosition;

  const rows = boardPart.split('/');
  if (rows.length !== 8) return initialPosition;

  const position: (string | null)[][] = [];
  for (const row of rows) {
    const boardRow: (string | null)[] = [];
    for (const char of row) {
      if (isNaN(parseInt(char))) {
        boardRow.push(char);
      } else {
        const emptyCount = parseInt(char);
        for (let i = 0; i < emptyCount; i++) {
          boardRow.push(null);
        }
      }
    }
    // Si la fila no tiene 8 columnas, algo va mal
    if (boardRow.length !== 8) return initialPosition;
    position.push(boardRow);
  }

  return position;
};

export const ChessBoard = ({
  position,
  fen,
  interactive = false,
  size = 'md',
  showCoordinates = true,
  className,
  selectedSquare,
  lastMove,
  flipped = false,
  onSquareClick,
}: ChessBoardProps) => {
  const [markedSquares, setMarkedSquares] = useState<Set<Square>>(new Set());
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [rightClickStart, setRightClickStart] = useState<Square | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const boardPosition = useMemo(() => {
    if (fen) return parseFen(fen);
    return position || initialPosition;
  }, [fen, position]);

  const files = useMemo(() => flipped ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], [flipped]);
  const ranks = useMemo(() => flipped ? ['1', '2', '3', '4', '5', '6', '7', '8'] : ['8', '7', '6', '5', '4', '3', '2', '1'], [flipped]);

  const boardWidthClasses = {
    sm: 'max-w-[300px]',
    md: 'max-w-[500px]',
    lg: 'max-w-[600px]',
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
      setMarkedSquares(prev => {
        const next = new Set(prev);
        if (next.has(endSq)) next.delete(endSq);
        else next.add(endSq);
        return next;
      });
    } else {
      setArrows(prev => {
        const exists = prev.findIndex(a => a.from === rightClickStart && a.to === endSq);
        if (exists !== -1) return prev.filter((_, i) => i !== exists);
        return [...prev, { from: rightClickStart, to: endSq }];
      });
    }
    setRightClickStart(null);
  };

  const clearMarkings = useCallback(() => {
    if (markedSquares.size > 0 || arrows.length > 0) {
      setMarkedSquares(new Set());
      setArrows([]);
    }
  }, [markedSquares.size, arrows.length]);

  const getSqCoords = useCallback((sq: string) => {
    let col = sq.charCodeAt(0) - 97; // a=0
    let row = 8 - parseInt(sq[1]); // 8=0

    if (flipped) {
      col = 7 - col;
      row = 7 - row;
    }

    return { x: col * 12.5 + 6.25, y: row * 12.5 + 6.25 };
  }, [flipped]);

  const screenRows = useMemo(() => {
    const rows = [0, 1, 2, 3, 4, 5, 6, 7];
    return flipped ? [...rows].reverse() : rows;
  }, [flipped]);

  const screenCols = useMemo(() => {
    const cols = [0, 1, 2, 3, 4, 5, 6, 7];
    return flipped ? [...cols].reverse() : cols;
  }, [flipped]);

  return (
    <div
      className={cn(
        "w-full aspect-square bg-[#312e2b] p-1.5 rounded-lg shadow-2xl relative select-none",
        boardWidthClasses[size],
        className
      )}
      onContextMenu={handleContextMenu}
      ref={boardRef}
    >
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full border border-[#403d39] overflow-hidden rounded-sm relative bg-[#779556]">
        {screenRows.map((actualRow, screenY) =>
          screenCols.map((actualCol, screenX) => {
            const isLight = (screenY + screenX) % 2 === 0;
            const sq = (files[screenX] + ranks[screenY]) as Square;
            const piece = boardPosition[actualRow][actualCol];
            const PieceComponent = piece ? PieceMap[piece] : null;
            const isSelected = selectedSquare === sq;
            const isLastMove = lastMove && (lastMove.from === sq || lastMove.to === sq);
            const isMarked = markedSquares.has(sq);

            return (
              <div
                key={`${screenY}-${screenX}`}
                onClick={() => {
                  clearMarkings();
                  onSquareClick?.(sq);
                }}
                onMouseDown={(e) => e.button === 2 && handleRightMouseDown(sq)}
                onMouseUp={(e) => e.button === 2 && handleRightMouseUp(sq)}
                className={cn(
                  "flex items-center justify-center relative aspect-square cursor-pointer transition-colors duration-150",
                  isLight ? "bg-[#ebecd0]" : "bg-[#779556]",
                  isSelected && "bg-[#f5f682]/80 z-20",
                  isLastMove && !isSelected && "bg-[#f5f682]/40",
                  interactive && !isSelected && !isLastMove && "hover:bg-[#f5f682]/20"
                )}
              >
                {/* Right-click highlight */}
                {isMarked && (
                  <div className="absolute inset-0 bg-orange-500/50 z-0 ring-4 ring-orange-500/30 ring-inset" />
                )}

                {/* Coordinates */}
                {showCoordinates && screenX === 0 && (
                  <span className={cn(
                    "absolute top-0.5 left-0.5 text-[8px] font-bold select-none",
                    isLight ? "text-[#779556]" : "text-[#ebecd0]"
                  )}>
                    {ranks[screenY]}
                  </span>
                )}
                {showCoordinates && screenY === 7 && (
                  <span className={cn(
                    "absolute bottom-0.5 right-0.5 text-[8px] font-bold select-none",
                    isLight ? "text-[#779556]" : "text-[#ebecd0]"
                  )}>
                    {files[screenX]}
                  </span>
                )}

                {/* Piece with animation */}
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
                        interactive ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
                      )}
                      drag={interactive}
                      dragSnapToOrigin
                      dragElastic={0.1}
                      onDragStart={() => {
                        clearMarkings();
                        if (selectedSquare !== sq) {
                          onSquareClick?.(sq);
                        }
                      }}
                      onDragEnd={(_, info) => {
                        const board = boardRef.current;
                        if (!board) return;
                        const rect = board.getBoundingClientRect();
                        const squareSize = rect.width / 8;
                        const dx = Math.round(info.offset.x / squareSize);
                        const dy = Math.round(info.offset.y / squareSize);

                        if (dx !== 0 || dy !== 0) {
                          const targetScreenX = screenX + dx;
                          const targetScreenY = screenY + dy;
                          if (targetScreenX >= 0 && targetScreenX < 8 && targetScreenY >= 0 && targetScreenY < 8) {
                            const targetSq = (files[targetScreenX] + ranks[targetScreenY]) as Square;
                            onSquareClick?.(targetSq);
                          }
                        }
                      }}
                    >
                      <PieceComponent className="w-full h-full" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Selection indicator for empty squares */}
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
            <marker id="arrowhead" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
              <polygon points="0 0, 4 2, 0 4" fill="rgba(249, 115, 22, 0.8)" />
            </marker>
          </defs>
          {arrows.map((arrow, i) => {
            const from = getSqCoords(arrow.from);
            const to = getSqCoords(arrow.to);
            const dx = to.x - from.x;
            const dy = to.y - from.y;
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
  );
};
