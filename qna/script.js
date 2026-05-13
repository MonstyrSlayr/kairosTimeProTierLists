import { getAllBrawlers, getAllTierLists, replaceFooter } from "../data/data.js";

replaceFooter();

const brawlers = await getAllBrawlers();

const brawlersWithBuffies = brawlers.filter(b => b.buffies != null);

const tierLists = await getAllTierLists();

document.getElementById("version").textContent = tierLists[tierLists.length - 1].version;
document.getElementById("buffieCount").textContent = brawlersWithBuffies.length;
document.getElementById("totalCount").textContent = brawlers.length;
