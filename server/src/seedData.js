const problems = [
    {
        title: "Two Sum",
        description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
        difficulty: "Easy",
        tags: ["array", "hashmap"],
        visibleTestCases: [
            {
                input: "4\n2 7 11 15\n9",
                output: "0 1",
                explanation: "Because nums[0] + nums[1] == 9, we return 0 1."
            },
            {
                input: "3\n3 2 4\n6",
                output: "1 2",
                explanation: "Because nums[1] + nums[2] == 6, we return 1 2."
            }
        ],
        hiddenTestCases: [
            { input: "2\n3 3\n6", output: "0 1" },
            { input: "5\n-1 -2 -3 -4 -5\n-8", output: "2 4" }
        ],
        startCode: [
            {
                language: "c++",
                initialCode: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}"
            },
            {
                language: "java",
                initialCode: "import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}"
            },
            {
                language: "javascript",
                initialCode: "const fs = require('fs');\nconst input = fs.readFileSync('/dev/stdin').toString().trim().split('\\n');\n// Write your code here"
            }
        ],
        referenceSolution: [
            {
                language: "c++",
                completeCode: "#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    int n; if(!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for(int i=0; i<n; i++) cin >> nums[i];\n    int target; cin >> target;\n    unordered_map<int, int> mp;\n    for(int i=0; i<n; i++) {\n        if(mp.count(target - nums[i])) {\n            cout << mp[target - nums[i]] << \" \" << i << endl;\n            return 0;\n        }\n        mp[nums[i]] = i;\n    }\n    return 0;\n}"
            },
            {
                language: "java",
                completeCode: "import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for(int i=0; i<n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        HashMap<Integer, Integer> map = new HashMap<>();\n        for(int i=0; i<n; i++) {\n            if(map.containsKey(target - nums[i])) {\n                System.out.println(map.get(target - nums[i]) + \" \" + i);\n                return;\n            }\n            map.put(nums[i], i);\n        }\n    }\n}"
            },
            {
                language: "javascript",
                completeCode: "const fs = require('fs');\nconst input = fs.readFileSync('/dev/stdin').toString().trim().split('\\n');\nif(input.length < 3) return;\nconst n = parseInt(input[0]);\nconst nums = input[1].split(' ').map(Number);\nconst target = parseInt(input[2]);\nconst map = new Map();\nfor(let i=0; i<n; i++) {\n    if(map.has(target - nums[i])) {\n        console.log(`${map.get(target - nums[i])} ${i}`);\n        return;\n    }\n    map.set(nums[i], i);\n}"
            }
        ]
    },
    {
        title: "Reverse String",
        description: "Write a function that reverses a string. The input string is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.",
        difficulty: "Easy",
        tags: ["string"],
        visibleTestCases: [
            {
                input: "hello",
                output: "olleh",
                explanation: "The reversed string of 'hello' is 'olleh'."
            }
        ],
        hiddenTestCases: [
            { input: "Hannah", output: "hannaH" },
            { input: "a", output: "a" }
        ],
        startCode: [
            {
                language: "c++",
                initialCode: "#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}"
            },
            {
                language: "java",
                initialCode: "import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}"
            },
            {
                language: "javascript",
                initialCode: "const fs = require('fs');\nconst input = fs.readFileSync('/dev/stdin').toString().trim();\n// Write your code here"
            }
        ],
        referenceSolution: [
            {
                language: "c++",
                completeCode: "#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s; cin >> s;\n    int left = 0, right = s.length() - 1;\n    while(left < right) {\n        swap(s[left], s[right]);\n        left++; right--;\n    }\n    cout << s << endl;\n    return 0;\n}"
            },
            {
                language: "java",
                completeCode: "import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(!sc.hasNext()) return;\n        char[] s = sc.next().toCharArray();\n        int left = 0, right = s.length - 1;\n        while(left < right) {\n            char temp = s[left];\n            s[left] = s[right];\n            s[right] = temp;\n            left++; right--;\n        }\n        System.out.println(new String(s));\n    }\n}"
            },
            {
                language: "javascript",
                completeCode: "const fs = require('fs');\nlet s = fs.readFileSync('/dev/stdin').toString().trim().split('');\nlet left = 0, right = s.length - 1;\nwhile(left < right) {\n    let temp = s[left];\n    s[left] = s[right];\n    s[right] = temp;\n    left++; right--;\n}\nconsole.log(s.join(''));"
            }
        ]
    }
];

// Helper function to programmatically generate more problems
const generateBulkProblems = () => {
    const bulk = [];
    const topics = ['array', 'linkedlist', 'graph', 'dp', 'tree', 'math', 'greedy', 'binarysearch', 'stack', 'queue'];
    
    // Generating 5 problems for each of the 10 topics (Total 50)
    topics.forEach((topic) => {
        for(let i=1; i<=5; i++) {
            bulk.push({
                title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Practice ${i}`,
                description: `This is a generated practice problem ${i} for the topic: ${topic}.\n\nGiven an integer N, print it back.`,
                difficulty: i <= 2 ? "Easy" : (i <= 4 ? "Medium" : "Hard"),
                tags: [topic],
                visibleTestCases: [
                    { input: "10", output: "10", explanation: "Output is same as input." }
                ],
                hiddenTestCases: [
                    { input: "42", output: "42" },
                    { input: "99", output: "99" }
                ],
                startCode: [
                    { language: "c++", initialCode: "#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Write code\n    return 0;\n}" },
                    { language: "java", initialCode: "import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // Write code\n    }\n}" },
                    { language: "javascript", initialCode: "const fs = require('fs');\nconst input = fs.readFileSync('/dev/stdin').toString().trim();\n// Write code" }
                ],
                referenceSolution: [
                    { language: "c++", completeCode: "#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    if(cin >> n) cout << n << endl;\n    return 0;\n}" },
                    { language: "java", completeCode: "import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) System.out.println(sc.nextInt());\n    }\n}" },
                    { language: "javascript", completeCode: "const fs = require('fs');\nconst input = fs.readFileSync('/dev/stdin').toString().trim();\nif(input) console.log(input);" }
                ]
            });
        }
    });
    return bulk;
};

// Combine 2 real crafted problems + 50 generated ones
const allProblems = [...problems, ...generateBulkProblems()];

module.exports = allProblems;
