import Footer from "./Footer";
import Header from "./Header";

export default function AppLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-base-100">
      <Header />
      <main className=" w-full">{children}</main>
      <Footer />
    </div>
  );
}
