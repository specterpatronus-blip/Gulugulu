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
  10:{title:'Tablas ×2, ×5, ×10',showScore:false}
};
const config=computed(()=>cfgs[gameId.value]||cfgs[1]);
const fmtTime=computed(()=>{
  const m=Math.floor(timer.value/60),s=timer.value%60;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
});
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const shuffle=a=>{const r=[...a];for(let i=r.length-1;i>0;i--){const j=rnd(0,i);[r[i],r[j]]=[r[j],r[i]];}return r;};
const shake=el=>gsap.fromTo(el,{x:-10},{x:10,duration:.1,yoyo:true,repeat:3,onComplete:()=>gsap.set(el,{x:0})});
const win=()=>{
  clearInterval(iv);
  confetti({particleCount:150,spread:80,origin:{y:.6}});
  setTimeout(()=>{
    gameWon.value=true;
    Vue.nextTick(()=>gsap.fromTo('#vm',{scale:.5,opacity:0,y:50},{scale:1,opacity:1,y:0,duration:.6,ease:'back.out(1.2)'}));
  },500);
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

const iG1=()=>{
  g1.num=rnd(2,15);
  const isDouble=Math.random()>.5;
  const ans=isDouble?g1.num*2:Math.floor(g1.num/2);
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

const pG1=(v,e)=>{if(v===g1ans.value)win();else shake(e.target);};
const pG2=(isSyn,e)=>{
  const cur=g2.data[g2.idx];
  if(isSyn===cur.s){score.value++;g2.idx++;if(g2.idx===5)win();else gsap.fromTo('.pair-card',{opacity:0,y:20},{opacity:1,y:0,duration:.3});}
  else shake(e.target);
};
const pG3=(v,e)=>{if(v===g3.a+g3.b)win();else shake(e.target);};
const pG4=(zone,e)=>{
  const cur=g4.animals[g4.idx];
  if(zone===cur.h){
    score.value++;g4.idx++;
    if(g4.idx===4)win();
    else gsap.fromTo('.animal-card',{scale:.5,opacity:0},{scale:1,opacity:1,duration:.4,ease:'back.out(1.5)'});
  }else shake(e.target);
};
const pG5=(v,e)=>{if(v===g5.answer)win();else shake(e.target);};
const pG6=(type,e)=>{
  const cur=g6.words[g6.idx];
  if(type===cur.t){score.value++;g6.idx++;if(g6.idx===5)win();else gsap.fromTo('.word-card',{scale:.8,opacity:0},{scale:1,opacity:1,duration:.4});}
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

onMounted(()=>{
  const inits={1:iG1,3:iG3,5:iG5,7:iG7,8:iG8,9:iG9,10:iG10};
  if(inits[gameId.value])inits[gameId.value]();
  gsap.fromTo('#canvas-area',{opacity:0,y:30},{opacity:1,y:0,duration:.8});
  iv=setInterval(()=>timer.value++,1000);
});

return{gameId,config,fmtTime,score,gameWon,
  g1,g1ans,g2,g3,g4,g5,g6,g7,g8,g9,g10,
  pG1,pG2,pG3,pG4,pG5,pG6,pG7,pG8,pG9,pG10};
}
}).mount('#game-app');
