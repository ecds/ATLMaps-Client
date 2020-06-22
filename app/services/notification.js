import Service from '@ember/service';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';


export default class NotificationService extends Service {
  @tracked note = null;
  @tracked noteClass = 'success';

  @task
  *setNote(options) {
    this.note = options.note;
    this.noteClass = options.type || this.noteClass;
    options.type = this.noteClass;
    yield timeout(3000);
    this.noteClass = `${options.type} uk-animation-reverse`;
    yield timeout(1000);
    this.note = null;
    this.noteClass = options.type;
  }
}
