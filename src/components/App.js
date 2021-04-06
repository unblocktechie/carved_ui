import React, { useEffect, useState} from 'react';
import Web3 from 'web3';
import Carve from './Carve';
import Carved from '../abis/Carved.json';
import { Segment, Input, Form, Message } from 'semantic-ui-react';

function App(props){
    const [inp, setInp] = useState(0);
    const [crv, setCrv] = useState({});
    const [acc,setAcc] = useState();
    let [msg, setMsg] = useState("");

    async function loadBlockchainData(){
        setMsg("");
        if(typeof window.ethereum!=='undefined'){
            const web3 = new Web3(window.ethereum);
            const netId = await web3.eth.net.getId();
            const accounts = await web3.eth.getAccounts();

            //load contracts
            const crvData = Carved.networks[netId];
      
            //load account
            if(typeof accounts[0] !=='undefined'){
                setAcc(accounts[0]);
                if(crvData) {
                    const crvd = new web3.eth.Contract(Carved.abi, crvData.address);
                    setCrv(crvd);
                } else {
                   setMsg('Carved contract not deployed to detected network.');
                }
            } else {
                const loadAcc = await window.ethereum.enable();
                setAcc(loadAcc[0]);
            }
      
        } else {
            setMsg('Please install MetaMask');
        }
        
    }

    useEffect(() => {  
        loadBlockchainData();
    },[acc,setAcc,crv]) 

    function handleChange(event){
        setInp(event.target.value);
    }
    
  return(
    <div className="main">

      <div className="mint">
     
      <Segment basic textAlign="center">
      <img src="./images/logo_carved_white.webp" alt="carved" width="300" />
      </Segment>
      
      <Segment basic textAlign="center">
      
        {(msg)&&
            <Message negative>
            <Message.Header>{msg}</Message.Header>
            </Message>
        }
            <Form>
            <Form.Field>
            {(typeof(acc) !=='undefined' && acc !== null)?
            <Input placeholder=" Enter Token Id (1 - 100) " onChange={handleChange} size="massive" fluid />
            :<Message negative>
              <Message.Header>Please Login To Metamask Wallet</Message.Header>
              </Message>
            }
            </Form.Field>
            <Form.Field>
            {
             (inp>0 && inp<101)
             &&<Carve id={inp} crv={crv} acc={acc} />
            }
            </Form.Field>
            </Form>
      </Segment>
      </div>
    </div>  
  );

}

export default App;