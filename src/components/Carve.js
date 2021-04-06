import React, {useEffect, useState} from 'react';
import { Button, Header, Image, Modal, Message, Icon, Segment } from 'semantic-ui-react';
import axios from 'axios';

function Carve(props) {

  const [open, setOpen] = useState(false);
  const [loading,setLoading] = useState(false);
  const [crvData, setCrvData] = useState({name:"",description:"",image_src:""});
  let [minted, setMinted] = useState(true);
  let [msg, setMsg] = useState("");
  const id = props.id; 
  const crv = props.crv;
  const tokenURL = "https://hidden-woodland-17457.herokuapp.com/api/nfts/id/".concat(id);

  async function loadData(){

    setMsg("");

        axios({
          method: 'get',
          url: tokenURL,   
          headers: {
              'Content-Type' : 'application/json'
            }
          })
        .then(function (response) {
            setCrvData(response.data);
            })
        .catch(function (error) {
          setMsg("Error Loading Token Data. Please try again!");
        });
     
    if(typeof(crv.methods) !=='undefined' && crv.methods !== null){  
      const isMinted = await crv.methods._isExists(id).call(); 
      setMinted(isMinted); 
    } 
  }

  useEffect(() => {  
    loadData();
  },[props.id, open]) 

  function mintToken(event){
    event.preventDefault();

    setLoading(true);

      crv.methods.mint(id).send({from:props.acc,value:"100000000000000000"})
      .once('confirmation', (confirmation) => {
        setLoading(false);
        setMinted(true);
        setMsg("Token minted successfully.");
      })
      .on('error', (error) => {
        setLoading(false);
        setMsg("Transaction failed. Try again!");
      });
   
  }

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button color="black" size="big" fluid>Load Art</Button>}
    >
      <Modal.Header> Art Id: {id} </Modal.Header>
      <Modal.Content image>
        <Image size='medium' src={crvData.image_src} wrapped />
        <Modal.Description>
          <Header>{crvData.name}</Header>
          <p>
            {crvData.description}
          </p>
        </Modal.Description>
      </Modal.Content>
      
      { (msg)?
        <Modal.Content>
        <Message>
          <Message.Header>{msg}</Message.Header>
        </Message>
        </Modal.Content>
        :(minted)?
        <Modal.Content>
        <Message>
          <Message.Header>Token already minted</Message.Header>
          <p>
           Please select another Id.
          </p>
        </Message>
        </Modal.Content>
        :loading?
          <Modal.Content>
          <Segment basic textAlign='center'>
          <Icon loading name='spinner' color='blue' size='big' /> 
          </Segment>
          </Modal.Content>
        :<Modal.Actions>
            <Button color='black' onClick={mintToken} >
              Mint Carved Token @ 0.1 ETH
            </Button>
        </Modal.Actions>
      }
      
    </Modal>
  )
}

export default Carve;
