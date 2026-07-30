import { setCopyrightDate } from "./helpers";
import { clearChildren, pickItemIndex } from "./pageDataHelper";
import "./style.css";

/**
 * Shape of each item in portfolio-personal-work-data.json.
 * Keep these keys aligned with the personal project page headings.
 */
type PersonalProjectItem = {
    projectName: string;
    subtitle: string;
    image: string;
    demoUrl?: string;
    overview: string;
    impact: string[];
    tech: {
        backend: string;
        frontend: string;
        cicdCloud: string;
        architecture: string;
    };
};

const DATA_URL = "/portfolio-personal-work-data.json";

/**
 * Session cache version for personal project data.
 * Bump this when the JSON changes and existing browser sessions should refetch it.
 */
const CACHE_KEY = "portfolio-personal-work-v3";

/**
 * Loads personal project data from sessionStorage first, then from the JSON file.
 */
async function loadPersonalProjectData(): Promise<PersonalProjectItem[]> {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) return JSON.parse(cached) as PersonalProjectItem[];

    const res = await fetch(DATA_URL, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Failed to load ${DATA_URL} (${res.status})`);

    const items = (await res.json()) as PersonalProjectItem[];
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(items));
    return items;
}

/**
 * Adds the current site origin to YouTube embeds so the player receives a valid referrer/origin.
 */
function buildDemoUrl(demoUrl: string): string {
    const url = new URL(demoUrl);
    if (url.hostname.includes("youtube.com")) {
        url.searchParams.set("origin", window.location.origin);
    }
    return url.toString();
}

/**
 * Renders a single personal project into personalProjectItem.html.
 */
function updatePersonalProjectPage(item: PersonalProjectItem) {
    const projectName = document.getElementById("projectName");
    const subtitle = document.getElementById("subtitle");
    const projectLogo = document.getElementById("projectLogo") as HTMLImageElement | null;
    const overview = document.getElementById("overview");
    const projectDemo = document.getElementById("projectDemo");
    const projectDemoFrame = document.getElementById("projectDemoFrame") as HTMLIFrameElement | null;
    const impact = document.getElementById("impact");
    const backendTech = document.getElementById("backendTech");
    const frontendTech = document.getElementById("frontendTech");
    const cicdCloudTech = document.getElementById("cicdCloudTech");
    const architectureTech = document.getElementById("architectureTech");

    if (projectName) projectName.textContent = item.projectName;
    if (subtitle) subtitle.textContent = item.subtitle;
    if (projectLogo) {
        projectLogo.src = item.image;
        projectLogo.alt = `${item.projectName} logo`;
    }
    if (overview) overview.textContent = item.overview;
    if (projectDemo && projectDemoFrame) {
        if (item.demoUrl) {
            projectDemoFrame.src = buildDemoUrl(item.demoUrl);
            projectDemoFrame.referrerPolicy = "strict-origin-when-cross-origin";
            projectDemoFrame.title = `${item.projectName} demo video`;
            projectDemo.hidden = false;
        } else {
            projectDemo.hidden = true;
            projectDemoFrame.removeAttribute("src");
        }
    }
    if (backendTech) backendTech.textContent = item.tech.backend;
    if (frontendTech) frontendTech.textContent = item.tech.frontend;
    if (cicdCloudTech) cicdCloudTech.textContent = item.tech.cicdCloud;
    if (architectureTech) architectureTech.textContent = item.tech.architecture;

    if (impact) {
        clearChildren(impact);
        for (const itemImpact of item.impact) {
            const li = document.createElement("li");
            li.textContent = itemImpact;
            impact.appendChild(li);
        }
    }
}

(async function init() {
    try {
        setCopyrightDate();
        const items = await loadPersonalProjectData();
        updatePersonalProjectPage(items[pickItemIndex(items.length) - 1]);
    } catch (err) {
        console.error("Personal project init failed:", err);
    }
})();
