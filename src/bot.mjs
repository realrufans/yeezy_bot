import { Bot } from "grammy";
import OpenAI from "openai";
export const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

bot.command("start", async (ctx) => {
  const username = ctx.from.username;

  console.log(username);

  // let userData = await findUserInDB(userId, name, username);
  // userCache.set(userId, userData);

  ctx.reply(
    ` Hello, I'm YeezyBot!  \n
    Here's what I can do:
    - Generate images with /yeezy \n 
    Created by ${username}`
  );
});

bot.command("yeezy", async (ctx) => {
  const userId = ctx.from.id;
  const userName = ctx.message.from.username;
  userStates[userId] = { route: "yeezy", processing: false };

  ctx.reply(`@${userName} Please enter a prompt to generate a Yeezy image:`, {
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
        prompt: `Based on the user's request: '${text}', generate an image that prominently features highly realistic Yeezy sneakers. These sneakers should be detailed and authentic. Regardless of the usual or unusual context described by the user, it's crucial for the sneakers to maintain a true-to-life appearance, as if they were custom-made to fit the subject in the user's request. The sneakers should be integrated into the scene in such a way that their authenticity and detailed design are highlighted, making them a visually accurate and standout element of the image.`,
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
    console.error(error.message);
    ctx.reply(
      `${error.message} \n Please contact @realrufans22 if the problem persists.`,
      { reply_to_message_id: messageId }
    );

    return;
  }
});

export default bot;
