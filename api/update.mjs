import {webhookCallback} from "grammy";
import {bot} from "../src/bot.mjs";

// Default grammY handler for incoming updates via webhooks
export default webhookCallback(bot, "http", {
    timeoutMilliseconds: 30_000,
});
