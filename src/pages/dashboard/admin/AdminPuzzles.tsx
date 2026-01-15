
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const AdminPuzzles = () => {
    return (
        <DashboardLayout role="admin">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Gestión de Problemas</h1>
                <p>Crear y administrar problemas de ajedrez.</p>
                {/* TODO: Implement puzzles management */}
            </div>
        </DashboardLayout>
    );
};

export default AdminPuzzles;
