import Ember from 'ember';
/* globals Swiper */

export default Ember.Service.extend({

    init(){
        this._super(...arguments);
        this.set('properties', 'foo');
    },



    viewData(feature, layer) {

        let popupTitle = "<div class='vector-header'>";

        popupTitle += "<h4>" + layer.options.markerDiv + layer.options.title + "</h4>";

        if (feature.properties.name) {
            popupTitle += "<h3>"+feature.properties.name+"</h3>";
        }

        popupTitle += "</div>";

        let popupContent = "<div class='vector-info-container'><div class='vector-body'>";

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
                popupContent += "<div class='swiper-slide' ><a href='"+image.url+"' target='_blank'><img class='geojson' src='"+image.url+"' title='"+image.name+"' /></a>";
                if (image.credit){
                    popupContent += "<span>Photo Credit: "+image.credit+"</span></div>";
                }
                // if (image.title) {
                //     popupContent += "<span>"+image.title+"</span></div>";
                // }
                else {
                    popupContent += "</div>";
                }

                Ember.$('<img />').load( function(){}).attr('src', image.url);

            });
            popupContent += '</div><div class="swiper-pagination swiper-pagination-white"></div><div class="swiper-button-next swiper-button-black"></div><div class="swiper-button-prev swiper-button-black"></div></div>';

        }
        if (feature.properties.description) {
            popupContent += "<div>" + feature.properties.description + "</div>";
        }
        if (feature.properties.NAME) {
            popupContent += "<h2>"+feature.properties.NAME+"</h2>";
        }
        popupContent += "</div></div>";

        layer.on('click', function() {
            Ember.$("div.marker-content").empty();
            Ember.$("div.marker-title").empty();
            let content = Ember.$("<div/>").html(popupContent);
            if (Ember.$('.gallery').length > 0){
                Ember.$('.gallery')[0].swiper.destroy();
            }
            Ember.$("div.vector-info").show();
            Ember.$("div.marker-title").append(popupTitle);
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
                loop: true,
                centeredSlides: true
                // autoHeight: true
            });
        });

    }
});
