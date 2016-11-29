import Ember from 'ember';

const {
    Service,
    set
} = Ember;

// TODO this whole thing needs to be an objects and we need to ditch the jQuery inserts.

export default Service.extend({

    init() {
        this._super(...arguments);
        this.set('properties', 'foo');
        set(this, 'title', 'booooo');

    },

    viewData(feature, layer) {
        let popupContent = '';

        if (feature.properties.image) {
            popupContent += '<a href="' + feature.properties.image.url + '" target="_blank"><img class="geojson" src="' + feature.properties.image.url + '" title="' + feature.properties.image.name + '" /></a>"' +
                '<span>Photo Credit: ' + feature.properties.image.credit + '</span>';

            // Ember.$('<img />').load(function() {}).attr('src', feature.properties.image.url);
        }

        if (feature.properties.gx_media_links) {
            popupContent += '<div class="embed-container">';
            popupContent += '<iframe src="//' + feature.properties.gx_media_links + '?modestbranding=1&rel=0&showinfo=0&theme=light" frameborder="0" allowfullscreen></iframe>';
            popupContent += '</div>';
        }
        if (feature.properties.images) {
            popupContent += '<div class="carousel carousel-slider" data-indicators="true">';
            feature.properties.images.forEach(function(image) {

                popupContent += `<a class="carousel-item" href="javascript:void(0)"><img src="${image.url}"></a>`;
                // if (image.credit) {
                //     popupContent += '<span>Photo Credit: ' + image.credit + '</span></div>';
                // } else {
                //     popupContent += '</div>';
                // }

                Ember.$('<img />').load(function() {}).attr('src', image.url);

            });
            // popupContent += '</div><div class="swiper-pagination swiper-pagination-white"></div><div class="swiper-button-next swiper-button-black"></div><div class="swiper-button-prev swiper-button-black"></div></div>';
            popupContent += '</div>'
        }
        if (feature.properties.description) {
            popupContent += feature.properties.description;
        }
        // if (feature.properties.NAME) {
        //     popupContent += "<h2>" + feature.properties.NAME + "</h2>";
        // }
        // popupContent += "</div></div>";

        layer.on('click', function() {
            Ember.$('.vector-content').empty();
            // Ember.$("div.marker-title").empty();
            // let content = Ember.$("<div/>").html(popupContent);
            // if (Ember.$('.gallery').length > 0) {
            //     Ember.$('.gallery')[0].swiper.destroy();
            // }
            Ember.$('div.vector-info').show();
            Ember.$('.vector-content.layer-icon').append(layer.options.markerDiv);
            Ember.$('.vector-content.layer-title').append(layer.options.title);
            Ember.$('.vector-content.title').append(feature.properties.name);
            Ember.$('.vector-content.marker-content').append(popupContent);
            Ember.$('.active-marker').removeClass('active-marker');
            Ember.$(this._icon).addClass('active-marker');
            // new Swiper('.gallery', {
            //     pagination: '.swiper-pagination',
            //     nextButton: '.swiper-button-next',
            //     prevButton: '.swiper-button-prev',
            //     slidesPerView: 1,
            //     paginationClickable: true,
            //     spaceBetween: 30,
            //     loop: true,
            //     centeredSlides: true
            //         // autoHeight: true
            // });
        });

    }
});
