import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  Zap, 
  Star, 
  Shield, 
  ArrowRight, 
  Sparkles,
  Layout,
  Palette,
  Download,
  Users,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useState } from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'monthly' | 'lifetime'>('monthly');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl" data-testid="text-brand">Sales Page Forge</span>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={onLogin}
              data-testid="button-header-login"
            >
              Log In
            </Button>
            <Button 
              onClick={onGetStarted}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500"
              data-testid="button-header-start"
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </header>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <Badge className="mb-6 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            <Sparkles className="w-3 h-3 mr-1" />
            Limited Time Offer - Start Free Today
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 pb-2 bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent leading-normal" data-testid="text-hero-headline">
            Build High-Converting Sales Pages in Minutes
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed" data-testid="text-hero-subheadline">
            Create stunning Internet Marketing-style sales letters and JV pages with our drag-and-drop editor. 
            No coding required. Export as clean HTML.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-lg px-8 py-6 shadow-lg shadow-emerald-500/25"
              data-testid="button-hero-cta"
            >
              Start Building Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={onLogin}
              className="text-lg px-8 py-6 border-gray-600 text-gray-300"
              data-testid="button-hero-login"
            >
              I Already Have an Account
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>1 free project</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>Export to HTML*</span>
              <span className="text-xs text-gray-500">(Pro & Lifetime)</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-features-headline">
              Everything You Need to Create Converting Pages
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Powerful features designed specifically for marketers and affiliates
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-800/80 border-gray-700 p-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mb-6">
                <Layout className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white" data-testid="text-feature-1">15+ Section Types</h3>
              <p className="text-gray-400">Hero sections, bullet points, testimonials, bonus stacks, guarantees, FAQs, and more - all optimized for conversions.</p>
            </Card>

            <Card className="bg-gray-800/80 border-gray-700 p-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mb-6">
                <Palette className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white" data-testid="text-feature-2">12 Pro Themes</h3>
              <p className="text-gray-400">From Classic Red to Neon Gamer - choose from 12 professionally designed themes optimized for maximum impact and conversions.</p>
            </Card>

            <Card className="bg-gray-800/80 border-gray-700 p-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mb-6">
                <Download className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white" data-testid="text-feature-3">Clean HTML Export</h3>
              <p className="text-gray-400">Download your pages as standalone HTML files. Upload anywhere - no dependencies, no monthly fees.</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-benefits-headline">
              Why Marketers Love Page Forge
            </h2>
          </div>

          <div className="space-y-6">
            {[
              { text: 'Create professional sales letters in under 10 minutes', icon: Clock },
              { text: 'No design skills or coding knowledge required', icon: Sparkles },
              { text: 'Built-in templates for sales letters and JV pages', icon: Layout },
              { text: 'Drag-and-drop section reordering', icon: Users },
              { text: 'Mobile-responsive output by default', icon: Check },
              { text: 'One-time payment option - no recurring fees', icon: Star },
            ].map((benefit, index) => (
              <div 
                key={index} 
                className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700"
                data-testid={`benefit-item-${index}`}
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <benefit.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-lg text-gray-200">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-pricing-headline">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-400 text-lg">
              Start free, upgrade when you're ready
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card 
              className={`p-8 cursor-pointer transition-all duration-200 relative ${
                selectedPlan === 'free' 
                  ? 'bg-gradient-to-b from-emerald-900/50 to-gray-800 border-emerald-500/50 scale-105' 
                  : 'bg-gray-800 border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => setSelectedPlan('free')}
              data-testid="card-plan-free"
            >
              {selectedPlan === 'free' && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white">
                  Selected
                </Badge>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 text-white">Free</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">$0</span>
                  <span className="text-gray-400">/forever</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {['1 project', '3 themes', 'Basic sections', 'Preview only'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                variant={selectedPlan === 'free' ? 'default' : 'outline'}
                className={selectedPlan === 'free' ? 'w-full bg-gradient-to-r from-emerald-500 to-cyan-500' : 'w-full border-gray-600'}
                onClick={onGetStarted}
                data-testid="button-plan-free"
              >
                Get Started
              </Button>
            </Card>

            <Card 
              className={`p-8 cursor-pointer transition-all duration-200 relative ${
                selectedPlan === 'monthly' 
                  ? 'bg-gradient-to-b from-emerald-900/50 to-gray-800 border-emerald-500/50 scale-105' 
                  : 'bg-gray-800 border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => setSelectedPlan('monthly')}
              data-testid="card-plan-monthly"
            >
              {selectedPlan === 'monthly' && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white">
                  Most Popular
                </Badge>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 text-white">Monthly</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">$19</span>
                  <span className="text-gray-400">/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {['20 projects', 'All 12 themes', 'All section types', 'HTML download', 'No watermark'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                variant={selectedPlan === 'monthly' ? 'default' : 'outline'}
                className={selectedPlan === 'monthly' ? 'w-full bg-gradient-to-r from-emerald-500 to-cyan-500' : 'w-full border-gray-600'}
                onClick={onGetStarted}
                data-testid="button-plan-monthly"
              >
                Get Pro Access
              </Button>
            </Card>

            <Card 
              className={`p-8 cursor-pointer transition-all duration-200 relative ${
                selectedPlan === 'lifetime' 
                  ? 'bg-gradient-to-b from-emerald-900/50 to-gray-800 border-emerald-500/50 scale-105' 
                  : 'bg-gray-800 border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => setSelectedPlan('lifetime')}
              data-testid="card-plan-lifetime"
            >
              {selectedPlan === 'lifetime' && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white">
                  Best Value
                </Badge>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 text-white">Lifetime</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">$97</span>
                  <span className="text-gray-400">one-time</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {['100 projects', 'All 12 themes', 'All section types', 'HTML + JSON export', 'Duplicate projects', 'Priority support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                variant={selectedPlan === 'lifetime' ? 'default' : 'outline'}
                className={selectedPlan === 'lifetime' ? 'w-full bg-gradient-to-r from-emerald-500 to-cyan-500' : 'w-full border-gray-600'}
                onClick={onGetStarted}
                data-testid="button-plan-lifetime"
              >
                Get Lifetime Access
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-8">
            <Shield className="w-12 h-12 text-emerald-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-guarantee-headline">
            30-Day Money-Back Guarantee
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Try Page Forge risk-free. If you're not completely satisfied with your purchase, 
            we'll refund your money - no questions asked.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>Instant refund</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>No hassle</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>Keep your pages</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-800/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-faq-headline">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                question: 'Do I need any technical skills?',
                answer: 'Not at all! Page Forge is designed for non-technical users. Simply drag, drop, and customize your sections. No coding required.'
              },
              {
                question: 'Can I use my pages on any hosting?',
                answer: 'Yes! Export your pages as standalone HTML files and upload them anywhere - your own hosting, WordPress, ClickFunnels, or any web server.'
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards and PayPal through our secure payment processor.'
              },
              {
                question: 'Can I cancel my subscription anytime?',
                answer: 'Absolutely. Cancel anytime with one click. No cancellation fees, no hassle.'
              },
              {
                question: 'Do you offer refunds?',
                answer: 'Yes! We offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied, we\'ll refund your purchase.'
              }
            ].map((faq, index) => (
              <Card 
                key={index}
                className="bg-gray-800 border-gray-700 overflow-hidden"
                data-testid={`faq-item-${index}`}
              >
                <button
                  className="w-full p-6 text-left flex items-center justify-between gap-4"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  data-testid={`button-faq-toggle-${index}`}
                >
                  <span className="font-semibold text-white">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 text-gray-400">
                    {faq.answer}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gradient-to-r from-emerald-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6" data-testid="text-final-cta-headline">
            Ready to Build Your First Sales Page?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of marketers who trust Page Forge to create high-converting pages.
          </p>
          <Button 
            size="lg"
            onClick={onGetStarted}
            className="bg-white text-gray-900 text-lg px-12 py-6 shadow-xl"
            data-testid="button-final-cta"
          >
            Start Building Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="mt-6 text-white/60 text-sm">
            No credit card required. Start with 1 free project.
          </p>
        </div>
      </section>

      <footer className="py-12 px-6 bg-gray-900 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">Sales Page Forge</span>
            </div>
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Sales Page Forge. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
