import { FeaturedProducts } from "@/components/featured-products";
import { HeroSection } from "@/components/hero-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { Leaf, Package, Globe } from "lucide-react";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <TestimonialsSection />

      {/* Short About / Credibility Section (Extra) */}
      <section className="py-20 bg-green-900 text-cream-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">Why Collectors Choose GlobalGreen</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
            <div className="p-6 border border-green-800 rounded-xl bg-green-950/50 flex flex-col items-center">
              <Leaf className="w-12 h-12 text-gold-500 mb-4" />
              <h3 className="font-bold text-xl mb-2 text-gold-500">Genetic Guarantee</h3>
              <p className="text-green-200 text-sm">Every plant is verified for genetic authenticity. What you see is what you receive.</p>
            </div>
            <div className="p-6 border border-green-800 rounded-xl bg-green-950/50 flex flex-col items-center">
              <Package className="w-12 h-12 text-gold-500 mb-4" />
              <h3 className="font-bold text-xl mb-2 text-gold-500">Expert Packaging</h3>
              <p className="text-green-200 text-sm">4-layer protection system. Sphagnum moss, thermal insulation, and sturdy box.</p>
            </div>
            <div className="p-6 border border-green-800 rounded-xl bg-green-950/50 flex flex-col items-center">
              <Globe className="w-12 h-12 text-gold-500 mb-4" />
              <h3 className="font-bold text-xl mb-2 text-gold-500">Global Compliance</h3>
              <p className="text-green-200 text-sm">We handle all phytosanitary and export permits. 100% legal export.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
