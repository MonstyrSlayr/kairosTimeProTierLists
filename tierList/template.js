import { getTierListByVersion, replaceFooter, createBrawlerPin, UP_ARROW, DOWN_ARROW, NEW_ARROW, rankToNum, createTierListButton, HYPERCHARGE_ARROW, UNRELEASED_ARROW, STAR_POWER_2_ARROW, GADGET_2_ARROW, GADGET_1_ARROW, BUFFIE_ARROW, addImageToLegend } from "../data/data.js";

function getLastFolder(url, num)
{
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const parts = pathname.split('/').filter(part => part !== '').filter(part => part !== 'index.html'); // Split and remove empty elements and index.html
    return parts[parts.length - num];
}

const version = parseInt(getLastFolder(window.location.href, 1).replace("v", ""));
const tierList = await getTierListByVersion(version);

replaceFooter();

new YT.Player("youtubeVideo",
{
    height: "480",
    width: "854",
    videoId: tierList.youtubeId,
    playerVars: {
        rel: 0,
        modestbranding: 1
    },
    events: {
        onError: event =>
        {
            console.warn("player error, retrying...", event.data);
            loadRandomVideoAndComment();
        }
    }
});

const dateFormat =
{
    year: "numeric",
    month: "long"
};

const daDate = document.getElementById("date");
daDate.textContent = Intl.DateTimeFormat("en-US", dateFormat).format(tierList.date);

const daPros = document.getElementById("numPros");
daPros.textContent = "# of Pros: " + tierList.pros;

const previousTierList = await getTierListByVersion(tierList.version - 1);
const nextTierList = await getTierListByVersion(tierList.version + 1);

const prevButton = document.getElementById("prevTierList");
const nextButton = document.getElementById("nextTierList");

if (previousTierList != null)
{
    prevButton.replaceWith(createTierListButton(previousTierList, "< "));
}
else
{
    const nuButton = createTierListButton(nextTierList, "< ", "", true);
    prevButton.replaceWith(nuButton);
    nuButton.classList.add("antiButton");
}

if (nextTierList != null)
{
    nextButton.replaceWith(createTierListButton(nextTierList, "", " >"));
}
else
{
    const nuButton = createTierListButton(previousTierList, "", " >", true);
    nextButton.replaceWith(nuButton);
    nuButton.classList.add("antiButton");
}

const arrowSet = new Set();

const tierListDiv = document.getElementById("tierList");
for (const tier of tierList.tiers)
{
    const letterBlock = document.createElement("div");
    letterBlock.classList.add("tierLetterDiv");
    tierListDiv.appendChild(letterBlock);

        const letterName = document.createElement("h2");
        letterName.textContent = tier.letter;
        letterBlock.appendChild(letterName);

    const brawlerBlock = document.createElement("div");
    brawlerBlock.classList.add("tierBrawlersDiv");
    tierListDiv.appendChild(brawlerBlock);

    for (const brawler of tier.brawlers)
    {
        let rightArrow = null;
        let leftArrow = null;

        if (previousTierList != null)
        {
            const starPower2Difference = brawler.starPower2 - tierList.date;
            const starPower2DifferencePrev = brawler.starPower2 - previousTierList.date;

            if (starPower2Difference < 0 && starPower2DifferencePrev > 0)
            {
                leftArrow = STAR_POWER_2_ARROW;
            }

            const gadget1Difference = brawler.gadget1 - tierList.date;
            const gadget1DifferencePrev = brawler.gadget1 - previousTierList.date;

            if (gadget1Difference < 0 && gadget1DifferencePrev > 0)
            {
                leftArrow = GADGET_1_ARROW;
            }

            const gadget2Difference = brawler.gadget2 - tierList.date;
            const gadget2DifferencePrev = brawler.gadget2 - previousTierList.date;

            if (gadget2Difference < 0 && gadget2DifferencePrev > 0)
            {
                leftArrow = GADGET_2_ARROW;
            }

            const hyperDifference = brawler.hypercharge - tierList.date;
            const hyperDifferencePrev = brawler.hypercharge - previousTierList.date;

            if (hyperDifference < 0 && hyperDifferencePrev > 0)
            {
                leftArrow = HYPERCHARGE_ARROW;
            }

            const buffieDifference = brawler.buffies - tierList.date;
            const buffieDifferencePrev = brawler.buffies - previousTierList.date;

            if (buffieDifference < 0 && buffieDifferencePrev > 0)
            {
                leftArrow = BUFFIE_ARROW;
            }

            const releaseDifference = brawler.release - tierList.date;
            const releaseDifferencePrev = brawler.release - previousTierList.date;

            if (releaseDifference >= 0 || brawler.release == null)
            {
                leftArrow = UNRELEASED_ARROW;
            }
            else if (releaseDifference < 0 && releaseDifferencePrev > 0)
            {
                leftArrow = NEW_ARROW;
            }

            const prevRank = previousTierList.getBrawlerTier(brawler);
            if (prevRank != null)
            {
                const difference = rankToNum(tier.letter) - rankToNum(prevRank);

                if (difference > 0)
                {
                    rightArrow = UP_ARROW;
                }

                if (difference < 0)
                {
                    rightArrow = DOWN_ARROW;
                }
            }
        }
        else
        {
            leftArrow = NEW_ARROW;
        }

        const daPin = createBrawlerPin(brawler, rightArrow, leftArrow);
        arrowSet.add(rightArrow);
        arrowSet.add(leftArrow);
        brawlerBlock.appendChild(daPin);
    }
}

const tierLegend = document.getElementById("graphLegend");

if (arrowSet.has(UNRELEASED_ARROW))
{
    addImageToLegend(tierLegend, UNRELEASED_ARROW, ": Unreleased Brawler");
}
if (arrowSet.has(NEW_ARROW))
{
    addImageToLegend(tierLegend, NEW_ARROW, ": Brawler Released");
}
if (arrowSet.has(STAR_POWER_2_ARROW))
{
    addImageToLegend(tierLegend, STAR_POWER_2_ARROW, ": Second Star Power Released");
}
if (arrowSet.has(GADGET_1_ARROW))
{
    addImageToLegend(tierLegend, GADGET_1_ARROW, ": First Gadget Released");
}
if (arrowSet.has(GADGET_2_ARROW))
{
    addImageToLegend(tierLegend, GADGET_2_ARROW, ": Second Gadget Released");
}
if (arrowSet.has(HYPERCHARGE_ARROW))
{
    addImageToLegend(tierLegend, HYPERCHARGE_ARROW, ": Hypercharge Released");
}
if (arrowSet.has(BUFFIE_ARROW))
{
    addImageToLegend(tierLegend, BUFFIE_ARROW, ": Buffies Released");
}

const arrowScroll = document.getElementById("arrowScroll");

function setArrowVis()
{
    const arrows = Array.from(document.getElementsByClassName("pinArrow"));
    const daVal = arrowScroll.value;

    for (const arrow of arrows)
    {
        if (daVal == 0)
        {
            arrow.style.opacity = "0%";
        }
        else if (daVal == 1)
        {
            arrow.style.opacity = "50%";
        }
        else
        {
            arrow.style.opacity = "100%";
        }
    }
}

arrowScroll.addEventListener("input", function()
{
    setArrowVis();
});

arrowScroll.value = 2;
setArrowVis();
