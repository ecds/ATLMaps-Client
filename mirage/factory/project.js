// mirage/factory/project.js
import Mirage, {
faker
} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
    name() {
        return faker.name.random.uuid();
    },
    title() {
        return faker.random.words();
    },
    center_lat() {
        return faker.address.lattitude();
    },
    center_lng() {
        return faker.address.longitude();
    },
    zoom_level() {
        return faker.random.number();
    },
    default_base_map() {
        return faker.random.word();
    },
    new_project() {
        return faker.random.boolean();
    },
    published() {
        return faker.random.boolean();
    },
    featured() {
        return faker.random.boolean();
    }

});
