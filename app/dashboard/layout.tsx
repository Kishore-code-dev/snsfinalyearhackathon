import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { MotionDiv } from "@/components/ui/motion-primitives";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full bg-background/50 selection:bg-primary/20 selection:text-primary overflow-hidden">
            <AppSidebar />
            <main className="flex-1 ml-64 flex flex-col min-h-screen transition-all duration-300 ease-in-out relative z-0">
                <TopNavbar />
                <div className="flex-1 p-8 space-y-8 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent bg-gradient-to-br from-background via-secondary/20 to-secondary/10">
                    <MotionDiv className="max-w-7xl mx-auto w-full">
                        {children}
                    </MotionDiv>
                </div>
            </main>
        </div>
    );
}
