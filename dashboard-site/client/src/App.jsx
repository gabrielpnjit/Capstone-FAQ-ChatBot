import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import botActionGif from './bot-action.gif';

const App = () => {
  return (
    <div className="bg-gray-800 min-h-screen">
    <Navbar />
    <div className="px-4 pb-4 pt-4  bg-gray-800 grid grid-cols-3 gap-4" >
      <div className="grid grid-cols-2 col-span-3 gap-2" style={{ gridTemplateColumns: 'minmax(0, 1fr) 0px' }}>
        <div className="p-6 bg-gray-300 rounded-lg">
          <div className="text-left">
            <h5 className="font-sans-serif text-5xl font-semibold">
              Leverage the power of RAG and LLMs to answer your Capstone questions!
            </h5>
            <h4 className="pt-6 text-lg">
              To start asking the bot questions use`/ask` and ask a question to get immediate answers!
              The bot will respond with an answer and provide the sources that it found the answer from.<br></br><br/>
              Provide the bot feedback by selecting the `Good` or `Bad` buttons provided by the message.<br/>
              View the chat logs, as well as other details under the "View Logs" Tab of this website.<br/><br/>
              If you're interested in learning more about the project, visit the GitHub <a  style={{color: "#3B81F6"}}href="https://github.com/gabrielpnjit/Capstone-FAQ-ChatBot">here.</a><br/><br/>
              
            </h4>
          </div>        
        </div> 
        <div style={{ width: '650px' }} className="p-6 col-span-2 col-start-3 bg-gray-300 rounded-lg shadow-lg">
          <img src={botActionGif} alt="bot in action" className="rounded-lg"/>
        </div> 
      </div>
      <div className="p-6 bg-gray-300 col-span-1 rounded-lg ">
        <h3 style={{ width: '400px' }} className="font-semibold text-3xl">Meet the Team</h3>
        <h2 className="text-xl">
          Gabriel Pascual<br></br>
          Zachary Gonzalez<br></br>
          Mythreya Vangapandu<br></br>
          Neel Patil<br></br>
          Arij Qureshi<br></br>
        </h2>
      </div>
      <div className="p-6 bg-gray-300 rounded-lg">
        <h3 className="font-semibold text-3xl">Goals</h3>
        <h2 className="text-xl">
          -Reduce moderator workloads in Discord<br></br>
          -Provide answers for students<br></br>
          -Manage knowledge base<br></br>
          -View bot logs<br></br>
        </h2>
      </div>
      <div className="p-6 bg-gray-300 rounded-lg">
        <h3 className="font-semibold text-3xl">Details</h3>
        <h2 className="text-xl"> 
          -MERN Stack Website<br></br>
          -OpenAI Embeddings<br></br>
          -GPT-3.5 Turbo LLM<br></br>
          -Cohere Reranker<br></br>
          -Pinecone Vector Database<br></br>
          -LangChain Framework<br></br>
          -Discord.js Discord Bot<br></br>
        </h2>
      </div>
    </div>
  </div>
  );
};
export default App;
