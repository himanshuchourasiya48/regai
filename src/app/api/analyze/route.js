export async function POST(request) {
  try {
    const { text } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;
    const prompt = "You are a regulatory compliance AI for banks. Respond ONLY with valid JSON no markdown no backticks. Format: {\"regulation_name\":\"title\",\"effective_date\":\"date\",\"summary\":\"summary\",\"maps\":[{\"title\":\"action\",\"description\":\"details\",\"department\":\"Legal or IT or Operations or HR or Risk & Compliance or Finance\",\"priority\":\"High or Medium or Low\",\"deadline_days\":30,\"deadline_label\":\"30 days\"}]} Generate 5-8 maps. Regulation: " + text;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const result = await response.json();
    console.log("Result:", JSON.stringify(result).substring(0, 200));
    if (!result.candidates || !result.candidates[0]) {
      throw new Error(JSON.stringify(result));
    }
    const raw = result.candidates[0].content.parts[0].text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(raw);
    return Response.json(data);
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}