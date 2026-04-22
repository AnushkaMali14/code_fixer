export const mockErrors = [];

export const getSimulationResponse = (code) => {
    const originalCode = code;
    const lines = originalCode.split('\n');
    const issues = [];
    
    // 1. DATA PREPARATION (Populate issues with fallback-safe values)
    const getLineNumber = (pattern) => {
        const index = lines.findIndex(line => pattern.test(line));
        return index !== -1 ? index + 1 : 1;
    };

    if (/\bsum\s*=\s*i\b/.test(code)) {
        issues.push({
            title: "Loop Accumulation Error",
            line: getLineNumber(/\bsum\s*=\s*i\b/),
            type: "Warning",
            meaning: "The accumulator variable 'sum' is being reset to the current value of 'i' in every loop iteration instead of being added to.",
            cause: "Used the assignment operator '=' instead of the addition assignment '+='.",
            recommendation: "Change '=' to '+=' to correctly accumulate the sum.",
            fix: "sum += i"
        });
    }

    if (/let\s+data\s*;/.test(code)) {
        issues.push({
            title: "Uninitialized Array Access",
            line: getLineNumber(/let\s+data\s*;/),
            type: "Error",
            meaning: "Accessing methods like .map() on an undefined variable will throw a TypeError.",
            cause: "The variable 'data' is declared but not initialized to a value (like []).",
            recommendation: "Initialize the variable to an empty array [] during declaration.",
            fix: "let data = [];"
        });
    }

    if (code.includes(".map(")) {
        issues.push({
            title: "Unsafe Array Mapping",
            line: getLineNumber(/\.map\(/),
            type: "Error",
            meaning: "Performing .map() on a variable that hasn't been verified as an array.",
            cause: "Lack of type checking before calling array methods.",
            recommendation: "Use Array.isArray() to verify the variable is an array before mapping.",
            fix: "const result = Array.isArray(data) ? data.map(...) : [];"
        });
    }

    if (/\/\s*0\b/.test(code)) {
        issues.push({
            title: "Division By Zero",
            line: getLineNumber(/\/\s*0/),
            type: "Error",
            meaning: "Illegal mathematical operation: division by zero.",
            cause: "Hardcoded denominator '0' in a division operation.",
            recommendation: "Ensure the divisor is non-zero before attempting division.",
            fix: "if (0 !== 0) { ... }"
        });
    }

    // Fail-safe if no issues found
    if (issues.length === 0) {
        issues.push({
            title: "No Issues Detected",
            line: 1,
            type: "Optimization",
            meaning: "No major issues found in the provided snippet.",
            cause: "Code logic appears valid based on current analysis rules.",
            recommendation: "No action needed.",
            fix: "No fix required"
        });
    }

    // 2. SEQUENTIAL TRANSFORMATION (ON SINGLE VARIABLE)
    let fixedCode = code;

    // STEP 1: Fix Loop bug
    fixedCode = fixedCode.replace(/\bsum\s*=\s*i\b/g, "sum += i");

    // STEP 2: Fix data initialization
    fixedCode = fixedCode.replace(/let\s+data\s*;/g, "let data = [];");

    // STEP 3: Fix map safety (Wrap assignment case)
    fixedCode = fixedCode.replace(
        /const\s+(\w+)\s*=\s*([a-zA-Z_$][\w$]*)\.map\((.*?)\);/g,
        (match, resultVar, arr, content) => {
            return `const ${resultVar} = Array.isArray(${arr}) ? ${arr}.map(${content}) : [];`;
        }
    );

    // STEP 4: Fix division by zero
    fixedCode = fixedCode.replace(
        /let\s+(\w+)\s*=\s*(\d+)\s*\/\s*0;/g,
        (match, varName, num) => {
            return `let ${varName};\nif (0 !== 0) {\n  ${varName} = ${num} / 0;\n} else {\n  console.warn("Division by zero avoided");\n  ${varName} = 0;\n}`;
        }
    );

    // STEP 5: Cleanup invalid artifacts
    fixedCode = fixedCode.replace(/\}\s*;/g, "}");

    // --- 3. SANITIZATION (ENFORCE DATA CONTRACT) ---
    const sanitizedIssues = issues.map(issue => ({
        title: issue.title || "Potential Issue Detected",
        line: issue.line || 1,
        type: issue.type || "Warning",
        meaning: issue.meaning || "No meaning provided",
        cause: issue.cause || "No cause available",
        recommendation: issue.recommendation || "No recommendation available",
        fix: issue.fix || "No fix available"
    }));

    const finalOutput = `Before:\n${originalCode}\n\nAfter:\n${fixedCode}`;

    return {
        issues: sanitizedIssues,
        finalFix: finalOutput,
        fix: finalOutput
    };
};
