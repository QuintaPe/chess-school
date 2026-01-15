
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PGNViewer } from "@/components/chess/PGNViewer";
import { Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const PGNPage = () => {
    const [pgnContent, setPgnContent] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPGN = async () => {
            try {
                setLoading(true);
                // The file path as requested by user
                const response = await fetch('/pgn/7Q%20Method,%20addendum.pgn');
                if (!response.ok) {
                    throw new Error(`Failed to load PGN file: ${response.statusText}`);
                }
                const text = await response.text();
                setPgnContent(text);
            } catch (err) {
                console.error("Error loading PGN:", err);
                setError("Error al cargar el archivo PGN de demostración.");
            } finally {
                setLoading(false);
            }
        };

        fetchPGN();
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-24 pb-16 min-h-[calc(100vh-200px)]">
                {/* Header Section */}
                <section className="px-6 mb-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground flex items-center gap-3">
                                    <BookOpen className="h-8 w-8 text-primary" />
                                    Visor de <span className="gradient-gold-text">PGN</span>
                                </h1>
                                <p className="text-muted-foreground mt-2 max-w-2xl">
                                    Explora partidas, analiza variantes y estudia con nuestros ejemplos interactivos.
                                </p>
                            </div>
                            {/* Could add a file upload button here later */}
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            </div>
                        ) : error ? (
                            <Card className="p-8 text-center border-red-500/50 bg-red-500/10">
                                <h3 className="text-xl font-bold text-red-500 mb-2">Error</h3>
                                <p className="text-muted-foreground">{error}</p>
                            </Card>
                        ) : (
                            <div className="animate-in fade-in duration-500">
                                <PGNViewer pgnContent={pgnContent} />
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default PGNPage;
