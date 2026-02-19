<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";

// --- Constants ---
const AGE_RANGES = [
  { code: "BB", label: "0-3 ans (bébé)" },
  { code: "PE", label: "3-6 ans (petit enfant)" },
  { code: "EN", label: "6-10 ans (enfant)" },
  { code: "AD", label: "10+ ans (adolescent)" },
] as const;

const DEFAULT_CATEGORIES = [
  { code: "SOC", label: "Jeux de société" },
  { code: "FIG", label: "Figurines et poupées" },
  { code: "CON", label: "Jeux de construction" },
  { code: "EXT", label: "Jeux d'extérieur" },
  { code: "EVL", label: "Jeux d'éveil et éducatifs" },
  { code: "LIV", label: "Livres jeunesse" },
] as const;

interface Category {
  code: string;
  label: string;
}

interface Child {
  ageRange: string;
  categories: Category[];
}

// --- State ---
const lastName = ref("");
const firstName = ref("");
const email = ref("");
const children = reactive<Child[]>([]);
const errorMessage = ref("");
const successMessage = ref("");

// --- Cookie helpers ---
function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

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
      children.splice(0);
      data.children.forEach((c: any) => {
        children.push({
          ageRange: c.ageRange || "",
          categories: Array.isArray(c.categories)
            ? c.categories.map((cat: any) => ({
                code: cat.code,
                label: cat.label,
              }))
            : DEFAULT_CATEGORIES.map((cat) => ({ ...cat })),
        });
      });
    }
    successMessage.value =
      "Vos informations ont été restaurées depuis votre dernière visite.";
  } catch {
    // Cookie invalide, on ignore
  }
});

// --- Child management ---
function addChild() {
  children.push({
    ageRange: "",
    categories: DEFAULT_CATEGORIES.map((c) => ({ ...c })),
  });
}

function removeChild(index: number) {
  children.splice(index, 1);
}

// --- Category reordering ---
function moveCategoryUp(child: Child, catIndex: number) {
  if (catIndex <= 0) return;
  const temp = child.categories[catIndex];
  child.categories[catIndex] = child.categories[catIndex - 1];
  child.categories[catIndex - 1] = temp;
}

function moveCategoryDown(child: Child, catIndex: number) {
  if (catIndex >= child.categories.length - 1) return;
  const temp = child.categories[catIndex];
  child.categories[catIndex] = child.categories[catIndex + 1];
  child.categories[catIndex + 1] = temp;
}

// --- Submit ---
function handleSubmit() {
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

  if (children.length === 0) {
    errorMessage.value = "Veuillez ajouter au moins un enfant.";
    return;
  }

  for (let i = 0; i < children.length; i++) {
    if (!children[i].ageRange) {
      errorMessage.value = `Veuillez choisir une tranche d'âge pour l'enfant ${i + 1}.`;
      return;
    }
  }

  // Save to cookie (30 days)
  const payload = {
    lastName: lastName.value.trim(),
    firstName: firstName.value.trim(),
    email: email.value.trim(),
    children: children.map((c) => ({
      ageRange: c.ageRange,
      categories: c.categories.map((cat) => ({
        code: cat.code,
        label: cat.label,
      })),
    })),
  };

  setCookie("subscriber", JSON.stringify(payload), 30);

  console.log("Subscriber data:", payload);
  successMessage.value =
    "Inscription enregistrée ! Vos informations seront mémorisées pour votre prochaine visite.";
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

      <div
        v-for="(child, childIdx) in children"
        :key="childIdx"
        class="child-block"
      >
        <h3>
          Enfant {{ childIdx + 1 }}
          <button
            type="button"
            class="btn-remove"
            @click="removeChild(childIdx)"
          >
            ✕ Supprimer
          </button>
        </h3>

        <!-- Age range -->
        <div class="form-group">
          <label :for="'childAge-' + childIdx">Tranche d'âge</label>
          <select :id="'childAge-' + childIdx" v-model="child.ageRange">
            <option value="" disabled>-- Choisir --</option>
            <option v-for="age in AGE_RANGES" :key="age.code" :value="age.code">
              {{ age.code }} — {{ age.label }}
            </option>
          </select>
        </div>

        <!-- Category preferences -->
        <div class="form-group">
          <label
            >Préférences de catégories de jouets (1 = la plus souhaitée)</label
          >
          <ol class="category-list">
            <li v-for="(cat, catIdx) in child.categories" :key="cat.code">
              <span class="cat-label">{{ cat.label }}</span>
              <span class="cat-buttons">
                <button
                  type="button"
                  :disabled="catIdx === 0"
                  @click="moveCategoryUp(child, catIdx)"
                  title="Monter"
                >
                  ▲
                </button>
                <button
                  type="button"
                  :disabled="catIdx === child.categories.length - 1"
                  @click="moveCategoryDown(child, catIdx)"
                  title="Descendre"
                >
                  ▼
                </button>
              </span>
            </li>
          </ol>
        </div>
      </div>

      <button type="button" class="btn-add-child" @click="addChild()">
        + Ajouter un enfant
      </button>

      <!-- Messages -->
      <p v-if="errorMessage" class="msg error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="msg success">{{ successMessage }}</p>

      <!-- Submit -->
      <button type="submit" class="btn-submit">Valider l'inscription</button>
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

.child-block {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
  background: #fafbfc;
}

.child-block h3 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
}

.btn-remove {
  background: none;
  border: none;
  color: #e04040;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0.25rem 0.5rem;
}

.btn-remove:hover {
  text-decoration: underline;
}

.category-list {
  padding-left: 1.5rem;
  margin: 0.5rem 0 0 0;
}

.category-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.35rem 0;
  border-bottom: 1px solid #eee;
}

.category-list li:last-child {
  border-bottom: none;
}

.cat-label {
  flex: 1;
  font-size: 0.9rem;
}

.cat-buttons button {
  background: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  padding: 0.15rem 0.5rem;
  margin-left: 0.25rem;
  font-size: 0.8rem;
  line-height: 1;
}

.cat-buttons button:hover:not(:disabled) {
  background: #ddd;
}

.cat-buttons button:disabled {
  opacity: 0.35;
  cursor: default;
}

.btn-add-child {
  display: block;
  width: 100%;
  padding: 0.6rem;
  background: #f5f7fa;
  border: 2px dashed #c0c8d4;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 1rem;
  transition: background 0.15s;
}

.btn-add-child:hover {
  background: #eaeff5;
}

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
