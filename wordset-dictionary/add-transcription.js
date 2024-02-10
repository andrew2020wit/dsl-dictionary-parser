const fs = require('node:fs');

const outputTextPath = './wordset-with-tr.json';

const wordsetDict = require('./wordset.json');

const dictWithTranscription = require('../dict-source/lingvo.json');

wordsetDict.terms.forEach(term => {
    console.log(term.term);
    const transcription = dictWithTranscription.terms.find(item => item.term === term.term)?.articles?.[0]?.transcription || null;

    if (transcription) term.articles.forEach(article => article.transcription = transcription);
});

fs.writeFileSync(outputTextPath, JSON.stringify(wordsetDict, null, 2));
