
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const StudentPuzzles = () => {
    return (
        <DashboardLayout role="student">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Mis Problemas</h1>
                <p>Historial de problemas resueltos y estadísticas.</p>
                {/* TODO: Implement puzzles stats */}
            </div>
        </DashboardLayout>
    );
};

export default StudentPuzzles;
