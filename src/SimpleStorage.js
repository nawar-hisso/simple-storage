import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
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

const SimpleStorage = (props) => {
  const [address, setAddress] = useState("");
  const [data, setData] = useState("");
  const [balance, setBalance] = useState(0);
  const classes = useStyles();

  const getBalance = async () => {
    console.log("balance");
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const contract = new ethers.Contract(
      "0x0000000000000000000000000000000000001010",
      Token_ABI,
      provider
    );

    let myBalance = await contract.balanceOf(address);
    myBalance = myBalance.toString();
    console.log(myBalance);
    myBalance = Number(ethers.utils.formatUnits(myBalance, 18));
    setBalance(myBalance);
  };

  useEffect(() => {
    const getAddress = async () => {
      const addresses = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAddress(addresses[0]);
    };

    getAddress();
  }, []);

  useEffect(() => {
    // Connect to the Ethereum network
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // Create an instance of the contract
    const contract = new ethers.Contract(
      "0x5366B849A4b702F82E4746dBc8A32b4E674Fbd9A",
      Storage_ABI,
      provider
    );

    // Call the read function to get the current value of data
    contract.read().then((result) => {
      setData(result);
    });
  }, []);

  const handleWrite = async (event) => {
    event.preventDefault();
    // Connect to the Ethereum network
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Create an instance of the contract
    const contract = new ethers.Contract(
      "0x5366B849A4b702F82E4746dBc8A32b4E674Fbd9A",
      Storage_ABI,
      signer
    );
    const newData = event.target.data.value;

    // Call the write function to update the value of data
    // await contract.write(newData);

    contract.write(newData).then((txn) => console.log(txn.hash));
  };

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
