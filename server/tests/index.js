/**
 * Make sure we're using the test database
 */

/**
 * And require our necessary odds and ends
 */

import requireDirectory from 'require-directory';
import fixtures from './fixtures';
const tests = requireDirectory(module, './testfiles');
