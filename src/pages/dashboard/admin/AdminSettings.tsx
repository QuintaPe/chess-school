import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, Save, Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const AdminSettings = () => {
    const [loading, setLoading] = useState(false);
    const [guildId, setGuildId] = useState("1462031975043960864");
    const [inviteUrl, setInviteUrl] = useState("https://discord.com/invite/WVTGbhQ6");

    const handleSaveDiscord = async () => {
        setLoading(true);
        try {
            // TODO: Implement API call to save global settings
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success("Configuración de Discord guardada correctamente");
        } catch (error) {
            toast.error("Error al guardar la configuración");
        } finally {
            setLoading(false);
        }
    };

    const handleSyncRoles = async () => {
        setLoading(true);
        try {
            // TODO: Implement API call to trigger a full role sync
            await new Promise(resolve => setTimeout(resolve, 2000));
            toast.success("Sincronización masiva de roles completada");
        } catch (error) {
            toast.error("Error en la sincronización");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="admin">
            <div className="p-6 lg:p-8 space-y-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">
                        Configuración del Sistema
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Gestiona las integraciones globales y parámetros del club
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Discord Settings */}
                    <Card className="p-6 bg-card border-border border-l-4 border-l-[#5865F2]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-[#5865F2]/10 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-[#5865F2]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-serif font-semibold text-foreground">
                                    Integración con Discord
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Configura el servidor oficial para sincronización de roles
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="guildId">ID del Servidor (Guild ID)</Label>
                                <Input
                                    id="guildId"
                                    value={guildId}
                                    onChange={(e) => setGuildId(e.target.value)}
                                    placeholder="Ej: 132808000000000000"
                                    className="bg-secondary border-border"
                                />
                                <p className="text-[10px] text-muted-foreground italic">
                                    Necesario para que el bot identifique el servidor de Reino Ajedrez.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="inviteUrl">Enlace de Invitación</Label>
                                <Input
                                    id="inviteUrl"
                                    value={inviteUrl}
                                    onChange={(e) => setInviteUrl(e.target.value)}
                                    placeholder="https://discord.gg/..."
                                    className="bg-secondary border-border"
                                />
                                <p className="text-[10px] text-muted-foreground italic">
                                    Este es el enlace que verán los alumnos para unirse al servidor.
                                </p>
                            </div>

                            <div className="pt-4 flex flex-col sm:flex-row gap-3">
                                <Button
                                    className="flex-1 bg-[#5865F2] hover:bg-[#4752C4]"
                                    onClick={handleSaveDiscord}
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                    Guardar Configuración
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={handleSyncRoles}
                                    disabled={loading}
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Forzar Sincronización
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* App Settings Placeholder */}
                    <Card className="p-6 bg-card border-border">
                        <h2 className="text-xl font-serif font-semibold text-foreground mb-4">
                            Otras Configuraciones
                        </h2>
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-secondary/30 border border-border dashed flex items-center justify-center h-48">
                                <p className="text-muted-foreground italic text-sm text-center">
                                    Próximamente:<br />
                                    Pasarelas de pago, correos transaccionales y límites del sistema.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminSettings;
