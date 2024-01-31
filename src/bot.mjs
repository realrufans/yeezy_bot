import { Bot, InlineKeyboard, Keyboard } from "grammy";
import OpenAI from "openai";
export const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const languageKeyboard = new Keyboard().text("/start").resized().build();

const userStates = {};

bot.command("start", async (ctx) => {
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
  const userId = ctx.from.id;
  const userName = ctx.message.from.username;
  userStates[userId] = { route: "yeezy", processing: false };

  originalOwner = userId;

  ctx.reply(`@${userName} Please enter a prompt to generate a Yeezy image:`, {
    reply_markup: { keyboard: languageKeyboard, resize_keyboard: true },
    reply_to_message_id: ctx.message.message_id,
  });
});

bot.on("message", async (ctx) => {
  const userId = ctx.from.id;
  const text = ctx.message.text;
  const chatId = ctx.chat.id;
  const messageId = ctx.message.message_id;

  try {
    // console.log(text, 'from message');
    if (
      userStates[userId]?.route === "yeezy" &&
      !userStates[userId].processing
    ) {
      if (!text.toLowerCase().includes("yeezy")) {
        return ctx.reply(
          "I'm sorry, but I only generate images related to Yeezy. Please include the word 'yeezy' in your prompt. For example, try sending a prompt like: <code>Yeezy sneakers on a beach</code>. \n /start",
          {
            reply_to_message_id: messageId,
            parse_mode: "HTML", // Ensure this is consistent with your bot's capabilities
          }
        );
      }

      userStates[userId].processing = true;

      const processingMessage = await ctx.reply(
        "Generating Image, please wait...",
        { reply_to_message_id: messageId }
      );

      const respnose = await openai.images.generate({
        model: "dall-e-3",
        prompt: text,
      });
      const imageUrl = respnose.data[0].url;
      console.log(imageUrl);
      if (imageUrl) {
        userStates.processing = false;
        userStates.route = "";
        userStates.processing = false;
        await ctx.replyWithPhoto(imageUrl, {
          caption: `✅ Yeezy`,
          reply_to_message_id: messageId,
          parse_mode: "HTML", // Set the parse mode to HTML
        });
      }
    }
  } catch (error) {
    console.error(error);
    ctx.reply(
      "An error occurred while generating the image. \n Please contact @realrufans22 if the problem persists."
    );

    return;
  }
});

export default bot;
