import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';

export default helper(function htmlString(params/*, hash*/) {
  return htmlSafe(params.join(''));
});
