import { setCopyrightDate } from "./helpers";
import "./style.css";

function navigateToItem(e: Element) {
    const itemType = e.getAttribute("data-portfolio-type");
    const itemId = e.getAttribute("data-item-id");

    if (itemType === "professional") {
        window.location.href = `/pages/professionalWorkItem.html?item=${itemId}`;
        return;
    }

    if (itemType === "personal") {
        window.location.href = `/pages/personalProjectItem.html?item=${itemId}`;
    }
}

function wireUpPage() {
    const items = document.querySelectorAll(".card");

    items.forEach((item) => {
        item.addEventListener("click", () => navigateToItem(item));
    });
}

function wireUpContactForm() {
    const form = document.getElementById("contact-form") as HTMLFormElement | null;
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = (document.getElementById("name") as HTMLInputElement).value.trim();
            const email = (document.getElementById("email") as HTMLInputElement).value.trim();
            const message = (document.getElementById("message") as HTMLTextAreaElement).value.trim();

            try {
                // Use build-time env (see .env below). In prod, set this during your build or just call '/api/...'
                const base = import.meta.env.VITE_API_BASE ?? "";
                const res = await fetch(`${base}/sendEmail`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, message }),
                });
                const data = await res.json().catch(() => ({}));
                alert(res.ok ? "Thanks! Message sent." : `Send failed: ${data?.error ?? res.statusText}`);
                if (res.ok) form.reset();
            } catch (err) {
                alert("Network error sending message.");
                console.error(err);
            }
        });
    }
}

(async function init() {
    try {
        setCopyrightDate();
        wireUpContactForm();
        wireUpPage();
    } catch (err) {
        console.error("Portfolio init failed:", err);
    }
})();
