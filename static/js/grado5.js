const {createApp,ref,computed,reactive,onMounted}=Vue;
createApp({
compilerOptions:{delimiters:['[[',']]']},
setup(){
const gameId=ref(GAME_ID);
const timer=ref(0);const score=ref(0);const gameWon=ref(false);let iv=null;
const cfgs={
  1:{title:'Potencias y Cuadrados',showScore:false},
  2:{title:'Porcentajes',showScore:false},
  3:{title:'Método Científico',showScore:false},
  4:{title:'Factores y Múltiplos',showScore:true,maxScore:5},
  5:{title:'Tipos de Texto',showScore:true,maxScore:5},
  6:{title:'Ecosistemas',showScore:true,maxScore:5},
  7:{title:'Área de Figuras',showScore:false},
  8:{title:'Probabilidad',showScore:true,maxScore:5},
  9:{title:'Ángulos del Triángulo',showScore:false},
  10:{title:'Química Básica',showScore:true,maxScore:5}
};
const config=computed(()=>cfgs[gameId.value]||cfgs[1]);
const fmtTime=computed(()=>{const m=Math.floor(timer.value/60),s=timer.value%60;return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;});
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const shuffle=a=>{const r=[...a];for(let i=r.length-1;i>0;i--){const j=rnd(0,i);[r[i],r[j]]=[r[j],r[i]];}return r;};
const shake=el=>gsap.fromTo(el,{x:-10},{x:10,duration:.1,yoyo:true,repeat:3,onComplete:()=>gsap.set(el,{x:0})});
const win=()=>{clearInterval(iv);confetti({particleCount:150,spread:80,origin:{y:.6}});setTimeout(()=>{gameWon.value=true;Vue.nextTick(()=>gsap.fromTo('#vm',{scale:.5,opacity:0,y:50},{scale:1,opacity:1,y:0,duration:.6,ease:'back.out(1.2)'}));},500);};

const g1=reactive({base:0,exp:0,opts:[]});
const g2=reactive({pct:0,total:0,opts:[]});
const g3=reactive({steps:['🔍 Observar','❓ Preguntar','💡 Hipótesis','🧪 Experimentar','📊 Analizar','✅ Concluir'],shuffled:[],placed:[]});
const g4=reactive({idx:0,data:[
  {n:12,ask:'factor',opts:['3','7','5','11'],ans:'3'},
  {n:5,ask:'múltiplo',opts:['25','13','7','11'],ans:'25'},
  {n:18,ask:'factor',opts:['4','7','6','11'],ans:'6'},
  {n:7,ask:'múltiplo',opts:['42','13','15','11'],ans:'42'},
  {n:24,ask:'factor',opts:['7','8','5','11'],ans:'8'}
]});
const g5=reactive({idx:0,data:[
  {text:'"Había una vez un dragón que vivía en una cueva..."',type:'Narrativo',opts:['Narrativo','Expositivo','Argumentativo']},
  {text:'"La fotosíntesis es el proceso por el cual las plantas producen energía..."',type:'Expositivo',opts:['Narrativo','Expositivo','Argumentativo']},
  {text:'"Debemos reciclar porque el planeta necesita nuestra ayuda..."',type:'Argumentativo',opts:['Narrativo','Expositivo','Argumentativo']},
  {text:'"El volcán entró en erupción y el héroe tuvo que escapar..."',type:'Narrativo',opts:['Narrativo','Expositivo','Argumentativo']},
  {text:'"Los mamíferos son animales de sangre caliente que..."',type:'Expositivo',opts:['Narrativo','Expositivo','Argumentativo']}
]});
const g6=reactive({idx:0,data:[
  {eco:'Selva Tropical 🌴',feature:'Alta humedad y biodiversidad',opts:['Selva Tropical 🌴','Desierto 🏜️','Tundra ❄️','Sabana 🌾']},
  {eco:'Desierto 🏜️',feature:'Pocas lluvias y mucho calor',opts:['Selva Tropical 🌴','Desierto 🏜️','Tundra ❄️','Arrecife 🐠']},
  {eco:'Tundra ❄️',feature:'Permafrost y bajas temperaturas',opts:['Selva Tropical 🌴','Desierto 🏜️','Tundra ❄️','Sabana 🌾']},
  {eco:'Arrecife de Coral 🐠',feature:'Rica vida marina en aguas cálidas',opts:['Selva Tropical 🌴','Desierto 🏜️','Tundra ❄️','Arrecife de Coral 🐠']},
  {eco:'Sabana 🌾',feature:'Pastizales con árboles dispersos',opts:['Sabana 🌾','Desierto 🏜️','Tundra ❄️','Arrecife 🐠']}
]});
const g7=reactive({shape:'',w:0,h:0,opts:[]});
const g8=reactive({idx:0,data:[
  {event:'Sacar una bola roja de una bolsa con 5 rojas',prob:'Seguro',opts:['Seguro','Probable','Imposible']},
  {event:'Que llueva mañana',prob:'Probable',opts:['Seguro','Probable','Imposible']},
  {event:'Que el sol salga por el oeste',prob:'Imposible',opts:['Seguro','Probable','Imposible']},
  {event:'Obtener cara o sello al lanzar una moneda',prob:'Seguro',opts:['Seguro','Probable','Imposible']},
  {event:'Sacar un número 7 de un dado normal',prob:'Imposible',opts:['Seguro','Probable','Imposible']}
]});
const g9=reactive({a:0,b:0,opts:[]});
const g10=reactive({idx:0,data:[
  {sub:'Agua (H₂O) 💧',type:'Compuesto',opts:['Elemento','Compuesto','Mezcla']},
  {sub:'Oro puro (Au) 🥇',type:'Elemento',opts:['Elemento','Compuesto','Mezcla']},
  {sub:'Ensalada de frutas 🥗',type:'Mezcla',opts:['Elemento','Compuesto','Mezcla']},
  {sub:'Oxígeno (O₂) 🌬️',type:'Elemento',opts:['Elemento','Compuesto','Mezcla']},
  {sub:'Sal de cocina (NaCl) 🧂',type:'Compuesto',opts:['Elemento','Compuesto','Mezcla']}
]});

const iG1=()=>{g1.base=rnd(2,9);g1.exp=rnd(2,3);const ans=Math.pow(g1.base,g1.exp);g1.opts=shuffle([ans,ans+g1.base,ans-g1.base<0?ans+1:ans-g1.base,ans+1]);};
const iG2=()=>{g2.pct=[10,20,25,50][rnd(0,3)];g2.total=[100,200,80,60][rnd(0,3)];const ans=g2.pct*g2.total/100;g2.opts=shuffle([ans,ans+5,ans-5<0?ans+10:ans-5,ans+10]);};
const iG7=()=>{const shapes=['cuadrado','rectángulo'];g7.shape=shapes[rnd(0,1)];g7.w=rnd(3,12);g7.h=g7.shape==='cuadrado'?g7.w:rnd(3,12);const ans=g7.w*g7.h;g7.opts=shuffle([ans,ans+g7.w,ans-g7.h<0?ans+5:ans-g7.h,ans+g7.h]);};

const pG1=(v,e)=>{if(v===Math.pow(g1.base,g1.exp))win();else shake(e.target);};
const pG2=(v,e)=>{if(v===g2.pct*g2.total/100)win();else shake(e.target);};
const pG3=(step)=>{const exp=g3.steps[g3.placed.length];if(step===exp){g3.placed.push(step);if(g3.placed.length===6)win();}else{g3.placed=[];shake(document.querySelector('.method-board'));}};
const pG4=(v,e)=>{if(v===g4.data[g4.idx].ans){score.value++;g4.idx++;if(g4.idx===5)win();else gsap.fromTo('.factor-card',{opacity:0,y:20},{opacity:1,y:0,duration:.3});}else shake(e.target);};
const pG5=(v,e)=>{if(v===g5.data[g5.idx].type){score.value++;g5.idx++;if(g5.idx===5)win();else gsap.fromTo('.text-card',{opacity:0,x:-20},{opacity:1,x:0,duration:.3});}else shake(e.target);};
const pG6=(v,e)=>{if(v===g6.data[g6.idx].eco){score.value++;g6.idx++;if(g6.idx===5)win();else gsap.fromTo('.eco-card',{opacity:0,y:20},{opacity:1,y:0,duration:.3});}else shake(e.target);};
const pG7=(v,e)=>{if(v===g7.w*g7.h)win();else shake(e.target);};
const pG8=(v,e)=>{if(v===g8.data[g8.idx].prob){score.value++;g8.idx++;if(g8.idx===5)win();else gsap.fromTo('.prob-card',{opacity:0,scale:.9},{opacity:1,scale:1,duration:.3});}else shake(e.target);};
const pG9=(v,e)=>{if(v===180-g9.a-g9.b)win();else shake(e.target);};
const pG10=(v,e)=>{if(v===g10.data[g10.idx].type){score.value++;g10.idx++;if(g10.idx===5)win();else gsap.fromTo('.chem-card',{opacity:0,y:20},{opacity:1,y:0,duration:.3});}else shake(e.target);};

onMounted(()=>{
  const inits={1:iG1,2:iG2,7:iG7};
  if(inits[gameId.value])inits[gameId.value]();
  if(gameId.value===3){g3.shuffled=shuffle([...g3.steps]);g3.placed=[];}
  if(gameId.value===9){g9.a=rnd(30,80);g9.b=rnd(20,180-g9.a-10);const ans=180-g9.a-g9.b;g9.opts=shuffle([ans,ans+5,ans-5<0?ans+10:ans-5,ans+10]);}
  gsap.fromTo('#canvas-area',{opacity:0,y:30},{opacity:1,y:0,duration:.8});
  iv=setInterval(()=>timer.value++,1000);
});
return{gameId,config,fmtTime,score,gameWon,g1,g2,g3,g4,g5,g6,g7,g8,g9,g10,pG1,pG2,pG3,pG4,pG5,pG6,pG7,pG8,pG9,pG10};
}}).mount('#game-app');
