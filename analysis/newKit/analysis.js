import { getAllBrawlers, getAllTierLists, postTierList, rankToNum, replaceFooter, Tier, TierList } from "../../data/data.js";

replaceFooter();

const brawlers = await getAllBrawlers();
const tierLists = await getAllTierLists();

const normalTiers = ["S", "A", "B", "C", "D", "F"];

const hyperTierList = new TierList(0, "", 0, "", 0);
const hyperIncreaseTierList = new TierList(0, "", 0, "", 0);
const buffiesTierList = new TierList(0, "", 0, "", 0);
const buffiesIncreaseTierList = new TierList(0, "", 0, "", 0);

for (const tier of normalTiers)
{
    const daHyperTier = new Tier(tier);
    hyperTierList.addTier(daHyperTier);

    const daBuffiesTier = new Tier(tier);
    buffiesTierList.addTier(daBuffiesTier);
}

for (const brawler of brawlers)
{
    let hyperVersion = null;
    let hyperPrevVersion = null;
    let buffiesVersion = null;
    let buffiesPrevVersion = null;
    let releaseVersion = null;

    for (let i = 1; i < tierLists.length; i++)
    {
        const tierList = tierLists[i];
        const previousTierList = tierLists[i - 1];

        const buffiesDifference = brawler.buffies - tierList.date;
        const buffiesDifferencePrev = brawler.buffies - previousTierList.date;
        
        if (buffiesDifference < 0 && buffiesDifferencePrev > 0)
        {
            buffiesVersion = tierList;
            buffiesPrevVersion = previousTierList;
        }

        const hyperDifference = brawler.hypercharge - tierList.date;
        const hyperDifferencePrev = brawler.hypercharge - previousTierList.date;
        
        if (hyperDifference < 0 && hyperDifferencePrev > 0)
        {
            hyperVersion = tierList;
            hyperPrevVersion = previousTierList;
        }
        
        const releaseDifference = brawler.release - tierList.date;
        const releaseDifferencePrev = brawler.release - previousTierList.date;

        if (releaseDifference < 0 && releaseDifferencePrev > 0)
        {
            releaseVersion = tierList;
        }

        if (previousTierList.version == 1)
        {
            if (brawler.release < previousTierList.date && brawler.release != null) releaseVersion = previousTierList;
        }
    }

    if (releaseVersion != null)
    {
        if (hyperVersion != null)
        {
            if (hyperVersion.version > releaseVersion.version)
            {
                const hyperIncrease = rankToNum(hyperVersion.getBrawlerTier(brawler)) - rankToNum(hyperPrevVersion.getBrawlerTier(brawler));

                if (!hyperIncreaseTierList.hasTier(hyperIncrease))
                {
                    const tier = new Tier(hyperIncrease);
                    hyperIncreaseTierList.addTier(tier);
                };
                hyperIncreaseTierList.addBrawlerToTier(brawler, hyperIncrease);

                const hyperTier = hyperVersion.getBrawlerTier(brawler);
                hyperTierList.addBrawlerToTier(brawler, hyperTier);
            }
        }

        if (buffiesVersion != null)
        {
            if (buffiesVersion.version > releaseVersion.version)
            {
                const buffiesIncrease = rankToNum(buffiesVersion.getBrawlerTier(brawler)) - rankToNum(buffiesPrevVersion.getBrawlerTier(brawler));

                if (!buffiesIncreaseTierList.hasTier(buffiesIncrease))
                {
                    const tier = new Tier(buffiesIncrease);
                    buffiesIncreaseTierList.addTier(tier);
                };
                buffiesIncreaseTierList.addBrawlerToTier(brawler, buffiesIncrease);

                const buffiesTier = buffiesVersion.getBrawlerTier(brawler);
                buffiesTierList.addBrawlerToTier(brawler, buffiesTier);
            }
        }
    }
}

hyperIncreaseTierList.tiers.sort((a, b) => b.letter - a.letter);
const hyperIncreaseTierListDiv = document.getElementById("hyperIncreaseTierListDiv");
postTierList(hyperIncreaseTierListDiv, hyperIncreaseTierList);

const hyperTierListDiv = document.getElementById("hyperTierListDiv");
postTierList(hyperTierListDiv, hyperTierList);

buffiesIncreaseTierList.tiers.sort((a, b) => b.letter - a.letter);
const buffiesIncreaseTierListDiv = document.getElementById("buffiesIncreaseTierListDiv");
postTierList(buffiesIncreaseTierListDiv, buffiesIncreaseTierList);

const buffiesTierListDiv = document.getElementById("buffiesTierListDiv");
postTierList(buffiesTierListDiv, buffiesTierList);
