import React from 'react';
import 'react-devtools';
import {render} from 'react-dom';
import ActiveTabs from './ActiveTabs';
import PropTypes from 'prop-types';
const client = browser;
render(<ActiveTabs />, document.querySelector("#root"));
