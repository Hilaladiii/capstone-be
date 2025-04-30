import { Module } from '@nestjs/common';
import { AnnoucementController } from './annoucement.controller';
import { AnnoucementService } from './annoucement.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [AnnoucementController],
  providers: [AnnoucementService],
})
export class AnnoucementModule {}
