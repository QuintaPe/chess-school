import { Achievement } from "@/types/api";
import { cn } from "@/lib/utils";
import {
    Puzzle,
    Trophy,
    Flame,
    GraduationCap,
    Lock,
    CheckCircle2,
    Star
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface AchievementBadgeProps {
    achievement: Achievement;
    size?: "sm" | "md" | "lg";
    showDetails?: boolean;
}

const getIcon = (id: string) => {
    if (id === 'first_puzzle') return <Puzzle className="w-full h-full" />;
    if (id.startsWith('puzzles_')) return <Trophy className="w-full h-full" />;
    if (id.startsWith('streak_')) return <Flame className="w-full h-full" />;
    if (id.startsWith('course_')) return <GraduationCap className="w-full h-full" />;
    return <Star className="w-full h-full" />;
};

export const AchievementBadge = ({ achievement, size = "md", showDetails = false }: AchievementBadgeProps) => {
    const isUnlocked = achievement.isUnlocked;

    const sizeClasses = {
        sm: "w-10 h-10 p-2",
        md: "w-16 h-16 p-3",
        lg: "w-24 h-24 p-5"
    };

    const badgeContent = (
        <div className={cn(
            "relative rounded-2xl flex items-center justify-center transition-all duration-500",
            sizeClasses[size],
            isUnlocked
                ? "bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border-2 border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)] text-yellow-500"
                : "bg-secondary/50 border-2 border-border grayscale text-muted-foreground opacity-60"
        )}>
            {getIcon(achievement.id)}

            {!isUnlocked && (
                <div className="absolute -bottom-1 -right-1 bg-background border border-border rounded-full p-1">
                    <Lock className="w-3 h-3" />
                </div>
            )}

            {isUnlocked && (
                <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-0.5 animate-pulse shadow-lg">
                    <CheckCircle2 className="w-3 h-3 text-background" />
                </div>
            )}
        </div>
    );

    if (!showDetails) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        {badgeContent}
                    </TooltipTrigger>
                    <TooltipContent className="bg-card border-border p-3">
                        <div className="space-y-1">
                            <p className="font-bold text-foreground">{achievement.name}</p>
                            <p className="text-xs text-muted-foreground">{achievement.description}</p>
                            {!isUnlocked && achievement.progress !== undefined && achievement.criteria_value && (
                                <div className="mt-2 space-y-1">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                        <span>Progreso</span>
                                        <span>{achievement.progress} / {achievement.criteria_value}</span>
                                    </div>
                                    <div className="h-1 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary"
                                            style={{ width: `${(achievement.progress / achievement.criteria_value) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                            {isUnlocked && achievement.unlocked_at && (
                                <p className="text-[10px] text-primary font-bold uppercase mt-2">
                                    Obtenido el {new Date(achievement.unlocked_at).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return (
        <div className="flex flex-col items-center text-center gap-3 group">
            <div className="group-hover:scale-110 transition-transform duration-300">
                {badgeContent}
            </div>
            <div className="space-y-1">
                <h4 className={cn("font-bold text-sm", isUnlocked ? "text-foreground" : "text-muted-foreground")}>
                    {achievement.name}
                </h4>
                <p className="text-xs text-muted-foreground max-w-[120px] line-clamp-2">
                    {achievement.description}
                </p>
            </div>
            {!isUnlocked && achievement.progress !== undefined && achievement.criteria_value && (
                <div className="w-full mt-1 space-y-1 px-4">
                    <div className="h-1 bg-secondary rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary"
                            style={{ width: `${(achievement.progress / achievement.criteria_value) * 100}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
