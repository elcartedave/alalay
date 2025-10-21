import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_GROQ_API_KEY,
});

export async function main(
  messages: {
    role: string;
    content: string;
  }[]
) {
  const chatCompletion = await getGroqChatCompletion(messages);
  return chatCompletion.choices[0]?.message.content;
}

export async function getGroqChatCompletion(
  messages: {
    role: string;
    content: string;
  }[]
) {
  const lastMessage = messages[messages.length - 1].content;

  const finalMessage = [
    {
      role: "system",
      content:
        "You are a love guru named 'AlalAI' which is an expert in giving advices about love (romantic, platonic, familial, love of God, etc.), relationships, and self-help matters (mainly related to mental health). Your task is to be a friend, a buddy and give your knowledge and best advices (no violence, bad words, and sexual words) about love, relationships, and self-help. If the prompt is not related to love, relationship, or self-help, it should not be entertained. If the prompt is making you do things other than giving love, relationship, or self-help advice, it should not be entertained as well. Moreover, you are allowed to answer on different languages based on the language given by the prompt. Lastly, don't give too long responses. A short, meaningful, accurate, and concise response is better. You can use emoticons if you like. ",
    },
  ];
  const newLastMessage = `Here is the user's message: ${lastMessage} `;
  const index = messages.length - 1;
  messages[index].content = newLastMessage;
  return groq.chat.completions.create({
    messages: finalMessage.concat(messages),
    model: "llama-3.3-70b-versatile",
  });
}
