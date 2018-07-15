/**
 * Make sure we're using the test database
 */
process.env.NODE_ENV = 'test';

/**
 * And require our necessary odds and ends
 */

import requireDirectory from 'require-directory';
import fixtures from './fixtures';
const tests = requireDirectory(module, './testfiles');
