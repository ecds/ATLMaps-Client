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
}
