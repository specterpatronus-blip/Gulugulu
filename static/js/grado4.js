const {createApp,ref,computed,reactive,onMounted}=Vue;
createApp({
compilerOptions:{delimiters:['[[',']]']},
setup(){
const gameId=ref(GAME_ID);
const timer=ref(0);const score=ref(0);const gameWon=ref(false);let iv=null;
const cfgs={
  1:{title:'Fracciones Equivalentes',showScore:false},
  2:{title:'Multiplicación de 2 Cifras',showScore:false},
  3:{title:'Ángulos',showScore:true,maxScore:5},
  4:{title:'Prefijos y Sufijos',showScore:true,maxScore:5},
  5:{title:'Biomas del Mundo',showScore:true,maxScore:5},
  6:{title:'División con Residuo',showScore:false},
  7:{title:'Sujeto y Predicado',showScore:true,maxScore:4},
  8:{title:'Números Romanos',showScore:false},
  9:{title:'El Cuerpo Humano',showScore:true,maxScore:5},
  10:{title:'Orden de Operaciones',showScore:false}
};
const config=computed(()=>cfgs[gameId.value]||cfgs[1]);
const fmtTime=computed(()=>{const m=Math.floor(timer.value/60),s=timer.value%60;return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;});
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const shuffle=a=>{const r=[...a];for(let i=r.length-1;i>0;i--){const j=rnd(0,i);[r[i],r[j]]=[r[j],r[i]];}return r;};
const shake=el=>gsap.fromTo(el,{x:-10},{x:10,duration:.1,yoyo:true,repeat:3,onComplete:()=>gsap.set(el,{x:0})});
const win=()=>{clearInterval(iv);confetti({particleCount:150,spread:80,origin:{y:.6}});setTimeout(()=>{gameWon.value=true;Vue.nextTick(()=>gsap.fromTo('#vm',{scale:.5,opacity:0,y:50},{scale:1,opacity:1,y:0,duration:.6,ease:'back.out(1.2)'}));},500);};

const g1=reactive({frac:'',opts:[],answer:''});
const g2=reactive({a:0,b:0,opts:[]});
const g3=reactive({idx:0,data:[
  {angle:30,type:'Agudo',opts:['Agudo','Recto','Obtuso']},
  {angle:90,type:'Recto',opts:['Agudo','Recto','Obtuso']},
  {angle:120,type:'Obtuso',opts:['Agudo','Recto','Obtuso']},
  {angle:45,type:'Agudo',opts:['Agudo','Recto','Obtuso']},
  {angle:150,type:'Obtuso',opts:['Agudo','Recto','Obtuso']}
]});
const g4=reactive({idx:0,data:[
  {root:'feliz',prefix:'in',result:'infeliz',q:'¿Qué significa el prefijo IN-?',opts:['Negación','Repetición','Exceso'],ans:'Negación'},
  {root:'hacer',prefix:'re',result:'rehacer',q:'¿Qué significa el prefijo RE-?',opts:['Negación','Repetición','Antes'],ans:'Repetición'},
  {root:'nacional',suffix:'idad',result:'nacionalidad',q:'El sufijo -IDAD indica:',opts:['Cualidad','Acción','Persona'],ans:'Cualidad'},
  {root:'correr',suffix:'dor',result:'corredor',q:'El sufijo -DOR indica:',opts:['Cualidad','Acción','Persona que hace algo'],ans:'Persona que hace algo'},
  {root:'pan',prefix:'pre',result:'precocinar',q:'¿Qué significa el prefijo PRE-?',opts:['Antes','Después','Nunca'],ans:'Antes'}
]});
const g5=reactive({idx:0,data:[
  {animal:'Cactus 🌵',biome:'Desierto',opts:['Desierto','Tundra','Bosque Tropical','Océano']},
  {animal:'Oso Polar 🐻‍❄️',biome:'Tundra',opts:['Desierto','Tundra','Sabana','Bosque']},
  {animal:'Jaguar 🐆',biome:'Bosque Tropical',opts:['Desierto','Tundra','Bosque Tropical','Pradera']},
  {animal:'León 🦁',biome:'Sabana',opts:['Sabana','Tundra','Océano','Bosque Tropical']},
  {animal:'Ballena 🐋',biome:'Océano',opts:['Desierto','Sabana','Océano','Tundra']}
]});
const g6=reactive({a:0,b:0,q:0,r:0,opts:[]});
const g7=reactive({idx:0,data:[
  {sent:'Los niños juegan fútbol',subject:'Los niños',predicate:'juegan fútbol'},
  {sent:'Mi mamá cocina rico',subject:'Mi mamá',predicate:'cocina rico'},
  {sent:'El perro ladra fuerte',subject:'El perro',predicate:'ladra fuerte'},
  {sent:'Las flores huelen bien',subject:'Las flores',predicate:'huelen bien'}
],asking:'sujeto'});
const g8=reactive({roman:'',arabic:0,opts:[]});
const g9=reactive({idx:0,data:[
  {organ:'Estómago 🫃',system:'Digestivo',opts:['Digestivo','Respiratorio','Circulatorio','Nervioso']},
  {organ:'Pulmones 🫁',system:'Respiratorio',opts:['Digestivo','Respiratorio','Circulatorio','Locomotor']},
  {organ:'Corazón ❤️',system:'Circulatorio',opts:['Digestivo','Respiratorio','Circulatorio','Nervioso']},
  {organ:'Cerebro 🧠',system:'Nervioso',opts:['Digestivo','Respiratorio','Circulatorio','Nervioso']},
  {organ:'Fémur 🦴',system:'Locomotor',opts:['Digestivo','Respiratorio','Locomotor','Nervioso']}
]});
const g10=reactive({expr:'',ans:0,opts:[]});

const iG1=()=>{const pairs=[[1,2],[2,4],[1,3],[2,6],[3,4],[6,8]];const [n,d]=pairs[rnd(0,pairs.length-1)];g1.frac=`${n}/${d}`;const eq1=`${n*2}/${d*2}`;const eq2=`${n*3}/${d*3}`;const w1=`${n+1}/${d}`;const w2=`${n}/${d+1}`;g1.opts=shuffle([eq1,eq2,w1,w2]);g1.answer=eq1;};
const iG2=()=>{g2.a=rnd(12,49);g2.b=rnd(12,29);const ans=g2.a*g2.b;g2.opts=shuffle([ans,ans+g2.b,ans-g2.b,ans+10]);};
const iG6=()=>{g6.b=rnd(2,9);g6.a=g6.b*rnd(2,10)+rnd(1,g6.b-1);g6.q=Math.floor(g6.a/g6.b);g6.r=g6.a%g6.b;g6.opts=shuffle([g6.r,g6.r+1,g6.r===0?2:g6.r-1,g6.r+2]);};
const iG8=()=>{const map={1:'I',4:'IV',5:'V',9:'IX',10:'X',14:'XIV',15:'XV',19:'XIX',20:'XX',40:'XL',50:'L'};const nums=Object.keys(map).map(Number);const n=nums[rnd(0,nums.length-1)];g8.roman=map[n];g8.arabic=n;const wrong=[n+1,n+5,n-1<1?n+10:n-1];g8.opts=shuffle([n,...wrong.slice(0,3)]);};
const iG10=()=>{const exprs=[{e:'2 + 3 × 4',a:14},{e:'(2 + 3) × 4',a:20},{e:'10 - 2 × 3',a:4},{e:'(10 - 2) × 3',a:24},{e:'5 + 2² ',a:9}];const ex=exprs[rnd(0,exprs.length-1)];g10.expr=ex.e;g10.ans=ex.a;g10.opts=shuffle([ex.a,ex.a+1,ex.a-1,ex.a+5]);};

const pG1=(v,e)=>{if(v===g1.answer)win();else shake(e.target);};
const pG2=(v,e)=>{if(v===g2.a*g2.b)win();else shake(e.target);};
const pG3=(t,e)=>{if(t===g3.data[g3.idx].type){score.value++;g3.idx++;if(g3.idx===5)win();else gsap.fromTo('.angle-card',{opacity:0,scale:.8},{opacity:1,scale:1,duration:.3});}else shake(e.target);};
const pG4=(v,e)=>{if(v===g4.data[g4.idx].ans){score.value++;g4.idx++;if(g4.idx===5)win();else gsap.fromTo('.pref-card',{opacity:0,x:-20},{opacity:1,x:0,duration:.3});}else shake(e.target);};
const pG5=(v,e)=>{if(v===g5.data[g5.idx].biome){score.value++;g5.idx++;if(g5.idx===5)win();else gsap.fromTo('.biome-card',{opacity:0,y:20},{opacity:1,y:0,duration:.3});}else shake(e.target);};
const pG6=(v,e)=>{if(v===g6.r)win();else shake(e.target);};
const pG7=(v,e)=>{const cur=g7.data[g7.idx];const correct=g7.asking==='sujeto'?cur.subject:cur.predicate;if(v===correct){score.value++;g7.idx++;if(g7.idx===4)win();else gsap.fromTo('.sent-card',{opacity:0,y:15},{opacity:1,y:0,duration:.3});}else shake(e.target);};
const pG8=(v,e)=>{if(v===g8.arabic)win();else shake(e.target);};
const pG9=(v,e)=>{if(v===g9.data[g9.idx].system){score.value++;g9.idx++;if(g9.idx===5)win();else gsap.fromTo('.organ-card',{scale:.8,opacity:0},{scale:1,opacity:1,duration:.4});}else shake(e.target);};
const pG10=(v,e)=>{if(v===g10.ans)win();else shake(e.target);};

onMounted(()=>{
  const inits={1:iG1,2:iG2,6:iG6,8:iG8,10:iG10};
  if(inits[gameId.value])inits[gameId.value]();
  gsap.fromTo('#canvas-area',{opacity:0,y:30},{opacity:1,y:0,duration:.8});
  iv=setInterval(()=>timer.value++,1000);
});
return{gameId,config,fmtTime,score,gameWon,g1,g2,g3,g4,g5,g6,g7,g8,g9,g10,pG1,pG2,pG3,pG4,pG5,pG6,pG7,pG8,pG9,pG10};
}}).mount('#game-app');
