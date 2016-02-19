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
      this.fromValue(false),
      this.toValue(true),
      this.use('toDown'),
      this.reverse('toUp')
  );
}
