import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ColumnsSection from "@/components/ColumnsSection";
import PodcastSection from "@/components/PodcastSection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { useColumns } from "@/hooks/useColumns";
import { applySeo } from "@/lib/seo";
import { useBrand } from "@/hooks/useBrand";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const { data: columns, loading, error, hasMore, loadingMore, loadMore, retry } = useColumns();
  const location = useLocation();
  const brand = useBrand();

  useEffect(() => {
    applySeo({
      title: brand.name,
      description: brand.profile?.bio ?? brand.name,
      url: `${window.location.origin}/`,
      type: "website",
      siteName: brand.name,
    });
  }, [brand.name, brand.profile?.bio]);

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{brand.name}</title>
        <link rel="canonical" href={`${window.location.origin}/`} />
        <meta property="og:title" content={brand.name} />
        <meta property="og:url" content={`${window.location.origin}/`} />
        <meta property="og:type" content="website" />
      </Helmet>
      <Header />
      <main>
        <HeroSection />
        <ColumnsSection columns={columns} loading={loading} error={error} hasMore={hasMore} loadingMore={loadingMore} onLoadMore={loadMore} onRetry={retry} />
        <PodcastSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
