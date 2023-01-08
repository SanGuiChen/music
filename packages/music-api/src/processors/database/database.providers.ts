import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

const defaultConnection = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: config.get('TYPEORM_HOST'),
  port: config.get('TYPEORM_PORT'),
  username: config.get('TYPEORM_USERNAME'),
  password: config.get('TYPEORM_PASSWORD'),
  database: config.get('TYPEORM_DATABASE'),
  // entities: [__dirname + ''],
  autoLoadEntities: true,
  synchronize: config.get('TYPEORM_SYNCHRONIZE') == 'true',
  entityPrefix: config.get('TYPEORM_ENTITY_PREFIX'),
});

export const databaseProviders = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: defaultConnection,
    inject: [ConfigService],
  }),
];
