import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Achievement } from "@/types/api";
import { AchievementBadge } from "@/components/chess/AchievementBadge";
import { Loader2, Trophy, Medal, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const StudentAchievements = () => {
    const { data: achievements, isLoading } = useQuery<Achievement[]>({
        queryKey: ["achievements"],
        queryFn: () => api.achievements.list(),
    });

    const unlockedCount = achievements?.filter(a => a.isUnlocked).length || 0;
    const totalCount = achievements?.length || 0;
    const progressPercentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

    return (
        <DashboardLayout role="student">
            <div className="p-6 lg:p-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-serif font-bold text-foreground flex items-center gap-3">
                            <Trophy className="w-8 h-8 text-yellow-500" />
                            Mis Logros y Medallas
                        </h1>
                        <p className="text-muted-foreground">
                            Completa desafíos para desbloquear medallas exclusivas y subir de nivel.
                        </p>
                    </div>

                    <Card className="p-6 bg-card border-border border-b-primary border-b-2 flex items-center gap-6 min-w-[250px]">
                        <div className="relative w-16 h-16">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                <path
                                    className="text-secondary stroke-current"
                                    strokeWidth="3"
                                    fill="none"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path
                                    className="text-primary stroke-current transition-all duration-1000 ease-out"
                                    strokeWidth="3"
                                    strokeDasharray={`${progressPercentage}, 100`}
                                    strokeLinecap="round"
                                    fill="none"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Medal className="w-6 h-6 text-yellow-500" />
                            </div>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{unlockedCount} / {totalCount}</p>
                            <p className="text-sm text-muted-foreground uppercase font-bold tracking-tighter">Completados</p>
                        </div>
                    </Card>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Categories (Optional, but looks better) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {achievements?.map((achievement) => (
                                <Card
                                    key={achievement.id}
                                    className={cn(
                                        "p-6 bg-card border-border hover:border-primary/30 transition-all group relative overflow-hidden",
                                        achievement.isUnlocked && "bg-gradient-to-br from-card to-primary/5"
                                    )}
                                >
                                    {achievement.isUnlocked && (
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full flex items-center justify-center pl-4 pb-4">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        </div>
                                    )}
                                    <AchievementBadge achievement={achievement} size="lg" showDetails={true} />
                                </Card>
                            ))}
                        </div>

                        {achievements?.length === 0 && (
                            <div className="text-center py-20 text-muted-foreground italic">
                                No hay logros disponibles en este momento.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default StudentAchievements;
