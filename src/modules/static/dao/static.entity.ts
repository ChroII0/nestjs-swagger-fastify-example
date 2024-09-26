import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StaticFileDocument = HydratedDocument<StaticFile>;

@Schema()
export class StaticFile {

    @Prop({ required: true })
    w3sCid: string;

    @Prop({ required: false })
    s3Url: string;

    @Prop({ required: true })
    createdAt: Date;

    @Prop({ required: true })
    updateAt: Date;
}

export const StaticFileSchema = SchemaFactory.createForClass(StaticFile);
StaticFileSchema.index({ s3Url: 1 }, { unique: true });
StaticFileSchema.index({ w3sCid: 1 }, { unique: true });
