import { useState,useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


const Home = () => {

    const [problem,setProblems] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        const fetchProblems = async()=>{
            try{
                const response = await axios.get("/api/problem/getAllProblem")
                setProblems(response.data.problem);
                setLoading(false);
            } catch(error){
                console.log("Error in fetching problems", error);
                setLoading(false);
            }
        }
        fetchProblems();
    },[])
    
  return (
    
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8">
        <h1 className="text-5xl font-bold text-purple-500 mb-4">CodeNest Problems</h1>
        <p className="text-xl text-gray-300 mb-8">Start solving and improve your DSA skills</p>
        {loading ? (
            <p className = "text-white"> Loading problems...</p>

        ) :(
            <div className="w-full max-w-4xl flex flex-col gap-4">
                {problem.map((prob) =>(
                    <div key={prob._id} className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-700 flex justify-between items-center hover:border-purple-500 transition" >
                        <div>
                            <h2 className="text-2xl font-semibold text-white">{prob.title}</h2>
                            <div className="flex gap-2 mt-2">
                                
                                <span className={`px-3 py-1 rounded text-sm ${prob.difficulty === 'Easy' ? 'bg-green-900 text-green-300' : prob.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300'}`}>
                                    {prob.difficulty}
                                </span>
                                
                                {prob.tags.map((tag) => (
                                    <span key = {tag} className="px-3 py-1 bg-gray-800 text-gray-400 rounded text-sm">{tag}</span>
                                ))}
                            </div>  
                        </div>
                        <Link to={`/problem/${prob._id}`} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition text-center">
                                Solve
                        </Link>
                    </div>
                ))}
            </div>
        )}
        

    </div>

  )
}


export default Home;
