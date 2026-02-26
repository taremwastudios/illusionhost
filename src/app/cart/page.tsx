export default function CartPage() {
  return (
    <>
      <section className="page-header">
        <h1>Shopping Cart</h1>
        <p>Manage your domain and hosting purchases.</p>
      </section>

      <section className="container">
        <div style={{ 
          background: "white", 
          padding: "3rem", 
          borderRadius: "1rem", 
          boxShadow: "0 10px 40px -12px rgba(0, 0, 0, 0.1)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🛒</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--dark)", marginBottom: "0.75rem" }}>
            Your cart is empty
          </h2>
          <p style={{ color: "var(--text-light)", marginBottom: "2rem" }}>
            Browse our domain names and hosting plans to get started.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/domains" className="domain-action-btn">Search Domains</a>
            <a href="/hosting" className="domain-action-btn" style={{ background: "var(--dark-secondary)" }}>View Hosting</a>
          </div>
        </div>
      </section>
    </>
  );
}
