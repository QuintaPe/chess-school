
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const StudentProgress = () => {
    return (
        <DashboardLayout role="student">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Mi Progreso</h1>
                <p>Gráficos detallados de tu rendimiento.</p>
                {/* TODO: Implement progress charts */}
            </div>
        </DashboardLayout>
    );
};

export default StudentProgress;
