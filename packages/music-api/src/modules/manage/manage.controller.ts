import { ShelvesDto } from './dtos/shelves.dto';
import { OfflineDto } from './dtos/offline.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { SearchDto } from './dtos/search.dto';
import { ManageService } from './manage.service';
import { StorageDto } from './dtos/storage.dto';

@Controller('manage')
export class ManageController {
  constructor(private readonly manageService: ManageService) {}

  @Post('offline')
  async offline(@Body() offlineDto: OfflineDto) {
    const { id } = offlineDto;
    return await this.manageService.offline(id);
  }

  @Post('shelves')
  async shelves(@Body() shelvesDto: ShelvesDto) {
    const { id } = shelvesDto;
    return await this.manageService.shelves(id);
  }

  @Post('storage')
  async storage(@Body() storageDto: StorageDto) {
    return this.manageService.storage(storageDto);
  }

  @Post('search')
  async search(@Body() searchDto: SearchDto) {
    return await this.manageService.search(searchDto);
  }
}
