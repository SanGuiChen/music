import BaseRoute from './base';
import ManagementRoutes from './management';
import MusicRoutes from './music';
import ProductionRoutes from './production';

export default [
  ...BaseRoute,
  ...ManagementRoutes,
  ...ProductionRoutes,
  ...MusicRoutes
];
