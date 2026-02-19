<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

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
  name: string;
  ageRange: string;
  categories: Category[];
}

// --- State ---
const isLoginMode = ref(true);

// Form fields
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const firstName = ref("");
const lastName = ref("");

// Children
const children = reactive<Child[]>([]);

// Messages
const errorMessage = ref("");
const successMessage = ref("");

// --- Functions ---
function toggleMode() {
  isLoginMode.value = !isLoginMode.value;
  errorMessage.value = "";
  successMessage.value = "";
}

function addChild() {
  children.push({
    name: "",
    ageRange: "",
    categories: DEFAULT_CATEGORIES.map((c) => ({ ...c })),
  });
}

function removeChild(index: number) {
  children.splice(index, 1);
}

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

function handleLogin() {
  errorMessage.value = "";
  successMessage.value = "";

  if (!email.value || !password.value) {
    errorMessage.value = "Veuillez remplir tous les champs.";
    return;
  }

  // TODO: intégrer l'appel API / base de données
  console.log("Login:", { email: email.value, password: password.value });
  successMessage.value = "Connexion réussie !";
}

function handleRegister() {
  errorMessage.value = "";
  successMessage.value = "";

  if (
    !firstName.value ||
    !lastName.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    errorMessage.value = "Veuillez remplir tous les champs.";
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Les mots de passe ne correspondent pas.";
    return;
  }

  // Validate children
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (!child.name) {
      errorMessage.value = `Veuillez renseigner le prénom de l'enfant ${i + 1}.`;
      return;
    }
    if (!child.ageRange) {
      errorMessage.value = `Veuillez choisir une tranche d'âge pour ${child.name || `l'enfant ${i + 1}`}.`;
      return;
    }
  }

  // TODO: intégrer l'appel API / base de données
  console.log("Register:", {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value,
    children: children.map((c) => ({
      name: c.name,
      ageRange: c.ageRange,
      categoryPreferences: c.categories.map((cat) => cat.code),
    })),
  });
  successMessage.value =
    "Inscription réussie ! Vous pouvez maintenant vous connecter.";
  isLoginMode.value = true;
  // Reset fields
  firstName.value = "";
  lastName.value = "";
  email.value = "";
  password.value = "";
  confirmPassword.value = "";
  children.splice(0);
}
</script>

<template>
  <div class="auth-container">
    <h1>{{ isLoginMode ? "Connexion" : "Inscription" }}</h1>

    <form @submit.prevent="isLoginMode ? handleLogin() : handleRegister()">
      <!-- Register-only fields -->
      <template v-if="!isLoginMode">
        <div>
          <label for="firstName">Prénom</label>
          <input
            id="firstName"
            v-model="firstName"
            type="text"
            placeholder="Votre prénom"
          />
        </div>

        <div>
          <label for="lastName">Nom</label>
          <input
            id="lastName"
            v-model="lastName"
            type="text"
            placeholder="Votre nom"
          />
        </div>
      </template>

      <!-- Common fields -->
      <div>
        <label for="email">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="votre@email.com"
        />
      </div>

      <div>
        <label for="password">Mot de passe</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Mot de passe"
        />
      </div>

      <!-- Register-only: confirm password -->
      <div v-if="!isLoginMode">
        <label for="confirmPassword">Confirmer le mot de passe</label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          placeholder="Confirmer le mot de passe"
        />
      </div>

      <!-- ===== Children Section (register only) ===== -->
      <template v-if="!isLoginMode">
        <hr />
        <h2>Enfants</h2>

        <div
          v-for="(child, childIdx) in children"
          :key="childIdx"
          class="child-block"
        >
          <h3>
            Enfant {{ childIdx + 1 }}
            <button type="button" @click="removeChild(childIdx)">
              ✕ Supprimer
            </button>
          </h3>

          <!-- Child name -->
          <div>
            <label :for="'childName-' + childIdx">Prénom de l'enfant</label>
            <input
              :id="'childName-' + childIdx"
              v-model="child.name"
              type="text"
              placeholder="Prénom"
            />
          </div>

          <!-- Age range -->
          <div>
            <label :for="'childAge-' + childIdx">Tranche d'âge</label>
            <select :id="'childAge-' + childIdx" v-model="child.ageRange">
              <option value="" disabled>-- Choisir --</option>
              <option
                v-for="age in AGE_RANGES"
                :key="age.code"
                :value="age.code"
              >
                {{ age.code }} — {{ age.label }}
              </option>
            </select>
          </div>

          <!-- Category preferences -->
          <div>
            <label>Ordre de préférence des catégories (1 = préféré)</label>
            <ol>
              <li v-for="(cat, catIdx) in child.categories" :key="cat.code">
                <span>{{ cat.code }} — {{ cat.label }}</span>
                <button
                  type="button"
                  :disabled="catIdx === 0"
                  @click="moveCategoryUp(child, catIdx)"
                >
                  ▲
                </button>
                <button
                  type="button"
                  :disabled="catIdx === child.categories.length - 1"
                  @click="moveCategoryDown(child, catIdx)"
                >
                  ▼
                </button>
              </li>
            </ol>
          </div>
        </div>

        <button type="button" @click="addChild()">+ Ajouter un enfant</button>
      </template>

      <!-- Error / Success messages -->
      <hr v-if="errorMessage || successMessage" />
      <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
      <p v-if="successMessage" style="color: green">{{ successMessage }}</p>

      <!-- Submit button -->
      <button type="submit">
        {{ isLoginMode ? "Se connecter" : "S'inscrire" }}
      </button>
    </form>

    <!-- Toggle link -->
    <p>
      {{ isLoginMode ? "Pas encore de compte ?" : "Déjà un compte ?" }}
      <a href="#" @click.prevent="toggleMode">
        {{ isLoginMode ? "S'inscrire" : "Se connecter" }}
      </a>
    </p>
  </div>
</template>
