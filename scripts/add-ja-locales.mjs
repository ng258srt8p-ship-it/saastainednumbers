import { readFileSync, writeFileSync, readdirSync } from 'fs';
import path from 'path';

// Files that already have locales or are not calculator configs
const skipFiles = new Set([
  'calculators/config/_all.ts',
  'calculators/config/_content-template.ts',
  'calculators/config/calculator-schema.ts',
  'calculators/config/burn-rate-calculator.ts',
  'calculators/config/cac-ltv-ratio-calculator.ts',
  'calculators/config/churn-calculator.ts',
  'calculators/config/mrr-calculator.ts',
  'calculators/config/nps-calculator.ts',
  'calculators/config/quick-ratio-calculator.ts',
]);

// Japanese title translations keyed by slug (derived from filename)
const jaTitles = {
  "activation-rate-calculator": "アクティベーション率計算機",
  "acv-calculator": "ACV計算機",
  "affiliate-income-calculator": "アフィリエイト収入計算機",
  "ai-fine-tuning-cost-calculator": "AIファインチューニング費用計算機",
  "ai-image-cost-calculator": "AI画像生成費用計算機",
  "ai-model-comparison-calculator": "AIモデル比較計算機",
  "amazon-fba-calculator": "Amazon FBA収益計算機",
  "aov-calculator": "AOV計算機（平均注文額）",
  "arpu-calculator": "ARPU計算機",
  "blogging-income-calculator": "ブログ収入計算機",
  "break-even-calculator": "損益分岐点分析計算機",
  "business-valuation-calculator": "企業価値評価計算機",
  "cac-calculator": "CAC計算機",
  "cac-payback-period-enhanced-calculator": "CAC回収期間拡張計算機",
  "cash-runway-calculator": "キャッシュランウェイ計算機",
  "chatgpt-api-cost-calculator": "ChatGPT API費用計算機",
  "claude-api-cost-calculator": "Claude API費用計算機",
  "cloud-infrastructure-cost-calculator": "クラウドインフラ費用計算機",
  "cohort-analysis-calculator": "コホート分析計算機",
  "contractor-vs-employee-calculator": "契約社員vs正社員比較計算機",
  "contribution-margin-calculator": "貢献利益率計算機",
  "conversion-rate-calculator": "コンバージョン率計算機",
  "cpc-calculator": "CPC計算機（クリック単価）",
  "cpm-calculator": "CPM計算機（インプレッション単価）",
  "credit-card-payoff-calculator": "クレジットカード返済計算機",
  "ctr-calculator": "CTR計算機（クリック率）",
  "customer-engagement-score-calculator": "顧客エンゲージメントスコア計算機",
  "customer-health-score-calculator": "カスタマーヘルススコア計算機",
  "debt-payoff-calculator": "借金返済計算機",
  "dividend-income-calculator": "配当収入計算機",
  "dropshipping-margin-calculator": "ドロップシッピング利益率計算機",
  "emergency-fund-calculator": "緊急資金計算機",
  "employee-cost-calculator": "従業員コスト計算機",
  "etsy-profit-calculator": "Etsy利益率計算機",
  "expansion-revenue-rate-calculator": "拡大収益率計算機",
  "feature-adoption-rate-calculator": "機能採用率計算機",
  "fire-calculator": "FIRE計算機",
  "freelance-rate-calculator": "フリーランス時給計算機",
  "gemini-api-cost-calculator": "Gemini API費用計算機",
  "gig-worker-take-home-calculator": "ギグワーカー手取り収入計算機",
  "gpu-compute-cost-calculator": "GPUコンピュート費用計算機",
  "grok-api-cost-calculator": "Grok API費用計算機",
  "gross-margin-calculator": "粗利益率計算機",
  "investment-returns-calculator": "投資収益計算機",
  "lead-conversion-rate-calculator": "リード転換率計算機",
  "ltv-calculator": "LTV計算機",
  "magic-number-calculator": "マジックナンバー計算機",
  "mortgage-affordability-calculator": "住宅ローン借入可能額計算機",
  "mrr-growth-rate-calculator": "MRR成長率計算機",
  "net-cash-flow-calculator": "純キャッシュフロー計算機",
  "newsletter-revenue-calculator": "ニュースレター収益計算機",
  "nrr-calculator": "NRR計算機（純収益維持率）",
  "operating-margin-calculator": "営業利益率計算機",
  "payback-period-calculator": "CAC回収期間計算機",
  "payment-processing-fee-calculator": "決済手数料計算機",
  "perplexity-api-cost-calculator": "Perplexity API費用計算機",
  "podcast-revenue-calculator": "ポッドキャスト収益計算機",
  "pricing-strategy-calculator": "価格戦略計算機",
  "print-on-demand-profit-calculator": "POD（プリントオンデマンド）利益計算機",
  "rent-vs-buy-calculator": "賃貸vs購入比較計算機",
  "retire-401k-calculator": "401k退職資金計算機",
  "revenue-per-employee-calculator": "従業員一人あたりの収益計算機",
  "revenue-per-user-trend-calculator": "ARPU推移計算機",
  "roas-calculator": "ROAS計算機（広告費用対効果）",
  "roi-calculator": "ROI計算機",
  "rule-of-40-calculator": "Rule of 40計算機",
  "saas-capital-efficiency-calculator": "SaaS資本効率計算機",
  "saas-quick-ratio-calculator": "SaaSクイックレシオ計算機",
  "savings-rate-calculator": "貯蓄率計算機",
  "side-income-tax-calculator": "副業税金計算機",
  "stripe-fee-calculator": "Stripe手数料計算機",
  "student-loan-payoff-calculator": "学生ローン返済計算機",
  "subscription-content-revenue-calculator": "サブスクリプションコンテンツ収益計算機",
  "tam-sam-som-calculator": "TAM SAM SOM計算機",
  "tiktok-creator-fund-calculator": "TikTokクリエイターファンド計算機",
  "time-to-value-calculator": "タイムトゥーバリュー計算機",
  "trial-to-paid-calculator": "トライアル→有料転換率計算機",
  "twitch-revenue-calculator": "Twitch収益計算機",
  "unit-economics-dashboard-calculator": "ユニットエコノミクスダッシュボード計算機",
  "youtube-ad-revenue-calculator": "YouTube広告収益計算機",
};

const jaDescriptions = {
  "activation-rate-calculator": "新規サインアップのうちアクティベーションに達した割合を計算します。",
  "acv-calculator": "年間契約額（ACV）と総契約額（TCV）をサブスクリプション契約ごとに計算します。",
  "affiliate-income-calculator": "トラフィック、クリック率、コンバージョン率、手数料に基づいてアフィリエイトマーケティング収入を予測します。",
  "ai-fine-tuning-cost-calculator": "AIモデルのファインチューニング費用をトレーニング費用と推論費用を含めて計算します。",
  "ai-image-cost-calculator": "DALL-E、Midjourney、Stable Diffusionの画像生成AI費用を比較します。",
  "ai-model-comparison-calculator": "Claude、GPT、GeminiモデルのAPI費用を入出力トークンと日間呼び出し数で比較します。",
  "amazon-fba-calculator": "Amazon FBAの利益率を紹介料、フルフィルメント費用、保管料、広告費を差し引いて計算します。",
  "aov-calculator": "総収益と注文数に基づいて平均注文額（AOV）を計算します。",
  "arpu-calculator": "ユーザーあたりの平均収益（ARPU）を計算して顧客あたりの収益を把握します。",
  "blogging-income-calculator": "広告、アフィリエイト、スポンサーシップ、デジタルプロダクトからのブログ収益の可能性を見積もります。",
  "break-even-calculator": "固定費、変動費、価格に基づいて損益分岐点に達するために必要な販売単位数を計算します。",
  "business-valuation-calculator": "収益倍率とEBITDA倍率を使用して企業価値を評価します。",
  "cac-calculator": "顧客獲得コスト（CAC）を計算して、新規顧客獲得にかかる費用を把握します。",
  "cac-payback-period-enhanced-calculator": "粗利益率を考慮した拡張CAC回収期間を月数と日数で計算します。",
  "cash-runway-calculator": "バーンレートと収益成長率に基づいて、スタートアップの資金が尽きるまでの月数を計算します。",
  "chatgpt-api-cost-calculator": "モデル（GPT-4o、GPT-4、GPT-3.5 Turbo）、トークン数、使用量に応じたOpenAI ChatGPT API費用を計算します。",
  "claude-api-cost-calculator": "モデル（Haiku、Sonnet、Opus）、トークン数、使用量に応じたAnthropic Claude API費用を計算します。",
  "cloud-infrastructure-cost-calculator": "コンピュート、ストレージ、データ転送、マネージドサービスを含む月間・年間のクラウドインフラ費用を見積もります。",
  "cohort-analysis-calculator": "コホート維持率分析を行い、初期コホートのユーザーが複数月にわたってどの程度維持されているかを追跡します。",
  "contractor-vs-employee-calculator": "契約社員と正社員の年間コストを給与、税金、福利厚生、諸経費を含めて比較します。",
  "contribution-margin-calculator": "収益から変動費を差し引いた貢献利益を計算し、単位あたりの収益性を把握します。",
  "conversion-rate-calculator": "訪問者から顧客へのコンバージョン率を総コンバージョン数と非コンバージョン訪問者数で計算します。",
  "cpc-calculator": "総費用とクリック数に基づいて広告キャンペーンのクリック単価（CPC）を計算します。",
  "cpm-calculator": "広告キャンペーンとコンテンツマネタイゼーションのインプレッション単価（CPM）を計算します。",
  "credit-card-payoff-calculator": "現在の返済計画に基づいてクレジットカード債務の完済までの期間と支払利息を計算します。",
  "ctr-calculator": "広告、メール、コンテンツのインプレッション数とクリック数に基づいてクリック率（CTR）を計算します。",
  "customer-engagement-score-calculator": "DAU/MAU比率、セッション頻度、利用時間、機能採用率で顧客エンゲージメントを測定します。",
  "customer-health-score-calculator": "NPS、製品使用状況、サポートチケット、エンゲージメントに基づいてカスタマーヘルススコアを計算します。",
  "debt-payoff-calculator": "現在の返済計画に基づいて借金の完済までの期間と支払利息を計算します。",
  "dividend-income-calculator": "配当金再投資（DRIP）と複利効果を考慮した配当金収入を予測します。",
  "dropshipping-margin-calculator": "商品原価、配送料、プラットフォーム手数料、広告費、返品を考慮したドロップシッピングの利益率を計算します。",
  "emergency-fund-calculator": "支出に基づいて必要な緊急資金の額とその達成期間を計算します。",
  "employee-cost-calculator": "給与、税金、福利厚生、備品、諸経費を含む従業員の真のコストを計算します。",
  "etsy-profit-calculator": "手数料、材料費、配送料、その他費用を差し引いたEtsyストアの利益率を計算します。",
  "expansion-revenue-rate-calculator": "アップセル、クロスセル、アップグレードによる既存顧客からの収益成長率を計算します。",
  "feature-adoption-rate-calculator": "SaaSの機能採用率を計算し、目標採用率とのギャップを測定します。",
  "fire-calculator": "貯蓄、貢献額、投資収益に基づいて経済的自立・早期リタイア（FIRE）への道筋を計算します。",
  "freelance-rate-calculator": "希望収入、請求可能時間、経費、税金に基づいて最適なフリーランス時給を計算します。",
  "gemini-api-cost-calculator": "モデル階層、トークン数、使用量に応じたGoogle Gemini API費用を計算します。",
  "gig-worker-take-home-calculator": "経費と税金を差し引いたライドシェア、配送、ギグエコノミーでの純収入を計算します。",
  "gpu-compute-cost-calculator": "オンデマンド vs スポット価格を含むGPUクラウドコンピュート費用を月間・年間で計算します。",
  "grok-api-cost-calculator": "トークン使用量、モデルバージョン、呼び出し数に基づくxAI Grok API費用を計算します。",
  "gross-margin-calculator": "粗利益率、粗利益、売上原価率を計算してビジネスの収益性を把握します。",
  "investment-returns-calculator": "複利リターンと定期的な貢献額、カスタマイズ可能な期間で投資成長を予測します。",
  "lead-conversion-rate-calculator": "リードの何パーセントが有料顧客に転換するかを計算し、セールスファネルの効率を測定します。",
  "ltv-calculator": "顧客生涯価値（LTV）とLTV:CAC比率をSaaSビジネス向けに計算します。",
  "magic-number-calculator": "SaaSマジックナンバーを計算して営業・マーケティング効率を測定します。",
  "mortgage-affordability-calculator": "収入、負債、頭金、金利に基づいて住宅ローンの借入可能額を28/36ルールで算出します。",
  "mrr-growth-rate-calculator": "SaaS企業の成長軌道を測定するための月次MRR成長率を計算します。",
  "net-cash-flow-calculator": "純キャッシュフロー、バーンレートを計算し、キャッシュフローがプラスかマイナスかを判断します。",
  "newsletter-revenue-calculator": "購読者数とエンゲージメントに基づいて有料購読とスポンサーシップからのニュースレター収入を計算します。",
  "nrr-calculator": "純収益維持率（NRR）を計算して、拡張とダウングレードを含む既存顧客からの収益維持率を測定します。",
  "operating-margin-calculator": "営業利益率（営業利益÷収益）を計算してビジネスの収益性を測定します。",
  "payback-period-calculator": "粗利貢献を通じて顧客獲得コストを回収するまでの月数を計算します。",
  "payment-processing-fee-calculator": "取引手数料、チャージバック費用、実効率を含む決済手数料を計算します。",
  "perplexity-api-cost-calculator": "SonarおよびSonar ProモデルのPerplexity API費用をトークン数と使用量で計算します。",
  "podcast-revenue-calculator": "広告、スポンサーシップ、リスナーサポートからのポッドキャスト収益を見積もります。",
  "pricing-strategy-calculator": "プロダクトやサービスの原価加算、競合ベース、価値ベースの価格戦略を比較します。",
  "print-on-demand-profit-calculator": "商品原価、印刷費、プラットフォーム手数料、配送料を差し引いたPODストアの利益を計算します。",
  "rent-vs-buy-calculator": "住宅ローン、税金、保険、維持費、投資収益を考慮して賃貸と購入の総コストを比較します。",
  "retire-401k-calculator": "企業マッチ、複利成長を含む401k残高を予測し、退職後の収入を見積もります。",
  "revenue-per-employee-calculator": "従業員一人あたりの収益を計算し、業界ベンチマークと比較します。",
  "revenue-per-user-trend-calculator": "前月と今月のデータを比較してARPUの推移を追跡し、ユーザーあたり収益の増減を判定します。",
  "roas-calculator": "広告費用対効果（ROAS）、純収益、広告キャンペーンの利益率を計算します。",
  "roi-calculator": "あらゆるビジネス投資やプロジェクトの投資収益率（ROI）と年率換算ROIを計算します。",
  "rule-of-40-calculator": "収益成長率に利益率を加えたRule of 40スコアを計算してSaaS企業の健全性を測定します。",
  "saas-capital-efficiency-calculator": "投下資本をARR成長にどれだけ効率的に転換できるかを示すSaaS資本効率比率を計算します。",
  "saas-quick-ratio-calculator": "新規および拡大MRRを解約および縮小MRRと比較してSaaSクイックレシオを計算します。",
  "savings-rate-calculator": "収入と支出に基づいて貯蓄率と目標達成までの期間を計算します。",
  "side-income-tax-calculator": "個人事業税、連邦税、州税を含む副業収入の税金を見積もります。",
  "stripe-fee-calculator": "取引手数料、 percentage手数料、月間・年間コストをエンタープライズレートロジックで計算します。",
  "student-loan-payoff-calculator": "学生ローンの返済期間と総支払利息を計算し、スノーボール vs アバランチ戦略を比較します。",
  "subscription-content-revenue-calculator": "OnlyFans、Patreon、FanCentroなどのサブスクリプション型コンテンツプラットフォームの収益を見積もります。",
  "tam-sam-som-calculator": "総獲得可能市場（TAM）、サービス可能獲得可能市場（SAM）、サービス可能獲得市場（SOM）を成長予測とともに計算します。",
  "tiktok-creator-fund-calculator": "視聴回数、地域、エンゲージメント、動画時間に基づいてTikTokクリエイターファンドの支払額を見積もります。",
  "time-to-value-calculator": "SaaSのタイムトゥーバリューを測定し、目標期間内に価値を実現するユーザー数を計算します。",
  "trial-to-paid-calculator": "トライアルユーザーが有料顧客に転換する割合を計算し、トライアルファネルの効率を把握します。",
  "twitch-revenue-calculator": "サブスクリプション、広告、Bits寄付からのTwitch配信収入を見積もります。",
  "unit-economics-dashboard-calculator": "LTV/CAC比率、貢献利益率、回収期間、MRR、顧客あたり粗利益を包括的に追跡します。",
  "youtube-ad-revenue-calculator": "視聴回数、RPM、エンゲージメント指標に基づいてYouTubeチャンネルの収益を見積もります。",
};

const files = readdirSync('calculators/config').filter(f => f.endsWith('.ts')).map(f => path.join('calculators/config', f));

let editedCount = 0;

for (const file of files) {
  if (skipFiles.has(file)) {
    console.log(`Skipping: ${file}`);
    continue;
  }

  const content = readFileSync(file, 'utf-8');
  
  // Extract slug from file path
  const slug = file.replace('calculators/config/', '').replace('.ts', '');
  
  const jaTitle = jaTitles[slug];
  const jaDescription = jaDescriptions[slug];
  
  if (!jaTitle || !jaDescription) {
    console.log(`MISSING TRANSLATION FOR: ${slug}`);
    continue;
  }
  
  // Check if the file already has a locales block (shouldn't since we skip those)
  if (content.includes('locales:')) {
    console.log(`Already has locales (unexpected): ${file}`);
    continue;
  }
  
  // Find the closing of the config object - "} satisfies CalculatorConfig;"
  // Insert the locales block before the closing brace
  const closingPattern = '} satisfies CalculatorConfig;';
  const lastIdx = content.lastIndexOf(closingPattern);
  
  if (lastIdx === -1) {
    console.log(`Cannot find closing pattern in: ${file}`);
    continue;
  }
  
  // Find the last newline before the closing pattern to get the closing brace line
  const beforeClosing = content.substring(0, lastIdx);
  const lastNewline = beforeClosing.lastIndexOf('\n');
  const indent = beforeClosing.substring(lastNewline + 1).match(/^\s*/)[0];
  
  const localesBlock = `  locales: {
    ja: {
      meta: {
        title: "${jaTitle}",
        description: "${jaDescription}",
      },
    },
  },
`;
  
  const newContent = beforeClosing + localesBlock + indent + closingPattern + content.substring(lastIdx + closingPattern.length);
  
  writeFileSync(file, newContent);
  editedCount++;
  console.log(`Edited: ${slug}`);
}

console.log(`\nDone! Edited ${editedCount} files.`);
