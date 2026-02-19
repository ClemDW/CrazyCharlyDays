<template>
    <div>
        <h1>Création d'un article</h1>
            <div class="formulaire" id="formulaire">
                <input id="description" placeholder="Description" type="text">
                <select name="categorie-list" id="categorie-list">
                    <option value="SOC">SOC — Jeux de société</option>
                    <option value="FIG">FIG — Figurines et poupées</option>
                    <option value="CON">CON — Jeux de construction</option>
                    <option value="EXT">EXT — Jeux d'extérieur</option>
                    <option value="EVL">EVL — Jeux d'éveil et éducatifs</option>
                    <option value="LIV">LIV — Livres jeunesse</option>
                </select>
                <select name="age_range-list" id="age_range-list">
                    <option value="BB">BB — 0-3 ans</option>
                    <option value="PE">PE — 3-6 ans</option>
                    <option value="EN">EN — 6-10 ans</option>
                    <option value="AD">AD — 10+ ans</option>
                </select>
                <select name="state-list" id="state-list">
                    <option value="N">N — Neuf </option>
                    <option value="TB">TB — Très bon état</option>
                    <option value="B">B — Bon état</option>
                </select>
                <input id="prix" placeholder="Prix">
                <input id="poids" placeholder="Poids">
            </div>
    </div>
</template>

<style>

.formulaire{
    display: flex;
    flex-direction: column;
    gap: 10px;
}

input {
    width: 200px;
}

select {
    width: 200px;
    height: 30px;
}

</style>