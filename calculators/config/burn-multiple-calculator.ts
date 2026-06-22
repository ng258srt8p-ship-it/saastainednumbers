import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "burn-multiple-calculator",
  category: "growth-efficiency" as const,
  meta: {
    title: "Burn Multiple Calculator - SaaS Capital Efficiency Benchmark",
    description: "Measure your SaaS efficiency by calculating your Burn Multiple. Understand how much cash you are burning to generate each dollar of new ARR.",
    keywords: ["burn multiple", "saas burn multiple", "capital efficiency", "net burn", "net new arr", "saas efficiency"],
  },
  benchmarkMetric: "burn-multiple",
  inputs: [
    { id: "netBurn", label: "Net Burn (Amount Lost)", type: "currency" as const, defaultValue: 50000 },
    { id: "netNewARR", label: "Net New ARR", type: "currency" as const, defaultValue: 20000 },
  ],
  outputs: [
    { id: "burnMultiple", label: "Burn Multiple", type: "number" as const, isPrimary: true, suffix: "" },
    { id: "efficiencyRating", label: "Efficiency Rating", type: "text" as const, isPrimary: false },
  ],
  content: {
  intro: "Burn Multiple is a key SaaS metric that measures capital efficiency. It calculates how much cash a company spends to generate each dollar of new Annual Recurring Revenue (ARR). A lower burn multiple indicates a highly efficient growth engine.",
  howToUse: "Enter your net burn for the period and your net new ARR for the same period. The calculator will compute your burn multiple.",
  formulaExplanation: "Burn Multiple = Net Burn / Net New ARR.",
  benchmarks: "A burn multiple below 1.0 is considered world-class efficiency. Between 1.0 and 1.5 is efficient. Above 2.0-2.5 is considered less efficient.",
  benchmarkData: [{"metric": "World-Class Efficiency", "value": "< 1.0", "source": "SaaS Benchmarks"}, {"metric": "Efficient Growth", "value": "1.0 - 1.5", "source": "SaaS Benchmarks"}, {"metric": "Inefficient Growth", "value": "> 2.0", "source": "SaaS Benchmarks"}],
  relatedCalculators: ["cash-runway-calculator", "cac-calculator"],
  faq: [{"question": "Why is burn multiple important for investors?", "answer": "It is a direct measure of how effectively a company is converting cash into ARR. It is a broader efficiency metric than CAC alone, as it accounts for overall spending."}, {"question": "How does burn multiple change as a company scales?", "answer": "Typically, as companies scale and reach more efficient stages, their burn multiple should ideally decrease, indicating improved capital efficiency."}, {"question": "What is the relationship between burn multiple and CAC?", "answer": "While CAC focuses on the cost of one customer, burn multiple focuses on the efficiency of the entire company's growth spending. A low CAC is useless if the rest of the company's burn is inefficient."}]
},
  locales: {
    es: {
      meta: {
        title: "Calculadora Burn Multiple - Referencia de Eficiencia de Capital SaaS",
        description: "Mida la eficiencia de su empresa SaaS calculando su Burn Multiple. Entienda cuánto efectivo está quemando para generar cada dólar de nuevo ARR.",
      },
      content: {
        intro: "El Burn Multiple es una métrica de eficiencia crítica para las empresas SaaS que mide cuánto efectivo está quemando una empresa para generar cada dólar de nuevo Ingreso Recurrente Anual (ARR). Es un indicador clave de la eficiencia del capital, especialmente para las startups respaldadas por capital de riesgo.",
        howToUse: "Introduzca su quema neta (la cantidad total de efectivo que pierde la empresa en un periodo) y su nuevo ARR neto (el aumento de ARR de nuevos clientes y de expansión menos el churn/contracción). La calculadora proporcionará su Burn Multiple y una calificación de eficiencia basada en estándares de la industria.",
        formulaExplanation: "Fórmula: Burn Multiple = Quema Neta / Nuevo ARR Neto. Ejemplo: Si una empresa pierde \$50,000 en un mes (Quema Neta) y añade \$20,000 en Nuevo ARR Neto, el Burn Multiple es 50,000 / 20,000 = 2,5.",
        benchmarks: "El Burn Multiple es un estándar para evaluar la eficiencia en SaaS. Los benchmarks generales de mercado sugieren: <br>• **Menos de 1.0:** Altamente eficiente (genera más ARR que quema). <br>• **1.0 - 1.5:** Eficiente (estándar para startups de alto crecimiento). <br>• **1.5 - 2.5:** Moderado (típico para empresas en fase de crecimiento). <br>• **Más de 2.5:** Ineficiente (quema efectivo significativamente en relación con el crecimiento).",
        benchmarkData: [
          { metric: "Altamente Eficiente", value: "< 1.0", source: "SaaS Benchmarks" },
          { metric: "Eficiente", value: "1.0 - 1.5", source: "SaaS Benchmarks" },
          { metric: "Moderado", value: "1.5 - 2.5", source: "SaaS Benchmarks" },
          { metric: "Ineficiente", value: "> 2.5", source: "SaaS Benchmarks" },
        ],
        relatedCalculators: ["rule-of-40-calculator", "cash-runway-calculator", "cac-ltv-ratio-calculator"],
        faq: [
          { question: "¿Cuál es un 'Buen' Burn Multiple?", answer: "Un Burn Multiple por debajo de 1.5 es típicamente considerado eficiente para las empresas SaaS en crecimiento. Lo ideal es generar más nuevo ARR que lo que quema." },
          { question: "¿Por qué es importante el Burn Multiple para los inversores?", answer: "Los inversores usan el Burn Multiple para ver si una empresa está escalando su crecimiento de manera eficiente. Una empresa que está quemando mucho efectivo pero genera muy poco nuevo ARR es una señal de alerta importante para la sostenibilidad." },
        ],
      },
    },
    de: {
      meta: {
        title: "Burn Multiple Rechner - SaaS Kapitaleffizienz Benchmark",
        description: "Messen Sie die Effizienz Ihres SaaS-Unternehmens mit dem Burn Multiple. Verstehen Sie, wie viel Bargeld Sie verbrennen, um jeden Dollar an neuem ARR zu generieren.",
      },
      content: {
        intro: "Das Burn Multiple ist eine entscheidende SaaS-Effizienzmetrik, die misst, wie viel Bargeld ein Unternehmen verbrennt, um jeden Dollar an neuem ARR zu generieren. Es ist ein Schlüsselindikator für die Kapitaleffizienz, insbesondere für Venture-Backed Startups.",
        howToUse: "Geben Sie Ihr Net Burn (den Gesamtbetrag, den das Unternehmen in einem Zeitraum verliert) und Ihr Net New ARR (die Zunahme des ARR von neuen und expandierenden Kunden abzüglich Churn/Kontraktion) ein. Der Rechner ist nach Branchenstandards basierend auf dem Burn Multiple konfiguriert.",
        formulaExplanation: "Formel: Burn Multiple = Net Burn / Net New ARR. Beispiel: Wenn ein Unternehmen 50.000 $ in einem Monat (Net Burn) verliert und 20.000 $ an Net New ARR generiert, beträgt das Burn Multiple 50.000 / 20,000 = 2,5. Ein niedrigerer Wert ist besser.",
        benchmarks: "Das Burn Multiple ist ein Benchmark für die Bewertung der SaaS-Effizienz. Während es keine universelle Standardmetrik ist, deuten allgemeine Markttrends auf Folgendes hin: <br>• **Unter 1,0:** Hochgradig effizient (erzeugt mehr ARR als er verbrennt). <br>• **1,0 - 1.5:** Effizient (Standard für hochwachsende Startups). <br>• **1,5 - 2.5:** Moderat (typisch für Unternehmen in der Wachstumsphase). <br>• **Über 2.5:** Ineffizient (verbrennt signifikant viel Cash, im Verhältnis zum Wachstum).",
        benchmarkData: [
          { metric: "Hochgradig effizient", value: "< 1.0", source: "SaaS Benchmarks" },
          { metric: "Effizient", value: "1.0 - 1.5", source: "SaaS Benchmarks" },
          { metric: "Moderat", value: "1.5 - 2.5", source: "SaaS Benchmarks" },
          { metric: "Inefficient", value: "> 2.5", source: "SaaS Benchmarks" },
        ],
        relatedCalculators: ["rule-of-40-calculator", "cash-runway-calculator", "cac-ltv-ratio-calculator"],
        faq: [
          { question: "Was ist ein 'gutes' Burn Multiple?", answer: "Ein Burn Multiple unter 1,5 ist für wachsende SaaS-Unternehmen typischerweise als effizient zu sehen. Das Ziel ist es, mehr neue ARR zu generieren, als man verbrennt." },
          { question: "Warum ist das Burn Multiple wichtig für Investoren?", answer: "Investoren nutzen das Burn Multiple, um zu sehen, ob ein Unternehmen sein Wachstum effizient skaliert. Ein Unternehmen, das viel Bargeld verbrennt, aber nur wenig neues ARR generiert, ist ein großes Warnsignal für die Nachhaltigkeit." },
        ],
      },
    },
    fr: {
      meta: {
        title: "Calculateur Burn Multiple - Benchmark d'Efficience du Capital SaaS",
        description: "Mesurez l'efficacité de votre entreprise SaaS avec le Burn Multiple. Comprenez combien de capital vous brûlez pour générer chaque dollar de nouvel ARR.",
      },
      content: {
        intro: "Le Burn Multiple est une métrique d'efficacité cruciale pour les entreprises SaaS, mesurant combien de capital une entreprise brûle pour générer chaque dollar de nouvel ARR. C'est un indicateur clé de l'efficacité du capital, surtout pour les startups à forte croissance.",
        howToUse: "Saisissez votre Net Burn (le montant total que l'entreprise perd dans une période) et votre Net New ARR (l'augmentation du ARR de nouveaux clients et des clients existants moins le churn/contraction). Le calculateur vous donnera votre Burn Multiple et une évaluation de l'efficacité selon les standards de l'industrie.",
        formulaExplanation: "Formule : Burn Multiple = Net Burn / Net New ARR. Exemple : Si une entreprise perd 50 000 € en un mois (Net Burn) et génère 20 000 € de Net New ARR, le Burn Multiple est 50 000 / 20 000 = 2,5. Un chiffre plus bas est meilleur.",
        benchmarks: "Le Burn Multiple est un benchmark pour évaluer l'efficacité SaaS. Les tendances du marché suggèrent: <br>• **Moins de 1,0:** Éfficience maximale (génère plus d'ARR que ce qu'elle brûle). <br>• **1,0 - 1.5:** Efficience (standard pour les startups à croissance rapide). <br>• **1,5 - 2.5:** Efficience modérée. <br>• **> 2,5:** Inefficience (brûle significativement plus de cash que sa croissance).",
        benchmarkData: [
          { metric: "Haute Efficience", value: "< 1.0", source: "SaaS Benchmarks" },
          { metric: "Efficience", value: "1.0 - 1.5", source: "SaaS Benchmarks" },
          { metric: "Efficience Modérée", value: "1.5 - 2.5", source: "SaaS Benchmarks" },
          { metric: "Inefficience", value: "> 2.5", source: "SaaS Benchmarks" },
        ],
        relatedCalculators: ["rule-of-40-calculator", "cash-runway-calculator", "cac-ltv-ratio-calculator"],
        faq: [
          { question: "Quel est un 'Bon' Burn Multiple?", answer: "Un Burn Multiple inférieur à 1,5 est généralement considéré comme efficace pour les entreprises SaaS en croissance. L'objectif est de generar más nuevo ARR que lo que quima" },
          { question: "Pourquoi le Burn Multiple est-il important pour les investisseurs?", answer: "Les investisseurs utilisent le Burn Multiple pour voir si une entreprise scale son croissance efficacement. Une entreprise qui brûle beaucoup de cash mais génère peu de nouvel ARR est un signal d'alerte majeur." },
        ],
      },
    },
    pt: {
      meta: {
        title: "Calculadora Burn Multiple - Benchmark de Eficiência de Capital SaaS",
        description: "Meça a eficiência da sua empresa SaaS calculando o seu Burn Multiple. Entenda quanto caixa você está queimando para gerar cada dólar de novo ARR.",
      },
      content: {
        intro: "O Burn Multiple é uma métrica de eficiência crítica para empresas SaaS, medindo quanto caixa uma empresa queima para gerar cada dólar de novo Receita Recorrente Anual (ARR). É um indicador chave de eficiência de capital, especialmente para startups de alto crescimento.",
        howToUse: "Insira seu Net Burn (o valor total de caixa que a empresa perde em um período) e seu Net New ARR (o aumento de ARR de novos clientes e expansão menos churn/contração). A calculadora fornecerá seu Burn Multiple e uma classificação de eficiência baseada em padrões de mercado.",
        formulaExplanation: "Fórmula: Burn Multiple = Net Burn / Net New ARR. Exemplo: Se uma empresa perde \$50.000 em um mês (Net Burn) e adiciona \$20.000 em Net New ARR, o Burn Multiple é 50.000 / 20.000 = 2,5. Um número menor é melhor.",
        benchmarks: "O Burn Multiple é um padrão para avaliar a eficiência em SaaS. As tendências de mercado sugerem: <br>• **Menos de 1.0:** Altamente eficiente (gera mais ARR do que queima). <br>• **1.0 - 1.5:** Eficiente (padrão para startups de alto crescimento). <br>• **1.5 - 2.5:** Moderado (típico para empresas em fase de crescimento). <br>• **Acima de 2.5:** Ineficiente (queima muito caixa em relação ao crescimento).",
        benchmarkData: [
          { metric: "Altamente Eficiente", value: "< 1.0", source: "SaaS Benchmarks" },
          { metric: "Eficiente", value: "1.0 - 1.5", source: "SaaS Benchmarks" },
          { metric: "Moderado", value: "1.5 - 2.5", source: "SaaS Benchmarks" },
          { metric: "Ineficiente", value: "> 2.5", source: "SaaS Benchmarks" },
        ],
        relatedCalculators: ["rule-of-40-calculator", "cash-runway-calculator", "cac-ltv-ratio-calculator"],
        faq: [
          { question: "Qual é um 'Bom' Burn Multiple?", answer: "Um Burn Multiple abaixo de 1,5 é geralmente considerado eficiente para empresas SaaS em crescimento. O ideal é gerar mais novo ARR do que o que você queima." },
          { question: "Por que o Burn Multiple é importante para investidores?", answer: "Investidores usam o Burn Multiple para ver se uma empresa está escalando seu crescimento de forma eficiente. Uma empresa que queima muito caixa mas gera pouco novo ARR é um sinal de alerta para sustentabilidade." },
        ],
      },
    },
    ja: {
      meta: {
        title: "Burn Multiple 計算機 - SaaS 資本効率ベンチマーク",
        description: "Burn Multiple を計算して SaaS 企業の効率性を測定します。新しい ARR を生成するために、いくらキャッシュを消費しているかを確認しましょう。",
      },
      content: {
        intro: "Burn Multiple は、企業が新しい年間経常収益 (ARR) を生成するためにいくらキャッシュを消費しているかを測定する、SaaS の重要な効率指標です。これは、特にベンチャーキャピタルが支援するスタートアップにとって、資本効率の主要な指標となります。",
        howToUse: "純燃焼額 (Net Burn: 一定期間に企業が失うキャッシュの総額) と純新規 ARR (Net New ARR: 新規および拡大顧客による ARR の増加額から解約/縮小を引いたもの) を入力してください。業界標準に基づいた Burn Multiple と効率評価が表示されます。",
        formulaExplanation: "数式: Burn Multiple = 純燃焼額 / 純新規 ARR。例: ある企業が 1 ヶ月間に 50,000 ドルの純燃焼（Net Burn）を記録し、20,000 ドルの純新規 ARR を生成した場合、Burn Multiple は 50,000 / 20,000 = 2.5 となります。数値が低いほど効率的です。",
        benchmarks: "Burn Multiple は、SaaS の効率を評価するための標準的な指標です。普遍的な基準はありませんが、一般的な市場動向は以下の通りです: <br>• **1.0未満:** 非常に効率的 (消費するキャッシュよりも多くの ARR を生成している). <br>• **1.0 - 1.5:** 効率的 (高成長スタートアップの標準). <br>• **1.5 - 2.5:** 中程度 (成長段階にある企業に典型的). <br>• **2.5超:** 非効率 (成長に対してかなりのキャッシュを消費している).",
        benchmarkData: [
          { metric: "非常に効率的", value: "< 1.0", source: "SaaS ベンチマーク" },
          { metric: "効率的", value: "1.0 - 1.5", source: "SaaS ベンチマーク" },
          { metric: "中程度", value: "1.5 - 2.5", source: "SaaS ベンチマーク" },
          { metric: "非効率", value: "> 2.5", source: "SaaS ベンチマーク" },
        ],
        relatedCalculators: ["rule-of-40-calculator", "cash-runway-calculator", "cac-ltv-ratio-calculator"],
        faq: [
          { question: "「良い」Burn Multiple とは？", answer: "成長中の SaaS 企業にとって、1.5 未満の Burn Multiple は一般的に効率的と見なされます。理想的には、消費するキャッシュよりも多くの新規 ARR を生成することです。" },
          { question: "なぜ Burn Multiple は投資家にとって重要なのか？", answer: "投資家は Burn Multiple を使用して、企業が効率的に成長しているかどうかを確認します。成長に対して非常に多くのキャッシュを消費している企業は、持続可能性の大きな警告サインとなります。" },
        ],
      },
    },
  },
};

registerCalculator(config);
export default config;
