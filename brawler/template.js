import { getBrawlerById, createBrawlerPin, replaceFooter, getAllTierLists, createTierListButton, rankToNum, numToRank } from "../data/data.js";

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

const replaceWithRecentTierList = document.getElementById("replaceWithRecentTierList");
const recentTierListDiv = createTierListButton(mostRecentTierList);
replaceWithRecentTierList.replaceWith(recentTierListDiv);

const mostRecentRankingSpan = document.getElementById("mostRecent");
mostRecentRankingSpan.textContent = mostRecentRanking;

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

const rankNums = allRankings.map(rank => rankToNum(rank));
let daTotal = 0;
rankNums.forEach(num => daTotal += num);
const daAvg = daTotal / allRankings.length;

const avgRankingSpan = document.getElementById("meanRanking");
avgRankingSpan.textContent = numToRank(daAvg);

// make da graph... WITHOUT AN ALREADY EXISTING API
// HAHAHAHAHAHAhahaha... ughhhhh
const graphWrapper = document.getElementById("kairosOverTimeDivWrapper");
const graph = document.getElementById("kairosOverTime");
const graphCtx = graph.getContext("2d");
const overlay = document.getElementById("kairosOverLay");
const overlayCtx = overlay.getContext("2d");

function drawGraph()
{
    const daWidth = graph.width;
    const daHeight = graph.height;
    const olWidth = overlay.width;
    const olHeight = overlay.height;
    const brawlerPinImg = new Image();

    brawlerPinImg.addEventListener("load", () =>
    {
        graphCtx.clearRect(0, 0, daWidth, daHeight);
        overlayCtx.clearRect(0, 0, olWidth, olHeight);

        graphCtx.fillStyle = "white";
        overlayCtx.fillStyle = "white";
        graphCtx.lineWidth = 2;

        // horizontal lines starting from top:
        const daLetters = ["S", "A", "B", "C", "D", "F"];
        const topPadding = 23; // px
        const bottomPadding = 15; // px
        const rightPadding = 18; // px
        const leftPadding = 10; // px
        const tierFontSize = 24;
        const versionFontSize = 12;
        const lilSpace = 5; // also px

        graphCtx.font = tierFontSize + "px sans-serif";
        graphCtx.textAlign = "left";
        graphCtx.textBaseline = "middle";

        overlayCtx.font = tierFontSize + "px sans-serif";
        overlayCtx.textAlign = "left";
        overlayCtx.textBaseline = "middle";

        function tierToY(tier)
        {
            return topPadding + ((tier / (daLetters.length - 1)) * (daHeight - topPadding - bottomPadding - versionFontSize));
        }

        function versionToX(version)
        {
            return leftPadding + tierFontSize + lilSpace + (((version - 1) / (tierLists.length - 1)) * (daWidth - rightPadding - lilSpace - (leftPadding + tierFontSize + lilSpace)));
        }

        graphCtx.strokeStyle = "#ffffff";
        for (let i = 0; i < daLetters.length; i++)
        {
            const daY = tierToY(i);

            graphCtx.beginPath();
            graphCtx.moveTo(tierFontSize + leftPadding, daY);
            graphCtx.lineTo(daWidth - rightPadding, daY);
            graphCtx.stroke();

            overlayCtx.fillText(daLetters[i], 0, daY);
        }

        // vertical lines starting from left: v1 - recent v
        graphCtx.textAlign = "center";
        graphCtx.textBaseline = "bottom";
        graphCtx.font = versionFontSize + "px sans-serif";
        graphCtx.strokeStyle = "#ffffff80";

        const circleLocations = [];

        for (const tierList of tierLists)
        {
            const daX = versionToX(tierList.version);

            graphCtx.beginPath();
            graphCtx.moveTo(daX, daHeight - bottomPadding + lilSpace - versionFontSize);
            graphCtx.lineTo(daX, topPadding - lilSpace);
            graphCtx.stroke();

            graphCtx.fillText("v" + tierList.version, daX, daHeight);

            const brawlerTier = tierList.getBrawlerTier(brawler);
            if (brawlerTier != null)
            {
                const daX = versionToX(tierList.version);
                const daTierNum = daLetters.findIndex(letter => letter == brawlerTier);
                const daY = tierToY(daTierNum);
                circleLocations.push({x: daX, y: daY});
            }
        }

        // lines
        for (let i = 0; i < circleLocations.length - 1; i++)
        {
            const preCirc = circleLocations[i];
            const postCirc = circleLocations[i + 1];
            graphCtx.beginPath();
            graphCtx.moveTo(preCirc.x, preCirc.y);
            graphCtx.lineTo(postCirc.x, postCirc.y);
            graphCtx.stroke();
        }

        // so... they will actually be diamonds
        const diamondSize = 14;
        let hasDrawnPin = false;
        for (const circle of circleLocations)
        {
            if (!hasDrawnPin)
            {
                hasDrawnPin = true;

                graphCtx.drawImage(brawlerPinImg, circle.x - diamondSize * 2, circle.y - diamondSize * 2, diamondSize * 4, diamondSize * 4);

                continue;
            }

            graphCtx.beginPath();
            graphCtx.moveTo(circle.x, circle.y - diamondSize);
            graphCtx.lineTo(circle.x - diamondSize, circle.y);
            graphCtx.lineTo(circle.x, circle.y + diamondSize);
            graphCtx.lineTo(circle.x + diamondSize, circle.y);
            graphCtx.closePath();
            graphCtx.fill();
        }
    });

    brawlerPinImg.src = brawler.neutral;

    graphWrapper.scrollLeft = 999999;
    overlay.style.left = graphWrapper.scrollLeft;
}

const resizeObserver = new ResizeObserver(entries =>
{
    drawGraph();
});
resizeObserver.observe(graph);

graphWrapper.addEventListener("scroll", function()
{
    overlay.style.left = graphWrapper.scrollLeft;
});

drawGraph();

const graphLegend = document.getElementById("graphLegend");

    const brawlerIntroDiv = document.createElement("div");
    graphLegend.appendChild(brawlerIntroDiv);

        const legendPin = document.createElement("img");
        legendPin.src = brawler.neutral;
        brawlerIntroDiv.appendChild(legendPin);

        const introText = document.createElement("label");
        introText.textContent = ": Brawler Introduced";
        brawlerIntroDiv.appendChild(introText);
