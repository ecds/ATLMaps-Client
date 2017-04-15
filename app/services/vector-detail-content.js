import Ember from 'ember';
/* globals Swiper */

const {
    $,
    Service,
    get,
    set
} = Ember;

// TODO this whole thing needs to be an objects and we need to ditch the jQuery inserts.

export default Service.extend({

    init() {
        this._super(...arguments);
        this.set('properties', 'foo');
        set(this, 'title', 'booooo');
        set(this, 'sweiperObj', null);
    },

    removePopup() {
        // console.log('this', this);
        $('div.vector-info').hide();
        $('.marker-content iframe').remove();
        $('.div.marker-content').empty();
        $('.active-marker').removeClass('active-marker');
    },

    viewData(feature, layer) {
        // We have to bind a popup or the polygon and line layers
        // will not show a popup. Inorder to supress Leaflet's pupup
        // we will close it on click below. Pretty hacky.
        layer.bindPopup(feature.properties.type);

        let popupContent = '';

        if (feature.properties.image) {
            popupContent += `<a href='${feature.properties.image.url}' 'target="_blank"><img class="geojson" src='${feature.properties.image.url}' title='${feature.properties.image.name}' /></a>
                <span>Photo Credit: ${feature.properties.image.credit}</span>`;

            // $('<img />').load(() => {}).attr('src', feature.properties.image.url);
        }

        if (feature.properties.gx_media_links) {
            popupContent += '<div class="video"><div class="video-wrapper">';
            popupContent += `<iframe src=//${feature.properties.gx_media_links}?modestbranding=1&rel=0&showinfo=0&theme=light" frameborder="0" allowfullscreen></iframe>`;
            popupContent += '</div></div>';
        }
        if (feature.properties.description) {
            popupContent += feature.properties.description;
        }
        // if (feature.properties.NAME) {
        //     popupContent += "<h2>" + feature.properties.NAME + "</h2>";
        // }
        // popupContent += "</div></div>";

        // TODO: Everything about this is hacky.
        const self = this;
        layer.on('click', () => {
            get(self, 'removePopup');
            const oldSwiper = get(this, 'swiperObj');
            if (oldSwiper) {
                // If you don't remove all the slides, the next
                // gallery will start where the last one left off.
                // For example, a marker has two images and someone
                // closes it while looking at the second image. The next
                // one they open only has one. They will see a blank
                // container, but could swipe right to see the image.
                oldSwiper.removeAllSlides();
                oldSwiper.destroy({
                    deleteInstance: true
                });
                set(this, 'swiperObj', null);
            }
            $('.swiper-wrapper').empty();
            if (feature.properties.images) {
                feature.properties.images.forEach((image) => {
                    $('.swiper-wrapper').append(`<div class="swiper-slide"><img src="${image}"></div>`);
                    // $('<img />').load(() => {}).attr('src', image.url);
                });

                // if (feature.properties.images.length > 1) {
                const newSwiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    nextButton: '.swiper-button-next',
                    prevButton: '.swiper-button-prev',
                    slidesPerView: 1,
                    paginationClickable: true,
                    centeredSlides: true,
                    zoom: true
                });
                set(this, 'swiperObj', newSwiper);
                // }
            }
            // Close leaflet's default popup.
            layer.closePopup();
            // let content = $('<div/>').html(popupContent);
            $('div.vector-info').show();
            $('.vector-content.layer-icon').empty().append(layer.options.markerDiv);
            $('.vector-detail-title-container .layer-title').empty().append(layer.options.title);
            $('.vector-detail-title-container .feature-title').empty().append(feature.properties.name).append(feature.properties.NAME);
            // $('.vector-content.title').empty().append(feature.properties.NAME);
            $('.vector-content.marker-content').empty().append(popupContent);
            // $('.dump').empty().append(JSON.stringify(feature.properties, null, '\t'));
            $('.active-marker').removeClass('active-marker');
            $(this._icon).addClass('active-marker');
        });
    }
});
