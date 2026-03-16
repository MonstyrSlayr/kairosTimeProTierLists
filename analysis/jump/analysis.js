import { createBrawlerPercentage, getAllBrawlers, getAllTierLists, postTierList, rankToNum, replaceFooter, Tier, TierList } from "../../data/data.js";

replaceFooter();

const brawlers = await getAllBrawlers();
const tierLists = await getAllTierLists();

const buffList = new TierList(0, "", 0, "", 0);
const nerfList = new TierList(0, "", 0, "", 0);

for (const brawler of brawlers)
{
    let buff = 0;
    let nerf = 0;

    for (let i = 1; i < tierLists.length; i++)
    {
        const tierList = tierLists[i];
        const prevList = tierLists[i - 1];

        const brawlerTier = tierList.getBrawlerTier(brawler);
        const prevTier = prevList.getBrawlerTier(brawler);

        if (brawlerTier != null && prevTier != null)
        {
            const difference = rankToNum(brawlerTier) - rankToNum(prevTier);

            if (difference > buff)
            {
                buff = difference;
            }

            if (difference < nerf)
            {
                nerf = difference;
            }
        }
    }

    if (!buffList.hasTier(buff))
    {
        const daTier = new Tier(buff);
        buffList.addTier(daTier);
    }

    buffList.addBrawlerToTier(brawler, buff);

    if (!nerfList.hasTier(nerf))
    {
        const daTier = new Tier(nerf);
        nerfList.addTier(daTier);
    }

    nerfList.addBrawlerToTier(brawler, nerf);
}

buffList.tiers.sort((a, b) => b.letter - a.letter);
const buffListDiv = document.getElementById("buffDiv");
postTierList(buffListDiv, buffList);

nerfList.tiers.sort((a, b) => b.letter - a.letter);
const nerfListDiv = document.getElementById("nerfDiv");
postTierList(nerfListDiv, nerfList);
