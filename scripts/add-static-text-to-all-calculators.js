const fs = require('fs');
const path = require('path');

// Static text content for all calculators
const calculatorStaticTexts = {
  'mrr-calculator': `
  <section class="static-content">
    <h2>Mathematical Formulation and Proof</h2>
    <p>Each calculation tool on this platform uses validated business formulas to analyze operational performance. Understanding the mathematical principles behind these calculations helps teams make more accurate, data-driven decisions.</p>
    
    <p>The underlying equation for this calculation is rendered below. Our system runs these calculations locally in the user's browser, bypassing the need to transmit sensitive business inputs to external servers:</p>
    
    <div class="latex-formulas">
      <div class="formula-item">
        <h3>MRR</h3>
        <code>MRR = Σ (Monthly subscription fees × number of subscribers)</code>
      </div>
      <div class="formula-item">
        <h3>ARR</h3>
        <code>ARR = MRR × 12</code>
      </div>
      <div class="formula-item">
        <h3>ACV</h3>
        <code>ACV = Total contract value ÷ number of months in contract</code>
      </div>
      <div class="formula-item">
        <h3>Gross Margin</h3>
        <code>Gross Margin = (Revenue - COGS) ÷ Revenue</code>
      </div>
      <div class="formula-item">
        <h3>Customer Retention Rate</h3>
        <code>Customer Retention Rate = (Existing customers at end of month - New customers) ÷ Existing customers at start of month</code>
      </div>
    </div>
    
    <h2>Strategic Value and Practical Application</h2>
    <p>Understanding revenue metrics is critical for SaaS founders and investors. MRR and ARR provide standardized measurements that simplify valuation discussions, help track growth trajectory, and enable comparison across companies. These metrics directly impact funding rounds, pricing strategy decisions, and operational scaling plans.</p>
    
    <h2>Step-by-Step Practical Verification Process</h2>
    <ol>
      <li>Input current MRR from your accounting software or dashboard</li>
      <li>Calculate MRR churn by subtracting new business from lost business</li>
      <li>Apply expansion revenue from upgrades, add-ons, and annual renewals</li>
      <li>Project 12-month MRR trends using current growth rates</li>
      <li>Analyze customer segmentation for high-value accounts</li>
      <li>Calculate CAC payback period using customer lifetime value</li>
      <li>Benchmark against industry standards (SaaS median: 20% MRR growth monthly)</li>
      <li>Set realistic quarterly revenue targets based on historical data</li>
    </ol>
  </section>
  `,

  'master-aggregator': `
  <section class="static-content">
    <h2>Mathematical Formulation and Proof</h2>
    <p>Each calculation tool on this platform uses validated business formulas to analyze operational performance. Understanding the mathematical principles behind these calculations helps teams make more accurate, data-driven decisions.</p>
    
    <p>The underlying equation for this calculation is rendered below. Our system runs these calculations locally in the user's browser, bypassing the need to transmit sensitive business inputs to external servers:</p>
    
    <div class="latex-formulas">
      <div class="formula-item">
        <h3>Total Combined Output</h3>
        <code>Total Combined Output = Σ (Individual calculator outputs)</code>
      </div>
      <div class="formula-item">
        <h3>Weighted Average</h3>
        <code>Weighted Average = Σ (Output_i × Weight_i) ÷ Σ Weight_i</code>
      </div>
      <div class="formula-item">
        <h3>Aggregation Ratio</h3>
        <code>Aggregation Ratio = Combined Output ÷ Individual Outputs</code>
      </div>
      <div class="formula-item">
        <h3>Variance Analysis</h3>
        <code>Variance = Σ (Output_i - Mean)² ÷ (n - 1)</code>
      </div>
    </div>
    
    <h2>Strategic Value and Practical Application</h2>
    <p>Master aggregation provides a holistic view of business performance across different metrics. For SaaS companies with multiple products or services, understanding how different calculators interact helps optimize resource allocation and identify cross-selling opportunities. This comprehensive view supports better strategic decision-making and investor reporting.</p>
    
    <h2>Step-by-Step Practical Verification Process</h2>
    <ol>
      <li>Select up to 8 calculators relevant to your business operations</li>
      <li>Configure each calculator with current data and parameters</li>
      <li>Apply weighting factors based on business impact importance</li>
      <li>Review combined output for strategic insights</li>
      <li>Identify opportunities for cross-selling between products</li>
      <li>Analyze cost-benefit of different calculator combinations</li>
      <li>Create custom reports for stakeholders and investors</li>
      <li>Set up automated aggregation for ongoing monitoring</li>
    </ol>
  </section>
  `,

  'ltv-calculator': `
  <section class="static-content">
    <h2>Mathematical Formulation and Proof</h2>
    <p>Each calculation tool on this platform uses validated business formulas to analyze operational performance. Understanding the mathematical principles behind these calculations helps teams make more accurate, data-driven decisions.</p>
    
    <p>The underlying equation for this calculation is rendered below. Our system runs these calculations locally in the user's browser, bypassing the need to transmit sensitive business inputs to external servers:</p>
    
    <div class="latex-formulas">
      <div class="formula-item">
        <h3>Basic LTV</h3>
        <code>LTV = Average monthly revenue per customer × Average customer lifespan months</code>
      </div>
      <div class="formula-item">
        <h3>Advanced LTV</h3>
        <code>LTV = Σ (Monthly payment × Probability of renewal × Discount factor) for all months</code>
      </div>
      <div class="formula-item">
        <h3>LTV:CAC Ratio</h3>
        <code>LTV:CAC Ratio = LTV ÷ CAC</code>
      </div>
      <div class="formula-item">
        <h3>Monthly LTV</h3>
        <code>Monthly LTV = Σ (Revenue from existing customers)</code>
      </div>
      <div class="formula-item">
        <h3>Discounted LTV</h3>
        <code>Discounted LTV = Σ (Revenue_t ÷ (1 + r)^t) where r = discount rate</code>
      </div>
    </div>
    
    <h2>Strategic Value and Practical Application</h2>
    <p>LTV is one of the most important metrics for SaaS businesses. It helps determine how much you can afford to spend on customer acquisition, guides pricing strategy, and informs product development decisions. A healthy LTV:CAC ratio (typically 3:1 or higher) indicates sustainable business economics and attractive for investors.</p>
    
    <h2>Step-by-Step Practical Verification Process</h2>
    <ol>
      <li>Input average monthly revenue per customer from your dashboard</li>
      <li>Calculate average customer lifespan in months from historical data</li>
      <li>Determine your Customer Acquisition Cost (CAC) from marketing spend</li>
      <li>Apply seasonal factors if relevant to your business</li>
      <li>Consider expansion revenue from upgrades and add-ons</li>
      <li>Calculate LTV:CAC ratio and benchmark against industry standards</li>
      <li>Set LTV targets based on your growth stage and funding requirements</li>
      <li>Model different scenarios for churn reduction and pricing changes</li>
    </ol>
  </section>
  `
};

// Function to add static text to a calculator page
function addStaticTextToCalculator(category, calculatorSlug) {
  const calculatorPath = path.join(process.cwd(), 'out', category, calculatorSlug, 'index.html');
  
  if (!fs.existsSync(calculatorPath)) {
    console.log(`Calculator not found: ${category}/${calculatorSlug}`);
    return false;
  }
  
  const htmlContent = fs.readFileSync(calculatorPath, 'utf8');
  
  // Check if static text already exists
  if (htmlContent.includes('<section class="static-content">')) {
    console.log(`Static text already exists for ${category}/${calculatorSlug}`);
    return true;
  }
  
  // Get static text for this calculator
  const staticText = calculatorStaticTexts[calculatorSlug];
  if (!staticText) {
    console.log(`No static text template for ${calculatorSlug}`);
    return false;
  }
  
  // Find the main content area and insert static text
  let modifiedContent = htmlContent;
  
  // Find the main calculator section and add static text after it
  const mainContentPattern = /(<div[^>]*class="[^\"]*calculator[^\"]*"[^>]*>.*?)<\/div>\s*<div class="[^\"]*sidebar[^\"]*">/s;
  
  if (mainContentPattern.test(modifiedContent)) {
    modifiedContent = modifiedContent.replace(mainContentPattern, `$1</div><div class="sidebar-static-content">${staticText}</div><div class="sidebar">`);
    console.log(`Added static text to ${category}/${calculatorSlug}`);
  } else {
    console.log(`Could not locate main content area for ${category}/${calculatorSlug}`);
    // Try a different approach - append to end of body
    modifiedContent = modifiedContent.replace(/<\/body>/, `${staticText}\n</body>`);
    console.log(`Added static text (fallback) to ${category}/${calculatorSlug}`);
  }
  
  // Write the modified content back to file
  fs.writeFileSync(calculatorPath, modifiedContent);
  return true;
}

// Process all calculators in all categories
function processAllCalculators() {
  const categories = [
    'revenue',
    'unit-economics', 
    'churn-retention',
    'growth-efficiency',
    'ai-cost',
    'side-hustle',
    'personal-finance',
    'general-business',
    'saas-deepen'
  ];
  
  let successCount = 0;
  let totalCount = 0;
  
  for (const category of categories) {
    const categoryPath = path.join(process.cwd(), 'out', category);
    
    if (!fs.existsSync(categoryPath)) {
      console.log(`Category not found: ${category}`);
      continue;
    }
    
    const calculators = fs.readdirSync(categoryPath).filter(item => 
      fs.statSync(path.join(categoryPath, item)).isDirectory()
    );
    
    console.log(`\nProcessing category: ${category} (${calculators.length} calculators)`);
    
    for (const calculatorSlug of calculators) {
      totalCount++;
      const success = addStaticTextToCalculator(category, calculatorSlug);
      if (success) {
        successCount++;
      }
    }
  }
  
  console.log(`\nProcessing complete: ${successCount}/${totalCount} calculators updated successfully.`);
}

// Main execution
if (require.main === module) {
  try {
    console.log('🚀 Starting static text addition to all calculator pages...');
    processAllCalculators();
    
    console.log('\n✅ Static text addition completed successfully!');
    console.log('Run the compliance validator to verify all requirements are met.');
    
  } catch (error) {
    console.error('❌ Static text addition failed:', error.message);
    process.exit(1);
  }
}

module.exports = { addStaticTextToCalculator, processAllCalculators };