import { Bot, InlineKeyboard, Keyboard } from "grammy";

export const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

const languageKeyboard = new Keyboard().text("/start").resized().build();
const userStates = {};
bot.command("start", async (ctx) => {
  userStates[route] = "start";
  const userId = ctx.from.id;
  const name = ctx.from.first_name;
  const username = ctx.from.username;

  ctx.reply(
    ` Hello, I'm YeezyBot!  \n
    Here's what I can do:
    - Generate images with /yeezy \n 
    Created by @realrufans22`
  );
});

bot.hears(["🇺🇦 Українська", "🇬🇧 English"], async (ctx) => {
  const selectedLang = ctx.message.text === "🇺🇦 Українська" ? "uk" : "en";
  const userId = ctx.from.id;

  ctx.reply(`${"welcomeMessage"}, ${ctx.from.first_name}!`, {
    reply_markup: await mainMenu(selectedLang),
  });
});

async function generateFAQMenu(lang) {
  const faqData = await getFAQ();
  const keyboard = new InlineKeyboard();

  for (const faq of faqData) {
    // const question = await getTranslation(faq.question[lang], lang);
    keyboard.text(question, `faq_${faq._id}`).row();
  }

  return keyboard;
}

bot.command("start", async (ctx) => {
  const username = ctx.from.username;

  console.log(username);

  // let userData = await findUserInDB(userId, name, username);
  // userCache.set(userId, userData);

  ctx.reply(
    ` Hello, I'm YeezyBot!  \n
    Here's what I can do:
    - Generate images with /yeezy \n 
    Created by ${username}`,
    {
      reply_markup: { keyboard: languageKeyboard, resize_keyboard: true },
    }
  );
});

bot.command("yeezy", async (ctx) => {
  userStates[route] = "yeezy";
  const userId = ctx.from.id;
  const name = ctx.from.first_name;
  const username = ctx.from.username;

  ctx.reply(`Please enter a valid promit`, {
    reply_markup: { keyboard: languageKeyboard, resize_keyboard: true },
    reply_to_message_id: ctx.message.message_id,
  });
});

bot.on("message", async (ctx) => {
  const userId = ctx.from.id;
  const text = ctx.message.text;

  // console.log(text, 'from message');
  if (userStates.route === "yeezy") {
    if (!text.toLowerCase().includes("yeezy")) {
      return ctx.reply(
        ` I'm sorry but I only generate Yeezy related images. \n Try a different prompt.`,
        {
          reply_to_message_id: ctx.message.message_id,
        }
      );
    }

    ctx.reply(`Generating image...`, {
      reply_to_message_id: ctx.message.message_id,
    });
  }
});

export default bot;
