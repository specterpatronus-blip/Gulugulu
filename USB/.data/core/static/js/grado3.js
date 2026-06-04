(function(){
const {createApp,ref,computed,reactive,onMounted}=Vue;
createApp({
compilerOptions:{delimiters:['[[',']]']},
setup(){
const gameId=ref(GAME_ID);
if(gameId.value === 1) sessionStorage.setItem('gulu_score_3', '0');
const totalScore=ref(parseInt(sessionStorage.getItem('gulu_score_3')||'0', 10));
const timer=ref(0);const score=ref(0);const gameWon=ref(false);const gameLost=ref(false);let iv=null;
const cfgs={
  1:{title:'Multiplicaciones',showScore:false},
  2:{title:'División Exacta',showScore:false},
  3:{title:'Fracciones',showScore:false},
  4:{title:'Sistema Solar',showScore:false},
  5:{title:'Conjugación Verbal',showScore:true,maxScore:5},
  6:{title:'Antónimos',showScore:true,maxScore:5},
  7:{title:'Perímetro',showScore:false},
  8:{title:'Estados de la Materia',showScore:true,maxScore:5},
  9:{title:'Continentes',showScore:false},
  10:{title:'Cadena Alimentaria',showScore:false},
  11:{title:'Secuencia Numérica',showScore:false},
  12:{title:'Clasifica la Palabra',showScore:false},
  13:{title:'Cálculo de Tiempo',showScore:false},
  14:{title:'Sinónimos',showScore:false},
  15:{title:'Multiplicación x10 y x100',showScore:false},
  16:{title:'Ortografía B o V',showScore:false},
  17:{title:'Mayor o Menor',showScore:false},
  18:{title:'Partes de la Planta',showScore:false},
  19:{title:'Puntos Cardinales',showScore:false},
  20:{title:'Doble o Triple',showScore:false}
};
const config=computed(()=>cfgs[gameId.value]||cfgs[1]);
const fmtTime=computed(()=>{const m=Math.floor(timer.value/60),s=timer.value%60;return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;});
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const shuffle=a=>{const r=[...a];for(let i=r.length-1;i>0;i--){const j=rnd(0,i);[r[i],r[j]]=[r[j],r[i]];}return r;};
const shake = () => {};
const win=()=>{clearInterval(iv);totalScore.value++;sessionStorage.setItem('gulu_score_3',totalScore.value.toString());gameWon.value = true;};
const lose=()=>{clearInterval(iv);gameLost.value = true;};

const g1=reactive({a:0,b:0,opts:[]});
const g2=reactive({a:0,b:0,opts:[]});
const g3=reactive({num:0,den:0,opts:[]});
const g4=reactive({planets:['🌑Mercurio','🌍Venus','🌎Tierra','🔴Marte','🟠Júpiter','🪐Saturno','🔵Urano','🌑Neptuno'],shuffled:[],placed:[]});
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
const g11=reactive({a:0,b:0,opts:[],ans:0});
const g12=reactive({word:'',type:'',opts:[]});
const g13=reactive({h1:0,add:0,opts:[],ans:0});
const g14=reactive({word:'',opts:[],ans:''});
const g15=reactive({a:0,b:0,opts:[],ans:0});
const g16=reactive({word:'',opts:[],ans:''});
const g17=reactive({a:0,b:0,opts:[],ans:''});
const g18=reactive({clue:'',emoji:'',opts:[],ans:''});
const g19=reactive({opts:[],ans:''});
const g20=reactive({num:0,type:'',opts:[],ans:0});

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
const iG11=()=>{g11.a=rnd(1,5)*10;g11.b=g11.a+50;g11.ans=g11.b+50;g11.opts=shuffle([g11.ans,g11.ans+10,g11.ans-10,g11.ans+50]);};
const iG12=()=>{const ws=[{w:'Perro',t:'Sustantivo'},{w:'Correr',t:'Verbo'},{w:'Rápido',t:'Adjetivo'},{w:'Mesa',t:'Sustantivo'},{w:'Saltar',t:'Verbo'}];const w=ws[rnd(0,ws.length-1)];g12.word=w.w;g12.type=w.t;};
const iG13=()=>{g13.h1=rnd(1,9);g13.add=rnd(1,3);g13.ans=g13.h1+g13.add;g13.opts=shuffle([g13.ans,g13.ans+1,g13.ans-1,g13.ans+2]);};
const iG14=()=>{const ws=[{w:'Gigante',s:'Enorme'},{w:'Feliz',s:'Alegre'},{w:'Rápido',s:'Veloz'},{w:'Bonito',s:'Hermoso'}];const w=ws[rnd(0,ws.length-1)];g14.word=w.w;g14.ans=w.s;g14.opts=shuffle([w.s,'Pequeño','Lento','Feo']);};
const iG15=()=>{g15.a=rnd(2,9);g15.b=rnd(1,2)===1?10:100;g15.ans=g15.a*g15.b;g15.opts=shuffle([g15.ans,g15.ans+g15.b,g15.ans*2,g15.a*(g15.b===10?100:10)]);};
const iG16=()=>{const ws=[{w:'_aca',ans:'V'},{w:'_urro',ans:'B'},{w:'_arco',ans:'B'},{w:'_iento',ans:'V'}];const w=ws[rnd(0,ws.length-1)];g16.word=w.w;g16.ans=w.ans;};
const iG17=()=>{g17.a=rnd(100,500);g17.b=rnd(100,500);while(g17.a===g17.b)g17.b=rnd(100,500);g17.ans=g17.a>g17.b?'>':'<';};
const iG18=()=>{const ws=[{c:'Raíz',e:'🌱',ans:'Raíz'},{c:'Tallo',e:'🎋',ans:'Tallo'},{c:'Hoja',e:'🍃',ans:'Hoja'},{c:'Flor',e:'🌸',ans:'Flor'}];const w=ws[rnd(0,ws.length-1)];g18.clue=w.c;g18.emoji=w.e;g18.ans=w.ans;g18.opts=shuffle(['Raíz','Tallo','Hoja','Flor']);};
const iG19=()=>{g19.ans='Oeste';g19.opts=shuffle(['Oeste','Arriba','Abajo','Centro']);};
const iG20=()=>{g20.num=rnd(2,10);g20.type=rnd(1,2)===1?'Doble':'Triple';g20.ans=g20.type==='Doble'?g20.num*2:g20.num*3;g20.opts=shuffle([g20.ans,g20.ans+1,g20.ans-1,g20.ans+2]);};
const pG1=(v,e)=>{if(v===g1.a*g1.b)win();else lose();};
const pG2=(v,e)=>{if(v===g2.a/g2.b)win();else lose();};
const pG3=(v,e)=>{if(v===g3.answer)win();else lose();};
const pG4=(planet)=>{const exp=g4.planets[g4.placed.length];if(planet===exp){g4.placed.push(planet);if(g4.placed.length===g4.planets.length)win();}else{g4.placed=[];lose();}};
const pG5=(v,e)=>{
  const cur=g5.data[g5.idx];
  if(v===cur.ans){
    score.value++;
    if(g5.idx===g5.data.length-1)win();
    else g5.idx++;
  }
  else lose();
};
const pG6=(v,e)=>{
  if(v===g6.data[g6.idx].ant){
    score.value++;
    if(g6.idx===g6.data.length-1)win();
    else {
      g6.idx++;
      iG6();
    }
  }
  else lose();
};
const pG7=(v,e)=>{if(v===g7.sides.reduce((a,b)=>a+b,0))win();else lose();};
const pG8=(state,e)=>{
  if(state===g8.items[g8.idx].state){
    score.value++;
    if(g8.idx===g8.items.length-1)win();
    else g8.idx++;
  }
  else lose();
};
const pG9=(v,e)=>{if(v===g9.ans)win();else lose();};
const pG10=(planet)=>{const exp=g10.chain[g10.placed.length];if(planet===exp){g10.placed.push(planet);if(g10.placed.length===4)win();}else{g10.placed=[];lose();}};
const pG11=(v,e)=>{if(v===g11.ans)win();else lose();};
const pG12=(v,e)=>{if(v===g12.type)win();else lose();};
const pG13=(v,e)=>{if(v===g13.ans)win();else lose();};
const pG14=(v,e)=>{if(v===g14.ans)win();else lose();};
const pG15=(v,e)=>{if(v===g15.ans)win();else lose();};
const pG16=(v,e)=>{if(v===g16.ans)win();else lose();};
const pG17=(v,e)=>{if(v===g17.ans)win();else lose();};
const pG18=(v,e)=>{if(v===g18.ans)win();else lose();};
const pG19=(v,e)=>{if(v===g19.ans)win();else lose();};
const pG20=(v,e)=>{if(v===g20.ans)win();else lose();};
onMounted(()=>{
  const inits={1:iG1,2:iG2,3:iG3,4:iG4,5:iG5,6:iG6,7:iG7,8:iG8,9:iG9,10:iG10,11:iG11,12:iG12,13:iG13,14:iG14,15:iG15,16:iG16,17:iG17,18:iG18,19:iG19,20:iG20};
  if(inits[gameId.value])inits[gameId.value]();
  if(gameId.value===10)iG10();
  
  iv=setInterval(()=>timer.value++,1000);
});
return{GIconEngine,gameId,config,fmtTime,score,totalScore,gameWon,gameLost,g1,g2,g3,g4,g5,g6,g7,g8,g9,g10,g11,g12,g13,g14,g15,g16,g17,g18,g19,g20,pG1,pG2,pG3,pG4,pG5,pG6,pG7,pG8,pG9,pG10,pG11,pG12,pG13,pG14,pG15,pG16,pG17,pG18,pG19,pG20};
}}).mount('#game-app');

})();