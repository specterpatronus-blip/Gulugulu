(function(){
const {createApp,ref,computed,reactive,onMounted}=Vue;
createApp({
compilerOptions:{delimiters:['[[',']]']},
setup(){
const gameId=ref(GAME_ID);
if(gameId.value === 1) sessionStorage.setItem('gulu_score_4', '0');
const totalScore=ref(parseInt(sessionStorage.getItem('gulu_score_4')||'0', 10));
const timer=ref(0);const score=ref(0);const gameWon=ref(false);const gameLost=ref(false);let iv=null;
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
  10:{title:'Orden de Operaciones',showScore:false},
  11:{title:'Multiplicación Avanzada',showScore:false},
  12:{title:'Simplificar Fracción',showScore:false},
  13:{title:'Tipos de Ángulos',showScore:false},
  14:{title:'Tipos de Triángulos',showScore:false},
  15:{title:'Prefijos y Sufijos',showScore:false},
  16:{title:'Capitales',showScore:false},
  17:{title:'Decimales a Fracciones',showScore:false},
  18:{title:'Sujeto de la Oración',showScore:false},
  19:{title:'Conversión de Medidas',showScore:false},
  20:{title:'Sistema Óseo',showScore:false}
};
const config=computed(()=>cfgs[gameId.value]||cfgs[1]);
const fmtTime=computed(()=>{const m=Math.floor(timer.value/60),s=timer.value%60;return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;});
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const shuffle=a=>{const r=[...a];for(let i=r.length-1;i>0;i--){const j=rnd(0,i);[r[i],r[j]]=[r[j],r[i]];}return r;};
const shake = () => {};
const win=()=>{clearInterval(iv);totalScore.value++;sessionStorage.setItem('gulu_score_4',totalScore.value.toString());gameWon.value = true;};
const lose=()=>{clearInterval(iv);gameLost.value = true;};

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
const g11=reactive({a:0,b:0,opts:[],ans:0});
const g12=reactive({n:0,d:0,opts:[],ans:''});
const g13=reactive({deg:0,ans:''});
const g14=reactive({l1:0,l2:0,l3:0,ans:''});
const g15=reactive({base:'',meaning:'',opts:[],ans:''});
const g16=reactive({country:'',opts:[],ans:''});
const g17=reactive({dec:0,opts:[],ans:''});
const g18=reactive({sentence:'',opts:[],ans:''});
const g19=reactive({val:0,from:'',to:'',opts:[],ans:0});
const g20=reactive({bone:'',opts:[],ans:''});

const iG1=()=>{
  const pairs=[[1,2],[1,3],[2,3],[3,4],[1,4],[2,5]];
  const [n,d]=pairs[rnd(0,pairs.length-1)];
  g1.frac=`${n}/${d}`;
  const eq=`${n*2}/${d*2}`;
  const distractors=[];
  const addDistractor=(num, den)=>{
    if(num > 0 && den > 0 && num*d !== den*n && num !== den){
      const f=`${num}/${den}`;
      if(!distractors.includes(f) && f!==eq) distractors.push(f);
    }
  };
  addDistractor(n+1, d);
  addDistractor(n, d+1);
  addDistractor(n*2+1, d*2);
  addDistractor(n*2, d*2+1);
  while(distractors.length < 3) {
    addDistractor(rnd(1, 9), rnd(2, 9));
  }
  g1.opts=shuffle([eq, distractors[0], distractors[1], distractors[2]]);
  g1.answer=eq;
};
const iG2=()=>{g2.a=rnd(12,49);g2.b=rnd(12,29);const ans=g2.a*g2.b;g2.opts=shuffle([ans,ans+g2.b,ans-g2.b,ans+10]);};
const iG6=()=>{g6.b=rnd(2,9);g6.a=g6.b*rnd(2,10)+rnd(1,g6.b-1);g6.q=Math.floor(g6.a/g6.b);g6.r=g6.a%g6.b;g6.opts=shuffle([g6.r,g6.r+1,g6.r===0?2:g6.r-1,g6.r+2]);};
const iG8=()=>{const map={1:'I',4:'IV',5:'V',9:'IX',10:'X',14:'XIV',15:'XV',19:'XIX',20:'XX',40:'XL',50:'L'};const nums=Object.keys(map).map(Number);const n=nums[rnd(0,nums.length-1)];g8.roman=map[n];g8.arabic=n;const wrong=[n+1,n+5,n-1<1?n+10:n-1];g8.opts=shuffle([n,...wrong.slice(0,3)]);};
const iG10=()=>{const exprs=[{e:'2 + 3 × 4',a:14},{e:'(2 + 3) × 4',a:20},{e:'10 - 2 × 3',a:4},{e:'(10 - 2) × 3',a:24},{e:'5 + 4 × 2',a:13}];const ex=exprs[rnd(0,exprs.length-1)];g10.expr=ex.e;g10.ans=ex.a;g10.opts=shuffle([ex.a,ex.a+1,ex.a-1,ex.a+5]);};
const iG11=()=>{g11.a=rnd(10,50);g11.b=rnd(10,50);g11.ans=g11.a*g11.b;g11.opts=shuffle([g11.ans,g11.ans+g11.b,g11.ans-g11.b,g11.ans+100]);};
const iG12=()=>{const fs=[{n:2,d:4,s:'1/2'},{n:3,d:9,s:'1/3'},{n:4,d:8,s:'1/2'},{n:5,d:10,s:'1/2'},{n:6,d:8,s:'3/4'}];const f=fs[rnd(0,fs.length-1)];g12.n=f.n;g12.d=f.d;g12.ans=f.s;g12.opts=shuffle([f.s,'1/4','2/3','3/4'].filter((v,i,a)=>a.indexOf(v)===i));if(g12.opts.length<4)g12.opts.push('1/5');g12.opts=shuffle(g12.opts);};
const iG13=()=>{g13.deg=rnd(30,150);g13.ans=g13.deg===90?'Recto':g13.deg<90?'Agudo':'Obtuso';};
const iG14=()=>{const t=rnd(0,2);if(t===0){g14.l1=g14.l2=g14.l3=rnd(3,10);g14.ans='Equilátero';}else if(t===1){g14.l1=g14.l2=rnd(3,10);g14.l3=g14.l1+1;g14.ans='Isósceles';}else{const l1=rnd(4,8);let l2=rnd(4,8);while(l2===l1)l2=rnd(4,8);const minC=Math.abs(l1-l2)+1;const maxC=l1+l2-1;let l3=rnd(minC,maxC);while(l3===l1||l3===l2)l3=rnd(minC,maxC);g14.l1=l1;g14.l2=l2;g14.l3=l3;g14.ans='Escaleno';}};
const iG15=()=>{const ps=[{p:'sub',b:'marino',m:'debajo del mar'},{p:'des',b:'hacer',m:'lo contrario a hacer'},{p:'pre',b:'historia',m:'antes de la historia'}];const p=ps[rnd(0,ps.length-1)];g15.base=p.b;g15.meaning=p.m;g15.ans=p.p;g15.opts=shuffle([p.p,'re','in','anti']);};
const iG16=()=>{const cs=[{c:'Colombia',a:'Bogotá'},{c:'Perú',a:'Lima'},{c:'España',a:'Madrid'},{c:'Francia',a:'París'}];const c=cs[rnd(0,cs.length-1)];g16.country=c.c;g16.ans=c.a;g16.opts=shuffle([c.a,'Quito','Roma','Londres']);};
const iG17=()=>{const ds=[{d:'0.5',f:'1/2'},{d:'0.25',f:'1/4'},{d:'0.75',f:'3/4'},{d:'0.1',f:'1/10'}];const d=ds[rnd(0,ds.length-1)];g17.dec=d.d;g17.ans=d.f;g17.opts=shuffle([d.f,'1/3','2/5','1/5']);};
const iG18=()=>{const ss=[{s:'El gato negro duerme',a:'El gato negro'},{s:'Mi amigo juega pelota',a:'Mi amigo'},{s:'La flor roja es bonita',a:'La flor roja'}];const s=ss[rnd(0,ss.length-1)];g18.sentence=s.s;g18.ans=s.a;g18.opts=shuffle([s.a,'duerme','juega pelota','es bonita']);};
const iG19=()=>{g19.val=rnd(1,9);g19.from='m';g19.to='cm';g19.ans=g19.val*100;g19.opts=shuffle([g19.ans,g19.val*10,g19.val*1000,g19.ans+100]);};
const iG20=()=>{const bs=[{b:'Fémur',a:'Pierna'},{b:'Cráneo',a:'Cabeza'},{b:'Costillas',a:'Pecho'},{b:'Húmero',a:'Brazo'}];const b=bs[rnd(0,bs.length-1)];g20.bone=b.b;g20.ans=b.a;g20.opts=shuffle([b.a,'Mano','Pie','Espalda']);};

const pG1=(v,e)=>{if(v===g1.answer)win();else lose();};
const pG2=(v,e)=>{if(v===g2.a*g2.b)win();else lose();};
const pG3=(t,e)=>{
  if(t===g3.data[g3.idx].type){
    score.value++;
    if(g3.idx===g3.data.length-1)win();
    else g3.idx++;
  }
  else lose();
};
const pG4=(v,e)=>{
  if(v===g4.data[g4.idx].ans){
    score.value++;
    if(g4.idx===g4.data.length-1)win();
    else g4.idx++;
  }
  else lose();
};
const pG5=(v,e)=>{
  if(v===g5.data[g5.idx].biome){
    score.value++;
    if(g5.idx===g5.data.length-1)win();
    else g5.idx++;
  }
  else lose();
};
const pG6=(v,e)=>{if(v===g6.r)win();else lose();};
const pG7=(v,e)=>{
  const cur=g7.data[g7.idx];
  const correct=g7.asking==='sujeto'?cur.subject:cur.predicate;
  if(v===correct){
    score.value++;
    if(g7.idx===g7.data.length-1)win();
    else g7.idx++;
  }
  else lose();
};
const pG8=(v,e)=>{if(v===g8.arabic)win();else lose();};
const pG9=(v,e)=>{
  if(v===g9.data[g9.idx].system){
    score.value++;
    if(g9.idx===g9.data.length-1)win();
    else g9.idx++;
  }
  else lose();
};
const pG10=(v,e)=>{if(v===g10.ans)win();else lose();};
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
  const inits={1:iG1,2:iG2,6:iG6,8:iG8,10:iG10,11:iG11,12:iG12,13:iG13,14:iG14,15:iG15,16:iG16,17:iG17,18:iG18,19:iG19,20:iG20};
  if(inits[gameId.value])inits[gameId.value]();
  
  iv=setInterval(()=>timer.value++,1000);
});
return{gameId,config,fmtTime,score,totalScore,gameWon,gameLost,GIconEngine,g1,g2,g3,g4,g5,g6,g7,g8,g9,g10,g11,g12,g13,g14,g15,g16,g17,g18,g19,g20,pG1,pG2,pG3,pG4,pG5,pG6,pG7,pG8,pG9,pG10,pG11,pG12,pG13,pG14,pG15,pG16,pG17,pG18,pG19,pG20};
}}).mount('#game-app');

})();