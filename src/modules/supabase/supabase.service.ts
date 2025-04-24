import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabaseClient: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabaseClient = createClient(
      this.configService.get('SUPABASE_URL'),
      this.configService.get('SUPABASE_KEY'),
    );
  }

  async upload(
    file: Express.Multer.File,
    bucket: string,
  ): Promise<{ publicUrl: string }> {
    try {
      const { error } = await this.supabaseClient.storage
        .from(bucket)
        .upload(file.originalname, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (error) throw new InternalServerErrorException();

      const { data } = this.supabaseClient.storage
        .from(bucket)
        .getPublicUrl(file.originalname);

      return data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(path: string, bucket: string): Promise<void> {
    try {
      const { error } = await this.supabaseClient.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        throw new InternalServerErrorException();
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
