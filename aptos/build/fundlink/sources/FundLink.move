module AppAddr::FundLink {
    use std::signer;
    use std::vector;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::account;
    use aptos_framework::resource_account;
    use std::string::{String};
    use std::timestamp; 
    use std::option;

    /// Custom errors
    const E_NOT_INITIALIZED: u64 = 0;
    const E_ALREADY_INITIALIZED: u64 = 1;
    const E_NOT_ENOUGH_BALANCE: u64 = 2;
    const E_PROJECT_NOT_FOUND: u64 = 3;
    const E_ALREADY_VOTED: u64 = 4;
    const E_NOT_ENOUGH_VOTES: u64 = 5;
    const E_NOT_RESOURCE_ACCOUNT: u64 = 6;
    const E_PROJECT_NOT_PENDING: u64 = 7;
    const E_NO_COIN_STORE: u64 = 8;
    const E_NOT_ADMIN_ACCOUNT: u64 = 9;


    /// Structs
    struct DAOConfig has key {
        signer_cap: account::SignerCapability,
        total_staked: u64,
        voting_threshold: u64,
        proposal_fee: u64,
        voting_period: u64,
    }

    struct UserStake has key {
        amount: u64,
        voting_power: u64,
    }

    struct Project has key, store {
        id: u64,
        creator: address,
        title: String,
        description: String,
        funding_goal: u64,
        votes_for: u64,
        votes_against: u64,
        status: u8, // 0: Pending, 1: Approved, 2: Rejected, 3: Funded, 4: Completed
        funding_received: u64,
        ddl: u64, // Deadline timestamp
    }

    struct ProjectVote has key,store {
        project_id: u64,
        vote_type: bool, // true for vote_for, false for vote_against
    }

    struct InvestorProjectInfo has key, store {
        project_id: u64,
        vote_type: bool,
        project_status: u8,
    }

    struct InvesterWallet has key {
        projects: vector<InvestorProjectInfo>,
    }

    struct ProjectStore has key {
        projects: vector<Project>,
        next_project_id: u64,
    }

    /// Initialize the DAO
    fun init_module(resource_signer: &signer) {
        let resource_signer_cap = resource_account::retrieve_resource_account_cap(resource_signer, @source_addr);
        let resource_address = signer::address_of(resource_signer);

        move_to(resource_signer, DAOConfig {
            signer_cap: resource_signer_cap,
            total_staked: 0,
            voting_threshold:2,
            proposal_fee:100,
            voting_period:604800,
        });

        move_to(resource_signer, ProjectStore {
            projects: vector::empty(),
            next_project_id: 0,
        });

        if (!coin::is_account_registered<AptosCoin>(resource_address)) {
            coin::register<AptosCoin>(resource_signer);
        };
    }

    /// Stake tokens to get voting power
    public entry fun stake_tokens(account: &signer, amount: u64) acquires DAOConfig, UserStake {
        if (!coin::is_account_registered<AptosCoin>(signer::address_of(account))) {
            coin::register<AptosCoin>(account);
        };
        let addr = signer::address_of(account);
        assert!(coin::balance<AptosCoin>(addr) >= amount, E_NOT_ENOUGH_BALANCE);

        if (!exists<UserStake>(addr)) {
            move_to(account, UserStake { amount: 0, voting_power: 0 });
        };

        let user_stake = borrow_global_mut<UserStake>(addr);
        user_stake.amount = user_stake.amount + amount;
        user_stake.voting_power = user_stake.voting_power + amount;

        let config = borrow_global_mut<DAOConfig>(@AppAddr);
        config.total_staked = config.total_staked + amount;

        coin::transfer<AptosCoin>(account, @AppAddr, amount);
    }

    /// Unstake tokens
    public entry fun unstake_tokens(account: &signer, amount: u64) acquires DAOConfig, UserStake {
        let addr = signer::address_of(account);
        assert!(exists<UserStake>(addr), E_NOT_INITIALIZED);

        let user_stake = borrow_global_mut<UserStake>(addr);
        assert!(user_stake.amount >= amount, E_NOT_ENOUGH_BALANCE);

        user_stake.amount = user_stake.amount - amount;
        user_stake.voting_power = user_stake.voting_power - amount;

        let config = borrow_global_mut<DAOConfig>(@AppAddr);
        config.total_staked = config.total_staked - amount;

        let resource_signer = account::create_signer_with_capability(&config.signer_cap);

        coin::transfer<AptosCoin>(&resource_signer, addr, amount);
    }

    /// Propose a new project
    public entry fun propose_project(account: &signer, description: String, title:String, funding_goal: u64) acquires ProjectStore, DAOConfig {
        if (!coin::is_account_registered<AptosCoin>(signer::address_of(account))) {
            coin::register<AptosCoin>(account);
        };

        let creator = signer::address_of(account);
        
        let config = borrow_global<DAOConfig>(@AppAddr);
        
        // Check if the user has enough balance to pay the proposal fee
        assert!(coin::balance<AptosCoin>(creator) >= config.proposal_fee, E_NOT_ENOUGH_BALANCE);

        // Transfer the proposal fee
        coin::transfer<AptosCoin>(account, @AppAddr, config.proposal_fee);

        let project_store = borrow_global_mut<ProjectStore>(@AppAddr);

        let new_project = Project {
            id: project_store.next_project_id,
            creator,
            title,
            description,
            funding_goal,
            votes_for: 0,
            votes_against: 0,
            status: 0, // Pending
            funding_received: 0,
            ddl: timestamp::now_seconds() + config.voting_period, 
    };

        vector::push_back(&mut project_store.projects, new_project);
        project_store.next_project_id = project_store.next_project_id + 1;
    }

    /// Vote on a project
    public entry fun vote_on_project(account: &signer, project_id: u64, vote_for: bool) acquires UserStake, ProjectStore, InvesterWallet,DAOConfig {
        let addr = signer::address_of(account);
        let user_stake = borrow_global<UserStake>(addr);

        let config = borrow_global<DAOConfig>(@AppAddr);
        let project_store = borrow_global_mut<ProjectStore>(@AppAddr);
        let project = get_project(&mut project_store.projects,project_id);
        assert!(project.status == 0, E_PROJECT_NOT_PENDING);

        if (vote_for) {
            project.votes_for = project.votes_for + user_stake.voting_power;
        } else {
            project.votes_against = project.votes_against + user_stake.voting_power;
        };

        let vote = InvestorProjectInfo {
            project_id,
            vote_type: vote_for,
            project_status: project.status, // Store the current project status
        };

        if (!exists<InvesterWallet>(addr)) {
            move_to(account, InvesterWallet {
                projects: vector::empty(),
            })
        };
        let investor_wallet = borrow_global_mut<InvesterWallet>(addr);

        assert!(!vector::contains(&investor_wallet.projects, &vote), E_ALREADY_VOTED);
        vector::push_back(&mut investor_wallet.projects, vote);
    }
    /// Finalize voting on a project
  public entry fun finalize_project(account: &signer, project_id: u64) acquires DAOConfig, ProjectStore, InvesterWallet {
        let config = borrow_global<DAOConfig>(@AppAddr);
        assert!(signer::address_of(account) == @source_addr, E_NOT_ADMIN_ACCOUNT);

        let project_store = borrow_global_mut<ProjectStore>(@AppAddr);
        let project = get_approved_project(&mut project_store.projects,project_id);

        assert!(project.status == 0, E_PROJECT_NOT_PENDING);

        let current_time = timestamp::now_seconds();
        let voting_end_time = project.ddl;

        if (current_time > voting_end_time) {
            // Voting period ended
            if (project.votes_for >= config.voting_threshold && project.votes_for > project.votes_against) {
                project.status = 1; // Approved
            } else {
                project.status = 2; // Rejected
            };

            // Update the project status in investor wallets
            let investor_wallets = borrow_global_mut<InvesterWallet>(@AppAddr);
            let iter = &mut investor_wallets.projects;
            while (!vector::is_empty(iter)) {
                let vote = vector::pop_back(iter);
                if (vote.project_id == project_id) {
                    vote.project_status = project.status;
                    vector::push_back(iter, vote);
                } else {
                    vector::push_back(iter, vote);
                }
            };
        } else {
            // Voting period not ended yet, do nothing
        }
    }

    /// Fund an approved project
    public entry fun fund_project(account: &signer, project_id: u64) acquires ProjectStore, DAOConfig {
        let config = borrow_global<DAOConfig>(@AppAddr);
        assert!(signer::address_of(account) == @source_addr, E_NOT_ADMIN_ACCOUNT);

        let project_store = borrow_global_mut<ProjectStore>(@AppAddr);
        let project = get_approved_project(&mut project_store.projects,project_id);

        assert!(project.status == 1, E_NOT_ENOUGH_VOTES); // Must be approved

        assert!(coin::balance<AptosCoin>(@AppAddr) >= project.funding_goal, E_NOT_ENOUGH_BALANCE);

        let resource_signer = account::create_signer_with_capability(&config.signer_cap);
        coin::transfer<AptosCoin>(&resource_signer, project.creator, project.funding_goal); 
        project.status = 3; // Funded
        project.funding_received = project.funding_goal; // In the real world, the funding would happen in stages
    }

    /// Get an approved project from the projects vector
    fun get_approved_project(projects: &mut vector<Project>, project_id: u64): &mut Project {
        let projects_len = vector::length(projects);
        let i = 0;
        while (i < projects_len) {
            let project = vector::borrow_mut(projects, i);
            if (project.id == project_id && project.status == 1) {
                return project
            };
            i = i + 1;
        };
        abort E_PROJECT_NOT_FOUND
    }
     fun get_project(projects: &mut vector<Project>, project_id: u64): &mut Project {
        let projects_len = vector::length(projects);
        let i = 0;
        while (i < projects_len) {
            let project = vector::borrow_mut(projects, i);
            if (project.id == project_id) {
                return project
            };
            i = i + 1;
        };
        abort E_PROJECT_NOT_FOUND
    }

    /// Change the voting threshold
    public entry fun change_voting_threshold(account: &signer, new_threshold: u64) acquires DAOConfig {
        assert!(signer::address_of(account) == @source_addr, E_NOT_ADMIN_ACCOUNT);
        let config = borrow_global_mut<DAOConfig>(@AppAddr);
        config.voting_threshold = new_threshold;
    }
}
