import { createBrawlerButton, getAllBrawlers, replaceFooter } from "../data/data.js";

replaceFooter();

const brawlers = await getAllBrawlers();

const brawlersDiv = document.getElementById("allBrawlers");
for (const brawler of brawlers)
{
    const daPin = createBrawlerButton(brawler);
    brawlersDiv.appendChild(daPin);
}
