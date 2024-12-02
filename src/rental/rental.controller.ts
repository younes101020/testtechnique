import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateRentalDto, UpdateRentalDto } from './rental.dto';
import { RentalService } from './rental.service';

@Controller('rentals')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createRental(@Body() createRentalDto: CreateRentalDto) {
    return this.rentalService.createRental(createRentalDto);
  }

  @Put(':id')
  updateRental(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRentalDto: UpdateRentalDto,
  ) {
    return this.rentalService.updateRental(id, updateRentalDto);
  }

  @Get('customer/:id')
  getRentalsByCustomer(@Param('id', ParseIntPipe) customerId: number) {
    return this.rentalService.getRentalsByCustomer(customerId);
  }

  @Get(':id')
  getRental(@Param('id', ParseIntPipe) id: number) {
    return this.rentalService.getRental(id);
  }
}
