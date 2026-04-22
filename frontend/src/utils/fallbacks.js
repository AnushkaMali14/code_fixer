export const clientFallbacks = {
    "TypeError: Cannot read property 'map' of undefined": {
        meaning: "You are trying to use .map() on an array that doesn't exist yet (it's undefined).",
        cause: "Usually happens because data from an API hasn't loaded yet.",
        solution: "Use optional chaining (data?.map) or provide an empty array default (data || []).",
        fixCode: "const items = data?.map(item => item.id) || [];",
        language: "JavaScript"
    },
    "IndentationError: expected an indented block": {
        meaning: "Python requires code blocks to be indented consistently.",
        cause: "Missing spaces after a colon (:) in a function or loop.",
        solution: "Add 4 spaces or a tab after the colon.",
        fixCode: "def my_func():\n    print('Hello World')",
        language: "Python"
    }
};

export const getFallbackResponse = (query) => {
    const lowercaseQuery = query.toLowerCase();
    for (const [key, val] of Object.entries(clientFallbacks)) {
        if (lowercaseQuery.includes(key.toLowerCase())) {
            return val;
        }
    }
    
    return {
        meaning: "Offline Explanation: Error detected but server is unreachable.",
        cause: "The application is currently in offline mode or the backend server is down.",
        solution: "Verify your internet connection and ensure the backend server is running on port 5000.",
        fixCode: "// Review your syntax near the error line\nconsole.log('Check this variable:', myVariable);",
        language: "Unknown (Offline)"
    };
};
