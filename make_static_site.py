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

    with open("./data/tierData.csv", newline='', encoding="utf-8") as f:
        reader = csv.DictReader(f)

        for row in reader:
            version = "v" + row["version"].strip()
            video = row["video"].strip()

            if (video != ""):
                folder_path = os.path.join(tier_base, version)
                os.makedirs(folder_path, exist_ok=True)

    with open("./data/brawlerData.csv", newline='', encoding="utf-8") as f:
        reader = csv.DictReader(f)

        for row in reader:
            brawler = "".join([char for char in row["brawler"].strip().lower() if char.isalnum()])

            folder_path = os.path.join(brawler_base, brawler)
            os.makedirs(folder_path, exist_ok=True)
