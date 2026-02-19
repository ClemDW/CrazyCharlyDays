<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import axios from "axios";

import SubscriberChildrenForm from "@/components/SubscriberChildrenForm.vue";
import { type Child, DEFAULT_CATEGORIES } from "@/constants/subscriber";
import { getCookie, setCookie } from "@/utils/cookie";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// --- State ---
const lastName = ref("");
const firstName = ref("");
const email = ref("");
const children = ref<Child[]>([]);
const errorMessage = ref("");
const successMessage = ref("");
const loading = ref(false);

// cookie helpers removed (moved to @/utils/cookie)

// --- Load from cookie on mount ---
onMounted(() => {
  const saved = getCookie("subscriber");
  if (!saved) return;
  try {
    const data = JSON.parse(saved);
    lastName.value = data.lastName || "";
    firstName.value = data.firstName || "";
    email.value = data.email || "";
    if (Array.isArray(data.children)) {
      children.value = data.children.map((c: any) => ({
        name: c.name || "",
        ageRange: c.ageRange || "",
        categories: Array.isArray(c.categories)
          ? c.categories.map((cat: any) => ({
              code: cat.code,
              label: cat.label,
            }))
          : DEFAULT_CATEGORIES.map((cat) => ({ ...cat })),
      }));
    }
    successMessage.value =
      "Vos informations ont été restaurées depuis votre dernière visite.";
  } catch {
    // Cookie invalide, on ignore
  }
});

// Child management handled by SubscriberChildrenForm

// --- Submit ---
async function handleSubmit() {
  errorMessage.value = "";
  successMessage.value = "";

  if (
    !lastName.value.trim() ||
    !firstName.value.trim() ||
    !email.value.trim()
  ) {
    errorMessage.value = "Veuillez remplir le nom, le prénom et l'email.";
    return;
  }

  if (children.value.length === 0) {
    errorMessage.value = "Veuillez ajouter au moins un enfant.";
    return;
  }

  for (const [i, child] of children.value.entries()) {
    if (!child.ageRange) {
      errorMessage.value = `Veuillez choisir une tranche d'âge pour l'enfant ${i + 1}.`;
      return;
    }
  }

  loading.value = true;
  try {
    // 1. Create the user
    const userRes = await axios.post(`${API_URL}/users`, {
      name: firstName.value.trim(),
      family_name: lastName.value.trim(),
      email: email.value.trim(),
      role: "USER",
    });
    const userId = userRes.data.id_user;

    // 2. Create child entries (preferences)
    for (const child of children.value) {
      await axios.post(`${API_URL}/usertochild`, {
        id_user: userId,
        age_range: child.ageRange,
        preference: child.categories.map((cat) => cat.code),
      });
    }

    // 3. Save to cookie (30 days)
    const payload = {
      userId,
      lastName: lastName.value.trim(),
      firstName: firstName.value.trim(),
      email: email.value.trim(),
      children: children.value.map((c) => ({
        ageRange: c.ageRange,
        categories: c.categories.map((cat) => ({
          code: cat.code,
          label: cat.label,
        })),
      })),
    };
    setCookie("subscriber", JSON.stringify(payload), 30);

    successMessage.value =
      "Inscription enregistrée avec succès ! Vos informations ont été sauvegardées.";
  } catch (error: any) {
    console.error("Erreur lors de l'inscription :", error);
    if (error.response?.status === 400) {
      errorMessage.value =
        "Cet email est déjà utilisé. Rendez-vous sur la page Profil pour modifier vos informations.";
    } else {
      errorMessage.value =
        error.response?.data?.message ||
        "Erreur lors de l'inscription. Veuillez réessayer.";
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="auth-container">
    <h1>Inscription Abonné</h1>
    <p class="subtitle">
      Renseignez vos informations. Elles seront mémorisées pour vos prochaines
      visites.
    </p>

    <form @submit.prevent="handleSubmit">
      <!-- Identity fields -->
      <div class="form-group">
        <label for="lastName">Nom</label>
        <input
          id="lastName"
          v-model="lastName"
          type="text"
          placeholder="Votre nom"
        />
      </div>

      <div class="form-group">
        <label for="firstName">Prénom</label>
        <input
          id="firstName"
          v-model="firstName"
          type="text"
          placeholder="Votre prénom"
        />
      </div>

      <div class="form-group">
        <label for="email">Adresse email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="votre@email.com"
        />
      </div>

      <!-- ===== Children Section ===== -->
      <hr />
      <h2>Enfants</h2>

      <SubscriberChildrenForm v-model="children" />

      <!-- Messages -->
      <p v-if="errorMessage" class="msg error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="msg success">{{ successMessage }}</p>

      <!-- Submit -->
      <button type="submit" class="btn-submit" :disabled="loading">
        {{ loading ? "Inscription en cours..." : "Valider l'inscription" }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.auth-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: "Inter", "Segoe UI", sans-serif;
}

h1 {
  margin-bottom: 0.25rem;
}

.subtitle {
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4f8cff;
  box-shadow: 0 0 0 2px rgba(79, 140, 255, 0.25);
}

hr {
  margin: 1.5rem 0;
  border: none;
  border-top: 1px solid #e0e0e0;
}

h2 {
  font-size: 1.15rem;
  margin-bottom: 0.75rem;
}

/* Children styles moved to SubscriberChildrenForm.vue */

.msg {
  padding: 0.65rem 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.msg.error {
  background: #fdecea;
  color: #c62828;
}

.msg.success {
  background: #e8f5e9;
  color: #2e7d32;
}

.btn-submit {
  display: block;
  width: 100%;
  padding: 0.75rem;
  background: #4f8cff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-submit:hover {
  background: #3a75e0;
}
</style>
