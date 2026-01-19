import { cn } from "@/lib/utils";

interface EvaluationBarProps {
    evaluation: number; // in centipawns/100, positive for white, negative for black
    className?: string;
}

export const EvaluationBar = ({ evaluation, className }: EvaluationBarProps) => {
    // Clamp evaluation to [-10, 10] for visualization
    const clampedEval = Math.max(-10, Math.min(10, evaluation));

    // Convert [-10, 10] to [0, 100] percentage for White
    // 0 -> 50%
    // 10 -> 100%
    // -10 -> 0%
    const whitePercentage = 50 + (clampedEval * 5);

    return (
        <div className={cn("relative w-2 h-full bg-[#312e2b] rounded-full overflow-hidden border border-border/50 shadow-inner", className)}>
            {/* Black part is the background */}

            {/* White part */}
            <div
                className="absolute bottom-0 left-0 w-full bg-white transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                style={{ height: `${whitePercentage}%` }}
            />

            {/* Zero line */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-muted-foreground/30 z-10" />

            {/* Float Eval Tooltip (Simple) */}
            <div className={cn(
                "absolute left-4 transform -translate-y-1/2 bg-popover text-popover-foreground px-1.5 py-0.5 rounded text-[10px] font-bold border border-border transition-all duration-700 shadow-xl",
                whitePercentage > 50 ? "bottom-[calc(50%-10px)]" : "bottom-[calc(50%-10px)]" // Simplified positioning
            )}
                style={{ bottom: `${whitePercentage}%` }}
            >
                {evaluation > 0 ? `+${evaluation.toFixed(1)}` : evaluation.toFixed(1)}
            </div>
        </div>
    );
};
