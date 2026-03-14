class TierList
{
    version; // 1 indexed
    youtubeId;
    date;
    notes;
    tiers;

    constructor(youtubeId, date, notes)
    {
        this.youtubeId = youtubeId;
        this.date = date;
        this.notes = notes;
        this.tiers = [];
    }

    addTier(newTier)
    {
        for (let i = 0; i < this.tiers.length; i++)
        {
            const tier = this.tiers[i];
            if (tier.letter == newTier.letter)
            {
                this.tiers[i] = newTier;
                break;
            }
        }
    }
}

class Tier
{
    letter;
    brawlers;

    constructor(letter)
    {
        this.letter = letter;
        this.brawlers = new Set();
    }

    addBrawler(newBrawler)
    {
        this.brawlers.add(newBrawler);
    }
}

class Brawler
{
    name;
    id;
    image;
}

const TIER_DATA_CSV = "https://monstyrslayr.github.io/kairosTimeProTierLists/data/tierData.csv";
const BRAWLER_DATA_CSV = "https://monstyrslayr.github.io/kairosTimeProTierLists/data/brawlerData.csv";

async function getAllTierLists()
{
    const tierLists = [];

	const tierCsv = await fetch(TIER_DATA_CSV);
    if (!tierCsv.ok)
	{
		throw new Error("Network response was not ok");
	}
	const tierCsvText = await tierCsv.text();
	const tierResults = await Papa.parse(tierCsvText, { header: true });

    console.log(tierResults);
}

getAllTierLists();
