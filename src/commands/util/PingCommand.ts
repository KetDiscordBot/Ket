export { }
import Eris from "eris"
const { CommandStructure } = require("../../components/Commands/CommandStructure")

module.exports = class PingCommand extends CommandStructure {
    constructor(ket: Eris.Client) {
        super(ket, {
            name: 'ping',
            aliases: [],
            cooldown: 3,
            permissions: {
                user: [],
                bot: [],
                onlyDevs: false
            },
            access: {
                DM: true,
                Threads: true
            },
            dontType: true,
            testCommand: [],
            slashData: null
        })
    }
    async execute({ message }, t) {
        let time = Date.now();
        let msg = await message.channel.createMessage('calculando ping...');
        let totalTime = Date.now() - time;
        msg.edit(`tempo de resposta: ${totalTime}ms`);
    }
    async slash({ interaction }, t) {
        let time = Date.now();
        await interaction.createMessage('calculando ping...');
        let totalTime = Date.now() - time;
        interaction.editOriginalMessage(`tempo de resposta: ${totalTime}ms`);
    }
}