// Random JavaScript

$(document).ready(function(){
  $.material.ripples(".btn, .navbar a");
  $.material.input();
  // (function(){
  //   // init on shuffle items 
  //   shuffle.init();
  //   // init menu
  // })();
  
  
  // document events
  $(document).on('click','#hide-layer-options',function(){
    $(".layer-controls").animate({"left":"-100%"},500,"easeInQuint",function(){
      $("#show-layer-options").fadeIn(500);
    });
  })
  .on('click','#show-layer-options',function(){
    $(".layer-controls").animate({"left":"0%"},500,"easeOutQuint");
    $("#show-layer-options").fadeOut(500);
  })
  .on('click','.shuffle-items li.item',function(evt){
    var $target = $(evt.target),
        $target_slider = $target.parents('.slider');
    
    if( $target_slider.length>0 ){
      return false;
    }
    // if ($(this).hasClass('info') === false){
    //   $(".shuffle-items li.item.info").remove();
    //   $(".active_marker").removeClass("active_marker");
    // }
    // shuffle.click(this);
  })
  .on('slide','.shuffle-items li.item .slider',function(evt){
    var $this = $(this);
    $this.siblings('input').val($this.val()).change();
    
  })
  .on('mouseup','.togglebutton.opacity label',function(){

    $( "span.toggle_label" ).toggleClass( "off" );

    var active = $(".togglebutton label input[type=checkbox]:first-child:checked").length>0;
    
    if (active){
      $('.value-input, .slider').val(0).change();
    }
    else{
      $('.value-input, .slider').val(10).change();
    }
  });
  
  //var options = {
  //  valueNames: [ 'name', 'description' ],
  //  indexAsync: true
  //};
  //
  //var layerList = new List('searchableLayers', options);
  
});

//var map = '';