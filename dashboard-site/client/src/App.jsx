import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="w-full p-6">
      <Navbar />
      
      <div className="flex justify-center items-center mx-4 space-x-4">
        <div className="p-6 w-96 bg-gray-300 rounded-lg w">
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
        </div> {/* Gray panel */}
        <div className="flex-grow p-6 bg-white rounded-lg shadow-lg">
          INSERT GIF OF BOT IN ACTION HERE, just put bot-action.gif in the directory
          <img src="bot-action.gif"></img>
        </div> {/* White panel with shadow */}
      </div>
      <div className="flex justify-center items-center mx-4 space-x-4 mt-8">
        {/* Meet the Team Box */}
        <div className="p-6 w-96 bg-gray-300 rounded-lg">
          <h3 className="font-semibold text-lg">Meet the Team</h3>
          <h2 className="text-lg">
            Gabriel Pascual<br></br>
            Zachary Gonzalez<br></br>
            Myerthra<br></br>
            Neel<br></br>
            Arij<br></br>

</h2>
        </div>
  
        {/* Goals Box */}
        <div className="p-6 w-96 bg-gray-300 rounded-lg">
          <h3 className="font-semibold text-lg">Goals</h3>
          <h2 className="text-lg">
            Reduce Moderator Workloads in discord.<br></br>
            Provide answers for students.<br></br>
            Streamline the learning process.<br></br>
            Adaptable knowledge base<br></br>

</h2>
        </div>
  
        {/* Details Box */}
        <div className="p-6 w-96 bg-gray-300 rounded-lg">
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