import Component from '@glimmer/component';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';

export default class AboutPageComponent extends Component {
  @service baseMaps;

  team = A([
    {
      name: 'Brennan Collins',
      role: 'Senior Academic Professional',
      institution: 'Georgia State University',
      photo: '/assets/images/bios/BrennanCollins.png',
      bio: 'Brennan is the Associate Director of Writing Across the Curriculum and the Center for Excellence in Teaching and Learning at Georgia State University. The interdisciplinary nature and technology focus of these programs allows him to work with a diverse faculty in exploring inventive pedagogies. He is particularly interested in creating interinstitutional Atlanta projects and platforms to develop student critical thinking and opportunities for community engagement.'
    },
    {
      name: 'Megan Slemons',
      role: 'GIS Librarian',
      institution: 'Emory Center for Digital Scholarship',
      photo: '/assets/images/bios/new-megan.png',
      bio: 'Megan is the GIS Librarian at the Emory Center for Digital Scholarship at Emory University. She works with students and faculty to incorporate geospatial technologies into their research and teaching. She offers consultations on using geospatial tools, finding and using data, and designing projects with spatial components. Megan also teaches workshops, provides classroom instruction, works to develop and provide access to the libraries\' geospatial data and map collections, and contributes to digital projects.'
    },
    {
      name: 'Jay Varner',
      role: 'Lead Software Engineer',
      institution: 'Emory Center for Digital Scholarship',
      photo: '/assets/images/bios/jay.jpg',
      bio: 'Jay is the lead software engineer at the Emory Center for Digital Scholarship at Emory University. In the center, Jay works with scholars and researchers to develop new ways to interact with data and information. He has been developing web apps for universities, start-ups, non-profits, and public defenders since 1998. Jay holds a master\'s in user experience design from Kent State University.'
    }
  ]);

  pastTeam = A([
    {
      name: 'Kevin Glover',
      about: 'Software Engineer at MailChimp'
    },
    {
      name: 'Tim Hawthorne',
      about: 'Assistant professor of geographic information systems (GIS) in the department of sociology at the University of Central Florida'
    },
    {
      name: 'Joe Hurley',
      about: 'Ph.D. Student School of History and Sociology at Georgia Tech'
    },
    {
      name: 'Sarah Melton',
      about: 'Head of Digital Scholarship at Boston College'
    },
    {
      name: 'Ashley Cheyemi McNeil',
      about: 'HPG Postdoctoral Fellow Obermann Center for Advanced Studies'
    },
    {
      name: 'Ben Miller',
      about: 'Senior Lecturer of Technical Writing and Digital Humanities Emory University'
    },
    {
      name: 'Chad Nelson',
      about: 'Lead Technology Developer with Temple University Libraries'
    },
    {
      name: 'Michael Page',
      about: 'Lecturer in Geospatial Sciences and Technology in the Department of Environmental Sciences at Emory University'
    },
    {
      name: 'Jack Reed',
      about: 'Geospatial Web Engineer with Stanford University Libraries\' Digital Library Systems and Services'
    },
    {
      name: 'R. Stewart Varner',
      about: 'Managing Director of the Price Lab for Digital Humanities at the University of Pennsylvania'
    },
    {
      name: 'Eric Willoughby',
      about: 'Software Engineer Memorial Sloan Kettering Cancer Center'
    }
  ]);

  technologies = A([
    {
      name: 'Ember JS',
      link: 'https://emberjs.com/'
    },
    {
      name: 'Font Awesome',
      link: 'https://fontawesome.com/'
    },
    {
      name: 'GDAL',
      link: 'https://gdal.org/'
    },
    {
      name: 'GeoServer',
      link: 'http://geoserver.org/'
    },
    {
      name: 'Leaflet JS',
      link: 'https://leafletjs.com/'
    },
    {
      name: 'OpenStreetMap',
      link: 'https://www.openstreetmap.org/#map=5/38.007/-95.844'
    },
    {
      name: 'PostGIS',
      link: 'https://postgis.net/'
    },
    {
      name: 'Ruby on Rails',
      link: 'https://rubyonrails.org/'
    }
  ]);
}
