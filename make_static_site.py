import os
import csv
import shutil

def clean_subdirectories(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)
        return

    for name in os.listdir(directory):
        full_path = os.path.join(directory, name)
        if os.path.isdir(full_path):
            shutil.rmtree(full_path)

if __name__ == "__main__":
    tier_base = "./tierList"
    brawler_base = "./brawler"

    clean_subdirectories(tier_base)
    clean_subdirectories(brawler_base)

    tier_template_content = None
    brawler_template_content = None

    with open(tier_base + "/template.html", "r", encoding="utf-8") as f:
        tier_template_content = f.read()

    with open(brawler_base + "/template.html", "r", encoding="utf-8") as f:
        brawler_template_content = f.read()

    with open("./data/tierData.csv", newline='', encoding="utf-8") as f:
        reader = csv.DictReader(f)

        for row in reader:
            version = "v" + row["version"].strip()
            video = row["video"].strip()

            if (video != ""):
                folder_path = os.path.join(tier_base, version)
                os.makedirs(folder_path, exist_ok=True)

                replaced = tier_template_content
                replaced = replaced.replace("{version}", version)

                with open(os.path.join(folder_path, "index.html"), "w", encoding="utf-8") as out:
                    out.write(replaced)

    with open("./data/brawlerData.csv", newline='', encoding="utf-8") as f:
        reader = csv.DictReader(f)

        for row in reader:
            brawler = row["brawler"]
            brawler_id = "".join([char for char in brawler.strip().lower() if char.isalnum()])

            folder_path = os.path.join(brawler_base, brawler_id)
            os.makedirs(folder_path, exist_ok=True)

            replaced = brawler_template_content
            replaced = replaced.replace("{name}", brawler)
            replaced = replaced.replace("{id}", brawler_id)

            with open(os.path.join(folder_path, "index.html"), "w", encoding="utf-8") as out:
                out.write(replaced)
