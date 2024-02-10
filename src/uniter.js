const fs = require('node:fs');

const dictionaryName = 'Lingvo-end-Longman';
const dictionaryTermLanguage = 'en';
const dictionaryLicense = 'Not licensed';
const updateDate = new Date().toISOString();
const formatDescriptor = 'JSONDictionary';

// a source file must be utf-8!
const sourcePath1 = './dict-source/lingvo.json';
const sourcePath2 = './dict-source/longman.json';
const sourcePath3 = './wordset-dictionary/wordset-with-tr.json';

const dictName1 = 'lingvo';
const dictName2 = 'longman';
const dictName3 = 'wordset';

const outputPath = './dict-source/lingvo-and-longman-and-wordset.json';

const source1 = fs.readFileSync(sourcePath1, 'utf-8');
const source2 = fs.readFileSync(sourcePath2, 'utf-8');
const source3 = fs.readFileSync(sourcePath3, 'utf-8');

const dict1 = JSON.parse(source1);
const dict2 = JSON.parse(source2);
const dict3 = JSON.parse(source3);

const newDictionaryArticles = {};

addDictionary(dict2, dictName2);
addDictionary(dict1, dictName1);
addDictionary(dict3, dictName3);

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
