import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { QUESTION_TYPES, type QuestionType } from '../types';
import { CreateOptionDto } from './create-option.dto';

export class CreateQuestionDto {
  @IsIn(QUESTION_TYPES)
  type!: QuestionType;

  @IsString()
  @IsNotEmpty()
  text!: string;

  @ValidateIf((o: CreateQuestionDto) => o.type === 'BOOLEAN')
  @IsBoolean()
  correctBool?: boolean;

  @ValidateIf((o: CreateQuestionDto) => o.type === 'INPUT')
  @IsString()
  @IsNotEmpty()
  correctText?: string;

  @ValidateIf((o: CreateQuestionDto) => o.type === 'CHECKBOX')
  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options?: CreateOptionDto[];
}
