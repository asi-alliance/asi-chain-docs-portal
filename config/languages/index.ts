import type { LanguageRegistration } from "shiki";
import dotEnvGrammar from "../../assets/languages/dotenv.tmLanguage.json";
import hoconGrammar from "../../assets/languages/hocon.tmLanguage.json";
import rholangGrammar from "../../assets/languages/rholang.tmLanguage.json";

const dotenv = {
    ...dotEnvGrammar,
    aliases: ["env"],
};

const hocon = {
    ...hoconGrammar,
    aliases: ["hocon"],
};

const rholang = {
    ...rholangGrammar,
    aliases: ["rholang"],
};

export default [dotenv, hocon, rholang] as LanguageRegistration[];
