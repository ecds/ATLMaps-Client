import Model, { attr } from '@ember-data/model';

export default class LayerMetaModel extends Model {
  @attr('string') description;
  @attr('string') intro;
  @attr('string') name;

}
