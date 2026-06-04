const {createApp,ref,computed,reactive,onMounted}=Vue;
createApp({
compilerOptions:{delimiters:['[[',']]']},
setup(){
const gameId=ref(GAME_ID);
const timer=ref(0);
const score=ref(0);
const gameWon=ref(false);
let iv=null;
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
const fmtTime=computed(()=>{
  const m=Math.floor(timer.value/60),s=timer.value%60;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
});
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const shuffle=a=>{const r=[...a];for(let i=r.length-1;i>0;i--){const j=rnd(0,i);[r[i],r[j]]=[r[j],r[i]];}return r;};
const shake = () => {};
const win=()=>{
  clearInterval(iv);
  gameWon.value = true;
};

const g1=reactive({num:0,label:'',opts:[]});
const g1ans=ref(0);
const g2=reactive({idx:0,data:[
  {w1:'alegre',w2:'feliz',s:true},{w1:'rápido',w2:'lento',s:false},
  {w1:'grande',w2:'enorme',s:true},{w1:'frío',w2:'caliente',s:false},
  {w1:'bonito',w2:'hermoso',s:true}
]});
const g3=reactive({a:0,b:0,opts:[]});
const g4=reactive({idx:0,animals:[
  {n:'Tiburón',e:'🦈',h:'Mar'},{n:'Búho',e:'🦉',h:'Bosque'},
  {n:'Camello',e:'🐪',h:'Desierto'},{n:'Oso Polar',e:'🐻‍❄️',h:'Ártico'}
],zones:['Mar','Bosque','Desierto','Ártico']});
const g5=reactive({h:0,m:0,opts:[],answer:''});
const g6=reactive({idx:0,words:[
  {w:'perro',t:'Sustantivo',e:'🐕'},{w:'corre',t:'Verbo',e:'🏃'},
  {w:'azul',t:'Adjetivo',e:'🔵'},{w:'niña',t:'Sustantivo',e:'👧'},
  {w:'salta',t:'Verbo',e:'🦘'}
],opts:['Sustantivo','Verbo','Adjetivo']});
const g7=reactive({stages:['🌱 Semilla','🌿 Brote','🌸 Flor','🍎 Fruto'],shuffled:[],placed:[]});
const g8=reactive({h:0,t:0,u:0,q:'',ans:0,opts:[]});
const g9=reactive({parts:[],answer:'',opts:[]});
const g10=reactive({a:0,mult:0,opts:[]});
const g11=reactive({a:0,b:0,opts:[],ans:0});
const g12=reactive({a:0,b:0,opts:[],ans:0});
const g13=reactive({a:0,b:0,ans:''});
const g14=reactive({m1:'',opts:[],ans:''});
const g15=reactive({emoji:'',opts:[],ans:''});
const g16=reactive({coins:0,opts:[],ans:0});
const g17=reactive({emoji:'',word:'',opts:[],ans:''});
const g18=reactive({num:0,opts:[],ans:0});
const g19=reactive({a:0,b:0,ans:0,sign:''});
const g20=reactive({opts:[],ans:''});

const iG1=()=>{
  const isDouble=Math.random()>.5;
  if(isDouble){
    g1.num=rnd(2,15);
  }else{
    g1.num=rnd(1,7)*2;
  }
  const ans=isDouble?g1.num*2:g1.num/2;
  g1ans.value=ans;
  g1.label=isDouble?`el DOBLE de ${g1.num}`:`la MITAD de ${g1.num}`;
  const d=[ans,ans+1,ans+2];
  if(ans-1>=1)d.push(ans-1);else d.push(ans+3);
  g1.opts=shuffle(d);
};
const iG3=()=>{
  g3.a=rnd(15,49);g3.b=rnd(15,49);
  const ans=g3.a+g3.b;
  g3.opts=shuffle([ans,ans+1,ans+10,Math.max(1,ans-1)]);
};
const iG5=()=>{
  g5.h=rnd(1,12);g5.m=[0,15,30,45][rnd(0,3)];
  const fmt=(h,m)=>`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  const ans=fmt(g5.h,g5.m);
  g5.answer=ans;
  const nh=g5.h===12?1:g5.h+1;
  const ph=g5.h===1?12:g5.h-1;
  const nm=g5.m===45?0:g5.m+15;
  g5.opts=shuffle([ans,fmt(nh,g5.m),fmt(ph,g5.m),fmt(g5.h,nm)]);
};
const iG7=()=>{g7.shuffled=shuffle([...g7.stages]);g7.placed=[];};
const iG8=()=>{
  g8.h=rnd(1,5);g8.t=rnd(1,9);g8.u=rnd(1,9);
  const r=Math.random();
  if(r<.33){g8.q='centenas';g8.ans=g8.h;}
  else if(r<.66){g8.q='decenas';g8.ans=g8.t;}
  else{g8.q='unidades';g8.ans=g8.u;}
  g8.opts=shuffle([g8.ans,g8.ans+1,Math.max(1,g8.ans-1),g8.ans+2]);
};
const iG9=()=>{
  const ws=[
    {parts:['ca','_','po'],answer:'m',opts:['m','n','p']},
    {parts:['ta','_','bor'],answer:'m',opts:['m','n','b']},
    {parts:['so','_','bra'],answer:'m',opts:['m','n','b']},
    {parts:['ba','_','co'],answer:'n',opts:['n','m','b']},
    {parts:['que','_','o'],answer:'s',opts:['s','c','z']}
  ];
  const w=ws[rnd(0,ws.length-1)];
  g9.parts=[...w.parts];g9.answer=w.answer;g9.opts=shuffle([...w.opts]);
};
const iG10=()=>{
  g10.mult=[2,5,10][rnd(0,2)];
  g10.a=rnd(1,10);
  const ans=g10.a*g10.mult;
  g10.opts=shuffle([ans,ans+g10.mult,Math.max(1,ans-g10.mult),ans+1]);
};
const iG11=()=>{
  g11.a=rnd(20,50); g11.b=rnd(10,40);
  g11.ans=g11.a+g11.b;
  g11.opts=shuffle([g11.ans, g11.ans+10, g11.ans-10, g11.ans+1]);
};
const iG12=()=>{
  g12.a=rnd(30,80); g12.b=rnd(10,29);
  g12.ans=g12.a-g12.b;
  g12.opts=shuffle([g12.ans, g12.ans+5, Math.max(1,g12.ans-5), g12.ans+10]);
};
const iG13=()=>{
  g13.a=rnd(20,99); g13.b=rnd(20,99);
  if(g13.a===g13.b) g13.b++;
  g13.ans=g13.a>g13.b?'>':'<';
  if(Math.random()<0.1) { g13.b=g13.a; g13.ans='='; }
};
const iG14=()=>{
  const meses=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const idx=rnd(0,10);
  g14.m1=meses[idx]; g14.ans=meses[idx+1];
  let wr=meses.filter(m=>m!==g14.ans && m!==g14.m1);
  g14.opts=shuffle([g14.ans, wr[0], wr[1]]);
};
const iG15=()=>{
  const figs=[{e:'🧊',n:'Cubo'},{e:'🌍',n:'Esfera'},{e:'⛺',n:'Pirámide'},{e:'🥤',n:'Cilindro'}];
  const f=figs[rnd(0,3)];
  g15.emoji=f.e; g15.ans=f.n;
  g15.opts=shuffle(figs.map(x=>x.n));
};
const iG16=()=>{
  g16.coins=rnd(3,8);
  g16.ans=g16.coins*10;
  g16.opts=shuffle([g16.ans, g16.ans+10, Math.max(10,g16.ans-10), g16.ans+20]);
};
const iG17=()=>{
  const wds=[
    {e:'🏠',w:'CA _ A',o:['SA','TA','PA'],a:'SA'},
    {e:'🍅',w:'TO _ TE',o:['MA','ME','MI'],a:'MA'},
    {e:'👕',w:'CA _ SA',o:['MI','MU','ME'],a:'MI'},
    {e:'🍌',w:'PLÁ _ NO',o:['TA','TE','TI'],a:'TA'}
  ];
  const w=wds[rnd(0,wds.length-1)];
  g17.emoji=w.e; g17.word=w.w; g17.opts=shuffle(w.o); g17.ans=w.a;
};
const iG18=()=>{
  g18.num=rnd(2,10); g18.ans=g18.num*3;
  g18.opts=shuffle([g18.ans, g18.num*2, g18.num*4, g18.ans+3]);
};
const iG19=()=>{
  g19.a=rnd(10,40); g19.b=rnd(5,20);
  if(Math.random()>.5) { g19.ans=g19.a+g19.b; g19.sign='+'; }
  else { g19.ans=g19.a-g19.b; g19.sign='-'; }
};
const iG20=()=>{
  const words=['Arbol','Barco','Cielo','Dedo','Elefante','Fuego','Gato'];
  const w1=words[rnd(0,words.length-1)];
  let w2=words[rnd(0,words.length-1)];
  while(w1===w2) w2=words[rnd(0,words.length-1)];
  g20.opts=shuffle([w1,w2]);
  g20.ans=w1.localeCompare(w2)<0?w1:w2;
};

const pG1=(v,e)=>{if(v===g1ans.value)win();else shake(e.target);};
const pG2=(isSyn,e)=>{
  const cur=g2.data[g2.idx];
  if(isSyn===cur.s){
    score.value++;
    if(g2.idx===g2.data.length-1)win();
    else g2.idx++;
  }
  else shake(e.target);
};
const pG3=(v,e)=>{if(v===g3.a+g3.b)win();else shake(e.target);};
const pG4=(zone,e)=>{
  const cur=g4.animals[g4.idx];
  if(zone===cur.h){
    score.value++;
    if(g4.idx===g4.animals.length-1)win();
    else g4.idx++;
  }else shake(e.target);
};
const pG5=(v,e)=>{if(v===g5.answer)win();else shake(e.target);};
const pG6=(type,e)=>{
  const cur=g6.words[g6.idx];
  if(type===cur.t){
    score.value++;
    if(g6.idx===g6.words.length-1)win();
    else g6.idx++;
  }
  else shake(e.target);
};
const pG7=(stage)=>{
  const expected=g7.stages[g7.placed.length];
  if(stage===expected){
    g7.placed.push(stage);
    if(g7.placed.length===4)win();
  }else{
    g7.placed=[];
    shake(document.querySelector('.cycle-board'));
  }
};
const pG8=(v,e)=>{if(v===g8.ans)win();else shake(e.target);};
const pG9=(letter,e)=>{if(letter===g9.answer)win();else shake(e.target);};
const pG10=(v,e)=>{if(v===g10.a*g10.mult)win();else shake(e.target);};
const pG11=(v,e)=>{if(v===g11.ans)win();else shake(e.target);};
const pG12=(v,e)=>{if(v===g12.ans)win();else shake(e.target);};
const pG13=(v,e)=>{if(v===g13.ans)win();else shake(e.target);};
const pG14=(v,e)=>{if(v===g14.ans)win();else shake(e.target);};
const pG15=(v,e)=>{if(v===g15.ans)win();else shake(e.target);};
const pG16=(v,e)=>{if(v===g16.ans)win();else shake(e.target);};
const pG17=(v,e)=>{if(v===g17.ans)win();else shake(e.target);};
const pG18=(v,e)=>{if(v===g18.ans)win();else shake(e.target);};
const pG19=(v,e)=>{if(v===g19.sign)win();else shake(e.target);};
const pG20=(v,e)=>{if(v===g20.ans)win();else shake(e.target);};

onMounted(()=>{
  const inits={1:iG1,3:iG3,5:iG5,7:iG7,8:iG8,9:iG9,10:iG10,11:iG11,12:iG12,13:iG13,14:iG14,15:iG15,16:iG16,17:iG17,18:iG18,19:iG19,20:iG20};
  if(inits[gameId.value])inits[gameId.value]();
  
  iv=setInterval(()=>timer.value++,1000);
});

return{gameId,config,fmtTime,score,gameWon,GIconEngine,
  g1,g1ans,g2,g3,g4,g5,g6,g7,g8,g9,g10,g11,g12,g13,g14,g15,g16,g17,g18,g19,g20,
  pG1,pG2,pG3,pG4,pG5,pG6,pG7,pG8,pG9,pG10,pG11,pG12,pG13,pG14,pG15,pG16,pG17,pG18,pG19,pG20};
}
}).mount('#game-app');
