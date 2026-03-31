import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ColumnsSection from "@/components/ColumnsSection";
import PodcastSection from "@/components/PodcastSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ColumnsSection />
        <PodcastSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
