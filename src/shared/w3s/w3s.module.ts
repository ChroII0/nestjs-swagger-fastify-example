import { Global, Module } from '@nestjs/common';
import { LogModule } from '@/shared/log/log.module';
import { w3sProviders } from './w3s.providers';
import { W3SService } from './w3s.service';

@Global()
@Module({
  imports: [
    LogModule
  ],
  providers: [...w3sProviders, W3SService],
  exports: [W3SService],
})
export class W3SModule { }
