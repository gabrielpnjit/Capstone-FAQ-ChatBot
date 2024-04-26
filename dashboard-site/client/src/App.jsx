import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import botActionGif from './bot-action.gif';

const App = () => {
  return (
    <div className="bg-gray-800 min-h-screen">
    <Navbar />
    <div className="px-4 pb-4 pt-4  bg-gray-800 grid grid-cols-3 gap-4" >
      <div className="grid grid-cols-2 col-span-3 gap-2">
        <div style={{ width: '740px' }} className="p-6 bg-gray-300 rounded-lg">
          <div className="text-left">
            <h5 className="font-sans-serif text-6xl font-semibold">
              Leverage the power of LLMs to answer your Capstone questions!
            </h5>
            <h4 className="pt-6">
              To start asking the bot questions use`/ask` and ask a question to get immediate answers!<br></br>
              The bot will respond with an answer and provide the sources that it found the answer from.<br></br><br/>
              Provide the bot feedback by selecting the `Good` or `Bad` buttons provided by the message.<br/>
              View the chat logs, as well as other details under the "View Logs" Tab of this website<br/><br/>
              Reduce asking questions you've already asked to avoid taking up time.<br></br><br></br>
              If you're interested in learning more about the project, visit the GitHub <a  style={{color: "#3B81F6"}}href="https://github.com/gabrielpnjit/Capstone-FAQ-ChatBot">here.</a><br/><br/>
              
            </h4>
          </div>        
        </div> 
        <div style={{ width: '650px' }} className="p-6 col-span-2 col-start-3 bg-gray-300 rounded-lg shadow-lg">
          <img src={botActionGif} alt="bot in action" className="rounded-lg"/>
        </div> 
      </div>
      <div className="p-6 bg-gray-300 col-span-1 rounded-lg ">
        <h3 style={{ width: '400px' }} className="font-semibold text-lg">Meet the Team</h3>
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
          -Reduce Moderator Workloads in discord.<br></br>
          -Provide answers for students.<br></br>
          -Streamline the learning process.<br></br>
          -Adaptable knowledge base<br></br>
        </h2>
      </div>
      <div className="p-6 bg-gray-300 rounded-lg">
        <h3 className="font-semibold text-lg">Details</h3>
        <h2 className="text-lg"> 
          -Mern Stack Website.<br></br>
          -Pinecone Vectore Database.<br></br>
          -Langserve Embedding API.<br></br>
          -Node JS Discord Bot.<br></br>
        </h2>
      </div>
    </div>
  </div>
  );
};
export default App;