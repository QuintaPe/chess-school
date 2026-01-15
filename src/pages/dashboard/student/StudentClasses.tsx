
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const StudentClasses = () => {
    return (
        <DashboardLayout role="student">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Mis Clases</h1>
                <p>Aquí verás tus clases inscritas y el historial.</p>
                {/* TODO: Implement class list */}
            </div>
        </DashboardLayout>
    );
};

export default StudentClasses;
