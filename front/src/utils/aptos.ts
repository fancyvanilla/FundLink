import { Account, Aptos, AccountAddress, AptosConfig, Network } from "@aptos-labs/ts-sdk";

// Initialize some stuff
const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
const COIN_STORE = `0x1::coin::CoinStore<${APTOS_COIN}>`;
const ressource_address ="0xd01eeb86013d09643ae8979b058f9b14cbfccbc5e11463b79518aabe20667d68"

// Setting up the client
const config = new AptosConfig({ network: Network.DEVNET });
const aptos = new Aptos(config);

export async function createAccount(pk) {
  const account: Account = Account.generate(pk);
  await fundAccount(account, 1);
  return account.accountAddress.toString();
}

async function fundAccount(account: Account, amount: number) {
  await aptos.fundAccount({
    accountAddress: account.accountAddress,
    amount: amount,
  });
}

export async function getAccountBalance(account: Account) {
  const accountBalance = await aptos.getAccountResource({
    accountAddress: account.accountAddress,
    resourceType: COIN_STORE,
  });
  const balance = Number(accountBalance.coin.value);
  return balance;
}

async function transferTokens(sender: Account, receiver: Account, amount: number) {
  const transaction = await aptos.transaction.build.simple({
    sender: sender.accountAddress,
    data: {
      function: "addrr::module-addr::transfer",
      functionArguments: [receiver.accountAddress, amount],
    },
  });
  const pendingTransaction = await aptos.signAndSubmitTransaction({
    signer: sender,
    transaction,
  });
  const executedTransaction = await aptos.waitForTransaction({ transactionHash: pendingTransaction.hash });
  console.log("Transaction hash:", executedTransaction.hash);
}

// DAO-specific functions

export async function voteForProject(account: Account, projectId: number) {
  const transaction = await aptos.transaction.build.simple({
    sender: account.accountAddress,
    data: {
      function: "dao::module::vote_for_project",
      functionArguments: [projectId],
    },
  });
  const pendingTransaction = await aptos.signAndSubmitTransaction({
    signer: account,
    transaction,
  });
  const executedTransaction = await aptos.waitForTransaction({ transactionHash: pendingTransaction.hash });
  console.log("Transaction hash:", executedTransaction.hash);
}

export async function submitProject(account: Account, projectDetails: any) {
  const transaction = await aptos.transaction.build.simple({
    sender: account.accountAddress,
    data: {
      function: "dao::module::submit_project",
      functionArguments: [projectDetails],
    },
  });
  const pendingTransaction = await aptos.signAndSubmitTransaction({
    signer: account,
    transaction,
  });
  const executedTransaction = await aptos.waitForTransaction({ transactionHash: pendingTransaction.hash });
  console.log("Transaction hash:", executedTransaction.hash);
}

export async function getProjects() {
  const projectsResource = await aptos.getAccountResource({
    accountAddress: AccountAddress.from("dao_module_address"),
    resourceType: "dao::module::ProjectStore",
  });
  return projectsResource.projects;
}



export const submitProposal= async (account,setTransactionInProgress,signAndSubmitTransaction,project) => {
    if (!account) return [];
    setTransactionInProgress(true);


    const transaction: InputTransactionData = {
        data:{
            function:`${ressource_address}::FundLink::propose_project`,
            functionArguments:[project]
        }
    };
    try{
        const response=await signAndSubmitTransaction(transaction);
        await aptos.waitForTransaction({ transactionHash:response.hash});
    }
    catch(err){
        console.log(err);
    }
    finally{
        setTransactionInProgress(false);
    }
}


export const vote= async (account,setTransactionInProgress,signAndSubmitTransaction,details) => {
    if (!account) return [];
    setTransactionInProgress(true);

    const transaction: InputTransactionData = {
        data:{
            function:`${ressource_address}::FundLink::vote_on_project`,
            functionArguments:[details]
        }
    };
    try{
        const response=await signAndSubmitTransaction(transaction);
        await aptos.waitForTransaction({ transactionHash:response.hash});
    }
    finally{
        setTransactionInProgress(false);
    }
}


export const stake= async (account,setTransactionInProgress,signAndSubmitTransaction,amount) => {
    if (!account) return [];
    setTransactionInProgress(true);

    const transaction: InputTransactionData = {
        data:{
            function:`${ressource_address}::FundLink::stake_tokens`,
            functionArguments:[amount]
        }
    };
    try{
        const response=await signAndSubmitTransaction(transaction);
        await aptos.waitForTransaction({ transactionHash:response.hash});
    }
    finally{
        setTransactionInProgress(false);
    }
}

export async function getUserResource(account: Account | string, resourceType: string) {
    try {
      const accountAddress = typeof account === 'string' 
        ? AccountAddress.from(account) 
        : account.accountAddress;
  
      const resource = await aptos.getAccountResource({
        accountAddress: accountAddress,
        resourceType: resourceType,
      });
  
      return resource;
    } catch (error) {
      console.error("Error fetching user resource:", error);
      return null;
    }
  }