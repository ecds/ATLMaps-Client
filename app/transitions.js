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
    this.use('crossFade'),
    this.reverse('crossFade')
  );
  this.transition(
      this.hasClass('catagory'),
      this.toValue(true),
      this.use('crossFade'),
      this.reverse('crossFade')
  );
  // this.transition(
  //     this.childOf('.browse-results'),
  //     this.fromValue(false),
  //     this.toValue(true),
  //     this.use('crossFade'),
  //     this.reverse('toDown', {duration: 5000}),
  //     this.debug()
  // );
}
