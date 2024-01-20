const fs = require('node:fs');

const sourceTextPath = './files/test-dict.dsl';
const outputTextPath = './files/demo-dictionary.json';

// a source file must be utf-8!
// const sourceTextPath = './dict-source/LingvoUniversalEnRu.dsl';
// const outputTextPath = './dict-source/dictionary.json';

const sourceText = fs.readFileSync(sourceTextPath, 'utf-8');
const sourceStringArray = sourceText.replaceAll('\r\n', '\n').split('\n');

const result = [];

let term = '';
let transcription = '';
let partOfSpeech = '';
let definition = '';
let examples = [];
let definitions = [];
let articles = [];
let synonym = '';
let antonym = '';
let nextLineIsSynonim = false;
let nextLineIsAntonim = false;

for (let i = 0; i < sourceStringArray.length; i++) {
	const item = sourceStringArray[i].trim();
	const firstChar = sourceStringArray[i][0];

	if (firstChar === '#' || !item.length) {
		continue;
	}

	if (firstChar.trim().length > 0) {
		pushTerm();
		term = item;
		continue;
	}

	const tr = getTranscritpion(item);
	if (tr) {		
		transcription = clear(tr);
		partOfSpeech = '';
		continue;
	}

	if (nextLineIsSynonim) {
		nextLineIsSynonim = false;
		synonym = clear(item);		
		continue;
	}

	if (item.includes('[b]Syn:[/b]')) {		
		nextLineIsSynonim = true;
		continue;
	}

	if (nextLineIsAntonim) {
		nextLineIsAntonim = false;
		synonym = clear(item);
		continue;
	}

	if (item.includes('[b]Ant:[/b]')) {
		nextLineIsAntonim = true;
		continue;
	}

	const pos = getPartOfSpeech(item);
	if (pos) {
		pushArticle();		
		partOfSpeech = pos;
		continue;
	}

	if (item.includes('[ex]')) {
		const example = getExample(item);

		if (example) {
			examples.push(example);
		}

		continue;
	}

	if (item.includes('[trn]')) {
		pushDefinition();
		definition = clear(item);
		continue;
	}
};

pushTerm();

function getExample(item) {
	const original = item.match(/\[lang id=1033\].+?\[\/lang\]/)?.[0];
	const translation = item.match(/\[\/lang\].+?\[\/ex\]/)?.[0];

	if (!original) {
		return null;
	}

	return { original: clear(original), translation: clear(translation)?.slice(3) || ''};
}

function getPartOfSpeech(item) {
	let result = '';

	switch (true) {
		case item.includes('[p]сущ.[/p]'):
			result = 'noun';
			break;
		case item.includes('[p]мест.[/p]'):
			result = 'pronoun';
			break;
		case item.includes('[p]гл.[/p]'):
			result = 'verb';
			break;
		case item.includes('[p]нареч.[/p]'):
			result = 'adverb';
			break;
		case item.includes('[p]прил.[/p]'):
			result = 'adjective';
			break;
		case item.includes('[p]союз[/p]'):
			result = 'conjunction';
			break;
		case item.includes('[p]межд.[/p]'):
			result = 'interjection';
			break;
		case item.includes('[p]предл.[/p]'):
			result = 'preposition';
			break;
	}

	return result;
}

function getTranscritpion(item) {
	return item.match(/\[t\].+?\[\/t\]/)?.[0];
}

function pushArticle() {
	pushDefinition();
	if (!partOfSpeech) {
		clearArticle();
		return;
	}

	articles.push({
		partOfSpeech,
		transcription,
		definitions
	});

	clearArticle();
}

function clearArticle() {
	clearDef();
	definitions = [];
	partOfSpeech = '';
}

function pushTerm() {
	pushArticle();

	if (!term) {
		return;
	}

	if (term[0] === '\'') {
		clearTerm();

		return;
	}

	result.push({
		term,
		articles
	});

	console.log(term);

	clearTerm();
}

function clearTerm() {
	clearArticle();
	term = '';
	transcription = '';
	articles = [];
}

function pushDefinition() {
	if (!definition || !term) {
		return;
	}

	const defItem = {
		definition,
	};

	if (examples.length) {
		defItem.examples = examples;
	}
	
	if (synonym) {
		defItem.synonym = synonym;
	}
	
	if (antonym) {
		defItem.antonym = antonym;
	}


	definitions.push(defItem);

	clearDef();
}

function clearDef() {
	definition = '';
	antonym = '';
	synonym = '';
	examples = [];
}

function clear(text) {
	if (!text) {
		return text;
	}
	
	return text.replaceAll('\t', '')
	.replaceAll('[lang id=1033]', '')
	.replaceAll('[/lang]', '')
		.replaceAll('[ref]', '')
		.replaceAll('[/ref]', '')
		.replaceAll('[m1]', '')
		.replaceAll('[m2]', '')
		.replaceAll('[m3]', '')
		.replaceAll('[/m]', '')
		.replaceAll('[i]', '')
		.replaceAll('[/i]', '')
		.replaceAll('[c]', '')
		.replaceAll('[/c]', '')
		.replaceAll('[b]', '')
		.replaceAll('[/b]', '')
		.replaceAll('[p]', '')
		.replaceAll('[/p]', '')
		.replaceAll('[t]', '')
		.replaceAll('[/t]', '')
		.replaceAll('[com]', '')
		.replaceAll('[/com]', '')
		.replaceAll('[ex]', '')
		.replaceAll('[/ex]', '')
		.replaceAll('[*]', '')
		.replaceAll('[/*]', '')
		.replaceAll('[trn]', '')
		.replaceAll('[/trn]', '');
}

console.log('======== Done! ============');

fs.writeFileSync(outputTextPath, JSON.stringify(result));
