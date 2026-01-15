import { cn } from "@/lib/utils";
import { PieceMap } from "./ChessPieces";

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
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showCoordinates?: boolean;
  className?: string;
  highlightSquares?: string[];
}

export const ChessBoard = ({
  position = initialPosition,
  interactive = false,
  size = 'md',
  showCoordinates = true,
  className,
  highlightSquares = [],
}: ChessBoardProps) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const isHighlighted = (row: number, col: number) => {
    const square = files[col] + ranks[row];
    return highlightSquares.includes(square);
  };

  return (
    <div className={cn("inline-block rounded-lg overflow-hidden shadow-2xl border-4 border-slate-800", className)}>
      <div className="grid grid-cols-8">
        {position.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const isLight = (rowIndex + colIndex) % 2 === 0;
            const highlighted = isHighlighted(rowIndex, colIndex);

            const PieceComponent = piece ? PieceMap[piece] : null;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  sizeClasses[size],
                  "flex items-center justify-center relative transition-all duration-200",
                  isLight ? "bg-[#EBECD0]" : "bg-[#779556]", // Lichess/Chess.com style green board is universally liked and looks better than pure brown usually
                  highlighted && "after:absolute after:inset-0 after:bg-yellow-400/50", // Highlighting via overlay
                  interactive && "cursor-pointer hover:brightness-110"
                )}
              >
                {/* Board coordinate labels */}
                {showCoordinates && colIndex === 0 && (
                  <span className={cn(
                    "absolute top-0.5 left-0.5 text-[10px] font-bold leading-none z-10",
                    isLight ? "text-[#779556]" : "text-[#EBECD0]"
                  )}>
                    {ranks[rowIndex]}
                  </span>
                )}
                {showCoordinates && rowIndex === 7 && (
                  <span className={cn(
                    "absolute bottom-0.5 right-0.5 text-[10px] font-bold leading-none z-10",
                    isLight ? "text-[#779556]" : "text-[#EBECD0]"
                  )}>
                    {files[colIndex]}
                  </span>
                )}

                {/* Piece */}
                {PieceComponent && (
                  <div
                    className={cn(
                      "w-[85%] h-[85%] select-none z-20 filter drop-shadow-lg transition-transform duration-200",
                      interactive && "hover:scale-110"
                    )}
                  >
                    <PieceComponent />
                  </div>
                )}

                {/* Last move highlight could be improved. The 'after' element handles it above */}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
