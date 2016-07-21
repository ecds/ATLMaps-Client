import Ember from 'ember';

export function hasResults(model) {
    // console.log(model[0])
  if (model[0].get('raster_layer_ids.length') + model[0].get('vector_layer_ids.length') > 0){
      return true;
  } else {
      return false;
  }
}

export default Ember.Helper.helper(hasResults);