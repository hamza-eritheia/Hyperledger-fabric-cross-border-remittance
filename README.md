###Setting up the Project

##To run the blockchain-network:
  Please visit the [installation instructions](http://hyperledger-fabric.readthedocs.io/en/latest/install.html)
to ensure you have the correct prerequisites installed.
  Copy the bin folder containing hyperledger binaries and config files into ./remittance-network/
  Execute the following commands to build the blockchain network
  
  ```bash
  
  # Please make sure you that are in the root directory of the project
  hamza@host:~$ #cd remittance-network
  hamza@host:~$ #./startFabric.sh
  ```
  
  This shell script will automatically build the network for you with 2 organizations having 2 peers each (4 in total), 1 orderer and 1 CA's for each (2 in total).

##To run the server:
  Download node-modules in ./Server/routes folder
  Download node-modules in ./Server folder
  Generate identities by un-commenting the content in generateIdentities function
  Run the server form following commands //by executing server.js node file in ./Server folder
  
  ```bash
  
  hamza@host:~/remittance-network$ cd ../Server
  hamza@host:~/Server$ node server.js
  ```
