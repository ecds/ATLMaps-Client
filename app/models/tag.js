import Model, { attr, belongsTo} from '@ember-data/model';

export default class TagModel extends Model {
  @attr('string') name;
  @attr('string') slug;
  @belongsTo('category') category;
  @attr('boolean') checked;
}
