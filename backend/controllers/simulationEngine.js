export const mockErrors = [
    {
        errorName: "TypeError: Cannot read property 'map' of undefined",
        language: "JavaScript",
        meaning: "You are trying to use the .map() function on something that doesn't exist (is undefined).",
        cause: "This usually happens when an API call hasn't finished yet, or a variable was never initialized as an array.",
        solution: "1. Check if the variable is defined before mapping.\n2. Initialize your state with an empty array.\n3. Use optional chaining (?.).",
        fixCode: "const data = items?.map(item => item.name) || [];"
    },
    {
        errorName: "ReferenceError: x is not defined",
        language: "JavaScript",
        meaning: "The variable 'x' has been used but it has not been declared with let, const, or var.",
        cause: "Variable is being accessed outside of its scope or was never created.",
        solution: "1. Check for typos in the variable name.\n2. Ensure the variable is declared before use.",
        fixCode: "const x = 10;\nconsole.log(x);"
    },
    {
        errorName: "IndentationError: expected an indented block",
        language: "Python",
        meaning: "Python relies on spaces/tabs to define code blocks. You missed an indentation.",
        cause: "Missing space after a colon (:) in a function, if-statement, or loop.",
        solution: "1. Add 4 spaces or a tab after the colon.\n2. Ensure consistency in spaces vs tabs.",
        fixCode: "def my_function():\n    print('Hello') # Indented with 4 spaces"
    },
    {
        errorName: "SyntaxError: Unexpected token",
        language: "JavaScript",
        meaning: "The JavaScript engine found a character or word where it didn't expect one.",
        cause: "Missing brackets, commas, or semicolons in the code.",
        solution: "1. Check the line mentioned in the error.\n2. Ensure all opened brackets are closed.",
        fixCode: "if (condition) {\n  // your code\n}"
    }
];

export const getSimulationResponse = (query) => {
    const lowercaseQuery = query.toLowerCase();
    const found = mockErrors.find(e => 
        lowercaseQuery.includes(e.errorName.toLowerCase()) || 
        lowercaseQuery.includes(e.language.toLowerCase())
    );

    if (found) return found;

    // Fallback Generic Response if no match is found
    return {
        errorName: "Generic Code Error",
        language: "Detected Automatically",
        meaning: "The system detected an issue in your code logic or syntax.",
        cause: "Possible causes include illegal operations, missing declarations, or incorrect logic flow.",
        solution: "1. Review the recently changed code.\n2. Check for syntax errors.\n3. Add console logs/print statements to debug.",
        fixCode: "// Review your logic near the highlighted line\nconsole.log('Debugging variable:', myVar);"
    };
};
