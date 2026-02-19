import nodemailer from "nodemailer";
import { Article } from "../entities/Article";

// SMTP transporter — uses MailCatcher in dev, swap to univ-lorraine SMTP in prod
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: parseInt(process.env.SMTP_PORT || "1025"),
  secure: false, // MailCatcher doesn't use TLS
  tls: { rejectUnauthorized: false },
});

/**
 * Send a "Your box is ready!" email to a subscriber.
 */
export async function sendBoxReadyEmail(
  to: string,
  subscriberName: string,
  articles: Article[],
): Promise<void> {
  const articleRows = articles
    .map(
      (a) =>
        `<tr>
                    <td style="padding:6px 12px;border-bottom:1px solid #eee">${a.description}</td>
                    <td style="padding:6px 12px;border-bottom:1px solid #eee">${a.category}</td>
                    <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right">${a.price.toFixed(2)} €</td>
                </tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:auto">
        <h1 style="color:#4f8cff">🎁 Votre box est prête !</h1>
        <p>Bonjour <strong>${subscriberName}</strong>,</p>
        <p>Bonne nouvelle ! Votre box Crazy Charly Days a été validée et est prête à être expédiée.</p>
        <h2 style="color:#2c3e50;font-size:1.1rem">Contenu de votre box</h2>
        <table style="width:100%;border-collapse:collapse;font-size:0.9rem">
            <thead>
                <tr style="background:#f8f9fb">
                    <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e0e0e0">Article</th>
                    <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e0e0e0">Catégorie</th>
                    <th style="padding:8px 12px;text-align:right;border-bottom:2px solid #e0e0e0">Prix</th>
                </tr>
            </thead>
            <tbody>
                ${articleRows}
            </tbody>
        </table>
        <p style="margin-top:1.5rem;color:#666;font-size:0.85rem">
            Merci de votre confiance !<br>
            L'équipe Crazy Charly Days 🎉
        </p>
    </div>`;

  await transporter.sendMail({
    from: '"Crazy Charly Days" <no-reply@crazycharly.dev>',
    to,
    subject: "🎁 Votre box est prête !",
    html,
  });

  console.log(`📧 Email envoyé à ${to}`);
}
