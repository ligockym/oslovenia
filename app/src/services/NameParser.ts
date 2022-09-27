/**
 * Parses name with titles
 */
import {toff} from "../i18n";
import {titleDatabaseCz, titleDatabaseSk} from "../titleDatabase";
import type Title from "../models/Title";

export type NameParserResult = {
    name: string; // firstname + lastname
    titles: Title[]; // all titles that name has
}

export default class NameParser {
    parseName(name: string, language: string): NameParserResult {
        const titles: Title[] = [];
        const titleDatabase = language === 'sk' ? titleDatabaseSk : titleDatabaseCz;

        titleDatabase.forEach((title, index) => {
            const replaced = name.replace(title.regex, '');
            if (replaced !== name) {
                // found, because it was replaced
                titles.push(title);
            }

            // update name so it does not include already found title
            name = replaced;
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
     * Returns highest title from parser result.
     * @param result
     */
    getHighestTitle(result: NameParserResult): Title | false {
        if (result.titles.length === 0) return false;
        return result.titles[0];
    }

    /**
     * Returns salutation for a gender. Otherwise empty string is returned.
     * @param title
     * @param gender
     */
    getTitleSalutation(title: Title, gender: Gender): string {
        // no title => no special salutation
        return gender === 'man' ? title.salutationMan : title.salutationWoman;
    }

    getNormalGenderSalutation(gender: Gender, language: string) {
        if (language === 'sk') {
            return gender === 'man' ? 'pán' : 'pani';
        } else {
            // cz
            return gender === 'man' ? 'pane' : 'paní';
        }
    }

    /**
     * From name and title returns whole salutation such as "pán inžinier"
     * @param parserResult
     * @param gender
     * @param language
     */
    getWholeSalutation(parserResult: NameParserResult, gender: Gender, language: string) {
        let result = this.getNormalGenderSalutation(gender, language);

        const highestTitle = this.getHighestTitle(parserResult);
        if (highestTitle && highestTitle.salutationMan) {
            result += ' ' + this.getTitleSalutation(highestTitle, gender);
        }

        return result;
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