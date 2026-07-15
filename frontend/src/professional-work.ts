import { setCopyrightDate } from "./helpers";
import { clearChildren, pickItemIndex } from "./pageDataHelper";
import "./style.css";

/**
 * Shape of each item in portfolio-professional-work-data.json.
 * Keep these keys aligned with the professional work page headings.
 */
type ProfessionalWorkItem = {
    companyName: string;
    roleTitle: string;
    image: string;
    roleSummary: string;
    keyContributions: string[];
    skillsAndPractices: {
        backend: string;
        frontend: string;
        cloudAndData: string;
        engineeringPractices: string;
    };
};

const DATA_URL = "/portfolio-professional-work-data.json";

/**
 * Session cache version for professional work data.
 * Bump this when the JSON changes and existing browser sessions should refetch it.
 */
const CACHE_KEY = "portfolio-professional-work-v1";

/**
 * Loads professional work data from sessionStorage first, then from the JSON file.
 */
async function loadProfessionalWorkData(): Promise<ProfessionalWorkItem[]> {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) return JSON.parse(cached) as ProfessionalWorkItem[];

    const res = await fetch(DATA_URL, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Failed to load ${DATA_URL} (${res.status})`);

    const items = (await res.json()) as ProfessionalWorkItem[];
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(items));
    return items;
}

/**
 * Renders a single professional work item into professionalWorkItem.html.
 */
function updateProfessionalWorkPage(item: ProfessionalWorkItem) {
    const companyName = document.getElementById("companyName");
    const roleTitle = document.getElementById("roleTitle");
    const companyLogo = document.getElementById("companyLogo") as HTMLImageElement | null;
    const roleSummary = document.getElementById("roleSummary");
    const keyContributions = document.getElementById("keyContributions");
    const backendSkills = document.getElementById("backendSkills");
    const frontendSkills = document.getElementById("frontendSkills");
    const cloudAndDataSkills = document.getElementById("cloudAndDataSkills");
    const engineeringPractices = document.getElementById("engineeringPractices");

    if (companyName) companyName.textContent = item.companyName;
    if (roleTitle) roleTitle.textContent = item.roleTitle;
    if (companyLogo) {
        companyLogo.src = item.image;
        companyLogo.alt = `${item.companyName} logo`;
    }
    if (roleSummary) roleSummary.textContent = item.roleSummary;
    if (backendSkills) backendSkills.textContent = item.skillsAndPractices.backend;
    if (frontendSkills) frontendSkills.textContent = item.skillsAndPractices.frontend;
    if (cloudAndDataSkills) cloudAndDataSkills.textContent = item.skillsAndPractices.cloudAndData;
    if (engineeringPractices) engineeringPractices.textContent = item.skillsAndPractices.engineeringPractices;

    if (keyContributions) {
        clearChildren(keyContributions);
        for (const contribution of item.keyContributions) {
            const li = document.createElement("li");
            li.textContent = contribution;
            keyContributions.appendChild(li);
        }
    }
}

(async function init() {
    try {
        setCopyrightDate();
        const items = await loadProfessionalWorkData();
        updateProfessionalWorkPage(items[pickItemIndex(items.length) - 1]);
    } catch (err) {
        console.error("Professional work init failed:", err);
    }
})();
