
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const AdminClasses = () => {
    return (
        <DashboardLayout role="admin">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Gestión de Clases</h1>
                <p>Crear, editar y administrar clases.</p>
                {/* TODO: Implement classes management */}
            </div>
        </DashboardLayout>
    );
};

export default AdminClasses;
