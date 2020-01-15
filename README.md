# Welcome!

## Hyperledger Fabric based Cross-Border Remittance

![Node Version](https://img.shields.io/badge/nodejs-%3E%3D%208.9.0-orange)
[![Twitter Url](https://img.shields.io/twitter/follow/heisunberg_?label=Contributor&style=social)](https://twitter.com/Heisunberg_?ref_src=twsrc%5Etfw)
[![Facebook Url](https://img.shields.io/twitter/url?label=Facebook&logo=facebook&logoColor=blue&style=social&url=https://www.facebook.com/heisunberg)](https://www.facebook.com/heisunberg)

### Setting up the Project

<img height="300px" src="ucp.png"
 alt="University logo" title="Ucp" align="right" />

#### Build Blockchain-Network:
  1. Please visit the [installation instructions](http://hyperledger-fabric.readthedocs.io/en/latest/install.html)
to ensure you have the correct prerequisites installed.
  1. Copy the bin folder containing hyperledger binaries and config files into **./remittance-network/**
  1. Execute the following commands to build the blockchain network
  
  ```bash
  
  # Please make sure you that are in the root directory of the project
  hamza@host:~$ cd remittance-network
  hamza@host:~$ ./startFabric.sh
  
  ```
  
  This shell script will automatically build the network for you with 2 organizations having 2 peers each (4 in total), 1 orderer and 1 CA's for each (2 in total).

#### Run the Node Server:
 1. Download node-modules in ./Server/routes folder
 1. Download node-modules in ./Server folder
 1. Generate identities by un-commenting the content in generateIdentities function
 1. Run the server form following commands
  
  ```bash
  
  hamza@host:~/remittance-network$ cd ../Server/
  hamza@host:~/Server$ node server.js
  ```
  
