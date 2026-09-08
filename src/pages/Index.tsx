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
import { Helmet } from "react-helmet-async";

const Index = () => {
  const { data: columns, loading, error } = useColumns();
  const location = useLocation();

  useEffect(() => {
    applySeo({
      title: "Parteaguas Club — Análisis, contexto y podcast editorial",
      description:
        "Análisis editoriales, crónica crítica y podcast sobre tecnología, sociedad y cultura. Lectura para mentes inquietas que buscan ir más allá del titular.",
      url: `${window.location.origin}/`,
      type: "website",
    });
  }, []);

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
        <title>Parteaguas Club — Análisis, contexto y periodismo de opinión</title>
        <meta name="description" content="Análisis, contexto y periodismo de opinión" />
        <link rel="canonical" href="https://www.parteaguas.club/" />
        <meta property="og:title" content="Parteaguas Club — Análisis, contexto y periodismo de opinión" />
        <meta property="og:description" content="Análisis, contexto y periodismo de opinión" />
        <meta property="og:url" content="https://www.parteaguas.club/" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Header />
      <main>
        <HeroSection />
        <ColumnsSection columns={columns} loading={loading} error={error} />
        <PodcastSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
