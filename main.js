let isReady = false;
let isLoaded = false;

let questionSpan;
let goodSpan;
let badSpan;
let responseInput;
let validateBtn;
let showBtn;
let nextBtn;
let questionsView;
let indexView;
let verbsView;
let verbsListData;

const auxiliars = {
    avoir: {
        'je': 'ai',
        'tu': 'as',
        'il': 'a',
        'elle': 'a',
        'nous': 'avons',
        'vous': 'avez',
        'ils': 'ont',
        'elles': 'ont'
    },
    etre: {
        'je': 'suis',
        'tu': 'es',
        'il': 'est',
        'elle': 'est',
        'nous': 'sommes',
        'vous': 'êtes',
        'ils': 'sont',
        'elles': 'sont'
    }
};

const reflexive = {
    'je': 'me',
    'tu': 'te',
    'il': 'se',
    'elle': 'se',
    'nous': 'nous',
    'vous': 'vous',
    'ils': 'se',
    'elles': 'se'
};
const shorts = {
    je: "j'",
    tu: "t'",
    me: "m'",
    te: "t'",
    se: "s'"
}

const pronouns = ['je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles'];
const shortable = ['je', 'tu', 'ne', 'se', 'te', 'me'];
const vowels = ['a', 'e', 'i', 'o', 'u', 'à', 'é', 'ê'];
const femenin = ['elle', 'elles'];
const plural = ['nous', 'vous', 'ils', 'elles'];
const thirdPersonVerbs = ['pleuvoir'];

let verbFirst = [];
let rawVerbs;

async function prepare () {
    const response = await fetch('./questions.json');
    rawVerbs = await response.json();
    isLoaded = true;
    if (isReady)  { loadQuestion(); }
}

function ready () {
    isReady = true;
    questionSpan = document.getElementById('verb');
    goodSpan = document.getElementById('good');
    badSpan = document.getElementById('bad');
    responseInput = document.getElementById('response');

    validateBtn = document.getElementById('validate');
    showBtn = document.getElementById('show');
    nextBtn = document.getElementById('next');

    questionsView = document.getElementById('questions');
    indexView = document.getElementById('index');
    verbsView = document.getElementById('verbList');
    verbsListData = document.getElementById('theVerbs');
    
    if (isLoaded)  { loadQuestion(); }
}

const chances = [
    100, // etre
    100, // reflexive
    100, // avoir - irregular
    100, // avoir - 1st & 2nd
];

let verb;
let participle;
let helper;
let isReflexive;
let answerBuild;

function loadQuestion () {
    const totalChance = chances.reduce((s, v) => s + v);
    let chance = Math.random() * totalChance;
    let noun = pronouns[Math.floor(pronouns.length * Math.random())];
    const isFem = femenin.includes(noun);
    const isPlural = plural.includes(noun);
    let negChance = Math.random();
    const negation = negChance < 0.2;
    isReflexive = false;

    responseInput.value = '';
    goodSpan.innerText = '';
    validateBtn.disabled = false;
    showBtn.disabled = false;
    nextBtn.disabled = true;
    
    if (chances[0] > chance) { // etre
        let verbList = rawVerbs.etre;
        let selected = verbList[Math.floor(verbList.length * Math.random())];
        verb = selected.verb;
        participle = selected.participle;
        if (isFem) { participle += 'e'; }
        if (isPlural) { participle += 's'; }
        helper = 'etre';
    } else if ((chances[0] + chances[1]) > chance) { // etre reflexive
        let verbList = rawVerbs.reflexive;
        let selected = verbList[Math.floor(verbList.length * Math.random())];
        verb = selected.verb;
        participle = selected.participle;
        if (isFem) { participle += 'e'; }
        if (isPlural) { participle += 's'; }
        isReflexive = true;
        helper = 'etre';
    } else if ((chances[0] + chances[1] + chances[2]) > chance) { // avoir irregular
        let verbList = rawVerbs.avoir.third;
        let selected = verbList[Math.floor(verbList.length * Math.random())];
        verb = selected.verb;
        participle = selected.participle;
        helper = 'avoir';
    } else {
        let firstChance = Math.random();
        const first = firstChance < 0.8;
        if (first) {
            let verbList = rawVerbs.avoir.first;
            verb = verbList[Math.floor(verbList.length * Math.random())];
            participle = verb.replace(/er$/, 'é');
            helper = 'avoir';
        } else {
            let verbList = rawVerbs.avoir.second;
            verb = verbList[Math.floor(verbList.length * Math.random())];
            participle = verb.replace(/ir$/, 'i');
            helper = 'avoir';
        }
    }
    if (thirdPersonVerbs.includes(verb)) {
        noun = 'il';
    }

    let auxiliary = auxiliars[helper][noun];
    let withVowel = vowels.includes(auxiliary['0']);
    if (isReflexive) {
        let reflet = reflexive[noun];
        if (shortable.includes(reflet) && withVowel) {
            reflet = shorts[reflet];
            auxiliary = `${reflet}${auxiliary}`;
        } else {
            auxiliary = `${reflet} ${auxiliary}`;
        }
        withVowel = false;
    }
    

    answerBuild = '';
    if (negation) {        
        if (withVowel) {
            answerBuild += `${noun} n'${auxiliary} pas`;
        } else {
            answerBuild += `${noun} ne ${auxiliary} pas`;
        }
    } else {
        if (withVowel && shortable.includes(noun)) {
            answerBuild += `${shorts[noun]}${auxiliary}`;
        } else {
            answerBuild += `${noun} ${auxiliary}`;
        }
    }
    answerBuild += ` ${participle}`;
    
    questionSpan.innerText = `${noun} +${isReflexive ? ' se' : ''} ${verb} ${negation ? '(négatif)' : ''}`;
}

let revisado = false;

const goodResponses = [
    'ᕦ(ò_óˇ)ᕤ',
    '☜(⌒▽⌒)☞',
    '┌(ㆆ㉨ㆆ)ʃ',
    '♥‿♥',
    '♪♪ ヽ(ˇ∀ˇ )ゞ',
    '(•̀ᴗ•́)و ̑̑',
    '(◠﹏◠)',
    '~(^-^)~',
    '\\(ᵔᵕᵔ)/'
];

const badResponses = [
    '(╯°□°）╯︵ ┻━┻',
    'ಥ﹏ಥ',
    '¯\_(⊙︿⊙)_/¯',
    'ヽ༼ ಠ益ಠ ༽ﾉ',
    '｡ﾟ( ﾟஇ‸இﾟ)ﾟ｡',
    '눈_눈',
    '(๑•́ ₃ •̀๑)',
    '(҂◡_◡)',
    '( ಠ ʖ̯ ಠ)',
    '(⩾﹏⩽)'
];

let last = -1;

function next () {
    if (responseInput.value.trim() === answerBuild) {
        let newWord;
        do {
            newWord = Math.floor(goodResponses.length * Math.random());
        } while (newWord === last);
        last = newWord;
        goodSpan.innerText = `${goodResponses[newWord]}`;
        validateBtn.disabled = true;
        showBtn.disabled = true;
        nextBtn.disabled = false;
    } else {
        let newWord;
        do {
            newWord = Math.floor(badResponses.length * Math.random());
        } while (newWord === last);
        last = newWord;
        goodSpan.innerText = `${badResponses[newWord]}`;
    }
}

function show () {
    goodSpan.innerText = `${badResponses[Math.floor(badResponses.length * Math.random())]}`;
    responseInput.value = answerBuild;
    validateBtn.disabled = true;
    showBtn.disabled = true;
    nextBtn.disabled = false;
}

function study () {
    questionsView.classList.add('hidden');
    indexView.classList.remove('hidden');
    verbsView.classList.add('hidden');
}

function showQuestion () {
    questionsView.classList.remove('hidden');
    indexView.classList.add('hidden');
    verbsView.classList.add('hidden');
}

function getEntryHTML (verb, participle) {
    return `<div class="verb-entry">
        <dt>${verb}</dt>
        <dd>${participle}</dd>
    </div>
    `;
}

function showEtre () {
    let html = '';
    for (const verb of rawVerbs.etre) {
        html += getEntryHTML(verb.verb, verb.participle);
    }
    verbsListData.innerHTML = html;

    questionsView.classList.add('hidden');
    indexView.classList.add('hidden');
    verbsView.classList.remove('hidden');
}

function showAvoirEr () {
    let html = '';
    for (const verb of rawVerbs.avoir.first) {
        html += getEntryHTML(verb, verb.replace(/er$/, 'é'));
    }
    verbsListData.innerHTML = html;

    questionsView.classList.add('hidden');
    indexView.classList.add('hidden');
    verbsView.classList.remove('hidden');
}

function showAvoirIr () {
    let html = '';
    for (const verb of rawVerbs.avoir.second) {
        html += getEntryHTML(verb, verb.replace(/er$/, 'é'));
    }
    verbsListData.innerHTML = html;

    questionsView.classList.add('hidden');
    indexView.classList.add('hidden');
    verbsView.classList.remove('hidden');
}

function showAvoirIrregular () {
    let html = '';
    for (const verb of rawVerbs.avoir.third) {
        html += getEntryHTML(verb.verb, verb.participle);
    }
    verbsListData.innerHTML = html;

    questionsView.classList.add('hidden');
    indexView.classList.add('hidden');
    verbsView.classList.remove('hidden');
}

function showAvoirReflexive () {
    let html = '';
    for (const verb of rawVerbs.reflexive) {
        html += getEntryHTML(`se ${verb.verb}`, verb.participle);
    }
    verbsListData.innerHTML = html;

    questionsView.classList.add('hidden');
    indexView.classList.add('hidden');
    verbsView.classList.remove('hidden');
}

prepare();