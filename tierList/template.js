import { getTierListByVersion, replaceFooter, createBrawlerPin, UP_ARROW, DOWN_ARROW, NEW_ARROW, rankToNum, createTierListButton } from "../../data/data.js";

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
        let arrow = null;

        if (previousTierList != null)
        {
            const prevRank = previousTierList.getBrawlerTier(brawler);
            if (prevRank == null)
            {
                arrow = NEW_ARROW;
            }
            else
            {
                const difference = rankToNum(tier.letter) - rankToNum(prevRank);

                if (difference > 0)
                {
                    arrow = UP_ARROW;
                }

                if (difference < 0)
                {
                    arrow = DOWN_ARROW;
                }
            }
        }

        const daPin = createBrawlerPin(brawler, arrow);
        brawlerBlock.appendChild(daPin);
    }
}

const arrowScroll = document.getElementById("arrowScroll");

arrowScroll.addEventListener("input", function()
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
});
arrowScroll.value = 0;
