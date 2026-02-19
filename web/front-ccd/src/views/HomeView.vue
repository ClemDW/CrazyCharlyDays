<script setup lang="ts"></script>

<template>
  <div class="home">
    <!-- Full-width banner -->
    <section class="banner">
      <img src="@/assets/fond.webp" alt="Toys Academy" class="banner-img" />
    </section>

    <!-- Intro text -->
    <section class="intro">
      <h1>Toys Academy</h1>
      <p class="tagline">
        Collecte, tri, nettoyage et revalorisation de dons de jeux, jouets et
        livres pour enfants.
      </p>
    </section>

    <!-- Description cards -->
    <section class="features">
      <div class="feature-card">
        <span class="feature-icon">♻️</span>
        <h3>Revalorisation</h3>
        <p>
          Tri, nettoyage et remise en état de jeux, jouets et livres pour leur
          donner une seconde vie.
        </p>
      </div>

      <div class="feature-card">
        <span class="feature-icon">🛍️</span>
        <h3>Prix solidaires</h3>
        <p>
          Revente à prix accessibles en boutique et sur notre e-shop pour que
          chaque enfant puisse jouer.
        </p>
      </div>

      <div class="feature-card">
        <span class="feature-icon">🎨</span>
        <h3>Ateliers</h3>
        <p>
          Ateliers parentalité et sensibilisation à l'environnement avec de
          l'upcycling de jouets pour s'approprier l'anti-gaspi de façon ludique.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  font-family: "Inter", "Segoe UI", sans-serif;
}

/* ---- Banner ---- */
.banner {
  width: 100%;
  line-height: 0;
}

.banner-img {
  width: 60%;
  height: auto;
  display: block;
  object-fit: contain;
  margin: 0 auto;
}

/* ---- Intro ---- */
.intro {
  text-align: center;
  padding: 2rem 1.5rem 0.5rem;
}

.intro h1 {
  font-size: 2rem;
  font-weight: 800;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.tagline {
  font-size: 1.05rem;
  color: #444;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

/* ---- Features ---- */
.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 900px;
  margin: 2rem auto 3rem;
  padding: 0 1.5rem;
  position: relative;
  z-index: 1;
}

.feature-card {
  background: #fff;
  border: 1px solid #e8e8ee;
  border-radius: 12px;
  padding: 1.75rem 1.5rem;
  text-align: center;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.feature-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.75rem;
}

.feature-card h3 {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
}

.feature-card p {
  font-size: 0.88rem;
  color: #666;
  line-height: 1.55;
}

/* ---- Responsive ---- */
@media (max-width: 768px) {
  .features {
    grid-template-columns: 1fr;
    margin-top: 1.5rem;
  }

  .hero {
    min-height: 260px;
  }

  .hero-overlay {
    padding: 1.5rem 1.5rem;
  }

  .hero-overlay h1 {
    font-size: 1.8rem;
  }
}

@media (min-width: 769px) and (max-width: 960px) {
  .features {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
