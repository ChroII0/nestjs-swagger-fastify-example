import { ConfigService } from '@nestjs/config';
import { Config } from '@/common/enum/config';
import { LogService } from '@/shared/log/log.service';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export const w3sProviders = [
    {
        provide: 'WEB3_STORAGE',
        inject: [ConfigService, LogService],
        useFactory: async (configService: ConfigService, logService: LogService) => {
            
            const { create } = await import('@web3-storage/w3up-client');
            const { Signer } = await import('@web3-storage/w3up-client/principal/ed25519');
            const { parse } = await import('@web3-storage/w3up-client/proof');
            const { StoreMemory } = await import('@web3-storage/w3up-client/stores/memory');
            
            const w3sKey = configService.get<string>(Config.W3S_KEY);
            if (!w3sKey) {
                const errorMsg = `W3S key not found in configuration.`;
                logService.error(errorMsg);
                throw new Error(errorMsg);
            }

            const principal = Signer.parse(w3sKey);
            const store = new StoreMemory();
            const w3sClient = await create({ principal, store });

            const proofPath = join(process.cwd(), 'w3s.proof');            
            if (!proofPath || !existsSync(proofPath)) {
                const errorMsg = `Proof file not found at path: ${proofPath}`;
                logService.error(errorMsg);
                throw new Error(errorMsg);
            }

            const proofStr = readFileSync(proofPath, 'utf8');
            const proof = await parse(proofStr);
            const space = await w3sClient.addSpace(proof);
            await w3sClient.setCurrentSpace(space.did());

            return w3sClient;
        }
    }
];
