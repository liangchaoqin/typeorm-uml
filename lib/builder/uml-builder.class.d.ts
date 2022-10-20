import { DataSource, EntityMetadata } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { ForeignKeyMetadata } from 'typeorm/metadata/ForeignKeyMetadata';
import { Flags } from '../types';
import { Styles } from './styles.class';
interface ColumnDataTypeDefaults {
    length?: string;
    width?: number;
    precision?: number;
    scale?: number;
}
export declare class UmlBuilder {
    protected readonly dataSource: DataSource;
    protected readonly flags: Flags;
    protected readonly styles: Styles;
    constructor(dataSource: DataSource, flags: Flags, styles: Styles);
    buildUml(): Promise<string>;
    protected buildColumn(column: ColumnMetadata): string;
    protected buildForeignKeys(entity: EntityMetadata): string;
    protected buildForeignKey(foreignKey: ForeignKeyMetadata, entity: EntityMetadata): string;
    protected getColumnLength(column: ColumnMetadata | ColumnDataTypeDefaults): string;
}
export {};
