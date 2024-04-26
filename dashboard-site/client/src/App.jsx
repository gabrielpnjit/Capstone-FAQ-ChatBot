import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="bg-gray-800 min-h-screen">
    <Navbar />
    <div className="bg-gray-800 grid grid-cols-3 gap-4">
      <div className="p-6 col-span-1 bg-gray-300 rounded-lg">
        <div className="text-left">
          <h5 className="font-sans-serif text-2xl font-semibold">
            Leverage the power of LLMs to answer your Capstone questions!
          </h5>
          <h4 className="pt-6">
            Use /ask and ask a question to get immediate answers!<br></br>
            Reduce Repeat Questions taking up time.<br></br>
            Uses an AI to respond with reliable results.<br></br>
          </h4>
        </div>        
      </div> 
      <div className="p-6 col-span-2 bg-gray-300 rounded-lg shadow-lg">
        <img src="bot-action.gif" alt="bot in action"/>
      </div> 
    
      <div className="p-6 bg-gray-300 rounded-lg">
        <h3 className="font-semibold text-lg">Meet the Team</h3>
        <h2 className="text-lg">
          Gabriel Pascual<br></br>
          Zachary Gonzalez<br></br>
          Mythreya Vangapandu<br></br>
          Neel Patil<br></br>
          Arij Qureshi<br></br>
        </h2>
      </div>
      <div className="p-6 bg-gray-300 rounded-lg">
        <h3 className="font-semibold text-lg">Goals</h3>
        <h2 className="text-lg">
          Reduce Moderator Workloads in discord.<br></br>
          Provide answers for students.<br></br>
          Streamline the learning process.<br></br>
          Adaptable knowledge base<br></br>
        </h2>
      </div>
      <div className="p-6 bg-gray-300 rounded-lg">
        <h3 className="font-semibold text-lg">Details</h3>
        <h2 className="text-lg"> 
          Mern Stack Website.<br></br>
          Pinecone Vectore Database.<br></br>
          Langserve Embedding API.<br></br>
          Node JS Discord Bot.<br></br>
          </h2>
        </div>
      </div>
     
    </div>
  );
};
export default App;