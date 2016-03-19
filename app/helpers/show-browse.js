import Ember from 'ember';

export function showBrowse(params) {
    if (params[0] === true || params[0] === true){
        return true;
    }
    else {
        return false;
    }
}

export default Ember.Helper.helper(showBrowse);
