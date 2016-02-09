export default function(){
    this.transition(
        this.fromRoute(null),
      this.toRoute([
          'projects.project.info',
          'projects.project.vector-layers',
          'projects.project.raster-layers',
          'projects.project.browse-layers',
          'projects.project.base-layers',
          'projects.project.help'
      ]),
      this.use('toLeft')
    //   this.reverse('toRight')
    );
}
