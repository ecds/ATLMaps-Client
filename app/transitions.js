export default function(){

  this.transition(
    this.toRoute([
        'project.vector-layers',
        'project.info',
        'project.raster-layers',
        'project.browse-layers',
        'project.base-layers',
        'project.help'
    ]),
    this.use('crossFade')
  );
  this.transition(
  this.hasClass('vehicles'),

  // this makes our rule apply when the liquid-if transitions to the
  // true state.
  this.toValue(true),
  this.use('crossFade'),

  // which means we can also apply a reverse rule for transitions to
  // the false state.
  this.reverse('toLeft')
);
}
