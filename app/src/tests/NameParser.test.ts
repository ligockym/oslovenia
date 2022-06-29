import NameParser, {titleDatabase} from "../services/NameParser";

test('Test parsing name without titles', () => {
    const nameParser = new NameParser();
    const result = nameParser.parseName("Janko Mrkvička");
    expect(result).toStrictEqual({name: "Janko Mrkvička", titles: []});
});

test('Test parsing name with Ing. title', () => {
    const nameParser = new NameParser();
    const result = nameParser.parseName("Ing. Janko Mrkvička");
    const ing = titleDatabase.find((i) => i.correctAbbr === "Ing.");

    expect(result).toStrictEqual({name: "Janko Mrkvička", titles: [ing]});
});

test('Test parsing name with PhD. title', () => {
    const nameParser = new NameParser();
    const result = nameParser.parseName("Ing. Janko Mrkvička, PhD.");
    const ing = titleDatabase.find((i) => i.correctAbbr === "Ing.");
    const phd = titleDatabase.find((i) => i.correctAbbr === "PhD.");

    // Be aware of correct indexing of titles, more important first!
    expect(result).toStrictEqual({name: "Janko Mrkvička", titles: [phd, ing]});
    expect(result).not.toStrictEqual({name: "Janko Mrkvička", titles: [ing, phd]});
});

const testSalutation = (name: string, expectedSalutation: string|boolean) => {
    const nameParser = new NameParser();
    const result = nameParser.parseName(name);
    const salutation = nameParser.getSalutation(result);

    expect(salutation).toStrictEqual(expectedSalutation);
}

test('Test salutations', () => {
    testSalutation("Ing. Janko Mrkvička, PhD.", "doktor");
    testSalutation("Ing. Janko Mrkvička", "inžinier");
    testSalutation("Ing. arch. Janko Mrkvička", "inžinier");
    testSalutation("Janko Mrkvička", false);
    testSalutation("Bc. Janko Mrkvička", false);
});


