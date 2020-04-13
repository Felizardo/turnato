/*
 * Copyright 2018 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React from 'react';
import Knight from './knight';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

test('knight white is rendered', () => {
  const piece = Enzyme.mount(
    <svg>
      <Knight color="w" />
    </svg>,
  );
  expect(piece.find('path').length).toBeGreaterThan(0);
});

test('knight black is rendered', () => {
  const piece = Enzyme.mount(
    <svg>
      <Knight color="b" />
    </svg>,
  );
  expect(piece.find('path').length).toBeGreaterThan(0);
});
