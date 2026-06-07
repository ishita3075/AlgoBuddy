"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";

const policySections = [
  { id: "information", title: "Information We Collect", points: ["Personal information like name and email address", "Usage data such as IP address and browser type", "Interaction data to improve our services"] },
  { id: "usage", title: "How We Use Your Information", points: ["To provide and maintain our services", "Improve user experience and service quality", "Send important updates or support emails"] },
  { id: "cookies", title: "Cookies & Tracking", points: ["We use cookies to enhance your browsing experience", "Analytics cookies help us understand usage patterns", "You can disable cookies in your browser settings"] },
  { id: "sharing", title: "Data Sharing", points: ["We do not sell your personal data to third parties", "Data may be shared with trusted service providers", "We may disclose data if required by law"] },
  { id: "rights", title: "Your Rights", points: ["Right to access your personal data", "Right to request correction of inaccurate data", "Right to request deletion of your data"] },
  { id: "contact", title: "Contact Information", points: ["Email us at hello@algobuddy.in", "We aim to respond within 48 hours", "For urgent matters mention Privacy Request in subject"] },
];

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
      setShowBackToTop(scrollTop > 300);
      let current = "";
      policySections.forEach((section) => {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top <= 120) current = section.id;
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[var(--udemy-dark-bg)] font-sans">
      <div className="fixed top-0 left-0 z-[9999] h-1 bg-[var(--color-primary)] transition-all duration-150" style={{ width: scrollProgress + "%" }} />
      <Navbar />
      <main className="container-app section-app">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)] font-sans">Privacy Policy</h1>
            <p className="text-sm text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)] font-sans">Last updated: June 7, 2026</p>
            <p className="mt-3 text-base text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)] leading-relaxed font-sans">Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p>
          </div>
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-20 rounded-xl border border-[var(--udemy-border)] dark:border-[var(--udemy-dark-border)] p-4">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)] font-sans">Contents</h2>
                <ul className="space-y-1">
                  {policySections.map((item) => (
                    <li key={item.id}>
                      <button onClick={() => scrollToSection(item.id)} className={"w-full text-left text-sm px-3 py-2 rounded-lg transition-colors font-sans " + (activeSection === item.id ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold" : "text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)] hover:text-[var(--color-primary)]")}>
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
            <div className="flex-1 space-y-6">
              {policySections.map((section) => (
                <div key={section.id} id={section.id} className="scroll-mt-24 rounded-xl border border-[var(--udemy-border)] dark:border-[var(--udemy-dark-border)] p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-sm font-semibold text-[var(--color-primary)] font-sans">{policySections.indexOf(section) + 1}</span>
                    <h2 className="text-lg font-semibold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)] font-sans">{section.title}</h2>
                  </div>
                  <ul className="space-y-2 pl-10">
                    {section.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[var(--color-primary)]" />
                        <span className="text-sm text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)] leading-relaxed font-sans">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="pt-4 border-t border-[var(--udemy-border)] dark:border-[var(--udemy-dark-border)]">
                <Link href="/" className="text-sm text-[var(--color-primary)] hover:underline font-sans">Back to Home</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {showBackToTop && (
        <button onClick={scrollToTop} className="fixed bottom-8 right-8 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-lg hover:opacity-90 transition-opacity" aria-label="Back to top">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
        </button>
      )}
    </div>
  );
}
