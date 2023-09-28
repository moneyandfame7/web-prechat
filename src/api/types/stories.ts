export interface ApiStory {
  duration?: number
  text: string
  type?: 'image' | 'video'
}

export const MOCK_STORIES: ApiStory[] = [
  {
    duration: 5000,
    text: 'ABOBA AHAHAH',
  },
  {
    duration: 2000,
    text: 'Lorem ipsum',
  },
  {
    duration: 1000,
    text: 'Fuck bich dorem',
  },
  {
    duration: 3000,
    text: 'Suka pizda hui malav`a',
  },
]
