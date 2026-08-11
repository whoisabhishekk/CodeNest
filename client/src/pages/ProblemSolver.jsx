import {useState,useEffect} from"react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Editor from '@monaco-editor/react';


const ProblemSlover = ()=>{
    const {id} = useParams();

    const [problemDetails,setProblemDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userCode,setUserCode] = useState("")

    useEffect(()=>{
        const fetchSingleProblem = async ()=>{
            try{
                const response = await axios.get(`/api/problem/problemById/${id}`);
                setProblemDetails(response.data.problem);
                setUserCode(response.data.problem.startCode[0]?.initialCode || "");
                setLoading(false);
            } catch(error) {
                console.error("Error fetching problem:", error);
                setLoading(false);
            }
        };

        fetchSingleProblem();
    },[id]);

    if(loading) return <div className="text-white text-center mt-20">Loading problem...</div>;
    if (!problemDetails) return <div className="text-white text-center mt-20">Problem not found!</div>;

    return(
        <div className="flex min-h-[90vh] text-white" >
            <div className="w-1/2 p-8 border-r border-gray-800 bg-[#0f0f0f]">

                {/* Left Side: Problem Description */}
                <h1 className="text-3xl font-bold mb-4">{problemDetails.title}</h1>
                <div className="mb-6 flex gap-2">
                    <span className="px-3 py-1 bg-gray-800 rounded text-sm">{problemDetails.difficulty}</span>
                </div>
                {/* Description yahan dikhega */}
                <div className="text-gray-300 whitespace-pre-wrap text-lg">
                    {problemDetails.description}
                </div>

            </div>
                {/* Right Side: Code Editor Area (Abhi ke liye khali box) */}
                <div className="w-1/2 p-4 bg-[#1e1e1e] flex flex-col">
                   {/* Upar ka Header (Dropdown aur Run button) */}
                <div className="flex justify-between items-center mb-4">
                    <select className="bg-gray-800 text-white px-3 py-1 rounded outline-none border border-gray-700">
                        <option value="javascript">JavaScript</option>
                        <option value="c++">C++</option>
                        <option value="java">Java</option>
                    </select>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-1 rounded font-medium transition">
                        Run Code
                    </button>
                </div>
                {/* Asli VS Code jaisa Editor */}
                <div className="flex-grow rounded overflow-hidden border border-gray-700">
                    <Editor
                        height="100%"
                        theme="vs-dark"
                        language="javascript"
                        value={userCode}
                        onChange={(value) => setUserCode(value)}
                        options={{
                            fontSize: 16,
                            minimap: { enabled: false }, // Side ka chota map band karne ke liye
                            scrollBeyondLastLine: false,
                        }}
                    />
                </div>
                </div>
            
        </div>
    )
}

export default ProblemSlover;