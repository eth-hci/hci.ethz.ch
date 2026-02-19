// groups.json contains information about each group
import groups from '../data/groups.json';
import courses from '../data/teaching.json';
import pubsBib from '../data/pubs.bib';
import contact from '../data/contact.md';

// pubs.bib contains all the publications
// please use the bib provided by Google Scholar, otherwise this parser will return error
// and make sure you add comma to the end of the last entry
// see issue: https://github.com/yepengding/bibtex-js-parser/issues/2
import {BibtexParser} from "bibtex-js-parser";
import css from "./style.css";
console.log(contact)

const pubs = BibtexParser.parseToJSON(pubsBib);
export default {
    groups,
    pubs,
    courses,
    contact
}