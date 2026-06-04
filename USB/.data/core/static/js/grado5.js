(function(){
const {createApp,ref,computed,reactive,onMounted}=Vue;
createApp({
compilerOptions:{delimiters:['[[',']]']},
setup(){
const gameId=ref(GAME_ID);
if(gameId.value === 1) sessionStorage.setItem('gulu_score_5', '0');
const totalScore=ref(parseInt(sessionStorage.getItem('gulu_score_5')||'0', 10));
const timer=ref(0);const score=ref(0);const gameWon=ref(false);const gameLost=ref(false);let iv=null;
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
  10:{title:'Química Básica',showScore:true,maxScore:5},
  11:{title:'Raíz Cuadrada',showScore:false},
  12:{title:'Simplificación Avanzada',showScore:false},
  13:{title:'Conversión de Masa',showScore:false},
  14:{title:'Ángulos Especiales',showScore:false},
  15:{title:'División Decimal',showScore:false},
  16:{title:'La Célula',showScore:false},
  17:{title:'Acentuación',showScore:false},
  18:{title:'Adivina el Planeta',showScore:false},
  19:{title:'Comprensión',showScore:false},
  20:{title:'MCM',showScore:false}
};
const config=computed(()=>cfgs[gameId.value]||cfgs[1]);
const fmtTime=computed(()=>{const m=Math.floor(timer.value/60),s=timer.value%60;return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;});
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const shuffle=a=>{const r=[...a];for(let i=r.length-1;i>0;i--){const j=rnd(0,i);[r[i],r[j]]=[r[j],r[i]];}return r;};
const shake = () => {};
const win=()=>{clearInterval(iv);totalScore.value++;sessionStorage.setItem('gulu_score_5',totalScore.value.toString());gameWon.value = true;};
const lose=()=>{clearInterval(iv);gameLost.value = true;};

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
const g11=reactive({num:0,opts:[],ans:0});
const g12=reactive({n:0,d:0,opts:[],ans:''});
const g13=reactive({val:0,from:'',to:'',opts:[],ans:0});
const g14=reactive({sum:0,ans:''});
const g15=reactive({a:0,b:0,opts:[],ans:0});
const g16=reactive({clue:'',opts:[],ans:''});
const g17=reactive({word:'',ans:''});
const g18=reactive({clue:'',opts:[],ans:''});
const g19=reactive({text:'',question:'',opts:[],ans:''});
const g20=reactive({a:0,b:0,opts:[],ans:0});

const iG1=()=>{g1.base=rnd(2,9);g1.exp=rnd(2,3);const ans=Math.pow(g1.base,g1.exp);g1.opts=shuffle([ans,ans+g1.base,ans-g1.base<0?ans+1:ans-g1.base,ans+1]);};
const iG2=()=>{g2.pct=[10,20,25,50][rnd(0,3)];g2.total=[100,200,80,60][rnd(0,3)];const ans=g2.pct*g2.total/100;g2.opts=shuffle([ans,ans+5,ans-5<0?ans+10:ans-5,ans+10]);};
const iG7=()=>{const shapes=['cuadrado','rectángulo'];g7.shape=shapes[rnd(0,1)];g7.w=rnd(3,12);g7.h=g7.shape==='cuadrado'?g7.w:rnd(3,12);const ans=g7.w*g7.h;g7.opts=shuffle([ans,ans+g7.w,ans-g7.h<0?ans+5:ans-g7.h,ans+g7.h]);};
const iG9=()=>{g9.a=rnd(30,80);g9.b=rnd(20,180-g9.a-10);const ans=180-g9.a-g9.b;g9.opts=shuffle([ans,ans+5,ans-5<5?ans+10:ans-5,ans+10]);};
const iG11=()=>{g11.ans=rnd(2,12);g11.num=g11.ans*g11.ans;g11.opts=shuffle([g11.ans,g11.ans+1,g11.ans-1<1?g11.ans+2:g11.ans-1,g11.ans+5]);};
const iG12=()=>{const fs=[{n:12,d:24,s:'1/2'},{n:15,d:45,s:'1/3'},{n:16,d:32,s:'1/2'},{n:20,d:25,s:'4/5'},{n:18,d:27,s:'2/3'}];const f=fs[rnd(0,fs.length-1)];g12.n=f.n;g12.d=f.d;g12.ans=f.s;g12.opts=shuffle([f.s,'1/4','3/4','2/5']);};
const iG13=()=>{g13.val=rnd(1,9);g13.from='kg';g13.to='g';g13.ans=g13.val*1000;g13.opts=shuffle([g13.ans,g13.val*100,g13.val*10,g13.ans+1000]);};
const iG14=()=>{const t=rnd(0,1);if(t===0){g14.sum=90;g14.ans='Complementarios';}else{g14.sum=180;g14.ans='Suplementarios';}};
const iG15=()=>{
  const pairs=[
    {a:4.5, b:3, ans:1.5},
    {a:7.5, b:5, ans:1.5},
    {a:2.5, b:2, ans:1.25},
    {a:0.8, b:2, ans:0.4},
    {a:1.2, b:3, ans:0.4},
    {a:3.6, b:6, ans:0.6},
    {a:1.5, b:3, ans:0.5},
    {a:2.4, b:4, ans:0.6},
    {a:3.5, b:7, ans:0.5},
    {a:4.8, b:8, ans:0.6}
  ];
  const p=pairs[rnd(0,pairs.length-1)];
  g15.a=p.a;
  g15.b=p.b;
  g15.ans=p.ans;
  g15.opts=shuffle([p.ans, p.ans+0.5, p.ans-0.2<0?p.ans+1:p.ans-0.2, p.ans+1]);
};
const iG16=()=>{const cs=[{c:'Centro de control de la célula',a:'Núcleo'},{c:'Produce energía para la célula',a:'Mitocondria'},{c:'Protege a la célula vegetal',a:'Pared Celular'},{c:'Realiza la fotosíntesis',a:'Cloroplasto'}];const c=cs[rnd(0,cs.length-1)];g16.clue=c.c;g16.ans=c.a;g16.opts=shuffle([c.a,'Ribosoma','Vacuola','Citoplasma']);};
const iG17=()=>{const ws=[{w:'CANCION',a:'Aguda'},{w:'ARBOL',a:'Llana'},{w:'PÁJARO',a:'Esdrújula'},{w:'CORAZON',a:'Aguda'},{w:'MESA',a:'Llana'}];const w=ws[rnd(0,ws.length-1)];g17.word=w.w;g17.ans=w.a;};
const iG18=()=>{const ps=[{c:'Es el planeta rojo',a:'Marte'},{c:'El planeta más grande',a:'Júpiter'},{c:'Tiene anillos muy visibles',a:'Saturno'},{c:'Nuestro hogar',a:'Tierra'}];const p=ps[rnd(0,ps.length-1)];g18.clue=p.c;g18.ans=p.a;g18.opts=shuffle([p.a,'Venus','Mercurio','Urano']);};
const iG19=()=>{const ts=[{t:'El sol es una estrella en el centro de nuestro sistema solar.',q:'¿Qué es el sol?',a:'Una estrella'},{t:'Los delfines son mamíferos marinos muy inteligentes.',q:'¿Qué son los delfines?',a:'Mamíferos marinos'}];const t=ts[rnd(0,ts.length-1)];g19.text=t.t;g19.question=t.q;g19.ans=t.a;g19.opts=shuffle([t.a,'Un planeta','Un pez','Una planta']);};
const iG20=()=>{const pairs=[[2,3,6],[4,6,12],[3,5,15],[4,5,20],[6,8,24]];const [a,b,ans]=pairs[rnd(0,pairs.length-1)];g20.a=a;g20.b=b;g20.ans=ans;g20.opts=shuffle([ans,ans+2,ans-2<1?ans+4:ans-2,ans+a]);};

const pG1=(v,e)=>{if(v===Math.pow(g1.base,g1.exp))win();else lose();};
const pG2=(v,e)=>{if(v===g2.pct*g2.total/100)win();else lose();};
const pG3=(step)=>{const exp=g3.steps[g3.placed.length];if(step===exp){g3.placed.push(step);if(g3.placed.length===6)win();}else{g3.placed=[];lose();}};
const pG4=(v,e)=>{
  if(v===g4.data[g4.idx].ans){
    score.value++;
    if(g4.idx===g4.data.length-1)win();
    else g4.idx++;
  }
  else lose();
};
const pG5=(v,e)=>{
  if(v===g5.data[g5.idx].type){
    score.value++;
    if(g5.idx===g5.data.length-1)win();
    else g5.idx++;
  }
  else lose();
};
const pG6=(v,e)=>{
  if(v===g6.data[g6.idx].eco){
    score.value++;
    if(g6.idx===g6.data.length-1)win();
    else g6.idx++;
  }
  else lose();
};
const pG7=(v,e)=>{if(v===g7.w*g7.h)win();else lose();};
const pG8=(v,e)=>{
  if(v===g8.data[g8.idx].prob){
    score.value++;
    if(g8.idx===g8.data.length-1)win();
    else g8.idx++;
  }
  else lose();
};
const pG9=(v,e)=>{if(v===180-g9.a-g9.b)win();else lose();};
const pG10=(v,e)=>{
  if(v===g10.data[g10.idx].type){
    score.value++;
    if(g10.idx===g10.data.length-1)win();
    else g10.idx++;
  }
  else lose();
};
const pG11=(v,e)=>{if(v===g11.ans)win();else lose();};
const pG12=(v,e)=>{if(v===g12.ans)win();else lose();};
const pG13=(v,e)=>{if(v===g13.ans)win();else lose();};
const pG14=(v,e)=>{if(v===g14.ans)win();else lose();};
const pG15=(v,e)=>{if(v===g15.ans)win();else lose();};
const pG16=(v,e)=>{if(v===g16.ans)win();else lose();};
const pG17=(v,e)=>{if(v===g17.ans)win();else lose();};
const pG18=(v,e)=>{if(v===g18.ans)win();else lose();};
const pG19=(v,e)=>{if(v===g19.ans)win();else lose();};
const pG20=(v,e)=>{if(v===g20.ans)win();else lose();};

onMounted(()=>{
  const inits={1:iG1,2:iG2,7:iG7,9:iG9,11:iG11,12:iG12,13:iG13,14:iG14,15:iG15,16:iG16,17:iG17,18:iG18,19:iG19,20:iG20};
  if(inits[gameId.value])inits[gameId.value]();
  if(gameId.value===3){g3.shuffled=shuffle([...g3.steps]);g3.placed=[];}
  
  iv=setInterval(()=>timer.value++,1000);
});
return{gameId,config,fmtTime,score,totalScore,gameWon,gameLost,g1,g2,g3,g4,g5,g6,g7,g8,g9,g10,g11,g12,g13,g14,g15,g16,g17,g18,g19,g20,pG1,pG2,pG3,pG4,pG5,pG6,pG7,pG8,pG9,pG10,pG11,pG12,pG13,pG14,pG15,pG16,pG17,pG18,pG19,pG20,GIconEngine};
}}).mount('#game-app');

})();