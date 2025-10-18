import { PartialType } from '@nestjs/mapped-types';
import { CreateSubnetDto } from './create-subnet.dto';

export class UpdateSubnetDto extends PartialType(CreateSubnetDto) {}
