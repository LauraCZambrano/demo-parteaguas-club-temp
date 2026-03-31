import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ColumnsSection from "@/components/ColumnsSection";
import PodcastSection from "@/components/PodcastSection";
import Footer from "@/components/Footer";
import SubscriptionBar from "@/components/SubscriptionBar";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SubscriptionBar />
      <Header />
      <main>
        <HeroSection />
        <ColumnsSection />
        {/* Section divider */}
        <div className="container"><div className="h-px w-full bg-border" /></div>
        <PodcastSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
