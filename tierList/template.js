import { getTierListByVersion, replaceFooter, createBrawlerPin, UP_ARROW, DOWN_ARROW, NEW_ARROW, rankToNum, createTierListButton, HYPERCHARGE_ARROW, UNRELEASED_ARROW, STAR_POWER_2_ARROW, GADGET_2_ARROW, GADGET_1_ARROW, BUFFIE_ARROW, addImageToLegend, postTierList } from "../data/data.js";

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

const daNotes = document.getElementById("notes");
for (const note of tierList.notes)
{
    if (note == "") continue;
    
    const someP = document.createElement("p");
    someP.textContent = "* " + note;
    daNotes.appendChild(someP);
}

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
const arrowSet = postTierList(tierListDiv, tierList, previousTierList);

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
