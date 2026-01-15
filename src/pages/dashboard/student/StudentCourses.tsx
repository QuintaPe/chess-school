
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const StudentCourses = () => {
    return (
        <DashboardLayout role="student">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Mis Cursos</h1>
                <p>Acceso a tus cursos comprados y progreso.</p>
                {/* TODO: Implement courses list */}
            </div>
        </DashboardLayout>
    );
};

export default StudentCourses;
