import { ChatSettings, Message } from '../types/types';

export const sendMessage = async (
  messages: Message[],
  settings: ChatSettings,
  signal?: AbortSignal,
  onStream?: (chunk: string) => void
): Promise<{ content: string }> => {
  try {
    const formattedMessages = messages.map(({ role, content }) => ({
      role,
      content,
    }));

    const response = await fetch(settings.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey}`,
      },
      body: JSON.stringify({
        model: settings.modelId,
        messages: formattedMessages,
        stream: !!onStream,
      }),
      signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || 
        `API request failed with status ${response.status}`
      );
    }

    if (onStream) {
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let content = '';

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              const text = parsed.choices[0]?.delta?.content || '';
              content += text;
              onStream(text);
            } catch (e) {
              console.error('Error parsing streaming response:', e);
            }
          }
        }
      }

      return { content };
    }

    const data = await response.json();
    return { content: data.choices[0].message.content };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request was cancelled');
    }
    throw error;
  }
};