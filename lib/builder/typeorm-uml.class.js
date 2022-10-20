"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeormUml = void 0;
const fs_1 = require("fs");
const http_1 = require("http");
const path_1 = require("path");
const plantumlEncoder = require("plantuml-encoder");
const typeorm_1 = require("typeorm");
const types_1 = require("../types");
const styles_1 = require("./styles");
const styles_class_1 = require("./styles.class");
const uml_builder_class_1 = require("./uml-builder.class");
class TypeormUml {
    async build(configNameOrConnection, flags) {
        const styles = this.getStyles(flags);
        const connection = typeof configNameOrConnection === 'string'
            ? await this.getConnection(configNameOrConnection, flags)
            : configNameOrConnection;
        const builder = new uml_builder_class_1.UmlBuilder(connection, flags, styles);
        const uml = await builder.buildUml();
        if (connection.isConnected) {
            await connection.close();
        }
        if (flags.format === types_1.Format.PUML) {
            if (flags.download) {
                const path = this.getPath(flags.download);
                (0, fs_1.writeFileSync)(path, uml);
            }
            else if (flags.echo) {
                process.stdout.write(`${uml}\n`);
            }
            return uml;
        }
        const url = this.getUrl(uml, flags);
        if (flags.download) {
            await this.download(url, flags.download);
        }
        else if (flags.echo) {
            process.stdout.write(`${url}\n`);
        }
        return url;
    }
    async getConnection(configPath, flags) {
        let root = process.cwd();
        let configName = configPath;
        if ((0, path_1.isAbsolute)(configName)) {
            root = (0, path_1.dirname)(configName);
            configName = (0, path_1.basename)(configName);
        }
        const cwd = (0, path_1.dirname)((0, path_1.resolve)(root, configName));
        process.chdir(cwd);
        const connectionOptionsReader = new typeorm_1.ConnectionOptionsReader({ root, configName });
        const connectionOptions = await connectionOptionsReader.get(flags.connection || 'default');
        const dataSource = new typeorm_1.DataSource(connectionOptions);
        await dataSource.initialize();
        return dataSource;
    }
    getUrl(uml, flags) {
        const encodedUml = plantumlEncoder.encode(uml);
        const format = encodeURIComponent(flags.format);
        const schema = encodeURIComponent(encodedUml);
        const plantumlUrl = flags['plantuml-url'] || 'http://www.plantuml.com/plantuml';
        return `${plantumlUrl.replace(/\/$/, '')}/${format}/${schema}`;
    }
    download(url, filename) {
        return new Promise((resolve) => {
            (0, http_1.get)(url, (response) => {
                response.pipe((0, fs_1.createWriteStream)(this.getPath(filename)));
                response.on('end', resolve);
            });
        });
    }
    getPath(filename) {
        return !(0, path_1.isAbsolute)(filename) ? (0, path_1.resolve)(process.cwd(), filename) : filename;
    }
    getStyles(flags) {
        const args = {
            direction: flags.direction,
            handwritten: flags.handwritten ? 'true' : 'false',
            colors: flags.colors,
            entityNamesOnly: flags['with-entity-names-only'],
            tableNamesOnly: flags['with-table-names-only'],
        };
        if (flags.monochrome) {
            return new styles_1.MonochromeStyles(args);
        }
        if (flags.format === types_1.Format.TXT) {
            return new styles_1.TextStyles(args);
        }
        return new styles_class_1.Styles(args);
    }
}
exports.TypeormUml = TypeormUml;
