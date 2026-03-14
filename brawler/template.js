import { getBrawlerById, createBrawlerPin, replaceFooter, getAllTierLists, createTierListButton } from "../data/data.js";

replaceFooter();

function getLastFolder(url, num)
{
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const parts = pathname.split('/').filter(part => part !== '').filter(part => part !== 'index.html'); // Split and remove empty elements and index.html
    return parts[parts.length - num];
}

const brawler = getBrawlerById(getLastFolder(window.location.href, 1));

const replacee = document.getElementById("pinReplacementSurgery");
const daNewPin = createBrawlerPin(brawler);
replacee.replaceWith(daNewPin);

const tierLists = await getAllTierLists();
let firstTierList;
let firstRanking;
let mostRecentTierList;
let mostRecentRanking;
let allRankings = [];

for (const tierList of tierLists)
{
    const tier = tierList.getBrawlerTier(brawler);

    if (tier != null)
    {
        if (firstTierList == null)
        {
            firstRanking = tier;
            firstTierList = tierList;
        }

        mostRecentRanking = tier;
        mostRecentTierList = tierList;
        allRankings.push(tier);
    }
}

const replaceWithFirstTierList = document.getElementById("replaceWithFirstTierList");
const firstTierListDiv = createTierListButton(firstTierList);
replaceWithFirstTierList.replaceWith(firstTierListDiv);

const firstRankingSpan = document.getElementById("firstRanking");
firstRankingSpan.textContent = firstRanking;

const mostRecentRankingSpan = document.getElementById("mostRecent");
mostRecentRankingSpan.textContent = mostRecentRanking + " (v" + mostRecentTierList.version + ")";

function getModes(array)
{
    if (array.length === 0)
    {
        return [];
    }

    const counts = {};
    let maxFreq = 0;
    const modes = [];

    array.forEach(element =>
    {
        counts[element] = (counts[element] || 0) + 1;
        if (counts[element] > maxFreq)
        {
            maxFreq = counts[element];
        }
    });

    for (const key in counts)
    {
        if (counts[key] === maxFreq)
        {
            modes.push(isNaN(Number(key)) ? key : Number(key));
        }
    }

    return modes;
}

const modes = getModes(allRankings);

const modeRankingSpan = document.getElementById("modeRanking");
modeRankingSpan.textContent = modes.join(", ");
