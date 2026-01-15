
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const AdminStudents = () => {
    return (
        <DashboardLayout role="admin">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Gestión de Alumnos</h1>
                <p>Lista de alumnos registrados y su información.</p>
                {/* TODO: Implement students management */}
            </div>
        </DashboardLayout>
    );
};

export default AdminStudents;
