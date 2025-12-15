import React, { useState } from "react";
import {
  PawPrint,
  Crown,
  Award,
  CheckCircle,
  Bell,
  Calendar,
  Heart,
  Users,
  Shield,
  BarChart3,
  FileText,
  Clock,
  ChevronRight,
  Star,
  TrendingUp,
  Activity,
  Zap,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  ArrowRight,
  Sparkles,
  Check,
  Target,
  Zap as Lightning,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/furfurlogo.png";
import landing from "../assets/landing.jpg";

const LandingPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail("");
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  const features = [
    {
      icon: <Bell size={24} />,
      title: "Smart Reminders",
      description:
        "Never miss feeding, medication, or vet appointments with intelligent notifications.",
    },
    {
      icon: <Calendar size={24} />,
      title: "Schedule Management",
      description:
        "Organize daily, weekly, and monthly care routines for all your pets.",
    },
    {
      icon: <Heart size={24} />,
      title: "Health Tracking",
      description:
        "Monitor vaccinations, vet visits, and health milestones in one place.",
    },
    {
      icon: <Users size={24} />,
      title: "Multi-Pet Support",
      description:
        "Manage profiles for all your furry, feathery, and scaly friends.",
    },
    {
      icon: <Shield size={24} />,
      title: "Care Tips & Advice",
      description:
        "Get personalized pet care recommendations based on your pets' needs.",
    },
    {
      icon: <FileText size={24} />,
      title: "Export & Reports",
      description:
        "Generate health reports and export schedules for vet visits.",
    },
  ];

  const plans = [
    {
      id: "free",
      name: "Free Mode",
      displayName: "Free Plan",
      price: "₱0",
      priceLabel: "Forever Free",
      color: "from-gray-400 to-gray-500",
      textColor: "text-gray-600",
      bgColor: "bg-gradient-to-b from-white to-gray-50",
      borderColor: "border-gray-200",
      icon: <PawPrint className="text-gray-500" size={24} />,
      features: [
        "Basic pet profile",
        "Limited care reminders",
        "Up to 2 pet profiles",
        "Basic schedule tracking",
      ],
      buttonColor: "bg-gray-600 hover:bg-gray-700 text-white",
      highlight: false,
      iconBg: "bg-gray-100",
    },
    {
      id: "premium1",
      name: "Premium Tier 1",
      displayName: "Premium Tier 1",
      price: "₱49.99",
      priceLabel: "per month",
      color: "from-[#c18742] to-[#a87338]",
      textColor: "text-[#a87338]",
      bgColor: "bg-gradient-to-b from-white to-[#fff9f0]",
      borderColor: "border-[#ffd68e]",
      icon: <Crown className="text-[#c18742]" size={24} />,
      features: [
        "Everything in Free Plan",
        "Up to 5 pet profiles",
        "Unlock Health Records",
        "Advanced reminders",
        "Priority support",
      ],
      buttonColor:
        "bg-gradient-to-r from-[#c18742] to-[#a87338] hover:from-[#b3773a] hover:to-[#95632f] text-white",
      highlight: true,
      recommended: true,
      iconBg: "bg-[#ffd68e]/30",
    },
    {
      id: "premium2",
      name: "Premium Tier 2",
      displayName: "Premium Tier 2",
      price: "₱99.99",
      priceLabel: "per month",
      color: "from-[#55423c] to-[#6a524a]",
      textColor: "text-[#55423c]",
      bgColor: "bg-gradient-to-b from-white to-[#f8f6f4]",
      borderColor: "border-[#e8d7ca]",
      icon: <Award className="text-[#55423c]" size={24} />,
      features: [
        "Everything in Premium Tier 1",
        "Up to 10 pet profiles",
        "Unlock Pet Care Tip Feeds",
        "Unlock export schedule",
        "Advanced analytics",
        "Unlimited reminders",
        "24/7 premium support",
      ],
      buttonColor:
        "bg-gradient-to-r from-[#55423c] to-[#6a524a] hover:from-[#45312b] hover:to-[#59413b] text-white",
      highlight: false,
      iconBg: "bg-[#e8d7ca]/40",
    },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Cat Owner",
      content:
        "FurFur has made managing my three cats so much easier! The vaccination reminders are a lifesaver.",
      avatar: "🐱",
    },
    {
      name: "John D.",
      role: "Dog Owner",
      content:
        "As a busy professional, I used to forget my dog's medication. Now, I never miss a dose!",
      avatar: "🐶",
    },
    {
      name: "Maria L.",
      role: "Multiple Pet Owner",
      content:
        "Managing 2 dogs, 3 cats, and a parrot used to be chaotic. FurFur keeps everything organized!",
      avatar: "🦜",
    },
  ];

  const stats = [
    {
      value: "10,000+",
      label: "Happy Pets",
      icon: <Heart className="text-[#c18742]" size={20} />,
    },
    {
      value: "5,000+",
      label: "Active Users",
      icon: <Users className="text-[#c18742]" size={20} />,
    },
    {
      value: "99%",
      label: "Satisfaction Rate",
      icon: <Star className="text-[#c18742]" size={20} />,
    },
    {
      value: "24/7",
      label: "Support Available",
      icon: <Shield className="text-[#c18742]" size={20} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f6f4] to-white">
      {/* Navigation - Enhanced */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e8d7ca] shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <img src={logo} className="w-10 h-10" />

                <span className="text-2xl font-bold text-[#55423c]">
                  Fur<span className="text-[#c18742]">Fur</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 text-[#55423c] font-medium hover:text-[#c18742] transition-colors hover:bg-[#f8f6f4] rounded-lg"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-6 py-2 bg-gradient-to-r from-[#c18742] to-[#a87338] text-white rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105 shadow-md"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Enhanced */}
      <section
        className="relative overflow-hidden bg-cover bg-center min-h-[90vh] flex items-center"
        style={{ backgroundImage: `url(${landing})` }}
      >
        {/* Darker overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#a87338]/70 via-[#a87338]/50 to-[#a87338]/30"></div>

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.8'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Trust Badge - Enhanced */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-8 border border-white/30 shadow-lg animate-pulse-slow">
              <Sparkles size={16} className="text-[#ffd68e]" />
              Trusted by thousands of pet owners
              <Sparkles size={16} className="text-[#ffd68e]" />
            </div>

            {/* Main Heading with better contrast */}
            <div className="relative mb-8">
              {/* Text shadow effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent blur-xl"></div>
              <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight relative drop-shadow-2xl">
                Your Pet's Health,
                <span className="block text-[#ffd68e] mt-3">
                  Simplified & Organized
                </span>
              </h1>
            </div>

            {/* CTA Buttons - Enhanced */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button
                onClick={() => navigate("/register")}
                className="group relative px-8 py-4 bg-gradient-to-r from-[#c18742] via-[#d18f47] to-[#a87338] text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-3 shadow-xl overflow-hidden"
              >
                <span className="relative z-10">Start Free Trial</span>
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-2 transition-transform relative z-10"
                />
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </button>

              <a
                href="#plans"
                className="group relative px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all border-2 border-white/30 hover:border-white/50 flex items-center justify-center gap-3 shadow-lg"
              >
                <span className="relative z-10">View Plans</span>
                <ChevronRight
                  size={20}
                  className="group-hover:translate-x-2 transition-transform relative z-10"
                />
              </a>
            </div>

            {/* Stats - Enhanced with glass effect */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-white/40 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
                >
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-gradient-to-br from-[#ffd68e]/20 to-[#c18742]/20 rounded-xl group-hover:scale-110 transition-transform">
                      {React.cloneElement(stat.icon, {
                        className: `${stat.icon.props.className} group-hover:scale-110 transition-transform`,
                      })}
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-white mb-2 group-hover:text-[#ffd68e] transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/90 font-medium tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll indicator */}
            <div className="mt-16 animate-bounce">
              <div className="flex flex-col items-center gap-2 text-white/80">
                <span className="text-sm">Scroll to explore</span>
                <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated paw prints */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute text-white/5 text-4xl animate-float"
              style={{
                left: `${10 + i * 10}%`,
                top: `${20 + i * 8}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i}s`,
              }}
            >
              <PawPrint size={40} />
            </div>
          ))}
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className="py-16 bg-gradient-to-b from-white to-[#f8f6f4]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#55423c] mb-4">
              Everything Your Pet Needs
            </h2>
            <p className="text-lg text-[#795225] max-w-2xl mx-auto">
              Comprehensive tools to ensure your pet gets the best care possible
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-[#e8d7ca] hover:border-[#c18742] transition-all hover:shadow-xl group hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-[#ffd68e] to-[#c18742] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-[#55423c] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#795225] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Plans Section - CONSISTENT DESIGN */}
      <section id="plans" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#55423c] mb-4">
              Choose Your Perfect Plan
            </h2>
            <p className="text-lg text-[#795225] max-w-2xl mx-auto">
              Start with our free plan or upgrade for advanced features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl overflow-hidden border-2 ${
                  plan.recommended
                    ? "border-[#c18742] shadow-xl ring-2 ring-[#ffd68e]/30"
                    : "border-[#e8d7ca] shadow-lg"
                } bg-white transition-all duration-300 hover:shadow-xl`}
              >
                {plan.recommended && (
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-gradient-to-r from-[#c18742] to-[#ffd68e] text-white px-6 py-2 rounded-full shadow-lg">
                      <span className="text-sm font-bold flex items-center justify-center gap-1">
                        <Star size={12} fill="white" /> Most Popular
                      </span>
                    </div>
                  </div>
                )}

                <div
                  className={`p-8 flex-1 flex flex-col ${
                    plan.recommended ? "pt-12" : "pt-8"
                  }`}
                >
                  {/* Plan header - Consistent for all */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`p-3 rounded-lg ${
                        plan.recommended ? "bg-[#ffd68e]/20" : "bg-[#f8f6f4]"
                      }`}
                    >
                      {plan.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-[#55423c]">
                        {plan.price}
                      </div>
                      <div className="text-sm text-[#795225]">
                        {plan.priceLabel}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-[#55423c] mb-3">
                    {plan.displayName}
                  </h3>

                  <div className="mb-8 flex-1">
                    <div className="text-sm font-semibold text-[#795225] mb-4">
                      What's included:
                    </div>
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div
                            className={`p-1 rounded-full ${
                              plan.recommended
                                ? "bg-[#ffd68e]/20"
                                : "bg-[#f8f6f4]"
                            }`}
                          >
                            <CheckCircle
                              size={16}
                              className={`${
                                plan.recommended
                                  ? "text-[#c18742]"
                                  : "text-[#795225]"
                              }`}
                            />
                          </div>
                          <span className="text-[#55423c] text-sm">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      navigate("/register", { state: { plan: plan.id } })
                    }
                    className={`w-full py-3 font-semibold rounded-lg transition-all hover:shadow-md ${
                      plan.recommended
                        ? "bg-gradient-to-r from-[#c18742] to-[#a87338] text-white hover:from-[#b3773a] hover:to-[#95632f]"
                        : "bg-[#f8f6f4] text-[#55423c] hover:bg-[#e8d7ca] border border-[#e8d7ca]"
                    }`}
                  >
                    {plan.id === "free" ? "Get Started Free" : "Upgrade Now"}
                  </button>
                </div>

                {/* Decorative bottom accent - Same for all */}
                <div
                  className={`h-1 ${
                    plan.recommended
                      ? "bg-gradient-to-r from-[#c18742] to-[#ffd68e]"
                      : "bg-[#e8d7ca]"
                  }`}
                ></div>
              </div>
            ))}
          </div>

          {/* Plan comparison note */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 bg-[#f8f6f4] text-[#795225] px-4 py-3 rounded-lg border border-[#e8d7ca]">
              <CheckCircle size={16} className="text-[#c18742]" />
              <span className="text-sm">
                All plans include 14-day free trial • No credit card required •
                Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Enhanced */}
      <section className="py-16 bg-gradient-to-b from-[#f8f6f4] to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#55423c] mb-4">
              Loved by Pet Owners
            </h2>
            <p className="text-lg text-[#795225] max-w-2xl mx-auto">
              See what our community has to say about their experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-[#e8d7ca] hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#ffd68e] to-[#c18742] rounded-full flex items-center justify-center text-2xl shadow-md">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-[#55423c]">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-[#795225]">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <p className="text-[#55423c] italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex gap-1 mt-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="text-[#ffd68e] fill-current"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#55423c] to-[#6a524a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 "></div>
        </div>
        <div className="container relative mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
              <Zap size={16} />
              Limited Time Offer
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Give Your Pet Better Care?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of pet owners who trust FurFur with their pet's
              health
            </p>

            <div className="max-w-md mx-auto">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 text-white rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#ffd68e] text-[#55423c] shadow-lg"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#ffd68e] text-[#55423c] font-semibold rounded-lg hover:bg-[#e6c27d] transition-all hover:shadow-lg shadow-md"
                >
                  Start Free Trial
                </button>
              </form>

              {isSubmitted && (
                <p className="mt-3 text-[#ffd68e] font-medium flex items-center justify-center gap-2">
                  <Check size={18} />
                  Thank you! We'll be in touch soon.
                </p>
              )}

              <p className="text-sm text-white/80 mt-4">
                No credit card required • Free 14-day trial • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Enhanced */}
      <footer className="bg-[#f8f6f4] border-t border-[#e8d7ca]">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={logo} className="w-10 h-10" />
                <span className="text-2xl font-bold text-[#55423c]">
                  Fur<span className="text-[#c18742]">Fur</span>
                </span>
              </div>
              <p className="text-[#795225]">
                Making pet care simple, organized, and joyful.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[#55423c] mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-[#795225] hover:text-[#c18742] transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={14} /> Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#795225] hover:text-[#c18742] transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={14} /> Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#795225] hover:text-[#c18742] transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={14} /> Testimonials
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#55423c] mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-[#795225] hover:text-[#c18742] transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={14} /> About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#795225] hover:text-[#c18742] transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={14} /> Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#795225] hover:text-[#c18742] transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={14} /> Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#795225] hover:text-[#c18742] transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={14} /> Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#55423c] mb-4">Connect</h4>
              <div className="flex gap-4 mb-6">
                <a
                  href="#"
                  className="w-10 h-10 bg-white border border-[#e8d7ca] rounded-full flex items-center justify-center text-[#795225] hover:text-[#c18742] hover:border-[#c18742] transition-colors shadow-sm"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white border border-[#e8d7ca] rounded-full flex items-center justify-center text-[#795225] hover:text-[#c18742] hover:border-[#c18742] transition-colors shadow-sm"
                >
                  <Twitter size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white border border-[#e8d7ca] rounded-full flex items-center justify-center text-[#795225] hover:text-[#c18742] hover:border-[#c18742] transition-colors shadow-sm"
                >
                  <Instagram size={18} />
                </a>
              </div>
              <p className="text-sm text-[#795225]">
                Need help?{" "}
                <a
                  href="mailto:support@furfur.com"
                  className="text-[#c18742] hover:underline font-medium"
                >
                  support@furfur.com
                </a>
              </p>
            </div>
          </div>

          <div className="border-t border-[#e8d7ca] mt-8 pt-8 text-center text-[#795225] text-sm">
            <p>© {new Date().getFullYear()} FurFur. All rights reserved.</p>
            <p className="mt-2">
              Made with <span className="text-red-500">❤️</span> for pet lovers
              everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
