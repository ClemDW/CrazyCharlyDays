<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <nav class="navbar">
    <RouterLink to="/" class="nav-brand">
      <img src="@/assets/logo.webp" alt="Toys Academy" class="nav-logo" />
      <span class="nav-title">Toys Academy</span>
    </RouterLink>

    <input type="checkbox" id="nav-toggle" class="nav-toggle" />
    <label for="nav-toggle" class="nav-burger" aria-label="Menu">
      <span></span>
      <span></span>
      <span></span>
    </label>

    <div class="nav-links">
      <RouterLink to="/">Accueil</RouterLink>
      <RouterLink to="/auth">Inscription</RouterLink>
      <RouterLink to="/create-article">Créer un article</RouterLink>
      <RouterLink to="/admin/campaign">Campagne</RouterLink>
      <RouterLink to="/admin/boxes">Box composées</RouterLink>
      <RouterLink to="/admin/subscribers">Abonnés</RouterLink>
      <RouterLink to="/my-box">Ma Box</RouterLink>
    </div>
  </nav>

  <main class="page-content">
    <RouterView />
  </main>

  <footer class="site-footer">
    <span>Toys Academy — Association déclarée</span>
    <span>SIRET : 92791954800010</span>
    <span>54700 JEZAINVILLE</span>
  </footer>
</template>

<style>
/* ---- Reset & base ---- */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Inter", "Segoe UI", system-ui, sans-serif;
  color: #1a1a2e;
  background: #d9eaf7;
  min-height: 100vh;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ---- Navbar ---- */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 2rem;
  background: #ffffff;
  border-bottom: 1px solid #e8e8ee;
  position: sticky;
  top: 0;
  z-index: 100;
  flex-wrap: wrap;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  color: #1a1a2e;
}

.nav-logo {
  height: 36px;
  width: auto;
  border-radius: 6px;
}

.nav-title {
  font-weight: 700;
  font-size: 1.15rem;
  letter-spacing: -0.02em;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav-links a {
  text-decoration: none;
  color: #555;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.45rem 0.9rem;
  border-radius: 6px;
  transition:
    background 0.15s,
    color 0.15s;
}

.nav-links a:hover {
  background: #f0f1f5;
  color: #1a1a2e;
}

.nav-links a.router-link-exact-active {
  background: #eef2ff;
  color: #4f6cff;
  font-weight: 600;
}

/* Burger (hidden on desktop) */
.nav-toggle {
  display: none;
}

.nav-burger {
  display: none;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  padding: 0.5rem;
}

.nav-burger span {
  display: block;
  width: 22px;
  height: 2.5px;
  background: #333;
  border-radius: 2px;
  transition:
    transform 0.2s,
    opacity 0.2s;
}

/* Mobile */
@media (max-width: 640px) {
  .navbar {
    padding: 0.6rem 1rem;
  }

  .nav-burger {
    display: flex;
  }

  .nav-links {
    display: none;
    width: 100%;
    flex-direction: column;
    gap: 0;
    padding: 0.5rem 0;
  }

  .nav-links a {
    width: 100%;
    padding: 0.65rem 1rem;
    border-radius: 0;
    font-size: 0.95rem;
  }

  .nav-toggle:checked ~ .nav-links {
    display: flex;
  }

  .nav-toggle:checked ~ .nav-burger span:nth-child(1) {
    transform: rotate(45deg) translate(4px, 5px);
  }

  .nav-toggle:checked ~ .nav-burger span:nth-child(2) {
    opacity: 0;
  }

  .nav-toggle:checked ~ .nav-burger span:nth-child(3) {
    transform: rotate(-45deg) translate(4px, -5px);
  }
}

/* ---- Page content ---- */
.page-content {
  flex: 1;
}

/* ---- Footer ---- */
.site-footer {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding: 1.25rem 2rem;
  border-top: 1px solid #e8e8ee;
  font-size: 0.8rem;
  color: #999;
  background: #fff;
}

@media (max-width: 640px) {
  .site-footer {
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    text-align: center;
  }
}
</style>
