import BaseRoute from './base';
import ManagementRoutes from './management';
import ProductionRoutes from './production';

export default [...BaseRoute, ...ManagementRoutes, ...ProductionRoutes];
