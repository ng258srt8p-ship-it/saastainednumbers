import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "cac-ltv-ratio-calculator",
  category: "unit-economics",
  meta: {
    title: "CAC to LTV Ratio Calculator",
    description: "Calculate your LTV to CAC ratio  -  the most important unit economics metric for SaaS businesses.",
    keywords: ["ltv cac ratio", "unit economics", "saas metrics", "customer lifetime value", "acquisition cost"],
  },
  benchmarkMetric: "ltv-cac",
  inputs: [
    { id: "ltv", label: "Customer Lifetime Value (LTV)", type: "currency" as const, defaultValue: 3000 },
    { id: "cac", label: "Customer Acquisition Cost (CAC)", type: "currency" as const, defaultValue: 1000 },
  ],
  outputs: [
    { id: "ratio", label: "LTV:CAC Ratio", type: "number" as const, isPrimary: true },
  ],
  content: {
    intro: "The LTV:CAC ratio compares the total value a customer generates over their lifetime to the cost of acquiring them. It is the single most important unit economics metric for SaaS businesses. A ratio of 3:1 is the industry standard for a healthy business  -  meaning each customer generates three times what it costs to acquire them. Below 1:1 means you're spending more to acquire customers than they're worth. Above 5:1 suggests you may be under-investing in growth. This calculator gives you a quick health check on your unit economics.",
    howToUse: "Enter your average Customer Lifetime Value (LTV) and Customer Acquisition Cost (CAC). The calculator will compute your LTV:CAC ratio. Use it to evaluate overall business health or compare different customer segments and channels.",
    formulaExplanation: "LTV:CAC Ratio = LTV ÷ CAC. Example: LTV = $3,000, CAC = $1,000. Ratio = $3,000 ÷ $1,000 = 3.0. A ratio of 3.0 means each customer generates 3x their acquisition cost in lifetime value. A ratio of 1.0 is break-even; above 3.0 is healthy.",
    benchmarks: "Industry standard for SaaS is 3:1. Below 1:1 is unsustainable  -  you lose money on every customer. Above 5:1 may indicate under-investment in growth. According to SaaS Capital, the median private SaaS company has an LTV:CAC ratio of 3.2. Top-quartile companies achieve 5.0+ while still growing rapidly.",
    benchmarkData: [
      { metric: "Excellent LTV:CAC", value: "5.0+", source: "SaaS Capital" },
      { metric: "Good LTV:CAC", value: "3.0 - 5.0", source: "General benchmark" },
      { metric: "Acceptable LTV:CAC", value: "2.0 - 3.0", source: "SaaS Capital" },
      { metric: "Needs Improvement", value: "1.0 - 2.0", source: "General benchmark" },
      { metric: "Unsustainable", value: "< 1.0", source: "General benchmark" },
    ],
    relatedCalculators: ["cac-calculator", "ltv-calculator", "payback-period-calculator"],
    faq: [
      { question: "What is a good LTV:CAC ratio?", answer: "3:1 or higher is healthy. Below 1:1 means you lose money on each customer. Above 5:1 may signal under-investment  -  you could profitably spend more on acquisition to grow faster." },
      { question: "How do I improve my LTV:CAC ratio?", answer: "Increase LTV through better retention, higher pricing, or expansion revenue. Reduce CAC through channel optimization or product-led growth. Both approaches improve the ratio. Use [Baremetrics](https://baremetrics.com?via=saastainednumbers) to track LTV:CAC across customer segments automatically." },
      { question: "Should I calculate LTV:CAC by channel?", answer: "Yes. Different channels have dramatically different ratios. Paid ads might have 2:1, while referrals might have 10:1. Channel-level analysis reveals where to invest." },
      { question: "What does a declining LTV:CAC ratio mean?", answer: "It means either LTV is decreasing (worse retention, lower pricing) or CAC is increasing (more expensive channels, sales inefficiency). Investigate the root cause." },
      { question: "How does LTV:CAC relate to payback period?", answer: "They're complementary. LTV:CAC measures overall return; payback period measures how long to recover CAC. A 3:1 ratio with 6-month payback is healthier than 3:1 with 18-month payback." },
      { question: "Is a very high LTV:CAC always good?", answer: "Not necessarily. A 10:1 ratio might mean you're under-investing in growth. If you can profitably acquire customers at a 3:1 ratio, you should spend more to capture market share." },
      { question: "How does LTV:CAC vary by business model?", answer: "Enterprise SaaS typically has higher ratios (5:1+) due to longer customer relationships. SMB SaaS often has lower ratios (2-3:1) due to higher churn. Marketplaces may have 10:1+." },
      { question: "What is a healthy LTV:CAC for a new product?", answer: "Early-stage products often have ratios below 2:1 while finding product-market fit. The target should be reaching 3:1 within 12-18 months of launch." },
    ],
  },
  locales: {
    es: {
      meta: {
        title: "Calculadora de Ratio CAC a LTV",
        description: "Calcula tu ratio LTV a CAC, la métrica de economía unitaria más importante para negocios SaaS.",
      },
      inputs: [
        { id: "ltv", label: "Valor de Vida del Cliente (LTV)" },
        { id: "cac", label: "Costo de Adquisición de Cliente (CAC)" },
      ],
      outputs: [
        { id: "ratio", label: "Ratio LTV:CAC" },
      ],
      content: {
        intro: "El ratio LTV:CAC compara el valor total que genera un cliente durante su vida con el costo de adquirirlo. Es la métrica de economía unitaria más importante para negocios SaaS. Un ratio de 3:1 es el estándar de la industria para un negocio saludable; lo que significa que cada cliente genera tres veces lo que cuesta adquirirlo. Por debajo de 1:1 significa que estás gastando más en adquirir clientes de lo que valen. Por encima de 5:1 sugiere que podrías estar subinvirtiendo en crecimiento.",
        howToUse: "Ingresa tu Valor de Vida del Cliente (LTV) y Costo de Adquisición de Cliente (CAC) promedio. La calculadora calculará tu ratio LTV:CAC. Úsalo para evaluar la salud general del negocio o comparar diferentes segmentos de clientes y canales.",
        formulaExplanation: "Ratio LTV:CAC = LTV ÷ CAC. Ejemplo: LTV = $3,000, CAC = $1,000. Ratio = $3,000 ÷ $1,000 = 3.0. Un ratio de 3.0 significa que cada cliente genera 3x su costo de adquisición en valor de vida.",
         benchmarks: "El estándar de la industria para SaaS es 3:1. Por debajo de 1:1 es insostenible; pierdes dinero en cada cliente. Por encima de 5:1 puede indicar subinversión en crecimiento. La empresa SaaS privada mediana tiene un ratio LTV:CAC de 3.2.",
        benchmarkData: [
          { metric: "Excelente LTV:CAC", value: "5.0+", source: "SaaS Capital" },
          { metric: "Buen LTV:CAC", value: "3.0 - 5.0", source: "Estándar de la Industria" },
          { metric: "Aceptable LTV:CAC", value: "2.0 - 3.0", source: "SaaS Capital" },
          { metric: "Necesita Mejora", value: "1.0 - 2.0", source: "Estándar de la Industria" },
          { metric: "Insostenible", value: "< 1.0", source: "Estándar de la Industria" },
        ],
        faq: [
          { question: "¿Qué es un buen ratio LTV:CAC?", answer: "3:1 o superior es saludable. Por debajo de 1:1 significa que pierdes dinero en cada cliente. Por encima de 5:1 puede indicar subinversión." },
          { question: "¿Cómo mejoro mi ratio LTV:CAC?", answer: "Aumenta el LTV mediante una mejor retención, precios más altos o ingresos por expansión. Reduce el CAC mediante la optimización de canales o crecimiento impulsado por el producto." },
          { question: "¿Debo calcular el LTV:CAC por canal?", answer: "Sí. Diferentes canales tienen ratios drásticamente diferentes. Los anuncios pagados podrían tener 2:1, mientras que las referencias podrían tener 10:1." },
          { question: "¿Qué significa un ratio LTV:CAC decreciente?", answer: "Significa que el LTV está disminuyendo (peor retención, precios más bajos) o que el CAC está aumentando (canales más caros, ineficiencia de ventas)." },
          { question: "¿Cómo se relaciona el LTV:CAC con el período de recuperación?", answer: "Son complementarios. El LTV:CAC mide el retorno general; el período de recuperación mide cuánto tiempo se tarda en recuperar el CAC." },
          { question: "¿Un LTV:CAC muy alto siempre es bueno?", answer: "No necesariamente. Un ratio de 10:1 podría significar que estás subinvirtiendo en crecimiento. Si puedes adquirir clientes rentablemente con un ratio de 3:1, deberías gastar más." },
          { question: "¿Cómo varía el LTV:CAC según el modelo de negocio?", answer: "El SaaS empresarial típicamente tiene ratios más altos (5:1+). El SaaS para PYMES a menudo tiene ratios más bajos (2-3:1). Los marketplaces pueden tener 10:1+." },
          { question: "¿Cuál es un LTV:CAC saludable para un producto nuevo?", answer: "Los productos en etapa temprana a menudo tienen ratios por debajo de 2:1. El objetivo debería ser alcanzar 3:1 dentro de 12-18 meses del lanzamiento." },
        ],
      },
    },
    de: {
      meta: {
        title: "CAC-zu-LTV-Verhältnis-Rechner",
        description: "Berechne dein LTV-zu-CAC-Verhältnis – die wichtigste Kennzahl der Unit Economics für SaaS-Unternehmen.",
      },
      inputs: [
        { id: "ltv", label: "Customer Lifetime Value (LTV)" },
        { id: "cac", label: "Customer Acquisition Cost (CAC)" },
      ],
      outputs: [
        { id: "ratio", label: "LTV:CAC-Verhältnis" },
      ],
      content: {
        intro: "Das LTV:CAC-Verhältnis vergleicht den Gesamtwert, den ein Kunde während seiner Lebensdauer generiert, mit den Kosten für seine Akquise. Es ist die wichtigste Kennzahl der Unit Economics für SaaS-Unternehmen. Ein Verhältnis von 3:1 ist der Industriestandard für ein gesundes Unternehmen – das bedeutet, jeder Kunde generiert das Dreifache seiner Akquisitionskosten. Unter 1:1 bedeutet, dass du mehr für die Kundenakquise ausgibst, als sie wert sind. Über 5:1 deutet darauf hin, dass du möglicherweise zu wenig in Wachstum investierst.",
        howToUse: "Gib deinen durchschnittlichen Customer Lifetime Value (LTV) und deine Customer Acquisition Cost (CAC) ein. Der Rechner berechnet dein LTV:CAC-Verhältnis. Nutze es, um die allgemeine Geschäftsgesundheit zu bewerten oder verschiedene Kundensegmente und Kanäle zu vergleichen.",
        formulaExplanation: "LTV:CAC-Verhältnis = LTV ÷ CAC. Beispiel: LTV = 3.000 $, CAC = 1.000 $. Verhältnis = 3.000 $ ÷ 1.000 $ = 3,0. Ein Verhältnis von 3,0 bedeutet, dass jeder Kunde das 3-fache seiner Akquisitionskosten an Lebenszeitwert generiert.",
        benchmarks: "Der Industriestandard für SaaS ist 3:1. Unter 1:1 ist nicht nachhaltig – du verlierst Geld bei jedem Kunden. Über 5:1 kann auf Unterinvestition in Wachstum hindeuten. Das mittlere private SaaS-Unternehmen hat ein LTV:CAC-Verhältnis von 3,2.",
        benchmarkData: [
          { metric: "Hervorragendes LTV:CAC", value: "5.0+", source: "SaaS Capital" },
          { metric: "Gutes LTV:CAC", value: "3.0 - 5.0", source: "Industriestandard" },
          { metric: "Akzeptables LTV:CAC", value: "2.0 - 3.0", source: "SaaS Capital" },
          { metric: "Verbesserungsbedürftig", value: "1.0 - 2.0", source: "Industriestandard" },
          { metric: "Nicht nachhaltig", value: "< 1.0", source: "Industriestandard" },
        ],
        faq: [
          { question: "Was ist ein gutes LTV:CAC-Verhältnis?", answer: "3:1 oder höher ist gesund. Unter 1:1 verlierst du Geld bei jedem Kunden. Über 5:1 kann auf Unterinvestition hindeuten." },
          { question: "Wie kann ich mein LTV:CAC-Verhältnis verbessern?", answer: "Erhöhe den LTV durch bessere Kundenbindung, höhere Preise oder Expansion Revenue. Reduziere den CAC durch Kanaloptimierung oder produktgesteuertes Wachstum." },
          { question: "Sollte ich LTV:CAC nach Kanal berechnen?", answer: "Ja. Verschiedene Kanäle haben drastisch unterschiedliche Verhältnisse. Bezahlte Anzeigen könnten 2:1 haben, während Empfehlungen 10:1 haben könnten." },
          { question: "Was bedeutet ein sinkendes LTV:CAC-Verhältnis?", answer: "Es bedeutet entweder, dass der LTV sinkt (schlechtere Bindung, niedrigere Preise) oder der CAC steigt (teurere Kanäle, Vertriebsineffizienz)." },
          { question: "Wie hängt LTV:CAC mit der Amortisationszeit zusammen?", answer: "Sie sind komplementär. LTV:CAC misst die Gesamtrendite; die Amortisationszeit misst, wie lange es dauert, den CAC wieder einzuspielen." },
          { question: "Ist ein sehr hohes LTV:CAC immer gut?", answer: "Nicht unbedingt. Ein Verhältnis von 10:1 könnte bedeuten, dass du zu wenig in Wachstum investierst. Wenn du Kunden profitabel mit einem Verhältnis von 3:1 gewinnen kannst, solltest du mehr ausgeben." },
          { question: "Wie variiert LTV:CAC nach Geschäftsmodell?", answer: "Enterprise SaaS hat typischerweise höhere Verhältnisse (5:1+). SMB SaaS hat oft niedrigere Verhältnisse (2-3:1). Marktplätze können 10:1+ haben." },
          { question: "Was ist ein gesundes LTV:CAC für ein neues Produkt?", answer: "Frühphasenprodukte haben oft Verhältnisse unter 2:1. Das Ziel sollte sein, innerhalb von 12-18 Monaten nach dem Start 3:1 zu erreichen." },
        ],
      },
    },
    pt: {
      meta: {
        title: "Calculadora de Relação CAC para LTV",
        description: "Calcule sua relação LTV para CAC – a métrica de economia unitária mais importante para negócios SaaS.",
      },
      inputs: [
        { id: "ltv", label: "Valor do Tempo de Vida do Cliente (LTV)" },
        { id: "cac", label: "Custo de Aquisição de Cliente (CAC)" },
      ],
      outputs: [
        { id: "ratio", label: "Relação LTV:CAC" },
      ],
      content: {
        intro: "A relação LTV:CAC compara o valor total que um cliente gera durante sua vida com o custo de adquiri-lo. É a métrica de economia unitária mais importante para negócios SaaS. Uma relação de 3:1 é o padrão da indústria para um negócio saudável; significando que cada cliente gera três vezes o custo para adquiri-lo. Abaixo de 1:1 significa que você está gastando mais para adquirir clientes do que eles valem. Acima de 5:1 sugere que você pode estar subinvestindo em crescimento.",
        howToUse: "Insira seu Valor de Vida do Cliente (LTV) e Custo de Aquisição de Cliente (CAC) médios. A calculadora calculará sua relação LTV:CAC. Use-a para avaliar a saúde geral do negócio ou comparar diferentes segmentos de clientes e canais.",
        formulaExplanation: "Relação LTV:CAC = LTV ÷ CAC. Exemplo: LTV = $3.000, CAC = $1.000. Relação = $3.000 ÷ $1.000 = 3,0. Uma relação de 3,0 significa que cada cliente gera 3x seu custo de aquisição em valor de vida.",
        benchmarks: "O padrão da indústria para SaaS é 3:1. Abaixo de 1:1 é insustentável; você perde dinheiro em cada cliente. Acima de 5:1 pode indicar subinvestimento em crescimento. A empresa SaaS privada mediana tem uma relação LTV:CAC de 3,2.",
        benchmarkData: [
          { metric: "Excelente LTV:CAC", value: "5.0+", source: "SaaS Capital" },
          { metric: "Bom LTV:CAC", value: "3.0 - 5.0", source: "Padrão da Indústria" },
          { metric: "Aceitável LTV:CAC", value: "2.0 - 3.0", source: "SaaS Capital" },
          { metric: "Precisa Melhorar", value: "1.0 - 2.0", source: "Padrão da Indústria" },
          { metric: "Insustentável", value: "< 1.0", source: "Padrão da Indústria" },
        ],
        faq: [
          { question: "O que é uma boa relação LTV:CAC?", answer: "3:1 ou superior é saudável. Abaixo de 1:1 significa que você perde dinheiro em cada cliente. Acima de 5:1 pode indicar subinvestimento." },
          { question: "Como melhorar minha relação LTV:CAC?", answer: "Aumente o LTV através de melhor retenção, preços mais altos ou receita de expansão. Reduza o CAC através da otimização de canais ou crescimento orientado pelo produto." },
          { question: "Devo calcular o LTV:CAC por canal?", answer: "Sim. Diferentes canais têm relações drasticamente diferentes. Anúncios pagos podem ter 2:1, enquanto indicações podem ter 10:1." },
          { question: "O que significa uma relação LTV:CAC em declínio?", answer: "Significa que o LTV está diminuindo (pior retenção, preços mais baixos) ou o CAC está aumentando (canais mais caros, ineficiência de vendas)." },
          { question: "Como o LTV:CAC se relaciona com o período de retorno?", answer: "Eles são complementares. O LTV:CAC mede o retorno geral; o período de retorno mede quanto tempo leva para recuperar o CAC." },
          { question: "Um LTV:CAC muito alto é sempre bom?", answer: "Não necessariamente. Uma relação de 10:1 pode significar que você está subinvestindo em crescimento. Se você pode adquirir clientes lucrativamente com uma relação de 3:1, deve gastar mais." },
          { question: "Como o LTV:CAC varia por modelo de negócio?", answer: "SaaS empresarial tipicamente tem relações mais altas (5:1+). SaaS para PMEs geralmente tem relações mais baixas (2-3:1). Marketplaces podem ter 10:1+." },
          { question: "O que é um LTV:CAC saudável para um novo produto?", answer: "Produtos em estágio inicial geralmente têm relações abaixo de 2:1. O objetivo deve ser alcançar 3:1 dentro de 12-18 meses após o lançamento." },
        ],
      },
    },
    fr: {
      meta: {
        title: "Calculateur du Ratio CAC/LTV",
        description: "Calculez votre ratio LTV/CAC – la mesure d'économie unitaire la plus importante pour les entreprises SaaS.",
      },
      inputs: [
        { id: "ltv", label: "Valeur à Vie du Client (LTV)" },
        { id: "cac", label: "Coût d'Acquisition Client (CAC)" },
      ],
      outputs: [
        { id: "ratio", label: "Ratio LTV:CAC" },
      ],
      content: {
        intro: "Le ratio LTV:CAC compare la valeur totale qu'un client génère sur sa durée de vie au coût de son acquisition. C'est la mesure d'économie unitaire la plus importante pour les entreprises SaaS. Un ratio de 3:1 est la norme du secteur pour une entreprise saine; ce qui signifie que chaque client génère trois fois ce qu'il coûte à acquérir. En dessous de 1:1 signifie que vous dépensez plus pour acquérir des clients qu'ils ne valent. Au-dessus de 5:1 suggère que vous sous-investissez peut-être dans la croissance.",
        howToUse: "Entrez votre Valeur à Vie du Client (LTV) et votre Coût d'Acquisition Client (CAC) moyens. Le calculateur calculera votre ratio LTV:CAC. Utilisez-le pour évaluer la santé globale de l'entreprise ou comparer différents segments de clients et canaux.",
        formulaExplanation: "Ratio LTV:CAC = LTV ÷ CAC. Exemple : LTV = 3 000 $, CAC = 1 000 $. Ratio = 3 000 $ ÷ 1 000 $ = 3,0. Un ratio de 3,0 signifie que chaque client génère 3 fois son coût d'acquisition en valeur à vie.",
        benchmarks: "La norme du secteur pour le SaaS est de 3:1. En dessous de 1:1 est insoutenable; vous perdez de l'argent sur chaque client. Au-dessus de 5:1 peut indiquer un sous-investissement dans la croissance. L'entreprise SaaS privée médiane a un ratio LTV:CAC de 3,2.",
        benchmarkData: [
          { metric: "Excellent LTV:CAC", value: "5.0+", source: "SaaS Capital" },
          { metric: "Bon LTV:CAC", value: "3.0 - 5.0", source: "Norme du Secteur" },
          { metric: "Acceptable LTV:CAC", value: "2.0 - 3.0", source: "SaaS Capital" },
          { metric: "À Améliorer", value: "1.0 - 2.0", source: "Norme du Secteur" },
          { metric: "Insoutenable", value: "< 1.0", source: "Norme du Secteur" },
        ],
        faq: [
          { question: "Qu'est-ce qu'un bon ratio LTV:CAC ?", answer: "3:1 ou plus est sain. En dessous de 1:1, vous perdez de l'argent sur chaque client. Au-dessus de 5:1 peut indiquer un sous-investissement." },
          { question: "Comment améliorer mon ratio LTV:CAC ?", answer: "Augmentez le LTV grâce à une meilleure rétention, des prix plus élevés ou des revenus d'expansion. Réduisez le CAC grâce à l'optimisation des canaux ou à une croissance pilotée par le produit." },
          { question: "Dois-je calculer le LTV:CAC par canal ?", answer: "Oui. Différents canaux ont des ratios radicalement différents. Les annonces payantes peuvent avoir 2:1, tandis que le parrainage peut avoir 10:1." },
          { question: "Que signifie un ratio LTV:CAC en baisse ?", answer: "Cela signifie soit que le LTV diminue (moins bonne rétention, prix plus bas), soit que le CAC augmente (canaux plus chers, inefficacité des ventes)." },
          { question: "Comment le LTV:CAC est-il lié à la période de récupération ?", answer: "Ils sont complémentaires. Le LTV:CAC mesure le rendement global ; la période de récupération mesure le temps nécessaire pour récupérer le CAC." },
          { question: "Un LTV:CAC très élevé est-il toujours bon ?", answer: "Pas nécessairement. Un ratio de 10:1 pourrait signifier que vous sous-investissez dans la croissance. Si vous pouvez acquérir des clients de manière rentable avec un ratio de 3:1, vous devriez dépenser plus." },
          { question: "Comment le LTV:CAC varie-t-il selon le modèle d'entreprise ?", answer: "Le SaaS d'entreprise a généralement des ratios plus élevés (5:1+). Le SaaS PME a souvent des ratios plus bas (2-3:1). Les places de marché peuvent avoir 10:1+." },
          { question: "Quel est un LTV:CAC sain pour un nouveau produit ?", answer: "Les produits en phase de démarrage ont souvent des ratios inférieurs à 2:1. L'objectif devrait être d'atteindre 3:1 dans les 12 à 18 mois suivant le lancement." },
        ],
      },
    },
    ja: {
      meta: {
        title: "CAC対LTV比率計算機",
        description: "LTV対CAC比率を計算 – SaaSビジネスで最も重要なユニットエコノミクス指標です。",
      },
      inputs: [
        { id: "ltv", label: "顧客生涯価値 (LTV)" },
        { id: "cac", label: "顧客獲得コスト (CAC)" },
      ],
      outputs: [
        { id: "ratio", label: "LTV:CAC比率" },
      ],
      content: {
         intro: "LTV:CAC比率は、顧客が生涯にわたって生み出す総価値と、その獲得にかかるコストを比較します。これはSaaSビジネスにとって最も重要なユニットエコノミクス指標です。3:1の比率が健全なビジネスの業界標準です; つまり、各顧客は獲得コストの3倍の価値を生み出すことを意味します。1:1を下回ると、顧客を獲得するためにその価値以上のコストを費やしていることになります。5:1を超えると、成長への投資が不足している可能性があります。",
        howToUse: "平均的な顧客生涯価値（LTV）と顧客獲得コスト（CAC）を入力してください。計算機がLTV:CAC比率を算出します。ビジネスの全体的な健全性を評価したり、さまざまな顧客セグメントやチャネルを比較するために使用してください。",
        formulaExplanation: "LTV:CAC比率 = LTV ÷ CAC。例：LTV = $3,000、CAC = $1,000。比率 = $3,000 ÷ $1,000 = 3.0。比率3.0は、各顧客が獲得コストの3倍の生涯価値を生み出すことを意味します。",
         benchmarks: "SaaSの業界標準は3:1です。1:1を下回ると持続不可能です; すべての顧客で損失が出ます。5:1を超えると成長への投資不足を示す可能性があります。中央値のプライベートSaaS企業のLTV:CAC比率は3.2です。",
        benchmarkData: [
          { metric: "優れたLTV:CAC", value: "5.0+", source: "SaaS Capital" },
          { metric: "良いLTV:CAC", value: "3.0 - 5.0", source: "業界標準" },
          { metric: "許容可能なLTV:CAC", value: "2.0 - 3.0", source: "SaaS Capital" },
          { metric: "改善が必要", value: "1.0 - 2.0", source: "業界標準" },
          { metric: "持続不可能", value: "< 1.0", source: "業界標準" },
        ],
        faq: [
          { question: "良いLTV:CAC比率とは？", answer: "3:1以上が健全です。1:1を下回ると各顧客で損失が出ます。5:1を超えると投資不足の可能性があります。" },
          { question: "LTV:CAC比率を改善するには？", answer: "より良いリテンション、より高い価格設定、または拡張収益を通じてLTVを向上させます。チャネルの最適化やプロダクト主導の成長を通じてCACを削減します。" },
          { question: "チャネルごとにLTV:CACを計算すべきですか？", answer: "はい。チャネルによって比率は劇的に異なります。有料広告は2:1、紹介は10:1になる可能性があります。" },
          { question: "LTV:CAC比率の低下は何を意味しますか？", answer: "LTVが減少している（リテンションの悪化、価格の低下）か、CACが増加している（より高価なチャネル、営業の非効率）ことを意味します。" },
          { question: "LTV:CACと回収期間の関係は？", answer: "これらは補完的です。LTV:CACは全体的な収益を測定し、回収期間はCACを回収するまでの時間を測定します。" },
          { question: "非常に高いLTV:CACは常に良いですか？", answer: "必ずしもそうとは限りません。10:1の比率は成長への投資不足を示す可能性があります。3:1の比率で利益を得て顧客を獲得できるのであれば、もっと支出すべきです。" },
          { question: "LTV:CACはビジネスモデルによってどう異なりますか？", answer: "エンタープライズSaaSは一般的に高い比率（5:1+）です。SMB向けSaaSは低い比率（2-3:1）であることが多いです。マーケットプレイスは10:1+になる可能性があります。" },
          { question: "新製品の健全なLTV:CACとは？", answer: "初期段階の製品は多くの場合2:1未満の比率です。目標は発売から12〜18ヶ月以内に3:1に達することです。" },
        ],
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
