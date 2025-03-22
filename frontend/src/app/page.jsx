// frontend/src/app/page.js (landing page)
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Professional Soccer Tactics at Your Fingertips
              </h1>
              <p className="text-xl mb-8">
                StatTact AI analyzes teams, generates formations, and simulates matches to give you the winning edge.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Link href="/register">Get Started Free</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link href="/demo">See Demo</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative w-full h-[400px]">
                <Image 
                  src="/images/hero-formation.png" 
                  alt="Soccer formation visualization"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">
            Advanced Features for Soccer Enthusiasts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature boxes */}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">
            Trusted by Coaches and Players
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Testimonial cards */}
          </div>
        </div>
      </section>
      
      {/* Pricing */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">
            Choose Your Plan
          </h2>
          {/* PricingPlans component */}
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">
            Ready to Transform Your Soccer Strategy?
          </h2>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            <Link href="/register">Start Your Free Trial</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
