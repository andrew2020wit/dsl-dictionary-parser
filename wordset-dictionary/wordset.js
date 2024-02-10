const fs = require('node:fs/promises');

const dictionaryName = 'Wordset Dictionary';
const dictionaryTermLanguage = 'en';
const dictionaryLicense = 'https://github.com/wordset/wordset-dictionary'
const updateDate = new Date().toISOString();
const formatDescriptor = 'JSONDictionary';
const isShortVersion = false;
const outputTextPath = './wordset.json';
const terms = [];

readFiles().then();

async function readFiles() {
    const filesNames = [];
    const baseDir ='./data/'

    const dir = await fs.opendir(baseDir);

    for await (const dirent of dir) {
        filesNames.push(dirent.name);
    }

    console.log(filesNames);

    for await (const fileName of filesNames) {
        await computeSourceObj(baseDir + fileName);
    }

    await fs.writeFile(outputTextPath, JSON.stringify({formatDescriptor, dictionaryName, isShortVersion, dictionaryTermLanguage, dictionaryLicense, updateDate, terms}, null, 2));

    console.log('======== Done! ============');
}

async function computeSourceObj(sourceTextPath) {
    const sourceText = await fs.readFile(sourceTextPath, 'utf-8');
    const sourceObj = JSON.parse(sourceText);
    const sourceArr = Object.values(sourceObj);

    sourceArr.forEach(termItem => {
        const term = termItem.word;
        const articles = [];

        if ( termItem.meanings?.length) {
            termItem.meanings.forEach(meaning => {
                const partOfSpeech = meaning.speech_part;
                const definition = meaning.def;
                const defObject = {definition}

                if (partOfSpeech && definition) {
                    const article = {
                        partOfSpeech,
                        definitions: [defObject]
                    }

                    if (meaning.example) {
                        defObject.examples = [{original: meaning.example}];
                    }

                    if (meaning.synonyms?.length) {
                        defObject.synonym = meaning.synonyms.join(' | ')
                    }

                    articles.push(article);
                }
            })
        }

        if (articles.length) {
            terms.push({term, articles})
        }
    })

}

