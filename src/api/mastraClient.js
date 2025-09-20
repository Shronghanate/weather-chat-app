// mastraClient.js
export async function sendWeatherMessage(messages, onChunk, onDone, onError) {
  const API_URL = import.meta.env.VITE_MASTRA_API_URL;
  const API_KEY = import.meta.env.VITE_MASTRA_API_KEY;

  if (!API_URL || !API_KEY) {
    onError("Missing API URL or API KEY in .env");
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-mastra-dev-playground": "true",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        messages,
        runId: "weatherAgent",
        maxRetries: 2,
        maxSteps: 5,
        temperature: 0.5,
        topP: 1,
        runtimeContext: {},
        threadId: "250",
        resourceId: "weatherAgent",
      }),
    });

    if (!response.ok) {
      if (response.status === 500) {
        throw new Error("Weather service unavailable. Please try again later.");
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let partialText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter(Boolean);

      for (const line of lines) {
        if (line.startsWith("0:")) {
          let token = line.substring(2).trim().replace(/^"|"$/g, "");
          partialText += token;
          onChunk(partialText); // stream partial updates
        }
        if (line.startsWith("e:")) {
          onDone(); // stream ended
        }
      }
    }
  } catch (err) {
    console.error("API Error:", err);
    onError(err.message || "Unknown API error");
  }
}
