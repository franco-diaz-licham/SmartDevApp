
/** Steups up date dynamically. */
export function setCopyrightDate() {
    const date = new Date();
    var yearEl = document.getElementById("copyrightYear");
    if (!yearEl) return;
    yearEl.innerHTML = `&copy; SMARTDEV ${date.getFullYear()}`;
}
