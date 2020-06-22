import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import UIkit from 'uikit';

export default class MapUiSearchPanelComponent extends Component {

  @service store;
  @service searchResults;
  @service searchParameters;
  @service dataColors;
  project = this.args.model.project;

  @tracked searchToText = null;




}
