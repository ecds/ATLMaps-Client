import Ember from 'ember';

export default Ember.Service.extend({
    init(){
        this._super(...arguments);
        this.set('message', '');
        this.set('type', '');
        this.set('flash', false);
    },

    showMessage(message, type){
        this.setProperties(
            {
                message: message,
                type: type,
                flash: true
            }
        );
        Ember.run.later(this, function(){
            this.setProperties(
                {
                    message: '',
                    type: '',
                    flash: false
                }
            );
        }, 3000);
    }
});
