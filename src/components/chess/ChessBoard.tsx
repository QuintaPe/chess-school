import { cn } from "@/lib/utils";

interface ChessPiece {
  type: 'K' | 'Q' | 'R' | 'B' | 'N' | 'P' | 'k' | 'q' | 'r' | 'b' | 'n' | 'p' | null;
}

const pieceUnicode: Record<string, string> = {
  'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
  'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
};

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
    sm: 'w-8 h-8 text-xl',
    md: 'w-12 h-12 text-3xl',
    lg: 'w-16 h-16 text-4xl',
  };

  const isHighlighted = (row: number, col: number) => {
    const square = files[col] + ranks[row];
    return highlightSquares.includes(square);
  };

  return (
    <div className={cn("inline-block rounded-xl overflow-hidden shadow-2xl", className)}>
      <div className="grid grid-cols-8">
        {position.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const isLight = (rowIndex + colIndex) % 2 === 0;
            const highlighted = isHighlighted(rowIndex, colIndex);
            
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  sizeClasses[size],
                  "flex items-center justify-center relative transition-all duration-200",
                  isLight ? "bg-chess-light" : "bg-chess-dark",
                  highlighted && "ring-2 ring-inset ring-accent",
                  interactive && "cursor-pointer hover:brightness-110"
                )}
              >
                {piece && (
                  <span
                    className={cn(
                      "select-none transition-transform duration-200",
                      piece === piece.toUpperCase() ? "text-foreground drop-shadow-md" : "text-background drop-shadow-md",
                      interactive && "hover:scale-110"
                    )}
                  >
                    {pieceUnicode[piece]}
                  </span>
                )}
                {showCoordinates && colIndex === 0 && (
                  <span className={cn(
                    "absolute top-0.5 left-1 text-[10px] font-medium",
                    isLight ? "text-chess-dark" : "text-chess-light"
                  )}>
                    {ranks[rowIndex]}
                  </span>
                )}
                {showCoordinates && rowIndex === 7 && (
                  <span className={cn(
                    "absolute bottom-0.5 right-1 text-[10px] font-medium",
                    isLight ? "text-chess-dark" : "text-chess-light"
                  )}>
                    {files[colIndex]}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
