import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BRAND } from '../../data/brand';
import { FunnelNav } from '../../components/funnel/FunnelNav';
import { FunnelFooter } from '../../components/funnel/FunnelFooter';
import { EntrySequence } from '../../components/funnel/EntrySequence';
import { Button } from '../../components/ui/Button';
import { 
  ArrowRight, Check, Star, Clock, ChevronDown, 
  MapPin, Sparkles, ShieldCheck, Calendar, Phone 
} from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const projects = [
    {
      title: 'The Sellwood Craftsman Kitchen',
      neighborhood: 'Sellwood',
      scope: 'Full Gut Remodel & Wall Removal',
      budget: '$64,000',
      description: 'Handcrafted rift-cut white oak flat panel cabinetry, honed Vermont soapstone countertops, and hidden appliance garage.',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80',
    },
    {
      title: 'Alberta Arts Historic Bungalow',
      neighborhood: 'Alberta Arts',
      scope: 'Kitchen & Butler Pantry Expansion',
      budget: '$72,000',
      description: 'Period-accurate unlacquered brass hardware, custom sage beadboard accents, and restored fir floors.',
      image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1000&q=80',
    },
    {
      title: 'Mt. Tabor Mid-Century Interior',
      neighborhood: 'Mt. Tabor',
      scope: 'Kitchen & Living Spatial Redesign',
      budget: '$88,000',
      description: 'Custom walnut joinery with floor-to-ceiling glazing framing Douglas fir tree canopies.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    },
    {
      title: 'Sellwood Primary Spa Suite',
      neighborhood: 'Sellwood',
      scope: 'Primary Bath & Dressing Suite',
      budget: '$48,000',
      description: 'Freestanding cedar Japanese soaking tub, curbless plaster shower, and radiant heated zellige tile.',
      image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1000&q=80',
    },
    {
      title: 'Laurelhurst Historic Residence',
      neighborhood: 'Laurelhurst',
      scope: 'Whole Home Kitchen & 2 Bathrooms',
      budget: '$95,000',
      description: 'Architectural remodeling balancing 1918 historical integrity with modern chef functionality.',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  const testimonials = [
    {
      quote: "Dana and Elena treated our 1924 kitchen with reverence. The automated updates and clear calendar made our consultation and entire build remarkably calm. We knew what was happening every single week.",
      name: "Maya & Julian Okafor",
      neighborhood: "Alberta Arts, Portland",
      project: "Kitchen & Walk-in Pantry",
    },
    {
      quote: "Before Alder & Finch, we called three contractors who ghosted us after two emails. With Finch Assist and Dana's team, we had a consultation booked in 10 minutes and a comprehensive estimate four days later.",
      name: "Jonas Albrecht",
      neighborhood: "Mt. Tabor",
      project: "Mid-Century Kitchen Restoration",
    },
    {
      quote: "The level of design rigor and personal care is unmatched. From the very first questionnaire to our final punch list, communication was flawless.",
      name: "Claire Sterling",
      neighborhood: "NW 23rd Ave, Portland",
      project: "Full Penthouse Renovation",
    },
  ];

  const faqs = [
    {
      q: "What does the free 45-minute consultation include?",
      a: "Our principal designer, Dana Whitfield, reviews your questionnaire, examines your current space (either in-home or via virtual walk-through), discusses structural possibilities, explains Portland permitting timelines (BDS), and provides a realistic budget range.",
    },
    {
      q: "What is your typical project budget minimum?",
      a: "Our focused architectural remodels typically start at $25,000 for single bathrooms and $45,000 for full kitchen remodels. We take on a strictly limited number of homes each quarter to ensure senior designer attention.",
    },
    {
      q: "How quickly do you reply after I submit my project questionnaire?",
      a: "Within 1 business hour. You will receive an immediate SMS with Dana's calendar availability and a curated lookbook of our Portland projects so you can explore material palettes right away.",
    },
    {
      q: "Can I choose between an in-home visit and a video consultation?",
      a: "Yes! On our booking screen you can choose whichever format fits your schedule. Both include 45 minutes of dedicated time with our principal design team.",
    },
  ];

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent-soft selection:text-text">
      <EntrySequence />
      <FunnelNav />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 py-20 overflow-hidden">
        {/* Warm Cinematic Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-scenic scale-105"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(246, 243, 238, 0.3) 0%, rgba(246, 243, 238, 0.85) 60%, rgba(246, 243, 238, 1) 100%), url('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1800&q=80')`,
          }}
        />

        <div className="relative z-10 max-w-[1200px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-chip bg-surface border border-border text-xs font-semibold text-text-2 shadow-sh-1">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span>Portland Architectural Remodeling</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-text leading-[1.04]">
              {BRAND.copy.heroH1}
            </h1>

            <p className="text-base sm:text-lg text-text-2 max-w-2xl leading-relaxed">
              {BRAND.copy.heroSub}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Button
                size="lg"
                variant="primary"
                onClick={() => navigate('/start')}
                icon={<ArrowRight className="w-4 h-4" />}
                className="text-base font-semibold shadow-sh-2"
              >
                Plan my consultation
              </Button>

              <button
                onClick={() => {
                  document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-3 rounded-input text-sm font-medium text-text hover:bg-sunken border border-transparent hover:border-border transition-colors text-center"
              >
                See recent kitchens ↓
              </button>
            </div>

            {/* Proof strip */}
            <div className="pt-8 border-t border-border/80 grid grid-cols-3 gap-4 sm:gap-8 max-w-xl">
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-medium text-text">212</div>
                <div className="text-xs text-text-muted mt-0.5">Homes completed</div>
              </div>
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-medium text-text flex items-center gap-1">
                  <span>4.9</span>
                  <Star className="w-4 h-4 fill-accent text-accent inline" />
                </div>
                <div className="text-xs text-text-muted mt-0.5">Average client rating</div>
              </div>
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-medium text-primary flex items-center gap-1">
                  <Clock className="w-4 h-4 inline" />
                  <span>&lt; 1 hr</span>
                </div>
                <div className="text-xs text-text-muted mt-0.5">Staff reply time</div>
              </div>
            </div>
          </div>

          {/* Quick Consultation Booking Card */}
          <div className="lg:col-span-4 bg-surface-elevated/95 backdrop-blur-md rounded-modal p-6 sm:p-7 border border-border shadow-sh-2 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="text-xs font-semibold text-text uppercase tracking-wider">Free Consultation</span>
              <span className="text-[11px] font-medium text-accent bg-accent-soft px-2 py-0.5 rounded-chip">45 Minutes</span>
            </div>

            <h3 className="font-serif text-xl font-medium text-text">
              Meet Principal Designer Dana Whitfield
            </h3>

            <p className="text-xs text-text-2 leading-relaxed">
              No pressure, no aggressive sales. We review your layout ideas, examine photos, and establish budget benchmarks.
            </p>

            <div className="space-y-2 text-xs text-text-2 bg-sunken/60 p-3.5 rounded-input border border-border">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-success shrink-0" />
                <span>Instant SMS & lookbook confirmation</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-success shrink-0" />
                <span>Video conference or in-home walk-through</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-success shrink-0" />
                <span>Permit assessment for City of Portland</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full font-semibold"
              onClick={() => navigate('/start')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Start 2-Minute Survey
            </Button>
          </div>
        </div>
      </section>

      {/* Section 1: Process */}
      <section id="process" className="py-24 px-4 sm:px-6 max-w-[1200px] mx-auto border-t border-border">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <p className="text-xs font-semibold text-accent tracking-[0.2em] uppercase">How We Work</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-text">
            Three simple steps to your dream space.
          </h2>
          <p className="text-sm text-text-2">
            We replaced the chaotic contractor bidding process with thoughtful design collaboration and automated clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-surface p-7 rounded-card border border-border shadow-sh-1 space-y-4 relative">
            <span className="font-serif text-4xl font-normal text-primary/30">01</span>
            <h3 className="font-serif text-xl font-medium text-text">Tell us about your space</h3>
            <p className="text-xs text-text-2 leading-relaxed">
              Answer 5 short questions about your room, target budget, and desired start date. Our senior team evaluates every questionnaire immediately.
            </p>
            <div className="text-xs text-primary font-semibold">2 minutes online →</div>
          </div>

          <div className="bg-surface p-7 rounded-card border border-border shadow-sh-1 space-y-4 relative">
            <span className="font-serif text-4xl font-normal text-primary/30">02</span>
            <h3 className="font-serif text-xl font-medium text-text">Meet for a 45-min consult</h3>
            <p className="text-xs text-text-2 leading-relaxed">
              Choose an in-home visit or video appointment. We discuss layout possibilities, structural considerations, and realistic costs.
            </p>
            <div className="text-xs text-primary font-semibold">Live calendar booking →</div>
          </div>

          <div className="bg-surface p-7 rounded-card border border-border shadow-sh-1 space-y-4 relative">
            <span className="font-serif text-4xl font-normal text-primary/30">03</span>
            <h3 className="font-serif text-xl font-medium text-text">Plan & build with confidence</h3>
            <p className="text-xs text-text-2 leading-relaxed">
              Receive a detailed architectural scope of work and fixed pricing breakdown. You approve every material sample before construction starts.
            </p>
            <div className="text-xs text-primary font-semibold">Guaranteed timelines →</div>
          </div>
        </div>
      </section>

      {/* Section 2: Recent Work Gallery */}
      <section id="work" className="py-24 px-4 sm:px-6 bg-surface border-t border-b border-border">
        <div className="max-w-[1200px] mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-accent tracking-[0.2em] uppercase">Featured Portfolio</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-text">
                Recent Portland transformations.
              </h2>
            </div>
            <p className="text-xs text-text-muted max-w-sm">
              Each project is custom-designed for the unique architectural character of Pacific Northwest neighborhoods.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.slice(0, 3).map((proj) => (
              <div key={proj.title} className="group bg-surface-elevated rounded-card overflow-hidden border border-border shadow-sh-1 hover:shadow-sh-2 transition-all">
                <div className="aspect-[3/2] overflow-hidden bg-sunken">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
                  />
                </div>
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-accent flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {proj.neighborhood}
                    </span>
                    <span className="font-mono text-text-muted">{proj.budget}</span>
                  </div>
                  <h3 className="font-serif text-lg font-medium text-text group-hover:text-primary transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-text-2 leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/start')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Start My Project Questionnaire
            </Button>
          </div>
        </div>
      </section>

      {/* Section 4: Testimonials */}
      <section className="py-24 px-4 sm:px-6 max-w-[1000px] mx-auto text-center space-y-10">
        <p className="text-xs font-semibold text-accent tracking-[0.2em] uppercase">Homeowner Voices</p>
        
        <div className="min-h-[160px] flex items-center justify-center">
          <blockquote className="font-serif text-xl sm:text-2xl md:text-3xl text-text leading-snug max-w-3xl">
            "{testimonials[testimonialIdx].quote}"
          </blockquote>
        </div>

        <div className="space-y-1">
          <div className="text-sm font-semibold text-text">{testimonials[testimonialIdx].name}</div>
          <div className="text-xs text-text-muted">
            {testimonials[testimonialIdx].neighborhood} · {testimonials[testimonialIdx].project}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 pt-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setTestimonialIdx(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === testimonialIdx ? 'w-8 bg-primary' : 'bg-border-strong'
              }`}
              aria-label={`Testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Section 5: FAQ */}
      <section id="faq" className="py-24 px-4 sm:px-6 bg-surface border-t border-border">
        <div className="max-w-[800px] mx-auto space-y-8">
          <div className="text-center space-y-2">
            <p className="text-xs font-semibold text-accent tracking-[0.2em] uppercase">Got Questions?</p>
            <h2 className="font-serif text-3xl font-normal text-text">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={faq.q}
                className="bg-surface-elevated rounded-card border border-border overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between text-sm font-medium text-text hover:text-primary"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-base ${
                    openFaq === idx ? 'rotate-180 text-primary' : ''
                  }`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-text-2 leading-relaxed border-t border-border/40">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <FunnelFooter />
    </div>
  );
};
