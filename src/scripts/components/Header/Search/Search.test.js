import React from 'react';
import renderer from 'react-test-renderer';

test('Search', () => {
  const component  = renderer.create(<Search
    regex={true}
    ignoreCase={true}
    searchIn={[true,true]}
    searchInTabs={[]}
    setPreferences={this.setPreferences}
  />, );

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
