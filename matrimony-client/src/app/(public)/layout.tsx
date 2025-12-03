import WhatsappButton from "@/components/features/public/Home/WhatsappButton/WhatsappButton";
import Footer from "../../components/shared/Footer/Footer";
import Navbar from "../../components/shared/Navbar/Navbar";
import "../globals.css";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>{children}</main>
      <WhatsappButton />
      <footer>
        <Footer />
      </footer>
    </>
  );
}
