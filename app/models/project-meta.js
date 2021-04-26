import Model, { attr } from '@ember-data/model';

export default class ProjectMetaModel extends Model {
  @attr('string') description;
  @attr('string') intro;
  @attr('string') name;
  @attr('string') photo;

}
