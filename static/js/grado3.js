const {createApp,ref,computed,reactive,onMounted}=Vue;
createApp({
compilerOptions:{delimiters:['[[',']]']},
setup(){
const gameId=ref(GAME_ID);
const timer=ref(0);const score=ref(0);const gameWon=ref(false);let iv=null;
const cfgs={
  1:{title:'Multiplicaciones',showScore:false},
  2:{title:'División Exacta',showScore:false},
  3:{title:'Fracciones',showScore:false},
  4:{title:'Sistema Solar',showScore:false},
  5:{title:'Conjugación Verbal',showScore:true,maxScore:5},
  6:{title:'Antónimos',showScore:true,maxScore:5},
  7:{title:'Perímetro',showScore:false},
  8:{title:'Estados del Agua',showScore:true,maxScore:5},
  9:{title:'Continentes',showScore:false},
  10:{title:'Cadena Alimentaria',showScore:false}
};
const config=computed(()=>cfgs[gameId.value]||cfgs[1]);
const fmtTime=computed(()=>{const m=Math.floor(timer.value/60),s=timer.value%60;return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;});
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const shuffle=a=>{const r=[...a];for(let i=r.length-1;i>0;i--){const j=rnd(0,i);[r[i],r[j]]=[r[j],r[i]];}return r;};
const shake=el=>gsap.fromTo(el,{x:-10},{x:10,duration:.1,yoyo:true,repeat:3,onComplete:()=>gsap.set(el,{x:0})});
const win=()=>{clearInterval(iv);confetti({particleCount:150,spread:80,origin:{y:.6}});setTimeout(()=>{gameWon.value=true;Vue.nextTick(()=>gsap.fromTo('#vm',{scale:.5,opacity:0,y:50},{scale:1,opacity:1,y:0,duration:.6,ease:'back.out(1.2)'}));},500);};

const g1=reactive({a:0,b:0,opts:[]});
const g2=reactive({a:0,b:0,opts:[]});
const g3=reactive({num:0,den:0,opts:[]});
const g4=reactive({planets:['☀️Sol','🌑Mercurio','🌍Venus','🌎Tierra','🔴Marte','🟠Júpiter','🪐Saturno','🔵Urano','🌑Neptuno'],shuffled:[],placed:[]});
const g5=reactive({idx:0,data:[
  {inf:'correr',tense:'pasado',opts:['corrí','corro','correré'],ans:'corrí'},
  {inf:'saltar',tense:'presente',opts:['salté','salto','saltaré'],ans:'salto'},
  {inf:'comer',tense:'futuro',opts:['comí','como','comeré'],ans:'comeré'},
  {inf:'hablar',tense:'pasado',opts:['hablé','hablo','hablaré'],ans:'hablé'},
  {inf:'vivir',tense:'futuro',opts:['viví','vivo','viviré'],ans:'viviré'}
]});
const g6=reactive({idx:0,data:[
  {w:'día',ant:'noche'},{w:'entrada',ant:'salida'},{w:'lleno',ant:'vacío'},
  {w:'alegre',ant:'triste'},{w:'nuevo',ant:'viejo'}
],opts:[]});
const g7=reactive({shape:'',sides:[],opts:[]});
const g8=reactive({idx:0,items:[
  {n:'Hielo',e:'🧊',state:'sólido'},{n:'Agua',e:'💧',state:'líquido'},
  {n:'Vapor',e:'💨',state:'gaseoso'},{n:'Piedra',e:'🪨',state:'sólido'},
  {n:'Leche',e:'🥛',state:'líquido'}
]});
const g9=reactive({continent:'',clue:'',opts:[],ans:''});
const g10=reactive({chain:[],shuffled:[],placed:[]});

const iG1=()=>{const tables=[3,4,6];g1.b=tables[rnd(0,2)];g1.a=rnd(2,10);const ans=g1.a*g1.b;g1.opts=shuffle([ans,ans+g1.b,ans-g1.b<0?ans+g1.b*2:ans-g1.b,ans+1]);};
const iG2=()=>{g2.b=rnd(2,9);g2.a=g2.b*rnd(2,10);const ans=g2.a/g2.b;g2.opts=shuffle([ans,ans+1,ans-1<1?ans+2:ans-1,ans+2]);};
const iG3=()=>{const fracs=[{n:1,d:2},{n:1,d:3},{n:1,d:4},{n:2,d:3},{n:3,d:4}];const f=fracs[rnd(0,fracs.length-1)];g3.num=f.n;g3.den=f.d;const make=(n,d)=>`${n}/${d}`;const ans=make(f.n*2,f.d*2);const w1=make(f.n*3,f.d*2);const w2=make(f.n,f.d*3);const w3=make(f.n+1,f.d);g3.opts=shuffle([ans,w1,w2,w3]);g3.answer=ans;};
const iG4=()=>{g4.shuffled=shuffle([...g4.planets]);g4.placed=[];};
const iG5=()=>{};
const iG6=()=>{const cur=g6.data[g6.idx];const wrongs=g6.data.filter((_,i)=>i!==g6.idx).map(x=>x.ant);g6.opts=shuffle([cur.ant,...shuffle(wrongs).slice(0,3)]);};
const iG7=()=>{const shapes=[{shape:'cuadrado',sides:[5,5,5,5]},{shape:'rectángulo',sides:[6,4,6,4]},{shape:'triángulo',sides:[5,5,5]},{shape:'pentágono',sides:[4,4,4,4,4]}];const s=shapes[rnd(0,shapes.length-1)];g7.shape=s.shape;g7.sides=s.sides;const ans=s.sides.reduce((a,b)=>a+b,0);g7.opts=shuffle([ans,ans+1,ans-1,ans+2]);};
const iG8=()=>{};
const iG9=()=>{const data=[{c:'El más grande de todos',cn:'Asia',opts:['Asia','Europa','África','América']},{c:'El continente helado',cn:'Antártida',opts:['Antártida','Oceanía','Europa','Asia']},{c:'Donde está Colombia',cn:'América',opts:['América','África','Europa','Asia']},{c:'El más pequeño',cn:'Oceanía',opts:['Oceanía','Europa','Antártida','África']}];const d=data[rnd(0,data.length-1)];g9.clue=d.c;g9.ans=d.cn;g9.opts=shuffle([...d.opts]);};
const iG10=()=>{g10.chain=['🌿Planta','🐛Oruga','🐸Rana','🦅Águila'];g10.shuffled=shuffle([...g10.chain]);g10.placed=[];};

const pG1=(v,e)=>{if(v===g1.a*g1.b)win();else shake(e.target);};
const pG2=(v,e)=>{if(v===g2.a/g2.b)win();else shake(e.target);};
const pG3=(v,e)=>{if(v===g3.answer)win();else shake(e.target);};
const pG4=(planet)=>{const exp=g4.planets[g4.placed.length];if(planet===exp){g4.placed.push(planet);if(g4.placed.length===g4.planets.length)win();}else{g4.placed=[];shake(document.querySelector('.planet-board'));}};
const pG5=(v,e)=>{const cur=g5.data[g5.idx];if(v===cur.ans){score.value++;g5.idx++;if(g5.idx===5)win();else gsap.fromTo('.conj-card',{opacity:0,y:20},{opacity:1,y:0,duration:.3});}else shake(e.target);};
const pG6=(v,e)=>{if(v===g6.data[g6.idx].ant){score.value++;g6.idx++;if(g6.idx===5)win();else{iG6();gsap.fromTo('.ant-card',{opacity:0,x:-20},{opacity:1,x:0,duration:.3});}}else shake(e.target);};
const pG7=(v,e)=>{if(v===g7.sides.reduce((a,b)=>a+b,0))win();else shake(e.target);};
const pG8=(state,e)=>{if(state===g8.items[g8.idx].state){score.value++;g8.idx++;if(g8.idx===5)win();else gsap.fromTo('.state-card',{scale:.8,opacity:0},{scale:1,opacity:1,duration:.4});}else shake(e.target);};
const pG9=(v,e)=>{if(v===g9.ans)win();else shake(e.target);};
const pG10=(planet)=>{const exp=g10.chain[g10.placed.length];if(planet===exp){g10.placed.push(planet);if(g10.placed.length===4)win();}else{g10.placed=[];shake(document.querySelector('.chain-board'));}};

onMounted(()=>{
  const inits={1:iG1,2:iG2,3:iG3,4:iG4,5:iG5,6:iG6,7:iG7,8:iG8,9:iG9,10:iG10};
  if(inits[gameId.value])inits[gameId.value]();
  if(gameId.value===10)iG10();
  gsap.fromTo('#canvas-area',{opacity:0,y:30},{opacity:1,y:0,duration:.8});
  iv=setInterval(()=>timer.value++,1000);
});
return{gameId,config,fmtTime,score,gameWon,g1,g2,g3,g4,g5,g6,g7,g8,g9,g10,pG1,pG2,pG3,pG4,pG5,pG6,pG7,pG8,pG9,pG10};
}}).mount('#game-app');
