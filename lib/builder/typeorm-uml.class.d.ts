import { DataSource } from 'typeorm';
import { Flags } from '../types';
export declare class TypeormUml {
    build(configNameOrConnection: string | DataSource, flags: Flags): Promise<string>;
    private getConnection;
    private getUrl;
    private download;
    private getPath;
    private getStyles;
}
