import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMurmurDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(280) // Standard post length limit
  content: string;
}