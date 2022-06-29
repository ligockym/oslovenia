export default class Title {
    name: string;
    regex: RegExp[]; // ["Ing"]
    correctAbbr: string; // Ing.
    salutation: string; // inžinier
    description: string; // info
    link: string;

    constructor(name: string, regex: RegExp[], correctAbbr: string, salutation: string, description: string, link:string) {
        this.name = name;
        this.regex = regex;
        this.correctAbbr = correctAbbr;
        this.salutation = salutation;
        this.description = description;
        this.link = link;
    }
}