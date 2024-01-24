const fs = require('node:fs');

const sourceTextPath = './files/morphology/en_US.dic';
const outputTextPath = './files/morphology/morphology.json';

const sourceText = fs.readFileSync(sourceTextPath, 'utf-8');
const sourceStringArray = sourceText.replaceAll('\r\n', '\n').split('\n');

const language = 'en';
const source = 'OpenOffice.org Hunspell en_US dictionary';
const updateDate = new Date().toISOString();
const formatDescriptor = 'JSONMorphologyDictionary';

const rules = [];

for (let i = 0; i < sourceStringArray.length; i++) {
	const item = sourceStringArray[i].trim().split('st:');
	
	if (item.length < 2) {
		continue;
	}
	
	if (item.length > 2) {
		console.error('item.length > 2');
	}
	
	let input = item[0].trim();
	
	const index = input.indexOf('/');
	
	if (index !== -1) {
		input = input.slice(0, index);
	}
	
	
	const output = item[1].trim();
	
	rules.push({i: input, o: output});
};

console.log('====================');


fs.writeFileSync(outputTextPath, JSON.stringify({formatDescriptor, language, source, updateDate, rules}));
