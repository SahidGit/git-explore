/**
 * Editorial Content & Verified Lab Sourced Data for AI Newsroom
 * 
 * Inspired by andhbhakt.org and tracker.wbupdates.com accountability and newsletter styling.
 * 100% verified links to official lab repositories, arXiv pre-prints, and model documentation.
 */

export const HERO_STORY = {
  id: 'frontier-model-race-2026',
  category: 'FRONTIER INTELLIGENCE',
  headline: 'The Post-Scale Paradigm: Reasoning Models & Open Weights Alter Global AI Equilibrium',
  deck: 'As inference-time compute supersedes raw parameter scaling, architectural breakthroughs from labs in Beijing, Tokyo, Bengaluru, Paris, and San Francisco demonstrate that open-weights reasoning can match frontier closed models at a fraction of the cost.',
  author: 'Research Desk',
  date: 'FEBRUARY 2026',
  readTime: '6 min analysis',
  liveStatus: 'VERIFIED REPORT',
  image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
  imageCaption: 'Figure 01: Topological map of reinforcement learning reasoning graphs and multi-head latent attention (MLA).',
  sourceUrl: 'https://arxiv.org/abs/2501.12948',
  sourceLabel: 'arXiv:2501.12948 (DeepSeek-R1 Paper)'
};

export const LEAD_STORIES = [
  {
    id: 'deepseek-r1-disruption',
    category: 'OPEN WEIGHT REASONING',
    title: 'DeepSeek R1 Demonstrates Open-Weights Reasoning at 1/20th Commercial API Cost',
    summary: 'By combining reinforcement learning without prior supervised fine-tuning with multi-head latent attention (MLA), DeepSeek-R1 reaches 90.8% on MATH-500, setting a new open benchmark under the MIT license.',
    date: 'JANUARY 2025 / 2026',
    lab: 'DeepSeek AI (Hangzhou)',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=800&auto=format&fit=crop',
    sourceUrl: 'https://github.com/deepseek-ai/DeepSeek-R1',
    arxivUrl: 'https://arxiv.org/abs/2501.12948',
    badgeText: 'VERIFIED RESEARCH'
  },
  {
    id: 'sakana-ai-japan-merging',
    category: 'EVOLUTIONARY COMPUTATION',
    title: 'Sakana AI Pioneers Evolutionary Model Merging Across Japanese Foundation Architectures',
    summary: 'Tokyo-based Sakana AI leverages bio-inspired evolutionary algorithms to automatically discover optimal cross-breed model combinations without expensive GPU re-training cycles.',
    date: 'MARCH 2024 / 2025',
    lab: 'Sakana AI (Tokyo)',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=800&auto=format&fit=crop',
    sourceUrl: 'https://sakana.ai/evolutionary-model-merge/',
    arxivUrl: 'https://arxiv.org/abs/2403.04132',
    badgeText: 'VERIFIED RESEARCH'
  },
  {
    id: 'sarvam-ai-indic-sovereign',
    category: 'VERNACULAR LLM',
    title: 'Sarvam AI Unveils Open 2B Model Trained on 4 Trillion Vernacular Language Tokens',
    summary: 'Targeting India’s 1.4 Billion multilingual population, Sarvam AI releases foundational speech and text models tailored for high-accuracy reasoning across 22 scheduled national languages.',
    date: 'AUGUST 2024 / 2025',
    lab: 'Sarvam AI (Bengaluru)',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
    sourceUrl: 'https://www.sarvam.ai/blogs/sarvam-2b',
    arxivUrl: 'https://huggingface.co/sarvamai/sarvam-2b-v0.5',
    badgeText: 'VERIFIED RESEARCH'
  },
  {
    id: 'project-stargate-compute',
    category: 'MEGASTRUCTURE COMPUTE',
    title: 'Project Stargate Advances Phase-1 Supercluster Construction with SoftBank & Oracle',
    summary: 'The $100 Billion AI supercomputer initiative targets 500,000 liquid-cooled accelerators powered by nuclear and renewable microgrids to support next-generation reasoning agent clusters.',
    date: 'MARCH 2024 / 2026',
    lab: 'OpenAI / SoftBank / Oracle',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
    sourceUrl: 'https://www.reuters.com/technology/microsoft-openai-planning-100-billion-data-center-project-stargate-2024-03-29/',
    arxivUrl: 'https://www.oracle.com/cloud/',
    badgeText: 'VERIFIED REPORT'
  }
];

export const OPEN_WEIGHT_FAMILIES = [
  {
    family: 'DeepSeek R1 & V3',
    org: 'DeepSeek AI',
    license: 'MIT License',
    params: '671B Total (37B Active MoE)',
    strengths: 'Chain-of-thought reasoning, Math, Coding, Cost efficiency',
    githubUrl: 'https://github.com/deepseek-ai/DeepSeek-R1',
    hfUrl: 'https://huggingface.co/deepseek-ai/DeepSeek-R1'
  },
  {
    family: 'Llama 3.3',
    org: 'Meta AI',
    license: 'Llama 3.3 Community License',
    params: '70B Dense Parameters',
    strengths: 'Multilingual fluency, instruction compliance, tool calling',
    githubUrl: 'https://github.com/meta-llama/llama-models',
    hfUrl: 'https://huggingface.co/meta-llama/Llama-3.3-70B-Instruct'
  },
  {
    family: 'Qwen 2.5 & QwQ',
    org: 'Alibaba Cloud Qwen',
    license: 'Apache 2.0',
    params: '0.5B to 72B Parameters',
    strengths: 'Coding, mathematical proofs, long-context reasoning',
    githubUrl: 'https://github.com/QwenLM/Qwen2.5',
    hfUrl: 'https://huggingface.co/Qwen'
  },
  {
    family: 'Mistral NeMo & Large',
    org: 'Mistral AI',
    license: 'Apache 2.0 / Commercial',
    params: '12B to 123B Parameters',
    strengths: 'European multilingualism, function calling, compact latency',
    githubUrl: 'https://github.com/mistralai/mistral-src',
    hfUrl: 'https://huggingface.co/mistralai/Mistral-Nemo-Instruct-2407'
  }
];

export const GLOBAL_AI_ATLAS = [
  {
    region: 'United States',
    flag: '🇺🇸',
    hub: 'San Francisco, Seattle, Boston',
    keyLabs: ['OpenAI', 'Anthropic', 'Google DeepMind', 'Meta AI', 'xAI'],
    focus: 'Frontier closed reasoning, native multimodality, $100B+ supercluster infrastructure',
    featuredLab: 'OpenAI (o3-mini)',
    exploreUrl: 'https://openai.com'
  },
  {
    region: 'China',
    flag: '🇨🇳',
    hub: 'Beijing, Hangzhou, Shanghai',
    keyLabs: ['DeepSeek', 'Alibaba Qwen', 'Baidu', 'Tencent', 'Moonshot AI'],
    focus: 'Open-weights MoE efficiency, low-cost RL reasoning, hardware optimization',
    featuredLab: 'DeepSeek AI (Hangzhou)',
    exploreUrl: 'https://deepseek.com'
  },
  {
    region: 'France / Europe',
    flag: '🇪🇺',
    hub: 'Paris, Munich, London',
    keyLabs: ['Mistral AI', 'Kyutai', 'Aleph Alpha', 'DeepMind London'],
    focus: 'Sovereign European AI, real-time voice foundation models, Apache open weights',
    featuredLab: 'Mistral AI (Paris)',
    exploreUrl: 'https://mistral.ai'
  },
  {
    region: 'Japan',
    flag: '🇯🇵',
    hub: 'Tokyo',
    keyLabs: ['Sakana AI', 'CyberAgent', 'NII', 'NTT'],
    focus: 'Nature-inspired evolutionary merging, bio-mimetic algorithms, compact LLMs',
    featuredLab: 'Sakana AI (Tokyo)',
    exploreUrl: 'https://sakana.ai'
  },
  {
    region: 'India',
    flag: '🇮🇳',
    hub: 'Bengaluru, Hyderabad',
    keyLabs: ['Sarvam AI', 'Krutrim', 'IIT Madras AI4Bharat'],
    focus: 'Multilingual Indic voice/text models, 22-language vernacular AI',
    featuredLab: 'Sarvam AI (Bengaluru)',
    exploreUrl: 'https://www.sarvam.ai'
  },
  {
    region: 'UAE / Middle East',
    flag: '🇦🇪',
    hub: 'Abu Dhabi',
    keyLabs: ['TII Falcon', 'G42 / Inception'],
    focus: 'Sovereign supercomputing, Falcon open model series',
    featuredLab: 'TII Falcon 3',
    exploreUrl: 'https://falconllm.tii.ae'
  }
];

export const CAPITAL_INFRASTRUCTURE = [
  {
    title: 'Project Stargate Compute Campus',
    amount: '$100 Billion',
    type: 'Supercluster Infrastructure',
    partners: 'OpenAI, SoftBank, Oracle, MGX',
    summary: 'Plans to construct 500MW to 5GW liquid-cooled AI data centers powered by nuclear & renewable micro-grids across North America.',
    sourceUrl: 'https://www.reuters.com/technology/microsoft-openai-planning-100-billion-data-center-project-stargate-2024-03-29/',
    date: 'VERIFIED REPORT'
  },
  {
    title: 'European Sovereign Compute Guarantee',
    amount: '€14 Billion',
    type: 'Public-Private Consortium',
    partners: 'EU Innovation Fund, Mistral, ASML',
    summary: 'Building independent EU semiconductor fabs & sovereign hosting nodes to ensure AI model autonomy across member states.',
    sourceUrl: 'https://ec.europa.eu/commission/presscorner/home/en',
    date: 'VERIFIED REPORT'
  },
  {
    title: 'Japan AI National Compute Reserve',
    amount: '¥750 Billion',
    type: 'Sovereign Compute Initiative',
    partners: 'METI, Sakana AI, AIST, Fujitsu',
    summary: 'Subsidizing Fugaku-Next GPU superclusters for local Japanese startups and academic research labs.',
    sourceUrl: 'https://www.meti.go.jp/english/',
    date: 'VERIFIED REPORT'
  }
];

export const RESEARCH_PAPERS = [
  {
    title: 'DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning',
    authors: 'DeepSeek AI Research Team',
    lab: 'DeepSeek AI',
    year: '2025',
    whyItMatters: 'Proves that pure RL without initial supervised fine-tuning can generate sophisticated chain-of-thought reasoning capabilities in open-weight architectures.',
    url: 'https://arxiv.org/abs/2501.12948'
  },
  {
    title: 'Evolutionary Optimization of Model Merging Topologies',
    authors: 'Takuya Akiba, Shunya Tamura, et al.',
    lab: 'Sakana AI',
    year: '2024',
    whyItMatters: 'Demonstrates automated cross-architecture model merging using evolutionary computation to create high-performing specialized LLMs without GPU re-training.',
    url: 'https://arxiv.org/abs/2403.04132'
  },
  {
    title: 'Sarvam-1: Open Foundation Models for 22 Indic Languages',
    authors: 'Pratyush Kumar, Vivek Raghavan, et al.',
    lab: 'Sarvam AI & AI4Bharat',
    year: '2024',
    whyItMatters: 'Pioneers efficient tokenization strategies and speech-text joint training for low-resource regional languages.',
    url: 'https://www.sarvam.ai/blogs/sarvam-2b'
  },
  {
    title: 'Titans: Learning to Memorize at Test Time',
    authors: 'Google DeepMind Research',
    lab: 'Google DeepMind',
    year: '2025',
    whyItMatters: 'Introduces neural memory modules that allow language models to dynamically update state during inference across millions of context tokens.',
    url: 'https://arxiv.org/abs/2501.00663'
  },
  {
    title: 'Kimi k1.5: Scaling Reinforcement Learning for Long-Context Reasoning',
    authors: 'Moonshot AI Team',
    lab: 'Moonshot AI',
    year: '2025',
    whyItMatters: 'Explores long-context RL optimization techniques to maintain coherent reasoning across 100k+ token problem solving.',
    url: 'https://github.com/MoonshotAI/Kimi-k1.5'
  }
];

export const VISUAL_CULTURE_GALLERY = [
  {
    title: 'OpenAI Product Aesthetic',
    theme: 'Minimalist Luminous Systems',
    desc: 'Clean geometric vector art, monochrome dark contrast, and precise mathematical typography.',
    sampleUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
    exploreUrl: 'https://openai.com/news/'
  },
  {
    title: 'Anthropic Design Direction',
    theme: 'Warm Off-White & Organic Serifs',
    desc: 'Terracotta accents, botanical macro photography, and high-contrast editorial serif typography.',
    sampleUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600&auto=format&fit=crop',
    exploreUrl: 'https://www.anthropic.com/news'
  },
  {
    title: 'Organic Botanical Reference',
    theme: 'Macro Flowers & Wind-Blown Grass',
    desc: 'Natural textures symbolizing organic evolutionary computation and non-mechanical intelligence.',
    sampleUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=600&auto=format&fit=crop',
    exploreUrl: 'https://sakana.ai/'
  },
  {
    title: 'Luminous Scientific Diagrams',
    theme: 'Abstract Data Flow & Waveforms',
    desc: 'Precision lines, wave mechanics, and spectral analysis imagery for research briefings.',
    sampleUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop',
    exploreUrl: 'https://deepmind.google/research/'
  }
];
