import Ember from 'ember';

const {
    $,
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
        // We have to bind a popup or the polygon and line layers
        // will not show a popup. Inorder to supress Leaflet's pupup
        // we will close it on click below. Pretty hacky.
        layer.bindPopup(feature.properties.type);

        let popupContent = '';

        if (feature.properties.image) {
            popupContent += `<a href='${feature.properties.image.url}' 'target="_blank"><img class="geojson" src='${feature.properties.image.url} title='${feature.properties.image.name}' /></a>
                <span>Photo Credit: ${feature.properties.image.credit}</span>`;

            // Ember.$('<img />').load(function() {}).attr('src', feature.properties.image.url);
        }

        if (feature.properties.gx_media_links) {
            popupContent += '<div class="embed-container">';
            popupContent += `<iframe src=//${feature.properties.gx_media_links}?modestbranding=1&rel=0&showinfo=0&theme=light" frameborder="0" allowfullscreen></iframe>`;
            popupContent += '</div>';
        }
        if (feature.properties.images) {
            popupContent += '<div class="carousel carousel-slider" data-indicators="true">';
            feature.properties.images.forEach((image) => {
                popupContent += `<a class="carousel-item" href="javascript:void(0)"><img src="${image.url}"></a>`;
                $('<img />').load(() => {}).attr('src', image.url);
            });
            popupContent += '</div>';
        }
        if (feature.properties.description) {
            popupContent += feature.properties.description;
        }
        // if (feature.properties.NAME) {
        //     popupContent += "<h2>" + feature.properties.NAME + "</h2>";
        // }
        // popupContent += "</div></div>";

        // TODO: Everything about this is hacky.
        layer.on('click', () => {
            // Close leaflet's default popup.
            layer.closePopup();
            $('.vector-content').empty();
            // Ember.$("div.marker-title").empty();
            // let content = Ember.$("<div/>").html(popupContent);
            // if (Ember.$('.gallery').length > 0) {
            //     Ember.$('.gallery')[0].swiper.destroy();
            // }
            $('div.vector-info').show();
            $('.vector-content.layer-icon').append(layer.options.markerDiv);
            $('.vector-content.layer-title').append(layer.options.title);
            $('.vector-content.title').append(feature.properties.name);
            $('.vector-content.title').append(feature.properties.NAME);
            $('.vector-content.marker-content').append(popupContent);
            $('.active-marker').removeClass('active-marker');
            $(this._icon).addClass('active-marker');
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
