import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { content, mode, mask, lang } = await req.json();

    const systemPrompt = `
      You are MIND LENS, a social neural decoder. 
      Analysis Mode: ${mode}
      Character Mask: ${mask}
      Output Language: ${lang}

      Task: Analyze the subtext and provide actionable replies.
      Respond ONLY in JSON format:
      {
        "subtext": "Brief subtext summary in Chinese",
        "suggestions": [
          {"label": "Direct/Aggressive", "content": "Reply text 1"},
          {"label": "Tactful/Soft", "content": "Reply text 2"},
          {"label": "Wit/Humor", "content": "Reply text 3"}
        ]
      }
      
      The suggestions MUST strictly follow the chosen mask's personality:
      - Fox: Cunning, indirect, strategic.
      - Judge: Sharp, honest, exposing.
      - Elite: Logical, boundaries, cold.
      - Green Tea: Emotional manipulation, soft but controlling.
    `;

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: content }
        ],
        response_format: { type: 'json_object' }
      })
    });

    const data = await response.json();
    // 这里的解析逻辑要稳，防止 AI 返回的不是纯 JSON
    const resContent = JSON.parse(data.choices[0].message.content);
    return NextResponse.json(resContent);

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Neural link failed" }, { status: 500 });
  }
}
