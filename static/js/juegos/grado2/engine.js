(function(){
const {createApp,ref,computed,reactive,onMounted,onUnmounted}=Vue;

// --- SHARED UTILITIES ---
const utils = {
    rnd: (a,b)=>Math.floor(Math.random()*(b-a+1))+a,
    shuffle: a=>{const r=[...a];for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]];}return r;},
    shake: (el)=>{if(!el)return;el.classList.remove('shake-anim');void el.offsetWidth;el.classList.add('shake-anim');setTimeout(()=>el.classList.remove('shake-anim'),400);}
};

const app = createApp({
setup(){
const gameId=ref(GAME_ID);
if(gameId.value===1)sessionStorage.setItem('gulu_score_2','0');
const totalScore=ref(parseInt(sessionStorage.getItem('gulu_score_2')||'0',10));
const timer=ref(0);
const score=ref(0);
const gameWon=ref(false);
const gameLost=ref(false); 
let iv=null;

const winMessages = ["¡Maestría Total!", "¡Increíble!", "¡Lo lograste!", "¡Eres un crack!", "¡Perfecto!", "¡Brillante!", "¡Excelente!", "¡Genial!", "¡Fantástico!", "¡Súper bien!"];
const loseMessages = ["¡Casi!", "¡Sigue intentando!", "¡Ánimo!", "¡A la próxima sale!", "¡No te rindas!", "¡Uy, por poco!", "¡Tú puedes!", "¡No pasa nada!", "¡Vuelve a probar!"];
const winMsg = ref("");
const loseMsg = ref("");

const cfgs={
  1:{title:'Doble y Mitad',showScore:false},
  2:{title:'Sinónimos y Antónimos',showScore:true,maxScore:5},
  3:{title:'Sumas con Llevada',showScore:false},
  4:{title:'Hábitats del Mundo',showScore:true,maxScore:4},
  5:{title:'El Reloj Mágico',showScore:false},
  6:{title:'Clasifica la Palabra',showScore:true,maxScore:5},
  7:{title:'Ciclo de Vida',showScore:false},
  8:{title:'Valor Posicional',showScore:false},
  9:{title:'Ortografía',showScore:false},
  10:{title:'Tablas ×2, ×5, ×10',showScore:false},
  11:{title:'Suma Rápida',showScore:false},
  12:{title:'Resta Rápida',showScore:false},
  13:{title:'Mayor, Menor o Igual',showScore:false},
  14:{title:'Meses del Año',showScore:false},
  15:{title:'Figuras 3D',showScore:false},
  16:{title:'Contando Monedas',showScore:false},
  17:{title:'Sílaba Faltante',showScore:false},
  18:{title:'El Triple',showScore:false},
  19:{title:'Signo Correcto',showScore:false},
  20:{title:'Orden Alfabético',showScore:false}
};

const config=computed(()=>cfgs[gameId.value]||cfgs[1]);
const fmtTime=computed(()=>{const m=Math.floor(timer.value/60),s=timer.value%60;return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;});

const win=()=>{
  clearInterval(iv);
  totalScore.value++;
  sessionStorage.setItem('gulu_score_2',totalScore.value.toString());
  winMsg.value=winMessages[utils.rnd(0,winMessages.length-1)];
  gameWon.value=true;
};
const lose=()=>{
  clearInterval(iv);
  loseMsg.value=loseMessages[utils.rnd(0,loseMessages.length-1)];
  gameLost.value=true;
};

const g=reactive({
  // General / shared
  opts:[],
  // G1: Doble y Mitad
  num:0, label:'',
  // G2: Sinónimos y Antónimos
  data:[], idx:0,
  // G3/G11/G12/G19: operaciones numéricas
  a:0, b:0, ans:0,
  // G4: Hábitats
  animals:[],
  // G5: Reloj
  h:0, m:0,
  // G6: Clasifica la Palabra
  words:[],
  // G7: Ciclo de Vida
  shuffled:[], placed:[],
  // G8: Valor Posicional
  t:0, u:0, q:'',
  // G9: Ortografía
  parts:[],
  // G10: Tablas de Multiplicar
  mult:2,
  // G14: Meses del Año
  m1:'',
  // G15: Figuras 3D / G17: Sílaba
  emoji:'',
  // G16: Monedas
  coins:0,
  // G17: Sílaba Faltante
  word:'',
});

// --- INITIALIZE LOGIC IMMEDIATELY (Before first render) ---
if(window.GULU_LEVEL_LOGIC && window.GULU_LEVEL_LOGIC.init){
  window.GULU_LEVEL_LOGIC.init(g, utils);
}

// Methods exposed to template (aliased to specific logic)
const pG1=(v,e)=>window.GULU_LEVEL_LOGIC?.play(v,e,g,utils,win,score,lose);
const pG2=(v,e)=>window.GULU_LEVEL_LOGIC?.play(v,e,g,utils,win,score,lose);
const pG3=(v,e)=>window.GULU_LEVEL_LOGIC?.play(v,e,g,utils,win,score,lose);
const pG4=(v,e)=>window.GULU_LEVEL_LOGIC?.play(v,e,g,utils,win,score,lose);
const pG5=(v,e)=>window.GULU_LEVEL_LOGIC?.play(v,e,g,utils,win,score,lose);
const pG6=(v,e)=>window.GULU_LEVEL_LOGIC?.play(v,e,g,utils,win,score,lose);
const pG7=(v,e)=>window.GULU_LEVEL_LOGIC?.play(v,e,g,utils,win,score,lose);
const pG8=(v,e)=>window.GULU_LEVEL_LOGIC?.play(v,e,g,utils,win,score,lose);
const pG9=(v,e)=>window.GULU_LEVEL_LOGIC?.play(v,e,g,utils,win,score,lose);
const pG10=(v,e)=>window.GULU_LEVEL_LOGIC?.play(v,e,g,utils,win,score,lose);
const pG11=(v,e)=>window.GULU_LEVEL_LOGIC?.play(v,e,g,utils,win,score,lose);
const pG12=(v,e)=>window.GULU_LEVEL_LOGIC?.play(v,e,g,utils,win,score,lose);
const pG13=(v,e)=>window.GULU_LEVEL_LOGIC?.play(v,e,g,utils,win,score,lose);
const pG14=(v,e)=>window.GULU_LEVEL_LOGIC?.play(v,e,g,utils,win,score,lose);
const pG15=(v,e)=>window.GULU_LEVEL_LOGIC?.play(v,e,g,utils,win,score,lose);
const pG16=(v,e)=>window.GULU_LEVEL_LOGIC?.play(v,e,g,utils,win,score,lose);
const pG17=(v,e)=>window.GULU_LEVEL_LOGIC?.play(v,e,g,utils,win,score,lose);
const pG18=(v,e)=>window.GULU_LEVEL_LOGIC?.play(v,e,g,utils,win,score,lose);
const pG19=(v,e)=>window.GULU_LEVEL_LOGIC?.play(v,e,g,utils,win,score,lose);
const pG20=(v,e)=>window.GULU_LEVEL_LOGIC?.play(v,e,g,utils,win,score,lose);

onMounted(()=>{
  iv=setInterval(()=>timer.value++,1000);
});

onUnmounted(()=>clearInterval(iv));

return{gameId,config,fmtTime,score,totalScore,gameWon,gameLost,winMsg,loseMsg,GIconEngine,g,
  pG1,pG2,pG3,pG4,pG5,pG6,pG7,pG8,pG9,pG10,pG11,pG12,pG13,pG14,pG15,pG16,pG17,pG18,pG19,pG20};
}
});
app.config.compilerOptions.delimiters = ['[[', ']]'];
_guluVueApp = app;
app.mount('#game-app');
})();