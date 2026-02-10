import { useState, useEffect, useReducer, useCallback, useRef, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════════
   🇩🇪  DEUTSCH BUDDY — Your Friendly German Learning Companion
   ═══════════════════════════════════════════════════════════════════ */

const LEVELS = [
  { xp: 0, title: "Anfänger", badge: "🥚" }, { xp: 100, title: "Beginner", badge: "🐣" },
  { xp: 300, title: "Elementary", badge: "🐥" }, { xp: 600, title: "Pre-Intermediate", badge: "🦜" },
  { xp: 1000, title: "Intermediate", badge: "🦅" }, { xp: 1600, title: "Upper-Int.", badge: "🏅" },
  { xp: 2400, title: "Advanced", badge: "🎖️" }, { xp: 3500, title: "Expert", badge: "👑" },
  { xp: 5000, title: "Meister", badge: "🏆" },
];

const UNITS = [
  { id:"u1", title:"Hello World!", desc:"Greetings, introductions & basics", icon:"👋", color:"#58CC02", level:"A1",
    lessons:[
      { id:"u1l1", title:"Greetings", words:[
        {de:"Hallo",en:"Hello",ph:"hah-loh",tip:"Used any time of day"},
        {de:"Guten Morgen",en:"Good morning",ph:"goo-ten mor-gen",tip:"Use before noon"},
        {de:"Guten Tag",en:"Good day",ph:"goo-ten tahg",tip:"Universal polite greeting"},
        {de:"Guten Abend",en:"Good evening",ph:"goo-ten ah-bent",tip:"Use after 6pm"},
        {de:"Gute Nacht",en:"Good night",ph:"goo-teh nakht",tip:"Only when going to sleep"},
        {de:"Auf Wiedersehen",en:"Goodbye (formal)",ph:"owf vee-der-zay-en",tip:"Until we see again"},
        {de:"Tschüss",en:"Bye!",ph:"chüss",tip:"Casual — use with friends"},
        {de:"Bis bald",en:"See you soon",ph:"bis bahlt"},
      ]},
      { id:"u1l2", title:"Introductions", words:[
        {de:"Ich heiße...",en:"My name is...",ph:"ikh hy-seh",tip:"Literally: I am called..."},
        {de:"Wie heißen Sie?",en:"What's your name? (formal)",ph:"vee hy-sen zee"},
        {de:"Wie heißt du?",en:"What's your name? (casual)",ph:"vee hyst doo"},
        {de:"Freut mich!",en:"Nice to meet you!",ph:"froyt mikh"},
        {de:"Woher kommen Sie?",en:"Where are you from?",ph:"vo-hair koh-men zee"},
        {de:"Ich komme aus...",en:"I come from...",ph:"ikh koh-meh ows"},
        {de:"Ich spreche Englisch",en:"I speak English",ph:"ikh shpre-kheh eng-lish"},
        {de:"Ich lerne Deutsch",en:"I'm learning German",ph:"ikh ler-neh doytsh",tip:"Germans love hearing this!"},
      ]},
      { id:"u1l3", title:"Polite Words", words:[
        {de:"Bitte",en:"Please",ph:"bit-teh",tip:"Also means 'you're welcome'!"},
        {de:"Danke",en:"Thank you",ph:"dahn-keh"},
        {de:"Danke schön",en:"Thank you very much",ph:"dahn-keh shurn"},
        {de:"Vielen Dank",en:"Many thanks",ph:"fee-len dahnk"},
        {de:"Entschuldigung",en:"Excuse me / Sorry",ph:"ent-shool-dee-goong"},
        {de:"Es tut mir leid",en:"I'm sorry",ph:"es toot meer lyed"},
        {de:"Kein Problem",en:"No problem",ph:"kyne pro-blaym"},
        {de:"Natürlich",en:"Of course",ph:"na-tür-likh"},
      ]},
    ]},
  { id:"u2", title:"All About Me", desc:"Numbers, feelings & personal info", icon:"🧑", color:"#CE82FF", level:"A1",
    lessons:[
      { id:"u2l1", title:"Numbers 1-20", words:[
        {de:"eins",en:"one"},{de:"zwei",en:"two"},{de:"drei",en:"three"},{de:"vier",en:"four"},
        {de:"fünf",en:"five"},{de:"sechs",en:"six"},{de:"sieben",en:"seven"},{de:"acht",en:"eight"},
        {de:"neun",en:"nine"},{de:"zehn",en:"ten"},{de:"elf",en:"eleven"},{de:"zwölf",en:"twelve"},
        {de:"dreizehn",en:"thirteen"},{de:"vierzehn",en:"fourteen"},{de:"fünfzehn",en:"fifteen"},
        {de:"zwanzig",en:"twenty"},{de:"hundert",en:"hundred"},{de:"tausend",en:"thousand"},
      ]},
      { id:"u2l2", title:"Feelings", words:[
        {de:"Wie geht es Ihnen?",en:"How are you? (formal)",tip:"Use with strangers"},
        {de:"Wie geht's?",en:"How are you? (casual)"},
        {de:"Mir geht es gut",en:"I'm doing well"},{de:"Sehr gut!",en:"Very good!"},
        {de:"Es geht",en:"So-so",tip:"When things are just okay"},
        {de:"Nicht so gut",en:"Not so good"},{de:"Ich bin müde",en:"I am tired"},
        {de:"Ich bin glücklich",en:"I am happy"},{de:"Ich bin traurig",en:"I am sad"},
        {de:"Ich bin hungrig",en:"I am hungry"},
      ]},
    ]},
  { id:"u3", title:"Family & Friends", desc:"Family members & possessives", icon:"👨‍👩‍👧‍👦", color:"#FF9600", level:"A1",
    lessons:[
      { id:"u3l1", title:"Family", words:[
        {de:"die Familie",en:"the family",g:"f"},{de:"die Mutter",en:"the mother",g:"f"},
        {de:"der Vater",en:"the father",g:"m"},{de:"die Schwester",en:"the sister",g:"f"},
        {de:"der Bruder",en:"the brother",g:"m"},{de:"die Großmutter",en:"the grandmother",g:"f"},
        {de:"der Großvater",en:"the grandfather",g:"m"},{de:"die Tante",en:"the aunt",g:"f"},
        {de:"der Onkel",en:"the uncle",g:"m"},{de:"das Kind",en:"the child",g:"n"},
        {de:"der Sohn",en:"the son",g:"m"},{de:"die Tochter",en:"the daughter",g:"f"},
      ]},
      { id:"u3l2", title:"Possessives", grammar:`Possessive pronouns show ownership. The ending matches the NOUN's gender!

🔑 For masculine/neuter: mein, dein, sein, ihr
🔑 For feminine/plural: meine, deine, seine, ihre

• mein Bruder (my brother — masc, no ending)
• meine Schwester (my sister — fem, add -e)
• mein Kind (my child — neuter, no ending)
• meine Eltern (my parents — plural, add -e)`, words:[
        {de:"mein/meine",en:"my",tip:"mein(m/n) meine(f/pl)"},
        {de:"dein/deine",en:"your (casual)"},{de:"sein/seine",en:"his/its"},
        {de:"ihr/ihre",en:"her/their"},{de:"unser/unsere",en:"our"},
        {de:"Ihr/Ihre",en:"your (formal)",tip:"Always capitalized!"},
      ]},
    ]},
  { id:"u4", title:"Food & Drink", desc:"Ordering food & restaurant vocab", icon:"🍽️", color:"#FF4B4B", level:"A1",
    lessons:[
      { id:"u4l1", title:"Food", words:[
        {de:"das Brot",en:"bread",g:"n",tip:"Germany has 3000+ types!"},
        {de:"die Butter",en:"butter",g:"f"},{de:"der Käse",en:"cheese",g:"m"},
        {de:"die Wurst",en:"sausage",g:"f"},{de:"das Ei",en:"egg",g:"n"},
        {de:"der Reis",en:"rice",g:"m"},{de:"die Kartoffel",en:"potato",g:"f"},
        {de:"das Hähnchen",en:"chicken",g:"n"},{de:"der Fisch",en:"fish",g:"m"},
        {de:"das Gemüse",en:"vegetables",g:"n"},{de:"das Obst",en:"fruit",g:"n"},
        {de:"die Suppe",en:"soup",g:"f"},{de:"der Kuchen",en:"cake",g:"m"},
      ]},
      { id:"u4l2", title:"Drinks", words:[
        {de:"das Wasser",en:"water",g:"n"},{de:"der Kaffee",en:"coffee",g:"m"},
        {de:"der Tee",en:"tea",g:"m"},{de:"die Milch",en:"milk",g:"f"},
        {de:"der Saft",en:"juice",g:"m"},{de:"das Bier",en:"beer",g:"n"},
        {de:"der Wein",en:"wine",g:"m"},{de:"die Limonade",en:"lemonade",g:"f"},
      ]},
      { id:"u4l3", title:"At the Restaurant", words:[
        {de:"Ich möchte...",en:"I would like...",tip:"Polite way to order"},
        {de:"Die Speisekarte, bitte",en:"The menu, please"},
        {de:"Ich hätte gern...",en:"I'd like to have...",tip:"Even more polite"},
        {de:"Die Rechnung, bitte",en:"The bill, please"},
        {de:"Es schmeckt gut!",en:"It tastes good!"},
        {de:"Ich bin satt",en:"I'm full",tip:"NOT 'ich bin voll' — that means drunk!"},
        {de:"Prost!",en:"Cheers!",tip:"Look in the eyes when toasting!"},
        {de:"Guten Appetit!",en:"Enjoy your meal!"},
      ]},
    ]},
  { id:"u5", title:"Grammar Basics", desc:"Articles, pronouns & present tense", icon:"📐", color:"#1CB0F6", level:"A1",
    lessons:[
      { id:"u5l1", title:"der, die, das", grammar:`Every German noun has a gender — THE most important concept!

🔵 der = masculine (der Mann, der Tisch, der Hund)
🔴 die = feminine (die Frau, die Lampe, die Katze)
🟢 das = neuter (das Kind, das Buch, das Haus)
🟣 die = ALL plurals (die Männer, die Bücher)

📌 MEMORY TRICKS:
• -ung, -heit, -keit, -schaft, -tion → always DIE
• -chen, -lein → always DAS (diminutives)
• -er, -ling, -ismus → usually DER
• Days, months, seasons → DER

⚠️ Always memorize the article WITH every noun!`, words:[
        {de:"der Mann",en:"the man",g:"m"},{de:"die Frau",en:"the woman",g:"f"},
        {de:"das Kind",en:"the child",g:"n"},{de:"der Tisch",en:"the table",g:"m"},
        {de:"die Lampe",en:"the lamp",g:"f"},{de:"das Buch",en:"the book",g:"n"},
        {de:"der Hund",en:"the dog",g:"m"},{de:"die Katze",en:"the cat",g:"f"},
      ]},
      { id:"u5l2", title:"Present Tense", grammar:`German verbs conjugate by subject. Remove -en to get the stem, then add:

🎯 PATTERN (spielen = to play):
ich spiel-E          du spiel-ST
er/sie/es spiel-T    wir spiel-EN
ihr spiel-T          sie/Sie spiel-EN

📝 ENDINGS: -e, -st, -t, -en, -t, -en

⚠️ SEIN (to be): ich bin, du bist, er ist, wir sind, ihr seid, sie sind
⚠️ HABEN (to have): ich habe, du hast, er hat, wir haben, ihr habt, sie haben`, words:[
        {de:"spielen",en:"to play"},{de:"lernen",en:"to learn"},
        {de:"machen",en:"to make/do"},{de:"kaufen",en:"to buy"},
        {de:"arbeiten",en:"to work"},{de:"kochen",en:"to cook"},
        {de:"trinken",en:"to drink"},{de:"essen",en:"to eat"},
      ]},
      { id:"u5l3", title:"Pronouns", grammar:`Personal pronouns are essential building blocks!

ich = I          wir = we
du = you (casual)  ihr = you all
er = he          sie = they
sie = she        Sie = you (formal) ← capitalized!
es = it

💡 TIPS:
• "du" → friends, family, kids, pets
• "Sie" → strangers, bosses, official situations
• When in doubt, use "Sie" — it's polite!`, words:[
        {de:"ich",en:"I"},{de:"du",en:"you (casual)"},{de:"er",en:"he"},
        {de:"sie",en:"she"},{de:"es",en:"it"},{de:"wir",en:"we"},
        {de:"ihr",en:"you all"},{de:"Sie",en:"you (formal)"},
      ]},
    ]},
  { id:"u6", title:"Daily Life", desc:"Time, days, home & routines", icon:"🏠", color:"#FF86D0", level:"A1-A2",
    lessons:[
      { id:"u6l1", title:"Time & Days", words:[
        {de:"Wie spät ist es?",en:"What time is it?"},{de:"Es ist drei Uhr",en:"It is 3 o'clock"},
        {de:"halb vier",en:"3:30",tip:"⚠️ halb = half TO next hour!"},
        {de:"Montag",en:"Monday"},{de:"Dienstag",en:"Tuesday"},
        {de:"Mittwoch",en:"Wednesday",tip:"Mid-week"},{de:"Donnerstag",en:"Thursday"},
        {de:"Freitag",en:"Friday"},{de:"Samstag",en:"Saturday"},{de:"Sonntag",en:"Sunday"},
        {de:"heute",en:"today"},{de:"morgen",en:"tomorrow"},{de:"gestern",en:"yesterday"},
      ]},
      { id:"u6l2", title:"Around the House", words:[
        {de:"das Haus",en:"house",g:"n"},{de:"die Wohnung",en:"apartment",g:"f"},
        {de:"die Küche",en:"kitchen",g:"f"},{de:"das Schlafzimmer",en:"bedroom",g:"n"},
        {de:"das Badezimmer",en:"bathroom",g:"n"},{de:"das Wohnzimmer",en:"living room",g:"n"},
        {de:"der Garten",en:"garden",g:"m"},{de:"die Tür",en:"door",g:"f"},
        {de:"das Fenster",en:"window",g:"n"},{de:"der Schlüssel",en:"key",g:"m"},
      ]},
    ]},
  { id:"u7", title:"Getting Around", desc:"Transport, directions & travel", icon:"🚂", color:"#FFC800", level:"A2",
    lessons:[
      { id:"u7l1", title:"Transport", words:[
        {de:"der Zug",en:"train",g:"m"},{de:"der Bus",en:"bus",g:"m"},
        {de:"die U-Bahn",en:"subway",g:"f"},{de:"das Auto",en:"car",g:"n"},
        {de:"das Fahrrad",en:"bicycle",g:"n"},{de:"der Bahnhof",en:"train station",g:"m"},
        {de:"der Flughafen",en:"airport",g:"m"},{de:"die Fahrkarte",en:"ticket",g:"f"},
        {de:"einfach",en:"one-way"},{de:"hin und zurück",en:"round trip"},
      ]},
      { id:"u7l2", title:"Directions", words:[
        {de:"links",en:"left"},{de:"rechts",en:"right"},{de:"geradeaus",en:"straight ahead"},
        {de:"die Kreuzung",en:"intersection",g:"f"},{de:"die Ampel",en:"traffic light",g:"f"},
        {de:"gegenüber",en:"across from"},{de:"neben",en:"next to"},
        {de:"zwischen",en:"between"},{de:"Wo ist...?",en:"Where is...?"},
      ]},
    ]},
  { id:"u8", title:"Cases", desc:"Accusative & dative case", icon:"🧩", color:"#2B70C9", level:"A2",
    lessons:[
      { id:"u8l1", title:"Accusative", grammar:`The accusative case = DIRECT OBJECT!

🔑 Only MASCULINE changes: der → den, ein → einen
die → die (same!) | das → das (same!)

📝 Ich sehe DEN Mann. (I see the man.)
📝 Sie kauft DIE Zeitung. (She buys the newspaper.)

📌 Accusative prepositions: durch (through), für (for), gegen (against), ohne (without), um (around)
Memory: DOGFU!`, words:[
        {de:"den (acc. masc.)",en:"the (accusative masculine)"},
        {de:"durch",en:"through"},{de:"für",en:"for"},{de:"gegen",en:"against"},
        {de:"ohne",en:"without"},{de:"um",en:"around"},
      ]},
      { id:"u8l2", title:"Dative", grammar:`The dative case = INDIRECT OBJECT!

🔑 CHANGES: der → dem | die → der | das → dem | die(pl) → den (+n)

📝 Ich gebe DEM Mann das Buch.
📝 Sie hilft DER Frau.

📌 Dative prepositions: aus, bei, mit, nach, seit, von, zu
Sing it: "Aus-bei-mit, nach-seit-von-zu!"

📌 Dative verbs: helfen, danken, gefallen, gehören, folgen`, words:[
        {de:"dem (dat. masc./neut.)",en:"the (dative m./n.)"},
        {de:"der (dat. fem.)",en:"the (dative fem.)"},
        {de:"aus",en:"from/out of"},{de:"bei",en:"at/near"},{de:"mit",en:"with"},
        {de:"nach",en:"after/to"},{de:"seit",en:"since"},{de:"von",en:"from/of"},{de:"zu",en:"to"},
      ]},
    ]},
  { id:"u9", title:"Past & Future", desc:"Perfekt tense & modal verbs", icon:"⏳", color:"#FF6B6B", level:"A2-B1",
    lessons:[
      { id:"u9l1", title:"Perfekt", grammar:`The Perfekt = #1 spoken past tense!

🔑 FORMULA: haben/sein + past participle (at END!)

REGULAR: ge- + stem + -t
• machen → gemacht | spielen → gespielt

IRREGULAR: ge- + changed stem + -en  
• schreiben → geschrieben | trinken → getrunken

🚶 USE "SEIN" for movement/change:
• gehen → bin gegangen | fahren → ist gefahren

📌 NO ge- for: be-, emp-, ent-, er-, ver-, zer- prefixes`, words:[
        {de:"Ich habe gemacht",en:"I did/made"},{de:"Er hat gespielt",en:"He played"},
        {de:"Ich habe geschrieben",en:"I wrote"},{de:"Er hat getrunken",en:"He drank"},
        {de:"Ich bin gegangen",en:"I went"},{de:"Sie ist gekommen",en:"She came"},
        {de:"Er ist gefahren",en:"He drove"},{de:"Wir haben gegessen",en:"We ate"},
      ]},
      { id:"u9l2", title:"Modal Verbs", grammar:`Modals modify the main verb. Main verb → END in infinitive!

können (can) — Ich kann schwimmen.
müssen (must) — Du musst lernen.
wollen (want) — Er will spielen.
sollen (should) — Wir sollen gehen.
dürfen (may) — Darf ich fragen?
mögen (like) — Sie mag Schokolade.

📌 Word order: Subject + Modal + ... + Infinitive at END`, words:[
        {de:"können",en:"can/be able to"},{de:"müssen",en:"must/have to"},
        {de:"wollen",en:"to want"},{de:"sollen",en:"should"},
        {de:"dürfen",en:"may/be allowed"},{de:"mögen",en:"to like"},
      ]},
    ]},
  { id:"u10", title:"Exam Prep", desc:"Key phrases for writing & speaking exams", icon:"🎓", color:"#58CC02", level:"B1",
    lessons:[
      { id:"u10l1", title:"Exam Phrases", words:[
        {de:"Meiner Meinung nach...",en:"In my opinion...",tip:"Great for essays"},
        {de:"Ich bin der Meinung, dass...",en:"I believe that..."},{de:"Zum Beispiel",en:"For example"},
        {de:"Einerseits... andererseits...",en:"On one hand... on the other hand..."},
        {de:"Zusammenfassend...",en:"In summary..."},{de:"Außerdem",en:"Furthermore"},
        {de:"Deshalb",en:"Therefore"},{de:"Obwohl...",en:"Although..."},
        {de:"Schließlich",en:"Finally"},{de:"Es ist wichtig, dass...",en:"It is important that..."},
        {de:"Ich stimme zu",en:"I agree"},{de:"Ich bin nicht einverstanden",en:"I disagree"},
      ]},
    ]},
];

const ALL_WORDS = UNITS.flatMap(u => u.lessons.flatMap(l => l.words||[]));
const shuffle = a => [...a].sort(() => Math.random() - 0.5);
const getLevel = xp => { let l=LEVELS[0]; for(const v of LEVELS){if(xp>=v.xp)l=v;else break;} return l; };
const getNext = xp => { for(const l of LEVELS){if(xp<l.xp)return l;} return LEVELS[LEVELS.length-1]; };

const PLAN = [
  {m:1,t:"Foundations",f:"Alphabet · Pronunciation · Greetings · Numbers · Basic phrases · Present tense · Articles",g:"A1.1 — Basic interactions",tasks:"Units 1-3 · 80 words · All quizzes · Practice greetings daily"},
  {m:2,t:"Building Blocks",f:"Accusative case · Common verbs · Modal verbs · Food & drink · Directions · Time",g:"A1.2 — Daily situations",tasks:"Units 4-6 · 150 words · Translation exercises · 5 paragraphs"},
  {m:3,t:"Expanding",f:"Dative case · Prepositions · Past tense (Perfekt) · Adjective endings · Descriptions",g:"A2.1 — Simple conversations",tasks:"Units 7-8 · 250 words · All cases practiced · German diary entries"},
  {m:4,t:"Deepening",f:"Genitive case · Relative clauses · Konjunktiv II · Passive voice · Formal writing",g:"A2.2 — Complex sentences",tasks:"Unit 9 · 350 words · Formal letters · Reading comprehension"},
  {m:5,t:"Exam Mastery",f:"Practice exams · Listening · Reading strategies · Writing templates · Speaking · Review",g:"B1 Ready — Pass with confidence!",tasks:"Unit 10 · All quizzes 80%+ · Mock exams · Full review"},
];

const ACHS = [
  {id:"w1",t:"Baby Steps",d:"Learn 1 word",ic:"🌱",r:s=>s.mastered.length>=1},
  {id:"w10",t:"Word Collector",d:"Master 10 words",ic:"📗",r:s=>s.mastered.length>=10},
  {id:"w25",t:"Voyager",d:"Master 25 words",ic:"📘",r:s=>s.mastered.length>=25},
  {id:"w50",t:"Word Wizard",d:"Master 50 words",ic:"📕",r:s=>s.mastered.length>=50},
  {id:"w100",t:"Centurion",d:"Master 100 words",ic:"💯",r:s=>s.mastered.length>=100},
  {id:"q1",t:"Quiz Starter",d:"Complete 1 quiz",ic:"✅",r:s=>Object.keys(s.quizzes).length>=1},
  {id:"p100",t:"Perfectionist",d:"Score 100% on a quiz",ic:"💎",r:s=>Object.values(s.quizzes).some(v=>v===100)},
  {id:"q5",t:"Quiz Machine",d:"Complete 5 quizzes",ic:"⚡",r:s=>Object.keys(s.quizzes).length>=5},
  {id:"x100",t:"Rising Star",d:"Earn 100 XP",ic:"⭐",r:s=>s.xp>=100},
  {id:"x500",t:"Superstar",d:"Earn 500 XP",ic:"🌟",r:s=>s.xp>=500},
  {id:"t5",t:"Translator",d:"5 translations",ic:"🌍",r:s=>s.trans>=5},
  {id:"m3",t:"Match Maker",d:"Win 3 matching games",ic:"🃏",r:s=>s.matchW>=3},
];

const INIT = {xp:0,mastered:[],quizzes:{},trans:0,matchW:0,streak:1,hearts:5,started:[]};

function reducer(s,a){
  let n={...s};
  switch(a.type){
    case"XP":n.xp=s.xp+a.v;break;
    case"MASTER":if(!s.mastered.includes(a.w)){n.mastered=[...s.mastered,a.w];n.xp=s.xp+5;}break;
    case"QUIZ":n.quizzes={...s.quizzes,[a.id]:Math.max(s.quizzes[a.id]||0,a.sc)};n.xp=s.xp+Math.floor(a.sc/5);break;
    case"TRANS":n.trans=s.trans+1;n.xp=s.xp+8;break;
    case"MATCHW":n.matchW=s.matchW+1;n.xp=s.xp+15;break;
    case"HEART":n.hearts=Math.max(0,s.hearts-1);break;
    case"REFILL":n.hearts=5;break;
    case"START":if(!s.started.includes(a.id))n.started=[...s.started,a.id];break;
  }
  return n;
}

const F = "'Nunito', 'Segoe UI', system-ui, sans-serif";
const gc = {m:{l:"DER",c:"#1CB0F6"},f:{l:"DIE",c:"#FF4B4B"},n:{l:"DAS",c:"#58CC02"}};

function Mascot({mood,msg,sz=52}){
  const faces={happy:"😊",excited:"🤩",thinking:"🤔",sad:"😢",cheer:"🥳",cool:"😎"};
  return(
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
      <div style={{width:sz,height:sz,borderRadius:"50%",background:"linear-gradient(135deg,#58CC02,#47A902)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:sz*0.55,boxShadow:"0 4px 14px rgba(88,204,2,0.3)",border:"3px solid #fff",flexShrink:0,position:"relative"}}>
        {faces[mood]||"🦉"}
        <div style={{position:"absolute",bottom:-2,right:-2,width:16,height:16,borderRadius:"50%",background:"#FFD700",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,border:"2px solid #fff"}}>🇩🇪</div>
      </div>
      {msg&&<div style={{background:"#fff",color:"#3a3a3a",padding:"10px 14px",borderRadius:"16px 16px 16px 4px",fontSize:13,fontWeight:700,maxWidth:260,boxShadow:"0 2px 10px rgba(0,0,0,0.06)",lineHeight:1.4,fontFamily:F}}>{msg}</div>}
    </div>
  );
}

function ProgressBar({pct,color,h=10}){
  return(
    <div style={{height:h,background:"#E5E5E5",borderRadius:h,overflow:"hidden"}}>
      <div style={{height:"100%",width:`${Math.min(100,pct)}%`,background:color||"#58CC02",borderRadius:h,transition:"width 0.4s ease"}}/>
    </div>
  );
}

// ═══════════════ LESSON VIEW ═══════════════
function LessonView({unit,lesson,state,dispatch,onBack}){
  const [phase,setPhase]=useState("learn");
  const [ci,setCi]=useState(0);
  const [flip,setFlip]=useState(false);
  const [qi,setQi]=useState(0);
  const [qScore,setQScore]=useState(0);
  const [sel,setSel]=useState(null);
  const [show,setShow]=useState(false);
  const [qs,setQs]=useState([]);
  const words=lesson.words||[];

  const makeQs=()=>{
    const pool=shuffle(words).slice(0,Math.min(8,words.length));
    return pool.map(w=>{
      const t=Math.random()>0.5?"de":"en";
      const correct=t==="de"?w.en:w.de;
      const prompt=t==="de"?w.de:w.en;
      const opts=shuffle([correct,...shuffle(words.filter(x=>x.de!==w.de)).slice(0,3).map(x=>t==="de"?x.en:x.de)]);
      return {prompt,correct,opts,t};
    });
  };

  const startQ=()=>{setPhase("quiz");setQi(0);setQScore(0);setSel(null);setShow(false);setQs(makeQs());};

  const answer=(o)=>{
    if(show)return;setSel(o);setShow(true);
    if(o===qs[qi].correct)setQScore(s=>s+1);else dispatch({type:"HEART"});
  };

  const next=()=>{
    if(qi+1>=qs.length){
      const pct=Math.round((qScore/qs.length)*100);
      dispatch({type:"QUIZ",id:lesson.id,sc:pct});
      dispatch({type:"XP",v:Math.floor(pct/4)});
      setPhase("result");
    } else {setQi(q=>q+1);setSel(null);setShow(false);}
  };

  // LEARN
  if(phase==="learn"){
    const w=words[ci];
    if(!w)return<div style={{padding:20,fontFamily:F}}><button onClick={onBack}>← Back</button></div>;
    return(
      <div style={{padding:"14px 16px",minHeight:"85vh",display:"flex",flexDirection:"column",fontFamily:F}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <button onClick={onBack} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"#AFAFAF",padding:4}}>✕</button>
          <span style={{fontWeight:800,color:"#AFAFAF",fontSize:12}}>{ci+1}/{words.length}</span>
          <div style={{width:28}}/>
        </div>
        <ProgressBar pct={(ci+1)/words.length*100} color={unit.color} h={8}/>

        {lesson.grammar&&ci===0&&(
          <div style={{background:"#F0F8FF",borderRadius:16,padding:16,margin:"14px 0",border:"2px solid #B3D9FF",maxHeight:260,overflow:"auto"}}>
            <p style={{fontSize:12,fontWeight:900,color:"#1CB0F6",margin:"0 0 6px"}}>📖 GRAMMAR</p>
            {lesson.grammar.split("\n").map((l,i)=>(
              <p key={i} style={{fontSize:12.5,color:"#4B4B4B",fontWeight:l.match(/^[🔑📌⚠️📝💡🚶🎯]/)?800:600,lineHeight:1.55,margin:"2px 0",paddingLeft:l.startsWith("•")?10:0}}>{l}</p>
            ))}
          </div>
        )}

        <div onClick={()=>setFlip(!flip)} style={{flex:1,minHeight:220,cursor:"pointer",perspective:1000,margin:"12px 0"}}>
          <div style={{width:"100%",height:"100%",minHeight:220,position:"relative",transformStyle:"preserve-3d",transition:"transform 0.5s",transform:flip?"rotateX(180deg)":"none"}}>
            <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",background:"#fff",borderRadius:22,padding:24,border:`3px solid ${unit.color}`,boxShadow:`0 6px 24px ${unit.color}18`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              {w.g&&gc[w.g]&&<span style={{position:"absolute",top:14,left:16,fontSize:10,fontWeight:900,color:gc[w.g].c,background:`${gc[w.g].c}12`,padding:"3px 10px",borderRadius:8}}>{gc[w.g].l}</span>}
              {state.mastered.includes(w.de)&&<span style={{position:"absolute",top:12,right:14,fontSize:18}}>✅</span>}
              <p style={{fontSize:28,fontWeight:900,color:"#4B4B4B",textAlign:"center",margin:0,lineHeight:1.3}}>{w.de}</p>
              {w.ph&&<p style={{fontSize:13,color:"#ccc",marginTop:8,fontStyle:"italic"}}>🔊 /{w.ph}/</p>}
              <p style={{fontSize:12,color:"#ddd",marginTop:14}}>Tap to flip →</p>
            </div>
            <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",transform:"rotateX(180deg)",background:`linear-gradient(135deg,${unit.color}08,${unit.color}03)`,borderRadius:22,padding:24,border:`3px solid ${unit.color}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <p style={{fontSize:24,fontWeight:900,color:unit.color,textAlign:"center",margin:0}}>{w.en}</p>
              {w.tip&&<p style={{fontSize:12,color:"#777",marginTop:10,textAlign:"center",fontStyle:"italic",background:"#fff",padding:"6px 12px",borderRadius:10}}>💡 {w.tip}</p>}
              {!state.mastered.includes(w.de)&&(
                <button onClick={e=>{e.stopPropagation();dispatch({type:"MASTER",w:w.de});}} style={{marginTop:14,padding:"9px 24px",borderRadius:12,background:"#58CC02",color:"#fff",fontWeight:800,border:"none",cursor:"pointer",fontSize:13,boxShadow:"0 3px 10px rgba(88,204,2,0.3)"}}>✓ I know this!</button>
              )}
            </div>
          </div>
        </div>

        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>{setCi(Math.max(0,ci-1));setFlip(false);}} disabled={ci===0} style={{flex:1,padding:13,borderRadius:13,border:"2px solid #E5E5E5",background:"#fff",color:"#4B4B4B",fontWeight:800,fontSize:14,cursor:ci===0?"default":"pointer",opacity:ci===0?0.3:1}}>← Prev</button>
          {ci<words.length-1?(
            <button onClick={()=>{setCi(ci+1);setFlip(false);}} style={{flex:1,padding:13,borderRadius:13,border:"none",background:unit.color,color:"#fff",fontWeight:800,fontSize:14,cursor:"pointer",boxShadow:`0 3px 12px ${unit.color}44`}}>Next →</button>
          ):(
            <button onClick={startQ} style={{flex:1,padding:13,borderRadius:13,border:"none",background:"#FFC800",color:"#4B4B4B",fontWeight:900,fontSize:14,cursor:"pointer",boxShadow:"0 3px 12px rgba(255,200,0,0.4)"}}>🎯 Quiz!</button>
          )}
        </div>
      </div>
    );
  }

  // QUIZ
  if(phase==="quiz"){
    if(!qs.length)return null;
    const q=qs[qi];
    return(
      <div style={{padding:"14px 16px",minHeight:"85vh",display:"flex",flexDirection:"column",fontFamily:F}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <button onClick={onBack} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"#AFAFAF"}}>✕</button>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <span style={{fontWeight:800,color:"#FF4B4B",fontSize:13}}>❤️ {state.hearts}</span>
            <span style={{fontWeight:800,color:"#AFAFAF",fontSize:12}}>{qi+1}/{qs.length}</span>
          </div>
        </div>
        <ProgressBar pct={(qi+1)/qs.length*100} color="#FFC800" h={8}/>

        <div style={{marginTop:16}}>
          <Mascot mood={show?(sel===q.correct?"cheer":"sad"):"thinking"} sz={42} msg={
            !show?(q.t==="de"?"What does this mean in English?":"How do you say this in German?"):
            sel===q.correct?shuffle(["Richtig! 🎉","Super! ⭐","Genau! 💪","Toll! 🌟"])[0]:"Keep trying! 💪"
          }/>
        </div>

        <div style={{background:"#fff",borderRadius:18,padding:22,marginTop:16,border:"2px solid #E5E5E5",textAlign:"center"}}>
          <p style={{fontSize:10,fontWeight:800,color:"#AFAFAF",textTransform:"uppercase",margin:"0 0 6px",letterSpacing:0.5}}>
            {q.t==="de"?"TRANSLATE TO ENGLISH":"TRANSLATE TO GERMAN"}
          </p>
          <p style={{fontSize:24,fontWeight:900,color:"#4B4B4B",margin:0}}>"{q.prompt}"</p>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:16,flex:1}}>
          {q.opts.map((o,i)=>{
            let bg="#fff",bc="#E5E5E5",tc="#4B4B4B";
            if(show){
              if(o===q.correct){bg="#D7FFB8";bc="#58CC02";tc="#2E7D00";}
              else if(o===sel){bg="#FFD6D6";bc="#FF4B4B";tc="#CC0000";}
            }
            return(<button key={i} onClick={()=>answer(o)} style={{padding:"14px 18px",borderRadius:13,border:`2px solid ${bc}`,background:bg,color:tc,fontSize:15,fontWeight:700,cursor:show?"default":"pointer",textAlign:"left",transition:"all 0.15s"}}>{o}</button>);
          })}
        </div>

        {show&&<button onClick={next} style={{marginTop:14,padding:15,borderRadius:13,border:"none",background:sel===q.correct?"#58CC02":"#FF4B4B",color:"#fff",fontWeight:900,fontSize:15,cursor:"pointer",boxShadow:`0 4px 14px ${sel===q.correct?"rgba(88,204,2,0.4)":"rgba(255,75,75,0.3)"}`}}>{qi+1>=qs.length?"SEE RESULTS":"CONTINUE"}</button>}
      </div>
    );
  }

  // RESULT
  const fp=qs.length?Math.round((qScore/qs.length)*100):0;
  return(
    <div style={{padding:20,textAlign:"center",minHeight:"85vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:F}}>
      <div style={{fontSize:68,marginBottom:10}}>{fp>=80?"🎉":fp>=50?"👍":"💪"}</div>
      <Mascot mood={fp>=80?"cheer":fp>=50?"happy":"thinking"} msg={fp===100?"PERFEKT! 🏆":fp>=80?"Sehr gut!":fp>=50?"Good effort!":"Let's review!"}/>
      <div style={{background:"#fff",borderRadius:22,padding:24,marginTop:18,border:"2px solid #E5E5E5",width:"100%",maxWidth:300}}>
        <p style={{fontSize:44,fontWeight:900,color:fp>=80?"#58CC02":fp>=50?"#FFC800":"#FF4B4B",margin:"0 0 4px"}}>{fp}%</p>
        <p style={{fontSize:13,color:"#AFAFAF",fontWeight:700}}>{qScore}/{qs.length} correct</p>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:10,background:"#FFF8E1",padding:"6px 14px",borderRadius:10}}>
          <span>⚡</span><span style={{fontWeight:800,color:"#FF9600",fontSize:13}}>+{Math.floor(fp/4)} XP</span>
        </div>
      </div>
      <div style={{display:"flex",gap:10,marginTop:20,width:"100%",maxWidth:300}}>
        <button onClick={()=>{setPhase("learn");setCi(0);setFlip(false);}} style={{flex:1,padding:13,borderRadius:13,border:"2px solid #E5E5E5",background:"#fff",color:"#4B4B4B",fontWeight:800,fontSize:13,cursor:"pointer"}}>Review</button>
        <button onClick={onBack} style={{flex:1,padding:13,borderRadius:13,border:"none",background:"#58CC02",color:"#fff",fontWeight:900,fontSize:13,cursor:"pointer"}}>Continue</button>
      </div>
    </div>
  );
}

// ═══════════════ MAIN APP ═══════════════
export default function DeutschBuddy(){
  const [tab,setTab]=useState("home");
  const [state,dispatch]=useReducer(reducer,INIT);
  const [activeLesson,setActiveLesson]=useState(null);

  const unlockedAchs = ACHS.filter(a=>a.r(state));
  const lv=getLevel(state.xp);
  const nlv=getNext(state.xp);
  const lvPct=nlv.xp>lv.xp?Math.round(((state.xp-lv.xp)/(nlv.xp-lv.xp))*100):100;
  const totalW=ALL_WORDS.length;
  const mPct=Math.round((state.mastered.length/totalW)*100);

  // Match game state
  const [matchCards,setMatchCards]=useState([]);
  const [matchFlipped,setMatchFlipped]=useState([]);
  const [matchSolved,setMatchSolved]=useState([]);
  const [practiceMode,setPracticeMode]=useState(null);
  // Translation state
  const [tList,setTList]=useState([]);
  const [tIdx,setTIdx]=useState(0);
  const [tIn,setTIn]=useState("");
  const [tFb,setTFb]=useState(null);
  const [tSc,setTSc]=useState(0);
  // Article Trainer (der/die/das)
  const [artW,setArtW]=useState(null);
  const [artFb,setArtFb]=useState(null);
  const [artTotal,setArtTotal]=useState(0);
  const [artCorrect,setArtCorrect]=useState(0);

  const startMatch=()=>{
    const pool=shuffle(ALL_WORDS.filter(w=>w.en&&w.de&&w.en.length<20&&w.de.length<25)).slice(0,6);
    setMatchCards(shuffle([...pool.map((w,i)=>({id:`d${i}`,text:w.de,pid:i,l:"de"})),...pool.map((w,i)=>({id:`e${i}`,text:w.en,pid:i,l:"en"}))]));
    setMatchFlipped([]);setMatchSolved([]);setPracticeMode("match");
  };
  const handleMatch=(idx)=>{
    if(matchFlipped.length>=2||matchFlipped.includes(idx)||matchSolved.includes(matchCards[idx].pid))return;
    const nf=[...matchFlipped,idx];setMatchFlipped(nf);
    if(nf.length===2){
      const[a,b]=nf;
      if(matchCards[a].pid===matchCards[b].pid&&matchCards[a].l!==matchCards[b].l){
        const ns=[...matchSolved,matchCards[a].pid];setMatchSolved(ns);setMatchFlipped([]);
        if(ns.length===6)dispatch({type:"MATCHW"});
      } else { dispatch({type:"HEART"});setTimeout(()=>setMatchFlipped([]),700); }
    }
  };
  const startTrans=()=>{
    setTList(shuffle(ALL_WORDS.filter(w=>w.en&&w.de&&!w.de.includes("/")&&w.de.length<30)).slice(0,8));
    setTIdx(0);setTIn("");setTFb(null);setTSc(0);setPracticeMode("trans");
  };
  const checkT=()=>{
    if(!tIn.trim())return;
    const w=tList[tIdx];
    const cor=w.en.toLowerCase().replace(/[.,!?()/]/g,"").trim();
    const inp=tIn.toLowerCase().replace(/[.,!?()/]/g,"").trim();
    const ok=inp===cor||cor.includes(inp)||(inp.length>3&&cor.includes(inp));
    setTFb({ok,cor:w.en});
    if(ok){setTSc(s=>s+1);dispatch({type:"TRANS"});}else dispatch({type:"HEART"});
  };
  const nextT=()=>{
    if(tIdx+1>=tList.length){setPracticeMode(null);return;}
    setTIdx(i=>i+1);setTIn("");setTFb(null);
  };
  // Article trainer functions
  const gc={m:{l:"DER",c:"#1CB0F6",bg:"#DDF4FF"},f:{l:"DIE",c:"#FF4B4B",bg:"#FFDFE0"},n:{l:"DAS",c:"#58CC02",bg:"#D7FFB8"}};
  const startArticle=()=>{
    const pool=ALL_WORDS.filter(w=>w.g&&["m","f","n"].includes(w.g));
    setArtW(shuffle(pool)[0]);setArtFb(null);setArtTotal(0);setArtCorrect(0);setPracticeMode("article");
  };
  const checkArticle=(guess)=>{
    if(artFb)return;
    const ok=guess===artW.g;
    setArtFb({ok,correct:artW.g});
    setArtTotal(t=>t+1);
    if(ok){setArtCorrect(c=>c+1);dispatch({type:"XP",v:3});}
    else dispatch({type:"HEART"});
  };
  const nextArticle=()=>{
    const pool=ALL_WORDS.filter(w=>w.g&&["m","f","n"].includes(w.g));
    setArtW(shuffle(pool)[0]);setArtFb(null);
  };

  if(activeLesson)return(
    <div style={{maxWidth:480,margin:"0 auto",background:"#F7F7F7",minHeight:"100vh"}}>
      <LessonView unit={activeLesson.unit} lesson={activeLesson.lesson} state={state} dispatch={dispatch} onBack={()=>setActiveLesson(null)}/>
    </div>
  );

  return(
    <div style={{maxWidth:480,margin:"0 auto",background:"#F7F7F7",minHeight:"100vh",fontFamily:F,paddingBottom:80}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0;}input::placeholder{color:#ccc;}button:active{transform:scale(0.97);}::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:#ddd;border-radius:2px;}`}</style>

      {/* TOP BAR */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",background:"#fff",borderBottom:"2px solid #E5E5E5",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:22}}>🇩🇪</span>
          <span style={{fontWeight:900,fontSize:18,color:"#58CC02"}}>DeutschBuddy</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontWeight:800,color:"#FF4B4B",fontSize:13}}>❤️{state.hearts}</span>
          <span style={{fontWeight:800,color:"#FF9600",fontSize:13}}>🔥{state.streak}</span>
          <span style={{background:"#FFF3D6",padding:"3px 10px",borderRadius:16,fontWeight:800,color:"#FFC800",fontSize:12}}>{lv.badge}{state.xp}XP</span>
        </div>
      </div>

      {/* CONTENT */}
      {tab==="home"&&!practiceMode&&(
        <div style={{padding:"16px"}}>
          <Mascot mood={state.xp>200?"cool":state.xp>50?"excited":"happy"} msg={
            state.mastered.length===0?"Hey! Ready to learn German? Let's go! 🚀":
            state.mastered.length<20?`${state.mastered.length} words learned! Great start!`:
            state.mastered.length<50?`${state.mastered.length} words! You're on fire! 🔥`:
            `${state.mastered.length} words! You're amazing! 🌟`}/>

          <div style={{background:"#fff",borderRadius:18,padding:16,margin:"14px 0",border:"2px solid #E5E5E5"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div><p style={{fontSize:10,color:"#AFAFAF",fontWeight:800,textTransform:"uppercase",margin:0}}>Level</p><p style={{fontSize:18,fontWeight:900,color:"#4B4B4B",margin:"2px 0 0"}}>{lv.badge} {lv.title}</p></div>
              <div style={{textAlign:"right"}}><p style={{fontSize:10,color:"#AFAFAF",fontWeight:800,margin:0}}>Next</p><p style={{fontSize:13,fontWeight:800,color:"#FFC800",margin:"2px 0 0"}}>{nlv.badge} {nlv.title}</p></div>
            </div>
            <ProgressBar pct={lvPct} color="#58CC02" h={12}/>
            <p style={{fontSize:11,color:"#AFAFAF",fontWeight:700,textAlign:"center",marginTop:4}}>{state.xp}/{nlv.xp} XP</p>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[{l:"Words",v:state.mastered.length,ic:"📚",c:"#58CC02",s:`${mPct}%`},{l:"Quizzes",v:Object.keys(state.quizzes).length,ic:"✅",c:"#1CB0F6",s:`${Object.values(state.quizzes).filter(v=>v>=80).length} aced`},{l:"Translations",v:state.trans,ic:"🌍",c:"#CE82FF",s:"Keep going!"},{l:"Streak",v:state.streak,ic:"🔥",c:"#FF9600",s:"days"}].map((c,i)=>(
              <div key={i} style={{background:"#fff",borderRadius:14,padding:14,border:"2px solid #E5E5E5"}}>
                <p style={{fontSize:10,color:"#AFAFAF",fontWeight:800,textTransform:"uppercase",margin:0}}>{c.l}</p>
                <p style={{fontSize:26,fontWeight:900,color:c.c,margin:"3px 0 1px"}}>{c.v}</p>
                <p style={{fontSize:10,color:"#ddd",fontWeight:700,margin:0}}>{c.s}</p>
              </div>
            ))}
          </div>

          <div style={{display:"flex",gap:8,marginTop:14,overflowX:"auto"}}>
            {[{l:"Start Learning",ic:"📚",c:"#58CC02",t:"learn"},{l:"Practice",ic:"🎯",c:"#FF4B4B",t:"practice"},{l:"Study Plan",ic:"📅",c:"#1CB0F6",t:"plan"}].map((a,i)=>(
              <button key={i} onClick={()=>setTab(a.t)} style={{background:a.c,border:"none",borderRadius:14,padding:"14px 20px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,minWidth:115,boxShadow:`0 3px 10px ${a.c}33`}}>
                <span style={{fontSize:24}}>{a.ic}</span>
                <span style={{fontSize:12,fontWeight:800,color:"#fff",whiteSpace:"nowrap"}}>{a.l}</span>
              </button>
            ))}
          </div>

          <div style={{marginTop:16,background:"linear-gradient(135deg,#FFF8E1,#FFF3D6)",borderRadius:14,padding:14,border:"2px solid #FFE082"}}>
            <p style={{fontSize:11,fontWeight:900,color:"#FF9600",margin:"0 0 4px"}}>💡 STUDY TIP</p>
            <p style={{fontSize:13,color:"#6B5B00",fontWeight:600,lineHeight:1.5,margin:0}}>
              {["Always learn nouns WITH their article! Think of 'der Tisch' as ONE word, not two separate things.","⚠️ 'halb drei' means 2:30, NOT 3:30! In German, 'halb' means 'half TO' the next hour.","Speak out loud every day — even just 5 minutes! Pronunciation matters hugely for exams.","🎁 The word 'Gift' means POISON in German! A gift/present = das Geschenk.","'Ich bin satt' = I'm full. NEVER say 'Ich bin voll' — that means 'I'm drunk!' 🍺","The verb is ALWAYS in position 2 in main clauses. This is the #1 rule of German word order!","Watch 'Dark' or 'How to Sell Drugs Online (Fast)' on Netflix with German subs — great listening practice!","Lieblings- is a prefix meaning 'favorite'. Works for anything: Lieblingsfarbe, Lieblingsfilm, Lieblingsbuch!"][Math.floor(Date.now()/86400000)%8]}
            </p>
          </div>

          {/* Phrase of the Day */}
          <div style={{marginTop:10,background:"linear-gradient(135deg,#E8F5E9,#F1F8E9)",borderRadius:14,padding:14,border:"2px solid #A5D6A7",textAlign:"center"}}>
            <p style={{fontSize:10,fontWeight:900,color:"#388E3C",margin:"0 0 3px",letterSpacing:1}}>🇩🇪 GERMAN PROVERB</p>
            <p style={{fontSize:18,fontWeight:900,color:"#2E7D32",margin:"0 0 3px"}}>
              {["Übung macht den Meister","Aller Anfang ist schwer","Ohne Fleiß kein Preis","Wer rastet, der rostet","Morgenstund hat Gold im Mund","Es ist noch kein Meister vom Himmel gefallen","Wer A sagt, muss auch B sagen"][Math.floor(Date.now()/86400000)%7]}
            </p>
            <p style={{fontSize:12,color:"#66BB6A",fontStyle:"italic"}}>
              {["Practice makes perfect","Every beginning is hard","No pain, no gain","If you rest, you rust","The morning hour has gold in its mouth","No master has ever fallen from heaven","If you say A, you must also say B"][Math.floor(Date.now()/86400000)%7]}
            </p>
          </div>
        </div>
      )}

      {tab==="learn"&&(
        <div style={{padding:"16px"}}>
          <h2 style={{fontWeight:900,color:"#4B4B4B",fontSize:22,margin:"0 0 2px"}}>Learning Path</h2>
          <p style={{color:"#AFAFAF",fontSize:13,fontWeight:600,margin:"0 0 16px"}}>Complete lessons in order to build skills!</p>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:0}}>
            {UNITS.map((unit,ui)=>{
              const tw=unit.lessons.reduce((s,l)=>s+(l.words?.length||0),0);
              const mw=unit.lessons.reduce((s,l)=>s+(l.words?.filter(w=>state.mastered.includes(w.de)).length||0),0);
              const p=tw?Math.round(mw/tw*100):0;
              const qd=unit.lessons.filter(l=>state.quizzes[l.id]!==undefined).length;
              const done=qd===unit.lessons.length&&p>50;
              return(<div key={unit.id} style={{width:"100%",maxWidth:400}}>
                {ui>0&&<div style={{width:4,height:20,background:"#E5E5E5",margin:"0 auto",borderRadius:2}}/>}
                <div style={{background:done?`${unit.color}08`:"#fff",borderRadius:18,padding:16,border:`2px solid ${done?unit.color:"#E5E5E5"}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                    <div style={{width:46,height:46,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,background:`${unit.color}15`,border:`2px solid ${unit.color}30`,flexShrink:0}}>{unit.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <h3 style={{fontWeight:900,color:"#4B4B4B",fontSize:15,margin:0}}>{unit.title}</h3>
                        <span style={{fontSize:9,fontWeight:800,color:unit.color,background:`${unit.color}15`,padding:"1px 7px",borderRadius:6}}>{unit.level}</span>
                      </div>
                      <p style={{fontSize:11,color:"#AFAFAF",fontWeight:600,margin:"1px 0 0"}}>{unit.desc}</p>
                    </div>
                    {done&&<span style={{fontSize:18}}>⭐</span>}
                  </div>
                  <ProgressBar pct={p} color={unit.color} h={6}/>
                  <div style={{display:"flex",flexWrap:"wrap",gap:7,justifyContent:"center",marginTop:12}}>
                    {unit.lessons.map(lesson=>{
                      const sc=state.quizzes[lesson.id];
                      const ld=sc!==undefined&&sc>=60;
                      return(<button key={lesson.id} onClick={()=>{dispatch({type:"START",id:lesson.id});setActiveLesson({unit,lesson});}} style={{width:58,height:64,borderRadius:14,border:`2px solid ${ld?unit.color:"#E5E5E5"}`,background:ld?`${unit.color}10`:"#FAFAFA",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1,position:"relative"}}>
                        {sc===100&&<div style={{position:"absolute",top:-5,right:-5,fontSize:12}}>👑</div>}
                        <span style={{fontSize:18}}>{lesson.grammar?"📐":"📝"}</span>
                        <span style={{fontSize:8,fontWeight:800,color:ld?unit.color:"#AFAFAF",textAlign:"center",lineHeight:1,padding:"0 2px"}}>{lesson.title.length>9?lesson.title.slice(0,8)+"…":lesson.title}</span>
                        {sc!==undefined&&<span style={{fontSize:7,fontWeight:800,color:sc>=80?"#58CC02":"#FF9600"}}>{sc}%</span>}
                      </button>);
                    })}
                  </div>
                </div>
              </div>);
            })}
          </div>
        </div>
      )}

      {tab==="practice"&&!practiceMode&&(
        <div style={{padding:"16px"}}>
          <Mascot mood="excited" msg="Let's practice! Pick an exercise! 💪"/>
          <h2 style={{fontWeight:900,color:"#4B4B4B",fontSize:22,margin:"16px 0 4px"}}>Practice Zone</h2>
          <p style={{color:"#AFAFAF",fontSize:13,fontWeight:600,margin:"0 0 16px"}}>Fun exercises to strengthen your skills!</p>
          {[{id:"match",t:"🃏 Memory Match",d:"Match German words with translations!",c:"#CE82FF",s:"+15 XP per game",fn:startMatch},
            {id:"trans",t:"🌍 Translation",d:"Translate German → English",c:"#1CB0F6",s:"+8 XP each",fn:startTrans},
            {id:"article",t:"🎯 Article Trainer",d:"Is it DER, DIE, or DAS? The #1 hardest skill!",c:"#FF9600",s:"+3 XP each",fn:startArticle}].map(e=>(
            <button key={e.id} onClick={e.fn} style={{width:"100%",background:"#fff",borderRadius:16,padding:18,border:"2px solid #E5E5E5",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:14,marginBottom:10}}>
              <div style={{width:50,height:50,borderRadius:14,background:`${e.c}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{e.t.split(" ")[0]}</div>
              <div style={{flex:1}}>
                <h3 style={{fontWeight:900,color:"#4B4B4B",fontSize:15,margin:"0 0 2px"}}>{e.t.split(" ").slice(1).join(" ")}</h3>
                <p style={{color:"#AFAFAF",fontSize:11,fontWeight:600,margin:"0 0 3px"}}>{e.d}</p>
                <span style={{fontSize:10,fontWeight:800,color:e.c}}>{e.s}</span>
              </div>
            </button>
          ))}
          <div style={{marginTop:16,background:"linear-gradient(135deg,#E8F5E9,#F1F8E9)",borderRadius:14,padding:16,border:"2px solid #A5D6A7",textAlign:"center"}}>
            <p style={{fontSize:11,fontWeight:900,color:"#388E3C",margin:"0 0 4px"}}>🇩🇪 PHRASE OF THE DAY</p>
            <p style={{fontSize:20,fontWeight:900,color:"#2E7D32",margin:"0 0 4px"}}>"Übung macht den Meister"</p>
            <p style={{fontSize:13,color:"#66BB6A",fontStyle:"italic"}}>Practice makes perfect!</p>
          </div>
        </div>
      )}

      {/* MATCH GAME */}
      {practiceMode==="match"&&(
        <div style={{padding:"16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <button onClick={()=>setPracticeMode(null)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#AFAFAF"}}>✕</button>
            <span style={{fontWeight:800,color:"#AFAFAF",fontSize:13}}>{matchSolved.length}/6 matched</span>
          </div>
          {matchSolved.length===6?(
            <div style={{textAlign:"center",paddingTop:40}}>
              <div style={{fontSize:64,marginBottom:10}}>🎉</div>
              <Mascot mood="cheer" msg="All matched! +15 XP! 🌟"/>
              <button onClick={()=>setPracticeMode(null)} style={{marginTop:24,padding:"14px 36px",borderRadius:14,border:"none",background:"#58CC02",color:"#fff",fontWeight:900,fontSize:15,cursor:"pointer"}}>Done!</button>
            </div>
          ):(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              {matchCards.map((c,i)=>{
                const solved=matchSolved.includes(c.pid);
                const flipped=matchFlipped.includes(i);
                return(<button key={c.id} onClick={()=>handleMatch(i)} disabled={solved} style={{height:72,borderRadius:12,border:`2px solid ${solved?"#58CC02":flipped?"#FFC800":"#E5E5E5"}`,background:solved?"#D7FFB8":flipped?"#FFF8E1":"#fff",cursor:solved?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:6,transition:"all 0.15s"}}>
                  <span style={{fontSize:solved?12:13,fontWeight:800,color:solved?"#2E7D00":flipped?"#B8860B":"#4B4B4B",textAlign:"center",lineHeight:1.2}}>{c.text}</span>
                </button>);
              })}
            </div>
          )}
        </div>
      )}

      {/* TRANSLATION */}
      {practiceMode==="trans"&&(
        <div style={{padding:"16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <button onClick={()=>setPracticeMode(null)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#AFAFAF"}}>✕</button>
            <span style={{fontWeight:800,color:"#AFAFAF",fontSize:12}}>{tIdx+1}/{tList.length} · Score: {tSc}</span>
          </div>
          <ProgressBar pct={(tIdx+1)/tList.length*100} color="#1CB0F6" h={8}/>
          {tList[tIdx]&&(
            <>
              <div style={{background:"#fff",borderRadius:18,padding:22,marginTop:18,border:"2px solid #E5E5E5",textAlign:"center"}}>
                <p style={{fontSize:10,fontWeight:800,color:"#AFAFAF",textTransform:"uppercase",margin:"0 0 6px"}}>TRANSLATE TO ENGLISH</p>
                <p style={{fontSize:22,fontWeight:900,color:"#4B4B4B",margin:0}}>"{tList[tIdx].de}"</p>
              </div>
              <input value={tIn} onChange={e=>setTIn(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!tFb)checkT();}} placeholder="Type your translation..." disabled={!!tFb}
                style={{width:"100%",padding:"14px 16px",borderRadius:13,fontSize:15,border:`2px solid ${tFb?(tFb.ok?"#58CC02":"#FF4B4B"):"#E5E5E5"}`,background:tFb?(tFb.ok?"#D7FFB8":"#FFD6D6"):"#fff",color:"#4B4B4B",fontFamily:F,fontWeight:600,outline:"none",marginTop:14,boxSizing:"border-box"}}/>
              {tFb&&(
                <div style={{marginTop:10,padding:14,borderRadius:12,background:tFb.ok?"#D7FFB8":"#FFD6D6",border:`2px solid ${tFb.ok?"#58CC02":"#FF4B4B"}`}}>
                  <p style={{fontWeight:800,color:tFb.ok?"#2E7D00":"#CC0000",fontSize:14,margin:"0 0 4px"}}>{tFb.ok?"✅ Correct!":"❌ Not quite!"}</p>
                  {!tFb.ok&&<p style={{color:"#666",fontSize:13,margin:0}}>Answer: <strong style={{color:"#4B4B4B"}}>{tFb.cor}</strong></p>}
                </div>
              )}
              {!tFb?<button onClick={checkT} style={{marginTop:12,width:"100%",padding:14,borderRadius:13,border:"none",background:"#1CB0F6",color:"#fff",fontWeight:900,fontSize:15,cursor:"pointer"}}>Check</button>
              :<button onClick={nextT} style={{marginTop:10,width:"100%",padding:14,borderRadius:13,border:"none",background:"#E5E5E5",color:"#4B4B4B",fontWeight:800,fontSize:15,cursor:"pointer"}}>{tIdx+1>=tList.length?"Finish":"Next →"}</button>}
            </>
          )}
        </div>
      )}

      {/* ARTICLE TRAINER */}
      {practiceMode==="article"&&(
        <div style={{padding:"16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <button onClick={()=>setPracticeMode(null)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#AFAFAF"}}>✕</button>
            <span style={{fontWeight:800,color:"#AFAFAF",fontSize:13}}>✅ {artCorrect} / {artTotal}</span>
          </div>
          <Mascot mood={artFb?(artFb.ok?"cheer":"sad"):"think"} sz={42} msg={
            !artFb?"Which article does this noun use? 🤔":
            artFb.ok?shuffle(["Genau! 🎉","Richtig! ⭐","Perfekt! 💪","Super! 🌟"])[0]:
            `Nein — it's ${gc[artFb.correct].l}! Remember this one! 📝`
          }/>
          {artW&&(<>
            <div style={{background:"#fff",borderRadius:18,padding:24,marginTop:16,border:"2px solid #E5E5E5",textAlign:"center",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <p style={{fontSize:10,fontWeight:800,color:"#AFAFAF",textTransform:"uppercase",letterSpacing:1,margin:"0 0 8px"}}>CHOOSE THE CORRECT ARTICLE</p>
              <p style={{fontSize:28,fontWeight:900,color:"#4B4B4B",margin:0}}>___ {artW.de.replace(/^(der|die|das)\s+/i,"")}</p>
              <p style={{fontSize:13,color:"#AFAFAF",marginTop:8}}>({artW.en})</p>
            </div>
            <div style={{display:"flex",gap:10,marginTop:16}}>
              {[{g:"m",l:"DER",c:"#1CB0F6"},{g:"f",l:"DIE",c:"#FF4B4B"},{g:"n",l:"DAS",c:"#58CC02"}].map(a=>{
                let bg="#fff",bc="#E5E5E5";
                if(artFb){
                  if(a.g===artFb.correct){bg=gc[a.g].bg;bc=gc[a.g].c;}
                  else if(a.g!==artFb.correct){bg="#fff";bc="#E5E5E5";}
                }
                return(<button key={a.g} onClick={()=>checkArticle(a.g)} style={{flex:1,padding:"20px 10px",borderRadius:16,border:`3px solid ${bc}`,background:bg,cursor:artFb?"default":"pointer",textAlign:"center",transition:"all 0.15s",boxShadow:artFb&&a.g===artFb.correct?`0 4px 12px ${gc[a.g].c}30`:"none"}}>
                  <p style={{fontSize:22,fontWeight:900,color:a.c,margin:0}}>{a.l}</p>
                  <p style={{fontSize:10,fontWeight:700,color:"#AFAFAF",margin:"4px 0 0"}}>{a.g==="m"?"masculine":a.g==="f"?"feminine":"neuter"}</p>
                </button>);
              })}
            </div>
            {artFb&&(
              <div style={{marginTop:12,padding:14,borderRadius:14,background:artFb.ok?"#D7FFB8":"#FFDFE0",border:`2px solid ${artFb.ok?"#58CC02":"#FF4B4B"}`,textAlign:"center"}}>
                <p style={{fontWeight:800,color:artFb.ok?"#2E7D00":"#CC0000",fontSize:14,margin:"0 0 4px"}}>{artFb.ok?"✅ Correct!":"❌ Wrong article!"}</p>
                {!artFb.ok&&<p style={{color:"#666",fontSize:12,margin:0}}>It's <strong style={{color:gc[artFb.correct].c}}>{gc[artFb.correct].l}</strong> {artW.de.replace(/^(der|die|das)\s+/i,"")}</p>}
                {artW.tip&&<p style={{color:"#888",fontSize:11,margin:"6px 0 0",fontStyle:"italic"}}>💡 {artW.tip}</p>}
              </div>
            )}
            {artFb&&<button onClick={nextArticle} style={{marginTop:12,width:"100%",padding:14,borderRadius:14,border:"none",background:"#FF9600",color:"#fff",fontWeight:900,fontSize:15,cursor:"pointer",boxShadow:"0 3px 10px rgba(255,150,0,0.3)"}}>Next Word →</button>}
          </>)}
        </div>
      )}

      {tab==="plan"&&(
        <div style={{padding:"16px"}}>
          <h2 style={{fontWeight:900,color:"#4B4B4B",fontSize:22,margin:"0 0 2px"}}>5-Month Plan</h2>
          <p style={{color:"#AFAFAF",fontSize:13,fontWeight:600,margin:"0 0 16px"}}>Zero to exam-ready! Follow consistently.</p>
          {PLAN.map((p,i)=>(
            <PlanCard key={i} p={p} i={i}/>
          ))}

          {/* Study Tips Box */}
          <div style={{marginTop:12,background:"linear-gradient(135deg,#E8F5E9,#F1F8E9)",borderRadius:14,padding:16,border:"2px solid #A5D6A7"}}>
            <p style={{fontSize:12,fontWeight:900,color:"#388E3C",margin:"0 0 6px"}}>📌 TIPS FOR EXAM SUCCESS</p>
            {["Study 20-30 minutes DAILY — consistency beats marathon sessions","Use spaced repetition: review on Day 1, 3, 7, 14, 30","Speak German out loud every day — even just to yourself","Label items in your house with German Post-it notes","Listen to 'Coffee Break German' podcast (free & excellent!)","Write a 3-sentence German diary entry every evening","Watch 'Easy German' on YouTube — street interviews with subtitles!","Practice the Article Trainer daily — der/die/das is the #1 challenge"].map((tip,i)=>(
              <p key={i} style={{fontSize:12,color:"#2E7D32",fontWeight:600,lineHeight:1.5,margin:"3px 0"}}>• {tip}</p>
            ))}
          </div>
        </div>
      )}

      {tab==="profile"&&(
        <div style={{padding:"16px"}}>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#58CC02,#47A902)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:44,margin:"0 auto 10px",border:"4px solid #fff",boxShadow:"0 4px 16px rgba(88,204,2,0.3)"}}>{lv.badge}</div>
            <h2 style={{fontWeight:900,color:"#4B4B4B",fontSize:22,margin:"0 0 2px"}}>{lv.title}</h2>
            <p style={{color:"#AFAFAF",fontSize:13,fontWeight:700}}>{state.xp} XP total</p>
          </div>

          <h3 style={{fontWeight:900,color:"#4B4B4B",fontSize:17,margin:"0 0 10px"}}>🏆 Achievements ({unlockedAchs.length}/{ACHS.length})</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {ACHS.map(a=>{
              const ok=a.r(state);
              return(<div key={a.id} style={{background:ok?"#fff":"#FAFAFA",borderRadius:14,padding:14,border:`2px solid ${ok?"#FFE082":"#E5E5E5"}`,opacity:ok?1:0.4,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:24,filter:ok?"none":"grayscale(1)"}}>{a.ic}</span>
                <div><p style={{fontWeight:800,color:ok?"#4B4B4B":"#AFAFAF",fontSize:13,margin:0}}>{a.t}</p><p style={{color:"#AFAFAF",fontSize:10,fontWeight:600,margin:0}}>{a.d}</p></div>
              </div>);
            })}
          </div>

          {state.hearts<5&&(
            <button onClick={()=>dispatch({type:"REFILL"})} style={{marginTop:16,width:"100%",padding:14,borderRadius:14,border:"none",background:"#FF4B4B",color:"#fff",fontWeight:900,fontSize:15,cursor:"pointer"}}>❤️ Refill Hearts (free!)</button>
          )}
        </div>
      )}

      {/* BOTTOM NAV */}
      <div style={{display:"flex",justifyContent:"space-around",alignItems:"center",padding:"8px 0 10px",background:"#fff",borderTop:"2px solid #E5E5E5",position:"fixed",bottom:0,left:0,right:0,zIndex:100,maxWidth:480,margin:"0 auto"}}>
        {[{id:"home",ic:"🏠",l:"Home"},{id:"learn",ic:"📚",l:"Learn"},{id:"practice",ic:"🎯",l:"Practice"},{id:"plan",ic:"📅",l:"Plan"},{id:"profile",ic:"👤",l:"Profile"}].map(t=>(
          <button key={t.id} onClick={()=>{setTab(t.id);setPracticeMode(null);}} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1,opacity:tab===t.id?1:0.4,padding:"4px 10px"}}>
            <span style={{fontSize:20}}>{t.ic}</span>
            <span style={{fontSize:9,fontWeight:800,color:tab===t.id?"#58CC02":"#AFAFAF"}}>{t.l}</span>
            {tab===t.id&&<div style={{width:18,height:3,borderRadius:2,background:"#58CC02",marginTop:1}}/>}
          </button>
        ))}
      </div>
    </div>
  );
}

function PlanCard({p,i}){
  const [open,setOpen]=useState(false);
  const colors=["#58CC02","#CE82FF","#FF9600","#1CB0F6","#FF4B4B"];
  return(
    <div style={{marginBottom:10}}>
      <button onClick={()=>setOpen(!open)} style={{width:"100%",background:"#fff",borderRadius:16,padding:16,border:`2px solid ${open?colors[i]:"#E5E5E5"}`,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:40,height:40,borderRadius:12,background:`${colors[i]}15`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:16,color:colors[i],flexShrink:0,fontFamily:"'Nunito',sans-serif"}}>{p.m}</div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <h3 style={{fontWeight:900,color:"#4B4B4B",fontSize:15,margin:0,fontFamily:"'Nunito',sans-serif"}}>Month {p.m}: {p.t}</h3>
            <span style={{fontSize:9,fontWeight:800,color:colors[i],background:`${colors[i]}15`,padding:"1px 7px",borderRadius:6,fontFamily:"'Nunito',sans-serif"}}>{p.g.split("—")[0].trim()}</span>
          </div>
          {!open&&<p style={{color:"#AFAFAF",fontSize:11,fontWeight:600,margin:"2px 0 0",fontFamily:"'Nunito',sans-serif"}}>{p.f.split("·").slice(0,3).join("·")}...</p>}
        </div>
        <span style={{fontSize:14,color:"#AFAFAF",transition:"transform 0.2s",transform:open?"rotate(180deg)":"none"}}>▼</span>
      </button>
      {open&&(
        <div style={{background:`${colors[i]}06`,borderRadius:"0 0 16px 16px",padding:16,border:`2px solid ${colors[i]}22`,borderTop:"none",marginTop:-4,fontFamily:"'Nunito',sans-serif"}}>
          <p style={{fontSize:12,fontWeight:800,color:colors[i],margin:"0 0 4px"}}>📚 FOCUS AREAS</p>
          <p style={{fontSize:13,color:"#4B4B4B",fontWeight:600,lineHeight:1.5,margin:"0 0 12px"}}>{p.f}</p>
          <p style={{fontSize:12,fontWeight:800,color:colors[i],margin:"0 0 4px"}}>✅ WEEKLY TASKS</p>
          <p style={{fontSize:13,color:"#4B4B4B",fontWeight:600,lineHeight:1.5,margin:"0 0 12px"}}>{p.tasks}</p>
          <div style={{background:`${colors[i]}12`,padding:"10px 14px",borderRadius:10,border:`1px solid ${colors[i]}25`}}>
            <p style={{fontSize:12,fontWeight:800,color:colors[i],margin:0}}>🎯 {p.g}</p>
          </div>
        </div>
      )}
    </div>
  );
}
