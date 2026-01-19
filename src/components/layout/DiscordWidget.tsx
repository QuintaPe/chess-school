import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, ExternalLink } from "lucide-react";

interface DiscordWidgetProps {
  serverId?: string;
  inviteUrl?: string;
}

export const DiscordWidget = ({
  serverId = "1462031975043960864",
  inviteUrl = "https://discord.com/invite/WVTGbhQ6"
}: DiscordWidgetProps) => {

  return (
    <Card className="p-6 bg-[#5865F2]/5 border-[#5865F2]/20 overflow-hidden relative group">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#5865F2]/10 rounded-full blur-2xl group-hover:bg-[#5865F2]/20 transition-colors" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#5865F2] flex items-center justify-center shadow-lg shadow-[#5865F2]/20">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-foreground">Comunidad Discord</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Online Ahora
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Únete a nuestro servidor para resolver dudas, participar en torneos relámpago y charlar con otros alumnos.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-background/50 rounded-lg p-2 border border-border/50 text-center">
            <p className="text-lg font-bold text-foreground">120+</p>
            <p className="text-[10px] text-muted-foreground uppercase">Miembros</p>
          </div>
          <div className="bg-background/50 rounded-lg p-2 border border-border/50 text-center">
            <div className="flex items-center justify-center gap-1">
              <Users className="w-3 h-3 text-[#5865F2]" />
              <p className="text-lg font-bold text-foreground">24</p>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase">Activos</p>
          </div>
        </div>

        <Button
          className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white border-none shadow-md shadow-[#5865F2]/20"
          onClick={() => window.open(inviteUrl, '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Unirse al Servidor
        </Button>
      </div>
    </Card>
  );
};
