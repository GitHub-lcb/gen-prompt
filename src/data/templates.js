const templates = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    description: '专业的文本对话助手',
    icon: '💬',
    defaultValues: {
      topic: '',
      style: 'professional',
      length: 'medium',
      tone: 'friendly',
      additionalInstructions: '请使用简洁明了的语言，保持逻辑性和条理性。'
    }
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    description: '创意图像生成工具',
    icon: '🎨',
    defaultValues: {
      topic: '',
      style: 'creative',
      length: 'long',
      tone: 'enthusiastic',
      additionalInstructions: '请包含场景描述、艺术风格、光线效果、画面氛围等元素，使用逗号分隔。'
    }
  },
  {
    id: 'dalle',
    name: 'DALL-E',
    description: 'OpenAI 图像生成工具',
    icon: '🖼️',
    defaultValues: {
      topic: '',
      style: 'professional',
      length: 'medium',
      tone: 'neutral',
      additionalInstructions: '请提供清晰具体的视觉描述，包括主体、背景、颜色和风格等细节。'
    }
  }
]

export default templates
