/**
 * Parses name with titles
 */
import Title from "../models/Title";

// Order is important! More important first, then longer (Ing. arch.).

// TODO: Fill data from https://www.vysokeskoly.sk/clanok/akademicke-tituly-a-ich-pouzivanie
export const titleDatabase: Title[] = [
    new Title("Doktor",
        [/PhD\./],
        "PhD.",
        "doktor",
        `Tento titul sa udeľuje osobám, ktoré v rámci svojho vysokoškolského študijného programu uskutočnili 
        výskumnú prácu v predmete svojho štúdia a prípadne splnili ďalšie podmienky presnejšie definované študijnými 
        zvyklosťami krajiny (napr. obhájili dizertačnú prácu pred komisiou).`,
        "https://sk.wikipedia.org/wiki/Doktor_(PhD.)"),
    new Title("Inžinier architekt", [/Ing\. arch\./], "Ing. arch.", "inžinier", "Akademický titul, ktorý sa udeľuje po absolvovaní inžinierskeho štúdia v oblasti architektúry a urbanizmu.", "https://sk.wikipedia.org/wiki/In%C5%BEinier_architekt"),
    new Title("Inžinier", [/Ing./], "Ing.", "inžinier", "Akademický titul sa udeľuje absolventom vysokoškolského inžinierskeho štúdia v technických, ekonomických a poľnohospodárskych študijných odboroch.", "https://sk.wikipedia.org/wiki/In%C5%BEinier"),
    new Title("Magister", [/Mgr\./], "Mgr.", "magister", "Akademický titul udeľovaný absolventom univerzitných, bohosloveckých a umeleckých vysokých škôl.", "https://sk.wikipedia.org/wiki/Bakal%C3%A1r"),
    new Title("Bakalár", [/Bc\./], "Bc.", "", "Akademický titul, ktorý sa udeľuje absolventom prvého (bakalárskeho) stupňa vysokoškolského štúdia.", "https://sk.wikipedia.org/wiki/Magister_(akademick%C3%A1_hodnos%C5%A5)"),
];

export type NameParserResult = {
    name: string; // firstname + lastname
    titles: Title[]; // all titles that name has
}

export default class NameParser {
    parseName(name: string): NameParserResult {
        const titles: Title[] = [];
        titleDatabase.forEach((title, index) => {
            title.regex.forEach((regex) => {
                const replaced = name.replace(regex, '');
                if (replaced !== name) {
                    // found, because it was replaced
                    titles.push(title);
                }

                // update name so it does not include already found title
                name = replaced;
            });
        });

        // trim
        name = name.trim();
        // remove commas from beggining and end
        name = name.replace(/^,+/, '').replace(/,+$/, '')
        // trim once more
        name = name.trim();

        return {name: name, titles: titles};
    }

    /**
     * Returns false, when no special salutation can be used.
     * @param result
     */
    getSalutation(result: NameParserResult): string | boolean {
        if (result.titles.length > 0 && result.titles[0].salutation) {
            return result.titles[0].salutation;
        }
        return false;
    }

    // TODO: Some other time.
    htmlColorName(name: string, result: NameParserResult): string {
        // first is color, second is background
        const colors = [
            ["rgba(52, 152, 219, 1.0)", "rgba(52, 152, 219, 0.5)"], // blue
        ];

        // first remove all span tags
        result.titles.forEach((title, index) => {
            // replace Ing. with colored <span>Ing.</span>
           name = name.replace(title.correctAbbr, `<span style="color: ${colors[index][0]}; background-color: ${colors[index][1]}">${title.correctAbbr}</span>`)
        });

        return name;
    }
}