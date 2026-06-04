(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const ns=[10,5,2,10,8,1,10,4,10,7,3,10];const mix=utils.shuffle(ns).slice(0,12);let tc=mix.filter(x=>x===10).length;while(tc<5){for(let i=0;i<mix.length;i++)if(mix[i]!==10){mix[i]=10;tc++;break;}}g.bubbles=mix.map((n,i)=>({id:i,num:n,popped:false,delay:`${Math.random()*2}s`,isTen:n===10}));
    },
    play: (v, e, g, utils, win, score) => {
      if(v.popped)return;if(v.isTen){v.popped=true;score.value++;if(score.value===5)win();}else utils.shake(e.target);
    }
  };
})();