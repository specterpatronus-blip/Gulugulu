(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const vs=['A','E','I','O','U'];
      const cs=['B','C','D','F','G','P','M','L','S','T'];
      const selectedCs = utils.shuffle(cs).slice(0, 7);
      const mix = utils.shuffle([...vs, ...selectedCs]);
      g.bubbles=mix.map((c,i)=>({id:i,letter:c,popped:false,delay:`${Math.random()*2}s`,isVowel:vs.includes(c)}));
    },
    play: (v, e, g, utils, win, score) => {
      if(v.popped)return;if(v.isVowel){v.popped=true;score.value++;if(score.value===5)win();}else utils.shake(e.target);
    }
  };
})();