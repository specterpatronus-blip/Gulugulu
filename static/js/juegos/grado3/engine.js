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
if(gameId.value===1)sessionStorage.setItem('gulu_score_3','0');
const totalScore=ref(parseInt(sessionStorage.getItem('gulu_score_3')||'0',10));
const timer=ref(0);const score=ref(0);const gameWon=ref(false);const gameLost=ref(false);let iv=null;

const winMessages = ["¡Maestría Total!", "¡Increíble!", "¡Lo lograste!", "¡Eres un crack!", "¡Perfecto!", "¡Brillante!", "¡Excelente!", "¡Genial!", "¡Fantástico!", "¡Súper bien!"];
const loseMessages = ["¡Casi!", "¡Sigue intentando!", "¡Ánimo!", "¡A la próxima sale!", "¡No te rindas!", "¡Uy, por poco!", "¡Tú puedes!", "¡No pasa nada!", "¡Vuelve a probar!"];
const winMsg = ref("");
const loseMsg = ref("");

const cfgs={
  1:{title:'Tablas de Multiplicar',showScore:false},
  2:{title:'Reparto Equitativo',showScore:false},
  3:{title:'Fracciones',showScore:false},
  4:{title:'Sistema Solar',showScore:false},
  5:{title:'Tiempos Verbales',showScore:true,maxScore:5},
  6:{title:'Antónimos',showScore:true,maxScore:5},
  7:{title:'Perímetro de Polígonos',showScore:false},
  8:{title:'Estados de la Materia',showScore:true,maxScore:5},
  9:{title:'Continentes del Mundo',showScore:false},
  10:{title:'Cadena Alimentaria',showScore:false},
  11:{title:'Patrones Numéricos',showScore:false},
  12:{title:'Categorías Gramaticales',showScore:true,maxScore:5},
  13:{title:'La Hora en el Reloj',showScore:false},
  14:{title:'Buscando Sinónimos',showScore:false},
  15:{title:'Multiplicación x10, x100, x1000',showScore:false},
  16:{title:'Ortografía: C, S, Z',showScore:true,maxScore:5},
  17:{title:'Comparación (hasta 9.999)',showScore:false},
  18:{title:'Partes de la Planta',showScore:false},
  19:{title:'Rosa de los Vientos',showScore:false},
  20:{title:'Problemas Matemáticos',showScore:false}
};

const config=computed(()=>cfgs[gameId.value]||cfgs[1]);
const fmtTime=computed(()=>{const m=Math.floor(timer.value/60),s=timer.value%60;return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;});
const win=()=>{clearInterval(iv);totalScore.value++;sessionStorage.setItem('gulu_score_3',totalScore.value.toString());winMsg.value=winMessages[utils.rnd(0,winMessages.length-1)];gameWon.value=true;};
const lose=()=>{clearInterval(iv);loseMsg.value=loseMessages[utils.rnd(0,loseMessages.length-1)];gameLost.value=true;};

const g=reactive({
  // Shared
  data:[], idx:0, opts:[], ans:null,
  // Math
  a:0, b:0, c:0, type:'', num:0, den:0, word:'',
  // Science/Soc
  planets:[], shuffled:[], placed:[], emoji:'', clue:'', sides:[], shape:'', h1:0, add:0
});

// --- INITIALIZE LOGIC IMMEDIATELY (Before first render) ---
if(window.GULU_LEVEL_LOGIC && window.GULU_LEVEL_LOGIC.init){
  window.GULU_LEVEL_LOGIC.init(g, utils);
}

// Aliases for template calls
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

return{GIconEngine,gameId,config,fmtTime,score,totalScore,gameWon,gameLost,winMsg,loseMsg,g,
  pG1,pG2,pG3,pG4,pG5,pG6,pG7,pG8,pG9,pG10,pG11,pG12,pG13,pG14,pG15,pG16,pG17,pG18,pG19,pG20};
}
});
app.config.compilerOptions.delimiters = ['[[', ']]'];
_guluVueApp = app;
app.mount('#game-app');
})();