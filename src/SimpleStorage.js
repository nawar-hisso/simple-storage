import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  Container,
  TextField,
  Button,
  Typography,
  makeStyles,
} from "@material-ui/core";
import Token_ABI from "./configs/ERC20_ABI.json";
import Storage_ABI from "./configs/Storage_ABI.json";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
  },
  titleContainer: {
    margin: theme.spacing(3, 0, 2),
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
  },
  form: {
    margin: theme.spacing(3, 0),
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
  },
  textField: {
    flex: 2,
  },
  buttonContainer: { flex: 1, display: "flex", justifyContent: "flex-end" },
  typography: {
    flex: 1,
  },
  balance: {
    margin: theme.spacing(1, 0, 2),
  },
}));

const SimpleStorage = () => {
  // State to store the user's address
  const [address, setAddress] = useState("");
  // State to store the data stored on the contract
  const [data, setData] = useState("");
  // State to store the balance of the user's address
  const [balance, setBalance] = useState(0);
  const classes = useStyles();

  /**
   * @async
   * Function to get the user's address from ethereum provider
   */
  const getAddress = async () => {
    // Request the user wallet's address
    const addresses = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // Set the user's address in the component's state
    setAddress(addresses[0]);
  };

  /**
   * @async
   * Function to get the balance of the user's address
   */
  const getBalance = async () => {
    // Connect to the network by creating an instance of a new provider
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Create an instance of the ERC-20 token contract
    const contract = new ethers.Contract(
      "0x0000000000000000000000000000000000001010",
      Token_ABI,
      provider
    );

    // Call the balanceOf() function of the contract to get the user's balance
    let myBalance = await contract.balanceOf(address);
    myBalance = myBalance.toString();
    console.log(myBalance);
    // Format the balance to a number
    myBalance = Number(ethers.utils.formatUnits(myBalance, 18));
    // Update the balance state
    setBalance(myBalance);
  };

  /**
   * @async
   * A function to read data from the SimpleStorage contract
   */
  const readData = async () => {
    // Connect to the network by creating an instance of a new provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // Create an instance of the SimpleStorage contract
    const contract = new ethers.Contract(
      "0x5366B849A4b702F82E4746dBc8A32b4E674Fbd9A",
      Storage_ABI,
      provider
    );

    // Call the read function to get the current value of data
    contract.read().then((result) => {
      // Update the data state
      setData(result);
    });
  };

  /**
   * @async
   * Handle the form submit event and write data to the contract
   * @param {Event} event - The form submit event
   */
  const handleWrite = async (event) => {
    event.preventDefault();
    // Connect to the network by creating an instance of a new provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // Create an instance to the signer because the write function cannot be done by only the provider
    const signer = provider.getSigner();

    // Create an instance of the SimpleStorage contract using the signer
    const contract = new ethers.Contract(
      "0x5366B849A4b702F82E4746dBc8A32b4E674Fbd9A",
      Storage_ABI,
      signer
    );
    // Get the new data from the form
    const newData = event.target.data.value;

    // Call the write function to update the value of data on the contract
    // await contract.write(newData);
    contract.write(newData).then((txn) => console.log(txn.hash));
  };

  // Use effect hook to fetch the user's address and read data stored on the contract
  useEffect(() => {
    getAddress();
    readData();
  }, []);

  return (
    <Container maxWidth="sm" className={classes.container}>
      <div className={classes.titleContainer}>
        <Typography className={classes.typography} variant="h4">
          Simple Storage
        </Typography>
        <div className={classes.buttonContainer}>
          <Button variant="contained" color="primary" onClick={getBalance}>
            Get balance
          </Button>
        </div>
      </div>
      <form className={classes.form} onSubmit={handleWrite}>
        <TextField
          label="Enter new data"
          name="data"
          className={classes.textField}
          fullWidth
        />
        <div className={classes.buttonContainer}>
          <Button
            style={{ width: "90%" }}
            variant="contained"
            color="primary"
            type="submit"
          >
            Write
          </Button>
        </div>
      </form>
      <Typography variant="body1">
        Current data: <b>{data}</b>
      </Typography>
      <Typography variant="body1" className={classes.balance}>
        Metamask balance: <b>{balance}</b> Matic
      </Typography>
      <Typography variant="body1" className={classes.balance}>
        MetaMask address: <b>{address}</b>
      </Typography>
    </Container>
  );
};

export default SimpleStorage;
