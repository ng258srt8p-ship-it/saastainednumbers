const fs = require('fs');
const path = require('path');

class ComplianceValidator {
  constructor() {
    this.results = [];
    this.issues = [];
  }

  async validateAll() {
    console.log('🔍 Starting compliance validation...');
    
    const validations = [
      ['Word Count', () => this.validateWordCount()],
      ['Localization', () => this.validateLocalization()],
      ['Calculator Counts', () => this.validateCalculatorCounts()],
      ['Icon Rendering', () => this.validateIconRendering()],
      ['E-E-A-T Compliance', () => this.validateEATCompliance()]
    ];

    for (const [name, validateFn] of validations) {
      console.log(`Validating ${name}...`);
      try {
        const result = await validateFn();
        this.results.push({ name, ...result });
        if (!result.passed) {
          this.issues.push({ name, message: result.message });
        }
      } catch (error) {
        console.error(`❌ Validation failed for ${name}:`, error.message);
        this.issues.push({ name, message: `Validation error: ${error.message}` });
      }
    }

    this.generateReport();
    return this.issues.length === 0;
  }

  async validateWordCount() {
    const enFiles = this.getHtmlFiles('out/en');
    let totalWords = 0;
    let passedCount = 0;
    
    for (const file of enFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const textContent = this.extractTextContent(content);
      const wordCount = this.countWords(textContent);
      totalWords += wordCount;
      
      if (wordCount >= 800) {
        passedCount++;
      }
    }
    
    const averageWords = Math.floor(totalWords / enFiles.length);
    const passedPercentage = (passedCount / enFiles.length) * 100;
    
    return {
      passed: averageWords >= 800 && passedPercentage >= 90,
      message: `Average words per page: ${averageWords} (target: 800+), Pages passing: ${passedPercentage.toFixed(1)}%`,
      details: {
        totalPages: enFiles.length,
        averageWords: averageWords,
        pagesPassing: passedCount,
        totalWords: totalWords
      }
    };
  }

  async validateLocalization() {
    const ptPath = path.join(process.cwd(), 'i18n/pt/common.json');
    const ptContent = JSON.parse(fs.readFileSync(ptPath, 'utf8'));
    const hasPortuguese = this.checkForPortuguese(ptContent);
    
    return {
      passed: hasPortuguese,
      message: hasPortuguese ? 'Portuguese locale contains Portuguese text' : 'English text leakage in Portuguese locale',
      details: {
        hasPortuguese: hasPortuguese,
        fileSize: fs.statSync(ptPath).size
      }
    };
  }

  async validateCalculatorCounts() {
    const enFiles = this.getHtmlFiles('out/en');
    const ptFiles = this.getHtmlFiles('out/pt');
    
    const enMatches = this.extractCalculatorCounts(enFiles);
    const ptMatches = this.extractCalculatorCounts(ptFiles);
    
    const enConsistent = this.isConsistent(enMatches);
    const ptConsistent = this.isConsistent(ptMatches);
    
    return {
      passed: enConsistent && ptConsistent,
      message: `EN calculator count consistency: ${enConsistent ? '✅' : '❌'}, PT calculator count consistency: ${ptConsistent ? '✅' : '❌'}`,
      details: {
        enCounts: enMatches,
        ptCounts: ptMatches,
        enConsistent: enConsistent,
        ptConsistent: ptConsistent
      }
    };
  }

  async validateIconRendering() {
    const enFiles = this.getHtmlFiles('out/en');
    let iconIssues = 0;
    
    for (const file of enFiles) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('material-symbols-outlined') && !content.includes('<i class="material-symbols')) {
        iconIssues++;
      }
    }
    
    const passed = iconIssues === 0;
    
    return {
      passed: passed,
      message: passed ? 'No icon rendering issues detected' : `Icon rendering issues detected: ${iconIssues} files`,
      details: {
        totalFiles: enFiles.length,
        filesWithIssues: iconIssues
      }
    };
  }

  async validateEATCompliance() {
    const enFiles = this.getHtmlFiles('out/en');
    let etElements = 0;
    
    for (const file of enFiles) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('<div class="about-author') || content.includes('<div class="contact-info')) {
        etElements++;
      }
    }
    
    const passed = etElements >= 2;
    
    return {
      passed: passed,
      message: passed ? `E-E-A-T elements found (${etElements} pages have team attribution)` : 'Missing E-E-A-T compliance elements',
      details: {
        pagesWithEAElements: etElements,
        totalPages: enFiles.length
      }
    };
  }

  generateReport() {
    console.log('\n📊 Compliance Validation Report');
    console.log('==================================\n');
    
    let passedCount = 0;
    let totalCount = this.results.length;
    
    this.results.forEach((result, index) => {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      console.log(`${index + 1}. ${status} ${result.message}`);
      if (result.details) {
        console.log('   Details:', JSON.stringify(result.details, null, 2));
      }
      console.log();
      
      if (result.passed) passedCount++;
    });
    
    console.log(`Summary: ${passedCount}/${totalCount} validations passed`);
    
    if (passedCount === totalCount) {
      console.log('🎉 All compliance checks passed!');
    } else {
      console.log('⚠️  Some compliance checks failed. Issues:');
      this.issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.name}: ${issue.message}`);
      });
    }
  }

  getHtmlFiles(locale) {
    const baseDir = path.join(process.cwd(), 'out');
    
    if (locale === 'en') {
      return fs.readdirSync(baseDir)
        .filter(file => fs.statSync(path.join(baseDir, file)).isDirectory())
        .flatMap(dir => 
          fs.readdirSync(path.join(baseDir, dir))
            .filter(file => file.endsWith('.html'))
            .map(file => path.join(baseDir, dir, file))
        );
    }
    
    return [];
  }

  extractTextContent(html) {
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  countWords(text) {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  checkForPortuguese(obj) {
    let hasPortuguese = false;
    
    function traverse(obj, path = '') {
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (typeof value === 'string') {
          if (/[à-êñ-õø-ÿ]/.test(value)) {
            hasPortuguese = true;
          }
        } else if (typeof value === 'object') {
          traverse(value, currentPath);
        }
      });
    }
    
    traverse(obj);
    return hasPortuguese;
  }

  extractCalculatorCounts(files) {
    const counts = {};
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const calculatorCount = this.extractCalculatorCountFromContent(content);
      if (calculatorCount) {
        const category = this.extractCategoryFromPath(file);
        if (category) {
          counts[category] = (counts[category] || 0) + calculatorCount;
        }
      }
    }
    
    return counts;
  }

  extractCalculatorCountFromContent(content) {
    const patterns = [
      / calculators/g,
      / calculadoras/g,
      /calculator count/gi,
      /contadores de calculadoras/gi
    ];
    
    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) {
        return match.length;
      }
    }
    
    return null;
  }

  extractCategoryFromPath(filePath) {
    const pathParts = filePath.split('/');
    return pathParts[pathParts.length - 2];
  }

  isConsistent(counts) {
    const values = Object.values(counts);
    if (values.length === 0) return false;
    
    const uniqueValues = new Set(values);
    return uniqueValues.size === 1;
  }
}

if (require.main === module) {
  const validator = new ComplianceValidator();
  
  validator.validateAll()
    .then(isValid => {
      process.exit(isValid ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Validation process failed:', error.message);
      process.exit(1);
    });
}

module.exports = ComplianceValidator;