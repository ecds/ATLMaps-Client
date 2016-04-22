import Ember from 'ember';
/* globals Swiper */

export default Ember.Service.extend({

    init(){
        this._super(...arguments);
        this.set('properties', 'foo');
    },



    viewData(feature, layer) {
        var popupContent = "";
        if (feature.properties.name) {
            popupContent += "<h2>"+feature.properties.name+"</h2>";
        }
        if (feature.properties.image) {
            popupContent += "<a href='"+feature.properties.image.url+"' target='_blank'><img class='geojson' src='"+feature.properties.image.url+"' title='"+feature.properties.image.name+"' /></a>"+
            "<span>Photo Credit: "+feature.properties.image.credit+"</span>";

            Ember.$('<img />').load( function(){}).attr('src', feature.properties.image.url);
        }
        if (feature.properties.gx_media_links) {
            popupContent += '<iframe width="100%" height="250" src="//' + feature.properties.gx_media_links + '?modestbranding=1&rel=0&showinfo=0&theme=light" frameborder="0" allowfullscreen></iframe>';
        }
        if (feature.properties.images) {
            popupContent += "<div class='gallery'><div class='swiper-wrapper'>";
            feature.properties.images.forEach(function(image){
                popupContent += "<div class='swiper-slide' ><a href='"+image.url+"' target='_blank'><img class='geojson' src='"+image.url+"' title='"+image.name+"' /></a>"+
                "<span>Photo Credit: "+image.credit+"</span></div>";

                Ember.$('<img />').load( function(){}).attr('src', image.url);

            });
            popupContent += '</div><div class="swiper-pagination"></div><div class="swiper-button-next swiper-button-white"></div><div class="swiper-button-prev swiper-button-white"></div></div>';

        }
        if (feature.properties.description) {
            popupContent += "<p>" + feature.properties.description + "</p>";
        }
        if (feature.properties.NAME) {
            popupContent += "<h2>"+feature.properties.NAME+"</h2>";
        }

        layer.on('click', function() {

            Ember.$("div.marker-content").empty();
            let content = Ember.$("<article/>").html(popupContent);
            if (Ember.$('.gallery').length > 0){
                Ember.$('.gallery')[0].swiper.destroy();
            }
            Ember.$("div.marker-data").show();
            Ember.$('div.marker-content').append(content);
            Ember.$(".active_marker").removeClass("active_marker");
            Ember.$(this._icon).addClass('active_marker');
            new Swiper ('.gallery', {
                pagination: '.swiper-pagination',
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                slidesPerView: 1,
                paginationClickable: true,
                spaceBetween: 30,
                loop: true
            });
        });

    }
});
