import { createBrawlerPercentage, getAllBrawlers, getAllTierLists, numToRank, postTierList, rankToNum, replaceFooter, Tier, TierList } from "../../data/data.js";

replaceFooter();

const brawlers = await getAllBrawlers();
const tierLists = await getAllTierLists();

const normalTiers = ["S", "A", "B", "C", "D", "F"];

const unreleasedList = new TierList(0, "", 0, "", 0);
const releasedList = new TierList(0, "", 0, "", 0);
const postreleaseList = new TierList(0, "", 0, "", 0);

for (const tier of normalTiers)
{
    const daHyperTier = new Tier(tier);
    unreleasedList.addTier(daHyperTier);

    const daBuffiesTier = new Tier(tier);
    releasedList.addTier(daBuffiesTier);

    const daOtherTier = new Tier(tier);
    postreleaseList.addTier(daOtherTier);
}

for (const brawler of brawlers)
{
    let isReleased = false;

    for (let i = 0; i < tierLists.length; i++)
    {
        const tierList = tierLists[i];
        const tier = tierList.getBrawlerTier(brawler);
        if (tier != null)
        {
            if (isReleased)
            {
                postreleaseList.addBrawlerToTier(brawler, tier);
                break;
            }

            if (tierList.date - brawler.release >= 0)
            {
                isReleased = true;
                releasedList.addBrawlerToTier(brawler, tier);
            }
            else if (!isReleased)
            {
                unreleasedList.addBrawlerToTier(brawler, tier);
            }
        }
    }
}

const averageListDiv = document.getElementById("unreleased");
postTierList(averageListDiv, unreleasedList);

const avgTenListDiv = document.getElementById("release");
postTierList(avgTenListDiv, releasedList);

const avgTenTwoListDiv = document.getElementById("postrelease");
postTierList(avgTenTwoListDiv, postreleaseList);
