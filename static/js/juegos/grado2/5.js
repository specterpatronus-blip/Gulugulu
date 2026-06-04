(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.h=utils.rnd(1,12);g.m=[0,15,30,45][utils.rnd(0,3)];const fmt=(h,m)=>`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;const ans=fmt(g.h,g.m);g.ans=ans;const nh=g.h===12?1:g.h+1,ph=g.h===1?12:g.h-1,nm=g.m===45?0:g.m+15;g.opts=utils.shuffle([ans,fmt(nh,g.m),fmt(ph,g.m),fmt(g.h,nm)]);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else utils.shake(e.target);
    }
  };
})();