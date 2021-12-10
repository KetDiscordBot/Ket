export { };
import type { ClientOptions } from "eris";
const
    { Client, Collection } = require('eris'),
    { readdir } = require('fs');

module.exports = class KetClient extends Client {
    config: object;
    db: object;
    events: any;
    modules: any;
    postgres: object;
    commands: any;
    aliases: any;
    shardUptime: object;

    constructor(token: string, options: ClientOptions) {
        super(token, options);

        this.config = require('./json/settings.json');
        // this.users = new Collection(this.User, this.config.ERIS_LOADER_SETTINGS.cacheLimit.users)
        // this.guilds = new Collection(this.Guild, this.config.ERIS_LOADER_SETTINGS.cacheLimit.guilds)
        // this.options.messageLimit = this.config.ERIS_LOADER_SETTINGS.cacheLimit.messages

        this.events = new (require('./components/core/EventHandler'))(this);
        this.commands = new Map();
        this.webhooks = new Map();
        this.aliases = new Map();
        this.modules = new Map();
        this.shardUptime = new Map();
    }
    async boot() {
        this.loadLocales();
        this.loadCommands();
        this.loadListeners(`${__dirname}/events/`);
        this.loadModules();
        return this.connect();
    }

    loadLocales() {
        const Locales = new (require('./components/core/LocalesStructure'))();
        Locales.inicialize();
        return this;
    }

    loadCommands() {
        try {
            readdir(`${__dirname}/commands/`, (_e: any, categories: string[]) => {
                categories.forEach(category => {
                    readdir(`${__dirname}/commands/${category}/`, (_e: any, files: string[]) => {
                        files.forEach(async (command: string) => {
                            const comando = new (require(`${__dirname}/commands/${category}/${command}`))(this);
                            comando.dir = `${__dirname}/commands/${category}/${command}`;
                            this.commands.set(comando.config.name, comando);
                            return comando.config.aliases.forEach((aliase: any) => this.aliases.set(aliase, comando.config.name));
                        })
                    })
                })
            })
        } catch (e) {
            global.client.log('error', 'COMMANDS HANDLER', 'Erro ao carregar comandos:', e);
        }
        return this;
    }

    loadListeners(path: string) {
        try {
            readdir(path, (_e: any, files: string[]) => {
                files.forEach((fileName: string) => {
                    if (fileName.startsWith('_')) return;
                    this.events.add(fileName.split(".")[0].replace('on-', ''), `${__dirname}/events/${fileName}`);
                })
            })
        } catch (e) {
            global.client.log('error', "EVENTS LOADER", `Erro ao carregar eventos:`, e);
        }
        return this;
    }

    loadModules() {
        try {
            readdir(`${__dirname}/packages/`, (_e: any, categories: string[]) => {
                categories.forEach((category: string) => {
                    readdir(`${__dirname}/packages/${category}/`, (_e: any, modules: string[]) => {
                        modules.forEach(async (file: string) => {
                            if (file.startsWith("_")) return;
                            const module = new (require(`${__dirname}/packages/${category}/${file}`))(this);
                            this.modules.set(file.split('.')[0], module);
                            return module.inicialize();
                        })
                    })
                })
            })
            global.client.log('log', 'MODULES MANAGER', '√ Módulos inicializados');
        } catch (e) {
            global.client.log('error', 'MODULES MANAGER', 'Houve um erro ao carregar os módulos:', e);
        }
        return this;
    }

    async reloadCommand(commandName: string) {
        const comando = this.commands.get(commandName) || this.commands.get(this.aliases.get(commandName));
		if (!comando) return 'Comando não encontrado';
        comando.config.aliases.forEach((aliase: any) => this.aliases.delete(aliase));
		this.commands.delete(comando.config.name);
		delete require.cache[require.resolve(comando.dir)];
        try {
            const command = new (require(comando.dir))(this);
            command.dir = comando.dir;
            this.commands.set(command.config.name, command);
            command.config.aliases.forEach((aliase: any) => this.aliases.set(aliase, command.config.name));
            return true;
        } catch(e) {
            return e;
        }

    }
}