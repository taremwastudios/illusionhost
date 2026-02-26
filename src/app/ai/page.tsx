"use client";

import { useState } from "react";

interface AICard {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  popular?: boolean;
}

export default function AIPage() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const aiProducts: AICard[] = [
    {
      id: "virtualbox",
      title: "Illusion VirtualBox Code Agent",
      description: "Advanced AI coding assistant for complex development tasks. Get $100k in free credits when you're on a Professional plan!",
      icon: "🤖",
      features: [
        "Complex code generation",
        "Full-stack development",
        "Debugging & optimization",
        "Code refactoring",
        "API integration",
        "Database design",
        "Security auditing",
        "Documentation generation"
      ]
    },
    {
      id: "vg4",
      title: "Illusion vG 4 - Game Code Agent",
      description: "The world's most powerful AI game development assistant. Built specifically for game studios!",
      icon: "🎮",
      popular: true,
      features: [
        "3D/2D sprite creation",
        "3D tools & graphics rendering",
        "Advanced modeling",
        "100 lines of code/second",
        ".apk packaging",
        "Web export templates",
        "Flutter templates",
        "Beta VR render mode"
      ]
    }
  ];

  const techSpecs = [
    { label: "Code Generation Speed", value: "100 lines/second" },
    { label: "Supported Platforms", value: "Web, Mobile, Desktop, VR" },
    { label: "3D Rendering", value: "Real-time ray tracing" },
    { label: "AI Models", value: "GPT-5 + Custom Game AI" },
    { label: "Export Formats", value: "APK, IPA, Web, Flutter, Unity" },
    { label: "VR Support", value: "Oculus, Vive, Mixed Reality" }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="hero" style={{
        background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Animated background particles */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
          animation: "pulse 8s ease-in-out infinite"
        }} />

        <div className="hero-content" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🧠</div>
          <h1 style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>
            <span style={{ color: "#a78bfa" }}>Illusion</span> AI Suite
          </h1>
          <p style={{ 
            fontSize: "1.5rem", 
            maxWidth: "800px", 
            margin: "0 auto 2rem",
            color: "rgba(255,255,255,0.85)",
            lineHeight: "1.6"
          }}>
            Next-generation AI tools for developers and game studios. 
            Build faster, create smarter.
          </p>
          <div style={{ 
            display: "flex", 
            gap: "1rem", 
            justifyContent: "center", 
            flexWrap: "wrap",
            marginBottom: "2rem"
          }}>
            <a href="#products" style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
              color: "white",
              padding: "1rem 2.5rem",
              borderRadius: "0.75rem",
              fontWeight: "600",
              textDecoration: "none",
              fontSize: "1.1rem",
              boxShadow: "0 4px 20px rgba(139, 92, 246, 0.4)"
            }}>
              Explore AI Products
            </a>
            <a href="#specs" style={{
              background: "transparent",
              color: "white",
              padding: "1rem 2.5rem",
              borderRadius: "0.75rem",
              fontWeight: "600",
              textDecoration: "none",
              fontSize: "1.1rem",
              border: "2px solid rgba(255,255,255,0.3)"
            }}>
              View Tech Specs
            </a>
          </div>
          
          {/* Stats */}
          <div style={{ 
            display: "flex", 
            gap: "3rem", 
            justifyContent: "center", 
            flexWrap: "wrap",
            marginTop: "3rem"
          }}>
            <div>
              <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#a78bfa" }}>100K</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>Free Credits</div>
            </div>
            <div>
              <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#a78bfa" }}>100</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>Lines/Second</div>
            </div>
            <div>
              <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#a78bfa" }}>24/7</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>AI Availability</div>
            </div>
            <div>
              <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#a78bfa" }}>∞</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>Possibilities</div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Products Section */}
      <section id="products" className="container" style={{ padding: "5rem 2rem" }}>
        <div className="section-header">
          <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>AI Products</h2>
          <p style={{ fontSize: "1.125rem", color: "var(--text-light)", maxWidth: "600px", margin: "0 auto" }}>
            Cutting-edge AI tools designed to supercharge your development workflow
          </p>
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", 
          gap: "2rem",
          marginTop: "3rem"
        }}>
          {aiProducts.map((product) => (
            <div 
              key={product.id}
              onClick={() => setExpandedCard(expandedCard === product.id ? null : product.id)}
              style={{
                background: expandedCard === product.id 
                  ? "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)"
                  : "white",
                borderRadius: "1.5rem",
                padding: "2.5rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: product.popular 
                  ? "2px solid #8b5cf6" 
                  : "2px solid transparent",
                boxShadow: product.popular
                  ? "0 20px 60px rgba(139, 92, 246, 0.3)"
                  : "0 4px 20px rgba(0,0,0,0.1)",
                position: "relative",
                overflow: "hidden"
              }}
            >
              {product.popular && (
                <div style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  color: "white",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "1rem",
                  fontSize: "0.75rem",
                  fontWeight: "600"
                }}>
                  ⭐ MOST POPULAR
                </div>
              )}

              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{product.icon}</div>
              <h3 style={{ 
                fontSize: "1.75rem", 
                marginBottom: "1rem",
                color: expandedCard === product.id ? "#a78bfa" : "var(--dark)"
              }}>
                {product.title}
              </h3>
              <p style={{ 
                color: expandedCard === product.id ? "rgba(255,255,255,0.8)" : "var(--text-light)",
                marginBottom: "1.5rem",
                lineHeight: "1.6"
              }}>
                {product.description}
              </p>

              {/* Expandable Features */}
              <div style={{
                maxHeight: expandedCard === product.id ? "500px" : "0",
                overflow: "hidden",
                transition: "all 0.3s ease"
              }}>
                <div style={{
                  paddingTop: "1rem",
                  borderTop: expandedCard === product.id 
                    ? "1px solid rgba(139, 92, 246, 0.3)" 
                    : "none"
                }}>
                  <h4 style={{ 
                    marginBottom: "1rem",
                    color: expandedCard === product.id ? "#a78bfa" : "var(--dark)"
                  }}>
                    ✨ Features
                  </h4>
                  <ul style={{ 
                    listStyle: "none", 
                    padding: 0,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.75rem"
                  }}>
                    {product.features.map((feature, idx) => (
                      <li key={idx} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: expandedCard === product.id ? "rgba(255,255,255,0.85)" : "var(--text)",
                        fontSize: "0.9rem"
                      }}>
                        <span style={{ color: "#8b5cf6" }}>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{
                marginTop: "1.5rem",
                paddingTop: "1rem",
                borderTop: expandedCard === product.id 
                  ? "1px solid rgba(139, 92, 246, 0.3)" 
                  : "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span style={{ 
                  color: expandedCard === product.id ? "#a78bfa" : "var(--primary)",
                  fontWeight: "600",
                  fontSize: expandedCard === product.id ? "1.1rem" : "1rem"
                }}>
                  {product.id === "vg4" ? "For Game Studios" : "Free for Professional+"}
                </span>
                <span style={{ 
                  color: expandedCard === product.id ? "rgba(255,255,255,0.6)" : "var(--text-light)",
                  fontSize: "0.875rem"
                }}>
                  {expandedCard === product.id ? "▲ Click to collapse" : "▼ Click to expand"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Special Offer Banner */}
      <section className="container" style={{ padding: "0 2rem", marginBottom: "3rem" }}>
        <div style={{
          background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
          borderRadius: "1.5rem",
          padding: "3rem",
          textAlign: "center",
          color: "white",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute",
            top: "-50%",
            left: "-20%",
            width: "60%",
            height: "200%",
            background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
            animation: "pulse 4s ease-in-out infinite"
          }} />
          
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎁</div>
            <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
              Special Offer for Professional Plan Users!
            </h2>
            <p style={{ 
              fontSize: "1.25rem", 
              maxWidth: "600px", 
              margin: "0 auto 2rem",
              opacity: 0.9
            }}>
              Get <strong>$100,000</strong> in free credits for Illusion VirtualBox Code Agent!
              That&apos;s enough to last almost <strong>12 months</strong> of heavy usage.
            </p>
            <a href="/pricing" style={{
              background: "white",
              color: "#7c3aed",
              padding: "1rem 2.5rem",
              borderRadius: "0.75rem",
              fontWeight: "600",
              textDecoration: "none",
              display: "inline-block",
              fontSize: "1.1rem"
            }}>
              Upgrade to Professional
            </a>
          </div>
        </div>
      </section>

      {/* Tech Specs Section */}
      <section id="specs" className="container" style={{ padding: "5rem 2rem" }}>
        <div className="section-header">
          <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Cutting-Edge Technology</h2>
          <p style={{ fontSize: "1.125rem", color: "var(--text-light)", maxWidth: "600px", margin: "0 auto" }}>
            Built on the latest AI models and rendering engines
          </p>
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
          gap: "1.5rem",
          marginTop: "3rem"
        }}>
          {techSpecs.map((spec, idx) => (
            <div key={idx} style={{
              background: "var(--surface)",
              borderRadius: "1rem",
              padding: "1.5rem",
              border: "1px solid var(--border)"
            }}>
              <div style={{ 
                color: "var(--text-light)", 
                fontSize: "0.875rem",
                marginBottom: "0.5rem"
              }}>
                {spec.label}
              </div>
              <div style={{ 
                color: "var(--dark)", 
                fontSize: "1.25rem", 
                fontWeight: "600" 
              }}>
                {spec.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* vG 4 Features Deep Dive */}
      <section className="container" style={{ padding: "5rem 2rem", background: "var(--surface)", borderRadius: "2rem", marginBottom: "3rem" }}>
        <div className="section-header">
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎮</div>
          <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Illusion vG 4</h2>
          <p style={{ fontSize: "1.125rem", color: "var(--text-light)", maxWidth: "700px", margin: "0 auto" }}>
            The greatest game code agent in the world. Designed specifically for game studios of all sizes.
          </p>
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
          gap: "1.5rem",
          marginTop: "3rem"
        }}>
          {[
            { icon: "🎨", title: "3D/2D Sprites", desc: "Generate stunning sprites and textures instantly" },
            { icon: "🔮", title: "3D Rendering", desc: "Real-time 3D tools and graphics rendering" },
            { icon: "🏗️", title: "Modeling", desc: "AI-powered 3D modeling and sculpting" },
            { icon: "⚡", title: "100 Lines/sec", desc: "Blazing fast code generation speed" },
            { icon: "📦", title: "Multi-Export", desc: "Package to .apk, web, Flutter, and more" },
            { icon: "🥽", title: "VR Beta", desc: "Experimental VR rendering technology" },
            { icon: "🎯", title: "Game Templates", desc: "Ready-to-use game templates and assets" },
            { icon: "🔄", title: "Auto-Update", desc: "Continuous integration with your codebase" }
          ].map((feature, idx) => (
            <div key={idx} style={{
              background: "white",
              borderRadius: "1rem",
              padding: "1.5rem",
              border: "1px solid var(--border)",
              transition: "transform 0.2s",
              cursor: "default"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{feature.icon}</div>
              <h4 style={{ marginBottom: "0.5rem", color: "var(--dark)" }}>{feature.title}</h4>
              <p style={{ color: "var(--text-light)", fontSize: "0.9rem", margin: 0 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container" style={{ padding: "5rem 2rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Ready to Build with AI?</h2>
        <p style={{ fontSize: "1.125rem", color: "var(--text-light)", marginBottom: "2rem", maxWidth: "500px", margin: "0 auto 2rem" }}>
          Get started with our AI tools today. Professional plan members get $100k in free credits!
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/pricing" style={{
            background: "var(--primary)",
            color: "white",
            padding: "1rem 2rem",
            borderRadius: "0.75rem",
            fontWeight: "600",
            textDecoration: "none"
          }}>
            View Plans
          </a>
          <a href="/contact" style={{
            background: "transparent",
            color: "var(--primary)",
            padding: "1rem 2rem",
            borderRadius: "0.75rem",
            fontWeight: "600",
            textDecoration: "none",
            border: "2px solid var(--primary)"
          }}>
            Contact Sales
          </a>
        </div>
      </section>
    </>
  );
}
