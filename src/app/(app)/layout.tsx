import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 dark:bg-black bg-white">{children}</main>
      <Footer />
    </div>
  );
}
