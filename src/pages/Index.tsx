import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ColumnsSection from "@/components/ColumnsSection";
import PodcastSection from "@/components/PodcastSection";
import Footer from "@/components/Footer";
import SubscriptionBar from "@/components/SubscriptionBar";
import { useColumns } from "@/hooks/useColumns";

const Index = () => {
  const { data: columns, loading, error } = useColumns();

  return (
    <div className="min-h-screen">
      <SubscriptionBar />
      <Header />
      <main>
        <HeroSection />
        <ColumnsSection columns={columns} loading={loading} error={error} />
        <PodcastSection columns={columns} loading={loading} error={error} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
