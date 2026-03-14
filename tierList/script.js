import { createTierListButton, getAllTierLists, replaceFooter } from "../data/data.js";

replaceFooter();

const tierLists = await getAllTierLists();

const tierListsDiv = document.getElementById("allTierLists");
for (const tierList of tierLists)
{
    const daButton = createTierListButton(tierList);
    tierListsDiv.appendChild(daButton);
}
