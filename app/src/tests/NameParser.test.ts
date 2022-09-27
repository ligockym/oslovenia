import NameParser from "../services/NameParser";
import {titleDatabaseSk} from "../titleDatabase";

const testSalutation = (name: string, expectedSalutation: string, language: 'sk' | 'cz', gender: Gender) => {
    const nameParser = new NameParser();
    const result = nameParser.parseName(name, language);
    const salutation = nameParser.getWholeSalutation(result, gender, language);

    expect(salutation).toStrictEqual(expectedSalutation);
}

test('Test salutations', () => {
    // Doktor
    testSalutation("Ing. Janko Mrkvička, PhD.", "pán doktor", 'sk', 'man');
    testSalutation("Ing. Janko Mrkvička, PhD.", "pane doktore", 'cz', 'man');

    testSalutation("Ing. Janka Mrkvičková, PhD.", "pani doktorka", 'sk', 'woman');
    testSalutation("Ing. Janka Mrkvičková, PhD.", "paní doktorko", 'cz', 'woman');

    // Inžinier
    testSalutation("Ing. Janko Mrkvička", "pán inžinier", 'sk', 'man');
    testSalutation("Ing. Janko Mrkvička", "pane inženýre", 'cz', 'man');
    testSalutation("ing. Janko Mrkvička", "pane inženýre", 'cz', 'man'); // lowercase

    testSalutation("Ing. Janka Mrkvičková", "pani inžinierka", 'sk', 'woman');
    testSalutation("Ing. Janka Mrkvičková", "paní inženýrko", 'cz', 'woman');

    // Bakalár
    testSalutation("Bc. Janko Mrkvička", "pán", 'sk', 'man');
    testSalutation("Bc. Janko Mrkvička", "pane", 'cz', 'man');
    testSalutation("bc. Janko Mrkvička", "pane", 'cz', 'man'); // lowercase

    testSalutation("Bc. Janka Mrkvičková", "pani", 'sk', 'woman');
    testSalutation("Bc. Janka Mrkvičková", "paní", 'cz', 'woman');

    // Magister
    testSalutation("Mgr. Janko Mrkvička", "pán magister", 'sk', 'man');
    testSalutation("Mgr. Janko Mrkvička", "pane magistře", 'cz', 'man');

    testSalutation("Mgr. Janka Mrkvičková", "pani magisterka", 'sk', 'woman');
    testSalutation("Mgr. Janka Mrkvičková", "paní magistro", 'cz', 'woman');

    // Docent
    testSalutation("doc. Mgr. Janko Mrkvička", "pán docent", 'sk', 'man');
    testSalutation("doc. Mgr. Janko Mrkvička", "pane docente", 'cz', 'man');

    testSalutation("doc. Mgr. Janka Mrkvičková", "pani docentka", 'sk', 'woman');
    testSalutation("doc. Mgr. Janka Mrkvičková", "paní docentko", 'cz', 'woman');

    // Profesor
    testSalutation("prof. doc. Mgr. Janko Mrkvička", "pán profesor", 'sk', 'man');
    testSalutation("prof. Mgr. Janko Mrkvička", "pane profesore", 'cz', 'man');

    testSalutation("prof. Mgr. Janka Mrkvičková", "pani profesorka", 'sk', 'woman');
    testSalutation("prof. Mgr. Janka Mrkvičková", "paní profesorko", 'cz', 'woman');
});


