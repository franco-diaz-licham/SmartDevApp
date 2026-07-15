export function pickItemIndex(total: number): number {
    const raw = new URLSearchParams(window.location.search).get("item") ?? "";
    const idx = Number.parseInt(raw, 10);
    if (Number.isNaN(idx) || idx < 1 || idx > total) return 1;
    return idx;
}

export function clearChildren(el: Element | null) {
    if (!el) return;
    while (el.firstChild) el.removeChild(el.firstChild);
}

