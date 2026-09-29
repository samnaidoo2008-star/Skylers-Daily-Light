export interface SundayReflectionPrompt {
  id: string;
  theme: string;
  prompt: string;
  scriptureReference: string;
  scriptureText: string;
  deepeningQuestion: string;
}

export const SUNDAY_REFLECTION_PROMPTS: SundayReflectionPrompt[] = [
  {
    id: 'providence-review',
    theme: 'Unseen Providence & Weekly Traces',
    prompt: 'Looking back across this past week, where did you perceive God’s unseen hand, quiet provision, or timely protection over your footsteps?',
    scriptureReference: 'Psalm 103:2',
    scriptureText: 'Bless the Lord, O my soul, and forget not all his benefits.',
    deepeningQuestion: 'Name one ordinary moment this week that in hindsight carried an extraordinary touch of God’s grace.'
  },
  {
    id: 'sabbath-restoration',
    theme: 'Sabbath Rest & Laying Down Burdens',
    prompt: 'What mental burdens, unresolved anxieties, or hurried striving can you consciously lay down at the altar today so your spirit may rest in holy quietness?',
    scriptureReference: 'Matthew 11:28',
    scriptureText: 'Come to me, all who labor and are heavy laden, and I will give you rest.',
    deepeningQuestion: 'What is one worry you are willing to entrust entirely to God before the new week begins?'
  },
  {
    id: 'fruit-of-the-spirit',
    theme: 'Spiritual Harvest & Fruit of the Week',
    prompt: 'Which fruit of the Spirit (love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control) was tested most in you this week, and how did grace sustain you?',
    scriptureReference: 'Galatians 5:22-23',
    scriptureText: 'The fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control.',
    deepeningQuestion: 'Where did you choose grace over irritation, or faith over fear?'
  },
  {
    id: 'forgiveness-and-release',
    theme: 'Forgiveness & Clean Slate for the New Week',
    prompt: 'Is there any lingering resentment, grievance, or self-condemnation from the past seven days you need to surrender to God’s mercy today?',
    scriptureReference: 'Colossians 3:13',
    scriptureText: 'Bearing with one another and, if one has a complaint against another, forgiving each other; as the Lord has forgiven you.',
    deepeningQuestion: 'Who or what can you bless in prayer today to begin tomorrow with a pure and unburdened heart?'
  },
  {
    id: 'seeds-for-the-future',
    theme: 'Consecrating the Week Ahead',
    prompt: 'As you look forward to the dawn of the new week, what spiritual intention, prayer, or seed of love do you want to sow into your home, work, and community?',
    scriptureReference: 'Proverbs 16:3',
    scriptureText: 'Commit your work to the Lord, and your plans will be established.',
    deepeningQuestion: 'What one area of your life do you invite the Holy Spirit to guide with extra tenderness this week?'
  },
  {
    id: 'trials-into-testimony',
    theme: 'Strength Found in Weakness',
    prompt: 'In your most difficult moment this past week, what did the Lord teach you about your heart and His unshakeable faithfulness?',
    scriptureReference: '2 Corinthians 12:9',
    scriptureText: 'My grace is sufficient for you, for my power is made perfect in weakness.',
    deepeningQuestion: 'How can you thank God today for carrying you through what felt difficult earlier in the week?'
  }
];
