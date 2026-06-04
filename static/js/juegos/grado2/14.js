(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.meses=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];const idx=utils.rnd(0,10);g.m1=g.meses[idx];g.ans=g.meses[idx+1];let wr=g.meses.filter(m=>m!==g.ans && m!==g.m1);g.opts=utils.shuffle([g.ans,wr[0],wr[1]]);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else utils.shake(e.target);
    }
  };
})();