import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | project-ui/vector-panel/key', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`<ProjectUi::VectorPanel::Key />`);
    assert.equal(this.element.textContent.trim(), '');
  });

  test('it displays manual key', async function(assert) {
    const layer = {
      property: 'status',
      colorMap: {
        renamed: {
          color: '#4daf4a'
        },
        existing: {
          color: '#377eb8'
        },
        needsRenaming: {
          color: '#e41a1c'
        }
      }
    };
    this.set('layer', layer);
    await render(hbs`<ProjectUi::VectorPanel::Key @colorMap={{this.layer.colorMap}} @property={{this.layer.property}}/>`);
    assert.dom('section.uk-width-1-1').hasText('STATUS');
    assert.dom('div#color-renamed[style="background-color: #4daf4a;"]').exists();
    assert.dom('div#color-existing[style="background-color: #377eb8;"]').exists();
    assert.dom('div#color-needsRenaming[style="background-color: #e41a1c;"]').exists();
    assert.dom('div#step-renamed').hasText('Renamed');
    assert.dom('div#step-existing').hasText('Existing');
    assert.dom('div#step-needsRenaming').hasText('Needsrenaming');
  });

  test('it displays stepped color map', async function(assert) {
    const layer2 = {
      property: 'area',
      colorMap: {
        0: {
          top: 2,
          color: '#f7f4f9',
          bottom: 1
        },
        1: {
          top: 4,
          color: '#e7e1ef',
          bottom: 3
        },
        2: {
          top: 6,
          color: '#d4b9da',
          bottom: 5
        }
      }
    };
    this.set('layer2', layer2);
    await render(hbs`<ProjectUi::VectorPanel::Key @colorMap={{this.layer2.colorMap}} @property={{this.layer2.property}}/>`);
    assert.dom('section.uk-width-1-1').hasText('AREA');
    assert.dom('div[style="background-color: #f7f4f9;"]').exists();
    assert.dom('div#color-1[style="background-color: #e7e1ef;"]').exists();
    assert.dom('div#color-2[style="background-color: #d4b9da;"]').exists();
    assert.dom('div#step-0').hasText('1 - 2');
    assert.dom('div#step-1').hasText('3 - 4');
    assert.dom('div#step-2').hasText('5 - 6');
  });
});
