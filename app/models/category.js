import Model, { attr, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { filterBy, sort } from '@ember/object/computed';

export default class CategoryModel extends Model {
  @attr('string') name;
  @attr('string') slug;
  @hasMany('tag') tags;

  @computed('tags', 'checkedTags')
  get allChecked() {
    return this.checkedTags.length > 0;
  }

  @filterBy('tags', 'checked', true) checkedTags;
  // @attr('boolean', {
  //   defaultValue: function() {
  //     return false;
  //   }
  // }) allChecked;
}
