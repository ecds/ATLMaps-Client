import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
    model() {
        return this.store.query('project', { featured: true });
    }

//     didTransition() {
//         console.log('foo');
//     $('.content').click(function(e) {
//     if(!$(e.target).hasClass('user-menu') )
//     {
//     console.log('self', self);
//     set(self, 'showUserMenu', false);
//     }
//     });
// }
});
