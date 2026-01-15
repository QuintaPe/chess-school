
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const AdminStats = () => {
    return (
        <DashboardLayout role="admin">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Estadísticas</h1>
                <p>Métricas y análisis del club.</p>
                {/* TODO: Implement statistics dashboard */}
            </div>
        </DashboardLayout>
    );
};

export default AdminStats;
