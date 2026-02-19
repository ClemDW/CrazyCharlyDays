import path from "path";
import fs from "fs";

/**
 * Sauvegarde la composition dans un fichier dédié.
 * @param csvContent Le contenu du fichier CSV.
 * @param outputPath Le chemin du fichier de sortie.
 */
async function saveCSV(csvContent: string, outputPath: string) {


    // Créer le dossier parent si inexistant
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, csvContent, "utf-8");
    console.log(`Fichier de solution sauvegardé : ${outputPath}`);
}

export {saveCSV}