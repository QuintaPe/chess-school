
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const StudentSettings = () => {
    return (
        <DashboardLayout role="student">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Configuración</h1>
                <p>Administra tu cuenta y preferencias.</p>
                {/* TODO: Implement settings form */}
            </div>
        </DashboardLayout>
    );
};

export default StudentSettings;
