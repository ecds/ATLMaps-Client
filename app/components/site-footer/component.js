import Component from '@glimmer/component';
import { A } from '@ember/array';

export default class SiteFooterComponent extends Component {
  partners = A([
    {
      name: 'Knight Foundation',
      link: 'https://knightfoundation.org/',
      image: '/assets/images/KF_logo-stacked.png'
    },
    {
      name: 'Emory Center for Digital Scholarship',
      link: 'https://ecds.emory.edu',
      image: '/assets/images/emory-logo-m.png'
    },
    {
      name: 'Georgia State University',
      link: 'https://gsu.edu',
      image: '/assets/images/GSULogo-Black.png'
    }
  ])
}
