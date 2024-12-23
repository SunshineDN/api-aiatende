import path from 'path';

export default {
  '~': path.join(__dirname, '../', '../'),
  '@controllers': path.join(__dirname, '../', 'src', 'controllers'),
  '@middlewares': path.join(__dirname, '../', 'src', 'middlewares'),
  '@services': path.join(__dirname, '../', 'src', 'services'),
  '@utils': path.join(__dirname, '../', 'src', 'utils'),
  '@config': path.join(__dirname, '../', 'src', 'config'),
  '@models': path.join(__dirname, '../', 'src', 'models'),
  '@routes': path.join(__dirname, '../', 'src', 'routes'),
  '@tests': path.join(__dirname, '../', 'tests'),
  '@src': path.join(__dirname, '../', 'src'),
}