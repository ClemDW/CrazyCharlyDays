<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

const API_URL = "http://localhost:3000";

// --- Label maps ---
const AGE_LABELS: Record<string, string> = {
  BB: "0-3 ans (bébé)",
  PE: "3-6 ans (petit enfant)",
  EN: "6-10 ans (enfant)",
  AD: "10+ ans (adolescent)",
};

const CAT_LABELS: Record<string, string> = {
  SOC: "Jeux de société",
  FIG: "Figurines et poupées",
  CON: "Jeux de construction",
  EXT: "Jeux d'extérieur",
  EVL: "Jeux d'éveil et éducatifs",
  LIV: "Livres jeunesse",
};

interface Category {
  code: string;
  label: string;
}

interface Child {
  ageRange: string;
  ageLabel: string;
  categories: Category[];
}

interface Subscriber {
  lastName: string;
  firstName: string;
  email: string;
  children: Child[];
}

const subscribers = ref<Subscriber[]>([]);
const loading = ref(true);
const errorMessage = ref("");

onMounted(async () => {
  try {
    // 1. Fetch all users
    const usersRes = await axios.get(`${API_URL}/users`);
    const allUsers: any[] = usersRes.data;

    // 2. For each USER-role user, fetch their children data
    const subs: Subscriber[] = [];

    for (const user of allUsers.filter((u: any) => u.role === "USER")) {
      // Fetch all usertochild entries for this user
      let childrenData: any[] = [];
      try {
        const childRes = await axios.get(
          `${API_URL}/usertochild/${user.id_user}`,
        );
        // The endpoint may return one object or an array
        const data = childRes.data;
        childrenData = Array.isArray(data) ? data : [data];
      } catch {
        // No children found — skip
        childrenData = [];
      }

      const children: Child[] = childrenData.map((c: any) => ({
        ageRange: c.age_range,
        ageLabel: AGE_LABELS[c.age_range] || c.age_range,
        categories: (c.preference || []).map((code: string) => ({
          code,
          label: CAT_LABELS[code] || code,
        })),
      }));

      subs.push({
        lastName: user.family_name,
        firstName: user.name,
        email: user.email,
        children,
      });
    }

    subscribers.value = subs;
  } catch (err: any) {
    console.error("Erreur :", err);
    errorMessage.value = "Impossible de charger la liste des abonnés.";
  } finally {
    loading.value = false;
  }
});

function ageBadgeClass(code: string): string {
  const map: Record<string, string> = {
    BB: "age-bb",
    PE: "age-pe",
    EN: "age-en",
    AD: "age-ad",
  };
  return map[code] || "";
}
</script>

<template>
  <div class="admin-subs">
    <h1>Liste des abonnés</h1>
    <p class="subtitle">
      {{ subscribers.length }} abonnés inscrits ·
      {{ subscribers.reduce((n, s) => n + s.children.length, 0) }} enfants au
      total
    </p>

    <p v-if="loading" style="text-align: center; color: #888; padding: 2rem">
      Chargement des abonnés…
    </p>
    <p v-else-if="errorMessage" class="msg error">{{ errorMessage }}</p>

    <div v-else class="table-wrapper">
      <table class="subs-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Enfants</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(sub, idx) in subscribers" :key="idx">
            <td class="cell-name">{{ sub.lastName }}</td>
            <td>{{ sub.firstName }}</td>
            <td class="cell-email">{{ sub.email }}</td>
            <td>
              <div
                v-for="(child, cIdx) in sub.children"
                :key="cIdx"
                class="child-row"
              >
                <span :class="['age-badge', ageBadgeClass(child.ageRange)]">
                  {{ child.ageRange }}
                </span>
                <span class="age-label">{{ child.ageLabel }}</span>
                <div class="pref-list">
                  <span
                    v-for="(cat, pIdx) in child.categories"
                    :key="cat.code"
                    class="pref-chip"
                  >
                    <span class="pref-rank">{{ pIdx + 1 }}</span>
                    {{ cat.label }}
                  </span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.admin-subs {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 1.5rem 2rem;
  font-family: "Inter", "Segoe UI", sans-serif;
}

h1 {
  margin-bottom: 0.25rem;
}

.subtitle {
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

/* Table */
.table-wrapper {
  overflow-x: auto;
}

.subs-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.subs-table thead th {
  text-align: left;
  font-weight: 600;
  color: #555;
  padding: 0.7rem 1rem;
  border-bottom: 2px solid #e0e0e0;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  background: #f8f9fb;
}

.subs-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: top;
  color: #333;
}

.subs-table tbody tr:last-child td {
  border-bottom: none;
}

.subs-table tbody tr:hover {
  background: #f8f9fb;
}

.cell-name {
  font-weight: 600;
}

.cell-email {
  color: #4f8cff;
}

/* Children */
.child-row {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  flex-wrap: wrap;
  padding: 0.35rem 0;
}

.child-row:not(:last-child) {
  border-bottom: 1px dashed #e8e8ee;
  margin-bottom: 0.35rem;
  padding-bottom: 0.5rem;
}

/* Age badges */
.age-badge {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  flex-shrink: 0;
}

.age-bb {
  background: #e91e63;
}
.age-pe {
  background: #ff9800;
}
.age-en {
  background: #4caf50;
}
.age-ad {
  background: #3f51b5;
}

.age-label {
  font-size: 0.8rem;
  color: #777;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Category preferences */
.pref-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.2rem;
  width: 100%;
}

.pref-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: #f0f1f5;
  padding: 0.15rem 0.55rem;
  border-radius: 12px;
  font-size: 0.75rem;
  color: #444;
}

.pref-rank {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #4f8cff;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  flex-shrink: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .subs-table thead {
    display: none;
  }

  .subs-table,
  .subs-table tbody,
  .subs-table tr,
  .subs-table td {
    display: block;
    width: 100%;
  }

  .subs-table tr {
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    margin-bottom: 0.75rem;
    padding: 0.75rem;
    background: #fff;
  }

  .subs-table td {
    padding: 0.25rem 0;
    border: none;
  }

  .subs-table td::before {
    display: block;
    font-weight: 600;
    font-size: 0.75rem;
    color: #999;
    text-transform: uppercase;
    margin-bottom: 0.15rem;
  }

  .subs-table td:nth-child(1)::before {
    content: "Nom";
  }
  .subs-table td:nth-child(2)::before {
    content: "Prénom";
  }
  .subs-table td:nth-child(3)::before {
    content: "Email";
  }
  .subs-table td:nth-child(4)::before {
    content: "Enfants";
  }
}
</style>
