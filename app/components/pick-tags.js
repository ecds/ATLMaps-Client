import Ember from 'ember';
/* globals List */

export default Ember.Component.extend({
    classNames: ['container'],

    actions: {
        initList: function(){
            let options = {
                indexAsync: true,
                valueNames: ['category']
            };

            new List('category-list', options);

        }
    }
//     didInsertElement(){
//         Ember.run.scheduleOnce('afterRender', this, function(){
//         // debugger;
//     });
//     // catch(err){console.log(err);}
// }
});
