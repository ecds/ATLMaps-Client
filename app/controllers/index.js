import Controller from '@ember/controller';
import { A } from '@ember/array';

export default class IndexController extends Controller {
  title = 'The Stories of Our City';
  tagLine = 'Visualizing the histories of Atlanta and connections within the city.';
  activities = A([
    {
      title: 'search',
      copy: 'from thousands of historical maps and data layers',
      icon: 'search'
    },
    {
      title: 'stack',
      copy: 'layers to see connections and build a meaningful story',
      icon: 'layer-group'
    },
    {
      title: 'save',
      copy: 'your story in your ATLMaps account',
      icon: 'save'
    },
    {
      title: 'share',
      copy: 'your story with your classrooms, colleagues, and community',
      icon: 'share-alt'
    }
  ]);
}
