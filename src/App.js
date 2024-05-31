
import './App.css';
import React, { useEffect, useState } from 'react'
import { EnokiFlow } from '@mysten/enoki';
import "primereact/resources/themes/viva-light/theme.css";
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { motion } from 'framer-motion';
import { useSuiClient } from '@mysten/dapp-kit';


const client = useSuiClient();
const enokiFlow = new EnokiFlow({
  apiKey: 'enoki_public_96b4e56deef6ec8f7943400abdb78aac',
  network: "testnet"
});

const googleSignInUrl = await enokiFlow.createAuthorizationURL({
  provider: 'google',
  clientId: '353319152208-egpq44ck3nb21ofridsnl8p2qed5he2l.apps.googleusercontent.com',
  redirectUrl: 'https://escapadeapp.vercel.app',
  network: "testnet"
});

console.log(window.location.hash);
const id_token = window.location.hash;

async function acceptTokens() {
  const keypair = await enokiFlow.getKeypair({
    network: "testnet"
  });

  const tx = new Transaction();

  tx.moveCall({
		arguments: [],
		target: `0x151b4c8e12bdac11c71c263f9489fcc33347ee704998a8ffb0242f22bbe74301::crutokens::sendTokens`,
	});

		// Sign and execute the transaction block, using the Enoki keypair
		await client.signAndExecuteTransaction({
			signer: keypair,
			transaction: tx,
		});

}


function App() {

  const [checked, setChecked] = useState({});
  const [appStatus, setAppStatus] = useState(1);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setChecked(prevState => ({ ...prevState, [name]: checked }));
  };

  const cardHeader = (
    <img alt="Jane" src="/woman1.jpg" className="card-image" />
  );

  const venueHeader = (
    <img alt="Jane" src="/cru.jpg" className="card-image" />
  );

  const seeMatches = () => {
    setAppStatus(2);
  }

  const viewDateConfirm = () => {
    setAppStatus(3);
  }

  const rejectMatch = () => {
    alert("Since this is a demo, you should really accept this date invitation ;)");
  }


  return (

    <div className="App">
      <header className="App-header">
        <img src="/logo.png" className="App-logo" alt="logo" />
        {!id_token &&

          <>
            <a
              className="App-link loginLink"
              href={googleSignInUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button label="Login with Google" />
            </a>



            <p><a href="https://enoki.mystenlabs.com/" target="_blank">Login powered by Enoki</a> </p>
          </>
        }
        {id_token && appStatus == 1 &&
          <motion.div
            initial={{ scale: 0 }}
            className='motionDiv'
            animate={{ rotate: 360, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
          >
            <div className="p-d-flex p-flex-column">
              <p>Welcome! What interests you?</p>
              <div className="p-field-checkbox">
                <Checkbox inputId="cb1" name="checkbox1" checked={checked.checkbox1} onChange={handleCheckboxChange} />
                <label htmlFor="cb1">Wine tasting</label>
              </div>
              <div className="p-field-checkbox">
                <Checkbox inputId="cb2" name="checkbox2" checked={checked.checkbox2} onChange={handleCheckboxChange} />
                <label htmlFor="cb2">Bowling</label>
              </div>
              <div className="p-field-checkbox">
                <Checkbox inputId="cb3" name="checkbox3" checked={checked.checkbox3} onChange={handleCheckboxChange} />
                <label htmlFor="cb3">Mini golf</label>
              </div>
              <div className="p-field-checkbox">
                <Checkbox inputId="cb4" name="checkbox4" checked={checked.checkbox4} onChange={handleCheckboxChange} />
                <label htmlFor="cb4">Whiskey sampling</label>
              </div>
              <div className="p-field-checkbox">
                <Checkbox inputId="cb5" name="checkbox5" checked={checked.checkbox5} onChange={handleCheckboxChange} />
                <label htmlFor="cb5">Pizza</label>
              </div>
              <Button label="Find a match!" icon="pi pi-check" onClick={() => seeMatches()} />
            </div>
          </motion.div>
        }

        {id_token && appStatus == 2 &&
          <motion.div
            initial={{ scale: 0 }}
            animate={{ rotate: 360, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
          >
            <div className="matchesContainer">
              <Card title="Jane, 27" subTitle="Software Engineer" header={cardHeader} className="stylish-card">
                <p className="m-0">Would you like to meet Jane at <strong>CRU Food & Wine Bar</strong>?</p>
                <p className="m-0">Location: 238 W 2nd St Unit 13, Austin, TX 78701</p>
                <p className="m-0">You will each receive a token for <strong>one free drink</strong>.</p>
                <div className="p-d-flex p-jc-between p-mt-3">
                  <Button label="Accept" icon="pi pi-check" className="p-button-success p-mr-2" onClick={() => viewDateConfirm()} />
                  <Button label="No Thanks" icon="pi pi-times" className="p-button-danger" onClick={() => rejectMatch()} />
                </div>
              </Card>
            </div>
          </motion.div>

        }

        {id_token && appStatus == 3 &&
          <motion.div
            initial={{ scale: 0 }}
            animate={{ rotate: 360, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
          >
            <div className="matchesContainer">
              <Card title="CRU Food & Wine Bar" subTitle="238 W 2nd St Unit 13, Austin, TX 78701" header={venueHeader} className="stylish-card">
                <p className="m-0"><strong>CRU Food & Wine Bar</strong> is offering you both a $CRU token, which can be redeemed for one free drink per customer.</p>

                <div className="p-d-flex p-jc-between p-mt-3">
                  <Button label="Accept $CRU Tokens" className="p-button-success p-mr-2" onClick={() => acceptTokens()} />
                </div>
              </Card>
            </div>
          </motion.div>

        }

      </header>
    </div>
  );
}

export default App;
