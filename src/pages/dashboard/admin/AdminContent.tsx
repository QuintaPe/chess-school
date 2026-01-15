
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const AdminContent = () => {
    return (
        <DashboardLayout role="admin">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Gestión de Contenido</h1>
                <p>Administrar cursos, lecciones y material educativo.</p>
                {/* TODO: Implement content management */}
            </div>
        </DashboardLayout>
    );
};

export default AdminContent;
