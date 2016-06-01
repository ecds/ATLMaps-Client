import Ember from 'ember';

/* globals Cookies */

export default Ember.Service.extend({
    init(project_id){
        this._super(...arguments);
        this.set('show', true);
        this.set('noIntroCookie', Cookies.get('noIntro' + project_id));

        if (this.get('noIntroCookie')){
            this.set('show', false);
        }
        // // Check for cookie that user does not want to see intro.
        // if (Cookies.get('noIntro' + project_id)) {
        //     this.sendAction('action', true);
        //     // We need to upldate the local property as it does not get passed
        //     // back in on change
        //
        //     this.setProperties({surpressed: true});
        // }
    },

    setCookie(project_id){
        if (this.get('noIntroCookie')){
            Cookies.remove('noIntro' + project_id);
        }
        else {
            Cookies.set('noIntro' + project_id, true);
        }
        this.toggleProperty('noIntroCookie');
    },

    toggleShow(){
        console.log('oh hello')
        this.toggleProperty('show');
    }


});
