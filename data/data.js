function isLiveServer()
{
    return location.hostname === "127.0.0.1" || location.hostname === "localhost";
}

export const LINK = isLiveServer() ? "http://127.0.0.1:5500/" : "https://monstyrslayr.github.io/kairosTimeProTierLists/";

const IMG_LINK = LINK + "img/";
const NEUTRAL_PIN_END = "_pin.png";

export const UP_ARROW = IMG_LINK + "up_arrow.webp";
export const DOWN_ARROW = IMG_LINK + "down_arrow.webp";
export const NEW_ARROW = IMG_LINK + "new_arrow.webp";

const TIER_LIST_LINK = LINK + "tierList/";

const TIER_DATA_CSV = LINK + "data/tierData.csv";
const BRAWLER_DATA_CSV = LINK + "data/brawlerData.csv";

const BRAWLER_LINK = LINK + "brawler/";

const preRanks = ["S", "A", "B", "C", "F"];
const rankCutoff = 29;
const postRanks = ["S", "A", "B", "C", "D", "F"];

// TODO: EASING
export function rankToNum(rank)
{
    if (rank == "S") return 5;
    if (rank == "A") return 4;
    if (rank == "B") return 3;
    if (rank == "C") return 2;
    if (rank == "D") return 1;
    return 0;
}

export function numToRank(num)
{
    if (num >= 4.5) return "S";
    if (num >= 3.5) return "A";
    if (num >= 2.5) return "B";
    if (num >= 1.5) return "C";
    if (num >= 0.5) return "D";
    return "F";
}

class TierList
{
    version; // 1 indexed
    youtubeId;
    date;
    notes;
    tiers;
    pros;

    constructor(version, youtubeId, date, notes, pros)
    {
        this.version = version;
        this.youtubeId = youtubeId;
        this.date = date;
        this.notes = notes;
        this.tiers = [];
        this.pros = pros;
    }

    addTier(newTier)
    {
        for (let i = 0; i < this.tiers.length; i++)
        {
            const tier = this.tiers[i];
            if (tier.letter == newTier.letter)
            {
                this.tiers[i] = newTier;
                return;
            }
        }

        this.tiers.push(newTier);
    }

    addBrawlerToTier(brawler, tierLetter)
    {
        const tier = this.tiers.find(t => t.letter == tierLetter);
        tier.addBrawler(brawler);
    }

    getBrawlerTier(brawler)
    {
        for (const tier of this.tiers)
        {
            if (tier.brawlers.has(brawler)) return tier.letter;
        }
        return null;
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
    neutral;

    constructor(name)
    {
        this.name = name;
        this.id = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        this.neutral = IMG_LINK + this.id + NEUTRAL_PIN_END;
    }
}

export async function getAllBrawlers()
{
    const brawlers = [];

	const brawlerCsv = await fetch(BRAWLER_DATA_CSV);
    if (!brawlerCsv.ok)
	{
		throw new Error("Network response was not ok");
	}
	const brawlerCsvText = await brawlerCsv.text();
	const brawlerResults = await Papa.parse(brawlerCsvText, { header: true });

    for (const line of brawlerResults.data)
    {
        const brawler = new Brawler(line.brawler);
        brawlers.push(brawler);
    }

    return brawlers;
}

const brawlers = await getAllBrawlers();

export function getBrawlerById(id)
{
    return brawlers.find(brawler => brawler.id == id);
}

function getBrawlerByName(name)
{
    return brawlers.find(brawler => brawler.name == name);
}

export function createBrawlerPin(brawler, arrow = null)
{
    const daDiv = document.createElement("a");
    daDiv.href = BRAWLER_LINK + brawler.id;
    daDiv.classList.add("pin");

        const brawlerImg = document.createElement("img");
        brawlerImg.src = brawler.neutral;
        brawlerImg.classList.add("pinMain");
        daDiv.appendChild(brawlerImg);

        if (arrow != null)
        {
            const arrowImg = document.createElement("img");
            arrowImg.src = arrow;
            arrowImg.classList.add("pinArrow");
            daDiv.appendChild(arrowImg);
        }
    
    return daDiv;
}

export async function getAllTierLists()
{
    const tierLists = [];

	const tierCsv = await fetch(TIER_DATA_CSV);
    if (!tierCsv.ok)
	{
		throw new Error("Network response was not ok");
	}
	const tierCsvText = await tierCsv.text();
	const tierResults = await Papa.parse(tierCsvText, { header: true });

    for (const line of tierResults.data)
    {
        if (line.video == "") continue;

        const version = parseInt(line.version);
        const daTierList = new TierList(version, line.video, new Date(line.date), line.notes, line.pros);
        tierLists.push(daTierList);

        const ranks = version >= rankCutoff ? postRanks : preRanks;

        for (const rank of ranks)
        {
            const tier = new Tier(rank);
            daTierList.addTier(tier);
        }
    }

	const brawlerCsv = await fetch(BRAWLER_DATA_CSV);
    if (!brawlerCsv.ok)
	{
		throw new Error("Network response was not ok");
	}
	const brawlerCsvText = await brawlerCsv.text();
	const brawlerResults = await Papa.parse(brawlerCsvText, { header: true });

    for (const line of brawlerResults.data)
    {
        const brawler = getBrawlerByName(line.brawler);

        if (brawler)
        {
            for (const tierList of tierLists)
            {
                const rankString = "rank_" + tierList.version;
                const brawlerRank = line[rankString];

                if (brawlerRank != "")
                {
                    tierList.addBrawlerToTier(brawler, brawlerRank);
                }
            }
        }
    }

    return tierLists;
}

export async function getTierListByVersion(v)
{
    let daList;

	const tierCsv = await fetch(TIER_DATA_CSV);
    if (!tierCsv.ok)
	{
		throw new Error("Network response was not ok");
	}
	const tierCsvText = await tierCsv.text();
	const tierResults = await Papa.parse(tierCsvText, { header: true });

    for (const line of tierResults.data)
    {
        if (line.video == "") continue;

        const version = parseInt(line.version);
        if (v != version) continue;

        daList = new TierList(version, line.video, new Date(line.date), line.notes, line.pros);

        const ranks = version >= rankCutoff ? postRanks : preRanks;

        for (const rank of ranks)
        {
            const tier = new Tier(rank);
            daList.addTier(tier);
        }
    }

    if (daList == null) return null;

	const brawlerCsv = await fetch(BRAWLER_DATA_CSV);
    if (!brawlerCsv.ok)
	{
		throw new Error("Network response was not ok");
	}
	const brawlerCsvText = await brawlerCsv.text();
	const brawlerResults = await Papa.parse(brawlerCsvText, { header: true });

    for (const line of brawlerResults.data)
    {
        const brawler = getBrawlerByName(line.brawler);

        if (brawler)
        {
            const rankString = "rank_" + daList.version;
            const brawlerRank = line[rankString];

            if (brawlerRank != "")
            {
                daList.addBrawlerToTier(brawler, brawlerRank);
            }
        }
    }

    return daList;
}

export function createTierListButton(tierList, prevText = "", nextText = "", isFake = false)
{
    const daButton = document.createElement("a");
    if (!isFake) daButton.href = TIER_LIST_LINK + "v" + tierList.version;
    daButton.classList.add("tierListButton");

        const daLabel = document.createElement("label");
        daLabel.textContent = prevText + "v" + tierList.version + nextText;
        daButton.appendChild(daLabel);

    return daButton;
}

export function replaceFooter()
{
    const footer = document.getElementsByTagName("footer")[0];

    const para = document.createElement("p");
    para.innerHTML = `
        This website is not officially associated with KairosTime or KairosTime Gaming in any way.</br>
        Please, PLEASE support the source material! This website would not be possible without the work of KairosTime.</br>
        This content is not affiliated with, endorsed, sponsored, or specifically approved by Supercell and Supercell is not responsible for it. For more information see Supercell’s Fan Content Policy: <a href="https://www.supercell.com/fan-content-policy" target="_blank">www.supercell.com/fan-content-policy</a></br>
        Report any issues and feedback to <a href="https://discord.com/channels/@me/434840883637125121" target="_blank">@MonstyrSlayr on Discord</a></br>
        <a href="https://github.com/MonstyrSlayr/kairosTimeProTierLists" target="_blank">Source Code</a>
    `;

    footer.innerHTML = "";
    footer.appendChild(para);
}
