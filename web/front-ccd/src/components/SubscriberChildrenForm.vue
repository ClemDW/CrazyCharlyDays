<script setup lang="ts">
import {
  AGE_RANGES,
  DEFAULT_CATEGORIES,
  type Child,
} from "@/constants/subscriber";

const props = defineProps<{
  modelValue: Child[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Child[]): void;
}>();

function addChild() {
  const newList = [
    ...props.modelValue,
    {
      name: "",
      ageRange: "",
      categories: DEFAULT_CATEGORIES.map((c) => ({ ...c })),
    },
  ];
  emit("update:modelValue", newList);
}

function removeChild(index: number) {
  if (confirm("Supprimer cet enfant ?")) {
    const newList = [...props.modelValue];
    newList.splice(index, 1);
    emit("update:modelValue", newList);
  }
}

function moveCategoryUp(child: Child, catIndex: number) {
  if (catIndex <= 0) return;
  const [item] = child.categories.splice(catIndex, 1);
  if (item) {
    child.categories.splice(catIndex - 1, 0, item);
  }
}

function moveCategoryDown(child: Child, catIndex: number) {
  if (catIndex >= child.categories.length - 1) return;
  const [item] = child.categories.splice(catIndex, 1);
  if (item) {
    child.categories.splice(catIndex + 1, 0, item);
  }
}
</script>

<template>
  <div class="children-form">
    <div
      v-for="(child, childIdx) in modelValue"
      :key="childIdx"
      class="child-block"
    >
      <div class="child-header">
        <h3>
          <input
            v-model="child.name"
            type="text"
            placeholder="Nom/Prénom de l'enfant"
            class="child-name-input"
          />
          <span v-if="!child.name" class="fallback-title"
            >Enfant {{ childIdx + 1 }}</span
          >
        </h3>
        <button type="button" class="btn-remove" @click="removeChild(childIdx)">
          ✕ Supprimer
        </button>
      </div>

      <!-- Age range -->
      <div class="form-group">
        <label :for="'childAge-' + childIdx">Tranche d'âge</label>
        <select :id="'childAge-' + childIdx" v-model="child.ageRange">
          <option value="" disabled>-- Choisir --</option>
          <option v-for="age in AGE_RANGES" :key="age.code" :value="age.code">
            {{ age.label }}
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
  </div>
</template>

<style scoped>
.children-form {
  width: 100%;
}

.child-block {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
  background: #fafbfc;
}

.child-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.child-header h3 {
  margin: 0;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.child-name-input {
  border: 1px solid transparent;
  background: transparent;
  font-weight: 600;
  font-size: 1rem;
  padding: 2px 4px;
  border-radius: 4px;
  color: #2c3e50;
}

.child-name-input:focus {
  border-color: #4f8cff;
  background: white;
  outline: none;
}

.fallback-title {
  color: #999;
  font-style: italic;
  font-size: 0.9rem;
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

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
}

.form-group select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
  box-sizing: border-box;
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
</style>
