export default class Title {
    name: string;
    regex: RegExp; // ["Ing"]
    correctAbbr: string; // Ing.
    salutationMan: string; // inžinier
    salutationWoman: string; // inžinierka
    description: string; // info
    link: string;

    constructor(name: string, correctAbbr: string, regex: RegExp, salutationMan: string, salutationWoman: string, description: string, link:string) {
        this.name = name;
        this.regex = new RegExp(regex.source, regex.flags + 'i'); // add case insensitivity
        this.correctAbbr = correctAbbr;
        this.salutationMan = salutationMan;
        this.salutationWoman = salutationWoman;
        this.description = description;
        this.link = link;
    }
}