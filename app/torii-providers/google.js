
import GoogleOauth2Provider from 'torii/providers/google-oauth2';

export default GoogleOauth2Provider.extend({
    fetch(data) {
        return data;
    }
});
