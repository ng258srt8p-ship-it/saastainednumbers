import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "mrr-calculator",
  category: "revenue",
  meta: {
    title: "MRR Calculator",
    description: "Calculate your Monthly Recurring Revenue (MRR) and Annual Recurring Revenue (ARR) instantly.",
    keywords: ["mrr", "arr", "recurring revenue", "saas metrics", "monthly revenue"],
  },
  benchmarkMetric: "mrr-growth-rate",
  inputs: [
    { id: "customers", label: "Number of Customers", type: "number" as const, defaultValue: 100 },
    { id: "arpu", label: "Avg Revenue Per User (ARPU)", type: "currency" as const, defaultValue: 50 },
  ],
  outputs: [
    { id: "mrr", label: "Monthly Recurring Revenue", type: "currency" as const, isPrimary: true },
    { id: "arr", label: "Annual Recurring Revenue", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "Monthly Recurring Revenue (MRR) is the lifeblood of any subscription business. It measures the predictable revenue a company generates from its active subscribers each month, excluding one-time fees, credits, or non-recurring charges. MRR is the single most important metric for SaaS companies because it reveals the health, growth trajectory, and sustainability of your business model. Unlike traditional businesses where revenue fluctuates unpredictably, SaaS companies with strong MRR can forecast future earnings, plan hiring, and make strategic investments with confidence. Tracking MRR over time also helps identify trends in customer acquisition, retention, and expansion revenue. This calculator helps you measure your predictable revenue stream instantly.",
    howToUse: "Enter your total number of paying customers and your average revenue per user (ARPU). The calculator will instantly compute your MRR and ARR. Adjust the inputs to see how changes in customer count or pricing affect your recurring revenue.",
    formulaExplanation: "MRR = Number of Customers × ARPU. ARR = MRR × 12. For example, if you have 100 customers each paying $50/month: MRR = 100 × $50 = $5,000, ARR = $5,000 × 12 = $60,000.",
    benchmarks: "Early-stage SaaS startups typically range from $0-10K MRR in their first 6-12 months. Companies at $10K-100K MRR have established product-market fit. $100K-1M MRR indicates scaling operations. Top-quartile SaaS companies grow MRR at 15-20% month-over-month in early stages, stabilizing to 5-10% monthly growth at scale according to KeyBanc Capital Markets 2025 SaaS Survey. Track your own MRR automatically with [Baremetrics](https://baremetrics.com?via=saastainednumbers).",
    benchmarkData: [
      { metric: "Seed Stage MRR", value: "$0 - $10K / month", source: "SaaS Capital 2025" },
      { metric: "Series A Stage MRR", value: "$10K - $100K / month", source: "SaaS Capital 2025" },
      { metric: "Growth Stage MRR", value: "$100K - $1M+ / month", source: "SaaS Capital 2025" },
      { metric: "Top Quartile MoM Growth (Early)", value: "15 - 20%", source: "KeyBanc 2025 SaaS Survey" },
      { metric: "Median MoM Growth (Scaling)", value: "5 - 10%", source: "KeyBanc 2025 SaaS Survey" },
    ],
    relatedCalculators: ["cac-calculator", "ltv-calculator", "arpu-calculator", "mrr-growth-rate-calculator", "nrr-calculator"],
    faq: [
      { question: "What is a good MRR for a SaaS startup?", answer: "It depends on your stage. Early-stage startups ($0-10K MRR) focus on product-market fit; $10K-100K MRR indicates traction; $100K+ MRR signals scaling. What matters more than absolute MRR is your growth rate. Aim for 15-20% monthly MRR growth in early stages." },
      { question: "Should I include free trial users in MRR?", answer: "No. MRR should only include paying customers. Free trials, paused subscriptions, and one-time fees should be excluded. Include only active, paying subscribers generating recurring revenue." },
      { question: "What is the difference between MRR and ARR?", answer: "MRR (Monthly Recurring Revenue) is your revenue on a monthly basis. ARR (Annual Recurring Revenue) is simply MRR multiplied by 12, representing your annualized run rate. ARR is commonly used by enterprise SaaS companies and investors." },
      { question: "How do I calculate MRR growth rate?", answer: "MRR growth rate = (Current Month MRR - Previous Month MRR) / Previous Month MRR × 100. Track this monthly to measure your company's growth trajectory. Tools like [Baremetrics](https://baremetrics.com?via=saastainednumbers) automate this tracking." },
      { question: "What is net new MRR?", answer: "Net New MRR = New MRR + Expansion MRR - Churned MRR - Contraction MRR. It reflects overall MRR change from all sources including new customers, upgrades, downgrades, and cancellations." },
      { question: "Should I include usage-based billing in MRR?", answer: "Yes, but average it. For usage-based components, use the average of the last 3 months to smooth out fluctuations and get a more accurate recurring view." },
      { question: "How does churn impact MRR?", answer: "Churn directly reduces MRR. If you acquire $10K in new MRR but lose $8K to churn, your net new MRR is only $2K. Reducing churn by even 1-2% can dramatically improve net MRR growth. Track MRR and churn side-by-side with [Baremetrics](https://baremetrics.com?via=saastainednumbers)." },
      { question: "What is the difference between MRR and revenue?", answer: "MRR represents recurring subscription revenue only. Total revenue may include one-time fees, professional services, hardware sales, or other non-recurring items. MRR gives a clearer picture of recurring business health." },
      { question: "What is the difference between MRR and ARPU?", answer: "MRR (Monthly Recurring Revenue) is the total recurring revenue from all customers. ARPU (Average Revenue Per User) is the average revenue per customer. ARPU × customer count = MRR. ARPU helps you understand per-customer value, while MRR gives you the aggregate revenue picture. Tracking both together provides a complete view of your revenue health." },
      { question: "How often should I calculate MRR?", answer: "MRR should be calculated at least monthly, but top-performing SaaS companies track it weekly or even in real-time using tools like [Baremetrics](https://baremetrics.com?via=saastainednumbers). Monthly calculation is sufficient for board reporting and investor updates, while weekly tracking helps you spot trends and react to changes faster. Daily MRR is useful during growth sprints or after major product launches." },
      { question: "What are the limitations of MRR as a metric?", answer: "MRR does not account for customer acquisition costs, profitability, or cash flow. A company can have high MRR but still be unprofitable if customer acquisition costs are too high. MRR also ignores one-time revenue streams, professional services income, and non-recurring charges that may be meaningful parts of your business. Use MRR alongside profitability metrics like gross margin, CAC, and LTV for a complete financial picture." },
    ],
  },
  locales: {
    es: {
      meta: {
        title: "Calculadora de MRR",
        description: "Calcula tu Ingreso Recurrente Mensual (MRR) e Ingreso Recurrente Anual (ARR) al instante.",
      },
      inputs: [
        { id: "customers", label: "Número de Clientes" },
        { id: "arpu", label: "Ingreso Promedio por Usuario (ARPU)" },
      ],
      outputs: [
        { id: "mrr", label: "Ingreso Recurrente Mensual" },
        { id: "arr", label: "Ingreso Recurrente Anual" },
      ],
      content: {
        intro: "Los Ingresos Recurrentes Mensuales (MRR) son el alma de cualquier negocio de suscripción. Miden los ingresos predecibles que una empresa genera de sus suscriptores activos cada mes, excluyendo tarifas únicas, créditos o cargos no recurrentes. El MRR es la métrica más importante para las empresas SaaS porque revela la salud, la trayectoria de crecimiento y la sostenibilidad de tu modelo de negocio. A diferencia de los negocios tradicionales donde los ingresos fluctúan de manera impredecible, las empresas SaaS con un MRR sólido pueden pronosticar ganancias futuras, planificar contrataciones y realizar inversiones estratégicas con confianza. Hacer un seguimiento del MRR a lo largo del tiempo también ayuda a identificar tendencias en la adquisición de clientes, la retención y la expansión de ingresos. Esta calculadora te ayuda a medir tu flujo de ingresos predecibles al instante.",
        howToUse: "Ingresa tu número total de clientes de pago y tu ingreso promedio por usuario (ARPU). La calculadora calculará instantáneamente tu MRR y ARR. Ajusta los valores para ver cómo los cambios en el número de clientes o en los precios afectan tus ingresos recurrentes.",
        formulaExplanation: "MRR = Número de Clientes × ARPU. ARR = MRR × 12. Por ejemplo, si tienes 100 clientes que pagan $50/mes cada uno: MRR = 100 × $50 = $5,000, ARR = $5,000 × 12 = $60,000.",
        benchmarks: "Las startups SaaS en etapa temprana suelen tener un MRR de $0-10K en sus primeros 6-12 meses. Las empresas con MRR de $10K-100K han establecido un ajuste producto-mercado. Un MRR de $100K-1M indica operaciones en escala. Las empresas SaaS del cuartil superior crecen su MRR entre un 15-20% mes a mes en etapas tempranas, estabilizándose a un 5-10% de crecimiento mensual en escala, según la Encuesta SaaS 2025 de KeyBanc Capital Markets. Haz un seguimiento automático de tu MRR con [Baremetrics](https://baremetrics.com?via=saastainednumbers).",
        benchmarkData: [
          { metric: "MRR en Etapa Semilla", value: "$0 - $10K / month", source: "SaaS Capital 2025" },
          { metric: "MRR en Etapa Serie A", value: "$10K - $100K / month", source: "SaaS Capital 2025" },
          { metric: "MRR en Etapa de Crecimiento", value: "$100K - $1M+ / month", source: "SaaS Capital 2025" },
          { metric: "Crecimiento intermensual del cuartil superior (Etapa temprana)", value: "15 - 20%", source: "KeyBanc 2025 SaaS Survey" },
          { metric: "Crecimiento intermensual mediano (Escalando)", value: "5 - 10%", source: "KeyBanc 2025 SaaS Survey" },
        ],
        faq: [
          { question: "¿Qué es un buen MRR para una startup SaaS?", answer: "Depende de tu etapa. Las startups en etapa temprana ($0-10K MRR) se enfocan en encontrar el ajuste producto-mercado; $10K-100K MRR indica tracción; $100K+ MRR señala escalabilidad. Más importante que el MRR absoluto es tu tasa de crecimiento. Apunta a un crecimiento mensual del MRR del 15-20% en etapas tempranas." },
          { question: "¿Debo incluir a los usuarios de prueba gratuita en el MRR?", answer: "No. El MRR solo debe incluir clientes de pago. Las pruebas gratuitas, suscripciones pausadas y tarifas únicas deben excluirse. Incluye solo suscriptores activos que pagan y generan ingresos recurrentes." },
          { question: "¿Cuál es la diferencia entre MRR y ARR?", answer: "El MRR (Ingreso Recurrente Mensual) son tus ingresos mensuales. El ARR (Ingreso Recurrente Anual) es simplemente el MRR multiplicado por 12, lo que representa tu tasa de ejecución anualizada. El ARR es comúnmente utilizado por empresas SaaS empresariales e inversores." },
          { question: "¿Cómo calculo la tasa de crecimiento del MRR?", answer: "Tasa de crecimiento del MRR = (MRR del mes actual - MRR del mes anterior) / MRR del mes anterior × 100. Haz un seguimiento mensual de esto para medir la trayectoria de crecimiento de tu empresa." },
          { question: "¿Qué es el MRR neto nuevo?", answer: "MRR Neto Nuevo = MRR Nuevo + MRR de Expansión - MRR Perdido por Cancelaciones - MRR por Contracción. Refleja el cambio general del MRR de todas las fuentes, incluyendo nuevos clientes, actualizaciones, degradaciones y cancelaciones." },
          { question: "¿Debo incluir la facturación basada en uso en el MRR?", answer: "Sí, pero promedia el valor. Para los componentes basados en uso, utiliza el promedio de los últimos 3 meses para suavizar las fluctuaciones y obtener una visión recurrente más precisa." },
          { question: "¿Cómo afecta la tasa de cancelación (churn) al MRR?", answer: "La tasa de cancelación reduce directamente el MRR. Si adquieres $10K en nuevo MRR pero pierdes $8K por cancelaciones, tu MRR neto nuevo es solo $2K. Reducir la tasa de cancelación aunque sea un 1-2% puede mejorar drásticamente el crecimiento del MRR neto." },
          { question: "¿Cuál es la diferencia entre MRR e ingresos?", answer: "El MRR representa solo los ingresos recurrentes por suscripciones. Los ingresos totales pueden incluir tarifas únicas, servicios profesionales, ventas de hardware u otros elementos no recurrentes. El MRR ofrece una imagen más clara de la salud del negocio recurrente." },
          { question: "¿Cuál es la diferencia entre MRR y ARPU?", answer: "El MRR (Ingreso Recurrente Mensual) son los ingresos recurrentes totales de todos los clientes. El ARPU (Ingreso Promedio por Usuario) es el ingreso promedio por cliente. ARPU × número de clientes = MRR. El ARPU ayuda a entender el valor por cliente, mientras que el MRR ofrece una visión agregada de los ingresos." },
          { question: "¿Con qué frecuencia debo calcular el MRR?", answer: "El MRR debe calcularse al menos mensualmente, pero las empresas SaaS de alto rendimiento lo rastrean semanalmente o incluso en tiempo real. El cálculo mensual es suficiente para informes de junta directiva y actualizaciones para inversores, mientras que el seguimiento semanal ayuda a detectar tendencias y reaccionar más rápido a los cambios." },
          { question: "¿Cuáles son las limitaciones del MRR como métrica?", answer: "El MRR no considera los costos de adquisición de clientes, la rentabilidad ni el flujo de caja. Una empresa puede tener un MRR alto pero no ser rentable si los costos de adquisición de clientes son demasiado altos. Utiliza el MRR junto con métricas de rentabilidad como el margen bruto, CAC y LTV para obtener una imagen financiera completa." },
        ],
      },
    },
    de: {
      meta: {
        title: "MRR-Rechner",
        description: "Berechnen Sie sofort Ihren monatlich wiederkehrenden Umsatz (MRR) und jährlich wiederkehrenden Umsatz (ARR).",
      },
      inputs: [
        { id: "customers", label: "Anzahl der Kunden" },
        { id: "arpu", label: "Durchschnittlicher Umsatz pro Benutzer (ARPU)" },
      ],
      outputs: [
        { id: "mrr", label: "Monatlich wiederkehrender Umsatz" },
        { id: "arr", label: "Jährlich wiederkehrender Umsatz" },
      ],
      content: {
        intro: "Der monatlich wiederkehrende Umsatz (MRR) ist das Lebensblut jedes Abonnementgeschäfts. Er misst die vorhersehbaren Einnahmen, die ein Unternehmen monatlich von seinen aktiven Abonnenten erzielt, ohne einmalige Gebühren, Gutschriften oder nicht wiederkehrende Kosten. MRR ist die wichtigste Kennzahl für SaaS-Unternehmen, da sie die Gesundheit, das Wachstum und die Nachhaltigkeit Ihres Geschäftsmodells offenbart. Im Gegensatz zu traditionellen Unternehmen, bei denen die Einnahmen unvorhersehbar schwanken, können SaaS-Unternehmen mit starkem MRR zukünftige Einnahmen prognostizieren, Einstellungen planen und strategische Investitionen mit Zuversicht tätigen. Die Verfolgung des MRR im Zeitverlauf hilft auch dabei, Trends bei der Kundenakquise, Kundenbindung und Expansion zu erkennen. Dieser Rechner hilft Ihnen, Ihren vorhersehbaren Einnahmestrom sofort zu messen.",
        howToUse: "Geben Sie Ihre Gesamtzahl der zahlenden Kunden und Ihren durchschnittlichen Umsatz pro Benutzer (ARPU) ein. Der Rechner berechnet sofort Ihren MRR und ARR. Passen Sie die Eingaben an, um zu sehen, wie sich Änderungen bei der Kundenzahl oder der Preisgestaltung auf Ihre wiederkehrenden Einnahmen auswirken.",
        formulaExplanation: "MRR = Anzahl der Kunden × ARPU. ARR = MRR × 12. Zum Beispiel: Wenn Sie 100 Kunden haben, die jeweils 50 $/Monat zahlen: MRR = 100 × 50 $ = 5.000 $, ARR = 5.000 $ × 12 = 60.000 $.",
        benchmarks: "Frühphasen-SaaS-Startups bewegen sich typischerweise in den ersten 6-12 Monaten in einem Bereich von 0-10.000 $ MRR. Unternehmen mit 10.000-100.000 $ MRR haben einen Produkt-Markt-Fit etabliert. 100.000-1 Mio. $ MRR deutet auf skalierende Operationen hin. SaaS-Unternehmen im oberen Quartil wachsen im MRR um 15-20 % Monat für Monat in frühen Phasen und stabilisieren sich bei 5-10 % monatlichem Wachstum in der Skalierung, laut der KeyBanc Capital Markets 2025 SaaS Umfrage. Verfolgen Sie Ihren MRR automatisch mit [Baremetrics](https://baremetrics.com?via=saastainednumbers).",
        benchmarkData: [
          { metric: "MRR in der Seed-Phase", value: "$0 - $10K / month", source: "SaaS Capital 2025" },
          { metric: "MRR in der Series-A-Phase", value: "$10K - $100K / month", source: "SaaS Capital 2025" },
          { metric: "MRR in der Wachstumsphase", value: "$100K - $1M+ / month", source: "SaaS Capital 2025" },
          { metric: "Monatliches Wachstum im oberen Quartil (Frühphase)", value: "15 - 20%", source: "KeyBanc 2025 SaaS Survey" },
          { metric: "Medians monatliches Wachstum (Skalierung)", value: "5 - 10%", source: "KeyBanc 2025 SaaS Survey" },
        ],
        faq: [
          { question: "Was ist ein guter MRR für ein SaaS-Startup?", answer: "Das hängt von Ihrer Phase ab. Frühphasen-Startups ($0-10K MRR) konzentrieren sich auf den Produkt-Markt-Fit; $10K-100K MRR deutet auf Traktion hin; $100K+ MRR signalisiert Skalierung. Wichtiger als der absolute MRR ist Ihre Wachstumsrate. Zielen Sie auf 15-20 % monatliches MRR-Wachstum in frühen Phasen ab." },
          { question: "Sollte ich Testbenutzer in den MRR einbeziehen?", answer: "Nein. Der MRR sollte nur zahlende Kunden umfassen. Testversionen, pausierte Abonnements und einmalige Gebühren sollten ausgeschlossen werden. Beziehen Sie nur aktive, zahlende Abonnenten ein, die wiederkehrende Einnahmen generieren." },
          { question: "Was ist der Unterschied zwischen MRR und ARR?", answer: "MRR (Monthly Recurring Revenue) ist Ihr monatlicher Umsatz. ARR (Annual Recurring Revenue) ist einfach MRR multipliziert mit 12, was Ihre annualisierte Laufrate darstellt. ARR wird häufig von Unternehmens-SaaS-Unternehmen und Investoren verwendet." },
          { question: "Wie berechne ich die MRR-Wachstumsrate?", answer: "MRR-Wachstumsrate = (MRR aktueller Monat - MRR vorheriger Monat) / MRR vorheriger Monat × 100. Verfolgen Sie dies monatlich, um die Wachstumsentwicklung Ihres Unternehmens zu messen." },
          { question: "Was ist der Netto-Neumarkt-MRR?", answer: "Netto-Neuer MRR = Neuer MRR + Expansions-MRR - Abgewanderter MRR - Kontraktions-MRR. Er spiegelt die gesamte MRR-Veränderung aus allen Quellen wider, einschließlich neuer Kunden, Upgrades, Downgrades und Kündigungen." },
          { question: "Sollte ich nutzungsbasierte Abrechnung in den MRR einbeziehen?", answer: "Ja, aber mitteln Sie sie. Verwenden Sie für nutzungsbasierte Komponenten den Durchschnitt der letzten 3 Monate, um Schwankungen auszugleichen und eine genauere wiederkehrende Sicht zu erhalten." },
          { question: "Wie wirkt sich die Abwanderungsrate auf den MRR aus?", answer: "Abwanderung reduziert direkt den MRR. Wenn Sie 10.000 $ an neuem MRR gewinnen, aber 8.000 $ durch Abwanderung verlieren, beträgt Ihr Netto-Neumarkt-MRR nur 2.000 $. Eine Reduzierung der Abwanderung um nur 1-2 % kann das Netto-MRR-Wachstum drastisch verbessern." },
          { question: "Was ist der Unterschied zwischen MRR und Umsatz?", answer: "MRR stellt nur wiederkehrende Abonnementeinnahmen dar. Der Gesamtumsatz kann einmalige Gebühren, professionelle Dienstleistungen, Hardwareverkäufe oder andere nicht wiederkehrende Posten umfassen. MRR bietet ein klareres Bild der Gesundheit des wiederkehrenden Geschäfts." },
          { question: "Was ist der Unterschied zwischen MRR und ARPU?", answer: "MRR (Monatlich Wiederkehrender Umsatz) ist der gesamte wiederkehrende Umsatz aller Kunden. ARPU (Durchschnittlicher Umsatz pro Benutzer) ist der durchschnittliche Umsatz pro Kunde. ARPU × Kundenzahl = MRR. ARPU hilft Ihnen, den Wert pro Kunde zu verstehen, während MRR Ihnen das aggregierte Umsatzbild liefert." },
          { question: "Wie oft sollte ich den MRR berechnen?", answer: "Der MRR sollte mindestens monatlich berechnet werden, aber Spitzen-SaaS-Unternehmen verfolgen ihn wöchentlich oder sogar in Echtzeit. Die monatliche Berechnung ist ausreichend für Vorstandsberichte und Investoren-Updates, während die wöchentliche Verfolgung hilft, Trends zu erkennen und schneller auf Änderungen zu reagieren." },
          { question: "Was sind die Grenzen von MRR als Kennzahl?", answer: "MRR berücksichtigt keine Kundenakquisitionskosten, Rentabilität oder Cashflow. Ein Unternehmen kann einen hohen MRR haben, aber dennoch unrentabel sein, wenn die Kundenakquisitionskosten zu hoch sind. Verwenden Sie MRR zusammen mit Rentabilitätskennzahlen wie Bruttomarge, CAC und LTV für ein vollständiges finanzielles Bild." },
        ],
      },
    },
    pt: {
      meta: {
        title: "Calculadora de MRR",
        description: "Calcule sua Receita Recorrente Mensal (MRR) e Receita Recorrente Anual (ARR) instantaneamente.",
      },
      inputs: [
        { id: "customers", label: "Número de Clientes" },
        { id: "arpu", label: "Receita Média por Usuário (ARPU)" },
      ],
      outputs: [
        { id: "mrr", label: "Receita Recorrente Mensal" },
        { id: "arr", label: "Receita Recorrente Anual" },
      ],
      content: {
        intro: "A Receita Recorrente Mensal (MRR) é a força vital de qualquer negócio de assinatura. Ela mede a receita previsível que uma empresa gera de seus assinantes ativos a cada mês, excluindo taxas únicas, créditos ou encargos não recorrentes. O MRR é a métrica mais importante para empresas SaaS porque revela a saúde, a trajetória de crescimento e a sustentabilidade do seu modelo de negócios. Ao contrário dos negócios tradicionais, onde a receita flutua de forma imprevisível, empresas SaaS com MRR forte podem prever ganhos futuros, planejar contratações e fazer investimentos estratégicos com confiança. Acompanhar o MRR ao longo do tempo também ajuda a identificar tendências na aquisição, retenção e expansão de clientes. Esta calculadora ajuda você a medir seu fluxo de receita previsível instantaneamente.",
        howToUse: "Insira seu número total de clientes pagantes e sua receita média por usuário (ARPU). A calculadora calculará instantaneamente seu MRR e ARR. Ajuste os valores para ver como mudanças no número de clientes ou no preço afetam sua receita recorrente.",
        formulaExplanation: "MRR = Número de Clientes × ARPU. ARR = MRR × 12. Por exemplo, se você tem 100 clientes pagando $50/mês cada: MRR = 100 × $50 = $5.000, ARR = $5.000 × 12 = $60.000.",
        benchmarks: "Startups SaaS em estágio inicial geralmente têm MRR de $0-10K nos primeiros 6-12 meses. Empresas com MRR de $10K-100K estabeleceram adequação produto-mercado. MRR de $100K-1M indica operações em escala. Empresas SaaS do quartil superior crescem MRR em 15-20% mês a mês nos estágios iniciais, estabilizando para 5-10% de crescimento mensal em escala, de acordo com a Pesquisa SaaS 2025 da KeyBanc Capital Markets. Acompanhe seu MRR automaticamente com [Baremetrics](https://baremetrics.com?via=saastainednumbers).",
        benchmarkData: [
          { metric: "MRR em Estágio Semente", value: "$0 - $10K / month", source: "SaaS Capital 2025" },
          { metric: "MRR em Estágio Série A", value: "$10K - $100K / month", source: "SaaS Capital 2025" },
          { metric: "MRR em Estágio de Crescimento", value: "$100K - $1M+ / month", source: "SaaS Capital 2025" },
          { metric: "Crescimento Mensal do Quartil Superior (Inicial)", value: "15 - 20%", source: "KeyBanc 2025 SaaS Survey" },
          { metric: "Crescimento Mensal Mediano (Escalando)", value: "5 - 10%", source: "KeyBanc 2025 SaaS Survey" },
        ],
        faq: [
          { question: "O que é um bom MRR para uma startup SaaS?", answer: "Depende do seu estágio. Startups em estágio inicial ($0-10K MRR) focam em adequação produto-mercado; $10K-100K MRR indica tração; $100K+ MRR sinaliza escala. Mais importante que o MRR absoluto é sua taxa de crescimento. Busque 15-20% de crescimento mensal do MRR nos estágios iniciais." },
          { question: "Devo incluir usuários de teste gratuito no MRR?", answer: "Não. O MRR deve incluir apenas clientes pagantes. Testes gratuitos, assinaturas pausadas e taxas únicas devem ser excluídos. Inclua apenas assinantes ativos e pagantes que geram receita recorrente." },
          { question: "Qual é a diferença entre MRR e ARR?", answer: "MRR (Receita Recorrente Mensal) é sua receita mensal. ARR (Receita Recorrente Anual) é simplesmente o MRR multiplicado por 12, representando sua taxa de execução anualizada. O ARR é comumente usado por empresas SaaS empresariais e investidores." },
          { question: "Como calculo a taxa de crescimento do MRR?", answer: "Taxa de crescimento do MRR = (MRR do mês atual - MRR do mês anterior) / MRR do mês anterior × 100. Acompanhe isso mensalmente para medir a trajetória de crescimento da sua empresa." },
          { question: "O que é MRR líquido novo?", answer: "MRR Líquido Novo = Novo MRR + MRR de Expansão - MRR Perdido por Cancelamentos - MRR por Contração. Reflete a mudança geral do MRR de todas as fontes, incluindo novos clientes, upgrades, downgrades e cancelamentos." },
          { question: "Devo incluir faturamento baseado em uso no MRR?", answer: "Sim, mas calcule a média. Para componentes baseados em uso, use a média dos últimos 3 meses para suavizar flutuações e obter uma visão recorrente mais precisa." },
          { question: "Como o churn impacta o MRR?", answer: "O churn reduz diretamente o MRR. Se você adquire $10K em novo MRR, mas perde $8K com churn, seu MRR líquido novo é de apenas $2K. Reduzir o churn em apenas 1-2% pode melhorar drasticamente o crescimento do MRR líquido." },
          { question: "Qual é a diferença entre MRR e receita?", answer: "O MRR representa apenas a receita recorrente de assinaturas. A receita total pode incluir taxas únicas, serviços profissionais, vendas de hardware ou outros itens não recorrentes. O MRR oferece uma imagem mais clara da saúde do negócio recorrente." },
          { question: "Qual é a diferença entre MRR e ARPU?", answer: "MRR (Receita Recorrente Mensal) é a receita recorrente total de todos os clientes. ARPU (Receita Média por Usuário) é a receita média por cliente. ARPU × número de clientes = MRR. O ARPU ajuda a entender o valor por cliente, enquanto o MRR oferece a visão agregada da receita." },
          { question: "Com que frequência devo calcular o MRR?", answer: "O MRR deve ser calculado pelo menos mensalmente, mas empresas SaaS de alto desempenho o acompanham semanalmente ou até em tempo real. O cálculo mensal é suficiente para relatórios de conselho e atualizações para investidores, enquanto o acompanhamento semanal ajuda a identificar tendências e reagir mais rápido às mudanças." },
          { question: "Quais são as limitações do MRR como métrica?", answer: "O MRR não considera custos de aquisição de clientes, lucratividade ou fluxo de caixa. Uma empresa pode ter MRR alto, mas ainda assim não ser lucrativa se os custos de aquisição de clientes forem muito altos. Use o MRR junto com métricas de lucratividade como margem bruta, CAC e LTV para uma imagem financeira completa." },
        ],
      },
    },
    fr: {
      meta: {
        title: "Calculateur de MRR",
        description: "Calculez instantanément vos revenus récurrents mensuels (MRR) et vos revenus récurrents annuels (ARR).",
      },
      inputs: [
        { id: "customers", label: "Nombre de Clients" },
        { id: "arpu", label: "Revenu Moyen par Utilisateur (ARPU)" },
      ],
      outputs: [
        { id: "mrr", label: "Revenus Récurrents Mensuels" },
        { id: "arr", label: "Revenus Récurrents Annuels" },
      ],
      content: {
        intro: "Le revenu récurrent mensuel (MRR) est le carburant de toute entreprise par abonnement. Il mesure les revenus prévisibles qu'une entreprise génère auprès de ses abonnés actifs chaque mois, à l'exclusion des frais uniques, des crédits ou des charges non récurrentes. Le MRR est la métrique la plus importante pour les entreprises SaaS car il révèle la santé, la trajectoire de croissance et la durabilité de votre modèle économique. Contrairement aux entreprises traditionnelles où les revenus fluctuent de manière imprévisible, les entreprises SaaS avec un MRR solide peuvent prévoir leurs bénéfices futurs, planifier leurs recrutements et réaliser des investissements stratégiques en toute confiance. Le suivi du MRR dans le temps permet également d'identifier les tendances en matière d'acquisition, de rétention et d'expansion des clients. Ce calculateur vous aide à mesurer instantanément votre flux de revenus prévisibles.",
        howToUse: "Saisissez votre nombre total de clients payants et votre revenu moyen par utilisateur (ARPU). Le calculateur calculera instantanément votre MRR et votre ARR. Ajustez les valeurs pour voir comment les changements dans le nombre de clients ou la tarification affectent vos revenus récurrents.",
        formulaExplanation: "MRR = Nombre de clients × ARPU. ARR = MRR × 12. Par exemple, si vous avez 100 clients payant chacun 50 $/mois : MRR = 100 × 50 $ = 5 000 $, ARR = 5 000 $ × 12 = 60 000 $.",
        benchmarks: "Les startups SaaS en phase de démarrage se situent généralement entre 0 et 10 000 $ de MRR au cours des 6 à 12 premiers mois. Les entreprises entre 10 000 et 100 000 $ de MRR ont établi une adéquation produit-marché. Un MRR de 100 000 à 1 million $ indique des opérations de mise à l'échelle. Les entreprises SaaS du quartile supérieur augmentent leur MRR de 15 à 20 % d'un mois sur l'autre dans les premières phases, se stabilisant à 5 à 10 % de croissance mensuelle à grande échelle, selon l'enquête SaaS 2025 de KeyBanc Capital Markets. Suivez votre MRR automatiquement avec [Baremetrics](https://baremetrics.com?via=saastainednumbers).",
        benchmarkData: [
          { metric: "MRR en Phase d'Amorçage", value: "$0 - $10K / month", source: "SaaS Capital 2025" },
          { metric: "MRR en Phase Série A", value: "$10K - $100K / month", source: "SaaS Capital 2025" },
          { metric: "MRR en Phase de Croissance", value: "$100K - $1M+ / month", source: "SaaS Capital 2025" },
          { metric: "Croissance Mensuelle du Quartile Supérieur (Début)", value: "15 - 20%", source: "KeyBanc 2025 SaaS Survey" },
          { metric: "Croissance Mensuelle Médiane (Mise à l'échelle)", value: "5 - 10%", source: "KeyBanc 2025 SaaS Survey" },
        ],
        faq: [
          { question: "Qu'est-ce qu'un bon MRR pour une startup SaaS ?", answer: "Cela dépend de votre stade. Les startups en phase de démarrage ($0-10K MRR) se concentrent sur l'adéquation produit-marché ; $10K-100K MRR indique une traction ; $100K+ MRR signale une mise à l'échelle. Plus important que le MRR absolu est votre taux de croissance. Visez une croissance mensuelle du MRR de 15 à 20 % dans les premières phases." },
          { question: "Dois-je inclure les utilisateurs d'essai gratuit dans le MRR ?", answer: "Non. Le MRR ne doit inclure que les clients payants. Les essais gratuits, les abonnements en pause et les frais uniques doivent être exclus. Incluez uniquement les abonnés actifs et payants qui génèrent des revenus récurrents." },
          { question: "Quelle est la différence entre le MRR et l'ARR ?", answer: "Le MRR (Revenu Récurrent Mensuel) est votre revenu mensuel. L'ARR (Revenu Récurrent Annuel) est simplement le MRR multiplié par 12, représentant votre taux de rendement annualisé. L'ARR est couramment utilisé par les entreprises SaaS et les investisseurs." },
          { question: "Comment calculer le taux de croissance du MRR ?", answer: "Taux de croissance du MRR = (MRR du mois en cours - MRR du mois précédent) / MRR du mois précédent × 100. Suivez cela mensuellement pour mesurer la trajectoire de croissance de votre entreprise." },
          { question: "Qu'est-ce que le nouveau MRR net ?", answer: "Nouveau MRR Net = Nouveau MRR + MRR d'Expansion - MRR Perdu par Résiliation - MRR par Contraction. Il reflète le changement global du MRR provenant de toutes les sources, y compris les nouveaux clients, les mises à niveau, les rétrogradations et les annulations." },
          { question: "Dois-je inclure la facturation à l'utilisation dans le MRR ?", answer: "Oui, mais faites une moyenne. Pour les composants basés sur l'utilisation, utilisez la moyenne des 3 derniers mois pour lisser les fluctuations et obtenir une vue récurrente plus précise." },
          { question: "Quel est l'impact du taux d'attrition (churn) sur le MRR ?", answer: "Le taux d'attrition réduit directement le MRR. Si vous acquérez 10 000 $ de nouveau MRR mais perdez 8 000 $ à cause de l'attrition, votre nouveau MRR net n'est que de 2 000 $. Réduire le taux d'attrition de seulement 1 à 2 % peut considérablement améliorer la croissance du MRR net." },
          { question: "Quelle est la différence entre le MRR et le revenu ?", answer: "Le MRR représente uniquement les revenus récurrents des abonnements. Le revenu total peut inclure des frais uniques, des services professionnels, des ventes de matériel ou d'autres éléments non récurrents. Le MRR donne une image plus claire de la santé de l'activité récurrente." },
          { question: "Quelle est la différence entre le MRR et l'ARPU ?", answer: "Le MRR (Revenu Récurrent Mensuel) est le revenu récurrent total de tous les clients. L'ARPU (Revenu Moyen par Utilisateur) est le revenu moyen par client. ARPU × nombre de clients = MRR. L'ARPU vous aide à comprendre la valeur par client, tandis que le MRR vous donne la vue agrégée des revenus." },
          { question: "À quelle fréquence dois-je calculer le MRR ?", answer: "Le MRR doit être calculé au moins mensuellement, mais les entreprises SaaS les plus performantes le suivent chaque semaine, voire en temps réel. Le calcul mensuel est suffisant pour les rapports au conseil d'administration et les mises à jour des investisseurs, tandis que le suivi hebdomadaire vous aide à repérer les tendances et à réagir plus rapidement aux changements." },
          { question: "Quelles sont les limites du MRR en tant que métrique ?", answer: "Le MRR ne tient pas compte des coûts d'acquisition des clients, de la rentabilité ou des flux de trésorerie. Une entreprise peut avoir un MRR élevé mais rester non rentable si les coûts d'acquisition des clients sont trop élevés. Utilisez le MRR avec des indicateurs de rentabilité comme la marge brute, le CAC et le LTV pour une image financière complète." },
        ],
      },
    },
    ja: {
      meta: {
        title: "MRR計算機",
        description: "月次経常収益（MRR）と年次経常収益（ARR）を即座に計算します。",
      },
      inputs: [
        { id: "customers", label: "顧客数" },
        { id: "arpu", label: "ユーザーあたりの平均収益（ARPU）" },
      ],
      outputs: [
        { id: "mrr", label: "月次経常収益" },
        { id: "arr", label: "年次経常収益" },
      ],
      content: {
        intro: "月次経常収益（MRR）は、あらゆるサブスクリプションビジネスの生命線です。これは、企業が毎月アクティブな加入者から生み出す予測可能な収益を測定し、一時的な料金、クレジット、または非経常的な費用を除外します。MRRはSaaS企業にとって最も重要な指標です。なぜなら、ビジネスモデルの健全性、成長軌道、持続可能性を明らかにするからです。収益が予測不能に変動する従来の企業とは異なり、強力なMRRを持つSaaS企業は、将来の収益を予測し、採用を計画し、戦略的投資を自信を持って行うことができます。MRRを経時的に追跡することは、顧客獲得、維持、拡大収益の傾向を特定するのにも役立ちます。この計算機は、予測可能な収益源を即座に測定するのに役立ちます。",
        howToUse: "有料顧客の総数とユーザーあたりの平均収益（ARPU）を入力してください。計算機が即座にMRRとARRを計算します。顧客数や価格設定の変更が経常収益にどのように影響するかを確認するには、入力を調整してください。",
        formulaExplanation: "MRR = 顧客数 × ARPU。ARR = MRR × 12。例えば、毎月50ドルを支払う顧客が100人いる場合：MRR = 100 × 50ドル = 5,000ドル、ARR = 5,000ドル × 12 = 60,000ドル。",
        benchmarks: "初期段階のSaaSスタートアップは、最初の6〜12ヶ月で通常0〜10KドルのMRRです。10K〜100KドルのMRRの企業はプロダクトマーケットフィットを確立しています。100K〜100万ドルのMRRは事業の拡大を示しています。上位四分位のSaaS企業は、初期段階で月次のMRR成長率が15〜20％であり、拡大段階では月次成長率5〜10％に安定します（KeyBanc Capital Markets 2025 SaaS Surveyより）。[Baremetrics](https://baremetrics.com?via=saastainednumbers)を使ってMRRを自動追跡しましょう。",
        benchmarkData: [
          { metric: "シードステージのMRR", value: "$0 - $10K / month", source: "SaaS Capital 2025" },
          { metric: "シリーズAステージのMRR", value: "$10K - $100K / month", source: "SaaS Capital 2025" },
          { metric: "成長ステージのMRR", value: "$100K - $1M+ / month", source: "SaaS Capital 2025" },
          { metric: "上位四分位の月次成長率（初期）", value: "15 - 20%", source: "KeyBanc 2025 SaaS Survey" },
          { metric: "中央値の月次成長率（拡大期）", value: "5 - 10%", source: "KeyBanc 2025 SaaS Survey" },
        ],
        faq: [
          { question: "SaaSスタートアップにとって良いMRRとは？", answer: "段階によって異なります。初期段階のスタートアップ（0〜10KドルのMRR）はプロダクトマーケットフィットに集中します。10K〜100KドルのMRRは牽引力を示し、100Kドル以上のMRRは拡大の兆候です。絶対的なMRRよりも成長率の方が重要です。初期段階では月次MRR成長率15〜20％を目指しましょう。" },
          { question: "無料トライアルユーザーをMRRに含めるべきですか？", answer: "いいえ。MRRには有料顧客のみを含めるべきです。無料トライアル、一時停止中のサブスクリプション、一時的な料金は除外してください。経常収益を生み出しているアクティブな有料加入者のみを含めてください。" },
          { question: "MRRとARRの違いは何ですか？", answer: "MRR（月次経常収益）は月単位の収益です。ARR（年次経常収益）はMRRに12を掛けたもので、年間実行率を表します。ARRはエンタープライズSaaS企業や投資家によって一般的に使用されています。" },
          { question: "MRR成長率はどのように計算しますか？", answer: "MRR成長率 =（今月のMRR - 先月のMRR）/ 先月のMRR × 100。これを毎月追跡して、会社の成長軌道を測定してください。" },
          { question: "純新規MRRとは何ですか？", answer: "純新規MRR = 新規MRR + 拡大MRR - 解約による損失MRR - 減少MRR。これは、新規顧客、アップグレード、ダウングレード、キャンセルなど、すべてのソースからの全体的なMRRの変化を反映しています。" },
          { question: "使用量ベースの課金をMRRに含めるべきですか？", answer: "はい、ただし平均化してください。使用量ベースのコンポーネントについては、過去3ヶ月の平均を使用して変動を平滑化し、より正確な経常的な視点を得てください。" },
          { question: "チャーンはMRRにどのような影響を与えますか？", answer: "チャーンはMRRを直接減少させます。新しいMRRとして1万ドルを獲得しても、チャーンで8千ドルを失うと、純新規MRRはわずか2千ドルになります。チャーンを1〜2％削減するだけで、純MRR成長を劇的に改善できます。" },
          { question: "MRRと収益の違いは何ですか？", answer: "MRRはサブスクリプションの経常収益のみを表します。総収益には、一時的な料金、プロフェッショナルサービス、ハードウェア販売、その他の非経常的な項目が含まれる場合があります。MRRは経常的なビジネスの健全性をより明確に示します。" },
          { question: "MRRとARPUの違いは何ですか？", answer: "MRR（月次経常収益）は全顧客からの総経常収益です。ARPU（ユーザーあたりの平均収益）は顧客あたりの平均収益です。ARPU × 顧客数 = MRR。ARPUは顧客あたりの価値を理解するのに役立ち、MRRは収益の全体像を示します。" },
          { question: "どのくらいの頻度でMRRを計算すべきですか？", answer: "MRRは少なくとも月次で計算する必要がありますが、トップパフォーマンスのSaaS企業は毎週またはリアルタイムで追跡しています。月次計算は取締役会への報告や投資家向けアップデートには十分ですが、週次追跡はトレンドを発見し変化により迅速に対応するのに役立ちます。" },
          { question: "指標としてのMRRの限界は何ですか？", answer: "MRRは顧客獲得コスト、収益性、またはキャッシュフローを考慮しません。顧客獲得コストが高すぎる場合、企業はMRRが高くても収益を上げられない可能性があります。完全な財務状況を把握するには、MRRを粗利益率、CAC、LTVなどの収益性指標と併用してください。" },
        ],
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
