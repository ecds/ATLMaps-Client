import Model, { attr, hasMany } from '@ember-data/model';

export default class UserModel extends Model {
  @attr('string') displayname;
  @hasMany('projects') projects;
}
