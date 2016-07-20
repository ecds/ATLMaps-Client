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
  //     this.hasClass('.browse-nav'),
  //   //   this.includingInitialRender(),
  //     this.fromValue(true),
  //
  //     this.use('explode', {
  //         pickOld: 'div',
  //         use:['toRight', {duration: 5000}]
  //     },{
  //         pickNew: 'div',
  //         use: ['toLeft', 'toDown', {duration: 5000}]
  //     }),
  //     this.debug()
  // );
}
