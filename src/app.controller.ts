import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
// import { AppService } from './app.service';

@Controller('api/app')
export class AppController {
  private items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
  ];

  @Get()
  getItems() {
    return this.items;
  }

  @Get(':id')
  getItem(@Param('id') id: string) {
    const itemId = Number(id);
    const item = this.items.find((i) => i.id == itemId);
    return item ? item : 'item not found';
  }

  @Post()
  createItem(@Body() newItem: { name: string }) {
    const newId = this.items.length + 1;
    const newRecord = { id: newId, name: newItem.name };
    this.items.push(newRecord);
    return newRecord;
  }

  @Put(':id')
  updateItem(@Param('id') id: string, @Body() newValue: { name: string }) {
    const itemId = Number(id);
    const index = this.items.findIndex((i) => i.id == itemId);
    if (index !== -1) {
      this.items[index].name = newValue.name;
      return this.items[index];
    } else {
      return 'Item nout found';
    }
  }

  @Delete(':id')
  deleteItem(@Param('id') id: string) {
    const itemId = Number(id);
    const index = this.items.findIndex((i) => i.id == itemId);
    if (index !== -1) {
      const filter = this.items.filter((i) => i.id != itemId);
      return filter;
    } else {
      return 'Item nout found';
    }
  }
}
