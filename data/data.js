class TierList
{
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
