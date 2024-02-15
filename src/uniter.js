const fs = require('node:fs');

const dictionaryName = 'CALD-Lingvo-Longman';
const dictionaryTermLanguage = 'en';
const dictionaryLicense = 'Not licensed';
const updateDate = new Date().toISOString();
const formatDescriptor = 'JSONDictionary';

// a source file must be utf-8!
const lingvoPath = './dict-source/lingvo.json';
const longmanSourcePath = './dict-source/longman.json';
const caldSourcePath = './dict-source/cald-dictionary.json';

const lingvoName = 'lingvo';
const longmanName = 'longman';
const caldName = 'CALD';

const outputPath = './dict-source/cald-lingvo-longman.json';

const lingvoSource = fs.readFileSync(lingvoPath, 'utf-8');
const longmanSource = fs.readFileSync(longmanSourcePath, 'utf-8');
const caldSource = fs.readFileSync(caldSourcePath, 'utf-8');

const dictLingvo = JSON.parse(lingvoSource);
const dictLongman = JSON.parse(longmanSource);
const dictCald = JSON.parse(caldSource);

const newDictionaryArticles = {};

addDictionary(dictCald, caldName);
addDictionary(dictLingvo, lingvoName);
addDictionary(dictLongman, longmanName);

const newDictionaryToExport = Object.keys(newDictionaryArticles).map(key => {
	return {
		term: key.trim(),
		articles: newDictionaryArticles[key]
	};
}
);

function addDictionary(dict, dictionaryName) {
	let x = 1;
	dict.terms.forEach(term => {
		let currentTerm = term.term;
		
		if (currentTerm === 'constructor') {
			currentTerm = 'constructor '
		}
		
		if (!newDictionaryArticles[currentTerm]) {
			newDictionaryArticles[currentTerm] = [];
		}
		
		x++;
		console.log(x, currentTerm);

		term.articles.forEach(art => art.dictionaryName = dictionaryName);

		newDictionaryArticles[currentTerm] = [...(newDictionaryArticles[currentTerm]), ...term.articles];
	});
}

fs.writeFileSync(outputPath, JSON.stringify({ formatDescriptor, dictionaryName, dictionaryTermLanguage, dictionaryLicense, updateDate, terms: newDictionaryToExport }, null, 2));

console.log('======== Done! ============');
