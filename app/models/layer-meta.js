import Model, { attr } from '@ember-data/model';

export default class LayerMetaModel extends Model {
  @attr('string') description;
  @attr('string') name;
  @attr('string') title;

}
