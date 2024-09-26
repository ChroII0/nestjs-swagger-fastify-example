import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { StaticFile, StaticFileDocument } from './static.entity';
import { LogService } from '@/shared/log/log.service';
import { BadGatewayException } from '@nestjs/common';

export class StaticFileDAO {
    constructor(
        @InjectModel(StaticFile.name) private readonly staticFileModel: Model<StaticFileDocument>,
        private readonly logService: LogService
    ) { }

    async getStatics(filter: { s3Url?: string; w3sCid?: string; }): Promise<StaticFile> {
        try {
            return await this.staticFileModel.findOne(filter).select({
                s3Url: 1,
                w3sCid: 1,
                _id: 0
            }).lean().exec();
        } catch (error) {
            this.logService.error(error);
            throw new BadGatewayException(error);
        }
    }

    async updateAndSave(filter: FilterQuery<StaticFile>, updateData: Partial<StaticFile>): Promise<void> {
        try {
            await this.staticFileModel.findOneAndUpdate(filter, { $set: updateData }, { upsert: true }).exec();
        } catch (error) {
            this.logService.error(error);
            throw new BadGatewayException(error);
        }
    }
}
